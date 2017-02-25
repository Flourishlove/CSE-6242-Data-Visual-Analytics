var margin = {top: 20, right: 90, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

var padding = 5;

var parseYear = d3.time.format("%Y").parse,
    parseMonth = d3.time.format("%-m").parse,
    formatDate = d3.time.format("%b");

var x = d3.scale.linear().range([50, width-50]),
    y = d3.scale.linear().range([height-40, 50]),
    z = d3.scale.linear().range(["papayawhip", "red"]);

// The size of the buckets in the CSV data file.
// This could be inferred from the data if it weren't sparse.
var xStep = 1,
    yStep = 1;

var selectbox = d3.select('body')
  .append('div')
  .append('select')
    .attr('class','select')

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("heatmap.csv", function(error, buckets) {
  if (error) throw error;

  // Coerce the CSV data to the appropriate types.
  buckets.forEach(function(d) {
    d.Zip_Code = +d.Zip_Code;
    d.Month = +d.Month;
    d.Year = +d.Year;
    d.Power = +d.Power;
  });

  // Compute the scale domains.
  x.domain([d3.min(buckets, function(d) { return d.Month; }), d3.max(buckets, function(d) { return d.Month; })]);
  y.domain(d3.extent(buckets, function(d) { return d.Year; }));
  z.domain([0, d3.max(buckets, function(d) { return d.Power; })]);

  selectbox.on('change',onchange);

  var options = selectbox
  .selectAll('option')
  .data(d3.map(buckets, function(d){return d.Zip_Code;}).keys()).enter()
  .append('option')
  .attr('value', function (d) { return d; })
  .property("selected", function(d){ return d == 90077; })
    .text(function (d) { return d; });

  svg.selectAll(".tile")
      .data(buckets.filter(function(d) { return d.Zip_Code == 90077; }))
      .enter().append("rect")
      .attr("class", "tile")
      .attr("x", function(d) { return x(d.Month - 0.5); })
      .attr("y", function(d) { return y(d.Year + 0.5); })
      .attr("width", x(xStep) - x(0) - padding)
      .attr("height",  y(0) - y(yStep) - padding)
      .style("fill", function(d) {
        return z(d.Power);
      } );

  function onchange() {
    selectValue = d3.select(this).property('value');
    var cards = svg.selectAll(".tile")
      .data(buckets.filter(function(d) { return d.Zip_Code == selectValue; }));

    cards.transition().duration(500)
      .style("fill", function(d) { return z(d.Power)} );
  };

  // Add a legend for the color values.
  var legend = svg.selectAll(".legend")
      .data(z.ticks(6).slice(1).reverse())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + (width + 20) + "," + (20 + i * 20) + ")"; });

  legend.append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .style("fill", z);

  legend.append("text")
      .attr("x", 26)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text(String);

  svg.append("text")
      .attr("class", "label")
      .attr("x", width + 20)
      .attr("y", 10)
      .attr("dy", ".35em")
      .text("kWh");

  // Add an x-axis with label.
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.svg.axis().scale(x).orient("bottom"))
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .attr("text-anchor", "end")
      .text("Month");

  // Add a y-axis with label.
  svg.append("g")
      .attr("class", "y axis")
      //.attr("transform", "translate(" + padding + ",0)")
      .call(d3.svg.axis().scale(y).orient("left"))
    .append("text")
      .attr("class", "label")
      .attr("y", 6)
      .attr("dy", ".71em")
      .attr("text-anchor", "end")
      .text("Year");

});

