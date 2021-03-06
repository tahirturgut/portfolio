# -*- coding: utf-8 -*-
"""HW1-CS412-kNN-tahirturgut.ipynb

Automatically generated by Colaboratory.

Original file is located at
    https://colab.research.google.com/drive/1IFn63-tQF2oSZsmWhgYskQiwLv5yVuKG

# CS412 - Machine Learning - 2021
## Homework 1
100 pts


## Goal

The goal of this homework is three-fold:

*   Introduction to the machine learning experimental set up 
*   Gain experience with Decision Tree and k-NN approaches
*   Gain experience with the Scikit library

## Dataset
**MNIST** is a collection of 28x28 grayscale images of digits (0-9); hence each pixel is a gray-level from 0-255. 

**Download the data from Keras. Reserve 20% of the training data for validation** (no need for cross-validation as you have plenty of data) and **use the rest for development (learning your models). The official test data (10,000 samples) should only be used for testing at the end, and not model selection.**

## Task 
Build a classifier (decision tree and k-NN) with the Scikit library function calls to classify digits in the MNIST dataset.

## Software: 

You may find the necessary function references here: 

http://scikit-learn.org/stable/supervised_learning.html

When you search for decision tree for instance, you should find the relevant function and explained parameters, easily.

## Submission: 
Fill this notebook. Write the report section at the end, removing the part in italics. 

You should prepare a separate pdf document as your homework (name hw1-CS412-yourname.pdf) which consists of the report (Part 8) of the notebook for easy viewing -and- include a link to your notebook from within the pdf report (make sure to include the link obtained from the #share link on top right).

##1) Initialize

*   First make a copy of the notebook given to you as a starter.

*   Make sure you choose Connect form upper right.

## 2) Load training dataset

*  Read from Keras library.
"""

#this cell can be skipped at the running time
from keras.datasets import mnist
(X_train, Y_train), (X_test, y_test) = mnist.load_data()

# Load the Pandas libraries with alias 'pd' 
import pandas as pd
import numpy as np

# Read data
column_names = ['pixel_'+str(i) for i in range(784)]

df_pixels = pd.DataFrame(X_train.reshape(60000, 784), columns = column_names)
df_values = pd.DataFrame(Y_train, columns = ['real_value'])

df = df_pixels.join(df_values)

"""##3) Understanding the dataset

There are alot of functions that can be used to know more about this dataset

- What is the shape of the training set (num of samples X number of attributes) ***[shape function can be used]***

- Display attribute names ***[columns function can be used]***

- Display the first 5 rows from training dataset ***[head or sample functions can be used]***

..
"""

#this cell can be skipped at the running
#print attribute names
print(df.columns)

# print shape
print('Data Dimensionality: ', df.shape)

# print first 5 rows in your dataset
print('Head of Data: \n', df.head())

"""##4) Shuffle and Split TRAINING data as train (also called development) (80%) and validation (20%) """

from sklearn.utils import shuffle

# Shuffle the training data
df = shuffle(df, random_state = 20)

df_X = df.drop(["real_value"], axis=1)
df_Y = df['real_value']

# Split 80-20
from sklearn.model_selection import train_test_split

X_train, X_validation, Y_train, Y_validation = train_test_split(df_X, df_Y, test_size=0.2, random_state = 20)

"""##5) Train decision tree and k-NN  classifiers on development data and do model selection using the validation data


* Train a decision tree (try  4 different meta-parameters, varying max_depth and min_samples_split. You should play with different values, maybe 10 or 20 for max-depth and 100 or 200 for min_samples_split) and a k-NN classifier (use k=3 and k=7, do not try other values) with the rest of the parameters set to default. 

* The aim in this homework is not necessarily obtaining the best performance, but to establish the ML pipeline (train a few models, select based on validation set, test, report).

"""

# Train k-NN classifiers
from sklearn.tree import DecisionTreeClassifier

decision_tree_1 = DecisionTreeClassifier(max_depth=10, min_samples_split=100)
decision_tree_1.fit(X_train, Y_train)

decision_tree_2 = DecisionTreeClassifier(max_depth=10, min_samples_split=200)
decision_tree_2.fit(X_train, Y_train)

