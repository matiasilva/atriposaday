from PIL import Image
from PIL import ImageFilter
import os
from detect import rescale
from detect import initial_crop
from detect import main_crop

buffer = 0

script_dir = os.path.dirname(__file__)
abspath = os.path.join(script_dir, 'testimages')

for file in os.listdir(abspath):
    location = os.path.join(abspath, file)

    with open(location, 'r') as f:
        im = Image.open(location).convert('RGB')

        # im7 = im.filter(ImageFilter.MinFilter(3)).show()

        im1 = rescale(im,basewidth=1500)
        im2 = initial_crop(im1).show()

        left, top, right, bottom = main_crop(im2)

        im3 = im2.crop((left,top,right,bottom))

        im3_size = im3.size
        im4_size = (im3_size[0] + buffer, im3_size[1] + buffer)
        im4 = Image.new('RGB', im4_size, (255, 255, 255))
        im4.paste(im3, ((im4_size[0] - im3_size[0]) // 2, (im4_size[1] - im3_size[1]) // 2))
        im4.show()






