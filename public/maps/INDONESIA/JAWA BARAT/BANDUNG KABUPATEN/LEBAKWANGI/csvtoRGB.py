#!/usr/bin/env python
# coding: utf-8

# In[5]:


import numpy as np
import pandas as pd
from PIL import Image
import matplotlib.pyplot as plt
import os
import glob
  
path = os.getcwd()
csv_files = glob.glob(os.path.join(path, "*.csv"))
df_ori = pd.read_csv(os.getcwd()+"\\lebakwangi.csv")
df_ori.sort_values(['x', 'y'], ascending = [True, True], inplace=True)

# for path in csv_files:
# print(path)
df = pd.read_csv("C:\\Users\\reinh\\Documents\\GitHub\\areahijau\\public\\maps\\LEBAKWANGI\\2015.csv")
df.sort_values(['x', 'y'], ascending = [True, True], inplace=True)

df = df.merge(df_ori[['x', 'y', "B02","B03","B04"]], how='left', on=['x','y'])


# In[6]:


image_width =  df['x'].max()+1
image_height = df['y'].max()+1

image = Image.new('RGB', (image_width, image_height), 'white')

band2 = df['B02'].values
band3 = df['B03'].values
band4 = df['B04'].values
x_coords = df['x'].values
y_coords = df['y'].values

band2 = ((band2 - band2.min()) / (band2.max() - band2.min()) * 255).astype(int)
band3 = ((band3 - band3.min()) / (band3.max() - band3.min()) * 255).astype(int)
band4 = ((band4 - band4.min()) / (band4.max() - band4.min()) * 255).astype(int)

pixel_data = np.zeros((image_height, image_width, 3), dtype=np.uint8)

for x, y, b2, b3, b4 in zip(x_coords, y_coords, band2, band3, band4):
    pixel_data[y, x] = (b4, b3, b2)  # (red, green, blue)

image = Image.fromarray(pixel_data, 'RGB')

# image.save('output_image.png')

image.show()
    

