from Bio.Align import AlignInfo, MultipleSeqAlignment
from Bio import AlignIO, SeqIO, Seq
from lib.DistanceModels.DistCalc import CalcDist
import pandas as pd
import numpy as np
import timeit
import pathlib
import matplotlib
from collections import Counter
matplotlib.use("Qt5Agg")
matplotlib.use("Qt5Agg")

class SimplotAnalysis:
    def __init__(self, filepath, filetype, datatype, group_dict, consensus_threshold, progress_bar, status, model="JC69"):
        self.consensus_threshold = consensus_threshold
        self.consensus_dict = self.get_cons_2(filepath, filetype, group_dict, progress_bar)
        self.group_list = self.make_group_list()
        self.seq_length = self.get_seq_length()
        self.threshold = 0.5
        self.window_length = 200
        self.step = 20
        self.gap = 0
        self.param_a = 0
        self.datatype = datatype # DNA or protein
        self.model = self.set_default_model(datatype)
        self.default_settings = True
        self.refresh_rate = 100
        self.gap_treshold = 0.33
        self.distance_report = []
        # self.gap_report_df = None
        self.multiproc = False
        self.ambiguous_to_gap = True
        progress_bar.setValue(100)
        self.run_status = status
        #print("AnalysisPlot class instance created")

    def get_consensus_dict(self):
        return self.consensus_dict

    def set_default_model(self, datatype):
        if datatype == "DNA":
            model = "Jukes-Cantor"
        elif datatype == "protein":
            model = "Kimura"
        else:
            print ("error, datatype not found at class instanciation")

        return model

    def set_consensus_threshold(self, new_threshold):
        self.consensus_threshold = new_threshold

    def is_default_settings(self):
        return self.default_settings

    def get_consensus_dict(self):
        return self.consensus_dict

    def get_model_settings(self):
        settings_dict = {
            "model": self.model,
            "window": self.window_length,
            "step": self.step,
            "gap": self.gap,
            "param_a": self.param_a,
            "datatype": self.datatype,
            "refresh_rate": self.refresh_rate,
            "gap_treshold": self.gap_treshold,
            "multiproc": self.multiproc
        }

        return settings_dict

    def set_default_settings(self, bool):
        self.default_settings = bool
        #print ("default_settings is false")

    def update_settings(self, settings_dict):
        self.model = settings_dict["model"]
        self.window_length = settings_dict["window"]
        self.step = settings_dict["step"]
        self.gap = settings_dict["gap"]
        self.param_a = settings_dict["param_a"]
        self.datatype = settings_dict["datatype"]
        self.refresh_rate = settings_dict["refresh_rate"]
        self.gap_treshold = settings_dict["gap_treshold"]
        self.multiproc = settings_dict["multiproc"]

    def set_refseq(self, refseq):
        self.refseq = refseq

    def get_refseq(self):
        return self.refseq

    def get_sequence_length(self):
        return self.seq_length

    def get_datatype(self):
        return self.datatype

    # def get_gap_report_df(self):
    #     return self.gap_report_df

    def get_distance_report(self):
        return Counter(self.distance_report)

    def create_empty_matrix(self):
        start_pos = 0
        iter_list = []
        while start_pos + self.window_length < self.seq_length:
            iter_list.append(str(int(start_pos + (self.window_length/2))))
            start_pos += self.step

        empty_array = np.empty(shape=(len(self.group_list), len(iter_list)))
        empty_array[:] = np.nan
        empty_df = pd.DataFrame(empty_array, self.group_list, iter_list)
        return empty_df

    def make_group_list(self):
        group_list = []
        for group in self.consensus_dict.keys():
            group = group.replace(" ", "_")
            group_list.append(str(group))

        return group_list

    def check_same_length(self, filepath, filetype):
        same_length = True
        records = SeqIO.parse(filepath, filetype)
        records = list(records)  # make a copy, otherwise our generator
        # is exhausted after calculating maxlen
        maxlen = max(len(record.seq) for record in records)

        for record in records:  # append - to get same length on all sequences
            if len(record.seq) != maxlen:
                same_length = False

        return same_length  # false if all seq not same length

    def pad_seq_to_maxlen(self, filepath, filetype):
        records = SeqIO.parse(filepath, filetype)
        records = list(records)  # make a copy, otherwise our generator
        # is exhausted after calculating maxlen
        maxlen = max(len(record.seq) for record in records)

        for record in records:  # append - to get same length on all sequences
            if len(record.seq) != maxlen:
                sequence = str(record.seq).ljust(maxlen, '-')
                record.seq = Seq.Seq(sequence)
        assert all(len(record.seq) == maxlen for record in records)

        input_path = pathlib.Path(filepath)
        output_path = str(input_path.stem) + "_padded.fasta"
        with open(output_path, 'w') as f:
            SeqIO.write(records, f, 'fasta')
        #print ("sequences padded")
        return output_path, "fasta"

    def get_cons_2(self, filepath, filetype, group_dict, progress_bar):
        same_length = self.check_same_length(filepath, filetype)
        consensus_dict = {}
        if not same_length:
            filepath, filetype = self.pad_seq_to_maxlen(filepath, filetype)

        i = 0
        alignment = AlignIO.read(filepath, filetype)
        for group_name, seq_list in group_dict.items():
            seq_temp_list = []
            for record in alignment:
                if record.id in seq_list:
                    seq_temp_list.append((str(record.seq)).upper())

            consensus_seq = ""
            if seq_temp_list: #not empty
                for pos in range (0, len(seq_temp_list[0])):
                    temp_list = []
                    for seq in seq_temp_list:
                        temp_list.append(seq[pos])

                    most_common = Counter(temp_list)
                    if most_common.most_common(1)[0][1] >= self.consensus_threshold:
                        consensus_seq = consensus_seq + str(most_common.most_common(1)[0][0]) #gets most common char; if 2 are equal, first of the top seq is used
                    else:
                        consensus_seq = consensus_seq + seq[pos]

                consensus_dict[group_name] = str(consensus_seq)
                progress_bar.setValue(i / len(group_dict) * 100)
                i += 1
                #todo add threshold
        return consensus_dict






    def get_cons(self, filepath, filetype, group_dict, progress_bar):
        self.get_cons_2(filepath, filetype, group_dict, progress_bar)
        # print ("here")
        # print (group_dict)
        same_length = self.check_same_length(filepath, filetype)
        consensus_dict = {}

        if not same_length:
            filepath, filetype = self.pad_seq_to_maxlen(filepath, filetype)

        i = 0
        for group_name, seq_list in group_dict.items():
            alignment = AlignIO.read(filepath, filetype)
            align = MultipleSeqAlignment([])

            for record in alignment:
                if record.id in seq_list:
                    align.add_sequence(record.id, str(record.seq))

            summary_align = AlignInfo.SummaryInfo(align)
            cons_seq = summary_align.dumb_consensus(threshold=self.consensus_threshold, ambiguous="?")

            consensus_dict[group_name] = str(cons_seq)

            progress_bar.setValue(i/len(group_dict)*100)
            i += 1

        return consensus_dict

    def get_seq_length(self):
        length = 0
        for id, seq in self.consensus_dict.items():
            if length == 0:
                length = len(seq)
            else:
                if len(seq) != length:
                    print(id, " different length", len(seq))

        return length

    def seq_clean_ambiguous(self, subseq):
        subseq = subseq.upper()
        ambiguous = []

        if self.datatype == "DNA":
            ambiguous = ["R","Y","K","M","S","W","B","D","H","V","N"]

        elif self.datatype == "protein":
            ambiguous = ["B","J","Z","X","*"]

        for char in ambiguous:
            subseq = subseq.replace(char, "-")

        return subseq

    def get_subseq_dict(self, start_pos):
        column = str(int(start_pos + (self.window_length / 2)))
        subseq_dict = {}
        for id, seq in self.consensus_dict.items():
            new_id = id.replace(" ", "_")
            if self.check_gap_treshold(new_id, seq[start_pos:(start_pos+self.window_length)], column): #id vs new_id
                subseq = seq[start_pos:(start_pos+self.window_length)]
                if self.ambiguous_to_gap is True:
                    subseq = self.seq_clean_ambiguous(subseq)

                subseq_dict[new_id] = subseq
            else:
                self.distance_report.append("gap threshold")

        #self.write_cons_fasta(subseq_dict, start_pos) # write fasta file of the resulting dict
        return subseq_dict

    def modify_model_name(self):
        modified_model_names = {"Hamming": "Hamming",
                                "Kimura 2-Parameters": "Kimura2Parameter",
                                "Jukes-Cantor": "JC69",
                                "Kimura": "KimuraProtein",
                                "F81 - optimized": "F81",
                                "HKY85 - optimized": "HKY85",
                                "TN93": "tn93",
                                "TN93 - optimized": "TN93",
                                "GTR - optimized": "GTR",
                                "ssGN - optimized": "ssGN"
                                }

        if self.model in modified_model_names.keys():
            model = modified_model_names[self.model]

            if model == "JC69":
                if self.datatype == "DNA":
                    model = "JC69_nucleo"
                else:
                    model = "JC69_prot"
        else:
            model = self.model

        return model

    def calc_distance(self, subseq_dict):
        param_a = self.param_a
        model = self.modify_model_name()
        return CalcDist(subseq_dict, model, self.datatype, self.distance_report, self.gap, param_a)

    def extract_distance(self, temp_mat, dist_mat, column):
        refseq = self.refseq.replace(" ", "_")
        #for group in self.group_list:
        for group in temp_mat.index:
            if group != self.refseq and refseq in temp_mat.index:
                distance = temp_mat[refseq][group]
                if distance == "-" or distance > 100 or distance < -0.0001:  # issue recorded where distance was A *10 power 8...
                    break  #todo add to analysis report
                else:
                    if distance == -0:
                        dist_mat.at[group, column] = np.nan  # fixed for an issue with Kim-2_param where -0 distance exist
                    else:
                        dist_mat.at[group, column] = distance
        return dist_mat

    def extract_all_distances(self, temp_mat, column, dist_dict):
        for refseq in dist_dict.keys():
            dist_mat = dist_dict[refseq]
            refseq = refseq.replace(" ", "_")
            for group in temp_mat.index:
                if group != refseq in temp_mat.index:
                    try:
                        distance = float(temp_mat[refseq][group])
                        # if distance > 1:
                        #     print (refseq, "-", group, ":", distance, column)
                    except ValueError:
                        distance = "-"
                    if distance == "-" or distance > 100 or distance < -0.0001 or distance is None:
                        # dist_mat.at[
                        #     group, column] = np.nan
                        break
                    else:
                        #todo: validate removing this snippet

                        # if distance == -0:
                        #     self.distance_report.append("Distance too large")
                        #     dist_mat.at[
                        #         group, column] = np.nan  # fix for an issue with Kim-2_param where -0 distance exist

                        if distance == -0:
                            distance = 0
                        dist_mat.at[group, column] = distance
                        self.distance_report.append("Distance Calculated")

            dist_dict[refseq] = dist_mat

        return dist_dict

    def create_dist_dict(self):
        dist_dict = {}
        for group in self.group_list:
            empty_df = self.create_empty_matrix()
            dist_dict[group] = empty_df

        return dist_dict

    def check_gap_treshold(self, id, seq, column):
        gap_treshold = self.gap_treshold
        if gap_treshold is not None:
            gap_count = 0
            for pos in range(len(seq)):
                if seq[pos] == "-" or seq[pos] == "?":
                    gap_count += 1

            #self.gap_report_df.at[id, column] = (gap_count/self.window_length)*100
            return (gap_count / len(seq)) <= 1-gap_treshold
        else:
            return True

    def create_gap_report_df(self, start_pos_list):
        gap_report_df = self.create_empty_matrix()
        gap_threshold_df = self.create_empty_matrix()
        gap_treshold = self.gap_treshold
        #if gap_treshold is not None:
        for start_pos in start_pos_list:
            column = str(int(start_pos + (self.window_length / 2)))
            for id, seq in self.consensus_dict.items():
                new_id = id.replace(" ", "_")
                subseq = seq[start_pos:(start_pos + self.window_length)]
                gap_count = 0
                for pos in range(len(subseq)):
                    if subseq[pos] == "-" or subseq[pos] == "?":
                        gap_count += 1

                gap_report_df.at[new_id, column] = (gap_count / self.window_length) * 100
                if gap_treshold is not None:
                    if (gap_count / len(subseq)) <= 1-gap_treshold:
                        gap_threshold_df.at[new_id, column] = 1
                    else:
                        gap_threshold_df.at[new_id, column] = 0

        return gap_report_df, gap_threshold_df



    def get_all_distances(self, start_pos, dist_dict=None, multiproc=True):
        if start_pos == 0:
            if not multiproc:
                dist_dict = self.create_dist_dict()
            #self.gap_report_df = self.create_empty_matrix()
            self.distance_report = []
        #print ("starting: ", start_pos)

        if self.run_status.get_status() is False:
            return {}
        else:
            subseq_dict = self.get_subseq_dict(start_pos) #todo fix if subseq_dict is empty because of all gaps thresholds triggered
            object = self.calc_distance(subseq_dict)
            temp_mat = object.get_dist_mat()

            return self.extract_all_distances(temp_mat, str(int(start_pos + (self.window_length / 2))), dist_dict) if not multiproc else temp_mat
