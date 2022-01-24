from lib.recombination_tests.lib.pair_score import *
from lib.recombination_tests.lib.stats import *
import math
import time
from numba import njit, prange
from PyQt5.QtCore import pyqtSlot, pyqtSignal, QObject

class PhiAnalyser(QObject):
    text_output = pyqtSignal(str)
    def __init__(self, Q_output=None):
        super().__init__()
        self.Q_output = Q_output

    def calc_profile(self, datafile, datatype, align_kind, do_perm=1000, window_size=50, break_window=100, step_size=25, multiproc=True, verbose=False):
        sum_phi, sum_sq_phi, obs_mean, obs_variance = 0, 0, 0, 0
        mean, variance, normal_p_value = 0, 0, 0
        emp_phi = 0
        if self.Q_output:
            self.text_output.emit(f"Reading sequence file {str(datafile)}")
        taxa_list, alignment, num_sites, num_taxa = extract_fasta(datafile, datatype)
        if self.Q_output:
            self.text_output.emit(f"Allocating space for {num_taxa} taxa and {num_sites} sites.")
        if num_taxa <= 0 or num_sites <= 0:
            raise ValueError("No sequences or sites in alignment")
            return
        if validate_alignment(alignment, align_kind, num_taxa, num_sites):
            if self.Q_output:
                self.text_output.emit(f"Alignment looks like a valid {align_kind} alignment")
            num_tests = int(((num_sites - break_window) / step_size) + 1)
            if num_tests < 1:
                if self.Q_output:
                    self.text_output.emit(f"(((num_sites - break_window) / step_size) + 1) must be positive \n"
                                         f"((({num_sites} - {break_window}) / {step_size}) + 1) = {num_tests}")
                else:
                    print(f"(((num_sites - break_window) / step_size) + 1) must be positive \n"
                                         f"((({num_sites} - {break_window}) / {step_size}) + 1) = {num_tests}")
                return
            if self.Q_output:
                self.text_output.emit(f"PHI is calculated with w as {window_size}\n")
                self.text_output.emit(f"Checking for recombination using a window size of {break_window} and a step size of {step_size}\n")
            else:
                print(f"PHI is calculated with w as {window_size}\n")
                print(f"Checking for recombination using a window size of {break_window} and a step size of {step_size}\n")
            values = np.full(num_tests, np.nan)
            for big_counter in range(num_tests):
                if self.Q_output:
                    self.text_output.emit(f"Checking for recombination at {int(big_counter*step_size+break_window/2)} between {big_counter*step_size} and {big_counter*step_size+break_window} ")
                else:
                    print(f"Checking for recombination at {int(big_counter*step_size+break_window/2)} between {big_counter*step_size} and {big_counter*step_size+break_window} ")
                new_alignment = extract_subseq(alignment, num_taxa, num_sites, big_counter*step_size, big_counter*step_size+break_window)
                divg = get_seq_div(new_alignment, align_kind, num_taxa, break_window)
                if self.Q_output and verbose:
                    self.text_output.emit(f"Estimated diversity is (pairwise deletion - ignoring missing/ambig): {round(divg * 100.0, 1)}%")
                elif verbose:
                    print(f"Estimated diversity is (pairwise deletion - ignoring missing/ambig): {round(divg * 100.0, 1)}%")
                site_desc, site_states = find_states(new_alignment, align_kind, False, num_taxa, break_window)
                num_inf, inf_alignment, inf_states, inf_site_desc = get_informative(new_alignment, site_desc, site_states, num_taxa, break_window)
                if self.Q_output and verbose:
                    self.text_output.emit(f"Found {num_inf} informative sites.")
                elif verbose:
                    print(f"Found {num_inf} informative sites.")
                char_alignment = reorder_chars(inf_alignment, align_kind, False, num_inf, num_taxa)
                max_inc = calculate_max_inc(align_kind)
                inc_matrix = np.zeros((num_inf, num_inf), dtype=np.int64)

                if multiproc:
                    inc_matrix = njit(parallel=True)(calc_phi_pairs)(num_inf, char_alignment, inf_states, num_taxa, inc_matrix)
                else:
                    inc_matrix = njit(calc_phi_pairs)(num_inf, char_alignment, inf_states, num_taxa, inc_matrix)

                self.inc_stats(max_inc, num_inf, inc_matrix, verbose)
                option_k = 0
                if option_k == 0:
                    val = num_inf/break_window
                    val = val * window_size
                    option_k = int(val + 0.5)

                    if option_k == 0:
                        option_k += 1
                else:
                    val = break_window/num_inf
                    val = val * option_k
                    window_size = val

                if self.Q_output and verbose:
                    self.text_output.emit(f"using a window size of {window_size} with k as {option_k}")
                elif verbose:
                    print(f"using a window size of {window_size} with k as {option_k}")
                permutation = np.empty(num_inf)
                permutation = identity_permutation(permutation, num_inf)
                orig_phi = phi(inc_matrix, inf_states, permutation, num_inf, int(option_k))

                if num_inf <= (2 * option_k):
                    valid_normal_approx = False
                    if self.Q_output:
                        self.text_output.emit("Too few informative sites to use normal approximation.\nTry doing a permutation test or increasing alignment length\nCan also try decreasing windowsize.")
                    else:
                        print("Too few informative sites to use normal approximation.\nTry doing a permutation test or increasing alignment length\nCan also try decreasing windowsize.")
                else:
                    valid_normal_approx = True
                    mean, variance = analytic_mean_variance(inc_matrix, inf_states, num_inf, option_k)
                    difference = mean - orig_phi

                    normal_p_value = normal_01_CDF((-difference) / math.sqrt(variance))
                    values[big_counter] = normal_p_value
                    if self.Q_output and verbose:
                        self.text_output.emit(f"Z-value for PHI is: {format(normal_p_value, '4.6e')}")
                    elif verbose:
                        print(f"Z-value for PHI is: {normal_p_value}")

                if do_perm:
                    ntrials = int(do_perm)
                    if option_k >= num_inf:
                        raise ValueError(
                            "Too few informative sites to test significance.  Try decreasing windowsize or increasing alignment length\n\n")
                    else:
                        #print("Doing permutation test for PHI")
                        if multiproc:
                            emp_phi, sum_phi, sum_sq_phi = njit(parallel=True)(calc_phi_perm)(ntrials, permutation,
                                                                                              num_inf, inc_matrix,
                                                                                              inf_states, option_k,
                                                                                              orig_phi, emp_phi,
                                                                                              sum_phi, sum_sq_phi)
                        else:
                            emp_phi, sum_phi, sum_sq_phi = njit(calc_phi_perm)(ntrials, permutation, num_inf,
                                                                               inc_matrix, inf_states, option_k,
                                                                               orig_phi, emp_phi, sum_phi, sum_sq_phi)

                        obs_mean = sum_phi / ntrials
                        obs_variance = (sum_sq_phi - ntrials * obs_mean * obs_mean) / (ntrials - 1)
                ## print verbose same as calc_phi
                if self.Q_output and verbose:
                    self.text_output.emit(f"{'=' * 15}")
                    self.text_output.emit(f"\n                      PHI Values")
                    self.text_output.emit(f"                      ----------")
                    self.text_output.emit(f"              Analytical    ({ntrials}) Permutations\n")
                    if valid_normal_approx and do_perm:
                        self.text_output.emit(
                            f"Mean:          {format(mean, '4.2e')}          {format(obs_mean, '4.2e')}")
                    elif valid_normal_approx:
                        self.text_output.emit(f"Mean:          {format(mean, '4.2e')}          --")
                    else:
                        self.text_output.emit("Mean:               --          --")

                    if valid_normal_approx and do_perm:
                        self.text_output.emit(
                            f"Variance:     {format(variance, '4.2e')}          {format(obs_variance, '4.2e')}")
                    elif valid_normal_approx:
                        self.text_output.emit(f"Variance:     {format(variance, '4.2e')}          --")
                    else:
                        self.text_output.emit("Variance:          --          --")
                    self.text_output.emit(
                        f"Observed:    {format(orig_phi, '4.2e')}          {format(orig_phi, '4.2e')}   \n")

                    self.text_output.emit("     **p-Value(s)**     \n       ----------\n")

                if valid_normal_approx:
                    if self.Q_output:
                        self.text_output.emit(f"PHI (Normal):           {format(normal_p_value, '4.2e')}")
                    else:
                        print(f"PHI (Normal):           {normal_p_value}\n")

            ####  different from calc_phi ####
            if self.Q_output:
                self.text_output.emit(f"Number of tests performed is {num_tests}")
            else:
                print(f"Number of tests performed is {num_tests}")
            # for k in range(num_tests):
            #     print(f"{int(k * step_size + break_window / 2)}, {values[k]}")

            if self.Q_output:
                self.text_output.emit("Analysis completed")
            else:
                print("Analysis completed")




    def calc_phi(self, datafile, datatype, align_kind, do_perm=1000, window_size= 100, other_stats=True, multiproc=True, verbose=False):
        t0 = time.time()
        sum_phi, sum_sq_phi, obs_mean, obs_variance = 0, 0, 0, 0
        mean, variance, normal_p_value = 0, 0, 0
        ntrials = 0
        emp_phi, emp_NSS, emp_maxchi = 0, 0, 0
        if self.Q_output:
            self.text_output.emit(f"Reading sequence file {str(datafile)}")
        taxa_list, alignment, num_sites, num_taxa = extract_fasta(datafile, datatype)
        if self.Q_output:
            self.text_output.emit(f"Allocating space for {num_taxa} taxa and {num_sites} sites.")
        if num_taxa <=0 or num_sites <= 0:
            if self.Q_output:
                self.text_output.emit(f"Error. No sequences or sites in alignment")
            raise ValueError("No sequences or sites in alignment")
            return

        if validate_alignment(alignment, align_kind, num_taxa, num_sites):
            if self.Q_output:
                self.text_output.emit(f"Alignment looks like a valid {align_kind} alignment")
            divg = get_seq_div(alignment, align_kind, num_taxa, num_sites)
            if self.Q_output:
                self.text_output.emit(f"Estimated diversity is (pairwise deletion - ignoring missing/ambig): {round(divg*100.0, 1)}%")
            else:
                print (f"Estimated diversity is (pairwise deletion - ignoring missing/ambig): {round(divg*100.0, 1)}%")
            site_desc, site_states = find_states(alignment, align_kind, False, num_taxa, num_sites)
            num_inf, inf_alignment, inf_states, inf_site_desc = get_informative(alignment, site_desc, site_states, num_taxa, num_sites)
            if self.Q_output:
                self.text_output.emit(f"Found {num_inf} informative sites")
            else:
                print(f"Found {num_inf} informative sites.")
            char_alignment = reorder_chars(inf_alignment, align_kind, False, num_inf, num_taxa)
            max_inc = calculate_max_inc(align_kind)
            inc_matrix = np.zeros((num_inf, num_inf), dtype=np.int64)

            if multiproc:
                inc_matrix = njit(parallel=True)(calc_phi_pairs)(num_inf, char_alignment, inf_states, num_taxa, inc_matrix)
            else:
                inc_matrix = njit(calc_phi_pairs)(num_inf, char_alignment, inf_states, num_taxa, inc_matrix)

            self.inc_stats(max_inc, num_inf, inc_matrix, verbose=verbose)

            option_k = 0
            if option_k == 0:
                val = num_inf / num_sites
                val = val * window_size
                option_k = int(val + 0.5)

                if option_k == 0:
                    option_k += 1

            else:
                val = num_sites / num_inf
                val = val * option_k
                window_size = val

            if self.Q_output:
                self.text_output.emit(f"using a window size of {window_size} with k as {option_k}")
            else:
                print(f"using a window size of {window_size} with k as {option_k}")

            permutation = np.empty(num_inf)
            permutation = identity_permutation(permutation, num_inf)
            orig_phi = phi(inc_matrix, inf_states, permutation, num_inf, int(option_k))

            if num_inf <= (2 * option_k):
                valid_normal_approx = False
                if self.Q_output:
                    self.text_output.emit(f"Too few informative sites to use normal approximation.\nTry doing a permutation test or increasing alignment length\nCan also try decreasing windowsize.")
                else:
                    print("Too few informative sites to use normal approximation.\nTry doing a permutation test or increasing alignment length\nCan also try decreasing windowsize.")
            else:
                valid_normal_approx = True
                if self.Q_output:
                    self.text_output.emit(f"\nCalculating analytical mean and variance\n")
                else:
                    print("\nCalculating analytical mean and variance\n")
                mean, variance = analytic_mean_variance(inc_matrix, inf_states, num_inf, option_k)
                difference = mean - orig_phi
                normal_p_value = normal_01_CDF((-difference) / math.sqrt(variance))

            if do_perm:
                ntrials = int(do_perm)
                if option_k >= num_inf:
                    raise ValueError ("Too few informative sites to test significance.  Try decreasing windowsize or increasing alignment length\n\n")
                else:
                    if self.Q_output:
                        self.text_output.emit("Doing permutation test for PHI")
                    else:
                        print ("Doing permutation test for PHI")
                    if multiproc:
                        emp_phi, sum_phi, sum_sq_phi = njit(parallel=True)(calc_phi_perm)(ntrials, permutation, num_inf, inc_matrix, inf_states, option_k, orig_phi, emp_phi, sum_phi, sum_sq_phi)
                    else:
                        emp_phi, sum_phi, sum_sq_phi = njit(calc_phi_perm)(ntrials, permutation, num_inf, inc_matrix, inf_states, option_k, orig_phi, emp_phi, sum_phi, sum_sq_phi)

                    obs_mean = sum_phi/ntrials
                    obs_variance = (sum_sq_phi - ntrials * obs_mean * obs_mean)/(ntrials - 1)

            if other_stats:
                if self.Q_output:
                    self.text_output.emit("\n Doing permutation for NSS")
                else:
                    print("\n Doing permutation for NSS")
                permutation = identity_permutation(permutation, num_inf)
                orig_NSS = NSS(inc_matrix, permutation, num_inf)
                if self.Q_output and verbose:
                    self.text_output.emit(f"The Neighbour Similarity score is {format(orig_NSS, '.4e')}")
                else:
                    print(f"The Neighbour Similarity score is {orig_NSS}")
                if multiproc:
                    emp_NSS = njit(parallel=True)(calc_nss)(inc_matrix, num_inf, ntrials, orig_NSS, emp_NSS, permutation)
                else:
                    emp_NSS = njit(calc_nss)(inc_matrix, num_inf, ntrials, orig_NSS, emp_NSS, permutation)

                # max chi 2
                if self.Q_output:
                    self.text_output.emit("\n Doing permutation for MAXCHI")
                else:
                    print("\n Doing permutation for MAXCHI")
                emp_maxchi, result_tuple, num_poly_unambig, maxchi_window = calc_max_chi(alignment, site_desc, site_states, taxa_list, num_taxa, num_sites, ntrials, emp_maxchi, multiproc)

                if verbose:
                    self.print_maxchi_output(result_tuple, num_poly_unambig, maxchi_window, taxa_list)

            if self.Q_output and verbose:
                self.text_output.emit(f"{'=' * 15}")
                self.text_output.emit(f"\n                      PHI Values")
                self.text_output.emit(f"                      ----------")
                self.text_output.emit(f"              Analytical    ({ntrials}) Permutations\n")
                if valid_normal_approx and do_perm:
                    self.text_output.emit(f"Mean:          {format(mean, '4.2e')}          {format(obs_mean, '4.2e')}")
                elif valid_normal_approx:
                    self.text_output.emit(f"Mean:          {format(mean, '4.2e')}          --")
                else:
                    self.text_output.emit("Mean:               --          --")

                if valid_normal_approx and do_perm:
                    self.text_output.emit(f"Variance:     {format(variance, '4.2e')}          {format(obs_variance, '4.2e')}")
                elif valid_normal_approx:
                    self.text_output.emit(f"Variance:     {format(variance, '4.2e')}          --")
                else:
                    self.text_output.emit("Variance:          --          --")
                self.text_output.emit(f"Observed:    {format(orig_phi, '4.2e')}          {format(orig_phi, '4.2e')}   \n")

            else:
                print("=" * 15)
                print("PHI values\n ----------\n")
                print(f"              Analytical {ntrials} Permutations\n\n")
                print("Mean:          ")
                self.print_vals(valid_normal_approx, do_perm, mean, obs_mean)
                print("Variance:       ")
                self.print_vals(valid_normal_approx, do_perm, variance, obs_variance)
                print(f"Observed:     {orig_phi}          {orig_phi}   \n\n")
                print("\n     **p-Value(s)**     \n       ----------\n\n")

            if other_stats:
                if self.Q_output:
                    self.text_output.emit("     **p-Value(s)**     \n       ----------\n")
                    val = emp_NSS / ntrials
                    self.text_output.emit(f"NSS:                         {format(val, '4.2e')}  ({ntrials} permutations)")
                    val = emp_maxchi / ntrials
                    self.text_output.emit(f"Max Chi^2:             {format(val, '4.2e')}  ({ntrials} permutations)")

                else:
                    val = emp_NSS/ntrials
                    print(f"NSS:              {val} ({ntrials} permutations)")

                    val = emp_maxchi / ntrials
                    print(f"Max Chi^2:           {val} ({ntrials} permutations)")

            if do_perm:
                if self.Q_output:
                    val = emp_phi / ntrials
                    self.text_output.emit(f"PHI (Permutation):   {format(val, '4.2e')}  ({ntrials} permutations)")
                else:
                    val = emp_phi / ntrials
                    print(f"PHI (Permutation):   {val}  ({ntrials} permutations)\n")

            if valid_normal_approx:
                if self.Q_output:
                    self.text_output.emit(f"PHI (Normal):           {format(normal_p_value, '4.2e')}")
                else:
                    print(f"PHI (Normal):           {normal_p_value}\n")


            t1 = time.time()
            print((t1 - t0), "seconds")

        else:
            if self.Q_output:
                self.text_output.emit(f"{align_kind} alignment is not valid.")

        if self.Q_output:
            self.text_output.emit("Analysis completed")
        else:
            print("Analysis completed")

    def print_vals(self, print_val_a, print_val_b, val_a, val_b):
        str = ""
        if print_val_a:
            str += f"{val_a}          "
        else:
            str += "     --          "
        if print_val_b:
            str += f"{val_b}          "
        else:
            str += "     --          "
        print (str)

    def print_maxchi_output(self, result_tuple, num_poly_unambig, maxchi_window, taxa_list):
        (taxa_a, taxa_b, best_r, best_s, best_val, start_poly, breakpoint_poly, end_poly, start_all,
         breakpoint_all, end_all) = result_tuple

        if self.Q_output:
            self.text_output.emit(f"Number of umabiguous polymorphic sites is {num_poly_unambig} \n")
            self.text_output.emit(f"Window size is {maxchi_window} polymorphic sites")
            self.text_output.emit(f"Best breakpoint for Max Chi found with sequences {taxa_list[taxa_a]} and {taxa_list[taxa_b]}. r and s are {best_r} and {best_s}")
            self.text_output.emit(f"Value of maximum breakpoint is: {best_val}")
            self.text_output.emit(f"Coordinates of breakpoint with only polymorphic sites (start,breakpoint,end) = ({start_poly}, {breakpoint_poly}, {end_poly})")
            self.text_output.emit(f"Coordinates of breakpoint with all sites (start,breakpoint,end)=({start_all}, {breakpoint_all}, {end_all}) \n")
        else:
            print("Number of umabiguous polymorphic sites is", num_poly_unambig, " \n")
            print("Window size is", maxchi_window, " polymorphic sites")
            print("Best breakpoint for Max Chi found with sequences ", taxa_list[taxa_a], " and ",taxa_list[taxa_b], ". r and s are ", best_r, "and ", best_s)
            print("Value of maximum breakpoint is: ", best_val)
            print("Coordinates of breakpoint with only polymorphic sites (start,breakpoint,end) = (",start_poly, ", ", breakpoint_poly, ",", end_poly, ")")
            print("Coordinates of breakpoint with all sites (start,breakpoint,end)=(", start_all, ", ",breakpoint_all, ", ", end_all, ")\n")

    def inc_stats(self, max_size, num_chars, inc_matrix, verbose=False):
        act_max = 0
        counts = []
        for i in range(max_size):
            counts.append(0)

        for i in range(num_chars):
            for j in range(i + 1, num_chars):
                counts[inc_matrix[i][j]] = counts[inc_matrix[i][j]] + 1
                if inc_matrix[i][j] > act_max:
                    act_max = inc_matrix[i][j]

        total = (num_chars * (num_chars - 1)) / 2

        if verbose:
            if self.Q_output:
                self.text_output.emit(f"Distribution of scaled incompatibility scores:\n")
                self.text_output.emit(f"score (%)")
                if total != 0:
                    for i in range(act_max + 1):
                        prop = counts[i] / total * 50.0
                        o_str = ""
                        for j in range(int(prop)):
                            o_str = o_str + "o"
                        if self.Q_output:
                            self.text_output.emit(f"{i} ({round(prop * 2, 1)}): {o_str}")
            else:
                print("Distribution of scaled incompatibility scores:\n")
                print("score (%)")
                if total != 0:
                    for i in range(act_max + 1):
                        prop = counts[i] / total * 50.0
                        o_str = ""
                        for j in range(int(prop)):
                            o_str = o_str + "o"
                        print(i, " ", round(prop * 2, 1), o_str)


