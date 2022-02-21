import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn import svm
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score

def remove_empty_columns(df, threshold=0.9):
    column_mask = df.isnull().mean(axis=0) < threshold
    return df.loc[:, column_mask]

# fileName = '(alternate_values)farm_with_a_little_of_everything.csv'
# fileName = '(key)farm_with_a_little_of_everything.csv'
# fileName = '(swapped_columns)farm_with_a_little_of_everything.csv'
# fileName = 'test_csv_files/(extra_space)farm_with_a_little_of_everything.csv'
fileName = 'tags_combination.csv'

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
df = df[['Tags','Category']].drop_duplicates().dropna()
df.reset_index(inplace=True, drop=True)
df.to_csv('data.csv')
# print(df.columns.values.tolist())
print(df)

train_x = df['Tags'].tolist()
train_y = df['Category'].tolist()
vectorizer = CountVectorizer(binary=True)
train_x_vectors = vectorizer.fit_transform(train_x)

# train_x, test_x, train_y, test_y = train_test_split(train_x, train_y, test_size=0.3, stratify=train_y, random_state=1)
# tree = DecisionTreeClassifier(max_depth=9)
# tree.fit(train_x, train_y)
# pred_train = tree.predict(train_x)
# acc_train = accuracy_score(train_y, pred_train)
# print(f'acc_train: {acc_train}')

# vectorizer = TfidfVectorizer()
# vectorizer.fit(train_x)
# cat_name_data_vectors = vectorizer.transform(train_x).toarray()
# np.savetxt('cat_data.csv', cat_name_data_vectors, fmt='%s', delimiter=',')
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
# acc_train = accuracy_score()