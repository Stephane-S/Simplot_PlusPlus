# http://www.sfu.ca/~carmean/phylip1.html

from Bio import SeqIO, AlignIO
from Bio.Align import AlignInfo, MultipleSeqAlignment
import pathlib
from lib.Bootscan.phylip_wrap import *
import os
import time
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt


class Bootscanning:
    def __init__(self, filepath, filetype, group_dict,consensus_threshold, progress_bar):
        self.consensus_threshold = consensus_threshold
        self.progress_bar = progress_bar
        self.group_dict = group_dict
        self.filepath = filepath
        self.consensus_dict = self.get_cons(filepath, filetype, group_dict)
        self.seq_length = self.get_seq_length()
        self.window_length = 200
        self.step = 20
        self.refseq = "SARS-CoV-2"
        self.bootstrap = 100
        self.tree_model = "Neighbor-Joining"
        self.distance_model = "F84"
        self.t_t = 2.0
        self.fake_id = {}
        self.group_list = self.make_group_list()
        self.refresh_rate = 100
        self.consense= False

        self.progress_bar.setValue(100)
        #print ("bootscanning instance created")

    def set_settings(self, settings_list):
        # list (bootstrap, tree_model, window, step, distance_model, t_t, refresh_rate) refer to this index
        self.bootstrap = settings_list[0]
        self.tree_model = settings_list[1]
        self.window_length = settings_list[2]
        self.step = settings_list[3]
        self.distance_model = settings_list[4]
        self.t_t = float(settings_list[5])
        self.refresh_rate = settings_list[6]
        self.consense = settings_list[7]
        #print ("new settings:  ", settings_list)

    def get_settings(self):
        settings_list = [self.bootstrap, self.tree_model, self.window_length, self.step, self.distance_model, self.t_t, self.refresh_rate, self.consense]
        #print("current settings:  ", settings_list)
        return settings_list

    def get_sequence_length(self):
        return self.seq_length

    def make_group_list(self):
        group_list = []
        for group in self.consensus_dict.keys():
            group = group.replace(" ", "_")
            group_list.append(str(group))

        return group_list

    def get_seq_length(self):
        length = 0
        for id, seq in self.consensus_dict.items():
            if length == 0:
                length = len(seq)
            else:
                if len(seq) != length:
                    print(id, " different length", len(seq))

        return length

    def get_cons(self, filepath, filetype, group_dict):
        i = 0
        for group_name, seq_list in group_dict.items():
            alignment = AlignIO.read(filepath, filetype)
            align = MultipleSeqAlignment([])

            for record in alignment:
                if record.id in seq_list:
                    #align.add_sequence(record.id, str(record.seq))
                    #todo
                    align.append(record)

            summary_align = AlignInfo.SummaryInfo(align)
            cons_seq = summary_align.dumb_consensus(threshold=self.consensus_threshold, ambiguous="?")

            group_dict[group_name] = str(cons_seq)
            self.progress_bar.setValue(i / len(group_dict) * 100)
            i+=1

        return group_dict

    def get_subseq_dict(self, start_pos):
        subseq_dict = {}
        for id, seq in self.consensus_dict.items():
            subseq_dict[id] = seq[start_pos:(start_pos+self.window_length)]

        self.write_cons_fasta(subseq_dict)
        self.fasta_to_phylip()

    def get_refseq(self):
        return self.refseq

    def get_group_dict(self):
        return self.group_dict

    def get_filepath(self):
        return self.filepath

    def write_cons_fasta(self, subseq_dict):
        outfile_path = pathlib.Path("lib/Bootscan/temp_data/cons.fas")
        with open(outfile_path, "w") as outfile:
            i = 0
            for id, seq in subseq_dict.items():
                id = id.replace(" ", "_")
                fake_id = "ID" + str(i)
                self.fake_id[fake_id] = id
                outfile.write(">" + fake_id + "\n" + str(seq) + "\n")
                i +=1

    def fasta_to_phylip(self):
        input_path = pathlib.Path("lib/Bootscan/temp_data/cons.fas")
        output_path = pathlib.Path("lib/Bootscan/infile.txt")
        records = SeqIO.parse(input_path, "fasta")
        SeqIO.write(records, output_path, "phylip")

    def remove_file(self, file):
        start_time = time.time()

        while True:
            if time.time() - start_time > 2:
                #todo trigger error for main.py
                break
            else:
                try:
                    os.remove(file)
                    break
                except PermissionError as e:
                    time.sleep(1 / 1000)

                except FileNotFoundError as e:
                    break

    def rename_file(self, old, new):
        start_time = time.time()

        while True:
            if time.time() - start_time > 3:
                #todo trigger error for main.py
                break
            else:
                try:
                    os.renames(old, new)
                    break

                except FileExistsError:
                    self.remove_file(new)

                except:
                    time.sleep(1 / 1000)



    def extract_ids_and_occurences(self, tree_set, occur,  ordered_species_list):
        ids_and_occurence_list = []
        # get indices of paired terminal species (".*.*") = [1,3]
        indices = [i for i, x in enumerate(tree_set) if x == "*"]
        for index in indices:
            # lookup the index-associated fake id given in the outfile and then match to self.fake_id to get real id
            species_id = self.fake_id[ordered_species_list[int(index)]]
            ids_and_occurence_list.append(species_id)
        ids_and_occurence_list.append(occur)

        return (ids_and_occurence_list)

    def fill_result_dict(self, result_list, result_dict, start_pos):
        iter = int(start_pos + (self.window_length/2))  # used for x axis position in plot matrix
        comp_list = []  # lazy var to compare list type

        if iter in result_dict[result_list[0]]:
            temp_list = result_dict[result_list[0]][iter]

            if type(temp_list[0]) == type(comp_list):
                temp_list.append(list(result_list[1:3]))
                items_list = temp_list
            else:
                items_list = [temp_list, list(result_list[1:3])]

        else:
            items_list = result_list[1:3]

        result_dict[result_list[0]][iter] = items_list


        if iter in result_dict[result_list[1]]:
            temp_list = result_dict[result_list[1]][iter]

            if type(temp_list[0]) == type(comp_list):
                temp_list.append(list([result_list[0], result_list[2]]))
                items_list = temp_list
            else:
                items_list = [temp_list, list([result_list[0], result_list[2]])]
        else:
            items_list = list([result_list[0], result_list[2]])

        result_dict[result_list[1]][iter] = items_list
        return result_dict


    def extract_query_data(self, start_pos, sets_dict, ordered_species_list, result_dict):
        # sets_dict: {'...**....': '100.00', '.......**': '100.00', '.**......': '98.00', '.....**..': '4.00'}
        # ordered_species_list: ['ID3', 'ID6', 'ID1', 'ID5', 'ID4', 'ID2', 'ID7', 'ID8', 'ID0']
        iter = int(start_pos + (self.window_length / 2))
        for tree_set, occur in sets_dict.items():
            ids_and_occurence_list = self.extract_ids_and_occurences(tree_set, occur,  ordered_species_list)

            if ids_and_occurence_list:
                result_dict = self.fill_result_dict(ids_and_occurence_list, result_dict, start_pos)

        return result_dict

    def output_seqboot(self):
        while not os.path.exists("outfile"):
            time.sleep(1 / 1000)
            #print("waiting on seqboot outfile")
            # todo make sure not infinite loop if outfile not exist

        self.rename_file("outfile", "lib/Bootscan/infile")
        self.remove_file("lib/Bootscan/infile.txt")
        # os.renames("outfile", "infile")
        # os.remove("infile.txt")

    def dnadist_output(self):
        self.remove_file("lib/Bootscan/infile")
        self.rename_file("outfile", "lib/Bootscan/infile")

    def neighbor_output(self):
        self.remove_file("lib/Bootscan/infile")
        self.remove_file("outfile")
        self.rename_file("outtree", "lib/Bootscan/intree")

    def save_outfile(self, start_pos):
        iter = int(start_pos + (self.window_length / 2))
        old_name = "outfile"
        new_name = "/consense_" + str(iter) + ".txt"
        #path = pathlib.Path("lib/Bootscan/temp_data/" + new_name)

        input_file_folder = pathlib.Path(self.filepath)
        path = pathlib.Path(str(input_file_folder.parent) + new_name)

        try:
            os.replace(old_name, path)

        except PermissionError as e:
            time.sleep(1 / 1000)
            self.rename_file(old_name, new_name)

        except FileExistsError:
            self.remove_file(new_name)
            self.save_outfile(start_pos)

    def consense_output(self, start_pos, save_file):
        if save_file:
            self.save_outfile(start_pos)

        else:
            self.remove_file("lib/Bootscan/intree")
            self.remove_file("lib/Bootscan/outtree")

    def dir_cleanup(self):
        possible_files = ["lib/Bootscan/infile", "lib/Bootscan/infile.txt", "lib/Bootscan/outfile", "lib/Bootscan/intree", "lib/Bootscan/outtree", "lib/Bootscan/outree", "outfile", "infile", "outtree"]
        for file in possible_files:
            if os.path.exists(file):
                self.remove_file(file)

    def create_result_dict(self):  # {'id1': {}, 'id2': {}, 'id3': {}, ...}
        result_dict = {}
        for id in self.group_list:
            result_dict[id] = {}
        return (result_dict)

    def start_bootscan_2(self, start_pos, result_dict, save_consense):
        # i = 0
        # start_pos = 0
        if os.name == "nt":
            seqboot_path = pathlib.Path("lib/Bootscan/phylip_exe/seqboot.exe")
            dnadist_path = pathlib.Path("lib/Bootscan/phylip_exe/dnadist.exe")
            neighbor_path = pathlib.Path("lib/Bootscan/phylip_exe/neighbor.exe")
            consense_path = pathlib.Path("lib/Bootscan/phylip_exe/consense.exe")
        else:
            seqboot_path = pathlib.Path("lib/Bootscan/phylip_exe/linux/seqboot")
            dnadist_path = pathlib.Path("lib/Bootscan/phylip_exe/linux/dnadist")
            neighbor_path = pathlib.Path("lib/Bootscan/phylip_exe/linux/neighbor")
            consense_path = pathlib.Path("lib/Bootscan/phylip_exe/linux/consense")
        # result_dict = self.create_result_dict()

        #while start_pos + self.window_length < self.seq_length:

        self.dir_cleanup()
        self.get_subseq_dict(start_pos)  # output written to phylip file "infile"

        # call seqboot program
        call_seqboot(seqboot_path, pathlib.Path("lib/Bootscan/infile.txt"), self.bootstrap)
        self.output_seqboot()  # cleans the directory and prepare for next phylip call
        while not os.path.exists(pathlib.Path("lib/Bootscan/infile")):
            time.sleep(1 / 1000)

        # call dnadist program
        call_dnadist(dnadist_path, self.bootstrap, self.distance_model, self.t_t)
        while not os.path.exists("outfile"):
            # print("waiting on dnadist outfile")
            time.sleep(1 / 1000)

        self.dnadist_output()
        while not os.path.exists(pathlib.Path("lib/Bootscan/infile")):
            time.sleep(1 / 1000)

         # call neighbor program
        call_neighbor(neighbor_path, self.bootstrap, self.tree_model)

        while not os.path.exists("outfile"):
            # ("waiting on neighbor outfile")
            time.sleep(1 / 1000)
        self.neighbor_output()

        # call consense program
        call_consense(consense_path)
        while not os.path.exists("outfile"):
            # print("waiting on consense outfile")
            time.sleep(1 / 1000)
            # self.consense_output(start_pos, save_file = True)

        sets_dict, ordered_species_list = extract_cons_tree_sets()
        result_dict = self.extract_query_data(start_pos, sets_dict, ordered_species_list, result_dict)
        self.consense_output(start_pos, save_consense)
        # i += 1
        # start_pos += self.step
        return result_dict

    def create_empty_matrix(self):
        start_pos = 0
        iter_list = []
        while start_pos + self.window_length < self.seq_length:
            iter_list.append(str(int(start_pos + (self.window_length / 2))))
            start_pos += self.step

        empty_array = np.zeros(shape=(len(self.group_list), len(iter_list)))
        empty_df = pd.DataFrame(empty_array, self.group_list, iter_list)
        return empty_df

    def fill_matrix(self, result_matrix, result_dict, refseq):

        comp_list = []  # simple list var to compare type()
        refseq = refseq.replace(" ", "_")
        for species_id, pos_occ in result_dict.items():  # pos_occ --> position :{[id, occurence], [id2, occurence], ..}
            if species_id == refseq:
                for pos, occur_list in pos_occ.items():
                    if type(occur_list[0]) == type(comp_list):
                        for occurence in occur_list:
                            result_matrix[str(pos)][occurence[0]] = (float(occurence[1])/self.bootstrap)*100

                    else:
                        result_matrix[str(pos)][occur_list[0]] = (float(occur_list[1])/self.bootstrap)*100
        #print (self.fake_id)
        return result_matrix

    def extract_refseq_result_matrix(self, refseq, result_dict):
        result_matrix = self.create_empty_matrix()
        result_matrix = self.fill_matrix(result_matrix, result_dict, refseq)
        return result_matrix


