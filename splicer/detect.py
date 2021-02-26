from PIL import Image
import numpy as np

#testing whether this pushes or not

#CONSTANTS
basewidth = 1500
white = []
footer = []
footer2 = []

#DEFINITIONS

# rescale image first and save rescaled image for debugging
def rescale(image):
    im = Image.open(image).convert('RGB')

    wpercent = (basewidth / float(im.size[0]))
    hsize = int((float(im.size[1]) * float(wpercent)))

    im1 = im.resize((basewidth, hsize))
    im2 = im1.save('resized.png')

    return im1

# allows mutliple variable iteration over a list (think of a siding window
def chunker(seq, size):
    return (seq[pos:pos + size] for pos in range(0, len(seq), size))

# # detects whether a list has continous variables
# def cont(my_list):
#     return not any(a+1!=b for a, b in zip(my_list, my_list[1:]))

#MAIN
image = r'test.png'

# apply rescaling, make a copy of image
im1 = rescale(image)
na = np.array(im1)
orig = na.copy()

# grab dimenisions of image
width, height = im1.size

# detects the y coordinate of any black blocks
y = np.where(np.all(na <= [250, 250, 250], axis=2))[0]
y = np.sort(y)
black = np.unique(y)

# for i in range(height):
#     if i not in black:
#         white.append(i)

for values in chunker(black, 5):
    footer.append(values)

footer = list(footer)

for i in range(len(footer)):
    new = footer[i]

    for j in range(len(new)):
        if j == 0:
            base = new[j]
        if new[j] - base > 20:
            print(base)

    # for j in footer[i]:
    #     if j == 1:
    #         break
    #     elif footer[i][j] not in range(footer[i][j-1], 20):
    #         print('help')

    # elif footer[i][0] - footer[i-1][-1] > 5:
    #     print(footer[i][0])
    #     # print(footer[i-1][-1])
    #
    #     # print((footer[i-1][-1]))
    #     # break



    # if i not in y_unique:
    #     whitelines.append(i)
    #
    #     if len(whitelines) > blankspace:


        # # Find X,Y coordinates of all black/greyish pixels
        # blackY, blackX = np.where(np.all(na<=[250,250,250],axis=2))
        # blackY = np.sort(blackY)
        # blackX = np.sort(blackX)
        # top, bottom = blackY[0], blackY[-1]
        # left, right = blackX[0], blackX[-1]
        #
        # print(left,top,right,bottom)
        #
        # im.crop((left-buffer,top-buffer,right+buffer,bottom+buffer)).save('{}'.format(image))
        #
        # # Extract Region of Interest and apply buffer as margin
        # # ROI = orig[(top-buffer):(bottom+buffer), (left-buffer):(right+buffer)]
        # #
        # # im2 = Image.fromarray(ROI).save('{}'.format(image))