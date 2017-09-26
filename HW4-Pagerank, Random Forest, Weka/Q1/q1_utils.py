from __future__ import print_function, absolute_import
import re

try:
    xrange
except:
    xrange = range

import os
import sys
import json
import argparse

from pagerank import pagerank

class MMapPageRank:
    def __init__(self, json_path):
        with open(json_path) as json_file:
            description = json.load(json_file)

        dir_name = os.path.dirname(json_path)
        self.edge_path = os.path.join(dir_name, description["edge_path"])
        self.index_path = os.path.join(dir_name, description["index_path"])
        self.node_count = description["node_count"]
        self.edge_count = description["edge_count"]
        self.max_node = description["max_node"]

        self.edge_file = open(self.edge_path)
        self.index_file = open(self.index_path)

    def run_pagerank(self, damping_factor=0.85, iterations=10):
        return pagerank(self.index_file,
                        self.edge_file,
                        self.max_node,
                        self.edge_count,
                        damping_factor=damping_factor,
                        iterations=iterations)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='CSE 6242 HW4 Q1 utilities')
    parser.add_argument("command", help="Sub-command to execute. Can be convert, pagerank or test_warmup.")
    parser.add_argument("filepath", help="The file to process for the specified sub-command.")

    parser.add_argument("-i", "--iterations", dest="iterations",
                        help="specify the number of iterations for pagerank to run. Default: 10",
                        default=10, type=int)

    parser.add_argument("-d", "--damping-factor", dest="damping_factor",
                        help="specify the damping factor for pagerank. Default: 0.85",
                        default=0.85, type=float)

    args = parser.parse_args()

    if args.command == "test_warmup":
        from q1_utils_support import test_warmup_submission
        test_warmup_submission(args.filepath)

    if args.command == "convert":
        from q1_utils_support import convert
        convert(args.filepath)

    if args.command == "pagerank":
        pr = MMapPageRank(args.filepath)
        result = pr.run_pagerank(iterations=args.iterations, damping_factor=args.damping_factor)
        print("Sorting...", file=sys.stderr)
        sorted_result = sorted(enumerate(result), key=lambda x: x[1], reverse=True)

        output_result = "node_id\tscore"
        for node_id, score in sorted_result[:10]:
            output_result += "\n{}\t{}".format(node_id, score)
        print(output_result)

        with open("pagerank_nodes_"+str(args.iterations)+".txt","w") as output_file:
            output_file.write(output_result)

