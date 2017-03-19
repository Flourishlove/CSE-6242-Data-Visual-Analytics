package edu.gatech.cse6242

import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.apache.spark.SparkConf
import org.apache.spark.sql.SQLContext
import org.apache.spark.sql.functions._

object Q2 {

	def main(args: Array[String]) {
    	val sc = new SparkContext(new SparkConf().setAppName("Q2"))
		val sqlContext = new SQLContext(sc)
		import sqlContext.implicits._

    	// read the file
    	val file = sc.textFile("hdfs://localhost:8020" + args(0))
		/* TODO: Needs to be implemented */

    	// store output on given HDFS path.
    	// YOU NEED TO CHANGE THIS
    	file.saveAsTextFile("hdfs://localhost:8020" + args(1))
  	}
}
