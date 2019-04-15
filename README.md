# Time Series Analysis on Sales Data

---
The web application provides an interface by which data scientists or store managers can use past sales data to forecast it from a selected date. In addition to allowing the user to retrain and tune three different time series models, the application also displays the model performance, past information and forecasted predictions visually.


### Dataset
---
The dataset is propritory sales information of 10 different stores, which are the clients of DataRobot Inc.


### Getting Started
---
Install the dependencies for the web application using the python [requirements file](https://github.com/srjit/sales-time-series-analysis/blob/master/src/app/requirements.txt) by the command

```
pip install -r requirements.txt
```

### Retraining Models
---

Following are the descriptions of the hyperparameters for each model integrated into the application

- ARIMA

	* p is the number of autoregressive terms
	* q is the number of lagged forecast errors in the prediction equation.
	* d is the number of nonseasonal differences needed for stationarity
	
- XGBoost

	* learning_rate
	* max_depth
    	* n_estimators
  
- LSTM

	* learning_rate
	* optimizer

### Visualizing Model Performace
---

- Pie Chart | Line Chart
 
### Area Plot for Visualizing Historic Data
The stacked area chart describes about the historical sales data for all the stores. It is aggregated month wise. On Hovering over the Area plot we can get the details of the sales in a store for a particular day.
An Onclick on the selected store links to the sales forecast for the next 7 days after the forecast start date for a particular selected store.
---
 
### Forecasting Predicitons
---
	
 
### Running the app locally
---
 

### Deployment
