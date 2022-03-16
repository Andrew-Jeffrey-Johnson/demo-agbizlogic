import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn import svm

file0 = 'test_csv_files/Capstone 2022 data.xlsx'
file1 = 'test_csv_files/Capstone 2022 data_income.xlsx'
file2 = 'test_csv_files/Capstone 2022 data_expense.xlsx'


class Parser:
    def __init__(self, data_file):
        self.data_file = data_file
        self.cat_dict = {}
        
    # Print out the dictionary containing all of the lists for each category
    def print_cat_dict(self):
        # textfile = open("dictionary.txt", "w")
        for index, data in self.cat_dict.items():
            print("index:", index)
            for key in data:
                print(key + ":", data[key])
                # textfile.write(key + ": " + str(data[key]) + "\n")
            print('='*100)
            # textfile.write('='*100 + "\n")
        # textfile.close()
        
    def remove_empty_columns(self, df, threshold=0.95):
        column_mask = df.isnull().mean(axis=0) < threshold
        return df.loc[:, column_mask]
    
    # Clean up the data file by removing extra rows at the top and any empty columns 
    def clean_df(self, df):
        df = self.remove_empty_columns(df)
        # print(df)
        df = df.iloc[:,[0,1]]
        # df = pd.DataFrame(df)
        df = df.dropna(how='any')
        df.insert(0, 'ID', range(0, len(df)))   # create new id column for index
        df.set_index('ID', inplace=True)    # assign new index to the dataframe
        df.iloc[0] = df.iloc[0].str.lower().str.title()
        header = df.iloc[0].str.lower().str.title()
        # print(header)
        df = df[1:]
        df.rename(columns=header, inplace=True)
        # Converts the types of the objects like object->string or object->int(or float)
        df = df.convert_dtypes()
        # print(df)
        # print(df.dtypes)
        return df
    
    # Takes a .csv or .xlsx file and returns its contents using pandas read method
    # Will break on any other file types        
    def get_file(self, file):
        # print(file)
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
    # cat_dict = {
    #  1: {'column1': 'category name', 'column2': (int or float)value},
    #  2: {'column1': 'category name', 'column2': (int or float)value},
    #  3: {'column1': 'category name', 'column2': (int or float)value},
    #   ...
    # }
    def build_df(self):
        if self.data_file:
            data = self.get_file(self.data_file)
            df = self.clean_df(data)
            self.cat_dict = df.to_dict('index')
        else:
            print("Error - build_df - No data file found")
        return df
    
    # Class main function. Builds the data frame and category dictionary
    # based on data from input file.                
    def run(self):
        df = self.build_df()
        # self.build_cat_dict(df)
        # print(df)
        print()
        print("\ncat_dict in Parser:\n", self.cat_dict)
        # self.print_cat_dict()


class Categorizer:
    def __init__(self, cat_dict):
        self.cat_dict = cat_dict
        self.results = { "done": [], "todo": [] }      

    # Classifies 'Income' or 'Expense' by 'Type' and stores each in a list
    def classified(self, predicted):
        uncategorized = []
        categorized = []
        income_data = []
        expense_data = []

        for index, data in self.cat_dict.items():
            if data['Type'] == 'Income':
                income_data.append(data)
                categorized.append(data)
            elif data['Type'] == 'Expense':
                expense_data.append(data)
                categorized.append(data)
            else:
                uncategorized.append(data)
        
        print("\ncat_dict in Categorizer:\n", self.cat_dict)
        # print("\n-----uncategorized:\n", uncategorized)
        # print("\n-----categorized:\n", categorized)
        print("\n-----income_data:\n", income_data)
        print("\n-----expense_data:\n", expense_data)
        # print("\nShape of uncategorized:", np.shape(uncategorized))
        # print("Shape of categorized:", np.shape(categorized))
        
        self.results["done"] = categorized
        self.results["todo"] = uncategorized
        
        print("Classified data into income and expense..")
        # return { "done": categorized, "todo": uncategorized }
    
    # Identifies whether a category is 'Income' or 'Expense'
    def train(self, test_data, df):
        train_x = df['Category'].tolist()
        train_y = df['Type'].tolist()
        vectorizer = CountVectorizer(binary=True)
        train_x_vectors = vectorizer.fit_transform(train_x)        
        clf = svm.SVC(kernel='linear')
        clf.fit(train_x_vectors, train_y)        
        predicted = [list(clf.predict(vectorizer.transform([data]))) for data in test_data]
        predicted = np.array(predicted).flatten()
        # print("\npredicted:\n", predicted)
        
        # cat_dict = {
        #  1: {'column1': 'category name', 'column2': (int or float)value, 'column3': 'type'},
        #  2: {'column1': 'category name', 'column2': (int or float)value, 'column3': 'type'},
        #  3: {'column1': 'category name', 'column2': (int or float)value, 'column3': 'type'},
        #   ...
        # }
        # Appends types as the 3rd data to cat_dict
        for index, data in self.cat_dict.items():
            data['Type'] = predicted[index - 1]
        # print(self.cat_dict)
        predicted_data = pd.DataFrame(list(zip(test_data, predicted)), columns=['Category','Type'])
        # print("\nPredicted data:\n",predicted_data)
        # df.to_csv('import_csv/predicted_typeegories.csv')
        predicted_data.to_csv('predicted_types.csv')
        print("Trained Categories..")
        self.classified(predicted)
    
    # Load training data with categories and types.
    def load_train_data(self, test_data):
        # df = pd.read_csv('import_csv/Income_Expense_Categories.csv', header=None)
        df = pd.read_csv('Income_Expense_Categories.csv', header=None)
        df = pd.DataFrame(df).dropna(how='all')
        header = df.iloc[0].str.lower().str.title()
        df = df[1:]
        df.rename(columns=header, inplace=True)
        df = df[['Category','Type']].drop_duplicates().dropna()
        # print("Train data:\n", df)
        # print('='*100)
        df.reset_index(inplace=True, drop=True)
        print("Loaded train data..")
        self.train(test_data, df)
        
    
    # extracted = [
    #  'Sales of livestock, produce, grains & other products',
    #  'Cooperative distributions received',
    #  'Agricultural program payments',
    #   ...
    # ]
    # Extracts the categories as test_data to train
    def extract_cat_name(self):
        extracted = []
        for index, data in self.cat_dict.items():
            extracted.append(list(data.values())[0])
        # print(extracted)
        print("Extrated Categories..")
        self.load_train_data(extracted)

    def run(self):
        print("Running Categorizer..")
        self.extract_cat_name()
         
p = Parser(file2)
p.run()

c = Categorizer(p.cat_dict)
c.run()