def calc_phi_perm(ntrials, permutation, num_inf, inc_matrix, inf_states, option_k, orig_phi, emp_phi, sum_phi, sum_sq_phi):
    for i in prange(ntrials):
        perm = sample_permutation(permutation, num_inf)
        cur_phi = phi(inc_matrix, inf_states, perm, num_inf, option_k)
        if cur_phi <= orig_phi:
            emp_phi += 1
        sum_phi = sum_phi + cur_phi
        sum_sq_phi = sum_sq_phi + cur_phi * cur_phi
    return emp_phi, sum_phi, sum_sq_phi


#@njit(parallel=True)
def calc_phi_pairs(num_inf, char_alignment, inf_states, num_taxa, inc_matrix):
    for i in prange(num_inf):
        for j in range(i, num_inf):
            if i != j:
                pair_inc = pair_score(char_alignment, inf_states, i, j, num_inf, num_taxa)
                inc_matrix[i][j] = pair_inc
                inc_matrix[j][i] = pair_inc
    return inc_matrix


#@njit(parallel=True)
def calc_nss(inc_matrix, num_inf, ntrials, orig_NSS, emp_NSS, permutation):
    for i in prange(ntrials):
        perm = sample_permutation(permutation, num_inf)
        cur_NSS = NSS(inc_matrix, perm, num_inf)
        if cur_NSS >= orig_NSS:
            emp_NSS += 1

    return emp_NSS


