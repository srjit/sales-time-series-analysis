function areachart(){
  var div = d3.select("body").append("div") 
      .attr("class", "tooltip")       
      .style("opacity", 0);

  var margin = {top: 20, right: 20, bottom: 30, left: 70},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;
  var parseDate = d3.time.format("%Y-%m-%d").parse;
  var x = d3.time.scale()
      .range([0, width]);
  var y = d3.scale.linear()
      .range([height, 0]);
  var color = d3.scale.category20();
  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");
  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
    

  var area = d3.svg.area()
      .x(function(d) { return x(d.date); })
      .y0(function(d) { return y(d.y0); })
      .y1(function(d) { return y(d.y0 + d.y); });

  var stack = d3.layout.stack()
      .values(function(d) { return d.values; });
  var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var size=20;

  d3.csv("https://raw.githubusercontent.com/manaswitha1001/timeseries/master/monthlyaggregate.csv", function(error, data) {
    var keys = d3.keys(data[0]).filter(function(d) {
    return d != "date";
  });
      console.log(data);
    

    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));
    data.forEach(function(d) {
    	d.date = parseDate(d.date);
     // console.log(d.date);
    });
    var browsers = stack(color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          return {date: d.date, y: d[name] * 1};
        })
      };
    }));
    // Find the value of the day with highest total value
    var maxDateVal = d3.max(data, function(d){
      var vals = d3.keys(d).map(function(key){ return key !== "date" ? d[key] : 0 });
      return d3.sum(vals);
    });

    var bisectDate = d3.bisector(function(d) { return d.date; }).left;
    // Set domains for axes
    x.domain(d3.extent(data, function(d) { console.log(d.date); return d.date; }));
    y.domain([0, maxDateVal])


  var browser = svg.append('g')
      .attr("clip-path", "url(#clip)").selectAll(".browser")
        .data(browsers)
      .enter().append("g")
        .attr("class", "browser");
    browser.append("path")
        .attr("class", "area")
        .attr("d", function(d) { return area(d.values); })
        .style("fill", function(d) { return color(d.name); })
        .on("mouseover", function(d,i) { 
          var mouse = d3.mouse(this);
          var mouseDate = x.invert(mouse[0]);
          var i = bisectDate(data, mouseDate);
              div.transition()    
                  .duration(200)    
                  .style("opacity", .9);    
              div .html( d.values[i].date+""+ d.values[i].y)
                  .style("left", (d3.event.pageX) + "px")   
                  .style("top", (d3.event.pageY - 28) + "px");  
              })          
          .on("mouseout", function(d) {   
              div.transition()    
                  .duration(500)    
                  .style("opacity", 1); 
          })
          .on("click", function(d) {
            console.log("Onclick");
            console.log(d.name)});


    browser.append("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.y0 + d.value.y) + ")"; })
        .attr("x", -350)
        .attr("dy", ".40em")
        .text(function(d) { return d.name; });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);


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
          .style("fill", function(d){ return color(d)})
          
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
          .style("alignment-baseline", "middle")});
          //.on("mouseover", highlight)
          //.on("mouseleave", noHighlight)
}

