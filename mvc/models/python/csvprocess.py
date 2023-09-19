import sys
import pandas as pd
from io import StringIO

# Fungsi untuk menambahkan kolom warna berdasarkan kriteria
# 0 = tanaman, 1 = bukan tanaman, -1 = di luar batas
def add_color(row):
    if row['classification'] == -1:
        return 'bk'
    elif row['classAfter'] == 1 : 
        if row['classification'] == 0:
            return 'r'
        else:
            return 'w'
    elif row['classAfter'] == 0 and row['classification'] == 1: 
        return 'b'
    else:
        return 'g'

# Baca argumen yang di-pass
csvpath1 = sys.argv[1];
csvpath2 = sys.argv[2];

df1 = pd.read_csv(csvpath1, sep=",")
df2 = pd.read_csv(csvpath2, sep=",")

## Append kolom ke df1 agar dapat menggunakan .apply()
df1['classAfter'] = df2['classification']
df1['warna'] = df1.apply(add_color, axis=1)

## buang kolom tidak perlu
df_final = df1[['x', 'y', 'warna']]

## Sort supaya tidak perlu mencari max dan min dengan js
df_final.sort_values(['x', 'y'], ascending = [True, True], inplace=True)

## Kembalikan ke proses utama
sys.stdout.write(df_final.to_csv(index=False))
sys.stdout.flush()