#
# if __name__ == "__main__":
#     # test_dict = {"group 0": ["BtCoV/273/2005", "BtCoV/279/2005"],
#     #              "group 1": ["BetaCoV/bat/Yunnan/RaTG13/2013", "BetaCoV/Wuhan/IVDC-HB-04/2020", "BetaCoV/Wuhan/WIV04/2019",
#     #                          "BetaCoV/Wuhan-Hu-1/2019", "BtCoV/BM48-31/BGR/2008"],
#     #              "group 2": ["bat-SL-CoVZC45", "bat-SL-CoVZXC21"],
#     #              "group 3": ["GD/P1L", "GD/P2S", "GX/P1E", "GX/P2V", "GX/P3B", "GX/P4L", "GX/P5E", "GX/P5L"]}
#
#     test_dict = {'SARS-CoV-2': ['BetaCoV/Wuhan/IVDC-HB-04/2020', 'BetaCoV/Wuhan/WIV04/2019', 'BetaCoV/Wuhan-Hu-1/2019'],
#                  'Bat CoV (ZXC21, ZC45)': ['bat-SL-CoVZC45', 'bat-SL-CoVZXC21'],
#                  'Bat CoV from Kenya/BGR': ['BtKY72', 'BtCoV/BM48-31/BGR/2008'],
#                  'Guangxi Pangolin CoV': ['GX/P1E', 'GX/P2V', 'GX/P3B', 'GX/P4L', 'GX/P5E', 'GX/P5L'],
#                  'Bat SL CoV (BTCoV, RS3367)': ['Rs3367', 'BtCoV/273/2005', 'BtCoV/279/2005'],
#                  'Bat SL CoV (HKU3, RF1)': ['HKU3-13', 'HKU3-6', 'Rf1'],
#                  'Guangdong Pangolin CoV': ['GD/P1L', 'GD/P2S'],
#                  'SARS CoV': ['PC4_13', 'Tor2'],
#                  'Bat CoV (RaTg13)': ['BetaCoV/bat/Yunnan/RaTG13/2013']}
#
#
#     filepath = "D:/Work/UQAM/maitrise_bio-info/Projet/DistPloter/src/test_data/gene_s_gblock.fas"
#     object_test = AnalysisPlot(filepath, "fasta", test_dict)
#     object_test.get_dist_df()
