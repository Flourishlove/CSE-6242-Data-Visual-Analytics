from util import entropy, information_gain, partition_classes
import numpy as np

class DecisionTree(object):
    def __init__(self):
        self.tree = {}

    def learn(self, X, y, visited):
        # TODO: train decision tree and store it in self.tree
        if len(y) == 0:
            self.tree['label'] = 'failure'
            return

        (values,counts) = np.unique(y,return_counts=True)  #calculate most frequent element values[ind]
        ind=np.argmax(counts)
        if len(visited) == len(X[0]) or len(counts) == 1:
            self.tree['label'] = 'leaf'
            self.tree['value'] = values[ind]
            return

        max_gain = 0
        max_index = 0
        for i in range(len(X[0])):
            cur_attr = []
            for xentry in X:
                cur_attr.append(xentry[i])
            gain = information_gain(y, partition_classes(cur_attr, y, 5))
            if (gain > max_gain) and (i not in visited):
                max_gain = gain
                max_index = i

        X1 = []
        X2 = []
        y1 = []
        y2 = []
        visited.append(max_index)
        for i in range(len(X)):
            if X[i][max_index] <= 5:
                y1.append(y[i])
                X1.append(X[i])
            else:
                y2.append(y[i])
                X2.append(X[i])

        subtree1 = DecisionTree()
        subtree2 = DecisionTree()
        subtree1.learn(X1, y1, visited)
        subtree2.learn(X2, y2, visited)
        self.tree['label'] = 'normal'
        self.tree['attr'] = max_index
        self.tree['child1'] = subtree1
        self.tree['child2'] = subtree2

    def classify(self, record):
        # TODO: return predicted label for a single record using self.tree
        if self.tree['label'] == "failure":
            return 0
        elif self.tree['label'] == "leaf":
            return self.tree['value']
        elif record[self.tree['attr']] <= 5:
            return self.tree['child1'].classify(record)
        else:
            return self.tree['child2'].classify(record)

