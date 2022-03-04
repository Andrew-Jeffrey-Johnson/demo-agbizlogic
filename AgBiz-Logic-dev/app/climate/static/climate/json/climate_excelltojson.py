import csv
import re
import json
import os
import climate_metrics
from sys import argv

variable_name = {
    "above30": "Warm Days Frequency",
    "coldestnight":  "Coldest Night Temperature",
    "Evaporation_ANN": "Evaporation",
    "firstfallfreeze": "First Fall Freeze",
    "gdd0": "Growing Degree Days Total (Base 32°F)",
    "gdd3": "Growing Degree Days Total (Base 37.4°F)",
    "gdd5": "Growing Degree Days Total (Base 41°F)",
    "gdd10": "Growing Degree Days Total (Base 50°F)/10C",
    "hottestday": "Hottest Day Temperature",
    "lastspringfreeze": "Last Spring Freeze",
    "pet_MAM": "Potential Evapotranspiration (Spring)",
    "pr_ANN": "Precipitation",
    "SWE_APR1": "Snow Water Equivalent (April 1)",
    "tasmax_ANN": "Maximum Temperature",
    "tasmean_ANN": "Mean Temperature",
    "tasmin_ANN": "Minimum Temperature",
    "TotalSoilMoist_MAM": "Total Soil Moisture (Spring)"
}

files = ["above30", "coldestnight", "Evaporation_ANN", "firstfallfreeze", "gdd0", "gdd3", "gdd5", "gdd10", "hottestday",
         "lastspringfreeze", "pet_MAM", "pr_ANN", "SWE_APR1", "tasmax_ANN", "tasmean_ANN", "tasmin_ANN", "TotalSoilMoist_MAM"]

long_name = ["Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut", "District of Columbia", "Delaware",
"Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine",
"Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
"New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma",
"Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
"Virginia","Washington","West Virginia","Wisconsin","Wyoming"]

#states abbreviation
short_name = ["AL","AK","AZ","AR","CA","CO","CT","DC","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME",
"MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD",
"TN","TX","UT","VT","VA","WA","WV","WI","WY"]


def Main():
    FilesChecking()

    path ='./'
    county_dic = {}

    county_sequence_dic = CountySequence()

    for pair in county_sequence_dic['above30']:
        state, county = pair[0], pair[1]
        MkDir(path, state)
        if os.path.isdir(path + long_name[short_name.index(state)]):
            for f in files:
                pass
                dic = DefineDictionary(f, pair, county_sequence_dic)
                if dic != {}:
                    county_dic[variable_name[f]] = dic

            dic_metrics = climate_metrics.ConstructDictionary(pair)
            county_dic.update(dic_metrics)

            SaveJSON(county_dic, path+long_name[short_name.index(state)], county)


def MkDir(path, state):
    state = long_name[short_name.index(state)]
    file_name = path + state
    if not os.path.isdir(file_name):
        try:
            os.mkdir(file_name)
        except OSError:
            print ('Directory not created.')

def FilesChecking():
    for filename in files:
        if not os.path.isfile('./' + filename + '.csv'):
            print (filename + "does not exist.")

def CountySequence():
    county_sequence_dic = {}

    for filename in files:
        with open('./' + filename + '.csv', 'rU') as f:
            reader = csv.reader(f, delimiter = ',')
            next(reader, None) # skip header
            lst = []
            for row in reader:
                lst += [(row[0], row[1])]
            county_sequence_dic[filename] = lst

    return county_sequence_dic


def SaveJSON(dic, path, county):
    if not os.path.isfile(path + '/' + county + '.csv'):
        with open(path + '/' + county + '.json', 'w') as f:
            f.write(json.dumps(dic, sort_keys = True, indent = 4))

def DefineDictionary(filename, pair, county_sequence_dic):
    if pair not in county_sequence_dic[filename]:
        return {}

    i = county_sequence_dic[filename].index(pair)
    dic = {}

    with open('./'+filename+'.csv', 'rU') as f:
        reader = csv.reader(f, delimiter = ',')
        data = list(reader)
        row = data[i+1]

        if row[2] != "NA" and row[3] != "NA" and row[4] != "NA":
            dic["name"] = variable_name[filename]
            dic["chart-type"] = "bar" # if len(row) == 5 else "line"
            dic["series"] = ["1"]
            dic["labels"] = ["Modeled Historic Baseline", "Modeled Low Future", "Modeled High Future"]
            dic["label_unit"] = dic["chart-type"]
            dic["historic-mean"] = [float(row[2])]
            dic["historic-min"] = [float(row[3])]
            dic["historic-max"] = [float(row[4])]

    return dic



if __name__ == "__main__":
    Main()
