
import itertools
import numpy as np
import pandas as pd
import statsmodels.api as sm
from dateutil.relativedelta import relativedelta
import datetime
import json
import os
import sys


def arimaWalkForwardValidation(l):
	p=l[0]
	q=l[1]
	d=l[2]
	trainEndDate=l[3]
	df_sales = pd.read_csv("./data/Sales_Multiseries_training.csv")
	df_sales.Date = pd.to_datetime(df_sales.Date, format='%m/%d/%y')
	modeltype='arima'
	write_location = "./Validation/arima/cvData.json"
	df_sales = df_sales.sort_values('Date')
	df_sales = df_sales.set_index('Date')
	stores=["Savannah","Baltimore","Columbus","Detroit","Lancaster","Louisville","Philadelphia","Portland","Richmond","San Antonio"]
	modeltype="arima"
	dictResult = {}
	startdate = pd.to_datetime(trainEndDate,format='%Y/%m/%d');
	for i in range (3):
		l1=[]
		for s in stores:
			d1=df_sales[df_sales.Store == s]
			d2=d1[d1.index < startdate] 
			dstore = d2['Sales']	
			mod = sm.tsa.statespace.SARIMAX(dstore,order=(p,d,q),
								seasonal_order=(0, 1, 1,12),
								enforce_stationarity=False,
								enforce_invertibility=False,freq='D')
			enddate=startdate+relativedelta(months=2)
			results = mod.fit()
			y_truth = d1['Sales'][startdate:enddate]
			y_forecast= results.get_prediction(start=pd.to_datetime(startdate) ,end=pd.to_datetime(enddate), dynamic=False).predicted_mean
			y_forecast=y_forecast[ :len(y_truth)-1]
			y_truth =y_truth[ :len(y_forecast)]
			st= [s for i in range(len(y_forecast))]
			df=pd.DataFrame({'Date':y_forecast.index,'Y_actual':y_truth.values,'Y_pred':y_forecast.values,'Store':st})
			df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
			p1=df.to_json(orient='records')[1:-1].strip()
			l1.append(p1)
		dictResult['df_cv_' + str(i)]=str(l1).replace("'","")
		startdate=startdate+relativedelta(months=2)
	json.dump([dictResult], open(write_location, "w"))


def arimaforecast(l):
	p=l[0]
	q=l[1]
	d=l[2]
	trainEndDate=l[3]
	df_sales = pd.read_csv("./data/Sales_Multiseries_training.csv")
	df_sales.Date = pd.to_datetime(df_sales.Date, format='%m/%d/%y')
	df_sales = df_sales.sort_values('Date')
	df_sales = df_sales.set_index('Date')
	trainEndDate = pd.to_datetime(trainEndDate,format='%Y/%m/%d')
	modeltype="arima"
	stores=["Savannah","Baltimore","Columbus","Detroit","Lancaster","Louisville","Philadelphia","Portland","Richmond","San Antonio"]
	for s in stores:
		d1=df_sales[df_sales.Store == s]
		d2=d1[d1.index < trainEndDate ] 
		dstore = d2['Sales']
		mod = sm.tsa.statespace.SARIMAX(dstore,order=(p,d,q),
								seasonal_order=(0, 1, 1,12),
								enforce_stationarity=False,
								enforce_invertibility=False,freq='D')
		results = mod.fit()
		pred = results.get_forecast(steps=10)
		y_forecastbeyond=pred.predicted_mean
		df=pd.DataFrame({'Date':y_forecastbeyond.index, 'value':y_forecastbeyond.values})
		df['Date']=df['Date'].dt.strftime('%m/%d/%y')
		print(s)
		write_location = "predictions/" + modeltype + "/" + s + ".csv"
		df.to_csv(write_location, index=False,sep=',')
		





