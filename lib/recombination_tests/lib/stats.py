from lib.recombination_tests.lib.misc import *
from lib.recombination_tests.lib.seq_manip import *
from lib.recombination_tests.lib.queue import *
from numba import prange

def calculate_max_inc(align_kind):
    if align_kind == "DNA":
        max_state = 4
    elif align_kind == "Protein":
        max_state = 20
    elif align_kind == "Other":
        max_state = MAX_STATE
    else:
        max_state = 0

    return max_state * max_state - 2 * max_state + 1


# def inc_stats( max_size, num_chars, inc_matrix, verbose=False):
#     act_max = 0
#     counts = []
#     for i in range(max_size):
#         counts.append(0)
#
#     for i in range(num_chars):
#         for j in range(i + 1, num_chars):
#             counts[inc_matrix[i][j]] = counts[inc_matrix[i][j]] + 1
#             if inc_matrix[i][j] > act_max:
#                 act_max = inc_matrix[i][j]
#
#     total = (num_chars * (num_chars - 1)) / 2
#
#     if verbose:
#         print("Distribution of scaled incompatibility scores:\n")
#         print("score (%)")
#         if total != 0:
#             for i in range(act_max + 1):
#                 prop = counts[i] / total * 50.0
#                 str = ""
#                 for j in range(int(prop)):
#                     str = str + "o"
#                 print(i, " ", round(prop * 2, 1), str)

@njit()
def phi(inc_matrix, num_states, permutation, num_chars, k):
    score = 0.0
    for i in range(num_chars - 1):
        p_i = permutation[i]

        for j in range(k + 1):
            if i < num_chars - j:
                p_j = permutation[i + j]
                val = inc_matrix[p_i][p_j]

                score = score + val

    terms = (k * (2 * num_chars - k - 1)) / 2
    score = score / terms
    return score

def get_f_and_g(inc_matrix, num_states, num_chars, f_values, g_values):
    for i in range(num_chars):
        fscore = 0.0
        gscore = 0.0
        f_values[i] = 0.0
        g_values[i] = 0.0

        for j in range(num_chars):
            val = inc_matrix[i, j]
            fscore = fscore + val
            gscore = gscore + val * val

        f_values[i]= fscore
        g_values[i] = gscore

    return f_values, g_values

def analytic_mean_variance(inc_matrix, num_states, num_chars, k_val):
    f_vals = []
    g_vals = []
    for i in range(num_chars):
        f_vals.append(None)
        g_vals.append(None)
    k = k_val
    n = num_chars

    f_vals, g_vals = get_f_and_g(inc_matrix, num_states, num_chars, f_vals, g_vals)

    # figure out mean
    sum1 = 0
    for i in range(num_chars):
        sum1 = sum1 + f_vals[i]

    mean = sum1 / (num_chars * (num_chars - 1))

    # figure out variance
    # first coeff
    top = (27 * k * n - 18 * pow(k, 2) + 28 * pow(k, 2) * n - 21 * k * pow(n, 2) - 9 * k + 5 * n - 9 * pow(k,
                                                                                                           3) - 11 * pow(
        n, 2) + 6 * pow(n, 3) + 6 * pow(k, 3) * n - 4 * pow(k, 2) * pow(n, 2))
    bottom = k * pow((k + 1 - 2 * n), 2) * pow((n - 1), 2) * (n - 2) * (n - 3) * pow(n, 2)
    coeff_1 = (2.0 / 3.0) * (top / bottom)

    # second coeff
    top = (8 * pow(k, 2) * n - 14 * pow(k, 2) + 39 * k * n + 19 * n - 21 * k + 3 * pow(k, 3) - 15 * k * pow(n,
                                                                                                            2) + 6 * pow(
        n, 3) - 21 * pow(n, 2) - 4)
    bottom = (k * pow((2 * n - k - 1), 2) * n * (n - 1) * (n - 2) * (n - 3))
    coeff_2 = (2.0 / 3.0) * (top / bottom)

    # third coeff
    top = (-18 * k * n - 2 * pow(k, 2) * n + 16 * pow(k, 2) + 6 * pow(n, 2) - 10 * n + 2 + 15 * k + 3 * pow(k, 3))
    bottom = (k * pow((k + 1 - 2 * n), 2) * n * (n - 1) * (n - 2) * (n - 3))
    coeff_3 = (-4.0 / 3.0) * (top / bottom)

    sum1 = sum1 * sum1
    sum2 = 0
    for i in range(num_chars):
        sum2 = sum2 + g_vals[i]

    sum3 = 0

    for i in range(num_chars):
        sum3 = sum3 + (f_vals[i] * f_vals[i])

    varnce = coeff_1 * sum1 + coeff_2 * sum2 + coeff_3 * sum3

    return mean, varnce

