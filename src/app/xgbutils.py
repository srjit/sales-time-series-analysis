# Importing required Libraries
import os
import sys
import json
import numpy as np
import pandas as pd
import xgboost as xgb
from flask import Flask
from flask import jsonify
from sklearn import metrics
from xgboost import XGBRegressor
from flask import render_template
from sklearn import preprocessing
from flask_restful import Resource, Api
os.environ['KMP_DUPLICATE_LIB_OK']='True'
from dateutil.relativedelta import relativedelta
from sklearn.preprocessing import StandardScaler, MinMaxScaler


__author__ = "Satish Chirra"
__email__ = "chirra.s@husky.neu.edu"
__version__ = "0.0.1"


def xgbWalkForwardValidation(trainEndDate, maxDepth, learningRate, nEstimators):
    # load data
    df = pd.read_csv("./data/Sales_Multiseries_withFE.csv")
    df.Date = pd.to_datetime(df.Date)
    trainEndDate = pd.to_datetime(trainEndDate)
    maxDepth = int(maxDepth)
    learningRate = float(learningRate)
    nEstimators = int(nEstimators)
    write_location = "./Validation/xgboost/cvData.json"
    # Time series cross validation with time step of 2 months
    dictResult = {}
    for i in range(3):
        # Dividing the data into train and test
        train, test = df[df.Date < trainEndDate], df[(df.Date >= trainEndDate) & (df.Date < trainEndDate+relativedelta(months=2))]
        # Dividing features and target for both train and test datasets
        X_train, Y_train = train.drop('Sales', axis=1), train.Sales
        X_test, Y_test = test.drop('Sales', axis=1), test.Sales
        # Droping columns 'Date', 'Store' and 'Marketing'
        X_train.drop(['Date','Store','Marketing'], axis=1, inplace=True)
        X_test.drop(['Date','Store','Marketing'], axis=1, inplace=True)
        # Normalizing the train data
        scaler = preprocessing.MinMaxScaler()
        X_train_scaled = scaler.fit_transform(X_train.fillna(0))
        # Fitting the Model
        model = XGBRegressor(max_depth=maxDepth, learning_rate=learningRate, n_estimators=nEstimators, n_jobs=-1)
        model.fit(X_train_scaled, Y_train)
        # Normalizing test data
        X_test_scaled = scaler.transform(X_test.fillna(0))
        # Prediction on test data using XGBoost
        y_pred = model.predict(X_test_scaled)
        df_actual = pd.DataFrame({'Date': train.Date, "Store": train.Store, "Y_actual": Y_train, "Y_pred": None})
        df_pred = pd.DataFrame({"Date": test.Date, "Store": test.Store, "Y_actual": Y_test, "Y_pred": y_pred })
        df_pred['Date'] = df_pred['Date'].dt.strftime('%Y-%m-%d')
        df_total = df_actual.append(df_pred)
        dictResult['df_cv_' + str(i)] = df_pred.to_json(orient='records')
        trainEndDate = trainEndDate+relativedelta(months=2)
    json.dump([dictResult], open(write_location, "w"))




def xgbforecast(trainEndDate, maxDepth, learningRate, nEstimators):
	# Reading the data from csv
	df_sales = pd.read_csv("./data/Sales_Multiseries_withFE.csv")
	# Formatting Date
	df_sales.Date = pd.to_datetime(df_sales.Date)
	trainEndDate = pd.to_datetime(trainEndDate)
	maxDepth = int(maxDepth)
	learningRate = float(learningRate)
	nEstimators = int(nEstimators)
	modeltype="xgboost"
	# Dividing the data into train and test
	train, test = df_sales[df_sales.Date < trainEndDate], df_sales[(df_sales.Date >= trainEndDate) & (df_sales.Date < trainEndDate+relativedelta(months=2))]
	# Dividing features and target for both train and test datasets
	X_train, Y_train = train.drop('Sales', axis=1), train.Sales
	X_test, Y_test = test.drop('Sales', axis=1), test.Sales
	# Droping columns 'Date', 'Store' and 'Marketing'
	X_train.drop(['Date','Store','Marketing'], axis=1, inplace=True)
	X_test.drop(['Date','Store','Marketing'], axis=1, inplace=True)
	# Normalizing the train data
	scaler = preprocessing.MinMaxScaler()
	X_train_scaled = scaler.fit_transform(X_train.fillna(0))
	# Fitting the Model
	model = XGBRegressor(max_depth=maxDepth, learning_rate=learningRate, n_estimators=nEstimators, n_jobs=-1)
	model.fit(X_train_scaled, Y_train)
	# Normalizing test data
	X_test_scaled = scaler.transform(X_test.fillna(0))
	# Prediction on test data using XGBoost
	y_pred = model.predict(X_test_scaled)
	df_pred = pd.DataFrame({'Date': test.Date, "value": y_pred})
	stores=list(df_sales.Store.unique())
	for s in stores:
		write_location = "predictions/" + modeltype + "/" + s + ".csv"
		#write_location = "predictions/samplenew.csv" 
		df_pred[df_sales.Store==s].to_csv(write_location, index=False)



























