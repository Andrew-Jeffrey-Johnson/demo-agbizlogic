import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

class Categorizer:
    # def dictionary(self, df):
    #     for i in df.keys():
    #         for x in df[i]:
    #             print(x)
    #             print()
    #         print('='*100)
    #     print("dictionary found")
    
    def extract_cat_name(self, cat_name, df):
        result = []
        # key ---> Ag Program Payments, Car & Truck Expense, ...
        for key, data in df.items():
            for data in df[key]:
                # remove duplicates and store only one value
                if data[cat_name] not in result:
                    result.append(data[cat_name])
        # remove nan
        cat_name_data = [item for item in result if not(pd.isnull(item)) == True]
        tfidf_vectorizer = TfidfVectorizer()
        tfidf_vectorizer.fit(cat_name_data)
        print("cat_name_data:\n", cat_name_data)
        print()
        print("tfidf_vectorizer.get_feature_names_out():\n", tfidf_vectorizer.get_feature_names_out())
        print()
        print("tfidf_vectorizer.vocabulary:\n", tfidf_vectorizer.vocabulary_)
        print()
        print("tfidf_vectorizer.transform:\n", tfidf_vectorizer.transform(cat_name_data).toarray())
        # cat_name_data_vectors = tfidf_vectorizer.transform(cat_name_data).toarray()
        # np.savetxt('cat_data.csv', cat_name_data_vectors, fmt='%s', delimiter=',')
