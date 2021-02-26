import numpy as np
from PIL import Image

# rescale image first and save rescaled image for debugging
def rescale(im, basewidth=1500):

    wpercent = (basewidth / float(im.size[0]))
    hsize = int((float(im.size[1]) * float(wpercent)))

    im1 = im.resize((basewidth, hsize))
    im2 = im1.save('resized.png')

    return im1

# crop out the header and footer, and any errant pixels from left to right
def initial_crop(im, t=20, b=20, l=10, r=10, buffer=10):

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

    # find location of header coordinate
    for i in range(len(vertical_black)):
        if i == 0:
            base = vertical_black[i]
        elif vertical_black[i] - base > t:
            top_margin = base
            break
        elif vertical_black[i] - base < t:
            base = vertical_black[i]

    vertical_black.reverse()

    # find location of footer coordinate
    for j in range(len(vertical_black)):
        if j == 0:
            base = vertical_black[j]
        elif vertical_black[j] - base > b:
            bottom_margin = base
            break
        elif vertical_black[j] - base < b:
            base = vertical_black[j]


    # Remove LHS Noise
    for k in range(len(horizontal_black)):
        p = horizontal_black[k]
        if k == 0:
            base = horizontal_black[k]
        elif horizontal_black[k] - base > l:
            left_margin = base
            break
        elif horizontal_black[k] - base < l:
            base = horizontal_black[k]


    # find Remove RHS Noise

    horizontal_black.reverse()

    for k in range(len(horizontal_black)):
        q = horizontal_black[k]
        if k == 0:
            base = horizontal_black[k]
        elif horizontal_black[k] - base > r:
            right_margin = base
            break
        elif horizontal_black[k] - base < r:
            base = horizontal_black[k]

    cropped = im.crop((left_margin+buffer, top_margin+buffer, right_margin-buffer, bottom_margin-buffer))
    return cropped


# im = Image.open('resized.png').convert('RGB')
# im1 = rescale(im)
# im2 = initial_crop(im1, 20, 20)

def main_crop(im):
    na = np.array(im)

    # Find X,Y coordinates of all black/greyish pixels
    blackY, blackX = np.where(np.all(na <= [250, 250, 250], axis=2))
    blackY = np.sort(blackY)
    blackX = np.sort(blackX)
    top, bottom = blackY[0], blackY[-1]
    left, right = blackX[0], blackX[-1]

    return left, top, right, bottom