import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn import svm

class Categorizer:           
     
    def train(test_data, df, dictionary):
        train_x = df['Tags'].tolist()
        train_y = df['Category'].tolist()
        vectorizer = CountVectorizer(binary=True)
        train_x_vectors = vectorizer.fit_transform(train_x)        
        clf = svm.SVC(kernel='linear')
        clf.fit(train_x_vectors, train_y)
 
        categories = []
        for key, data in dictionary.items():
            for data in dictionary[key]:
                if 'Category' not in data:
                    categories.append(data['Tags'])
                else:
                    categories.append(data['Category'])
        predicted = [list(clf.predict(vectorizer.transform([data]))) for data in test_data]    
        df = pd.DataFrame(list(zip(test_data, categories[1:], np.array(predicted).flatten())), columns=['cat_name','Category','Predicted Category'])
        print("Predicted data:\n",df)
        df.to_csv('predicted_categories.csv')
    
    def load_train_data(test_data, dictionary):
        df = pd.read_csv('tags_combination.csv', header=None)
        df = pd.DataFrame(df).dropna(how='all')
        header = df.iloc[0].str.lower().str.title()
        df = df[1:]
        df.rename(columns=header, inplace=True)
        df = df[['Tags','Category']].drop_duplicates().dropna()
        print("Train data:\n", df)
        print('='*100)
        df.reset_index(inplace=True, drop=True)
        Categorizer.train(test_data, df, dictionary)
        
    def extract_cat_name(self, cat_name, df):        
        extracted = []
        for key, data in df.items():
            for data in df[key]:
                if (pd.isnull(data[cat_name]) == True):
                    data[cat_name] = 'Unknown'
                extracted.append(data[cat_name])
        Categorizer.load_train_data(extracted[1:], df)
        