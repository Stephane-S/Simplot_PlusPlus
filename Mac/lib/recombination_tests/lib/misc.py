import math
from numba import njit
import numpy as np


CHAR_START = 33
CHAR_END = 126
MAX_SIZE = 1000
MAX_STATE = 100
GLOBAL_GAP = np.array([12])
GLOBAL_MISSING = np.array([30])
MISSING_STATE = 95
IGNORE_STATE = 101

# all of these are the ascii 2 - CHAR_START
DNA_ALPHA = np.array([32,34,38,51])
DNA_ALPHA_SIZE = 4
DNA_MISSING = np.array([55,45,30])
DNA_MISSING_SIZE = 3

DNA_AMBIG = np.array([49,56,44,42,50,54,39,33,53,35])
DNA_AMBIG_SIZE = 10

AA_ALPHA = np.array([32,34,35,36,37,38,39,40,42,43,44,45,47,48,49,50,51,53,54,56])
AA_ALPHA_SIZE = 20

AA_MISSING = np.array([55,30])
AA_MISSING_SIZE = 2

AA_AMBIG = np.array([33,57])
AA_AMBIG_SIZE = 2

GAP = np.array([12])
GAP_SIZE = 1

@njit()
def valid_gap(char):
    return char in GAP

@njit()
def is_member_of(set, num, ch):
    member_bool = False
    if ch in set:
        member_bool = True

    return member_bool

@njit()
def valid_state(char, datatype):
    bool_val = False
    if datatype == 'DNA':
        bool_val = is_member_of(DNA_ALPHA, DNA_ALPHA_SIZE, char)
    elif datatype == "Protein":
        bool_val = is_member_of(AA_ALPHA, AA_ALPHA_SIZE, char)
    else:
        if char not in GLOBAL_GAP and char not in GLOBAL_MISSING:
            bool_val = True

    return bool_val

@njit()
def missing_ambig_state(char, datatype):
    bool_val = False
    if datatype == 'DNA':
        #if char in DNA_MISSING or char in DNA_AMBIG:
        if char in DNA_MISSING or char in DNA_AMBIG:
            bool_val = True
    if datatype == "Protein":
        #if char in AA_MISSING or char in AA_AMBIG:
        if char in AA_MISSING or char in AA_AMBIG:
            bool_val = True
    else:
        #if char in GLOBAL_MISSING:
        if char in GLOBAL_MISSING:
            bool_val = True

    return bool_val

@njit()
def normal_01_CDF(x):
    a1 = 0.398942280444E+00;
    a2 = 0.399903438504E+00;
    a3 = 5.75885480458E+00;
    a4 = 29.8213557808E+00;
    a5 = 2.62433121679E+00;
    a6 = 48.6959930692E+00;
    a7 = 5.92885724438E+00;
    b0 = 0.398942280385E+00;
    b1 = 3.8052E-08;
    b2 = 1.00000615302E+00;
    b3 = 3.98064794E-04;
    b4 = 1.98615381364E+00;
    b5 = 0.151679116635E+00;
    b6 = 5.29330324926E+00;
    b7 = 4.8385912808E+00;
    b8 = 15.1508972451E+00;
    b9 = 0.742380924027E+00;
    b10 = 30.789933034E+00;
    b11 = 3.99019417011E+00;

    if math.fabs(x) <= 1.28:
        y = 0.5 * x * x
        q = 0.5 - math.fabs(x) * (a1 - a2 * y / (y + a3 - a4 / (y + a5 + a6 / (y + a7))))

    elif math.fabs(x) <= 12.7:
        y = 0.5 * x * x
        q = math.exp ( - y ) * b0 / ( math.fabs ( x ) - b1
      + b2 / ( math.fabs ( x ) + b3
      + b4 / ( math.fabs ( x ) - b5
      + b6 / ( math.fabs ( x ) + b7
      - b8 / ( math.fabs ( x ) + b9
      + b10 / ( math.fabs ( x ) + b11 ) ) ) ) ) )

    else:
        q = 0.0

    if x < 0.0:
        cdf = q
    else:
        cdf = 1.0 - q

    return cdf


def normal_01_CDF(x):
    a1 = 0.398942280444E+00
    a2 = 0.399903438504E+00
    a3 = 5.75885480458E+00
    a4 = 29.8213557808E+00
    a5 = 2.62433121679E+00
    a6 = 48.6959930692E+00
    a7 = 5.92885724438E+00
    b0 = 0.398942280385E+00
    b1 = 3.8052E-08
    b2 = 1.00000615302E+00
    b3 = 3.98064794E-04
    b4 = 1.98615381364E+00
    b5 = 0.151679116635E+00
    b6 = 5.29330324926E+00
    b7 = 4.8385912808E+00
    b8 = 15.1508972451E+00
    b9 = 0.742380924027E+00
    b10 = 30.789933034E+00
    b11 = 3.99019417011E+00

    if math.fabs(x) <= 1.28:
        y = 0.5 * x * x
        q = 0.5 - math.fabs(x) * (a1 - a2 * y / (y + a3 - a4 / (y + a5 + a6 / (y + a7))))

    elif math.fabs(x) <= 12.7:
        y = 0.5 * x * x
        q = math.exp ( - y ) * b0 / ( math.fabs ( x ) - b1
      + b2 / ( math.fabs ( x ) + b3
      + b4 / ( math.fabs ( x ) - b5
      + b6 / ( math.fabs ( x ) + b7
      - b8 / ( math.fabs ( x ) + b9
      + b10 / ( math.fabs ( x ) + b11 ) ) ) ) ) )

    else:
        q = 0.0

    if x < 0.0:
        cdf = q
    else:
        cdf = 1.0 - q

    return cdf