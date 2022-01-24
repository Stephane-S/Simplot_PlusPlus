import pandas as pd
import numpy as np
import pickle

class RecombinationDetection:
    def __init__(self, dist_dict, global_sim_dict, group_ids):
        self.recombination_df = None
        self.recombination_df = self.recombination_detect(dist_dict, global_sim_dict, group_ids)

    def recombination_detect(self, dist_dict, global_sim_dict, group_ids):
        # remove spaces from ids/refseq in global_sim_dict
        temp_dict = {}
        for refseq, sub_dict in global_sim_dict.items():
            #new_refseq = refseq.replace(" ", "_")
            new_refseq = refseq
            temp_sub_dict = {}
            for id, value in sub_dict.items():
                #new_id = id.replace(" ", "_")
                new_id = id
                temp_sub_dict[new_id] = value

            temp_dict[new_refseq] = temp_sub_dict

        global_sim_dict = temp_dict
        result_df = self.filter_dfs(dist_dict, global_sim_dict, group_ids)
        return result_df

    def filter_dfs(self, dist_dict, global_sim_dict, group_ids):
        result_list = []
        for refseq, df in dist_dict.items():  # iterate through the distance df by refseq
            real_refseq = refseq
            mean_sim_dict = self.get_avg_by_column(df)
            for id, data in df.iterrows():  # iterate through the distances pairs (refseq - id) over all positions
                real_id = id
                for key, value in group_ids.items():
                    if refseq == value:
                        real_refseq = key
                    elif id == value:
                        real_id = key
                try:
                    global_sim = global_sim_dict[real_refseq][real_id] / 100
                except KeyError:
                    global_sim = global_sim_dict[real_id][real_refseq] / 100

                #  filter out sub_mean distances (pressure for relatively high-similarity detection)
                mean = data.mean()
                filtered_series = data.where(data>mean)
                for idx, val in filtered_series.iteritems():
                    if val <= mean_sim_dict[idx]:
                        filtered_series[idx]= np.nan

                # compute score --> (window distance / whole alignment distance) / average value at position in the df
                for pos, value in filtered_series.items():
                    try:
                        filtered_series[pos] = (value/global_sim) / mean_sim_dict[pos]
                    except ZeroDivisionError:
                        filtered_series[pos] = 0

                # go through series and add up consecutive scores if in 20% top scores
                result_list = self.explore_loop(filtered_series, id, refseq, result_list)

        result_list = self.remove_duplicates(result_list)
        result_df = pd.DataFrame(columns=["Group 1", 'Group 2', "start position", "end position", "score"], data=result_list)
        result_df = result_df.sort_values("score", ascending=False)

        return result_df

    def remove_duplicates(self, raw_list):
        #sublist index: [refseq, id, first_pos, last_pos, score]
        new_list = []
        for i in range(len(raw_list)-1):
            refseq_a = raw_list[i][0]
            id_a = raw_list[i][1]
            duplicate = False
            bool_copy = True

            # ####
            # #check if reverse already in filtered list
            # for filtered in new_list:
            #     if refseq_a == filtered[1] and id_a == filtered[0]:
            #         if filtered[2] <= raw_list[i][2] <= filtered[3] or filtered[2] <= raw_list[i][3] <= filtered[3]:
            #             bool_copy = False
            #             duplicate = True
            #
            # if bool_copy is True and duplicate is False:
            #     for j in range(i + 1, len(raw_list)):
            #         if refseq_a == raw_list[j][1] and id_a == raw_list[j][0]:
            #             if raw_list[j][2] <= raw_list[i][2] <= raw_list[j][3] or raw_list[j][2] <= raw_list[i][3] <= \
            #                     raw_list[j][3]:
            #                 duplicate = True
            #
            #                 if raw_list[i][4] > raw_list[j][4]:
            #                     new_list.append(raw_list[i])
            #                 else:
            #                     new_list.append((raw_list[j]))
            #
            #
            # ####

            for j in range(i+1, len(raw_list)):
                if refseq_a == raw_list[j][1] and id_a == raw_list[j][0]:
                    if raw_list[j][2] <= raw_list[i][2] <= raw_list[j][3] or raw_list[j][2] <= raw_list[i][3] <= raw_list[j][3]:
                        duplicate = True

                        if raw_list[i][4] > raw_list[j][4]:
                            new_list.append(raw_list[i])
                        else:
                            new_list.append((raw_list[j]))

            if duplicate is False and bool_copy is False:
                new_list.append(raw_list[i])

        new_list = [list(x) for x in set([tuple(x) for x in new_list])]

        return new_list


    def explore_loop(self, filtered_series, id, refseq, result_list):
        s_length = len(filtered_series.index)
        filtered = filtered_series.nlargest(int(s_length * 0.2), keep="all")
        filtered.dropna()
        tail = filtered.tail(1)
        if len(tail.index) > 0:
            for pos, value in tail.items():  # only 1 item - the tail
                threshold = value

            filtered_series = filtered_series.where(filtered_series >= threshold)

            score = 0
            first_pos = None
            last_pos = None
            for pos, value in filtered_series.items():
                if not np.isnan(value):
                    if first_pos is None:
                        first_pos = pos
                    else:
                        last_pos = pos

                    score += value

                else:
                    if first_pos is not None and last_pos is not None:
                        temp_list = [refseq, id, first_pos, last_pos, round(score, 2)]
                        result_list.append(temp_list)
                        if round(score, 2) > 40:
                            print (temp_list)
                        first_pos, last_pos, score = None, None, 0

        return result_list

    def get_avg_by_column(self, df):
        mean_sim_dict = df.mean(axis=0).to_dict()
        return mean_sim_dict

    def get_recombination_detect_results(self):
        return self.recombination_df
