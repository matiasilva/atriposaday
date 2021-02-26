from PIL import Image
from PIL import ImageFilter
import os
from detect import rescale
from detect import initial_crop
from detect import main_crop

buffer = 100

# open everything in testimages
script_dir = os.path.dirname(__file__)
inputpath = os.path.join(script_dir, 'testimages')

for file in os.listdir(inputpath):
    location = os.path.join(inputpath, file)

    with open(location, 'r') as f:
        im = Image.open(location).convert('RGB')

        # im7 = im.filter(ImageFilter.MinFilter(3)).show()

        # apply rescaling

        im1 = rescale(im,basewidth=1500)

        # apply initial crop
        im2 = initial_crop(im1)

        #apply main crop

        left, top, right, bottom = main_crop(im2)
        im3 = im2.crop((left,top,right,bottom))

        # add back padding
        im3_size = im3.size
        im4_size = (im3_size[0] + buffer, im3_size[1] + buffer)
        im4 = Image.new('RGB', im4_size, (255, 255, 255))
        im4.paste(im3, ((im4_size[0] - im3_size[0]) // 2, (im4_size[1] - im3_size[1]) // 2))

        # outputpath = os.path.join(script_dir, 'testimagescropped')
        # print(outputpath)
        im4.save('{}'.format(file))






