# Python2.7
# Script to convert University budgets into Json file
# By Nawwaf Almutairi

import openpyxl
import re
import json
import os
#from decimal import Decimal
from sys import argv

filename = argv

wb = openpyxl.load_workbook(filename[1] , data_only=True)


#This function is to convert the dictionary into json object
def Dic_to_json(arr,category):

    f_name = 'University_budget_for_'+category+'.json'
    data_json = json.dumps(arr, sort_keys = True, indent = 4)

    if os.path.isfile(f_name):
        export_file = open(f_name, 'r')
        old_data = json.load(export_file)
        old_data = json.dumps(old_data, sort_keys = True, indent = 4)
        data = old_data + data_json
        data = data.replace('][', ',')
        export_file.close()
    else:
        data = data_json


    with open(f_name, 'w') as f:
        jdata = json.loads(data)
        jdata = json.dumps(jdata, sort_keys = True, indent = 4)
        f.write(jdata)


    #End of Dic_to_json function

def Sale_unit_format(sale_unit_cell):

    sale_units = ["hd","Tons","Cartons","Lbs"]
    correct_sale_units = ["Herd","Ton","Carton","Pound"]
    for x in range(0, len(sale_units)):
        if sale_unit_cell == sale_units[x]:
            return correct_sale_units[x]

    return sale_unit_cell


# go through all fields in Gross income and save it in dictionary
def Income_items_Livestock(array,dic,sheet,parent_budget,pki):

    for x in range(0, 6):
        # if there is a value in name then go through it values otherwise skip it
        if sheet['A3'+str(x)].value != '':
            dic = {}
            dic['fields'] = {}
            dic['fields']['enterprise'] = sheet['B1'].value
            dic['fields']['descriptor1'] = ""
            dic['fields']['descriptor2'] = ""
            dic['fields']['descriptor3'] = ""
            dic['fields']['descriptor4'] = ""
            dic['fields']['descriptor5'] = ""
            dic['fields']['descriptor6'] = ""
            dic['fields']['notes'] = ""
            dic['fields']['parent_budget'] = parent_budget
            dic['fields']['farm_unit_quantity'] = 1
            dic['fields']['name'] = sheet['A3'+str(x)].value
            dic['fields']['sale_unit_quantity'] = round(sheet['B3'+str(x)].value,2)
            dic['fields']['sale_unit'] = Sale_unit_format(sheet['E3'+str(x)].value)
            if sheet['D3'+str(x)].value <= 0:
                dic['fields']['weight'] = 1
            else:
                dic['fields']['weight'] = sheet['D3'+str(x)].value
            dic['fields']['farm_unit'] = "acres"
            dic['fields']['return_total'] = round(sheet['G3'+str(x)].value, 2)
            dic['model'] = "university_budget.universityincomeitem"
            dic['pk'] = pki
            pki += 1
            array.append(dic)
            #EndIf

        #Endloop
    return pki
    #end Income_items_Livestock function

# go through all fields in Gross income and save it in dictionary
def Income_items_Crops(array,dic,sheet,parent_budget, pki):

    for x in range(0, 6):
        # if there is a value in name then go through it values otherwise skip it
        if sheet['A3'+str(x)].value != '' and round(sheet['E3'+str(x)].value, 2) != 0.0:
            dic = {}
            dic['fields'] = {}
            dic['fields']['enterprise'] = sheet['B1'].value
            dic['fields']['descriptor1'] = ""
            dic['fields']['descriptor2'] = ""
            dic['fields']['descriptor3'] = ""
            dic['fields']['descriptor4'] = ""
            dic['fields']['descriptor5'] = ""
            dic['fields']['descriptor6'] = ""
            dic['fields']['notes'] = ""
            dic['fields']['parent_budget'] = parent_budget
            dic['fields']['name'] = sheet['A3'+str(x)].value
            dic['fields']['farm_unit_quantity'] = 1
            dic['fields']['sale_unit'] = Sale_unit_format(sheet['C3'+str(x)].value)
            dic['fields']['farm_unit'] = "acres"
            if sheet['D3'+str(x)].value:
                dic['fields']['sale_unit_quantity'] = round(sheet['B3'+str(x)].value,2)
            else:
                dic['fields']['sale_unit_quantity'] = 0
            dic['fields']['return_total'] = round(sheet['E3'+str(x)].value, 2)

            dic['model'] = "university_budget.UniversityIncomeItem"
            dic['pk'] = pki
            pki += 1

            array.append(dic)

            #EndIf
        #Endloop
    return pki

    #end Income_items_Crops function