decision_tree_3 = DecisionTreeClassifier(max_depth=20, min_samples_split=100)
decision_tree_3.fit(X_train, Y_train)

decision_tree_4 = DecisionTreeClassifier(max_depth=20, min_samples_split=200)
decision_tree_4.fit(X_train, Y_train)

from sklearn.neighbors import KNeighborsClassifier

knn = KNeighborsClassifier(3)
knn.fit(X_train, Y_train)
# Report your results

"""## 6) Test your trained classifiers on the Validation set
Test your trained classifiers on the validation set and print the accuracies.

"""

from sklearn.metrics import accuracy_score

dt1_predictions = decision_tree_1.predict(X_validation)
dt2_predictions = decision_tree_2.predict(X_validation)
dt3_predictions = decision_tree_3.predict(X_validation)
dt4_predictions = decision_tree_4.predict(X_validation)

knn_predictions = knn.predict(X_validation)
#I have splitted reporting result part and prediction part into two blocks,
#since it takes too much time when a re-run is needed in output.

# Use misclassification rate as error measure
dt1_acc = accuracy_score(Y_validation, dt1_predictions)
dt2_acc = accuracy_score(Y_validation, dt2_predictions)
dt3_acc = accuracy_score(Y_validation, dt3_predictions)
dt4_acc = accuracy_score(Y_validation, dt4_predictions)

knn_acc = accuracy_score(Y_validation, knn_predictions)
# Report your results
print("Decision Tree with max depth 10 and min samples split 100 has validation accuracy: ", dt1_acc)
print("Decision Tree with max depth 10 and min samples split 200 has validation accuracy: ", dt2_acc)
print("Decision Tree with max depth 20 and min samples split 100 has validation accuracy: ", dt3_acc)
print("Decision Tree with max depth 20 and min samples split 200 has validation accuracy: ", dt4_acc)

print("k-NN with k = 3 has validation accuracy: ", knn_acc)

"""## 7) Test your classifier on Test set

- Load test data
- Apply same pre-processing as training data (probably none)
- Predict the labels of testing data **using the best model that you have selected according to your validation results** and report the accuracy. 
"""

from sklearn.metrics import accuracy_score

# Load test data
df_pixels_test = pd.DataFrame(X_test.reshape(10000, 784), columns = column_names)
df_values_test = pd.DataFrame(y_test, columns = ['real_value'])

# Predict
best_predictions = knn.predict(df_pixels_test)
best_acc = accuracy_score(df_values_test, best_predictions)

# Report your result
print("The best model, k-NN with k = 3, has test accuracy: ", best_acc)

"""##8) Report Your Results

**Notebook should be RUN:** As training and testing may take a long time, we may just look at your notebook results; so make sure **each cell is run**, so outputs are there.

**Report:** Write an **one page summary** of your approach to this problem **below**; this should be like an abstract of a paper or the executive summary (you aim for clarity and passing on information, not going to details about known facts such as what kNN is or what MNIST is, assuming they are known to people in your research area). 

**Must include statements such as those below:**
**(Remove the text in parentheses, below, and include your own report)**

( Include the problem definition: 1-2 lines )

 (Talk about train/val/test sets, size and how split. )

 (In here you would also talk about feature extraction or preprocessing - but here we dont do any.)

 ( Give the validation accuracies for different approach and meta-parameters tried **in a table** and state which one you selected as your model.)

( State  what your test results are with the chosen approach and meta-parameters: e.g. "We have obtained the best results on the validation set with the ..........approach using a value of ...... for .... parameter. The result of this model on the test data is ..... % accuracy."" 

 (Comment on the speed of the different approaches and anything else that you deem important/interesting (e.g. confusion matrix)). 

 You can add additional visualization as separate pages if you want, think of them as appendix, keeping the one-page as abstract/summary.
 
As long as you have the essential info summarizing what you have done and your results, exact format or extra content (like what you may find interesting) does not matter. You will get full points from here as long as you have a good (enough) summary of your work, regardless of your best performance or what you have decided to talk about in the last few lines.


"""