@njit()
def NSS(inc_matrix, permutation, num_chars):
    count = 0
    score = 0.0
    for i in range(num_chars):
        p_i = permutation[i]
        for j in range(num_chars-1):
            p_j = permutation[j]
            p_j_1 = permutation[j+1]
            val = inc_matrix[p_i, p_j]
            next_val = inc_matrix[p_i, p_j_1]
            if (val > 0 and next_val > 0) or (val == 0 and next_val == 0):
                score += 1
            count += 1

    return score/count


#@njit(parallel=True)  decorator applied at function call for parallel control
def max_chi(window_scale, alignment, site_desc, site_states, num_taxa, num_sites, num_trials, emp_maxchi):
    num_poly, poly_alignment, poly_sites, poly_site_desc = get_polymorphic(alignment, site_desc, site_states, num_taxa, num_sites)
    num_poly_unambig, poly_alignment_unambig, poly_sites_unambig, poly_sites_desc_unambig = get_unambig(poly_alignment, poly_site_desc, poly_sites, num_taxa, num_poly)
    print("Number of umabiguous polymorphic sites is", num_poly_unambig, " \n")
    permutation = np.empty(num_poly_unambig)
    permutation = identity_permutation(permutation, num_poly_unambig)
    # ("permutatation:", permutation)

    maxchi_window = int(num_poly_unambig * window_scale)
    #("Window size is", maxchi_window, " polymorphic sites")
    orig_maxchi, result_tuple = all_pairs_maxchi(poly_alignment_unambig, num_taxa, num_poly_unambig, maxchi_window, permutation, poly_sites_desc_unambig, True)
    #print ("orig_maxchi", orig_maxchi)
    emp_maxchi = 0
    for i in prange(num_trials):
        perm = sample_permutation(permutation, num_sites)#num_poly_unambig
        #print ("i: ", len(perm), perm)
        cur_maxchi, ignore_tuple = all_pairs_maxchi(poly_alignment_unambig, num_taxa, num_poly_unambig, maxchi_window, perm, poly_sites_desc_unambig, False)
        if cur_maxchi >= orig_maxchi:
            # print ("boosted:", cur_maxchi, " > ", orig_maxchi, " emp_maxchi:", emp_maxchi)
            emp_maxchi += 1

    return emp_maxchi, result_tuple, num_poly_unambig, maxchi_window


@njit()
def all_pairs_maxchi(alignment, num_taxa, num_sites, window_size, permutation, site_desc, verbose):
    n = window_size
    k = int(n/2)
    best_val, cur_val = 0, 0
    best_i, best_j, best_l, best_s, best_r = 0, 0, 0, 0, 0
    all_poly = QueueElem(n)
    for i in range(num_taxa-1):
        for j in range(i+1, num_taxa):
            s, r = 0, 0
            all_poly.clear_queue()
            l = 0
            while l < n:
            # for l in range(n):
                if alignment[i, permutation[l]] == alignment[j, permutation[l]]:
                    diff = 0
                else:
                    diff = 1

                s = s + int(diff)
                all_poly.enqueue(diff)
                if l < k:
                    r = r + int(diff)
                l +=1

            if ((k*s)*(n-k)*(n-s)) != 0:
                cur_val = (n*(k*s-n*r)*(k*s-n*r))/((k*s)*(n-k)*(n-s))
            else:
                cur_val = 0
            if cur_val > best_val:
                best_s = s
                best_r = r
                best_i = i
                best_j = j
                best_l = l
                best_val = cur_val

            for l in range(l+1, num_sites):
                diff = all_poly.dequeue_front(diff)
                s = s - int(diff)
                r = r - int(diff)

                if alignment[i, permutation[l]] == alignment[j, permutation[l]]:
                    diff = 0
                else:
                    diff = 1

                s = s + int(diff)
                all_poly.enqueue(diff)
                diff = all_poly.at_position(diff, (k-1))
                r = r + int(diff)
                if ((k*s)*(n-k)*(n-s)) != 0:
                    cur_val = (n*(k*s-n*r)*(k*s-n*r))/((k*s)*(n-k)*(n-s))
                else:
                    cur_val = 0
                if cur_val > best_val:
                    best_s = s
                    best_r = r
                    best_i = i
                    best_j = j
                    best_l = l
                    best_val = cur_val

    result_tuple = (best_i, best_j, best_r, best_s, best_val, best_l - n, best_l - k, best_l, site_desc[best_l - n, 0],
                    site_desc[best_l - k, 0], site_desc[best_l, 0])

    return best_val, result_tuple

