spark-submit --class edu.gatech.cse6242.Q2 --master local \
  target/q2-1.0.jar /user/cse6242/graph1.tsv /user/cse6242/q2output1

hadoop fs -getmerge /user/cse6242/q2output1 q2output1.tsv
hadoop fs -rm -r /user/cse6242/q2output1
