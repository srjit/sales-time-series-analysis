#importing libraries

import sys, os
sys.path.append('.')

import os
import json
import train
import flask
import pickle
import datautils
from flask import Flask, render_template, request

#creating instance of the class
app=Flask(__name__)

#to tell flask what url shoud trigger the function index()
@app.route('/')
@app.route('/index')
def index():
    body = datautils.get_data_to_render()
    return flask.render_template('index.html', results=body)

@app.route('/configure')
def configure():
    body = datautils.get_data_to_render()
    return flask.render_template('configure.html', results=body)

@app.route('/test')
def test():
    data = {"data" : [("A",3),("B",2),("C",7),("D",10),("E",12),("F",9)]}
    return json.dumps(data)


@app.route('/retrain',methods = ['POST', 'GET'])
def retrain():
    params = request.form
    print(params)
    algorithm_name = params['algorithm']
    train_function = getattr(train, algorithm_name)
    print("Algorithm: ", algorithm_name)
    print("Function Train: ", train_function)
    message = train_function(params)
    body = datautils.get_data_to_render()
    return flask.render_template('index.html', results=body)


@app.route('/forecast',methods = ['POST', 'GET'])
def forecast():
    return flask.render_template('forecast.html')

@app.route('/getpredictions', methods=["GET", "POST"])
def getpredictions():
    algorithm = request.args['algorithm']
    predictions = datautils.get_predictions(algorithm)
    return json.dumps(predictions)    

@app.route('/forcaststore', methods=["GET", "POST"])
def forcaststore():
    algorithm = request.args['algorithm']
    store = request.args['store']
    predictions = datautils.get_predictions_of_store(algorithm,store)
    return json.dumps(predictions)    
    

@app.route('/getvalidation', methods=["GET", "POST"])
def getvalidation():
    algorithm = request.args['algorithm']
    print(algorithm)
    data = datautils.get_validationData(algorithm)
    return json.dumps(data)


if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD']=True
    app.run(debug=True,use_reloader=True)

