import numpy as np
from PIL import Image

# rescale image first and save rescaled image for debugging
def rescale(im, basewidth=1500):

    wpercent = (basewidth / float(im.size[0]))
    hsize = int((float(im.size[1]) * float(wpercent)))

    im1 = im.resize((basewidth, hsize))
    im2 = im1.save('resized.png')

    return im1


def initial_crop(im, t=20, h=20, l=10, r=10, buffer=5):

    na = np.array(im)

    # grab dimenisions of image
    width, height = im.size

    # detects the y coordinate of any black blocks
    y, x = np.where(np.all(na <= [80, 80, 80], axis = 2))
    x, y = np.sort(x), np.sort(y)

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

    # find location of footer coordinate
    for j in range(len(vertical_black), 0, -1):
        if j == len(vertical_black):
            base = vertical_black[j - 1]
        elif abs(vertical_black[j] - base) > h:
            bottom_margin = base
            break
        elif abs(vertical_black[j] - base) < h:
            base = vertical_black[j]

    # Remove LHS Noise
    for i in range(len(horizontal_black)):
        if i == 0:
            base = horizontal_black[i]
        elif horizontal_black[i] - base > l:
            left_margin = base
            break
        elif horizontal_black[i] - base < l:
            base = horizontal_black[i]

    # find Remove RHS Noise
    for j in range(len(horizontal_black), 0, -1):
        if j == len(horizontal_black):
            base = horizontal_black[j - 1]
        elif abs(horizontal_black[j] - base) > r:
            right_margin = base
            break
        elif abs(horizontal_black[j] - base) < r:
            base = horizontal_black[j]

    print(top_margin)
    print(bottom_margin)
    print(left_margin)
    print(right_margin)

    cropped = im.crop((left_margin+buffer, top_margin+buffer, right_margin-buffer, bottom_margin-buffer))
    return cropped

# im = Image.open('resized.png').convert('RGB')
# im1 = rescale(im)
# im2 = initial_crop(im1, 20, 20).show()


def main_crop(im):
    na = np.array(im)

    # Find X,Y coordinates of all black/greyish pixels
    blackY, blackX = np.where(np.all(na <= [250, 250, 250], axis=2))
    blackY = np.sort(blackY)
    blackX = np.sort(blackX)
    top, bottom = blackY[0], blackY[-1]
    left, right = blackX[0], blackX[-1]

    return left, top, right, bottom