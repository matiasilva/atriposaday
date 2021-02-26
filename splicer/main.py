from PIL import Image
from PIL import ImageFilter
import os
from detect import rescale
from detect import initial_crop
from detect import main_crop

buffer = 100

path = r"C:\Users\swan11jf\Documents\Python Projects\tripos\test"

filelist = os.listdir(path)
for image in filelist:
    location = os.path.join(path,image)

    with open(location, 'r') as f:
        im = Image.open(location).convert('RGB')

        # im7 = im.filter(ImageFilter.MinFilter(3)).show()

        im1 = rescale(im,basewidth=1500)
        im2 = initial_crop(im1, 60, 50)

        left, top, right, bottom = main_crop(im2)

        im3 = im2.crop((left,top,right,bottom))

        im3_size = im3.size
        im4_size = (im3_size[0] + buffer, im3_size[1] + buffer)
        im4 = Image.new('RGB', im4_size, (255, 255, 255))
        im4.paste(im3, ((im4_size[0] - im3_size[0]) // 2, (im4_size[1] - im3_size[1]) // 2))
        im4.show()






