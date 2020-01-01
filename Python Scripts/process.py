from flask import Flask, render_template, request, jsonify, g
from datetime import datetime, timedelta,date
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
import statsmodels.api as sm
from sklearn.model_selection import train_test_split
#import keras
#from keras.layers import Dense
#from keras.models import Sequential
#from keras.optimizers import Adam 
#from keras.callbacks import EarlyStopping
#from keras.utils import np_utils
#from keras.layers import LSTM
#from sklearn.model_selection import KFold, cross_val_score, train_test_split


app = Flask(__name__)

@app.route('/process', methods=['POST'])
def process():
	data = request.get_json()

	return jsonify(data[0]) 

if __name__ == '__main__':
	app.run(debug=False)