def calc_max_chi(alignment, site_desc, site_states, taxa_list, num_taxa, num_sites, ntrials, emp_maxchi, multiproc):
    window_scale = float(2.0 / 3.0)
    orig_maxchi, permutation, maxchi_window, result_tuple, num_poly_unambig, maxchi_window = calc_orig_maxchi(window_scale, alignment, site_desc, site_states, num_taxa, num_sites)

    if multiproc:
        result_array = np.empty(ntrials)
        result_array = njit(parallel=True)(multi_maxchi_trials)(alignment, num_taxa, num_sites, maxchi_window, permutation, site_desc, ntrials, result_array)
        for cur_maxchi in result_array:
            if cur_maxchi >= orig_maxchi:
                emp_maxchi += 1

    else:
        result_dict = {}
        for i in range(ntrials):
            result_dict[i] = calc_maxchi_trials(alignment, num_taxa, num_sites, maxchi_window, permutation, site_desc)

        for cur_maxchi in result_dict.values():
            if cur_maxchi >= orig_maxchi:
                emp_maxchi += 1

    return emp_maxchi, result_tuple, num_poly_unambig, maxchi_window


def multi_maxchi_trials(alignment, num_taxa, num_sites, maxchi_window, permutation, site_desc, ntrials, result_array):
    for i in prange(ntrials):
        result_array[i] = calc_maxchi_trials(alignment, num_taxa, num_sites, maxchi_window, permutation, site_desc)

    return result_array

if __name__ == '__main__':
    test = PhiAnalyser()
    #test.calc_profile("h_pylori.fasta", "fasta", "DNA")


