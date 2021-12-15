import numpy as np
from lib.recombination_tests.lib.misc import *
from numba import njit, int32, int64, jit
from numba.experimental import jitclass


@njit()
def create_new_node(array, new_value, num_taxa):
    arr = np.empty(num_taxa, dtype=np.int64)
    arr.fill(-1)
    pos = 0
    arr[pos] = int64(new_value)
    pos += 1
    for i in range(num_taxa - 1):
        arr[pos] = array[i]
        pos += 1

    return arr


@njit()
def pair_score(alignment, site_states, char_a, char_b, num_sites, num_taxa):
    char_a_states = site_states[char_a]
    char_b_states = site_states[char_b]
    total_states = int(char_a_states + char_b_states)

    top = 0
    cur_vertex = 0
    inc_score = -1
    array_stack = np.zeros(total_states)
    adjacency_matrix = np.zeros((total_states, total_states), dtype=np.int64)

    adjacency_list = []
    for i in range(total_states):
        arr = np.empty(num_taxa, dtype=int64)
        arr.fill(-1)
        adjacency_list.append(arr)


    edge_count = 0
    for i in range(num_taxa):
        char_a_val = int(alignment[char_a, i])
        char_b_val = int(alignment[char_b, i])
        if char_a_val <= MAX_STATE and char_b_val <= MAX_STATE:  # cond 1
            char_b_val = int(char_b_val + char_a_states)

            if not adjacency_matrix[char_a_val, char_b_val]:  # if False == 0
                # Update symmetric adjacency matrix (undirected graph)
                adjacency_matrix[char_a_val, char_b_val] = 1
                adjacency_matrix[char_b_val, char_a_val] = 1

                edge_count += 1

                # Add to adjacency lists
                cur_node = adjacency_list[char_a_val]
                new_node = create_new_node(cur_node, int(char_b_val), num_taxa)
                adjacency_list[char_a_val] = new_node
                # and other list
                cur_node = adjacency_list[char_b_val]
                new_node = create_new_node(cur_node, int(char_a_val), num_taxa)
                adjacency_list[char_b_val] = new_node

    array_stack = np.zeros(total_states, dtype=np.int64)
    marked = np.zeros(total_states, dtype=np.int64)
    DFS_adjacency = []
    for i in range(total_states):
        DFS_adjacency.append(adjacency_list[i])

    top = -1
    comp_count = 0
    for i in range(total_states):
        if marked[i] == 0:
            comp_count += 1
            top += 1
            array_stack[top] = i

            while top >= 0:
                cur_vertex = int(array_stack[top])
                marked[cur_vertex] = 1
                has_valid_neighbour = False
                i_counter = 0
                while DFS_adjacency[cur_vertex][i_counter] != -1 and has_valid_neighbour is False:
                    potential_neighbour = DFS_adjacency[cur_vertex][i_counter]
                    if marked[potential_neighbour] == 0:
                        top += 1
                        array_stack[top] = potential_neighbour
                        has_valid_neighbour = True

                    else:
                        i_counter += 1

                if has_valid_neighbour is False:
                    top -= 1

    # For the pairwise incompatibility
    inc_score = edge_count - total_states + comp_count

    return inc_score
