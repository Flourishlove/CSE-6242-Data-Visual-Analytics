var width = 800;
var height = 600;
var color = ["red", "blue", "green"];

//Create SVG element
var svg = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

var svg2 = d3.select("body")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

var xScale = d3.scale.linear().range([50, width-50]);
var yScale = d3.scale.linear().range([height-50, 50]);
var xlogScale = d3.scale.log().base(Math.E).range([50, width-50]);
var ylogScale = d3.scale.log().base(Math.E).range([height-50, 50]);

d3.tsv("data.tsv", function(error, data) {
  if (error) throw error;
  // Coerce the data to numbers.
  data.forEach(function(d) {
    d.Distribution = +d.Distribution;
    d.BodyMass = +d.BodyMass;
  });

  xScale.domain([0, d3.max(data, function(d) { return d.BodyMass; })]);
  yScale.domain([0, d3.max(data, function(d) { return d.Distribution; })]);
  xlogScale.domain([0.1, 20000]);
  ylogScale.domain([0.1, 4]);

  var padding = 50
  // Add the x-axis.
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(d3.svg.axis().scale(xScale).orient("bottom").ticks(5));
  svg2.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (height - padding) + ")")
      .call(d3.svg.axis().scale(xlogScale).orient("bottom").ticks(5));

  // Add the y-axis.
  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(d3.svg.axis().scale(yScale).orient("left").ticks(10));
  svg2.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(d3.svg.axis().scale(ylogScale).orient("left").ticks(10));

  svg.selectAll("circle")
    .data(data.filter(function(d) { return d.Species === "Lagomorpha"; }))
    .enter()
    .append("circle")
    .attr("r", 3.5)
    .attr("cx", function(d) {
        return xScale(d.BodyMass);
    })
    .attr("cy", function(d) {
        return yScale(d.Distribution);
    });
  svg2.selectAll("circle")
    .data(data.filter(function(d) { return d.Species === "Lagomorpha"; }))
    .enter()
    .append("circle")
    .attr("r", 3.5)
    .attr("cx", function(d) {
        return xlogScale(d.BodyMass);
    })
    .attr("cy", function(d) {
        return ylogScale(d.Distribution);
    });

  svg.selectAll(".square")
    .data(data.filter(function(d) { return d.Species === "Didelphimorphia"; }))
    .enter()
    .append("rect")
    .attr("class", "square")
    .attr("width", 4)
    .attr("height", 4)
    .attr("x", function(d) {
        return xScale(d.BodyMass);
    })
    .attr("y", function(d) {
        return yScale(d.Distribution);
    });
  svg2.selectAll(".square")
    .data(data.filter(function(d) { return d.Species === "Didelphimorphia"; }))
    .enter()
    .append("rect")
    .attr("class", "square")
    .attr("width", 4)
    .attr("height", 4)
    .attr("x", function(d) {
        return xlogScale(d.BodyMass);
    })
    .attr("y", function(d) {
        return ylogScale(d.Distribution);
    });

  svg.selectAll(".triangle")
    .data(data.filter(function(d) { return d.Species === "Dasyuromorphia"; }))
    .enter()
    .append("path")
    .attr("class", "triangle")
    .attr("d", d3.svg.symbol().type("triangle-up").size(10))
    .attr("transform", function(d) { return "translate(" + xScale(d.BodyMass) + "," + yScale(d.Distribution) + ")"; });
  svg2.selectAll(".triangle")
    .data(data.filter(function(d) { return d.Species === "Dasyuromorphia"; }))
    .enter()
    .append("path")
    .attr("class", "triangle")
    .attr("d", d3.svg.symbol().type("triangle-up").size(10))
    .attr("transform", function(d) { return "translate(" + xlogScale(d.BodyMass) + "," + ylogScale(d.Distribution) + ")"; });

  var legend = svg.selectAll(".legend")
      .data(color)
    .enter().append("g")
      .attr("class", "legend")
  var legend2 = svg2.selectAll(".legend")
      .data(color)
    .enter().append("g")
      .attr("class", "legend")

  legend.filter(function(d){ return d === "red"; })
        .append("circle")
        .attr("r", 4)
        .attr("cx", width - 18)
        .attr("cy", 200);
  legend2.filter(function(d){ return d === "red"; })
        .append("circle")
        .attr("r", 4)
        .attr("cx", width - 18)
        .attr("cy", 200);

  legend.filter(function(d){ return d === "blue"; })
        .append("rect")
        .attr("class", "square")
        .attr("width", 7)
        .attr("height", 7)
        .attr("x", width - 22)
        .attr("y", 215)
        .style("fill", color);
  legend2.filter(function(d){ return d === "blue"; })
        .append("rect")
        .attr("class", "square")
        .attr("width", 7)
        .attr("height", 7)
        .attr("x", width - 22)
        .attr("y", 215)
        .style("fill", color);

  legend.filter(function(d){ return d === "green"; })
        .append("path")
        .attr("class", "triangle")
        .attr("d", d3.svg.symbol().type("triangle-up").size(15))
        .attr("transform", function() { return "translate(" + (width - 18) + "," + 235 + ")"; });
  legend2.filter(function(d){ return d === "green"; })
        .append("path")
        .attr("class", "triangle")
        .attr("d", d3.svg.symbol().type("triangle-up").size(15))
        .attr("transform", function() { return "translate(" + (width - 18) + "," + 235 + ")"; });

  //add legend text
  legend.append("text")
      .attr("x", width - 28)
      .attr("y", function(d) {
        if(d === "red") return 200;
        else if(d === "blue") return 218;
        else return 235;
      })
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {
        if(d === "red") return "Lagomorpha";
        else if(d === "blue") return "Didelphimorphia";
        else return "Dasyuromorphia";
  })
  legend2.append("text")
      .attr("x", width - 28)
      .attr("y", function(d) {
        if(d === "red") return 200;
        else if(d === "blue") return 218;
        else return 235;
      })
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {
        if(d === "red") return "Lagomorpha";
        else if(d === "blue") return "Didelphimorphia";
        else return "Dasyuromorphia";
  })

  svg.append("text")
        .attr("x", width - 200)
        .attr("y", height-70)
        .text("Body Mass");
  svg2.append("text")
        .attr("x", width - 200)
        .attr("y", height-70)
        .text("Body Mass");

  svg.append("text")
        .attr("transform", "translate(80,150)rotate(-90)" )
        .text("Distribution");
  svg2.append("text")
        .attr("transform", "translate(80,150)rotate(-90)" )
        .text("Distribution");

});