#### new

@njit()
def calc_orig_maxchi(window_scale, alignment, site_desc, site_states, num_taxa, num_sites):
    print('Doing permutation test for MAXCHI')
    num_poly, poly_alignment, poly_sites, poly_site_desc = get_polymorphic(alignment, site_desc, site_states, num_taxa, num_sites)
    num_poly_unambig, poly_alignment_unambig, poly_sites_unambig, poly_sites_desc_unambig = get_unambig(poly_alignment, poly_site_desc, poly_sites, num_taxa, num_poly)
    print("Number of umabiguous polymorphic sites is", num_poly_unambig, " \n")
    permutation = np.empty(num_poly_unambig)
    permutation = identity_permutation(permutation, num_poly_unambig)
    #print("permutatation:", permutation)

    maxchi_window = int(num_poly_unambig * window_scale)
    print("Window size is", maxchi_window, " polymorphic sites")
    orig_maxchi, result_tuple = all_pairs_maxchi(poly_alignment_unambig, num_taxa, num_poly_unambig, maxchi_window, permutation, poly_sites_desc_unambig)
    return orig_maxchi, permutation, maxchi_window, result_tuple, num_poly_unambig, maxchi_window

@njit()
def calc_maxchi_trials(poly_alignment_unambig, num_taxa, num_poly_unambig, maxchi_window, permutation, poly_sites_desc_unambig):
    permutation = sample_permutation(permutation, num_poly_unambig)
    cur_maxchi, result_tuple = all_pairs_maxchi(poly_alignment_unambig, num_taxa, num_poly_unambig, maxchi_window, permutation, poly_sites_desc_unambig)

    return cur_maxchi

@njit()
def all_pairs_maxchi(alignment, num_taxa, num_sites, window_size, permutation, site_desc):
    n = window_size
    k = int(n/2)
    best_val, cur_val = 0, 0
    best_i, best_j, best_l, best_s, best_r = 0, 0, 0, 0, 0
    all_poly = QueueElem(n)
    # all_poly.init_queue()
    for i in range(num_taxa-1):
        for j in range(i+1, num_taxa):
            s, r = 0, 0
            all_poly.clear_queue()
            l = 0
            while l < n:
                if alignment[i, permutation[l]] == alignment[j, permutation[l]]:
                    diff = 0
                else:
                    diff = 1

                s = s + int(diff)
                all_poly.enqueue(diff)
                if l < k:
                    r = r + int(diff)
                l +=1

            if ((k*s)*(n-k)*(n-s)) != 0:
                cur_val = (n*(k*s-n*r)*(k*s-n*r))/((k*s)*(n-k)*(n-s))
            else:
                cur_val = 0
            if cur_val > best_val:
                best_s = s
                best_r = r
                best_i = i
                best_j = j
                best_l = l
                best_val = cur_val

            for l in range(l+1, num_sites):
                diff = all_poly.dequeue_front(diff)
                s = s - int(diff)
                r = r - int(diff)

                if alignment[i, permutation[l]] == alignment[j, permutation[l]]:
                    diff = 0
                else:
                    diff = 1

                s = s + int(diff)
                all_poly.enqueue(diff)
                diff = all_poly.at_position(diff, (k-1))
                r = r + int(diff)
                if ((k*s)*(n-k)*(n-s)) != 0:
                    cur_val = (n*(k*s-n*r)*(k*s-n*r))/((k*s)*(n-k)*(n-s))
                else:
                    cur_val = 0
                if cur_val > best_val:
                    best_s = s
                    best_r = r
                    best_i = i
                    best_j = j
                    best_l = l
                    best_val = cur_val

    result_tuple = (best_i, best_j, best_r, best_s, best_val, best_l - n, best_l - k, best_l, site_desc[best_l - n, 0],
                    site_desc[best_l - k, 0], site_desc[best_l, 0])

    return best_val, result_tuple