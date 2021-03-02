import numpy as np
from PIL import Image
import os
from pathlib import PurePath

# rescale image first and save rescaled image for debugging
def rescale(im, basewidth=1500):

    wpercent = (basewidth / float(im.size[0]))
    hsize = int((float(im.size[1]) * float(wpercent)))

    im1 = im.resize((basewidth, hsize))
    im1.save('rescale.png')

    return im1

def listreturn(im):

    na = np.array(im)

    # grab dimenisions of image
    width, height = im.size

    # detects the y and x coordinates of any black/grey blocks
    y, x = np.where(np.all(na <= [80, 80, 80], axis = 2))

    x = np.sort(x)
    y = np.sort(y)

    #order and make unique set from list
    horizontal_black = list(np.unique(x))
    vertical_black = list(np.unique(y))

    return horizontal_black, vertical_black

def extremes(t, buffer):
    difference_binary = []
    counter = 0
    index = 0
    extremes_dict = {}

    difference = [j - i for i, j in zip(t[:-1], t[1:])]

    for i in difference:
        if i < buffer:
            difference_binary.append(0)
        else:
            difference_binary.append(1)

    for i in range(len(difference_binary)):

        if difference_binary[i] == 0 and counter == 0:
            counter += 1
            index = i

        if i == len(difference_binary) - 1:
            extremes_dict[index] = counter
            break

        elif difference_binary[i] == 0 and counter != 0:
            counter += 1

        elif difference_binary[i] == 1 and counter != 0:
            extremes_dict[index] = counter - 1
            counter = 0

    v = list(extremes_dict.values())
    k = list(extremes_dict.keys())

    # print(t)
    # print(difference)
    # print(difference_binary)
    # print(extremes_dict)

    return t[k[v.index(max(v))]], t[k[v.index(max(v))] + max(v)]

def apply_padding(im, buffer = 100):
    im_size = im.size
    im2_size = (im_size[0] + buffer, im_size[1] + buffer)
    im2 = Image.new('RGB', im2_size, (255, 255, 255))
    im2.paste(im, ((im2_size[0] - im_size[0]) // 2, (im2_size[1] - im_size[1]) // 2))
    return im2

def rename(location, savefolder):
    p = PurePath(location)

    start = p.stem[0]
    end = p.stem[-1]

    if end.isdigit() == False:
        extra = '_{}'.format(ord(end) - 97)
    else:
        extra = ''

    newname = '{}{}.{}'.format(start, extra, 'png')
    savepath = os.path.join(savefolder, newname)

    return savepath

# location = 'rescale.png'
# im = Image.open(location).convert('RGB')
#
# horizontal_black, vertical_black = initial_crop(im, 20, 20, 20, 20)
#
# # apply rescaling
# left, right = extremes(horizontal_black)
# top, bottom = extremes(vertical_black)
#
# print(left, right)
# print(top, bottom)
#
# im.crop((left, top, right, bottom)).show()