var margin = {top: 80, right: 180, bottom: 80, left: 180},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)

var path = d3.geo.path();

var legend_labels = ["$10000", "$15000", "$20000", "$25000", "$30000", "$35000"];
var color = d3.scale.threshold()
    .domain([10000, 15000, 20000, 25000, 30000, 35000])
    .range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"]);

d3.queue()
    .defer(d3.json, "us.json")
    .defer(d3.csv, "sat_scores.csv")
    .defer(d3.json, "median_earnings.json")
    .await(processData);

function processData(error, us, sat, earning) {
  if (error) throw error;

  var earningById = [];
  earning.forEach(function(d) { earningById[+d.id] = +d.median_earnings; });  //js use array can access index directly

  //add in tooltip
  var tip = d3.tip()
    //.data(sat.filter(sat.id == ))
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      var temparray = [];
      sat.forEach(function(da){
        if(d.id == da.id) temparray.push({"name":da.name, "sat_avg":+da.sat_avg});
      });
      temparray.sort(function(a, b) {
                   return parseFloat(b.sat_avg) - parseFloat(a.sat_avg);
                 });
      var result = "";
      //some states doesn't have 5 colleges
      for(i = 0; i < (5 < temparray.length ? 5 : temparray.length); i++){
        result = result + "<p><strong> <span style='color:brown'>" + temparray[i].name + " (SAT: " +
                temparray[i].sat_avg + ")" + "</span></strong></p>";
      }
      var foo = "Bob\nis\ncool.";
      //console.log(result);
      return result;
    });

  svg.call(tip);

  svg.append("g")
      .attr("class", "counties")
    .selectAll("path")
      .data(topojson.feature(us, us.objects.states).features) //here use state not counties
    .enter().append("path")
      .attr("fill", function(d) {
        return color(earningById[d.id]);
      })
      .attr("d", path)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a.id !== b.id; }))
      .attr("class", "states")
      .attr("d", path);

  var legend = svg.selectAll("g.legend")
  .data([10000, 15000, 20000, 25000, 30000, 35000])
  .enter().append("g")
  .attr("class", "legend");

  var ls_w = 20, ls_h = 20;

  legend.append("rect")
  .attr("x", width+margin.left+margin.right-50)
  .attr("y", function(d, i){ return height - (i*ls_h) - 2*ls_h;})
  .attr("width", ls_w)
  .attr("height", ls_h)
  .style("fill", function(d, i) { return color(d); })
  .style("opacity", 0.8);

  legend.append("text")
  .attr("x", width+margin.left+margin.right-110)
  .attr("y", function(d, i){ return height - (i*ls_h) - ls_h - 4;})
  .text(function(d, i){ return legend_labels[i]; });

}