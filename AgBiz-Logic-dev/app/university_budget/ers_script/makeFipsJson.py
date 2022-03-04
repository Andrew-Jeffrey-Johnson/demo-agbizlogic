# -*- coding: utf-8 -*-
"""
Created on Tue Mar 12 11:51:43 2019
Reads in the FIPS region and creates a json file for the database.

SHOULD ONLY RUN WHEN FIPS-codes.json DOES NOT EXIST

@author: Luke
"""

import pandas as pd
import json

df = pd.read_excel("FIPS_ST_CO_ERSregion.xls")
df = df.dropna()

df.FIPS = df.FIPS.astype(int)
df['json'] = df.apply(lambda x: x.to_json(), axis=1)


data = [json.loads(x) for x in df['json'].tolist()]

jsonData = []

pk = 0
for entry in data:
    temp = {}
    temp["fields"] = {}
    temp["model"] = "university_budget.fipsregion"
    temp["pk"] = pk
    for key, value in entry.items():
        temp["fields"][key] = value
    temp["fields"]["name"] = str(entry["FIPS"]) + ", " + entry["state"] + ", " + entry["county"]
    jsonData.append(temp)
    pk += 1



with open("FIPS-codes.json", "w+") as writeFile:
    json.dump(jsonData, writeFile, sort_keys=True, indent=4)
