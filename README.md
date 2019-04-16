# Time Series Analysis on Sales Data

---

Sales forecasting is one of the most common time series analysis problems. Being able to estimate the number of products that a store going to sell in future will allow store managers to prepare the inventory, the number of employees needed minimizes over and under stocking thereby minimizing losses and most importantly maximizes sales and customer satisfaction.

The web application provides an interface by which data scientists or store managers can use past sales data to forecast it from a selected date. In addition to allowing the user to retrain and tune three different time series models, the application also displays the model performance, past information and forecasted predictions visually.


### Data
---
The dataset is propritory sales information of 10 different stores, which are the clients of DataRobot Inc. This data was available to us in CSV format and it included the following features


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

	* p - the number of autoregressive terms
	* q - the number of lagged forecast errors in the prediction equation.
	* d - the number of nonseasonal differences needed for stationarity
	
- XGBoost

	* learning_rate
	* max_depth
    	* n_estimators
  
- LSTM

	* learning_rate - learning rate of the optimizer. The default value is 0.01
	* optimizer - Optimizer used for the lstm model. This could be either sgd, rmsprop, adam. Adam seems to be the optimizer that provides best values for the metrics used.

### Visual Outputs
---

#### Model Performance

Pie Chart | Line Chart Functions
 
#### Area Plot for Visualizing Historic Data

The stacked area chart describes about the historical sales data for all the stores. Each store is encoded using a color attribute and it is aggregated month-wise. On Hovering over the Area plot on a particular store, we can get the details of the sales in a store for a particular day.
	
An Onclick on the selected store links to the sales forecast for the next 7 days after the forecast start date for a particular selected store.
	
#### Forecasting Predicitons

The waterfall plot provides a visualization of the predictions from the models integrated to the applications. The forecast date can be provided as one of the user inputs while the model is being trained/re-trained. 

The plot shows the variation of prices (up/down) and the percentage change in the prices from the prices from the previous day. An increase in sales is represented by a gray bar whereas a decrease is represented by an yellow bar.
 
### Running the app locally
---

Once the dependencies are installed, the app can be run locally with the command `flask run`. 

### Deployment
---

The app has been deployed on a heroku server at: [Sales Analyzer](https://sales-ts-forecast.herokuapp.com/)

### Information
---
The development process of the project along with more information on the modeling and visualizations can be found at [Sales Analyzer Information](https://srjit.github.io/sales-ts-forecast-info/)
