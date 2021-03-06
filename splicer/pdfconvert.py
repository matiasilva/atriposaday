from pdf2image import convert_from_path
import os

path = r'C:\Users\swan11jf\Documents\Python Projects\atriposaday\splicer\.raw_files\2P6_pdf'

for root, dirs, files in os.walk(path):
    for name in files:
        if name.endswith('.pdf'):
            location = os.path.join(root, name)

            with open(location, 'r') as f:
                images = convert_from_path(location)
                for i in range(len(images)):
                    new_location = os.path.join(root, name[:-4] + '_' + str(i) + '.png')
                    print(new_location)
                    images[i].save('{}'.format(new_location))