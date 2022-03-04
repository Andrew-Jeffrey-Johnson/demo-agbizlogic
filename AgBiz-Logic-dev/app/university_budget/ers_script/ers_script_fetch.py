'''
This script fetches the most recent ERS files from the USDA Website
Simply add more entries into the dictionary to get more spreadsheets
'''

import requests

data = {
    "ers_crop/CornCostReturn.xlsx":"https://www.ers.usda.gov/webdocs/DataFiles/47913/CornCostReturn.xlsx?v=4777.3",
    "ers_crop/SoybeansCostReturn.xlsx":"https://www.ers.usda.gov/webdocs/DataFiles/47913/SoybeansCostReturn.xlsx?v=931.1",
    "ers_crop/WheatCostReturn.xlsx":"https://www.ers.usda.gov/webdocs/DataFiles/47913/WheatCostReturn.xlsx?v=8597.6",
    "ers_crop/CottonCostReturn.xlsx":"https://www.ers.usda.gov/webdocs/DataFiles/47913/CottonCostReturn.xlsx?v=9412.1",
    "ers_crop/RiceCostReturn.xlsx":"https://www.ers.usda.gov/webdocs/DataFiles/47913/RiceCostReturn.xlsx?v=7409.1",
    "ers_crop/SorghumCostReturn.xlsx":"https://www.ers.usda.gov/webdocs/DataFiles/47913/SorghumCostReturn.xlsx?v=964.1",
    "ers_crop/BarleyCostReturn.xlsx":"https://www.ers.usda.gov/webdocs/DataFiles/47913/BarleyCostReturn.xlsx?v=7667.2",
    "ers_crop/OatsCostReturn.xlsx":"https://www.ers.usda.gov/webdocs/DataFiles/47913/OatsCostReturn.xlsx?v=9567.9",
    "ers_crop/PeanutsCostReturn.xlsx":"https://www.ers.usda.gov/webdocs/DataFiles/47913/PeanutsCostReturn.xlsx?v=1171.1",
}


for excelFile in data:
    print(excelFile)
    r = requests.get(data[excelFile])
    with open(excelFile, 'wb') as f:
        f.write(r.content)
#
#
# url = 'http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg'
# r = requests.get(url)
#
# with open('/Users/scott/Downloads/cat3.jpg', 'wb') as f:
#     f.write(r.content)
#
#
#
