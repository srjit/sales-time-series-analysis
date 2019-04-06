


function displayData() {

	var maxDep = document.getElementById("maxDepth").value;
	var lr = document.getElementById("learningRate").value;
	var n = document.getElementById("nEstimators").value;

	var url = "http://127.0.0.1:5000/"+maxDep+"/"+lr+"/"+n;
	console.log(url);

	var parseDate = d3.timeParse("%Y-%m-%d");

	var div = d3.select("body").append("div");

	d3.json(url, function(error, data) {

		if (error) return console.warn(error);
	    console.log(data);

	    var st = pieChart();
	    console.log(st);

	    var margin = { top: 20, right: 20, bottom: 50, left: 50 };
		var width = 920 - margin.left - margin.right;
    	var height = 620 - margin.top - margin.bottom;
	
		var xScale = d3.scaleTime()
		  .range([margin.left, width-margin.right]);
	
		var yScale = d3.scaleLinear()
		  .domain([0,200000])
		  .range([height-margin.bottom, margin.top]);

		// Chart-1
		var	chart1 = d3.select("body")
			.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var dataCV1 = JSON.parse(data[0].df_cv_0);
		
	    dataCV1.forEach(function(d) { 
	    	d.Date = parseDate(d.Date);
	    	d.Store = d.Store;
	    	d.Y_actual += d.Y_actual;
	    	d.Y_pred += d.Y_pred;
	    });

	    xScale.domain(d3.extent(dataCV1, function(d) { return d.Date; }));
  		yScale.domain([0, d3.max(dataCV1, function(d) { return d.Y_actual; })]);

		chart1.append("g")
		  .attr("transform", `translate(0, ${height-margin.bottom})`)
		  .call(d3.axisBottom().scale(xScale));
	
		chart1.append("g")
		  .attr("transform", `translate(${margin.left},0)`)
		  .call(d3.axisLeft().scale(yScale));
		
	    var line1 = d3.line()
					.x(function(d) { return xScale(d.Date); })
					.y(function(d) { return yScale(d.Y_actual); });	

		var line2 = d3.line()
					.x(function(d) { return xScale(d.Date); })
					.y(function(d) { return yScale(d.Y_pred); });	

	    chart1.append("path")
				      .datum(dataCV1.filter(function(d) { return d.Store == "Baltimore" }))
			    		.attr("d", line1)
			    		.attr("class", "path")
			    		.attr("fill", "none")
						.attr("stroke", "steelblue")
						.attr("stroke-width", 2.5)	
						.on("mouseover", function(d) {	
             				div.transition()		
                			.duration(200)		
                			.style("opacity", 0.9);	
             				div.html([d.Y_actual])	
                			.style("left", (d3.event.pageX) + "px")		
                			.style("top", (d3.event.pageY - 28) + "px");
             			});	

	    chart1.append("path")
				      .datum(dataCV1.filter(function(d) { return d.Store == "Baltimore" }))
			    		.attr("d", line2)
			    		.attr("class", "path")
			    		.attr("fill", "none")
						.attr("stroke", "tomato")
						.attr("stroke-width", 2.5); 

		chart1.append("text")
    	    .attr("text-anchor", "middle")  
    	    .attr("transform", "translate("+ (margin.left/50) +","+(height/2)+")rotate(-90)")  
    	    .style("font-size", "20px") 
    	    .text("Sales");
	
    	chart1.append("text")
    	    .attr("text-anchor", "middle")  
    	    .attr("transform", "translate("+ (width/2) +","+(height-margin.bottom/5)+")")  
    	    .style("font-size", "20px") 
    	    .text("Date");       
	
		chart1.append("text")
    	 	.attr("transform", "translate("+ (width/2) + "," +((margin.top/5))+")")
    	    .attr("text-anchor", "middle")  
    	    .style("font-size", "20px") 
    	    .text("Sales Prediction CV1 - Actual vs Predicted");


		// Chart-2
		var	chart2 = d3.select("body")
			.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var dataCV2 = JSON.parse(data[0].df_cv_1);
		
	    dataCV2.forEach(function(d) { 
	    	d.Date = parseDate(d.Date);
	    	d.Store = d.Store;
	    	d.Y_actual += d.Y_actual;
	    	d.Y_pred += d.Y_pred;
	    });


	    xScale.domain(d3.extent(dataCV2, function(d) { return d.Date; }));
  		yScale.domain([0, d3.max(dataCV2, function(d) { return d.Y_actual; })]);

  		chart2.append("g")
		  .attr("transform", `translate(0, ${height-margin.bottom})`)
		  .call(d3.axisBottom().scale(xScale));
	
		chart2.append("g")
		  .attr("transform", `translate(${margin.left},0)`)
		  .call(d3.axisLeft().scale(yScale));

		chart2.append("path")
				      .datum(dataCV2)
			    		.attr("d", line1)
			    		.attr("class", "path")
			    		.attr("fill", "none")
						.attr("stroke", "steelblue")
						.attr("stroke-width", 2.5); 

		chart2.append("path")
				      .datum(dataCV2)
			    		.attr("d", line2)
			    		.attr("class", "path")
			    		.attr("fill", "none")
						.attr("stroke", "tomato")
						.attr("stroke-width", 2.5);

		chart2.append("text")
    	    .attr("text-anchor", "middle")  
    	    .attr("transform", "translate("+ (margin.left/50) +","+(height/2)+")rotate(-90)")  
    	    .style("font-size", "20px") 
    	    .text("Sales");
	
    	chart2.append("text")
    	    .attr("text-anchor", "middle")  
    	    .attr("transform", "translate("+ (width/2) +","+(height-margin.bottom/5)+")")  
    	    .style("font-size", "20px") 
    	    .text("Date");       
	
		chart2.append("text")
    	 	.attr("transform", "translate("+ (width/2) + "," +((margin.top/5))+")")
    	    .attr("text-anchor", "middle")  
    	    .style("font-size", "20px") 
    	    .text("Sales Prediction CV2 - Actual vs Predicted");


		// Chart-3
		var	chart3 = d3.select("body")
			.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var dataCV3 = JSON.parse(data[0].df_cv_2);
		
	    dataCV3.forEach(function(d) { 
	    	d.Date = parseDate(d.Date);
	    	d.Store = d.Store;
	    	d.Y_actual += d.Y_actual;
	    	d.Y_pred += d.Y_pred;
	    });


	    xScale.domain(d3.extent(dataCV3, function(d) { return d.Date; }));
  		yScale.domain([0, d3.max(dataCV3, function(d) { return d.Y_actual; })]);

  		chart3.append("g")
		  .attr("transform", `translate(0, ${height-margin.bottom})`)
		  .call(d3.axisBottom().scale(xScale));
	
		chart3.append("g")
		  .attr("transform", `translate(${margin.left},0)`)
		  .call(d3.axisLeft().scale(yScale));

		chart3.append("path")
				      .datum(dataCV3)
			    		.attr("d", line1)
			    		.attr("class", "path")
			    		.attr("fill", "none")
						.attr("stroke", "steelblue")
						.attr("stroke-width", 2.5); 

		chart3.append("path")
				      .datum(dataCV3)
			    		.attr("d", line2)
			    		.attr("class", "path")
			    		.attr("fill", "none")
						.attr("stroke", "tomato")
						.attr("stroke-width", 2.5);		

		chart3.append("text")
    	    .attr("text-anchor", "middle")  
    	    .attr("transform", "translate("+ (margin.left/50) +","+(height/2)+")rotate(-90)")  
    	    .style("font-size", "20px") 
    	    .text("Sales");
	
    	chart3.append("text")
    	    .attr("text-anchor", "middle")  
    	    .attr("transform", "translate("+ (width/2) +","+(height-margin.bottom/5)+")")  
    	    .style("font-size", "20px") 
    	    .text("Date");       
	
		chart3.append("text")
    	 	.attr("transform", "translate("+ (width/2) + "," +((margin.top/5))+")")
    	    .attr("text-anchor", "middle")  
    	    .style("font-size", "20px") 
    	    .text("Sales Prediction CV3 - Actual vs Predicted");
				
	});

}


