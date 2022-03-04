from django.db import models

# Create your models here.
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn import svm

class Parser:
    def __init__(self, data_file, cat_name):
        self.data_file = data_file
        self.cat_dict = {}
        self.cat_name = cat_name
    

    def remove_empty_columns(self, df, threshold=0.95):
        column_mask = df.isnull().mean(axis=0) < threshold
        return df.loc[:, column_mask]


    # Removes any rows located above the row containing the specified target column name
    # Iterates through each row until the target category name is found. Program then assumes
    # this row contains the column names. Any row not containning the target category is dropped
    def remove_bad_rows(self, df, target):
        for index, row in df.iterrows():
        # for row in df.index:
        
            # print(f"{index}\n {row}")
            # print("TARGET:", target)
            # print(row)
            # quit()
            # lower_list = [x.lower() for x in row.tolist()]
            # print(lower_list)
            if target in row.tolist():
                print("FOUND ANCHOR ROW")
                # print(row.tolist())
                break
            else:
                df.drop(index, inplace=True)
                # print("NOT FOUND")
    
        # quit()
        return df


    # Clean up the data file by removing extra rows at the top and any empty columns    
    def clean_df(self, df):
        df = pd.DataFrame(df)
        df = df.dropna(how='all')
        df.insert(0, 'ID', range(0, len(df)))   # create new id column for index
        df.set_index('ID', inplace=True)    # assign new index to the dataframe

        df.iloc[0] = df.iloc[0].str.lower().str.title()

        df = self.remove_bad_rows(df, self.cat_name)
        df = self.remove_empty_columns(df)


        # print(df)


        header = df.iloc[0].str.lower().str.title()

        print(header)
        # quit()

        df = df[0:]
        df.rename(columns=header, inplace=True)

        # print(df.head(10))

        # print("POST")
        # quit()

        return df
    

    # Takes a .csv or .xlsx file and returns its contents using pandas read method
    # Will break on any other file types
    def get_file(self, file):
        # Reads in the data from a .xlsx (excel) file
        file_extension = str(file).split('.')[-1]
        if file_extension == "xls" or file_extension == "xlsx":
            df = pd.read_excel(file, header=None)
            return df

        # Reads in the data from a CSV file, assumes first 6 lines are garbage and can be skipped.
        # Will need to figure out how to standardize the starting point in the document later on.
        elif file_extension == "csv":
            df = pd.read_csv(file,header=None)
            return df
        else:
            print("Invalid File Type")
            quit()
    

    # Convert the raw input into a pandas DataFrame object. 
    # Also clean it up by removing extra rows and columns
    def build_df(self):
        if self.data_file:
            data = self.get_file(self.data_file)
            df = self.clean_df(data)
        else:
            print("Error - build_df - No data file found")
        return df


    # Access all rows and store them in category dictionary. The key is the category name,
    # and each value is a list containing every row that falls into corresponding category

    # Example Dictionary:

    # dict = {
    #  "Wheat / Grain / Harvest": [row1],
    #  "Wool / Lamb Products / Animal Products" : [row1, row2, row3],
    #  "Coop / Rebate / Patronage Dividends": [row1, row2],
    #   ...
    # }
    def build_cat_dict(self, df):
        for row in df.iloc:
            # print(row)
            # print(row[self.cat_name])
            # if row[self.cat_name].lower():\
            # print(row[0])
            # quit()

            if row[self.cat_name] in self.cat_dict: 
                # print("FILLED")
                self.cat_dict[row[self.cat_name]].append(row)
                
            else:
                # print("NONE, CREATING")
                self.cat_dict[row[self.cat_name]] = []
                self.cat_dict[row[self.cat_name]].append(row)
                
        d_char = "()$,"
        for key in self.cat_dict.keys():
            for i in range(0, len(self.cat_dict[key])):
                for char in d_char:

                    if (isinstance(self.cat_dict[key][i].Payment, str)):
                        self.cat_dict[key][i].Payment = self.cat_dict[key][i].Payment.replace(
                            char, "")
                    if (isinstance(self.cat_dict[key][i].Deposit, str)):
                        self.cat_dict[key][i].Deposit = self.cat_dict[key][i].Deposit.replace(
                            char,
                            "")
                if (key != 'Category'):
                    self.cat_dict[key][i].Payment = float(self.cat_dict[key][i].Payment)
                    self.cat_dict[key][i].Deposit = float(self.cat_dict[key][i].Deposit)
                
                
    # Print out the dictionary containing all of the lists for each category
    def print_cat_dict(self):
        for i in self.cat_dict.keys():
            for x in self.cat_dict[i]:
                print(x)
                print()
            print('='*100)  
    
    # Returns a list of the category names by grabbing the keys from the cat_dict dictionary
    def get_cat_names(self):
        return self.cat_dict.keys().tolist()


    # Class main function. Builds the data frame and category dictionary
    # based on data from input file.
    def run(self):
        df = self.build_df()
        self.build_cat_dict(df)

        # print()
        # str(input("Press enter to continue...\n"))

        # self.print_cat_dict()

        # df.to_csv('testdata.csv')
        
class Categorizer:           
     
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
        
    def extract_cat_name(self, cat_name, dictionary):        
        extracted = []
        for key, data in dictionary.items():
            for data in dictionary[key]:
                if (pd.isnull(data[cat_name]) == True):
                    data[cat_name] = 'Unknown'
                extracted.append(data[cat_name])
        Categorizer.load_train_data(extracted[1:], dictionary)
