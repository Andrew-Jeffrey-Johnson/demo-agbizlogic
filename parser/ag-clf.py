import pandas as pd
import numpy as np

# dataFile = 'sample.csv'
dataFile = './test_csv_files/sample.csv'
# dataFile = 'test_csv_files/(alternate_values)farm_with_a_little_of_everything.xlsx'
# dataFile = 'test_csv_files/(extra_space)farm_with_a_little_of_everything.csv'

# datafile = 'test_csv_files/(alternate_values)farm_with_a_little_of_everything.xlsx'


def remove_empty_columns(df, threshold=0.9):
    column_mask = df.isnull().mean(axis=0) < threshold
    return df.loc[:, column_mask]

# Removes any rows located above the row containing the specified target column name
# Iterates through each row until the target category name is found. Program then assumes
# this row contains the column names. Any row not containning the target category is dropped
def remove_bad_rows(df, catName):
    for index, row in df.iterrows():
        # print(f"{index}\n {row}")
        if catName in row.tolist():
            print("FOUND")
            break
        else:
            df.drop(index, inplace=True)
            print("NOT FOUND")
    return df

catDict = {}
finalList = []

# 0. Determine "Category" column
# catName = str(input("Input 'category' column name: "))
catName = 'Category'


# Reads in the data from a .xlsx (excel) file
if dataFile.endswith('.xlsx'):
    df = pd.read_excel(dataFile, header=None, index_col=0)

# Reads in the data from a CSV file, assumes first 6 lines are garbage and can be skipped.
# Will need to figure out how to standardize the starting point in the document later on.
elif dataFile.endswith('.csv'):
    df = pd.read_csv(dataFile, header=None)
else:
    print("Invalid File Type")
    quit()

# Clean up the data file by removing extra rows at the top and any empty columns
df = pd.DataFrame(df)
df = df.dropna(how='all')
df = remove_bad_rows(df, catName)
df = remove_empty_columns(df)
header = df.iloc[0].str.lower().str.title()
df = df[1:]
df.rename(columns=header, inplace=True)


# Get a list of all the column names
columnNames = df.columns.values.tolist()
print(columnNames)
print(df.head(10))


# Access all rows and store them in category dictionary. The key is the category name,
# and each value is a list containing every row that falls into corresponding category

# Example Dictionary:

# dict = {
#  "Ag Program Payments": [row1],
#  "Car & Truck Expense" : [row1, row2, row3, row4],
#  "Coop / Rebate / Patronage Dividends": [row1, row2],
#   ...
# }

for row in df.iloc:
    # print(row);
    # print(row[catName])


    if row[catName] in catDict: 
        # print("FILLED")
        catDict[row[catName]].append(row)
        
    else:
        # print("NONE, CREATING")
        catDict[row[catName]] = []
        catDict[row[catName]].append(row)



# Print out the dictionary containing all of the lists for each category
for i in catDict.keys():
    for x in catDict[i]:
        print(x)
        print()
    print('='*100)
    

# Print all keys in catDict
# l1 = list(catDict.keys())
# for i in l1:
#     print(i)
#     print()
#     # print(catDict[i])

#     for x in catDict:
#         print(x)
#         print()

#     print()
#     print()

# print(catDict['Ag Program Payments'])
# print(catDict.)

# 1. Get a list of category names
# 2. Use list of categories to build a list of 


# df.to_csv('')

print()
print("DONE")