from email import header
from django.shortcuts import render, render_to_response, HttpResponse
from formtools.wizard.views import SessionWizardView
from django.template.context import RequestContext
import os
from django.conf import settings
from AgBiz_Logic.settings import *
from django.core.files.storage import FileSystemStorage
import json as simplejson
import xlrd
import re
from django.utils.safestring import mark_safe
import csv
from import_csv.forms import CSVForm
from registration.forms import InfoForm
from django.contrib.auth.decorators import user_passes_test
from django.contrib.auth.decorators import login_required
from registration.models import ScheduleF
import pandas as pd
import numpy as np



CSV_TEMPLATES = {'step1':'upload/step1.html', 
                 "step2": "upload/step2.html", 
                 "step3": "upload/confirm.html"}

IMPORT_CSV = [("step1", CSVForm), 
              ("step2", InfoForm), 
              ("step3", InfoForm)]

def get_user_draggable(request):
    print("Get user draggable")
    if request.method == "POST" and request.is_ajax:

        cost = simplejson.loads(request.POST['cost'])
        cost_with_label = {}


        if ScheduleF.objects.filter(user=request.user):
            ScheduleF.objects.filter(user=request.user).update(

                    year = 2014,
                    line_1_a = 0,
                    line_1_b = int(float(simplejson.loads(cost['expense-panel-1-total']))),
                    line_1_c = int(float(simplejson.loads(cost['income-panel-1-total']))),
                    line_2 = 0,
                    line_3_a = int(float(simplejson.loads(cost['income-panel-2-total']))),
                    line_3_b = 0,
                    line_4_a = int(float(simplejson.loads(cost['income-panel-3-total']))),
                    line_4_b = 0,
                    line_5_a = int(float(simplejson.loads(cost['income-panel-4-total']))),
                    line_5_b = 0,
                    line_5_c = 0,
                    line_6_a = int(float(simplejson.loads(cost['income-panel-5-total']))),
                    line_6_b = 0,
                    line_6_d = 0,
                    line_7 = int(float(simplejson.loads(cost['income-panel-6-total']))),
                    line_8 = int(float(simplejson.loads(cost['income-panel-7-total']))),
                    gross_income = 0,
                    line_10 = int(float(simplejson.loads(cost['expense-panel-2-total']))),
                    line_11 = int(float(simplejson.loads(cost['expense-panel-3-total']))),
                    line_12 = int(float(simplejson.loads(cost['expense-panel-4-total']))),
                    line_13 = int(float(simplejson.loads(cost['expense-panel-5-total']))),
                    line_14 = int(float(simplejson.loads(cost['expense-panel-6-total']))),
                    line_15 = int(float(simplejson.loads(cost['expense-panel-7-total']))),
                    line_16 = int(float(simplejson.loads(cost['expense-panel-8-total']))),
                    line_17 = int(float(simplejson.loads(cost['expense-panel-9-total']))),
                    line_18 = int(float(simplejson.loads(cost['expense-panel-10-total']))),
                    line_19 = int(float(simplejson.loads(cost['expense-panel-11-total']))),
                    line_20 = int(float(simplejson.loads(cost['expense-panel-12-total']))),
                    line_21_a = int(float(simplejson.loads(cost['expense-panel-13-total']))),
                    line_21_b = 0,
                    line_22 = int(float(simplejson.loads(cost['expense-panel-14-total']))),
                    line_23 = int(float(simplejson.loads(cost['expense-panel-15-total']))),
                    line_24_a = int(float(simplejson.loads(cost['expense-panel-16-total']))),
                    line_24_b = int(float(simplejson.loads(cost['expense-panel-17-total']))),
                    line_25 = int(float(simplejson.loads(cost['expense-panel-18-total']))),
                    line_26 = int(float(simplejson.loads(cost['expense-panel-19-total']))),
                    line_27 = int(float(simplejson.loads(cost['expense-panel-20-total']))),
                    line_28 = int(float(simplejson.loads(cost['expense-panel-21-total']))),
                    line_29 = int(float(simplejson.loads(cost['expense-panel-22-total']))),
                    line_30 = int(float(simplejson.loads(cost['expense-panel-23-total']))),
                    line_31 = int(float(simplejson.loads(cost['expense-panel-24-total']))),
                    line_32_a = 0,
                    line_32_b = 0,
                    line_32_c = 0,
                    line_32_d = 0,
                    line_32_e = 0,
                    line_32_f = int(float(simplejson.loads(cost['expense-panel-25-total']))),
                    other_expense_1 = "Other Expenses",
                    other_expense_2 = "Other Expenses",
                    other_expense_3 = "Other Expenses",
                    other_expense_4 = "Other Expenses",
                    other_expense_5 = "Other Expenses",
                    other_expense_6 = "Other Expenses",
                    total_expenses = 0,
                    net_profit = 0

            )
        else:
            tax = ScheduleF.objects.create(
                    user = request.user,
                    year = 2014,
                    line_1_a = 0,
                    line_1_b = int(float(simplejson.loads(cost['expense-panel-1-total']))),
                    line_1_c = int(float(simplejson.loads(cost['income-panel-1-total']))),
                    line_2 = 0,
                    line_3_a = int(float(simplejson.loads(cost['income-panel-2-total']))),
                    line_3_b = 0,
                    line_4_a = int(float(simplejson.loads(cost['income-panel-3-total']))),
                    line_4_b = 0,
                    line_5_a = int(float(simplejson.loads(cost['income-panel-4-total']))),
                    line_5_b = 0,
                    line_5_c = 0,
                    line_6_a = int(float(simplejson.loads(cost['income-panel-5-total']))),
                    line_6_b = 0,
                    line_6_d = 0,
                    line_7 = int(float(simplejson.loads(cost['income-panel-6-total']))),
                    line_8 = int(float(simplejson.loads(cost['income-panel-7-total']))),
                    gross_income = 0,
                    line_10 = int(float(simplejson.loads(cost['expense-panel-2-total']))),
                    line_11 = int(float(simplejson.loads(cost['expense-panel-3-total']))),
                    line_12 = int(float(simplejson.loads(cost['expense-panel-4-total']))),
                    line_13 = int(float(simplejson.loads(cost['expense-panel-5-total']))),
                    line_14 = int(float(simplejson.loads(cost['expense-panel-6-total']))),
                    line_15 = int(float(simplejson.loads(cost['expense-panel-7-total']))),
                    line_16 = int(float(simplejson.loads(cost['expense-panel-8-total']))),
                    line_17 = int(float(simplejson.loads(cost['expense-panel-9-total']))),
                    line_18 = int(float(simplejson.loads(cost['expense-panel-10-total']))),
                    line_19 = int(float(simplejson.loads(cost['expense-panel-11-total']))),
                    line_20 = int(float(simplejson.loads(cost['expense-panel-12-total']))),
                    line_21_a = int(float(simplejson.loads(cost['expense-panel-13-total']))),
                    line_21_b = 0,
                    line_22 = int(float(simplejson.loads(cost['expense-panel-14-total']))),
                    line_23 = int(float(simplejson.loads(cost['expense-panel-15-total']))),
                    line_24_a = int(float(simplejson.loads(cost['expense-panel-16-total']))),
                    line_24_b = int(float(simplejson.loads(cost['expense-panel-17-total']))),
                    line_25 = int(float(simplejson.loads(cost['expense-panel-18-total']))),
                    line_26 = int(float(simplejson.loads(cost['expense-panel-19-total']))),
                    line_27 = int(float(simplejson.loads(cost['expense-panel-20-total']))),
                    line_28 = int(float(simplejson.loads(cost['expense-panel-21-total']))),
                    line_29 = int(float(simplejson.loads(cost['expense-panel-22-total']))),
                    line_30 = int(float(simplejson.loads(cost['expense-panel-23-total']))),
                    line_31 = int(float(simplejson.loads(cost['expense-panel-24-total']))),
                    line_32_a = 0,
                    line_32_b = 0,
                    line_32_c = 0,
                    line_32_d = 0,
                    line_32_e = 0,
                    line_32_f = int(float(simplejson.loads(cost['expense-panel-25-total']))),
                    other_expense_1 = "Other Expenses",
                    other_expense_2 = "Other Expenses",
                    other_expense_3 = "Other Expenses",
                    other_expense_4 = "Other Expenses",
                    other_expense_5 = "Other Expenses",
                    other_expense_6 = "Other Expenses",
                    total_expenses = 0,
                    net_profit = 0

            )
            tax.save()

        success = True
        response = simplejson.dumps(success)
        return HttpResponse(response,content_type='application/json')
    else:
        return HttpResponse()


