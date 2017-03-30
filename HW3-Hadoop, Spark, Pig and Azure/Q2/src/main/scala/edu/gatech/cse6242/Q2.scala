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

        // Inferring the Schema Using Reflection (to dataframe)
        val outedge = file.map(_.split("\t")).map(p => (p(0).toInt, p(2).toInt)).toDF("src","outweight")
        val inedge = file.map(_.split("\t")).map(p => (p(1).toInt, p(2).toInt)).toDF("des","inweight")

        val outgoing = outedge.filter("outweight != 1").groupBy("src").agg(sum(outedge("outweight"))).withColumnRenamed("sum(outweight)", "outweight")
        val incoming = inedge.filter("inweight != 1").groupBy("des").agg(sum(inedge("inweight"))).withColumnRenamed("sum(inweight)", "inweight")

        val combination = incoming.as('a).join(outgoing.as('b), $"a.des" === $"b.src","left").select(incoming("des"),(coalesce('inweight, lit(0)) - coalesce('outweight, lit(0))).alias("gross")).na.fill(0)


        //val combination = incoming.join(outgoing.withColumnRenamed("weight", "outweight"), incoming("dec") === outgoing("src"), "outer")
        //val result = combination.select(incoming("des"), incoming("weight") - outgoing("outweight")).alias("node", "weight")

    	// store output on given HDFS path. (save dataframe as tsv file)
    	combination.map(x => x.mkString("\t")).saveAsTextFile("hdfs://localhost:8020" + args(1))
  	}
}
