hadoop jar ./target/q1-1.0.jar edu.gatech.cse6242.Q1 /user/cse6242/graph2.tsv /user/cse6242/q1output2
hadoop fs -getmerge /user/cse6242/q1output2/ q1output2.tsv
hadoop fs -rm -r /user/cse6242/q1output2
