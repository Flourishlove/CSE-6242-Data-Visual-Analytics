var units = "Points";

var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1300 - margin.left - margin.right,
    height = 1300 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3.scale.category20();

// append the svg canvas to the page
var svg = d3.select("Body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width, height]);

var path = sankey.link();

// load the data
d3.queue()
    .defer(d3.csv, 'teams.csv')
    .defer(d3.csv, 'races.csv')
    .await(processData);

function processData(error, data_teams, data_races) {
    // do something with the data
    //console.log("CSV1", data_teams);
    //console.log("CSV2", data_races);

    var links = [];
    var nodes = [];

    var group_race = d3.nest()
      .key(function(d) { return d.race; })
      .rollup(function(v) { return d3.sum(v, function(d) { return d.points; }); })
      .entries(data_races);

    var group_driver = d3.nest()
      .key(function(d) { return d.driver; })
      .rollup(function(v) { return d3.sum(v, function(d) { return d.points; }); })
      .entries(data_races);

    var group_team = d3.nest()
      .key(function(d) { return d.team; })
      .rollup(function(v) { return d3.sum(v, function(d) { return d.points; }); })
      .entries(data_teams);

    var index = 0;
    group_race.forEach(function(d){
      nodes.push({"node": index, "name": d.key});
      index++;
    });
    group_driver.forEach(function(d){
      nodes.push({"node": index, "name": d.key});
      index++;
    });
    group_team.forEach(function(d){
      nodes.push({"node": index, "name": d.key});
      index++;
    });

    data_races.forEach(function(d){
      d.points = +d.points;
      links.push({"source":d.race, "target":d.driver, "value":d.points});
    });
    data_teams.forEach(function(d){
      d.points = +d.points;
      links.push({"source":d.driver, "target":d.team, "value":d.points});
    });

    nodes.forEach(function(nd){
      links.forEach(function(ld){
        if(ld.source === nd.name) ld.source = nd.node;
        if(ld.target === nd.name) ld.target = nd.node;
      });
    });

  sankey
      .nodes(nodes)
      .links(links)
      .layout(32);

// add in the links
  var link = svg.append("g").selectAll(".link")
      .data(links)
    .enter().append("path")
      .attr("class", "link")
      .attr("d", path)
      .style("stroke-width", function(d) { return Math.max(1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; });

// add the link titles
  var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return "<strong> <span style='color:black'></strong>" + d.source.name + " → " +
                d.target.name + "\n" + format(d.value) + "</span>";
    });

  svg.call(tip);
  link.on('mouseover', tip.show)
      .on('mouseout', tip.hide);
// add in the nodes
  var node = svg.append("g").selectAll(".node")
      .data(nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")"; })
    .call(d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", function() {
          this.parentNode.appendChild(this); })
      .on("drag", dragmove));

// add the rectangles for the nodes
  node.append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) {
          return d.color = color(d.name.replace(/ .*/, "")); })
      .style("stroke", function(d) {
          return d3.rgb(d.color).darker(2); })
    .append("title")
      .text(function(d) {
          return d.name + "\n" + format(d.value); });

// add in the title for the nodes
  node.append("text")
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d) { return d.name; })
    .filter(function(d) { return d.x < width / 2; })
      .attr("x", 6 + sankey.nodeWidth())
      .attr("text-anchor", "start");

// the function for moving the nodes
  function dragmove(d) {
    d3.select(this).attr("transform",
        "translate(" + d.x + "," + (
                d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
            ) + ")");
    sankey.relayout();
    link.attr("d", path);
  }
};