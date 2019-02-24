#importing libraries
import os
import json

import flask
import pickle
from flask import Flask, render_template, request

import pandas as pd

#creating instance of the class
app=Flask(__name__)

#to tell flask what url shoud trigger the function index()
@app.route('/')
@app.route('/index')
def index():
    data = pd.read_csv("../../data/Sales_Multiseries_training.csv")
    data = data[:18].iloc[:,0:5]
    headers = list(data.columns.values)
    body = data.values.tolist()
    body.insert(0, headers)
    return flask.render_template('index.html', results=body)


@app.route('/test')
def test():
    data = {"data" : [("A",3),("B",2),("C",7),("D",10),("E",12),("F",9)]}
    return json.dumps(data)




if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD']=True
    app.run(debug=True,use_reloader=True)    
    
