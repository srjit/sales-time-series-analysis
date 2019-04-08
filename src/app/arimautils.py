import warnings
import itertools
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import statsmodels.api as sm
from dateutil.relativedelta import relativedelta
import datetime
import json


def arimaWalkForwardValidation(p,d,q,trainEndDate):
	df_sales = pd.read_csv("./data/Sales_Multiseries_training.csv")
	df_sales.Date = pd.to_datetime(df_sales.Date, format='%m/%d/%y')
	df_sales = df_sales.sort_values('Date')
	df_sales = df_sales.set_index('Date')
	stores=["Savannah","Baltimore","Columbus","Detroit","Lancaster","Louisville","Philadelphia","Portland","Richmond","San Antonio"]
	modeltype="arima"
	dictResult = {}
	startdate = pd.to_datetime(trainEndDate);
	for i in range (3):
		for s in stores:
			d1=df_sales[df_sales.Store == s]
			d2=d1[d1.index < startdate] 
			dstore = d2['Sales']	
			p =p
			d=d
			q=q
			mod = sm.tsa.statespace.SARIMAX(dstore,
								order=(p,d,q),
								seasonal_order=(0, 1, 1,12),
								enforce_stationarity=False,
								enforce_invertibility=False,freq='D')
			enddate=startdate+relativedelta(months=2)
			results = mod.fit()
			y_truth = d1['Sales'][startdate:enddate]
			y_forecast= results.get_prediction(start=pd.to_datetime(startdate) ,end=pd.to_datetime(enddate), dynamic=False).predicted_mean
			y_forecast=y_forecast[ :len(y_truth)]
			st= [s for i in range(len(y_forecast))]
			df=pd.DataFrame({'Date':y_forecast.index ,'Store':st,'Y_actual':y_truth.values,'Y_Pred':y_forecast.values})
			dictResult['df_cv_' + str(i)] = df.to_json(orient='records')
		startdate=startdate+relativedelta(months=2)
	return [dictResult]




def arimaforecast(p,d,q,trainEndDate,steps):
	df_sales = pd.read_csv("./data/Sales_Multiseries_training.csv")
	df_sales.Date = pd.to_datetime(df_sales.Date, format='%m/%d/%y')
	df_sales = df_sales.sort_values('Date')
	df_sales = df_sales.set_index('Date')
	trainEndDate = pd.to_datetime(trainEndDate)
	modeltype="arima"
	stores=["Savannah","Baltimore","Columbus","Detroit","Lancaster","Louisville","Philadelphia","Portland","Richmond","San Antonio"]
	for s in stores:
		d1=df_sales[df_sales.Store == s]
		d2=d1[d1.index <trainEndDate ] 
		dstore = d2['Sales']
		p =p
		d=d
		q=q
		mod = sm.tsa.statespace.SARIMAX(dstore,
								order=(p,d,q),
								seasonal_order=(0, 1, 1,12),
								enforce_stationarity=False,
								enforce_invertibility=False,freq='D')
		results = mod.fit()
		pred = results.get_forecast(steps=steps)
		y_forecastbeyond=pred.predicted_mean
		df=pd.DataFrame({'Date':y_forecastbeyond.index, 'value':y_forecastbeyond.values})
		df['Date']=df['Date'].dt.strftime('%m/%d/%Y')
		write_location = "predictions/" + modeltype + "/" + s + ".csv"
		#write_location = "predictions/samplenew.csv" 
		df.to_csv(write_location, index=False,sep='	', mode='a')
		





