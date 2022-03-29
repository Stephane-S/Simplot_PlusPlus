#uncomment DistanceCalculator

import pandas as pd
import numpy as np
from Bio import SeqIO
from Bio.Align import MultipleSeqAlignment
from Bio.Phylo.TreeConstruction import DistanceCalculator ### comment this one
import math
from cogent3 import load_aligned_seqs, make_aligned_seqs
import timeit
from cogent3.evolve import distance
from cogent3.evolve.models import *
import sys
from typing import TextIO
pd.options.mode.chained_assignment = None  # default='warn'


class CalcDist:
    def __init__(self, subseq_dict, model, datatype, distance_report, gap_penalty=0, param_a=None, filetype="fasta"):
        #self.records = self.get_records(file_path, filetype)
        self.seq_dict = subseq_dict
        self.id_list, self.seq_length = self.get_records_data() #list and int
        self.dist_mat = self.create_dist_mat() #dataframe
        self.gap_penalty = gap_penalty
        self.parameter_a = param_a
        self.distance_report = distance_report
        self.datatype = datatype

        available_models = ["Hamming",  # nucleo and prot
                            "JC69_nucleo",  # nucleo
                            "JC69_prot",  # prot
                            "Kimura2Parameter",  # nucleo
                            "KimuraProtein",  # prot
                            "Tamura",  # nucleo
                            "TajimaNei",  # nucleo
                            "JinNeiGamma",  # nucleo
                            "LogDet",  # nucleo
                            "F84"]  # nucleo

        cogent3_models = [
                            "F81",
                            "HKY85",
                            "TN93",
                            "GTR",
                            "ssGN",
                            "paralinear",
                            "tn93",
                            "DSO78",
                            "AH96",
                            "AH96_mtmammals",
                            "JTT92",
                            "WG01",
                            "logdet",
                            "percent"]

        biopython_nt_models = ["identity", "benner22", "benner6", "benner74", "dayhoff", "feng", "genetic", "gonnet1992", "hoxd70", "johnson", "jones",
         "levin", "mclachlan", "mdm78", "blastn", "rao", "risler", "str", "trans", "blosum45", "blosum50", "blosum62",
         "blosum80", "blosum90", "pam250", "pam30", "pam70"]

        biopython_prot_models = ["identity", "blosum45", "blosum50", "blosum62",
         "blosum80", "blosum90", "pam250", "pam30", "pam70"]


        if model in available_models:
            eval("self." + model + "()")

        elif model in cogent3_models:
            self.calculate_cogent3_distance(model, self.datatype)

        elif datatype == "DNA" and model in biopython_nt_models:
            self.calculate_biopython_distance(model)
        elif datatype == "protein" and model in biopython_prot_models:
            self.calculate_biopython_distance(model)

    def biopython_aln(self):
        aln = MultipleSeqAlignment([])

        seq_dict = self.remove_unknown_char(self.seq_dict)
        for id, seq in seq_dict.items():
            aln.add_sequence(id, seq)
        return aln

    def remove_unknown_char(self, seq_dict):
        for id, seq in seq_dict.items():
            seq_dict[id] = seq.replace("?", "-")
        return seq_dict

    def fill_triangular_matrix(self, df, id_names):
        for id1 in id_names:
            for id2 in id_names:
                if df[id1][id2] is None:
                    df[id1][id2] = df[id2][id1]

        return df

    def biopython_to_dataframe(self, dm):
        str_input = str(dm)
        input_list = str_input.splitlines()
        id_names = input_list[-1].split("\t")
        input_list.pop(-1)

        df = pd.DataFrame([x.split('\t') for x in input_list], columns=id_names)
        df = df.set_index("")
        id_names.pop(0)
        df = self.fill_triangular_matrix(df, id_names)

        return df

    #comment this one
    def calculate_biopython_distance(self, model):
        try:
            aln = self.biopython_aln()
            calculator = DistanceCalculator(model)
            dm = calculator.get_distance(aln)
            self.dist_mat = self.biopython_to_dataframe(dm)
        except Exception as e:
            print (e)


    def get_records(self, file_path, filetype):
        return SeqIO.parse(file_path, filetype)

    def get_records_data(self):
        id_list = []
        seq_length = None
        for id, seq in self.seq_dict.items():
            id_list.append(id)

            if seq_length is None:
                seq_length = len(seq)

            else:
                if len(seq) != seq_length:
                    print("error! seq length of : " + id, "!= ", seq_length)

        return id_list, seq_length


    def create_dist_mat(self):
        empty_array = np.zeros(shape=(len(self.id_list), len(self.id_list)))
        empty_df = pd.DataFrame(empty_array, self.id_list,self.id_list)
        return empty_df

    def calculate_cogent3_distance(self, model, datatype):
        #print (self.seq_dict)
        try:
            aln = make_aligned_seqs(self.seq_dict, moltype=self.datatype)
        except Exception as e:
            aln = None
            dist = None

        if aln is not None:
            try:
                dist = self.run_cogent3_model(aln, model, datatype)
            except Exception as e:
                dist = None
        if dist is not None:
            try:
                self.dist_mat = self.table_to_df(dist)
            except ValueError:
                # self.dist_mat = None
                pass

    def run_cogent3_model(self, aln, model, datatype):
        # this is essential for cogent3 when running as an executable. Otherwise the stdout throws an error.
        sys.stdout = TextIO()

        #print(f"trying {model} with datatype {datatype}:")
        #dist = None
        if datatype == "DNA" or datatype == "protein":  #not working because should or dna == "protein but useful for now until datatype is fixed
            if model in ["F81", "HKY85", "TN93", "GTR", "ssGN"] or model in ["DSO78", "AH96", "AH96_mtmammals", "JTT92",
                                                                             "WG01"]:
                code = "distance.EstimateDistances(aln, submodel=" + model + "())"
                dist = eval(code)
                if dist is not None:
                    try:
                        dist.run(show_progress=False)
                        dist = dist.get_pairwise_distances()
                    except KeyError as e:
                        print(e)

            elif model in ["paralinear", "tn93", "percent", "logdet"]:
                try:
                    dist = aln.distance_matrix(calc=model, show_progress=False, drop_invalid=True)
                except Exception as e:
                    print("error", e)

            else:
                print("model not found")
        else:
            print("datatype not found")

        return dist

    def table_to_df(self, result_table):
        result_table = str(result_table)
        result_list = result_table.splitlines()
        result_list = result_list[1:-1]
        del result_list[1]
        for i in range(len(result_list)):
            result_list[i] = str(result_list[i]).split()
        df = pd.DataFrame.from_records(result_list[1:], columns=result_list[0])
        df = df.set_index("names")
        return df


    def Hamming(self): #nucleo et prot

        gap_penalty = self.gap_penalty
        for i in range (len(self.id_list)-1):
            for j in range (i+1, len(self.id_list)):
                correspondence = 0
                gaps = 0

                for pos in range(self.seq_length):
                    if ((self.seq_dict[self.id_list[i]])[pos] == (self.seq_dict[self.id_list[j]])[pos]
                      and (self.seq_dict[self.id_list[i]])[pos] != "-"
                      and (self.seq_dict[self.id_list[i]])[pos] != "?"
                      and (self.seq_dict[self.id_list[j]])[pos] != "-"
                      and (self.seq_dict[self.id_list[j]])[pos] != "?"):

                        correspondence += 1
                    elif (self.seq_dict[self.id_list[i]])[pos] == "-" or (self.seq_dict[self.id_list[i]])[pos] == "?":

                        gaps += 1

                comparable_pos = self.seq_length - gaps

                try:
                    hamming = 1 - correspondence / (comparable_pos + gap_penalty*gaps)
                except ZeroDivisionError:
                    hamming = "-"
                    self.distance_report.append("ZeroDivisionError")

                self.dist_mat[self.id_list[i]][self.id_list[j]] = hamming
                self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

        return self.dist_mat


    def JC69_nucleo(self):
        param_b = 3/4
        gap_penalty = self.gap_penalty

        for i in range (len(self.id_list)-1):
            for j in range (i+1, len(self.id_list)):
                correspondence = 0
                gaps = 0

                for pos in range (self.seq_length):
                    if ((self.seq_dict[self.id_list[i]])[pos] == (self.seq_dict[self.id_list[j]])[pos]
                      and (self.seq_dict[self.id_list[i]])[pos] != "-"
                      and (self.seq_dict[self.id_list[i]])[pos] != "?"):

                        correspondence += 1
                    elif (self.seq_dict[self.id_list[i]])[pos] == "-" or (self.seq_dict[self.id_list[i]])[pos] == "?" \
                      or (self.seq_dict[self.id_list[j]])[pos] == "-" or (self.seq_dict[self.id_list[j]])[pos] == "?":

                        gaps += 1

                comparable_pos = self.seq_length - gaps

                try:
                    hamming = 1 - correspondence / (comparable_pos + (gap_penalty*gaps))
                    hamming = hamming/(param_b)
                except ZeroDivisionError:
                    hamming = 1  # triggers the (1- hamming <= 0) as true
                    self.distance_report.append(">75% site difference")

                if (1- hamming <= 0):

                    self.dist_mat[self.id_list[i]][self.id_list[j]] = "-"
                    self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

                else:
                    self.dist_mat[self.id_list[i]][self.id_list[j]] = -param_b * math.log(1-hamming)

                    self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

        return (self.dist_mat)


    def JC69_prot(self):
        param_b = 19/20
        gap_penalty = self.gap_penalty

        for i in range (len(self.id_list)-1):
            for j in range (i+1, len(self.id_list)):
                correspondence = 0
                gaps = 0

                for pos in range (self.seq_length):
                    if ((self.seq_dict[self.id_list[i]])[pos] == (self.seq_dict[self.id_list[j]])[pos]
                      and (self.seq_dict[self.id_list[i]])[pos] != "-"
                      and (self.seq_dict[self.id_list[i]])[pos] != "?"):

                        correspondence += 1
                    elif (self.seq_dict[self.id_list[i]])[pos] == "-" or (self.seq_dict[self.id_list[i]])[pos] == "?" \
                       or (self.seq_dict[self.id_list[i]])[pos] == "-" or (self.seq_dict[self.id_list[i]])[pos] == "?":

                        gaps += 1

                comparable_pos = self.seq_length - gaps

                try:
                    hamming = 1 - correspondence / (comparable_pos + (gap_penalty * gaps))
                    hamming = hamming / (param_b)
                except ZeroDivisionError:
                    hamming = 1  # triggers the (1- hamming <= 0) as true
                    self.distance_report.append(">75% site difference")

                if (1- hamming <= 0):
                    self.dist_mat[self.id_list[i]][self.id_list[j]] = "-"
                    self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]
                else:
                    self.dist_mat[self.id_list[i]][self.id_list[j]] = -param_b * math.log(1-hamming)

                    self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

        return (self.dist_mat)

    def Kimura2Parameter(self):
        for i in range (len(self.id_list)-1):
            for j in range (i+1, len(self.id_list)):
                comparable_pos = 0                      #that have no gaps!
                transition = 0                          #A/G, G/A, C/T, T/C, C/U, U/C
                transversion = 0                        # A/C, C/A, A/T, T/A, A/U, U/A

                for pos in range(self.seq_length):
                    if ((self.seq_dict[self.id_list[i]])[pos] != "-"
                       and (self.seq_dict[self.id_list[i]])[pos] != "?"
                       and (self.seq_dict[self.id_list[j]])[pos] != "-"
                       and (self.seq_dict[self.id_list[j]])[pos] != "?"):

                        comparable_pos +=1

                        if ((self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "T"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "T" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "U"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "U" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C"):

                            transition += 1

                        elif ((self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "T"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "T" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "U"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "U" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "T"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "T" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "U"
                           or (self.seq_dict[self.id_list[i]])[pos].upper() == "U" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G"):

                            transversion += 1
                try:
                    transition_pos = transition/comparable_pos
                    transversion_pos = transversion/comparable_pos
                    distance = (1 - 2*transition_pos - transversion_pos) * math.sqrt(1 - 2*transversion_pos)

                except:
                    transversion_pos = 1
                    distance = 0  # triggers if ((1 - 2*transversion_pos < 0) or (distance <= 0)): as true
                    self.distance_report.append("log of negative number")

                if ((1 - 2*transversion_pos < 0) or (distance <= 0)): # or -0.5 * math.log(distance) == -0
                    self.dist_mat[self.id_list[i]][self.id_list[j]] = "-"
                    self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

                else:
                    distance = (-0.5 * math.log(distance))

                    self.dist_mat[self.id_list[i]][self.id_list[j]] = distance
                    self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

        return (self.dist_mat)


    def Tamura(self):
        for i in range(len(self.id_list) - 1):
            for j in range(i + 1, len(self.id_list)):

                comparable_pos = 0  # that have no gaps!
                transition = 0  # A/G, G/A, C/T, T/C, C/U, U/C
                transversion = 0  # A/C, C/A, A/T, T/A, A/U, U/A , G/C, C/G, G/T, T/G, G/U, U/G
                seq1_GC_content = 0
                seq2_GC_content = 0

                for pos in range(self.seq_length):
                    if ((self.seq_dict[self.id_list[i]])[pos] != "-"
                            and (self.seq_dict[self.id_list[i]])[pos] != "?"
                            and (self.seq_dict[self.id_list[j]])[pos] != "-"
                            and (self.seq_dict[self.id_list[j]])[pos] != "?"):

                        comparable_pos += 1

                        if (self.seq_dict[self.id_list[i]])[pos].upper() == "G" or (self.seq_dict[self.id_list[i]])[pos].upper() == "C":
                            seq1_GC_content += 1

                        if (self.seq_dict[self.id_list[j]])[pos].upper() == "G" or (self.seq_dict[self.id_list[j]])[pos].upper() == "C":
                            seq2_GC_content += 1

                        if ((self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G"
                                or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                                or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "T"
                                or (self.seq_dict[self.id_list[i]])[pos].upper() == "T" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C"
                                or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "U"
                                or (self.seq_dict[self.id_list[i]])[pos].upper() == "U" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C"):

                            transition += 1

                        elif ((self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "T"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "T" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "U"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "U" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "T"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "T" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "U"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "U" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G"):

                            transversion += 1

                try:
                    transition_pos = transition / comparable_pos
                    transversion_pos = transversion / comparable_pos
                    GC_distance = (seq1_GC_content + seq2_GC_content) / comparable_pos - 2 * (seq1_GC_content * seq2_GC_content) / (comparable_pos * comparable_pos)
                except ZeroDivisionError:
                    GC_distance = 0
                    self.distance_report.append("G+C content either 0% or 100%")


                if GC_distance == 0:
                    self.dist_mat[self.id_list[i]][self.id_list[j]] = "-"
                    self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

                else:
                    if ((1 - transition_pos/GC_distance - transversion_pos <= 0) or (1 - 2*transversion_pos <= 0)):
                        self.dist_mat[self.id_list[i]][self.id_list[j]] = "-"
                        self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

                    else:
                        self.distance_report.append("log of negative number")
                        distance = -GC_distance * math.log(1 - transition_pos/GC_distance - transversion_pos) -0.5* (1 - GC_distance) * math.log(1 - 2 * transversion_pos)
                        self.dist_mat[self.id_list[i]][self.id_list[j]] = distance
                        self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

        return self.dist_mat


    def KimuraProtein(self):
        for i in range(len(self.id_list) - 1):
            for j in range(i + 1, len(self.id_list)):
                correspondence = 0
                comparable_pos = 0
                gaps = 0

                for pos in range(self.seq_length):
                    if ((self.seq_dict[self.id_list[i]])[pos] == (self.seq_dict[self.id_list[j]])[pos]
                            and (self.seq_dict[self.id_list[i]])[pos] != "-"
                            and (self.seq_dict[self.id_list[i]])[pos] != "?"):

                        correspondence += 1
                    elif (self.seq_dict[self.id_list[i]])[pos] == "-" \
                            or (self.seq_dict[self.id_list[i]])[pos] == "?"\
                            or (self.seq_dict[self.id_list[j]])[pos] == "-"\
                            or (self.seq_dict[self.id_list[j]])[pos] == "?":

                        gaps += 1

                comparable_pos = self.seq_length - gaps

                try:
                    hamming = 1 - correspondence / comparable_pos
                    hamming = 1 - hamming - 0.2 * hamming * hamming
                except ZeroDivisionError:
                    hamming = -1  # triggers negative values downstream
                    self.distance_report.append("log of negative number")

                if (hamming <= 0):
                    self.dist_mat[self.id_list[i]][self.id_list[j]] = "-"
                    self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

                else:
                    self.dist_mat[self.id_list[i]][self.id_list[j]] = - math.log(hamming)
                    self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

        return (self.dist_mat)

    def TajimaNei(self): # nucleo
        for i in range(len(self.id_list) - 1):
            for j in range(i + 1, len(self.id_list)):
                correspondence = 0
                gaps = 0
                total_fract = 0
                dblh = 0
                fract_list = [0, 0, 0, 0]
                mat_freq = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]

                for k in range (4):
                    for l in range (k+1, 4):
                        mat_freq[k][l] = 0

                for pos in range(self.seq_length):
                    if ((self.seq_dict[self.id_list[i]])[pos] == (self.seq_dict[self.id_list[j]])[pos]
                       and (self.seq_dict[self.id_list[i]])[pos] != "-"
                       and (self.seq_dict[self.id_list[i]])[pos] != "?"):
                        correspondence +=1

                    elif (self.seq_dict[self.id_list[i]])[pos] == "-" \
                       or (self.seq_dict[self.id_list[i]])[pos] == "?"\
                       or (self.seq_dict[self.id_list[j]])[pos] == "-"\
                       or (self.seq_dict[self.id_list[j]])[pos] == "?":

                        gaps += 1

                    #get A,T,C,G frequencies in fract_list
                    if ((self.seq_dict[self.id_list[i]])[pos] != "-" and (self.seq_dict[self.id_list[i]])[pos] != "?"
                       and (self.seq_dict[self.id_list[j]])[pos] != "-" and (self.seq_dict[self.id_list[j]])[pos] != "?"):

                        if (self.seq_dict[self.id_list[i]])[pos].upper() == "A" or (self.seq_dict[self.id_list[j]])[pos].upper() == "A":
                            fract_list[0] +=1
                            if (self.seq_dict[self.id_list[i]])[pos] == (self.seq_dict[self.id_list[j]])[pos]:
                                fract_list[0] += 1

                        if (self.seq_dict[self.id_list[i]])[pos].upper() == "T" or (self.seq_dict[self.id_list[j]])[pos].upper() == "T":
                            fract_list[1] +=1
                            if (self.seq_dict[self.id_list[i]])[pos] == (self.seq_dict[self.id_list[j]])[pos]:
                                fract_list[1] += 1

                        if (self.seq_dict[self.id_list[i]])[pos].upper() == "C" or (self.seq_dict[self.id_list[j]])[pos].upper() == "C":
                            fract_list[2] +=1
                            if (self.seq_dict[self.id_list[i]])[pos] == (self.seq_dict[self.id_list[j]])[pos]:
                                fract_list[2] += 1

                        if (self.seq_dict[self.id_list[i]])[pos].upper() == "G" or (self.seq_dict[self.id_list[j]])[pos].upper() == "G":
                            fract_list[3] +=1
                            if (self.seq_dict[self.id_list[i]])[pos] == (self.seq_dict[self.id_list[j]])[pos]:
                                fract_list[3] += 1

                    #get pairs

                    if (self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "T" \
                       or (self.seq_dict[self.id_list[i]])[pos].upper() == "T" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A":
                        mat_freq[0][1] += 1

                    if (self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C" \
                       or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A":
                        mat_freq[0][2] += 1

                    if (self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G" \
                       or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A":
                        mat_freq[0][3] += 1

                    if (self.seq_dict[self.id_list[i]])[pos].upper() == "T" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C" \
                       or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "T":
                        mat_freq[1][2] += 1

                    if (self.seq_dict[self.id_list[i]])[pos].upper() == "T" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G" \
                       or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "T":
                        mat_freq[1][3] += 1

                    if (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G" \
                       or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C":
                        mat_freq[2][3] += 1

                try:
                    comparable_pos = self.seq_length - gaps
                    fract_list[0] = fract_list[0] / (2 * comparable_pos)
                    fract_list[1] = fract_list[1] / (2 * comparable_pos)
                    fract_list[2] = fract_list[2] / (2 * comparable_pos)
                    fract_list[3] = fract_list[3] / (2 * comparable_pos)

                    # calc average of each pair
                    for k in range(4):
                        for l in range(k+1 , 4):
                            mat_freq[k][l] = mat_freq[k][l] / comparable_pos

                    for k in range(4):
                        for l in range(k + 1, 4):
                            dblh += (mat_freq[k][l] * mat_freq[k][l]) / (fract_list[k] * fract_list[l])

                    dblh = dblh/2

                    for k in range(4):
                        total_fract += fract_list[k] * fract_list[k]

                    hamming = 1- correspondence / comparable_pos # gaps ignored
                    param_b = (1 - total_fract + (hamming*hamming)/dblh)/2

                    if 1 - hamming/param_b <= 0:
                        self.dist_mat[self.id_list[i]][self.id_list[j]] = "-"
                        self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

                    else:
                        self.dist_mat[self.id_list[i]][self.id_list[j]] = (-param_b * math.log(1- hamming/param_b))
                        self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

                except ZeroDivisionError:
                    self.distance_report.append("log term too close to 0")
                    self.dist_mat[self.id_list[i]][self.id_list[j]] = "-"
                    self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

        return (self.dist_mat)


    def JinNeiGamma(self):
        param_a = self.parameter_a
        avg_sub = []

        for i in range(len(self.id_list)):
            input  = [None]*len(self.id_list)
            avg_sub.append(input)

        if param_a is None:  # calculate param_a
            for i in range(len(self.id_list) - 1):
                for j in range(i + 1, len(self.id_list)):
                    comparable_pos = 0
                    transition = 0
                    transversion = 0

                    for pos in range(self.seq_length):
                        if ((self.seq_dict[self.id_list[i]])[pos] != "-" and (self.seq_dict[self.id_list[i]])[pos] != "?"
                           and (self.seq_dict[self.id_list[j]])[pos] != "-" and (self.seq_dict[self.id_list[j]])[pos] != "?"):
                            comparable_pos += 1

                            if ((self.seq_dict[self.id_list[i]])[pos].upper() == "A" and
                                    (self.seq_dict[self.id_list[j]])[pos].upper() == "G"
                                    or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and
                                    (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                                    or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and
                                    (self.seq_dict[self.id_list[j]])[pos].upper() == "T"
                                    or (self.seq_dict[self.id_list[i]])[pos].upper() == "T" and
                                    (self.seq_dict[self.id_list[j]])[pos].upper() == "C"
                                    or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and
                                    (self.seq_dict[self.id_list[j]])[pos].upper() == "U"
                                    or (self.seq_dict[self.id_list[i]])[pos].upper() == "U" and
                                    (self.seq_dict[self.id_list[j]])[pos].upper() == "C"):

                                transition += 1

                            elif ((self.seq_dict[self.id_list[i]])[pos].upper() == "A" and
                                  (self.seq_dict[self.id_list[j]])[pos].upper() == "C"
                                  or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and
                                  (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                                  or (self.seq_dict[self.id_list[i]])[pos].upper() == "A" and
                                  (self.seq_dict[self.id_list[j]])[pos].upper() == "T"
                                  or (self.seq_dict[self.id_list[i]])[pos].upper() == "T" and
                                  (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                                  or (self.seq_dict[self.id_list[i]])[pos].upper() == "A" and
                                  (self.seq_dict[self.id_list[j]])[pos].upper() == "U"
                                  or (self.seq_dict[self.id_list[i]])[pos].upper() == "U" and
                                  (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                                  or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and
                                  (self.seq_dict[self.id_list[j]])[pos].upper() == "C"
                                  or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and
                                  (self.seq_dict[self.id_list[j]])[pos].upper() == "G"
                                  or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and
                                  (self.seq_dict[self.id_list[j]])[pos].upper() == "T"
                                  or (self.seq_dict[self.id_list[i]])[pos].upper() == "T" and
                                  (self.seq_dict[self.id_list[j]])[pos].upper() == "G"
                                  or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and
                                  (self.seq_dict[self.id_list[j]])[pos].upper() == "U"
                                  or (self.seq_dict[self.id_list[i]])[pos].upper() == "U" and
                                  (self.seq_dict[self.id_list[j]])[pos].upper() == "G"):

                                transversion += 1
                    try:
                        avg_sub[i][j] = (transition + 2 * transversion) / comparable_pos
                    except ZeroDivisionError:
                        avg_sub[i][j] = None

        else:
            param_a_final = param_a

        for i in range(len(self.id_list) - 1):
            for j in range(i + 1, len(self.id_list)):
                comparable_pos = 0
                transition = 0
                transversion = 0
                variance = 0

                for pos in range(self.seq_length):
                    if ((self.seq_dict[self.id_list[i]])[pos] != "-" and (self.seq_dict[self.id_list[i]])[pos] != "?"
                       and (self.seq_dict[self.id_list[j]])[pos] != "-" and (self.seq_dict[self.id_list[j]])[pos] != "?"):

                        comparable_pos += 1
                        trans_transv = 0

                        if ((self.seq_dict[self.id_list[i]])[pos].upper() == "A" and
                                (self.seq_dict[self.id_list[j]])[pos].upper() == "G"
                                or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and
                                (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                                or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and
                                (self.seq_dict[self.id_list[j]])[pos].upper() == "T"
                                or (self.seq_dict[self.id_list[i]])[pos].upper() == "T" and
                                (self.seq_dict[self.id_list[j]])[pos].upper() == "C"
                                or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and
                                (self.seq_dict[self.id_list[j]])[pos].upper() == "U"
                                or (self.seq_dict[self.id_list[i]])[pos].upper() == "U" and
                                (self.seq_dict[self.id_list[j]])[pos].upper() == "C"):

                            transition += 1
                            trans_transv = 1

                        elif ((self.seq_dict[self.id_list[i]])[pos].upper() == "A" and
                              (self.seq_dict[self.id_list[j]])[pos].upper() == "C"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and
                              (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "A" and
                              (self.seq_dict[self.id_list[j]])[pos].upper() == "T"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "T" and
                              (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "A" and
                              (self.seq_dict[self.id_list[j]])[pos].upper() == "U"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "U" and
                              (self.seq_dict[self.id_list[j]])[pos].upper() == "A"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and
                              (self.seq_dict[self.id_list[j]])[pos].upper() == "C"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and
                              (self.seq_dict[self.id_list[j]])[pos].upper() == "G"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and
                              (self.seq_dict[self.id_list[j]])[pos].upper() == "T"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "T" and
                              (self.seq_dict[self.id_list[j]])[pos].upper() == "G"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and
                              (self.seq_dict[self.id_list[j]])[pos].upper() == "U"
                              or (self.seq_dict[self.id_list[i]])[pos].upper() == "U" and
                              (self.seq_dict[self.id_list[j]])[pos].upper() == "G"):

                            transversion += 1
                            trans_transv = 2


                        if param_a is None and avg_sub[i][j] is not None:
                            variance += (avg_sub[i][j] - trans_transv) * (avg_sub[i][j] - trans_transv)


                if comparable_pos != 0:
                    transition_pos = transition / comparable_pos
                    transversion_pos = transversion / comparable_pos

                    if param_a is None:
                        variance = variance/comparable_pos
                        try:
                            param_a_final = (avg_sub[i][j]*avg_sub[i][j]) / variance
                        except ZeroDivisionError:
                            transversion_pos = 0.5

                    try:  # if transversion_pos == 0.5, a ValueError is triggered
                        distance = 0.5 * param_a_final * (
                                    math.pow(1 - (2 * transition_pos) - transversion_pos, -1 / param_a_final) + (
                                        0.5 * math.pow(1 - (2 * transversion_pos), -1 / param_a_final)) - 1.5)
                    except (ValueError, ZeroDivisionError):
                        self.distance_report.append("ZeroDivisionError")
                        self.dist_mat[self.id_list[i]][self.id_list[j]] = "-"
                        self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

                    else:
                        self.dist_mat[self.id_list[i]][self.id_list[j]] = distance
                        self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

                else:
                    self.dist_mat[self.id_list[i]][self.id_list[j]] = "-"
                    self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

        return self.dist_mat


    def get_det(self, sub_mat):
        det = 1
        for i in range(4):
            det *= sub_mat[i][i]
            temp = 1 / sub_mat[i][i]
            sub_mat[i][i] = 1
            for j in range(4):
                sub_mat[i][j] *= temp
            for j in range(4):
                if j != i:
                    temp = sub_mat[j][i]
                    sub_mat[j][i] = 0
                    for k in range (4):
                        sub_mat[j][k] -= temp * sub_mat[i][k]

        if det <= 0:
            return (None)
        else:
            return (math.log(det))

    def LogDet(self):
        sub_mat = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
        sites_seq1 = [0, 0, 0, 0]
        sites_seq2 = [0, 0, 0, 0]
        for i in range(len(self.id_list)): # replace "?" by "-" in all sequences
            self.seq_dict[self.id_list[i]].replace("?", "-")
        for i in range(len(self.id_list) - 1):
            for j in range(i + 1, len(self.id_list)):
                for k in range (4):
                    sites_seq1[k] = 0
                    sites_seq2[k] = 0
                    for l in range (4):
                        sub_mat[k][l] = 0

                for pos in range(self.seq_length):
                    if (self.seq_dict[self.id_list[i]])[pos].upper() == "A" or (self.seq_dict[self.id_list[i]])[pos].upper() == "-":
                        sites_seq1[0] += 1
                    if (self.seq_dict[self.id_list[i]])[pos].upper() == "C":
                        sites_seq1[1] += 1
                    if (self.seq_dict[self.id_list[i]])[pos].upper() == "G":
                        sites_seq1[2] += 1
                    if (self.seq_dict[self.id_list[i]])[pos].upper() == "T" or (self.seq_dict[self.id_list[i]])[pos].upper() == "U":
                        sites_seq1[3] += 1

                    if (self.seq_dict[self.id_list[j]])[pos].upper() == "A" or (self.seq_dict[self.id_list[j]])[pos].upper() == "-":
                        sites_seq2[0] += 1
                    if (self.seq_dict[self.id_list[j]])[pos].upper() == "C":
                        sites_seq2[1] += 1
                    if (self.seq_dict[self.id_list[j]])[pos].upper() == "G":
                        sites_seq2[2] += 1
                    if (self.seq_dict[self.id_list[j]])[pos].upper() == "T" or (self.seq_dict[self.id_list[j]])[pos].upper() == "U":
                        sites_seq2[3] += 1

                    # get subs
                    if (((self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "-")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "-" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "-" and (self.seq_dict[self.id_list[j]])[pos].upper() == "-")):
                        sub_mat[0][0] += 1
                    elif (((self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "-" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C")):
                        sub_mat[0][1] += 1
                    elif (((self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "-" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G")):
                        sub_mat[0][2] += 1
                    elif (((self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "T")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "A" and (self.seq_dict[self.id_list[j]])[pos].upper() == "U")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "-" and (self.seq_dict[self.id_list[j]])[pos].upper() == "T")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "-" and (self.seq_dict[self.id_list[j]])[pos].upper() == "U")):
                        sub_mat[0][3] += 1
                    elif (((self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "-")):
                        sub_mat[1][0] += 1
                    elif (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C":
                        sub_mat[1][1] += 1
                    elif (self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G":
                        sub_mat[1][2] += 1
                    elif (((self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "T")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "C" and (self.seq_dict[self.id_list[j]])[pos].upper() == "U")):
                        sub_mat[1][3] += 1
                    elif (((self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "-")):
                        sub_mat[2][0] += 1
                    elif (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C":
                        sub_mat[2][1] += 1
                    elif (self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G":
                        sub_mat[2][2] += 1
                    elif (((self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "T")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "G" and (self.seq_dict[self.id_list[j]])[pos].upper() == "U")):
                        sub_mat[2][3] += 1
                    elif (((self.seq_dict[self.id_list[i]])[pos].upper() == "T" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "T" and (self.seq_dict[self.id_list[j]])[pos].upper() == "-")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "U" and (self.seq_dict[self.id_list[j]])[pos].upper() == "A")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "U" and (self.seq_dict[self.id_list[j]])[pos].upper() == "-")):
                        sub_mat[3][0] += 1
                    elif (((self.seq_dict[self.id_list[i]])[pos].upper() == "T" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "U" and (self.seq_dict[self.id_list[j]])[pos].upper() == "C")):
                        sub_mat[3][1] += 1
                    elif (((self.seq_dict[self.id_list[i]])[pos].upper() == "T" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "U" and (self.seq_dict[self.id_list[j]])[pos].upper() == "G")):
                        sub_mat[3][2] += 1
                    elif (((self.seq_dict[self.id_list[i]])[pos].upper() == "T" and (self.seq_dict[self.id_list[j]])[pos].upper() == "T")
                       or ((self.seq_dict[self.id_list[i]])[pos].upper() == "U" and (self.seq_dict[self.id_list[j]])[pos].upper() == "T")):  # not sure why the U is not included here...
                        sub_mat[3][3] += 1

                try:
                    det = self.get_det(sub_mat)
                except:
                    det = None

                if det is None:
                    self.distance_report.append("log of negative number")
                    self.dist_mat[self.id_list[i]][self.id_list[j]] = "-"
                    self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

                else:
                    distance = -0.25 * (det - 0.5 * (math.log(sites_seq1[0]) + math.log(sites_seq1[1])
                                                      + math.log(sites_seq1[2]) + math.log(sites_seq1[3])
                                                      + math.log(sites_seq2[0]) + math.log(sites_seq2[1])
                                                      + math.log(sites_seq2[2]) + math.log(sites_seq2[3])))

                    self.dist_mat[self.id_list[i]][self.id_list[j]] = distance
                    self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

        return (self.dist_mat)


    def get_frequencies(self):
        gaps =0
        ts_tv_ratio = 2
        freq_dict = {
            "freq_a" : 0,
            "freq_c": 0,
            "freq_g": 0,
            "freq_t": 0,
            "freq_r" : 0,
            "freq_y": 0,
            "freq_ar": 0,
            "freq_gr": 0,
            "freq_cy": 0,
            "freq_ty": 0,
        }

        for i in range(len(self.id_list)):
            for pos in range(self.seq_length):
                if (self.seq_dict[self.id_list[i]])[pos] == "?" or (self.seq_dict[self.id_list[i]])[pos] == "-":
                    gaps += 1

                elif (self.seq_dict[self.id_list[i]])[pos].upper() == "A":
                    freq_dict["freq_a"] += 1
                elif (self.seq_dict[self.id_list[i]])[pos].upper() == "C":
                    freq_dict["freq_c"] += 1
                elif (self.seq_dict[self.id_list[i]])[pos].upper() == "G":
                    freq_dict["freq_g"] += 1
                elif (self.seq_dict[self.id_list[i]])[pos].upper() == "T":
                    freq_dict["freq_t"] += 1

        total_pos = (len(self.id_list) * self.seq_length) - gaps
        freq_dict["freq_a"] = freq_dict.get("freq_a") / total_pos
        freq_dict["freq_c"] = freq_dict.get("freq_c") / total_pos
        freq_dict["freq_g"] = freq_dict.get("freq_g") / total_pos
        freq_dict["freq_t"] = freq_dict.get("freq_t") / total_pos
        freq_dict["freq_r"] = freq_dict.get("freq_a") + freq_dict.get("freq_g")
        freq_dict["freq_y"] = freq_dict.get("freq_c") + freq_dict.get("freq_t")
        freq_dict["freq_ar"] = freq_dict.get("freq_a") / freq_dict.get("freq_r")
        freq_dict["freq_gr"] = freq_dict.get("freq_g") / freq_dict.get("freq_r")
        freq_dict["freq_cy"] = freq_dict.get("freq_c") / freq_dict.get("freq_y")
        freq_dict["freq_ty"] = freq_dict.get("freq_t") / freq_dict.get("freq_y")

        temp_aa = ts_tv_ratio * freq_dict.get("freq_r") * freq_dict.get("freq_y") - freq_dict.get("freq_a") * freq_dict.get("freq_g") - freq_dict.get("freq_c") * freq_dict.get("freq_t")
        temp_bb = freq_dict.get("freq_a") * freq_dict.get("freq_gr") + freq_dict.get("freq_c") * freq_dict.get("freq_ty")
        temp_xi = temp_aa / (temp_aa + temp_bb)
        inter_xv = 1 - temp_xi

        if temp_xi < 0:
            temp_xi = 0
            inter_xv = 1
            print ("This transition/transversion ratio is impossible with these base frequencies")
            ts_tv_ratio = (freq_dict.get("freq_a") * freq_dict.get("freq_g") + freq_dict.get("freq_c") * freq_dict.get("freq_t") / (freq_dict.get("freq_r") * freq_dict.get("freq_y")))
            print ("Transition/transversion ratio reset. New ratio is: ", ts_tv_ratio)

        if freq_dict.get("freq_a") <= 0 :
            freq_dict["freq_a"] = 0.000001
        if freq_dict.get("freq_c") <= 0 :
            freq_dict["freq_c"] = 0.000001
        if freq_dict.get("freq_g") <= 0 :
            freq_dict["freq_g"] = 0.000001
        if freq_dict.get("freq_t") <= 0 :
            freq_dict["freq_t"] = 0.000001

        frac_change = temp_xi * (2 * freq_dict.get("freq_a") * freq_dict.get("freq_gr") + 2 * freq_dict.get("freq_c") * freq_dict.get("freq_ty")) + \
                      inter_xv * (1 - freq_dict.get("freq_a") * freq_dict.get("freq_a") - freq_dict.get("freq_c") * freq_dict.get("freq_c") -
                      freq_dict.get("freq_g") * freq_dict.get("freq_g") - freq_dict.get("freq_t") * freq_dict.get("freq_a"))

        #  add to dict the newly created variables before the return
        freq_dict["ts_tv_ratio"] = ts_tv_ratio
        freq_dict["frac_change"] = frac_change
        freq_dict["inter_xv"] = inter_xv

        return (freq_dict)


    def F84(self):
        prod1_list = []
        prod2_list = []
        prod3_list = []
        for pos in range(self.seq_length):
            prod1_list.append(None)
            prod2_list.append(None)
            prod3_list.append(None)

        freq_dict = self.get_frequencies()
        
        for i in range(len(self.id_list) - 1):
            for j in range(i + 1, len(self.id_list)):
                for pos in range(self.seq_length):
                    if (self.seq_dict[self.id_list[i]])[pos] == "?" or (self.seq_dict[self.id_list[i]])[pos] == "-":
                        sum_freq1 = 1
                        temp_freq_a = freq_dict.get("freq_a")
                        temp_freq_c = freq_dict.get("freq_c")
                        temp_freq_g = freq_dict.get("freq_g")
                        temp_freq_t = freq_dict.get("freq_t")     
                    elif (self.seq_dict[self.id_list[i]])[pos].upper() == "A":
                        sum_freq1 = freq_dict.get("freq_a")
                        temp_freq_a = freq_dict.get("freq_a")
                        temp_freq_c = 0
                        temp_freq_g = 0
                        temp_freq_t = 0
                    elif (self.seq_dict[self.id_list[i]])[pos].upper() == "C":
                        sum_freq1 = freq_dict.get("freq_c")
                        temp_freq_a = 0
                        temp_freq_c = freq_dict.get("freq_c")
                        temp_freq_g = 0
                        temp_freq_t = 0
                    elif (self.seq_dict[self.id_list[i]])[pos].upper() == "G":
                        sum_freq1 = freq_dict.get("freq_g")
                        temp_freq_a = 0
                        temp_freq_c = 0
                        temp_freq_g = freq_dict.get("freq_g")
                        temp_freq_t = 0
                    elif (self.seq_dict[self.id_list[i]])[pos].upper() == "T":
                        sum_freq1 = freq_dict.get("freq_t")
                        temp_freq_a = 0
                        temp_freq_c = 0
                        temp_freq_g = 0
                        temp_freq_t = freq_dict.get("freq_t")

                    if (self.seq_dict[self.id_list[j]])[pos] == "?" or (self.seq_dict[self.id_list[j]])[pos] == "-":
                        sum_freq2 = 1
                        a = 1
                        c = 1
                        g = 1
                        t = 1
                    elif (self.seq_dict[self.id_list[j]])[pos].upper() == "A":
                        sum_freq2 = freq_dict.get("freq_a")
                        a = 1
                        c = 0
                        g = 0
                        t = 0
                    elif (self.seq_dict[self.id_list[j]])[pos].upper() == "C":
                        sum_freq2 = freq_dict.get("freq_c")
                        a = 0
                        c = 1
                        g = 0
                        t = 0
                    elif (self.seq_dict[self.id_list[j]])[pos].upper() == "G":
                        sum_freq2 = freq_dict.get("freq_g")
                        a = 0
                        c = 0
                        g = 1
                        t = 0
                    elif (self.seq_dict[self.id_list[j]])[pos].upper() == "T":
                        sum_freq2 = freq_dict.get("freq_t")
                        a = 0
                        c = 0
                        g = 0
                        t = 1

                    # append to list at index pos
                    prod1_list[pos] = (sum_freq1 * sum_freq2)
                    prod2_list[pos] = ((temp_freq_a + temp_freq_g) * (a * freq_dict.get("freq_ar") + g * freq_dict.get("freq_gr")) +
                                      (temp_freq_c + temp_freq_t) * (c * freq_dict.get("freq_cy") + t * freq_dict.get("freq_ty")))
                    prod3_list[pos] = (temp_freq_a * a + temp_freq_c * c + temp_freq_g * g + temp_freq_t * t)

                tt = 0.1
                delta = 0.1
                it = 1
                while (it < 100 and math.fabs(delta) > 0.00002):
                    slope = 0
                    if tt > 0:
                        lz = -tt
                        y1 = 1 - math.exp(freq_dict.get("inter_xv") * lz)
                        z1yy = math.exp(freq_dict.get("inter_xv") * lz) - math.exp(lz)
                        z1xv = math.exp(freq_dict.get("inter_xv") * lz) * freq_dict.get("inter_xv")
                        for pos in range(self.seq_length):
                            slope += (math.exp(lz) * (prod2_list[pos] - prod3_list[pos]) + z1xv * (prod1_list[pos] - prod2_list[pos])) / (prod3_list[pos] * math.exp(lz) + prod2_list[pos] * z1yy + prod1_list[pos] * y1)

                    if slope < 0:
                        delta = math.fabs(delta) / -2
                    else:
                        delta = math.fabs(delta)
                    tt += delta
                    it += 1

                if delta >= 0.1:
                    self.distance_report.append("Distance Value Error")
                    self.dist_mat[self.id_list[i]][self.id_list[j]] == "-"
                    self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

                else:
                    self.dist_mat[self.id_list[i]][self.id_list[j]] = tt * freq_dict.get("frac_change")
                    self.dist_mat[self.id_list[j]][self.id_list[i]] = self.dist_mat[self.id_list[i]][self.id_list[j]]

        return (self.dist_mat)

    def get_dist_mat(self):
        return self.dist_mat

    def get_distance_report(self):
        return self.distance_report


