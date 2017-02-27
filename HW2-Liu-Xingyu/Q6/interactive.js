var margin = {top: 80, right: 180, bottom: 80, left: 180},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var data = [{product:'Product A',freq:{Q1:576, Q2:1176, Q3:1009, Q4:494}},
{product:'Product B',freq:{Q1:959, Q2:1653, Q3:1999, Q4:697}},
{product:'Product C',freq:{Q1:3210, Q2:4220, Q3:1648, Q4:919}},
{product:'Product D',freq:{Q1:589, Q2:2043, Q3:1153, Q4:911}},
{product:'Product E',freq:{Q1:2599, Q2:1333, Q3:818, Q4:1713}},
{product:'Product F',freq:{Q1:431, Q2:324, Q3:715, Q4:421}},
{product:'Product G',freq:{Q1:1457, Q2:2557, Q3:2245, Q4:762}},
{product:'Product H',freq:{Q1:2573, Q2:3357, Q3:1598, Q4:1287}}];

console.log(data.length);
var padding = 8;

var x = d3.scale.linear()
    .domain([0, d3.max(data, function(d){
        return (d.freq.Q1 + d.freq.Q2 + d.freq.Q3 + d.freq.Q4);
    })])
    .range([0, width-150]);

var y = d3.scale.ordinal()
    .domain(data.map(function(d){ return d.product;}))
    .rangeBands([height,0]);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

svg.selectAll("rectangle")
    .data(data)
    .enter()
    .append("rect")
    .attr("class","rectangle")
    .attr("value", function(d, i){
        return i;
    })
    .attr("width", height/data.length - padding)
    .attr("height", function(d){
        return x(d.freq.Q1 + d.freq.Q2 + d.freq.Q3 + d.freq.Q4);
    })
    .attr("y", 0)
    .attr("x", function(d, i){
        return -(height / data.length) * (i+1);
    })
    .attr("transform", "rotate(-90)" )
    .on("mouseover", function(d){
        console.log(data[d3.select(this).attr("value")]);
        tempdata = [];
        tempaxis = ["Q1","Q2","Q3","Q4"];
        tempdata.push(data[d3.select(this).attr("value")].freq.Q1);
        tempdata.push(data[d3.select(this).attr("value")].freq.Q2);
        tempdata.push(data[d3.select(this).attr("value")].freq.Q3);
        tempdata.push(data[d3.select(this).attr("value")].freq.Q4);
        console.log(tempdata);

        svg.append("g")
        .attr("class","forDele")
        .selectAll("temprect")
        .data(tempdata)
        .enter()
        .append("rect")
        .attr("class","temprect")
        .attr("width", 20)
        .attr("height", function(d){
            return x(d);
        })
        .attr("x", function(d, i){
            return -22 * (i+1);
        })
        .attr("y", width-100)
        .attr("transform", "rotate(-90)" );

        svg.append("g")
        .attr("class","forDeletext")
        .selectAll("text")
        .data(tempdata)
        .enter()
        .append("text")
        .text(function(d,i){
            return "Q" + (i+1) + " $ " + d;
        })
        .attr("x", width-115)
        .attr("y", function(d, i){
            return 22 * (i+1) - 3;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black");

    })
    .on("mouseout", function(d){
        svg.select(".forDele").remove();
        svg.select(".forDeletext").remove();
    });

svg.append("g") //have to append <g> before append <text>
    .selectAll("text")
    .data(data)
    .enter()
    .append("text")
    .text(function(d){
        return "$ " + (d.freq.Q1 + d.freq.Q2 + d.freq.Q3 + d.freq.Q4);
    })
    .attr("x", 15)
    .attr("y", function(d, i){
        return (height / data.length) * (i+1) - (height/data.length - padding)/2;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "15px")
    .attr("fill", "white");

