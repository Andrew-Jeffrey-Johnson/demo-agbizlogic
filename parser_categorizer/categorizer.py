import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn import svm

class Categorizer:           
    
    def classified(predicted, dictionary):

        uncategorized = []
        categorized = []
        new_dict = dictionary
        predicted_cat = np.array(predicted).flatten()
        count = 0
        for i in new_dict.keys():
            for data in new_dict[i]:
                if count >= (len(predicted_cat)):
                    break
                else:
                    data['Category'] = predicted_cat[count]
                    count += 1
                    if data['Category'] == 'Unknown':
                        uncategorized.append(data)
                    else:
                        categorized.append(data)                   
    
        # print("\n--------uncategorized:\n", uncategorized)
        # print("\n--------categorized:\n", categorized)
        # print("Number of uncategorized data:", len(uncategorized))
        # print("Number of categorized data:", len(categorized))
        # print(np.shape(uncategorized))
        # print(np.shape(categorized))
        
        # for value in uncategorized:
            # value['Total By Category'] = float(value['Total By Category'])
            # numbers = re.sub(r'[^0-9]', '', value['Total By Category'])
            # numbers = [float(s) for s in re.findall(r'-?\d+\.?\d*', value)]
            # print(str(value['Payment']).strip("$()"))
            # value['Payment'] = str(value['Payment']).strip("$()-")
            # if isalnum(value['Payment']):
                # value['Payment'] = float(value['Payment'])
            # value['Payment'] = re.sub(r'[^0-9]', '', str(value['Payment']))
            # value['Payment'] = float(value['Payment'])
            # print(value['Payment'])
            # print(type(value['Payment']), "\t", value['Payment'])
            # if value['Total By Category']:
            #     print(value['Tags'])
            #     print(value['Total By Category'])
            # print(type(value['Total By Category']), "\t", value['Total By Category'])
        # print(numbers)
     
    def train(test_data, df, dictionary):
        train_x = df['Tags'].tolist()
        train_y = df['Category'].tolist()
        vectorizer = CountVectorizer(binary=True)
        train_x_vectors = vectorizer.fit_transform(train_x)        
        clf = svm.SVC(kernel='linear')
        clf.fit(train_x_vectors, train_y)        
        predicted = [list(clf.predict(vectorizer.transform([data]))) for data in test_data]
 
        categories = []
        for key, data in dictionary.items():
            for data in dictionary[key]:
                if 'Category' not in data:
                    categories.append(data['Tags'])
                else:
                    categories.append(data['Category'])            
        df = pd.DataFrame(list(zip(test_data[1:], categories[1:], np.array(predicted).flatten()[1:])), columns=['cat_name','Category','Predicted Category'])
        print("Predicted data:\n",df)
        df.to_csv('predicted_categories.csv')
        Categorizer.classified(predicted, dictionary)
    
    def load_train_data(test_data, dictionary):
        df = pd.read_csv('tags_combination.csv', header=None)
        df = pd.DataFrame(df).dropna(how='all')
        header = df.iloc[0].str.lower().str.title()
        df = df[1:]
        df.rename(columns=header, inplace=True)
        df = df[['Tags','Category']].drop_duplicates().dropna()
        # print("Train data:\n", df)
        print('='*100)
        df.reset_index(inplace=True, drop=True)
        Categorizer.train(test_data, df, dictionary)
        
    def extract_cat_name(self, cat_name, dictionary):        
        extracted = []
        for key, data in dictionary.items():
            for data in dictionary[key]:
                if (pd.isnull(data[cat_name]) == True):
                    data[cat_name] = 'Unknown'
                extracted.append(data[cat_name])
        Categorizer.load_train_data(extracted, dictionary)
        