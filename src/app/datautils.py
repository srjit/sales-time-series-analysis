import pandas as pd
import os
import csv
import json
import copy


__author__ = "Sreejith Sreekumar"
__email__ = "sreekumar.s@husky.neu.edu"
__version__ = "0.0.1"



def get_data_to_render():
    
    data = pd.read_csv("./data/Sales_Multiseries_training.csv")
    data = data[:18].iloc[:,0:5]
    headers = list(data.columns.values)
    body = data.values.tolist()
    body.insert(0, headers)
    return body
    

def get_data():

    data = pd.read_csv("./data/Sales_Multiseries_training.csv")
    data["date_"] = pd.to_datetime(arg=data.Date)
    data = data.sort_values(by="date_")
    return data


def get_data_fe():

    data = pd.read_csv("./data/Sales_Multiseries_withFE.csv")
    data["date_"] = pd.to_datetime(arg=data.Date)
    return data


def write_predictions(modeltype, storename, data):
    write_location = "predictions/" + modeltype + "/" + storename + ".csv"
    data.to_csv(write_location, index=False)
    
def get_predictions(modeltype):
    read_location = "predictions/" + modeltype + "/"
    filenames = os.listdir(read_location)
    suffix = ".csv"
    filenames = [filename for filename in filenames if filename.endswith(suffix)]

    to_return = {}
    for filename in filenames:
        storename = filename.split(".")[0]
        filepath = read_location + filename
        to_return[storename] = pd.read_csv(filepath).to_json(orient="records")

    return to_return

# Function to get data from json file
def get_validationData(modeltype):
    readLocation = "Validation/" + modeltype + "/"
    fileNames = os.listdir(readLocation)
    suf = ".json"
    fileNames = [filename for filename in fileNames if filename.endswith(suf)]
    print(fileNames)
    dataVal = {}
    for filename in fileNames:
        filePath = readLocation + filename
        dataVal = json.load(open(filePath))
    return dataVal
    

def get_predictions_of_store(modeltype, store):
    read_location = "predictions/" + modeltype + "/" + store + ".csv"
    data = pd.read_csv(read_location).to_json(orient="records")
    return data
    
    
    
def format_and_store_cv_data(cv_info):

    validation = {}
    for i in range(3):

        key = "df_cv_" + str(i)

        tmp_ = []
        for store in cv_info.keys():
            store_val_data = cv_info[store][i]
            store_val_data["Store"] = store
            tmp_.append(store_val_data)

        tmp = pd.concat(tmp_, ignore_index=True, axis=0)
        tmp_to_json = tmp.to_json(orient='records') 
        validation[key] = copy.copy(tmp_to_json)

    # serialize the 'validation' map here
    write_location = "./Validation/lstm/cvData.json"
    json.dump([validation], open(write_location, "w"))