def Cost_items(array, dic, sheet,parent_budget,pkc):

    for x in range(40,65):
        if sheet['D'+str(x)].value != 0:
            dic = {}
            dic['fields'] = {}
            dic['fields']['name'] = Cost_name(sheet['A'+str(x)].value)
            dic['fields']['unit_quantity'] = sheet['B'+str(x)].value
            dic['fields']['unit'] = sheet['C'+str(x)].value
            dic['fields']['category'] = ""
            dic['fields']['sub_category'] = ""
            dic['fields']['farm_unit_quantity'] = 1
            dic['fields']['notes'] = ""
            dic['fields']['parent_category'] = ""
            dic['fields']['parent_budget'] = parent_budget
            dic['fields']['cost_type'] = "general"
            if sheet['D'+str(x)].value != 0:
                if isinstance(sheet['E'+str(x)].value, float):
                    dic['fields']['cost_total'] = round(sheet['E'+str(x)].value, 2)
                else:
                     dic['fields']['cost_total'] = sheet['E'+str(x)].value
            else:
                dic['fields']['cost_total'] = sheet['E'+str(x)].value

            dic['model'] = "university_budget.universitycostitem"
            dic['pk'] = pkc
            pkc += 1
            array.append(dic)
        #Endloop

    return pkc
    #End of cost_items function

#helper function to standardize cost item names
def Cost_name(name):
    name = name.rstrip('()123456789 ')
    #print name

    #list of incorrections from xlsx files
    incorrect_name = ["Employee benefits programs","Freight and trucking","Gasoline, fuel, and oil",
    "Insurance (other than health","Labor hired (less employment credits","Interest on loans and mortgages",
    "Repairs and maintenance","Seeds and plants","Fertilizers and lime","Pension and profit-sharing plans",
    "Long-term asset replacement and section 179 expense","Machinery, equipment or vehicle rent or lease",
    "Property taxes","Storage and warehousing","Veterinary, breeding, and medicine","Custom hire (machine work",
    "Custom hire (machine work)", "Car and truck expenses","Conservation expenses","Land and animal rent or lease","Other expenses"]
    #list of correct standards
    correct_name  = ["Employee Benefits Programs","Freight and Trucking","Gasoline, Fuel, and Oil",
    "Insurance (other than health)","Labor Hired (less employment credits)","Interest on Loans and Mortgages",
    "Repairs and Maintenance","Seeds and Plants","Fertilizers and Lime","Pension and Profit-Sharing Plans",
    "L-T asset replacement & section 179 expenses","Rent and leases: Machinery, equipment and vehicles",
    "Property Taxes","Storage and Warehousing","Veterinary, Breeding, and Medicine","Custom Hire","Custom Hire",
    "Car and Truck Expenses","Conservation Expenses","Rent and leases: Land and animals","Other Expenses"]

    for x in range(0 , len(incorrect_name)-1):
        if incorrect_name[x] == name:
            return correct_name[x]
    return name


# helper function for converting states names into it's abbreviation
def State_name(name):
    #states name
    long_name = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
    "Florida","Georgia","Hawaii","Idaho","llinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine",
    "Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
    "New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma",
    "Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
    "Virginia","Washington","West Virginia","Wisconsin","Wyoming"]

    #states abbreviation
    short_name = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME",
    "MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD",
    "TN","TX","UT","VT","VA","WA","WV","WI","WY"]

    for x in range(0 , len(long_name)):
        if long_name[x] == name:
            return short_name[x]
    return ""


def State_and_Region(sheets_list):

    array = []
    st_exists = []
    region_exists = []
    # This loop for the number of sheets in the WorkBook
    for i in range(0,len(sheets_list)):
        dic = {}
        dic['state'] = ""
        dic['region'] = []
        sheet = wb.get_sheet_by_name(sheets_list[i])
        if State_name(sheet['B10'].value) in st_exists:
            if sheet['B11'].value not in region_exists:
                for k in array:
                    if k['state'] == State_name(sheet['B10'].value):
                        k['region'].append(sheet['B11'].value)
                        region_exists.append(sheet['B11'].value)
        else:
            if State_name(sheet['B10'].value) != "":
                dic['state'] = State_name(sheet['B10'].value)
                dic['region'].append(sheet['B11'].value)
                st_exists.append(State_name(sheet['B10'].value))
                region_exists.append(sheet['B11'].value)
                array.append(dic)

        #Endloop
    if len(array) != 0:
        Dic_to_json(array,'State_Regions')


