import csv
import json
import os


state_num =  { "AL": "01", "AK": "02", "AZ": "04", "AR": "05", "CA": "06", "CO": "08", "CT": "09", "DE": "10",
               "DC": "11", "FL": "12", "GA": "13", "HI": "15", "ID": "16", "IL": "17", "IN": "18", "IA": "19",
               "KS": "20", "KY": "21", "LA": "22", "ME": "23", "MD": "24", "MA": "25", "MI": "26", "MN": "27",
               "MS": "28", "MO": "29", "MT": "30", "NE": "31", "NV": "32", "NH": "33", "NJ": "34", "NM": "35",
               "NY": "36", "NC": "37", "ND": "38", "OH": "39", "OK": "40", "OR": "41", "PA": "42", "RI": "44",
               "SC": "45", "SD": "46", "TN": "47", "TX": "48", "UT": "49", "VT": "50", "VA": "51", "WA": "53",
               "WV": "54", "WI": "55", "WY": "56", "AS": "60", "GU": "66", "MP": "69", "PR": "72", "VI": "78"}


file_name = {
    "TMX": "Maximum Temperature",
    "TMXclm": "climatology maximum temperature (not yet complete)",
    "TMN": "Minimum Temperature",
    "TMNclm": "climatology minimum temperature (not yet complete)",
    "PPT": "Precipitation",
    "PPTclm": "climatology precipitation (not yet complete)",
    "GDD": "Growing Degree Days Total (Base 50°F)",
    "GDDcum": "Growing Degree Days Accumulation (Base 50°F)",
    "GSL": "Growing Season Length",
    "CHH": "Chilling Hours Total (32–45°F; Nov–Mar)",
    "CHHcum": "Chilling Hours Accumulation (32–45°F; Nov–Mar)",
    "FRD": "Frost Days Frequency",
    "TRN": "Tropical Nights Frequency",
    "TWV": "Heat Wave Event Frequency",
    "CDS": "Cold Snap Event Frequency",
    "DTR": "Diurnal Temperature Range",
    "DTRclm": "climatology of diurnal temperature range",
    "CWD": "Longest Wet Spell Length",
    "CDD": "Longest Dry Spell Length",
    "XWD": "Heavy Precipitation Event Frequency"
}

def ConstructDictionary(pair):

    return DataCollection(pair)


def DataCollection(pair):
    path = './climate_metrics/'
    dic = {}

    s_num = state_num[pair[0]]
    files = [i for i in os.listdir(path) if os.path.isfile(os.path.join(path,i)) and s_num in i]

    for f in files:
        if 'cum' in f:
            dic[GetDataName(f)] = CUMDataCollection(f, pair)
        elif 'clm' in f:
            print ('clm')
            # FixMe: write a function to process clm data
            pass
        else:
            dic[GetDataName(f)] = ENSDataCollection(f, pair)

    return dic

def CUMDataCollection(f, pair):
    with open('./climate_metrics/'+f, 'rU') as fp:
        reader = csv.reader(fp, delimiter = ',')
        data = list(reader)
        dic = {}
        dic["name"] = GetDataName(f)
        dic["chart-type"] = "line"
        dic["series"] = ["Modeled Historic Baseline", "Modeled Low Future", "Modeled High Future"]
        dic["label_unit"] = "days"
        dic["historic-mean"] = []
        dic["historic-min"] = []
        dic["historic-max"] = []

        for row in data:
            if row[0] == pair[0] and row[1] == pair[1] and row[2] != "NA" and row[3] != "NA" and row[4] != "NA":
                dic["historic-mean"].append(float(row[3]))
                dic["historic-min"].append(float(row[4]))
                dic["historic-max"].append(float(row[5]))


        dic["labels"] = [str(i+1) for i in xrange(len(dic["historic-mean"]))]

    return dic


def ENSDataCollection(f, pair):
    with open('./climate_metrics/'+f, 'rU') as fp:
        reader = csv.reader(fp, delimiter = ',')
        data = list(reader)
        dic = {}

        dic["name"] = GetDataName(f)
        dic["chart-type"] = "bar"
        dic["series"] = ["1"]
        dic["labels"] = ["Modeled Historic Baseline", "Modeled Low Future", "Modeled High Future"]
        dic["label_unit"] = dic["chart-type"]

        for row in data:
            if row[0] == pair[0] and row[1] == pair[1] and row[2] != "NA" and row[3] != "NA" and row[4] != "NA":
                dic["historic-mean"] = [float(row[2])]
                dic["historic-min"] = [float(row[3])]
                dic["historic-max"] = [float(row[4])]

    return dic


def GetDataName(f):
    name = f.split('_')[1]
    data_name = file_name[name]
    return data_name
