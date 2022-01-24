from Bio import pairwise2 as pw2
import networkx as nx
from lib.Network.Bokeh_graph_functions import get_color_palette_dicts


class NetworkAnalysis:
    def __init__(self, consensus_dict, group_dict, dist_dict, step):
        self.consensus_dict = consensus_dict
        self.group_dict = group_dict
        self.sim_dict = self.calc_similarity()
        self.HGT_detect_dict = self.HGT_detect_by_max_value_change(dist_dict)
        self.step = int(step)
        self.dist_dict = dist_dict


    def add_groups_to_graph(self, sim_dict, graph, group_color):
        for key in sim_dict.keys():
            # clean_key = key.replace(" ", "_")
            clean_key = key
            graph.add_node(clean_key, group_name=clean_key, group_size=len(self.group_dict[key]),
                           group_content=self.group_dict[key], color=group_color[key])
        return graph

    def add_global_sim_edges(self, sim_dict, graph, seq_length, threshold=0):
        reds101_dict, reds101, gray101_dict, gray101 = get_color_palette_dicts()
        for key1, subdict in sim_dict.items():
            for key2, match in subdict.items():
                # key1 = key1.replace(" ", "_")
                # key2 = key2.replace(" ", "_")
                if match >= threshold:
                    graph.add_edge(key1, key2, similarity=[int(match)], color=gray101_dict[int(match)], sim_type="global", pos_range=[0, seq_length], c_map=int(match), line_alpha=0.8, weight=float(match/100))

        return graph


    def HGT_detect_by_max_value_change(self, dist_dict):
        HGT_dict = {}
        for refseq, dist_df in dist_dict.items():
            temp_dict = {}
            column_list = list(dist_df.columns.values)
            for column in column_list:
                idmax = dist_df[column].idxmax()
                value_max = dist_df[column].max()
                if isinstance(idmax, str): # possibility of float nan idmax if no valid max value
                    if idmax in temp_dict:
                        temp_dict[idmax].append([int(column), value_max])
                    else:
                        temp_dict[idmax] = [[int(column), value_max]]

            HGT_dict[refseq] = temp_dict

        # for refseq, subdict in HGT_dict.items():   ### filters to make sure atleast 2 consecutive pos
        #     for group, col_list in subdict.items():
        #         del_list = []
        #         for i in range(len(col_list) - 1):
        #             if i == 0:
        #                 if col_list[i] + step != col_list[i + 1]:
        #                     del_list.append(i)
        #
        #             elif i == len(col_list):
        #                 if col_list[i] + step != col_list[i - 1]:
        #                     del_list.append(i)
        #
        #             else:
        #                 if col_list[i] + step != col_list[i + 1] and col_list[i] - step != col_list[i - 1]:
        #                     del_list.append(i)
        #
        #         new_list = [i for j, i in enumerate(col_list) if j not in del_list]
        #         if len(new_list) < min_list_length:
        #             new_list = []
        #         subdict[group] = new_list


        return HGT_dict

    # def find_pos_range(self, pos_list, pos_in_range):
    #     for i in range(pos_list):
    #         if pos_list[i] + self.step == pos_list[i+1]:

    def find_pos_ranges(self, pos_list):
        result = []
        if not pos_list:
            return result
        idata = iter(pos_list)
        first = prev = next(idata)
        for following in idata:
            if following - prev == self.step:
                prev = following
            else:
                result.append((first, prev))
                first = prev = following
        # There was either exactly 1 element and the loop never ran,
        # or the loop just normally ended and we need to account
        # for the last remaining range.
        result.append((first, prev))
        return result


    def create_edge_for_max_value_change(self, HGT_detect_dict, graph, min_range, max_range):
        i = 0
        reds101_dict, reds101, gray101_dict, gray101 = get_color_palette_dicts()
        for refseq, subdict in HGT_detect_dict.items():
            for node, pos_value_list in subdict.items():
                pos_in_range = []
                sim_list = []
                # pos_range = self.find_pos_ranges(pos_list)
                for pos, value_max in pos_value_list:
                    if min_range <= pos <= max_range:
                        pos_in_range.append(pos)
                        # if math.isnan(value_max):
                        #     value_max = 0
                        sim_list.append(int(value_max*100))
                if len(pos_in_range) > 0:
                    # clean_refseq = refseq.replace(" ", "-")
                    # clean_node = node.replace(" ", "-")
                    clean_refseq = refseq
                    clean_node = node
                    max_value = max(sim_list)
                    if max_value < 0:
                        raise KeyError
                    graph.add_edge(clean_refseq, clean_node, similarity=sim_list, color=reds101_dict[max_value], sim_type="local", pos_range=pos_in_range, c_map=max_value, weight=float(max_value/100), line_alpha=0.8) # pos_range
                    i = i+1
        return graph

    def create_graph(self, seq_length, group_colors):
        graph = nx.MultiGraph()
        graph = self.add_groups_to_graph(self.sim_dict, graph, group_colors)
        graph_global_edge = self.add_global_sim_edges(self.sim_dict, graph, seq_length)

        graph1 = nx.MultiDiGraph()
        graph_local_edge = self.add_groups_to_graph(self.sim_dict, graph1, group_colors)

        graph_local_edge = self.create_edge_for_max_value_change(self.HGT_detect_dict, graph_local_edge, 0, seq_length)

        return graph_global_edge, graph_local_edge

    def calc_similarity(self, pairwise_align=False):
        dict = self.consensus_dict.copy()
        keys = list(dict.keys())
        sim_dict = {}
        for i in range(len(keys)):
            temp_dict = {}
            j = i + 1
            seq1 = dict[keys[i]]
            while j < len(keys):
                seq2 = dict[keys[j]]
                if pairwise_align is True:
                    global_align = pw2.align.globalxx(seq1, seq2)
                    seq_length = min(len(seq1), len(seq2))
                    matches = global_align[0][2]
                    percent_match = (matches / seq_length) * 100

                else:
                    percent_match = self.quick_similarity(seq1, seq2)

                temp_dict[keys[j]] = round(percent_match, 2)
                j += 1

            sim_dict[keys[i]] = temp_dict

        return sim_dict

    def quick_similarity(self, seq1, seq2):
        seq_length = min(len(seq1), len(seq2))
        score = 0
        for i in range(seq_length):
            if seq1[i] == seq2[i]:
                score += 1

        return (score / seq_length) * 100

    def get_global_sim_dict(self):
        return self.sim_dict