# This function for Going through all the data in the Crops workbook and get it Values in an array of dictionary
def Crops(sheets_list, parent_budget_counter, pki, pkc):

    array = []
    # This loop for the number of sheets in the WorkBook
    for i in range(0,len(sheets_list)):
        dic = {}
        dic['fields'] = {}
        sheet = wb.get_sheet_by_name(sheets_list[i])
        dic['fields']['enterprise'] = sheet['B1'].value
        dic['fields']['descriptor1'] = sheet['B2'].value
        dic['fields']['descriptor2'] = sheet['b3'].value
        if sheet['B4'].value is None:
            dic['fields']['descriptor3'] = ""
        else:
            dic['fields']['descriptor3'] = sheet['B4'].value
        dic['fields']['market'] = sheet['B5'].value
        dic['fields']['state'] = State_name(sheet['B10'].value)
        if sheet['B11'].value is None:
            dic['fields']['region'] = ""
        else:
            dic['fields']['region'] = sheet['B11'].value
        dic['fields']['title'] = sheet['B12'].value
        dic['fields']['farm_unit'] = sheet['B13'].value
        dic['fields']['farm_unit_quantity'] = 1
        dic['fields']['time_unit'] = sheet['B15'].value
        dic['fields']['time_value'] = sheet['B16'].value
        if sheet['A18'].value is None:
            dic['fields']['notes'] = ""
        else:
            dic['fields']['notes'] = sheet['A18'].value
        dic['model'] = "university_budget.universitybudget"
        dic['pk'] = parent_budget_counter


        array.append(dic)
        pki = Income_items_Crops(array,dic,sheet,parent_budget_counter,pki)
        pkc = Cost_items(array,dic,sheet,parent_budget_counter,pkc)
        parent_budget_counter = parent_budget_counter + 1
        #Endloop

    Dic_to_json(array,'Crops')

    return parent_budget_counter, pki, pkc

    #End of Crops function


# This function for Going through all the data in the Livestock workbook and get it Values in an array of dictionary
def Livestock(sheets_list, parent_budget_counter, pki, pkc):


    array = []
    # This loop for the number of sheets in the WorkBook
    for i in range(0,len(sheets_list)):
        dic = {}
        dic['fields'] = {}
        sheet = wb.get_sheet_by_name(sheets_list[i])
        dic['pk'] = parent_budget_counter
        dic['model'] = "university_budget.universitybudget"
        dic['fields']['enterprise'] = sheet['B1'].value
        dic['fields']['descriptor1'] = sheet['B2'].value
        dic['fields']['descriptor2'] = sheet['b3'].value
        if sheet['B4'].value is None:
            dic['fields']['descriptor3'] = ""
            print("Livestock", sheet['B1'].value, "descriptor3 is None")
        else:
            dic['fields']['descriptor3'] = sheet['B4'].value
        dic['fields']['descriptor4'] = sheet['B5'].value
        dic['fields']['descriptor5'] = sheet['B6'].value
        dic['fields']['descriptor6'] = sheet['B7'].value
        dic['fields']['market'] = sheet['B8'].value
        dic['fields']['state'] = State_name(sheet['B9'].value)
        if sheet['B10'].value is None:
            dic['fields']['region'] = ""
        else:
            dic['fields']['region'] = sheet['B10'].value
        dic['fields']['title'] = sheet['B11'].value
        dic['fields']['farm_unit'] = sheet['B12'].value
        dic['fields']['expense_unit'] = sheet['B13'].value
        dic['fields']['expense_unit_quantity'] = 1
        dic['fields']['time_unit'] = sheet['B15'].value
        dic['fields']['time_value'] = sheet['B16'].value
        dic['fields']['notes'] = sheet['A18'].value
        dic['fields']['farm_unit_quantity'] = 1

        array.append(dic)
        pki = Income_items_Livestock(array,dic,sheet,parent_budget_counter,pki)
        pkc = Cost_items(array,dic,sheet,parent_budget_counter,pkc)
        parent_budget_counter = parent_budget_counter + 1
        #Endloop

    #print array
    Dic_to_json(array,'Livestock')
    return parent_budget_counter, pki, pkc
    #End of Livestock function



def Main():
    sheets_list = wb.get_sheet_names() # extracting sheet names and store them in array

    if os.path.isfile('./parent_budget.txt'):
        f = open('parent_budget.txt','r')
        data = f.readline().split()
        parent_budget_counter = int(data[0])
        pki = int(data[1])
        pkc = int(data[2])

        f.close()

    else:
        parent_budget_counter = 1
        pki = 1
        pkc = 1

    print ("Length of sheets: " + str(len(sheets_list)))
    if ".xlsx" in filename[1]:
        State_and_Region(sheets_list)
        if "Crops" in filename[1]:
            parent_budget_counter, pki, pkc = Crops(sheets_list, parent_budget_counter,pki,pkc)
        elif "Livestock" in filename[1]:
            parent_budget_counter, pki, pkc = Livestock(sheets_list, parent_budget_counter,pki,pkc)
        else:
            print ("wrong file name")

    if parent_budget_counter > 1:
        fileName = "parent_budget.txt"
        f = open(fileName, 'w')
        f.write(str(parent_budget_counter)+ " ")
        f.write(str(pki) + " ")
        f.write(str(pkc) + " ")
        f.close()

    return
    #End Main function

# Calling Main to start the process
Main()
