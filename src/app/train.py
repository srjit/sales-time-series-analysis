## This file contains the interface to add algorithm train methods

import datautils
import datetime as dt
from datetime import datetime
import lstmutils
import xgbutils
import arimautils

import pandas as pd

__author__ = "Sreejith Sreekumar"
__email__ = "sreekumar.s@husky.neu.edu"
__version__ = "0.0.1"


def arima(params):
    p = int(params["p"])
    q = int(params["q"])
    d = int(params["d"])
    train_end_date_ = params["train_end_date"]
    train_end_date = datetime.strptime(train_end_date_, "%Y/%m/%d")
    trainEndDate = str(train_end_date).split(' ')[0]
    forecast_start_date_ = params["forecast_start_date"]
    forecast_start_date = datetime.strptime(forecast_start_date_, "%Y/%m/%d")
    forecast_start_date=str(forecast_start_date).split(' ')[0]
    l1=[p,q,d,trainEndDate]
    l2=[p,q,d,forecast_start_date]
    arimautils.arimaWalkForwardValidation(l1)
    arimautils.arimaforecast(l2)
    modeltype = "arima"
   

    ## retrain arima here and write predictions to file system
    return "Success"

def xgboost(params):
    learning_rate = params["learning_rate"]
    max_depth = params["max_depth"]
    n_estimators = params["n_estimators"]

    # Train end date
    train_end_date_ = params["train_end_date"]
    train_end_date = datetime.strptime(train_end_date_, "%Y/%m/%d")

    print("Train End Date", train_end_date)

    ## Forecast start date
    forecast_start_date_ = params["forecast_start_date"]
    forecast_start_date = datetime.strptime(forecast_start_date_, "%Y/%m/%d")

    ## retrain xgboost here write predictions to file system
    xgbutils.xgbforecast(forecast_start_date_, max_depth, learning_rate, n_estimators)
    xgbutils.xgbWalkForwardValidation(train_end_date, max_depth, learning_rate, n_estimators)
    # datautils.get_validationData("xgboost")

    return "Success"


def lstm(params):
    modeltype = "lstm"
    learning_rate = params["learning_rate_lstm"]
    optimizer = params["optimizer"]

    #format has to be YYYY/mm/dd
    train_end_date_ = params["train_end_date"]
    train_end_date = datetime.strptime(train_end_date_, "%Y/%m/%d")


    # forecast start day
    forecast_start_date_ = params["forecast_start_date"]
    forecast_start_date = datetime.strptime(forecast_start_date_, "%Y/%m/%d")

    
    print("Train End Date", train_end_date)

    ## retrain lstm here write predictions to file system
    data = datautils.get_data()

    print("Data received:", data.head())
    results, cv_info = lstmutils.do_walk_forward_validation_and_get_best_models(data,
                                                                                train_end_date,
                                                                                learning_rate,
                                                                                optimizer)

    datautils.format_and_store_cv_data(cv_info)
    forecast_start_date = forecast_start_date + dt.timedelta(-1)

    for result in results:

        store = result["store"]
        model = result["model"]
        scaler = result["scaler"]

        full_data_for_store = data[data.Store == store]

        print("Creating predictions for store: ", store)
        predictions = lstmutils.predict(model,
                                        scaler,
                                        full_data_for_store,
                                        forecast_start_date)

        test_ = data[(data.Store == store) & (data.date_ > forecast_start_date)]

        prices = pd.Series(predictions.reshape(len(predictions),).tolist(), name="value")
        dates = test_.Date.reset_index(drop=True)

        pred_for_store_on_date = pd.concat([dates,prices],
                                           axis=1)

        datautils.write_predictions(modeltype, store, pred_for_store_on_date)

    return "Success"
    
