#python3 3.5
'''
This program is run automatically from budget_script/bash_script.bh
This program reads in USDA files and builds a json file for the database
containing ERS budgets, Income Items and Cost items
'''

import pandas as pd
import glob
import os, json, types, csv

# PANDAS FILTER ITEMS
incomeItems = ["Primary product.", "Secondary product silage"]
ignoreCols = ["Total"]


# WIPES EXISTING FILE TO PREVENT DUPLICATES
goldStandardConversions = {}
with open('goldStandardConversions.csv','r') as readFile:
    reader = csv.reader(readFile)
    goldStandardConversions = {rows[0]:rows[1] for rows in reader}


def getLatestYear(df):
    return df['Year'].max()

# READS IN THE KEYS FROM THE PARENT BUDGET file
# GETS DELETED AT THE END OF THE SCRIPT
def getKeys(filePath="../budget_script/parent_budget.txt"):
    #636 629 7032
    #budgetKey, incomeKey, costKey

    budgetKey = 1
    incomeKey = 1
    costKey = 1
    with open(filePath) as f:
        data = f.readline().split()
        budgetKey = int(data[0])
        incomeKey = int(data[1])
        costKey = int(data[2])
    return budgetKey, incomeKey, costKey

# GETS THE GOLD STANDARD DESCRIPTORS FOR BUDGET CREATION
# ASKS USER FOR INPUT IF THEY DO NOT EXIST
def getDescriptors(data, enterprise):
    userPredefinitions = {}
    try:
        with open("userPredefinitions.csv","r") as readFile:
            reader = csv.reader(readFile)
            for row in reader:
                userPredefinitions[row[0]] = row[1]

    except Exception as error:
        print(error)


    commoditiesData = pd.read_json('../../common/static/common/json/commodities.json')
    # print(commoditiesData)
    cd = commoditiesData[enterprise][4]
    descriptorList = []

    # ITERATION THROUGH COMMODITY JSON FILE TO SEARCH FOR DESCRIPTORS
    #print(isinstance(commoditiesData[enterprise][0], str))
    if data['Commodity'].tolist()[0] in userPredefinitions:
        return (userPredefinitions[data['Commodity'].tolist()[0]], data['Commodity'].tolist()[0])
    else:
        for dictionary in cd:
            for value in dictionary['category_2']:
                if value['name'] == data['Commodity'].tolist()[0]:
                    descriptorList.append([value['name'], dictionary['name']])
        # print(data['Commodity'].tolist()[0])
        # if data['Commodity'].tolist()[0] == "Peanut":
        #     print(descriptorList)
        if len(descriptorList) == 1:
            return (descriptorList[0][1], descriptorList[0][0])
        if len(descriptorList) > 1:
            print("Multiple types of %s have been found: " % (descriptorList[0][0]));
            for i,vals in enumerate(descriptorList):
                print("   %d: %s" % (i + 1,vals[1]))

            # USER INPUT PORTION
            userCommand = input("-->  ")
            while userCommand != "q":
                try:
                    if int(userCommand) > 0 and int(userCommand) <= len(descriptorList):
                        with open("userPredefinitions.csv","a+") as writeFile:
                            writer = csv.writer(writeFile, lineterminator="\n")
                            writer.writerow([descriptorList[int(userCommand) - 1][0], descriptorList[int(userCommand) - 1][1]])

                        return (descriptorList[int(userCommand) - 1][1], descriptorList[int(userCommand) - 1][0])
                except Exception as e:
                    print (e)
                userCommand = input("-->  ")

        #If it cant find the commodity, apply ""
        else:
            return ("",data['Commodity'].tolist()[0])


# CONVERTS ERS NAME TO GOLD STANDARD AGBIZ NAME
def getGoldStandardName(badName):
    if badName in goldStandardConversions.keys() and not goldStandardConversions[badName] == '?':
        return goldStandardConversions[badName]
    return ''


# GENERATES A BUDGET ITEM
# LOOK AT University_budget_for_Livestock.json FOR AN EXAMPLE BUDGET
def generateBudget(data, budgetKey):
    jsonData = []
    myDict = {}
    myDict["fields"] = {}
    myDict["model"] = "university_budget.universitybudget"
    myDict["pk"] = budgetKey
    descriptors = getDescriptors(data, "Crop")

    row = data.iloc[0]

    if descriptors is None:
        descriptors = ("", row["Commodity"])

    myDict["fields"]["descriptor1"] = descriptors[0] if descriptors is not None else ""
    myDict["fields"]["descriptor2"] = descriptors[1]
    myDict["fields"]["descriptor3"] =  ""
    myDict["fields"]["descriptor4"] =  ""
    myDict["fields"]["descriptor5"] =  ""
    myDict["fields"]["descriptor6"] = ""
    myDict["fields"]["enterprise"] = "Crop"
    myDict["fields"]["expense_unit"] = ""
    myDict["fields"]["expense_unit_quantity"] =  1
    myDict["fields"]["farm_unit"] =  "Acre"
    myDict["fields"]["farm_unit_quantity"] =  1
    myDict["fields"]["market"] =  "Conventional"
    myDict["fields"]["notes"] =  ""
    myDict["fields"]["region"] =  row["Region"]
    myDict["fields"]["state"] =  ""
    myDict["fields"]["time_unit"] =  "Year"
    myDict["fields"]["time_value"] =  1
    middleDescriptor = "" if descriptors[0] == '' else ', ' + descriptors[0]
    myDict["fields"]["title"] =  descriptors[1]  + middleDescriptor + ', ' + "ERS: " + row["Region"] + ', ' + str(row["Year"])

    jsonData.append(myDict)

    return budgetKey, jsonData, descriptors


