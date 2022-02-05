from Bio import SeqIO, Seq
from lib.recombination_tests.lib.misc import *
import numpy as np
from numba import njit
import random


def extract_fasta(data_file, datatype):
    """
    extract id and seq records from fasta files
    :return: dict of ids as keys and sequences (upper string) as values, also returns alphabet list
    :rtype: dict and list
    """

    records = list(SeqIO.parse(data_file, datatype))
    num_sites = len(records[0].seq)
    num_taxa = len(records)
    taxa_list = np.zeros(num_taxa, dtype=object) #todo need to use dtype object outside njit or test list if it works
    ascii_seq_list = np.zeros((num_taxa, num_sites), dtype=int)
    i = 0
    for record in records:
        taxa_list[i] = record.id
        j = 0
        for char in (str(record.seq)).upper():
            ascii_seq_list[i, j] = (ord(char) - CHAR_START)
            j += 1
        i += 1
    np.set_printoptions(threshold=np.inf)
    #print(num_taxa, num_sites)
    return taxa_list, ascii_seq_list, num_sites, num_taxa



@njit()
def validate_alignment(alignment, align_kind, num_taxa, num_sites):
    bool = True
    for i in range(num_taxa):
        for j in range(num_sites):
            ch = alignment[i, j]
        if not valid_state(ch, align_kind) or missing_ambig_state(ch, align_kind) or ch in GLOBAL_GAP:
            print("error:", ch + CHAR_START, "is not a valid state")
            bool = False

    return bool

@njit()
def extract_subseq(alignment, num_taxa, num_sites, start, end):
    site_count = 0
    new_count = end - start
    new_alignment = np.zeros((num_taxa, num_sites), dtype=np.int64)
    # new_alignment = []
    # for i in range(num_taxa):
    #     new_alignment.append([None] * new_count)

    for j in range(start, end):
        for i in range(num_taxa):
            new_alignment[i, site_count] = alignment[i, j]
        site_count += 1
    return new_alignment

@njit()
def get_seq_div(alignment, align_kind, num_taxa, num_sites):
    val = 0
    for i in range(num_taxa - 1):
        for j in range(i + 1, num_taxa):
            count = 0
            num = 0
            for l in range(num_sites):
                if valid_state(alignment[i, l], align_kind) and valid_state(alignment[j, l], align_kind):
                    if alignment[i, l] != alignment[j, l]:
                        count += 1
                    num += 1

            val = val + (count / num)

    div = (val * 2) / (num_taxa * (num_taxa - 1))
    return div

@njit()
def find_states(alignment, align_kind, state_missing, num_taxa, num_sites):

    site_desc = np.zeros((num_sites, 6), dtype=np.int64)
    site_state = np.zeros(num_sites)

    for j in range(num_sites):
        state_map = np.zeros(MAX_STATE)
        state_count = 0
        gap_char = 0
        missing_ambig_count = 0

        for i in range(num_taxa):
            char_A = alignment[i, j]
            if valid_state(char_A, align_kind):
                if state_map[char_A] <= 0:
                    state_count += 1
                    state_map[char_A] += 1
                else:
                    state_map[char_A] += 1

            elif missing_ambig_state(char_A, align_kind):
                missing_ambig_count += 1

            elif valid_gap(char_A):
                gap_char = 1

            else:
                pass
                #print("invalid state: ", (char_A + SeQAlphabet.CHAR_START))

        # add variables to site description
        site_desc[j, 0] = j
        if state_missing and missing_ambig_count > 0:
            state_count += 1

        site_state[j] = state_count
        site_desc[j, 1] = state_count
        site_desc[j, 2] = missing_ambig_count
        site_desc[j, 3] = gap_char

        # check if informative
        big_states = 0
        if state_count >= 2:
            for i in range(MAX_STATE):
                if state_map[i] >= 2:
                    big_states += 1
            if state_missing and missing_ambig_count >= 2:
                big_states += 1

        if state_count >= 2:
            site_desc[j, 4] = 1
            if big_states >= 2:
                site_desc[j, 5] = 1
            else:
                site_desc[j, 5] = 0
        else:
            site_desc[j, 5] = 0
            site_desc[j, 4] = 0

    return site_desc, site_state


