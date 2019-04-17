function displayData(data) {

	var margin = { top: 20, right: 20, bottom: 40, left: 50 };
	var width = 470 - margin.left - margin.right;
    var height = 680 - margin.top - margin.bottom;
    var gap = 10;

    data = JSON.parse(data);

	var parseDate = d3.timeParse("%Y-%m-%d");

	var svg = d3.select("div#viz1")
    		.append("svg")
    		.attr("class", "mainsvg")
    		.attr("height", height)
    		.attr("width", width*3 + gap)

    // SVG for Piechart
    var pieWidth = width+20;
	var pieChart = d3.select(".mainsvg")
	    	 .append("svg")
	    	 .attr("class", "piechart")
	    	 .attr("height", height)
	    	 .attr("width", pieWidth)

	// SVG for Line chart
	var lineWidth = width*2-20;
	var lineChart = d3.select(".mainsvg")
	    	 .append("g")
	    	   .attr("transform", "translate(" + (width+20+gap) + ")")
	    	   .append("svg")
	    	   .attr("class", "linechart")
	    	   .attr("height", height)
	    	   .attr("width", lineWidth)
	
	var xScale = d3.scaleTime()
	  .range([margin.left+40, lineWidth-20]);
	
	var yScale = d3.scaleLinear()
	  .domain([0,200000])
	  .range([height/3-margin.bottom, margin.top]);

	// Chart-1
	var dataCV1 = JSON.parse(data[0].df_cv_0);
	console.log(dataCV1);
	
	dataCV1.forEach(function(d) { 
		d.Date = parseDate(d.Date);
		d.Store = d.Store;
		d.Y_actual += d.Y_actual;
		d.Y_pred += d.Y_pred;
	});

	xScale.domain(d3.extent(dataCV1, function(d) { return d.Date; }));
  	yScale.domain([0, d3.max(dataCV1, function(d) { return d.Y_actual; })]);

	lineChart.append("g")
	  .attr("transform", `translate(0, ${height/3-margin.bottom})`)
	  .call(d3.axisBottom().scale(xScale));
	
	lineChart.append("g")
	  .attr("transform", `translate(${margin.left+40},0)`)
	  .call(d3.axisLeft().scale(yScale));
	
	var line1 = d3.line()
				.x(function(d) { return xScale(d.Date); })
				.y(function(d) { return yScale(d.Y_actual); });	

	var line2 = d3.line()
				.x(function(d) { return xScale(d.Date); })
				.y(function(d) { return yScale(d.Y_pred); });	

	lineChart.append("path")
			      .datum(dataCV1.filter(function(d) { return d.Store == "Baltimore" }))
		    		.attr("d", line1)
		    		.attr("class", "path1")
		    		.attr("fill", "none")
					.attr("stroke", "steelblue")
					.attr("stroke-width", 2.5)		

	lineChart.append("path")
			      .datum(dataCV1.filter(function(d) { return d.Store == "Baltimore" }))
		    		.attr("d", line2)
		    		.attr("class", "path1")
		    		.attr("fill", "none")
					.attr("stroke", "tomato")
					.attr("stroke-width", 2.5); 


	// Chart-2
	var dataCV2 = JSON.parse(data[0].df_cv_1);
	
	dataCV2.forEach(function(d) { 
		d.Date = parseDate(d.Date);
		d.Store = d.Store;
		d.Y_actual += d.Y_actual;
		d.Y_pred += d.Y_pred;
	});

	var yScale = d3.scaleLinear()
	  .domain([0,200000])
	  .range([2*height/3-margin.bottom, height/3+margin.top]);

	xScale.domain(d3.extent(dataCV2, function(d) { return d.Date; }));
  	yScale.domain([0, d3.max(dataCV2, function(d) { return d.Y_actual; })]);

  	lineChart.append("g")
	  .attr("transform", `translate(0, ${2*height/3-margin.bottom})`)
	  .call(d3.axisBottom().scale(xScale));
	
	lineChart.append("g")
	  .attr("transform", `translate(${margin.left+40},0)`)
	  .call(d3.axisLeft().scale(yScale));

	lineChart.append("path")
			      .datum(dataCV2.filter(function(d) { return d.Store == "Baltimore" }))
		    		.attr("d", line1)
		    		.attr("class", "path2")
		    		.attr("fill", "none")
					.attr("stroke", "steelblue")
					.attr("stroke-width", 2.5); 

	lineChart.append("path")
			      .datum(dataCV2.filter(function(d) { return d.Store == "Baltimore" }))
		    		.attr("d", line2)
		    		.attr("class", "path2")
		    		.attr("fill", "none")
					.attr("stroke", "tomato")
					.attr("stroke-width", 2.5);

	// Chart-3
	var dataCV3 = JSON.parse(data[0].df_cv_2);
	
	dataCV3.forEach(function(d) { 
		d.Date = parseDate(d.Date);
		d.Store = d.Store;
		d.Y_actual += d.Y_actual;
		d.Y_pred += d.Y_pred;
	});

	var yScale = d3.scaleLinear()
	  .domain([0,200000])
	  .range([height-margin.bottom, 2*height/3+margin.top]);

	xScale.domain(d3.extent(dataCV3, function(d) { return d.Date; }));
  	yScale.domain([0, d3.max(dataCV3, function(d) { return d.Y_actual; })]);

  	lineChart.append("g")
	  .attr("transform", `translate(0, ${height-margin.bottom})`)
	  .call(d3.axisBottom().scale(xScale));
	
	lineChart.append("g")
	  .attr("transform", `translate(${margin.left+40},0)`)
	  .call(d3.axisLeft().scale(yScale));

	lineChart.append("path")
			      .datum(dataCV3.filter(function(d) { return d.Store == "Baltimore" }))
		    		.attr("d", line1)
		    		.attr("class", "path3")
		    		.attr("fill", "none")
					.attr("stroke", "steelblue")
					.attr("stroke-width", 2.5); 

	lineChart.append("path")
			      .datum(dataCV3.filter(function(d) { return d.Store == "Baltimore" }))
		    		.attr("d", line2)
		    		.attr("class", "path3")
		    		.attr("fill", "none")
					.attr("stroke", "tomato")
					.attr("stroke-width", 2.5);		

	// Adding chart and axes titles
	lineChart.append("text")
        .attr("text-anchor", "middle")  
        .attr("transform", "translate("+ (margin.left/2) +","+(height/2)+")rotate(-90)")  
        .style("font-size", "1.8em") 
        .style("font-family", "Lato")
        .text("Sales");
	
    lineChart.append("text")
        .attr("text-anchor", "middle")  
        .attr("transform", "translate("+ (lineWidth/2) +","+(height-margin.bottom/5)+")")  
        .style("font-size", "1.8em") 
        .style("font-family", "Lato")
        .text("Date");       
	
	lineChart.append("text")
		.attr("class", "cv-text")
     	.attr("transform", "translate("+ (lineWidth/2) + "," +((margin.top))+")")
        .attr("text-anchor", "middle")  
        .style("font-size", "2.0em")
	.style("font-family", "Lato")
        .text("Sales Prediction CV - Actual vs Predicted");


    // Adding Legend
    var legendValues = ["Actual", "Predicted"];
    var legendColor = ["steelblue", "tomato"];

	var Legend = svg.selectAll(".Legend").data(legendValues)
	    			.enter().append("g")
	    			.attr("class","Legend")
	    			.attr("transform", function (d,i) {
	            return "translate(" + ((width*2)+320) + "," + (i*20)+")";
	        });
	
	Legend.append("text").text(function (d) {return d;})
	    .attr("transform", "translate(15,12)"); 
	
	Legend.append("rect")
	    .attr("fill", function (d, i) {return legendColor[i]; })
	    .attr("width", 10).attr("height", 10);


    // Pie Chart
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
	
	var thickness = 10,
    	radius = Math.min(pieWidth, height) / 2;
	
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
	    	
	
	var g = pieChart.selectAll(".arc")
	    .data(pie(dataP))
	    .enter()
	    .append("g")
	    .attr("transform", "translate(" + pieWidth / 2 + "," + height / 2 + ")")
	    .on("mouseover", function(d, i) {
	      let g = d3.select(this).attr("fill-opacity", 0.7)
	        .style("cursor", "pointer")
	        .append("g")
	        .attr("class", "text-group")
	
	 
	      g.append("text")
	        .attr("class", "name-text")
	            .text(`${dataP[i].Store}`)
		    .attr('font-family', 'Lato')
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
	  		console.log(s);

	  		// Updating Chart-1
	  		// Removing the previous Lines
	  		d3.selectAll(".path1").remove();	

	  		// Creating New lines of that store
	  		var xScale = d3.scaleTime()
	  		.range([margin.left+40, lineWidth-20]);
	
			var yScale = d3.scaleLinear()
	  		.domain([0,200000])
	  		.range([height/3-margin.bottom, margin.top]);

	  		xScale.domain(d3.extent(dataCV1, function(d) { return d.Date; }));
  			yScale.domain([0, d3.max(dataCV1, function(d) { return d.Y_actual; })]);
	
			// lineChart.append("g")
			//   .attr("transform", `translate(0, ${height/3-margin.bottom})`)
			//   .call(d3.axisBottom().scale(xScale));
		
			// lineChart.append("g")
			//   .attr("transform", `translate(${margin.left+40},0)`)
			//   .call(d3.axisLeft().scale(yScale));
			
			var line1 = d3.line()
						.x(function(d) { return xScale(d.Date); })
						.y(function(d) { return yScale(d.Y_actual); });	
	
			var line2 = d3.line()
						.x(function(d) { return xScale(d.Date); })
						.y(function(d) { return yScale(d.Y_pred); });


	
			lineChart.append("path")
					      .datum(dataCV1.filter(function(d) { return d.Store == s }))
				    		.attr("d", line1)
				    		.attr("class", "path1")
				    		.attr("fill", "none")
							.attr("stroke", "steelblue")
							.attr("stroke-width", 2.5)		
	
			lineChart.append("path")
					      .datum(dataCV1.filter(function(d) { return d.Store == s }))
				    		.attr("d", line2)
				    		.attr("class", "path1")
				    		.attr("fill", "none")
							.attr("stroke", "tomato")
							.attr("stroke-width", 2.5); 


			// Updating Chart-2
	  		// Removing the previous Lines
	  		d3.selectAll(".path2").remove();	

	  		// Creating New lines of that store
	  		var yScale = d3.scaleLinear()
			  .domain([0,200000])
			  .range([2*height/3-margin.bottom, height/3+margin.top]);
	
			xScale.domain(d3.extent(dataCV2, function(d) { return d.Date; }));
  			yScale.domain([0, d3.max(dataCV2, function(d) { return d.Y_actual; })]);
	
  			// lineChart.append("g")
			//   .attr("transform", `translate(0, ${2*height/3-margin.bottom})`)
			//   .call(d3.axisBottom().scale(xScale));
		
			// lineChart.append("g")
			//   .attr("transform", `translate(${margin.left+40},0)`)
			//   .call(d3.axisLeft().scale(yScale));
	
			lineChart.append("path")
					      .datum(dataCV2.filter(function(d) { return d.Store == s }))
				    		.attr("d", line1)
				    		.attr("class", "path2")
				    		.attr("fill", "none")
							.attr("stroke", "steelblue")
						.attr("stroke-width", 2.5); 
	
			lineChart.append("path")
					      .datum(dataCV2.filter(function(d) { return d.Store == s }))
				    		.attr("d", line2)
				    		.attr("class", "path2")
				    		.attr("fill", "none")
							.attr("stroke", "tomato")
							.attr("stroke-width", 2.5);


			// Updating Chart-3
	  		// Removing the previous Lines
	  		d3.selectAll(".path3").remove();	

	  		// Creating New lines of that store
	  		var yScale = d3.scaleLinear()
			  .domain([0,200000])
			  .range([height-margin.bottom, 2*height/3+margin.top]);
	
			xScale.domain(d3.extent(dataCV3, function(d) { return d.Date; }));
  			yScale.domain([0, d3.max(dataCV3, function(d) { return d.Y_actual; })]);
	
  			// lineChart.append("g")
			//   .attr("transform", `translate(0, ${height-margin.bottom})`)
			//   .call(d3.axisBottom().scale(xScale));
		
			// lineChart.append("g")
			//   .attr("transform", `translate(${margin.left+40},0)`)
			//   .call(d3.axisLeft().scale(yScale));
	
			lineChart.append("path")
					      .datum(dataCV3.filter(function(d) { return d.Store == s }))
				    		.attr("d", line1)
				    		.attr("class", "path3")
				    		.attr("fill", "none")
							.attr("stroke", "steelblue")
							.attr("stroke-width", 2.5); 
	
			lineChart.append("path")
					      .datum(dataCV3.filter(function(d) { return d.Store == s }))
				    		.attr("d", line2)
				    		.attr("class", "path3")
				    		.attr("fill", "none")
							.attr("stroke", "tomato")
							.attr("stroke-width", 2.5);
	
	  	});
	
	pieChart.append("g")
            .attr("transform", "translate("+ (margin.left-25) + "," +((margin.top+50))+")")
        .append("text").text("Average Sales across different Locations")
	.attr("font-family","Lato")
            .attr("class", "title")
	
  	g.append('text')
 	.attr('text-anchor', 'middle')
	.style("font","Lato")
//  	.attr('fill', '#888')
 	.attr('dy', '.35em')
 	.text(text);
	
	
    g.append("text")
     	.attr("class", "store-text")
	.style("font","Lato")
    	.attr("transform", function(d) {
        var _d = arc.centroid(d);
        	_d[0] *= 1;	
        	_d[1] *= 1;	
        return "translate(" + _d + ")";
      })
      .attr("dy", ".50em")
      .style("text-anchor", "middle")
      .text(function(d, i) { return dataP[i].Store; });

}



