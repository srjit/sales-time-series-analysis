/**function drawSimpleChart(data){

    //var data = JSON.parse(data)

    
     * Transform the data here
     
    var data = [{x: "A", y: 3},
		{x: "B", y: 2},
		{x: "C", y: 7},
		{x: "D", y: 10},
		{x: "E", y: 12},
		{x: "F", y: 9}]
    
    var width = 500;
    var height = 500;

    var margin = {
	top: 25,
	left: 25,
	right: 25,
	bottom: 25
    };

    var svg = d3.select("div#viz1")
	.append("svg")
	.attr("width", width)
	.attr("height", height);



    var xScale = d3.scaleBand()
	.domain(["A","B","C","D","E","F"])
	.rangeRound([margin.left, width-margin.right])
	.padding(0.5);

    var yScale = d3.scaleLinear()
	.domain([0,12])
	.range([height-margin.bottom, margin.top]);


    var xAxis = svg.append("g")
	.attr("transform", `translate(0, ${height-margin.bottom})`)
	.call(d3.axisBottom().scale(xScale));

    var yAxis = svg.append("g")
	.attr("transform", `translate(${margin.left},0)`)
	.call(d3.axisLeft().scale(yScale));



    var bar = svg.selectAll("rect") 
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d) { return xScale(d.x); })
        .attr("y", function(d) { return yScale(d.y); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height-margin.bottom-yScale(d.y); })
        .attr("fill", "Tomato")
        .attr("stroke", "Black")
        .attr("stroke-width", 3)	  
    
}
*/