@njit()
def get_informative(alignment, site_desc, site_states, num_taxa, num_sites):

    site_count = 0
    informative_count = 0
    for i in range(num_sites):
        if site_desc[i, 5] == 1:
            informative_count += 1

    new_num_sites = informative_count
    new_alignment = np.zeros((num_taxa, num_sites), dtype=np.int64)

    new_site_states = np.zeros(informative_count)
    new_site_desc = np.zeros((informative_count, 6), dtype=np.int64)

    for j in range(num_sites):
        if site_desc[j, 5] == 1:
            for i in range (num_taxa):
                new_alignment[i][site_count] = alignment[i, j]
            new_site_states[site_count] = site_states[j]
            new_site_desc[site_count, 5] = site_desc[j, 5]
            new_site_desc[site_count, 4] = site_desc[j, 4]
            new_site_desc[site_count, 3] = site_desc[j, 3]
            new_site_desc[site_count, 0] = site_desc[j, 0]
            new_site_desc[site_count, 2] = site_desc[j, 2]
            site_count += 1

    return new_num_sites, new_alignment, new_site_states, new_site_desc


@njit()
def reorder_chars(alignment, align_kind, state_missing, num_sites, num_taxa):

    state_map = np.zeros(MAX_STATE)
    new_alignment = np.zeros((num_sites, num_taxa), dtype=np.int64)

    for j in range(num_sites):
        for k in range(MAX_STATE):
            state_map[k] = -1
        state_count = 0
        for i in range(num_taxa):
            char_A = alignment[i, j]
            # Figure out which positive state 0..k
            if valid_state(char_A, align_kind):
                if state_map[char_A] < 0:
                    state_map[char_A] = state_count
                    cur_state = state_count
                    state_count += 1
                else:
                    cur_state = state_map[char_A]

            elif missing_ambig_state(char_A, align_kind) and state_missing is True:
                if state_map[MISSING_STATE] < 0:
                    state_map[MISSING_STATE] = state_count
                    cur_state = state_count
                    state_count += 1
                else:
                    cur_state = state_map[MISSING_STATE]

            else:
                cur_state = IGNORE_STATE

            new_alignment[j, i] = cur_state
    return new_alignment

@njit()
def identity_permutation(permutation, n):
    return np.arange(n)

@njit()
def sample_permutation(permutation, n):
    permutation = identity_permutation(permutation, n)
    for i in range(n-1):
        val = random.randint(i, (n-1))
        temp = permutation[i]
        permutation[i] = permutation[val]
        permutation[val] = temp

    return permutation

@njit()
def get_polymorphic(alignment, site_desc, site_states, num_taxa, num_sites):
    site_count = 0
    polymorphic_count = 0
    for i in range(num_sites):
        if site_desc[i, 4] == 1:
            polymorphic_count += 1

    new_num_sites = polymorphic_count
    new_site_desc = np.zeros((polymorphic_count, 6), dtype=np.int64)
    new_site_states = np.zeros(polymorphic_count)
    new_alignment = np.zeros((num_taxa, polymorphic_count), dtype=np.int64)

    for j in range(num_sites):
        if site_desc[j, 4] == 1:
            for i in range(num_taxa):
                new_alignment[i, site_count] = alignment[i, j]
            new_site_states[site_count] = site_states[j]
            new_site_desc[site_count, 5] = site_desc[j, 5]
            new_site_desc[site_count, 4] = site_desc[j, 4]
            new_site_desc[site_count, 3] = site_desc[j, 3]
            new_site_desc[site_count, 0] = site_desc[j, 0]
            new_site_desc[site_count, 2] = site_desc[j, 2]
            site_count += 1

    return new_num_sites, new_alignment, new_site_states, new_site_desc

@njit()
def get_unambig(alignment, site_desc, site_states, num_taxa, num_sites):
    site_count = 0
    nongapped_count = 0

    for i in range(num_sites):
        if site_desc[i, 3] == 0 and site_desc[i, 2] == 0:
            nongapped_count += 1

    new_num_sites = nongapped_count
    new_site_desc = np.zeros((nongapped_count, 6), dtype=np.int64)
    new_site_states = np.zeros(nongapped_count)
    new_alignment = np.zeros((num_taxa, nongapped_count), dtype=np.int64)


    for j in range(num_sites):
        if site_desc[j, 3] == 0 and site_desc[j, 2] == 0:
            for i in range(num_taxa):
                new_alignment[i, site_count] = alignment[i, j]
            new_site_states[site_count] = site_states[j]
            new_site_desc[site_count, 5] = site_desc[j, 5]
            new_site_desc[site_count, 4] = site_desc[j, 4]
            new_site_desc[site_count, 3] = site_desc[j, 3]
            new_site_desc[site_count, 0] = site_desc[j, 0]
            new_site_desc[site_count, 2] = site_desc[j, 2]
            site_count += 1

    return new_num_sites, new_alignment, new_site_states, new_site_desc
