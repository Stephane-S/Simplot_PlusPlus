from Bio import AlignIO, Phylo
from Bio.Align import AlignInfo, MultipleSeqAlignment
from Bio.Phylo.Consensus import *
from Bio.Phylo.TreeConstruction import DistanceTreeConstructor
from lib.DistanceModels.DistCalc import CalcDist
from Bio.Phylo.TreeConstruction import _Matrix, DistanceMatrix
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord
from collections import Counter
import numpy as np
import pandas as pd
import time
from numba import njit

from PyQt5 import QtCore

class Bootscan_analysis:
    def __init__(self, filepath, filetype, group_dict, consensus_threshold, run_status):
        self.consensus_threshold = consensus_threshold
        self.group_dict = group_dict
        self.filepath = filepath
        self.consensus_dict = self.get_consensus(filepath, filetype, group_dict)
        self.seq_length = self.get_seq_length()
        self.window_length = 200
        self.step = 20
        self.refseq = None
        self.bootstrap = 100
        self.tree_model = "Neighbor-Joining"
        self.distance_model = "F84"
        self.t_t = 2.0
        self.refresh_rate = 100
        self.multiproc = True
        self.error_count = 0
        self.result_dict = None
        self.group_list = self.make_group_list()
        self.run_status = run_status

    def set_settings(self, settings_list):
        # list (bootstrap, tree_model, window, step, distance_model, t_t, refresh_rate) refer to this index
        self.bootstrap = settings_list[0]
        self.tree_model = settings_list[1]
        self.window_length = settings_list[2]
        self.step = settings_list[3]
        self.distance_model = settings_list[4]
        self.t_t = float(settings_list[5])
        self.refresh_rate = settings_list[6]
        self.multiproc =settings_list[7]


    def get_settings(self):
        settings_list = [self.bootstrap, self.tree_model, self.window_length, self.step, self.distance_model, self.t_t, self.refresh_rate, self.multiproc]
        return settings_list

    def get_sequence_length(self):
        return self.seq_length

    def make_group_list(self):
        group_list = []
        for group in self.consensus_dict.keys():
            group = group.replace(" ", "_")
            group_list.append(str(group))
        return group_list

    def get_consensus(self, filepath, filetype, group_dict):
        for group_name, seq_list in group_dict.items():
            alignment = AlignIO.read(filepath, filetype)
            align = MultipleSeqAlignment([])

            for record in alignment:
                if record.id in seq_list:
                    align.append(record)

            summary_align = AlignInfo.SummaryInfo(align)
            cons_seq = summary_align.dumb_consensus(threshold=self.consensus_threshold, ambiguous="?")

            group_dict[group_name] = str(cons_seq)

        return group_dict

    def get_seq_length(self):
        length = 0
        for id, seq in self.consensus_dict.items():
            if length == 0:
                length = len(seq)
            else:
                if len(seq) != length:
                    print(id, " different length", len(seq))
        return length

    def create_result_dict(self):  # {'id1': {}, 'id2': {}, 'id3': {}, ...}
        group_dict = self.group_dict
        iter_list = []
        start_pos = 0
        while start_pos + self.window_length < self.seq_length:
            iter_list.append(int(start_pos + (self.window_length / 2)))
            start_pos += self.step

        result_dict = {}
        for id in group_dict.keys():
            temp_dict = {}
            for value in iter_list:
                temp_dict[value] = []
            result_dict[id] = temp_dict
        self.result_dict = result_dict

    def update_result_dict(self, occur_dict, start_pos, dist_dict):
        iter = int(start_pos + (self.window_length / 2))
        for df in dist_dict.values():
            df.loc[:, str(iter)] = 0

        for ids, occur in occur_dict.items():
            self.result_dict[ids[0]][iter].append([ids[1], occur])
            self.result_dict[ids[1]][iter].append([ids[0], occur])

            id0 = ids[0].replace(" ", "_")
            id1 = ids[1].replace(" ", "_")
            value = float((occur/self.bootstrap)*100)
            dist_mat_id0 = dist_dict[id0]
            dist_mat_id0.at[id1, str(iter)] = value
            dist_dict[id0] = dist_mat_id0
            dist_mat_id1 = dist_dict[id1]
            dist_mat_id1.at[id0, str(iter)] = value
            dist_dict[id1] = dist_mat_id1

        return dist_dict

    def get_result_dict(self):
        return self.result_dict

    def build_result_dict(self):
        start_pos = 0
        dist_dict = {}

        iter_list = []
        while start_pos + self.window_length < self.seq_length:
            iter_list.append(str(int(start_pos + (self.window_length / 2))))
            start_pos += self.step

        for id in self.group_list:
            empty_array = np.empty(shape=(len(self.group_list), len(iter_list)))
            empty_array[:] = np.nan
            empty_df = pd.DataFrame(empty_array, self.group_list, iter_list)
            dist_dict[id] = empty_df

        return dist_dict

    def compute_bootscan(self, start_pos, dist_dict=None, multiproc=True):
        if self.run_status.get_status() is False:
            return {}

        else:
            if start_pos == 0:
                if not multiproc:
                    dist_dict = self.build_result_dict()

            msas, fake_id_list = self.msa_bootstrap(start_pos)

            if self.run_status.get_status() is False:
                return {}

            trees = []
            for msa in msas:
                trees.append(self.dnadist(msa, fake_id_list))

            if self.run_status.get_status() is False:
                return {}

            occur_list = []
            for tree in trees:
                for clade in tree.get_nonterminals():
                    clade_term_names = [term.name for term in clade.get_terminals()]
                    if len(clade_term_names) == 2:
                        clade_term_names.sort()
                        occur_list.append(tuple(clade_term_names))
            occur_dict = Counter(occur_list)

            if multiproc:
                return occur_dict
            else:
                dist_dict = self.update_result_dict(occur_dict, start_pos, dist_dict)
                return dist_dict


    def get_msa(self, start_pos):
        msa = MultipleSeqAlignment([])
        for group_name, consensus in self.group_dict.items():
            subseq = consensus[start_pos:(start_pos + self.window_length)]
            record = SeqRecord(
                Seq(subseq),
                id=group_name)
            msa.append(record)

        return msa

    def msa_bootstrap(self, start_pos):
        encoded_groups_seq = []
        group_id_list = []
        for group_name, consensus in self.group_dict.items():
            group_id_list.append(group_name)
            subseq = consensus[start_pos:(start_pos + self.window_length)]
            encoded_list = list(subseq.encode())
            encoded_groups_seq.append(encoded_list)

        encoded_array = np.array(encoded_groups_seq)
        times = self.bootstrap
        bootstrap_gen = self.bootstrapping(encoded_array, times)
        bootstrap_result = []
        fake_id_list = {}
        for i in bootstrap_gen:
            temp_dict = {}
            k = 0
            for j in group_id_list:
                temp_list = i[k].tolist()
                decoded = bytes(temp_list).decode()
                fake_id_list[j.replace(" ", "_")] = j
                temp_dict[j.replace(" ", "_")] = "".join(decoded)
                k += 1
            bootstrap_result.append(temp_dict)
        return bootstrap_result, fake_id_list

    @staticmethod
    @njit()
    def bootstrapping(encoded_array, times):
        (num_taxa, num_sites) = np.shape(encoded_array)
        for i in range(times):
            temp_array = np.zeros((num_taxa, num_sites), dtype=np.int64)
            for j in range(num_sites):
                col = np.random.randint(0, num_sites - 1)
                for k in range(num_taxa):
                    temp_array[k][j] = encoded_array[k][col]

            yield temp_array

    def dnadist(self, msa, fake_id_list):
        distance_matrix, names = self.calc_distance_matrix(msa)
        real_names = []
        for i in names:
            real_names.append(fake_id_list[i])
        for i in range(len(distance_matrix)):
            for j in range(len(distance_matrix[i])):
                if distance_matrix[i][j] == "-":
                    distance_matrix[i][j] = 1

        dist_matrix = DistanceMatrix(real_names, distance_matrix)

        constructor = DistanceTreeConstructor()
        if self.tree_model == "UPGMA":
            tree = constructor.upgma(dist_matrix)
        else:
            tree = constructor.nj(dist_matrix)
        return tree

    def calc_distance_matrix(self, msa):
        # compute distance matrix
        dist_instance = CalcDist(msa, self.distance_model, "DNA", [], gap_penalty=0, param_a=None)
        dm = dist_instance.get_dist_mat()
        dm_list = dm.values.tolist()
        names = list(dm.index)

        # format output as a lower triangular matrix with no zeroes on the upper section
        result_list = []
        counter = 0
        for i in dm_list:
            pos = 0
            temp_list = []
            while pos <= counter:
                try:
                    temp_list.append(float(i[pos]))
                except ValueError:
                    temp_list.append("-")
                pos += 1
            result_list.append(temp_list)
            counter += 1

        return result_list, names