class FileUploadWizard(SessionWizardView):
    #print("fileuploadinitializing")
    file_storage = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, ''))

    def get_template_names(self):
        return [CSV_TEMPLATES[self.steps.current]]

    def get_context_data(self, form, **kwargs):

        context = super(FileUploadWizard, self).get_context_data(form=form, **kwargs)
        #print(type(context))
        #print(context)
        #print(self.steps.current)
        
        if self.steps.current == "step1":
            print("step1")
            BASE_DIR = os.path.dirname(os.path.dirname(__file__))

            context.update({'file_link':'static/download/expenses.xls'})

        if self.steps.current == "step2":
            #print("step2")
            fname = self.get_cleaned_data_for_step("step1")['file']
            #print(fname)
            #print(context)

            file_extension = str(fname).split('.')[-1]
            p = Parser(fname, "Category")
            p.run()
            print("Set")
            context.update({'excel_data':p})
            #print("Type of p:",type(p))

            #p.print_cat_dict()

           
                #context.update({'excel_data':csv_data})

        print(context)
        return context


    def get_next_step(self, step=None):
        return self.request.POST.get('wizard_next_step', super(FileUploadWizard, self).get_next_step(step))

    def done(self, form_list, **kargs):

        data = {}
        print("Hello",RequestContext(self.request))
        return render_to_response('upload/done.html', self.request,context_instance=RequestContext(self.request))

csv_wizard_view = FileUploadWizard.as_view(IMPORT_CSV)

@login_required
def wrapped_csv_wizard_view(request):
    #print("Here")
    return csv_wizard_view(request)



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
        print(file)
        # Reads in the data from a .xlsx (excel) file
        file_extension = str(file).split('.')[-1]
        if file_extension == "xls" or file_extension == "xlsx":
            df = pd.read_excel(file, header=None)
            return df
        elif file_extension == "csv":
            df = pd.read_csv(file,header=None)
            return df

        # Reads in the data from a CSV file, assumes first 6 lines are garbage and can be skipped.
        # Will need to figure out how to standardize the starting point in the document later on.
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
        
        #print("Printing df:",df)
        #print("type of df:",type(df))
        #print(df['Payment'])
        #print()
        #str(input("Press enter to continue...\n"))

        #self.print_cat_dict()

        # df.to_csv('testdata.csv')
        