# GENERATES A SINGLE COST ITEM
# LOOK AT University_budget_for_Livestock.json FOR AN EXAMPLE ITEM
def generateCostItem(row, budgetKey, costKey, costName, split):
    myDict = {}
    myDict["fields"] = {}
    myDict["model"] = "university_budget.universitycostitem"
    myDict["pk"] = costKey
    costKey += 1

    myDict["fields"]["category"] = ""
    myDict["fields"]["cost_total"] = row.Value/split
    myDict["fields"]["cost_type"] = "general"
    myDict["fields"]["farm_unit_quantity"] = 1
    myDict["fields"]["name"] = costName
    myDict["fields"]["notes"] = row.Note.encode('ascii', 'ignore').decode().strip(' ') if type(row.Note) == str else ""
    myDict["fields"]["parent_budget"] = budgetKey
    myDict["fields"]["parent_category"] = ""
    myDict["fields"]["sub_category"] = ""
    myDict["fields"]["unit"] = "Acre"
    myDict["fields"]["unit_quantity"] = 1
    return costKey, myDict

# HANDLES SPLITTING COST ITEMS INTO TWO, USED FOR INSURANCE COST ITEM
def generateCostItems(data, budgetKey, costKey):
    jsonData = []

    for row in data.itertuples(index=False, name="RowData"):
        costName = getGoldStandardName(row.Item.encode('ascii', 'ignore').decode().strip(' '))
        costNames = []
        costNames.append(costName)
        if '?' in costName or costName == '':
            continue
        if '|' in costName:
            costNames = costName.split('|')
        for name in costNames:
            costKey, jsonItem = generateCostItem(row, budgetKey, costKey, name, len(costNames))
            jsonData.append(jsonItem)

    return costKey, jsonData

# GENERATES AN INCOME ITEM
# LOOK AT University_budget_for_Crops.json FOR AN EXAMPLE ITEM
def generateIncomeItems(data, budgetKey, incomeKey, descriptors):
    jsonData = []

    for row in data.itertuples(index=False, name="RowData"):
        myDict = {}
        myDict["fields"] = {}
        myDict["model"] = "university_budget.universityincomeitem"
        myDict["pk"] = incomeKey
        incomeKey += 1

        if descriptors is None:
            descriptors = ("", row["Commodity"])

        myDict["fields"]["descriptor1"] = descriptors[0] if descriptors[0] is not None else ""
        myDict["fields"]["descriptor2"] = descriptors[1]
        myDict["fields"]["descriptor3"] =  ""
        myDict["fields"]["descriptor4"] =  ""
        myDict["fields"]["descriptor5"] =  ""
        myDict["fields"]["descriptor6"] = ""
        myDict["fields"]["enterprise"] = "Crop"
        myDict["fields"]["farm_unit"] =  "Acre"
        myDict["fields"]["farm_unit_quantity"] =  1
        myDict["fields"]["name"] =  row.Item.encode('ascii', 'ignore').decode().strip(' ')
        myDict["fields"]["notes"] =  row.Note.encode('ascii', 'ignore').decode().strip(' ') if type(row.Note) == str else ""
        myDict["fields"]["parent_budget"] = budgetKey
        myDict["fields"]["return_total"] = row.Value
        myDict["fields"]["sale_unit"] = "Acre"
        myDict["fields"]["sale_unit_quantity"] = 1
        myDict["fields"]["weight"] = 1

        jsonData.append(myDict)

    return incomeKey, jsonData



def main():
    budgetKey, incomeKey, costKey = getKeys()
    jsonData = []
    finalJsonData = []

    # GRABS ALL THE EXCEL FILE
    excelFiles = glob.glob('*/*.xlsx');
    with open("ERS_Budgets.json", "w+") as writeFile:
        pass

    for excelFilePath in excelFiles:
        # Read in the Excel file into pandas dataframe for sorting and filtering
        if "~$" in excelFilePath: # Ignore temp files
            break

        # If it breaks here, make sure the sheet name has a captial 'S'
        data = pd.read_excel(excelFilePath, sheet_name='Data Sheet (machine readable)')
        data = data.loc[(data['Year'] == getLatestYear(data))]
        for ignoreCol in ignoreCols:
            data = data[~data.Item.str.contains(ignoreCol)]


        regions = data.Region.unique()
        for region in regions:
            # Uses filters from top to remove unwanted items
            budgetData = data[data.Region.str.contains(region)]
            incomeData = budgetData[budgetData.Item.str.contains('|'.join(incomeItems))]
            costData = budgetData[~budgetData.Item.str.contains('|'.join(incomeItems))]

            if len(budgetData) > 0:
                # Build the JSON data files to be appended together
                jsonData = []

                # Checks if file is of right type. Issue_1818 is adding to This
                # to handle livestock as well
                if "ers_crop" in excelFilePath:
                    budgetKey, jsonBudgetData, descriptors = generateBudget(budgetData,budgetKey)
                    costKey, jsonCostData = generateCostItems(costData, budgetKey, costKey)
                    incomeKey, jsonIncomeData = generateIncomeItems(incomeData, budgetKey, incomeKey, descriptors)

                budgetKey += 1
                jsonData = jsonBudgetData + jsonCostData + jsonIncomeData
            finalJsonData = finalJsonData + jsonData

        with open("../budget_script/parent_budget.txt", "w+") as writeFile:
            writeFile.write("%d %d %d" % (budgetKey, incomeKey, costKey));
        print("Finished working on", excelFilePath);

    #Finalize data
    with open("ERS_budgets.json", "a") as writeFile:
        json.dump(finalJsonData, writeFile, sort_keys=True, indent=4)
    os.remove("../budget_script/parent_budget.txt")



if __name__ == "__main__":
    main()
