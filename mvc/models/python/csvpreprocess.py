import sys
import pandas as pd

# File CSV yang diperiksa, kolom-kolom yang harus ada, dan label yang akan dihitung.
file_path = ""+sys.argv[1]
desired_columns = ['x', 'y', 'classification']
target_val = 0
with open("./text.txt", "w") as file:
    # Write the string to the file
    file.write(file_path)

# Membaca file CSV ke dalam DataFrame
df = pd.read_csv(file_path)

# Memeriksa apakah semua kolom dalam set tertentu ada dalam DataFrame
columns_exist = all(col in df.columns for col in desired_columns)

# Menampilkan hasil
if columns_exist:
    ct = df[df['classification']==target_val].count()
    green_pixel = ct['x']
    sys.stdout.write(str(green_pixel))
    sys.stdout.flush()
else:
    sys.stdout.write('INVALID')
    sys.stdout.flush()
