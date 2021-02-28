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

def difference(t, margin, reverse):

    extreme = []
    difference = [j-i for i, j in zip(t[:-1], t[1:])]

    if reverse == 0:

        for k in difference:
            if k > margin:
                extreme.append(difference.index(k))

        if len(extreme) == 0:
            return t[0]
        else:
            a = extreme[0]
            return t[a+1]
    else:
        for k in reversed(difference):
            if k > margin:
                extreme.append(difference.index(k))

        if len(extreme) == 0:
            return t[-1]
        else:
            a = extreme[0]
            return t[a]

# crop out the header and footer, and any errant pixels from left to right
def initial_crop(im, t, b, l, r, bf=30):

    na = np.array(im)

    # grab dimenisions of image
    width, height = im.size

    # detects the y and x coordinates of any black/grey blocks
    y, x = np.where(np.all(na <= [80, 80, 80], axis = 2))

    x = np.sort(x)
    y = np.sort(y)

    #order and make unique set from list
    horizontal_black = np.unique(x)
    horizontal_black = list(horizontal_black)

    vertical_black = np.unique(y)
    vertical_black = list(vertical_black)

    return horizontal_black, vertical_black

    # # find location of header coordinate
    # top = difference(vertical_black, t, 0)
    # bottom = difference(vertical_black, b, 1)
    # left = difference(horizontal_black, l, 0)
    # right = difference(horizontal_black, r, 1)
    #
    # cropped = im.crop((left-bf, top-bf, right+bf, bottom+bf))
    # cropped.save('initial_crop.png')
    #
    # return cropped

# def main_crop(im):
#     na = np.array(im)
#
#     # Find X,Y coordinates of all black/greyish pixels
#     blackY, blackX = np.where(np.all(na <= [250, 250, 250], axis=2))
#     blackY = np.sort(blackY)
#     blackX = np.sort(blackX)
#     top, bottom = blackY[0], blackY[-1]
#     left, right = blackX[0], blackX[-1]
#
#     return left, top, right, bottom

def apply_padding(im, buffer = 100):
    im_size = im.size
    im2_size = (im_size[0] + buffer, im_size[1] + buffer)
    im2 = Image.new('RGB', im2_size, (255, 255, 255))
    im2.paste(im2, ((im2_size[0] - im_size[0]) // 2, (im2_size[1] - im_size[1]) // 2))
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


def extremes(t):
    difference_binary = []
    counter = 0
    index = 0
    extremes_dict = {}

    difference = [j - i for i, j in zip(t[:-1], t[1:])]

    for i in difference:
        if i < 200:
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

    print(t)
    print(difference)
    print(difference_binary)
    print(extremes_dict)

    return t[k[v.index(max(v))]], t[k[v.index(max(v))] + max(v)]

location = 'rescale.png'
im = Image.open(location).convert('RGB')

horizontal_black, vertical_black = initial_crop(im, 20, 20, 20, 20)

# apply rescaling
left, right = extremes(horizontal_black)
top, bottom = extremes(vertical_black)

print(left, right)
print(top, bottom)

im.crop((left, top, right, bottom)).show()