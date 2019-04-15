function areachart(){
var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

var margin = {top: 20, right: 20, bottom: 30, left: 70},
    width = 670 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y-%m-%d");

  
var x = d3.scaleTime()
    .range([0, width]);
var y = d3.scaleLinear()
    .range([height, 0]);
var color = d3.scaleOrdinal(d3.schemeCategory20);

var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y);


var area = d3.area()
    .x(function(d) { 
      return x(d.data.date); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); });

var svg = d3.select("#viz2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var size=20;


d3.csv("https://raw.githubusercontent.com/srjit/sales-time-series-analysis/master/src/app/data/monthlyaggregate.csv", function(error, data) {
  var keys = data.columns.filter(function(key) { return key !== 'date'; })
  
  
  

  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
  data.forEach(function(d) {
    d.date = parseDate(d.date);
  
  });
  
  var stack = d3.stack().keys(keys);
  // Find the value of the day with highest total value
  var maxDateVal = d3.max(data, function(d){
    var vals = d3.keys(d).map(function(key){ return key !== "date" ? d[key] : 0 });
    return d3.sum(vals);
  });

  var bisectDate = d3.bisector(function(d) { console.log(d.date); return d.date; }).left;
  // Set domains for axes
  x.domain(d3.extent(data, function(d) {  return d.date; }));
  y.domain([0, maxDateVal])



  stack.keys(keys);

  stack.order(d3.stackOrderNone);
  stack.offset(d3.stackOffsetNone);
  
  console.log(stack(data)); 

var browser = svg.selectAll(".browser")
      .data(stack(data))
    .enter().append("g")
      .attr("class", function(d){ return 'browser ' + d.key; }).attr('fill-opacity', 0.5);
  browser.append("path")
      .attr("class", "area")
      .attr("d", area)
      .style("fill", function(d) { return color(d.key); })
      .on("mouseover", function(d,i) { 
        d3.select(this).style('fill-opacity', 0.9);

        var mouse = d3.mouse(this);
        var mouseDate = x.invert(mouse[0]);
        var i = bisectDate(data, mouseDate);
            div.transition()    
                .duration(200)    
                .style("opacity", .9)
                
            div .html(d[i].data.date.toString().slice(0,15)+"value:"+d[i].data[d.key])
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
            })          
        .on("mouseout", function(d) { 
            d3.select(this).style('fill-opacity', 0.5);
            div.transition()    
                .duration(500)    
                .style("opacity", 0.5); 
        })
        .on("click", function(d) {
          var algorithm =$('#predalgorithm').val();
//          console.log(algorithm)
          getForecastData(algorithm,d.key);
          
          });




  browser.append('text')
      .datum(function(d) { return d; })
      .attr('transform', function(d) { return 'translate(' + x(data[11].date) + ',' + y(d[11][1]) + ')'; })
      .attr('x', -50) 
      .attr('dy', '.40em')
      .style("text-anchor", "start")
      .text(function(d) { return d.key; })
      .attr('fill-opacity', 1);

  //add brushing


  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);
    


  svg.append("text")
            .attr("text-anchor", "middle")  
  .attr("transform", "translate("+ (0.6/2 - 55) +","+(height/2)+")rotate(-90)")
  .style("font-size","12px")
  .style("font","Lato")
        .text("Monthly Average Sales(USD)"); 
    
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + 25) + ")")
  .style("text-anchor", "middle")
  .style("font-size","12px")
  .style("font","Lato")
  .text("Date");




var highlight = function(d){
      //console.log(d)
      // reduce opacity of all groups
      //d3.selectAll(".myArea").style("opacity", .1)
      d3.selectAll(".myArea").style("fill", "red")
      // expect the one that is hovered
      d3.select("."+d).style("fill", "black")
    }

    // And when it is not hovered anymore
    var noHighlight = function(d){
      d3.selectAll(".myArea").style("opacity", 1)
    }

// add legend
var size = 10
    svg.selectAll("myrect")
      .data(keys)
      .enter()
      .append("rect")
        .attr("x", 800)
        .attr("y", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("width", size)
        .attr("height", size)
        .style("fill", function(d){ return color(d)}).attr('fill-opacity', 0.5)
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add one dot in the legend for each name.
    svg.selectAll("mylabels")
      .data(keys)
      .enter()
      .append("text")
        .attr("x", 800 + size*1.2)
        .attr("y", function(d,i){ return 10 + i*(size+5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)



 

});

  
}

