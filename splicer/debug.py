import numpy as np
from PIL import Image




def extremes(t):

    difference_binary = []
    counter = 0
    index = 0
    extremes_dict = {}

    difference = [j-i for i, j in zip(t[:-1], t[1:])]

    for i in difference:
        if i < 4:
            difference_binary.append(0)
        else:
            difference_binary.append(1)

    for i in range(len(difference_binary)):

        if difference_binary[i] == 0 and counter == 0:
            counter += 1
            index = i

        if difference_binary[i] == 0 and counter != 0:
            counter += 1

        if difference_binary[i] == 1 and counter != 0:
            extremes_dict[index] = counter - 1
            counter = 0

    v = list(extremes_dict.values())
    k = list(extremes_dict.keys())

    print(t)
    print(difference)
    print(difference_binary)
    print(extremes_dict)

    print(k[v.index(max(v))], k[v.index(max(v))] + max(v))

    # print(new)
    #
    # for i, j in zip(difference[:1], difference[1:]):
    #
    #     print(i, j)


    # print(difference)
    #
    # if reverse == 0:
    #
    #     for k in difference:
    #         if k > 1:
    #             extreme.append(difference.index(k))
    #
    #     if len(extreme) == 0:
    #         return t[0]
    #     else:
    #         a = extreme[0]
    #         return t[a+1]
    # else:
    #     for k in reversed(difference):
    #         if k > 1:
    #             extreme.append(difference.index(k))
    #
    #     if len(extreme) == 0:
    #         return t[-1]
    #     else:
    #         a = extreme[0]
    #         return t[a]

a = [1, 2, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 23, 25, 33]


extremes(a)