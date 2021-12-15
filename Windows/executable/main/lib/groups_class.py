from Bio import SeqIO
import pathlib

class Groups:
    def __init__(self, file_path, file_format, datatype):
        self.file_path = pathlib.Path(file_path)
        self.file_format = file_format
        self.datatype = datatype
        self.seq_list = self.list_seq()
        self.groups_dict = {}
        self.groups_colors = {}
        self.ungrouped_seq = self.seq_list.copy()
        print ("Groups class instance created")

    def add_group_color(self, group_name, color):
        self.groups_colors[group_name] = color

    def list_seq(self):
        seq_list = []

        for record in SeqIO.parse(self.file_path, self.file_format):
            seq_list.append(record.id)
        return seq_list

    def add_group(self, group_name):
        self.groups_dict[group_name]= []
        #self.groups_colors[group_name] = None
        #print (group_name + " added")

    def remove_group(self, group_name):
        if group_name is not None:
            seq_list = self.groups_dict[group_name]
            self.ungrouped_seq = self.ungrouped_seq + seq_list

            self.groups_dict.pop(group_name)
            self.groups_colors.pop(group_name)
            #print (group_name + " removed")


    def change_group_name(self, old, new):
        if old != new:
            self.groups_dict[new] = self.groups_dict[old]
            self.groups_colors[new] = self.groups_colors.pop(old)
            del self.groups_dict[old]

    def update_group(self, group, seq):  #seq is a list here
        new_seq = [item for item in seq if item not in self.groups_dict[group]]  #get seqs added by user
        removed_seq = [item for item in self.groups_dict[group] if item not in seq] #get seqs removed by user

        for seq in removed_seq:
            self.groups_dict[group].remove(seq)

        self.groups_dict[group] = self.groups_dict[group]+ new_seq
        self.ungrouped_seq = self.ungrouped_seq + removed_seq

        for seq in new_seq:
            self.ungrouped_seq.remove(seq)

        #print ("updated")
        # for i, j in self.return_groups_dict().items():
        #     print (i,j)
        # print("---------------------------------------------")

    def check_if_empty_group(self):
        empty_group = False
        for group_name, content in self.groups_dict.items():
            if content is None or content == []:
                empty_group = True

        return empty_group

    def set_groups_dict(self, dict):
        self.groups_dict = dict

    def remove_seq_from_group(self, group, seq):
        self.groups_dict[group].remove(seq)
        self.ungrouped_seq.append(seq)

    def get_ungrouped_seq(self):
        return self.ungrouped_seq

    def get_seq_in_group(self, group):
        return self.groups_dict[group]

    def return_groups_dict(self):
        return self.groups_dict.copy()

    def get_group_names(self):
        return self.groups_dict.keys()

    def get_file_path(self):
        return self.file_path

    def get_file_format(self):
        return self.file_format

    def get_seq_list(self):
        return self.seq_list

    def get_datatype(self):
        return self.datatype

    def get_groups_colors(self):
        #print ("giving groups_colors", self.groups_colors)
        return self.groups_colors

    def show_groups_colors(self):
        print (self.groups_colors.items())
