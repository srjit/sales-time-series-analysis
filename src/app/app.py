#importing libraries
import os
import json

import flask
import pickle
from flask import Flask, render_template, request

#creating instance of the class
app=Flask(__name__)

#to tell flask what url shoud trigger the function index()
@app.route('/')
@app.route('/index')
def index():
    return flask.render_template('index.html')


@app.route('/test')
def test():
 data = {"data" : [("A",3),("B",2),("C",7),("D",10),("E",12),("F",9)]}
 return json.dumps(data)




if __name__ == "__main__":
    app.run(use_reloader=True)
