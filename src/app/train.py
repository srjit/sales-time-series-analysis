## This file contains the interface to add algorithm train methods


__author__ = "Sreejith Sreekumar"
__email__ = "sreekumar.s@husky.neu.edu"
__version__ = "0.0.1"




def arima(params):
    p = params["p"]
    q = params["q"]
    d = params["d"]

    ## retrain arima here and write predictions to file system
    pass



def xgboost(params):
    n_jobs = params["n_jobs"]
    learning_rate = params["learning_rate"]
    max_depth = params["max_depth"]
    min_child_weight = params["min_child_weight"]
    n_estimators = params["n_estimators"]

    ## retrain xgboost here write predictions to file system
    
    pass



def lstm(params):

    learning_rate = params["learning_rate_lstm"]
    optimizer = params["optimizer"]

    ## retrain lstm here write predictions to file system
    
    pass
    
