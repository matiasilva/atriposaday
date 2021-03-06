from PIL import Image
import os
from pathlib import PurePath

from detect import rescale
from detect import listreturn
from detect import extremes
from detect import apply_padding
from detect import rename

path = r'C:\Users\swan11jf\Documents\Python Projects\atriposaday\splicer\uncropped'
newfolder = r'C:\Users\swan11jf\Documents\Python Projects\atriposaday\splicer\cropped'

for root, dirs, files in os.walk(path):
    for name in files:
        if name.endswith('.png'):
            location = os.path.join(root, name)

            p = PurePath(root)

            # I know this looks disgusting but so what
            savefolder = os.path.join(p.parts[0], p.parts[1], p.parts[2], p.parts[3],
                                      p.parts[4], p.parts[5], p.parts[6], 'cropped',
                                      p.parts[8], p.parts[9])

            if not os.path.exists(savefolder):
                os.makedirs(savefolder)

            with open(location, 'r') as f:
                im = Image.open(location).convert('RGB')

                # apply rescaling
                im = rescale(im, basewidth=1500)

                horizontal, vertical = listreturn(im)

                # regular parameters
                left, right = extremes(horizontal, 125)
                top, bottom = extremes(vertical, 200)

                # # use for overcropped images
                # left, right = extremes(horizontal, 150)
                # top, bottom = extremes(vertical, 200)

                im = im.crop((left, top, right, bottom))
                im.save('rescale.png')

                # apply padding
                im = apply_padding(im)

                # apply name convention
                savepath = rename(location, savefolder)

                # save cropped image!
                print('Saving: {} to {}'.format(name, savepath))
                im.save('{}'.format(savepath))