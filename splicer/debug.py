import numpy as np
from PIL import Image

a = [1, 2, 6, 4, 9, 10]
def difference(t, reverse):

    extreme = []
    difference = [j-i for i, j in zip(t[:-1], t[1:])]

    if reverse == 0:

        for k in difference:
            if k > 1:
                extreme.append(difference.index(k))

        if len(extreme) == 0:
            return t[0]
        else:
            a = extreme[0]
            return t[a+1]
    else:
        for k in reversed(difference):
            if k > 1:
                extreme.append(difference.index(k))

        if len(extreme) == 0:
            return t[-1]
        else:
            a = extreme[0]
            return t[a]

print(difference(a, 1))

# crop out the header and footer, and any errant pixels from left to right
# def initial_crop(im, l=200):
#
#     na = np.array(im)
#
#     # detects the y and x coordinates of any black/grey blocks
#     y, x = np.where(np.all(na <= [80, 80, 80], axis = 2))
#
#     x = np.sort(x)
#
#     #order and make unique set from list
#     horizontal_black = list(np.unique(x))
#
#     print(horizontal_black)
#
#     print(difference(horizontal_black, 1))
#
# im = Image.open('resized.png').convert('RGB')
# im2 = initial_crop(im)