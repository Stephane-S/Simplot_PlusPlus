import pathlib
from Bio import SeqIO


class FindSitesAnalysis:
    def __init__(self, filepath, filetype, query, ref1, ref2, outgroup): # add group class, progress bar

        self.initial_setup(filepath, query, ref1, ref2, outgroup)
        result_dict, count = self.findsites(filepath, filetype, query, ref1, ref2, outgroup)
        self.write_output(result_dict, count)

    def initial_setup(self, filepath, query, ref1, ref2, outgroup):
        input_path = pathlib.Path(filepath)

        with open("temp_findSite.txt", "w") as data_file:
            data_file.write("input file: " + str(input_path) + "\n\n" +
                            "Using the letters A, B, C and D as placeholders:" + "\n" +
                            "A = " + query + "\n" +
                            "B = " + ref1 + "\n" +
                            "C = " + ref2 + "\n" +
                            "D = " + outgroup + "\n\n" +
                            "There are 3 possible bifurcating trees:" + "\n\n"+
                            "     1          2         3" + "\n" +
                            "  A     C    A     B   A     B" + "\n" +
                            "   \___/      \___/     \___/ " + "\n" +
                            "   /   \      /   \     /   \\" + "\n" +
                            "  B     D    C     D   D     C" + "\n" +
                            "\n\n\n")



    def extract_sequences(self, filepath, filetype, query, ref1, ref2, outgroup):
        records = SeqIO.parse(filepath, filetype)
        for record in records:
            if record.id == str(query):
                seq_query = str(record.seq)
            elif record.id == str(ref1):
                seq_ref1 = str(record.seq)
            elif record.id == str(ref2):
                seq_ref2 = str(record.seq)
            elif record.id == str(outgroup):
                seq_outgroup = str(record.seq)

        return seq_query, seq_ref1, seq_ref2, seq_outgroup

    def findsites(self, filepath, filetype, query, ref1, ref2, outgroup):
        seq_query, seq_ref1, seq_ref2, seq_outgroup = self.extract_sequences(filepath, filetype, query, ref1, ref2, outgroup)

        # dict in following format: "position" :[seq_query, seq_ref1, seq_ref2, seq_outgroup, tree]
        result_dict = {}
        count = 0
        for i in range (len(seq_query)):
            tree = 0
            if seq_query[i] == seq_ref1[i] and seq_ref2[i] == seq_outgroup[i] and seq_query[i] != seq_ref2[i] \
                    and seq_query[i] != "-" and seq_query[i] != "?" and seq_ref2[i] != "-" and seq_ref2[i] != "?":
                tree = "1"

            elif seq_query[i] == seq_ref2[i] and seq_ref1[i] == seq_outgroup[i] and seq_query[i] != seq_ref1[i] \
                    and seq_query[i] != "-" and seq_query[i] != "?" and seq_ref1[i] != "-" and seq_ref1[i] != "?":
                tree = "2"

            elif seq_query[i] == seq_outgroup[i] and seq_ref1[i] == seq_ref2[i] and seq_query[i] != seq_ref1[i] \
                    and seq_query[i] != "-" and seq_query[i] != "?" and seq_ref1[i] != "-" and seq_ref1[i] != "?":
                tree = "3"

            if tree != 0:
                count += 1
                #print ("position:" ,i+1, seq_query[i], seq_ref1[i], seq_ref2[i], seq_outgroup[i], tree)
                temp_list = [seq_query[i], seq_ref1[i], seq_ref2[i], seq_outgroup[i], tree]
                result_dict[i+1] = temp_list


        return result_dict, count


    def write_output(self, result_dict, count):
        with open("temp_findSite.txt", "a") as data_file:
            data_file.write("Total sites: " + str(count) + "\n" +"pos \tA \tB \tC \t D\t Tree\n" +
                            "---    ---     ---     ---      ---      -----\n")

        # dict in following format: "position" :[seq_query, seq_ref1, seq_ref2, seq_outgroup, tree]
            for position, values in result_dict.items():
                data_file.write(str(position) + "\t" + values[0] + "\t" +values[1] + "\t" + values[2]+ "\t " + values[3] + "\t  " + values[4] + "\n")





