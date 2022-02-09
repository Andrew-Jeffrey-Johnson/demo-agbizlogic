import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn import svm

def remove_empty_columns(df, threshold=0.9):
    column_mask = df.isnull().mean(axis=0) < threshold
    return df.loc[:, column_mask]

# fileName = '(alternate_values)farm_with_a_little_of_everything.csv'
# fileName = '(key)farm_with_a_little_of_everything.csv'
# fileName = '(swapped_columns)farm_with_a_little_of_everything.csv'
fileName = 'test_csv_files/(extra_space)farm_with_a_little_of_everything.csv'

if fileName.endswith('.csv'):
    df = pd.read_csv(fileName, header=None)
elif fileName.endswith('.xls') or fileName.endswith('.xlsx'):
    df = pd.read_excel(fileName, header=None)
else:
    print("Invalid filename")
    quit()

df = pd.DataFrame(df).dropna(how='all')
df = remove_empty_columns(df)
header = df.iloc[0].str.lower().str.title()
df = df[1:]
df.rename(columns=header, inplace=True)
df = df[['Category','Tags']].drop_duplicates().dropna()
df.reset_index(inplace=True, drop=True)
df.to_csv('data.csv')
# print(df.columns.values.tolist())
print(df)

train_x = df['Tags'].tolist()
train_y = df['Category'].tolist()
vectorizer = CountVectorizer(binary=True)
train_x_vectors = vectorizer.fit_transform(train_x)
print("\ntrain_x from Tags:\n", train_x)
print("\ntrain_y from Category:\n", train_y)
print("\nvectorizer.get_feature_names_out():\n", vectorizer.get_feature_names_out())
print("\ntrain_x_vectors.toarray():\n", train_x_vectors.toarray())

clf = svm.SVC(kernel='linear')
clf.fit(train_x_vectors, train_y)

# test_tags = 'Gas / Gasoline / Petrol / Petroleum / Fuel / Oil / Diesel'
test_tags = 'Gas / Gasoline'
test_x = vectorizer.transform([test_tags])

print("\nPredicted Category:\n", clf.predict(test_x))