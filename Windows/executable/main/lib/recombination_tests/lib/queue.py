from numba.experimental import jitclass
from numba import int64
import numpy as np

spec = [
    ('max_size', int64), # a simple scalar field
    ('front', int64),
    ('back', int64),
    ('cur_size', int64),
    ('elements', int64[:]),          # an array field
]


@jitclass(spec)
class QueueElem:
    def __init__(self, a):
        self.max_size = a
        self.front = 0
        self.back = 0
        self.cur_size = 0
        self.elements = np.zeros(a, dtype=int64)

    def clear_queue(self):
        self.front = 0
        self.back = 0
        self.cur_size = 0

    def enqueue(self, elem):
        if self.cur_size == self.max_size:
            #return -1
            pass
        else:
            self.elements[self.back] = elem
            self.cur_size += 1
            # loop around storage space
            self.back = (self.back + 1) % self.max_size
            #return self

    def at_position(self, elem, index):
        if index > self.cur_size:
            pass
        else:
            mapped_index = (self.front + index) % self.max_size
            elem = self.elements[mapped_index]

        return elem

    def dequeue_front(self, elem):
        if self.cur_size == 0:
            print ("cannot dequeue")
            return -1
        else:
            elem = self.elements[self.front]
            self.cur_size -= 1
            # loop around storage space
            self.front = (self.front + 1) % self.max_size
            return elem

