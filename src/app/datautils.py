import pandas as pd

__author__ = "Sreejith Sreekumar"
__email__ = "sreekumar.s@husky.neu.edu"
__version__ = "0.0.1"



def get_data_to_render():
    
    data = pd.read_csv("../../data/Sales_Multiseries_training.csv")
    data = data[:18].iloc[:,0:5]
    headers = list(data.columns.values)
    body = data.values.tolist()
    body.insert(0, headers)
    return body
    


def get_data():

    data = pd.read_csv("../../data/Sales_Multiseries_training.csv")
    data["date_"] = pd.to_datetime(arg=data.Date)
    data = data.sort_values(by="date_")
    return data



def write_predictions(modeltype, storename, data):

    write_location = "predictions/" + modeltype + "/" + storename + ".csv"
    data.to_csv(write_location, index=False)
    
