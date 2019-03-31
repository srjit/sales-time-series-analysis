## This file contains the interface to add algorithm train methods

import datautils
from datetime import datetime
import lstmutils

import pandas as pd

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
    #train_end_date = params["train_end_date"]

    print("########")
    train_end_date_ = "2014/4/1"
    train_end_date = datetime.strptime(train_end_date_, "%Y/%m/%d")

    print("Train End Date", train_end_date)

    ## retrain lstm here write predictions to file system
    data = datautils.get_data()

    print("Data received:", data.head())
    results = lstmutils.do_walk_forward_validation_and_get_best_models(data,
                                                                    train_end_date,
                                                                    learning_rate,
                                                                    optimizer)
    predictions = {}
    data = datautils.get_data()
    
    for result in results:

        store = result["store"]
        model = result["model"]
        scaler = result["scaler"]

        full_data_for_store = data[data.Store == store]
        test_ = data[data.date_ > train_end_date]
        dates = list(test_.Date)

        predictions = lstmutils.predict(model,
                                        scaler,
                                        full_data_for_store,
                                        train_end_date)
        
        import ipdb
        ipdb.set_trace()

        pred_for_store_on_date = pd.concat([dates,predictions], axis=1)

        import ipdb
        ipdb.set_trace()
        
    pass
    
