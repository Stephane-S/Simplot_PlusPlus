try:
    from subprocess import Popen, PIPE,CREATE_NO_WINDOW
except ImportError:
    from subprocess import Popen
import pathlib
import os
import time

def call_seqboot(seqboot_path, infile, bootstrap):
    path = pathlib.Path(seqboot_path)
    if path.exists():
        if os.name == "nt":
            p = Popen(str(path), stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding="UTF8", creationflags=CREATE_NO_WINDOW)
        else:
            p = Popen(str(path), stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding="UTF8")
        command = infile
        p.stdin.write(str(command) + "\n")

        if bootstrap != 100:
            command = "r"  # replicates amount setting
            p.stdin.write(command + "\n")

            command = str(bootstrap)  # desired amount
            p.stdin.write(command + "\n")

        command = "Y\n"  # launch
        p.stdin.write(command)

        command = "7\n"  # seed
        p.stdin.write(command)
        (output, err) = p.communicate()
        p.wait()
        p.kill()
        #p.stdin.flush()

def call_dnadist(dnadist_path, bootstrap, distance_model, t_t):
    path = pathlib.Path(dnadist_path)
    if path.exists():
        if os.name == "nt":
            p = Popen(str(path), stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding="UTF8", creationflags=CREATE_NO_WINDOW)
        else:
            p = Popen(str(path), stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding="UTF8")

        command = "lib/Bootscan/infile"
        p.stdin.write(command + "\n")

        command = "M"  # multiple data sets
        p.stdin.write(command + "\n")

        command = "D"  # multiple data sets
        p.stdin.write(command + "\n")

        command = str(bootstrap)  # bootstrap amount
        p.stdin.write(command + "\n")

        command = "2"  # no indication print
        p.stdin.write(command + "\n")

        if distance_model != "F84":
            command = "D"  # sets distance as kimura
            p.stdin.write(command + "\n")
            if distance_model != "Kimura":
                command = "D"  # sets distance as JC
                p.stdin.write(command + "\n")
                if distance_model != "Jukes-Cantor":
                    command = "D"  # sets distance as LogDet
                    p.stdin.write(command + "\n")

        if float(t_t) != 2.0:
            command = "T"  # t/t menu
            p.stdin.write(command + "\n")

            command = str(t_t)  # enter user t_t
            p.stdin.write(command + "\n")

        command = "Y\n"  # launch
        p.stdin.write(command)
        (output, err) = p.communicate()
        p.wait()
        p.kill()
        #p.stdin.flush()


def call_neighbor(neighbor_path, bootstrap, tree_model):
    path = pathlib.Path(neighbor_path)
    if path.exists():
        if os.name == "nt":
            p = Popen(str(path), stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding="UTF8", creationflags=CREATE_NO_WINDOW)
        else:
            p = Popen(str(path), stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding="UTF8")

        command = "lib/Bootscan/infile"
        p.stdin.write(command + "\n")

        command = "M"  # multiple data sets
        p.stdin.write(command + "\n")

        command = str(bootstrap)  # bootstrap amount
        p.stdin.write(command + "\n")

        command = str(7)  # seed
        p.stdin.write(command + "\n")

        if tree_model != "Neighbor-Joining":
            command = "N"  # modify tree model to UPGMA
            p.stdin.write(command + "\n")

        command = "2"  # no indication print
        p.stdin.write(command + "\n")

        command = "Y\n"  # launch
        p.stdin.write(command)
        (output, err) = p.communicate()
        p.wait()

        p.kill()
        #p.stdin.flush()

def call_consense(consense_path):
    path = pathlib.Path(consense_path)
    if path.exists():
        if os.name == "nt":
            p = Popen(str(path), stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding="UTF8", creationflags=CREATE_NO_WINDOW)
        else:
            p = Popen(str(path), stdin=PIPE, stdout=PIPE, stderr=PIPE, encoding="UTF8")

        command = "lib/Bootscan/intree"
        p.stdin.write(command + "\n")

        command = "2"  # no indication print
        p.stdin.write(command + "\n")

        command = "Y\n"  # launch
        p.stdin.write(command)
        (output, err) = p.communicate()
        p.wait()
        p.kill()
        #p.stdin.flush()


def extract_cons_tree_sets(recursive = 0):
    cons_tree_sets_dict = {}
    species_substring = ". ID"
    species_ordered_list = []
    path1 = pathlib.Path("outfile")
    with open(path1, 'rt') as f:
        for line in f:
            line = line.rstrip('\n')
            if len(str(line)) > 0 and str(line)[0] == ".":
                cons_tree_sets = (line.split())  # ['..**.....', '50.00']
                if cons_tree_sets[0].count("*") == 2:  # filter sets with only two closest terminal species
                    cons_tree_sets_dict[cons_tree_sets[0]] = cons_tree_sets[1]
                if cons_tree_sets[0].count(".") == 2:
                    tree_set = list(cons_tree_sets[0])
                    for i, c in enumerate(tree_set):
                        if c == "*":
                            tree_set[i] = "-"
                        if c == ".":
                            tree_set[i] = "*"
                    cons_tree_sets[0] = "".join(tree_set)
                    cons_tree_sets_dict[cons_tree_sets[0]] = cons_tree_sets[1]

            if len(str(line)) > 0 and species_substring in str(line):  # " 1. ID3"
                species_ordered_list.append(line.split()[1])  # "ID3"
    if not cons_tree_sets_dict:  # trigger if false
        time.sleep(1/100)
        if os.path.exists(path1) and recursive < 5:
            cons_tree_sets_dict, species_ordered_list = extract_cons_tree_sets(recursive =1)
            #print ("recursive")
    return cons_tree_sets_dict, species_ordered_list