function pieChart() {

	var dataP = [
		{Store: "Baltimore", Sales: 70236.34},
		{Store: "Columbus", Sales: 75203.59},
		{Store: "Detroit", Sales: 77264.70},
		{Store: "Lancaster", Sales: 87345.87},
		{Store: "Louisville", Sales: 93314.04},
		{Store: "Philadelphia", Sales: 72883.83},
		{Store: "Portland", Sales: 78264.56},
		{Store: "Richmond", Sales: 62238.27},
		{Store: "San Antonio", Sales: 78801.99},
		{Store: "Savannah", Sales: 89789.60}
	];

	dataP.forEach(function(d) { 
	    	d.Store = d.Store;
	    	d.Sales += d.Sales;
	    });

	console.log(dataP);

	var text = "";

	var width = 960,
    	height = 500,
    	thickness = 40,
    	duration = 750,
    	radius = Math.min(width, height) / 2;

	var color = d3.scaleOrdinal(d3.schemeCategory10);

    var arc = d3.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(radius - 90);
	
	var labelArc = d3.arc()
	    .outerRadius(radius - thickness)
	    .innerRadius(radius - thickness);
	
	var pie = d3.pie()
	    .sort(null)
	    .value(function(d) { return d.Sales; });
	
	var chartPie = d3.select("body").append("svg")
		.attr("class", "chartPie")
	    .attr("width", width)
	    .attr("height", height)
	  .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
	
	var g = chartPie.selectAll(".arc")
	    .data(pie(dataP))
	    .enter()
	    .append("g")
	    .on("mouseover", function(d, i) {
	      let g = d3.select(this).attr("fill-opacity", 0.7)
	        .style("cursor", "pointer")
	        .append("g")
	        .attr("class", "text-group")

	 
	      g.append("text")
	        .attr("class", "name-text")
	        .text(`${dataP[i].Store}`)
	        .attr('text-anchor', 'middle')
	        .attr('dy', '-1.2em');
	  
	      g.append("text")
	        .attr("class", "value-text")
	        .text(`${dataP[i].Sales}`)
	        .attr('text-anchor', 'middle')
	        .attr('dy', '.10em');
	    })
	  .on("mouseout", function(d) {
	      d3.select(this).attr("fill-opacity", "none")
	        .style("cursor", "none")  
	        .style("fill", color(this._current))
	        .select(".text-group").remove();
	    });
	
	g.append("path")
      	.attr("d", arc)
      	.style("fill", function(d,i) { return color(i); })
      	.on("mouseover", function(d) {
	      d3.select(this)     
	        .style("cursor", "pointer")
	        .style("fill", "black");
	    })
	  	.on("mouseout", function(d) {
	      d3.select(this)
	        .style("cursor", "none")  
	        .style("fill", color(this._current));
	    })
	  	.each(function(d, i) { this._current = i; })
	  	.on("click", function(d, i) { 
	  		var s = dataP[i].Store; 
	  		// console.log(s);
	  		return s;
	  	});


  	g.append('text')
 	 	.attr('text-anchor', 'middle')
 	 	.attr('font-family', 'Verdana')
  		.attr('fill', '#888')
 	 	.attr('dy', '.35em')
 	 	.text(text);

}


