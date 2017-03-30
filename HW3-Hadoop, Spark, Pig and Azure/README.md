# Hadoop, Spark, Pig and Azure
This assignment is mainly about using hadoop and other big data tools on different platform.

## 1. Hadoop Program
#### Overview:
The code in this part is used for analyze a graph with Hadoop. Suppose the input direct graph represents a network where node is email address and edge weight stands for how many times source node send email to destination node. The goal is to find the largest weight among all the weighted inbound edges for each node in this graph.

#### Steps:
1. Insall [CDH](https://www.cloudera.com/downloads/quickstart_vms/5-8.html) and configure environment.
2. Load data into HDFS and complete code.
3. Compile and Merge output.

#### Things need to pay attention during implementation:
1. Allocate 4G RAM to Virtual Machine if laptop has 8G RAM or more, which may benefit your feel dramatically.
2. In your map and reduce class, remember Mapper and Reducer's interface <KEYIN,VALUEIN,KEYOUT,VALUEOUT>. Keep in mind that we need to modify function parameter data type according to input and output.
3. Use "\t" and "\n" to deal with input.
4. Use "hadoop fs -getmerge /user/cse6242/q1output1/ q1output1.tsv" to merge all output files.

## 2. Spark Program
#### Overview:
The task is to calculate the gross accumulated node weights for each node (All incoming edge weights - All outgoing edge weights) using Spark/Scala. 

#### Steps:
1. Load data into HDFS
2. Write scala code. When load input data, [Inferring the schema using reflection](https://spark.apache.org/docs/1.6.1/sql-programming-guide.html), which means convert an RDD into a dataframe for further processing.
3. Use [Dataframe API](https://spark.apache.org/docs/1.6.1/api/scala/index.html#org.apache.spark.sql.DataFrame) to finish code, such as filter, join, groupBy.

#### Things need to pay attention during implementation:
1. Use withColumnRenamed() to rename column after aggregation. (Otherwise col name would be like "sum(weight)")
2. If there is some cols in another dataframe miss when you do join, then need to fill with 0.
3. After processing, use .map(x => x.mkString("\t")) to output as tsv file.

## 3. Pig Program on Amazon AWS
#### Overview:
The goal in this part is to analyze Google books n-grams dataset with pig on AWS, finding 10 bigrams having highest average number of appearances per book. One small dataset(~1G) and one large dataset(~60G).

#### Steps:
1. [Setpu AWS](http://poloclub.gatech.edu/cse6242/2017spring/hw3/AWSSetupGuidelines.pdf)
2. Finish pig code. [Referring to Pig Latin](http://pig.apache.org/docs/r0.16.0/basic.html)
3. Upload data and script into S3, create cluster with EMR on AWS and run script.
4. See log information to debug.

#### Things need to pay attention during implementation:
1. The path in Load and Store command must be cite in single quote, be careful about your editor, it may change the single quote into another special character "`".
2. Output directory cannot exist before execution, which means we need to change it every time.
3. Change data type from int to double only need to add (double) in front of variable.

## 4. hadoop Program on Microsoft Azure
#### Overview:
The task is to run hadoop program on Microsoft Azure. Program is to count all degrees and their frequency, which is similiar to wordcount. But we need to run hadoop job twice since we need to firstly find the degree of each node and secondly to calculat the frequency of each degree.

#### Steps:
1. Setup Azure Account and [create a new cluster](https://docs.microsoft.com/en-us/azure/hdinsight/hdinsight-hadoop-create-linux-clusters-portal).
2. Install Azure CLI and use it to interact with Azure through terminal. Upload data to storage.
3. Compile Hadoop code on local machine and upload jar file through SSH.
4. Run Hadoop program.

#### Things need to pay attention during implementation:
1. Output directory should not exist before execution.
2. In our source code, we use two jobs in main class. The output path of first job should be the input of second job.
3. Remember to delete cluster after finish usage, otherwise it will charge you.
