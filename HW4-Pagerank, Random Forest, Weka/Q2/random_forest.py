from decision_tree import DecisionTree
import csv
import numpy as np  # http://www.numpy.org
import ast
import random

"""
Here, X is assumed to be a matrix with n rows and d columns where n is the
number of total records and d is the number of features of each record. Also,
y is assumed to be a vector of n labels

XX is similar to X, except that XX also contains the data label for each
record.
"""

"""
This skeleton is provided to help you implement the assignment. It requires
implementing more that just the empty methods listed below.

So, feel free to add functionalities when needed, but you must keep
the skeleton as it is. Do not change the declaration of each function.
"""


class RandomForest(object):
    num_trees = 0
    decision_trees = []

    # the bootstrapping dataset for trees
    bootstraps_datasets = []

    # the true class labels, corresponding to records in the bootstrapping
    # dataset
    bootstraps_labels = []

    def __init__(self, num_trees):
        # TODO: do initialization here.
        self.num_trees = num_trees
        self.decision_trees = [DecisionTree() for i in range(num_trees)]

    def _bootstrapping(self, XX, n):
        # TODO: create a sample dataset with replacement of size n
        #
        # Note that you will also need to record the corresponding
        #           class labels for the sampled records for training purpose.
        #
        # Reference: https://en.wikipedia.org/wiki/Bootstrapping_(statistics)
        data_sample = []
        data_label = []
        for i in range(n):
            temp = random.randint(0,n-1)
            data_sample.append(XX[temp][:-1]);
            data_label.append(XX[temp][-1]);
        return data_sample, data_label

    def bootstrapping(self, XX):
        # TODO: initialize the bootstrap datasets for each tree.
        for i in range(self.num_trees):
            data_sample, data_label = self._bootstrapping(XX, len(XX))
            self.bootstraps_datasets.append(data_sample)
            self.bootstraps_labels.append(data_label)

    def fitting(self):
        # TODO: train `num_trees` decision trees using the bootstraps datasets
        # and labels
        for i in range(len(self.decision_trees)):
            self.decision_trees[i].learn(self.bootstraps_datasets[i], self.bootstraps_labels[i], [])

    def voting(self, X, y_truth):
        y = np.array([], dtype = int)

        for l, record in enumerate(X):
            # TODO: find the sets of proper trees that consider the record
            #       as an out-of-bag sample, and predict the label(class) for the record.
            #       The majority vote serves as the final label for this record.
            votes = []
            for i in range(len(self.bootstraps_datasets)):
                dataset = self.bootstraps_datasets[i]
                if record.tolist() not in dataset:
                    OOB_tree = self.decision_trees[i]
                    effective_vote = OOB_tree.classify(record)
                    votes.append(effective_vote)
            counts = np.bincount(votes)
            if len(counts) == 0:
                # TODO: special handling may be needed.
                y = np.append(y, y_truth[l])
            else:
                y = np.append(y, np.argmax(counts))

        return y


def main():
    X = list()
    y = list()
    XX = list()  # Contains data features and data labels

    # Note: you must NOT change the general steps taken in this main() function.

    # Load data set
    print 'reading hw4-data'
    with open("hw4-data.csv") as f:
        next(f, None)

        for line in csv.reader(f, delimiter=","):
            X.append(line[:-1])
            y.append(line[-1])
            xline = [ast.literal_eval(i) for i in line]
            XX.append(xline[:])

    # Initialize according to your implementation
    forest_size = 10

    # Initialize a random forest
    randomForest = RandomForest(forest_size)

    # Create the bootstrapping datasets
    print 'creating the bootstrap datasets'
    randomForest.bootstrapping(XX)

    # Build trees in the forest
    print 'fitting the forest'
    randomForest.fitting()

    # Provide an unbiased error estimation of the random forest
    # based on out-of-bag (OOB) error estimate.
    # Note that you may need to handle the special case in
    #       which every single record in X has used for training by some
    #       of the trees in the forest.
    y_truth = np.array(y, dtype=int)
    X = np.array(X, dtype=float)
    y_predicted = randomForest.voting(X, y_truth)

    # results = [prediction == truth for prediction, truth in zip(y_predicted, y_test)]
    results = [prediction == truth for prediction, truth in zip(y_predicted, y_truth)]

    # Accuracy
    accuracy = float(results.count(True)) / float(len(results))
    print "accuracy: %.4f" % accuracy


if __name__ == "__main__":
    main()
