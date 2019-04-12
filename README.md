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

	* p
	* q
	* d
	
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
---
 
### Forecasting Predicitons
---
	
 
### Running the app locally
---
 

### Deployment
