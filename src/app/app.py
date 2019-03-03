#importing libraries
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
    algorithm_name = params['algorithm']
    train_function = getattr(train, algorithm_name)
    train_function(params)
    body = datautils.get_data_to_render()
    return flask.render_template('index.html', results=body)


@app.route('/forecast',methods = ['POST', 'GET'])
def forecast():
    return flask.render_template('forecast.html')



if __name__ == "__main__":
    app.config['TEMPLATES_AUTO_RELOAD']=True
    app.run(debug=True,use_reloader=True)    
    
