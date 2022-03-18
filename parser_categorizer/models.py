import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn import svm

file0 = 'import_csv/Capstone 2022 data.xlsx'
file1 = 'import_csv/Capstone 2022 data_income.xlsx'
file2 = 'import_csv/Capstone 2022 data_expense.xlsx'



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
        df = df.dropna(how='any')
        df.insert(0, 'ID', range(0, len(df)))   # create new id column for index
        df.set_index('ID', inplace=True)    # assign new index to the dataframe
        df = df.set_axis(['Category', 'Amount'], axis=1)
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
        print("\ncat_dict in Parser:\n", self.cat_dict)
        # self.print_cat_dict()


class Categorizer:
    def __init__(self, cat_dict):
        self.cat_dict = cat_dict
        self.results = { "done": [], "todo": [] }      

    # Classifies 'Income' or 'Expense' by 'Type' and stores each in a list
    def classified(self):
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
        print("\n-----uncategorized:\n", uncategorized)
        print("\n-----categorized:\n", categorized)
        print("\n-----income_data:\n", income_data)
        print("\n-----expense_data:\n", expense_data)
        print("\nShape of uncategorized:", np.shape(uncategorized))
        print("Shape of categorized:", np.shape(categorized))
        
        self.results["done"] = categorized
        self.results["todo"] = uncategorized
        
        print("Classified data into income and expense..")
        # return { "done": categorized, "todo": uncategorized }
        
        
    def predicted(self, test_data, train_x, train_y):
        vectorizer = CountVectorizer(binary=True)
        train_x_vectors = vectorizer.fit_transform(train_x)
        clf1 = svm.SVC(kernel='linear')
        clf1.fit(train_x_vectors, train_y)
        predicted = [list(clf1.predict(vectorizer.transform([data]))) for data in test_data]
        predicted = np.array(predicted).flatten()
        return predicted
    
        
    def train(self, extracted_tags, df1, df2):
        # Identifies whether a tag matches a category.
        train_x1, train_y1 = df1['Tags'].tolist(), df1['Category'].tolist()
        predicted_cat = self.predicted(extracted_tags, train_x1, train_y1)
        print("\npredicted_cat:\n", predicted_cat)
        
        # Identifies whether a category is 'Income' or 'Expense'
        train_x2, train_y2 = df2['Category'].tolist(), df2['Type'].tolist()
        predicted_type = self.predicted(predicted_cat, train_x2, train_y2)
        print("\npredicted_type:\n", predicted_type)
        
        # cat_dict = {
        #  1: {'column1': 'category name', 'column2': (int or float)value, 'column3': 'type'},
        #  2: {'column1': 'category name', 'column2': (int or float)value, 'column3': 'type'},
        #  3: {'column1': 'category name', 'column2': (int or float)value, 'column3': 'type'},
        #   ...
        # }
        # Appends types as the 3rd data to cat_dict
        for index, data in self.cat_dict.items():
            data['Type'] = predicted_type[index]
        # print(self.cat_dict)
        predicted_data = pd.DataFrame(list(zip(extracted_tags, predicted_cat, predicted_type)), columns=['Tag','Category', 'Type'])
        print("\nPredicted data:\n",predicted_data)
        predicted_data.to_csv('import_csv/predicted_data.csv')
        print("Trained Categories..")
        self.classified()


    # Load data to train categories and types.
    def load_train_data(self):
        # extracted_tags = [
        #  'General Tree Sales',
        #  'True Fir',
        #  'Noble Fir',
        #   ...
        # ]
        # Extracts the tags as test_data to train
        extracted_tags = []
        for index, data in self.cat_dict.items():
            extracted_tags.append(list(data.values())[0])
        print("\nExtracted Tags:\n", extracted_tags)
        
        df = pd.read_csv('import_csv/Income_Expense_Categories.csv', header=None)
        df1, df2 = df.iloc[1:,[0,1]], df.iloc[1:,[1,2]]
        df1 = df1.set_axis(['Tags', 'Category'], axis=1)
        df2 = df2.set_axis(['Category', 'Type'], axis=1)
        print("\nTrain data with Tags/Category:\n", df1)
        print("\nTrain data with Category/Type:\n", df2)
        self.train(extracted_tags, df1, df2)

    def run(self):
        print("Running Categorizer..")
        self.load_train_data()
         
p = Parser(file2)
p.run()

c = Categorizer(p.cat_dict)
c.run()