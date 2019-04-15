function updateData(data, calc){
    
    // create stacked remainder
    var insertStackedRemainderAfter = (dataName, newDataName) => {
        var index = data.findIndex((datum) => {
	    return datum.name === dataName;
        }); // data.findIndex

        return data.splice(index + 1, 0, {
	    name: newDataName,
	    start: data[index].end,
	    end: 0,
	    class: 'total',
        }); // data.splice
    }; // insertStackedRemainder

    // retrieve total value

    let cumulative = 0;

    // Transform data (i.e., finding cumulative values and total) for easier charting
    data.map((datum) => {
        datum.start = cumulative;
        cumulative += datum.value;
        datum.end = cumulative;
        return datum.class = datum.value >= 0 ? 'positive' : 'negative';
    }); // data.map

    var data_ = []
    data_[0] = data[0]
    for(var i=1; i<data.length; i++){
	var tmp = JSON.parse(JSON.stringify(data[i]));
	data_.push(tmp)
	data_[i].value = data[i].value - data[i-1].value
    }

    return data_;
};



function updateData2(data, calc){
    
    // create stacked remainder
    var insertStackedRemainderAfter = (dataName, newDataName) => {
        var index = data.findIndex((datum) => {
	    return datum.Data === dataName;
        }); // data.findIndex

        return data.splice(index + 1, 0, {
	    Date: newDataName,
	    start: data[index].end,
	    end: 0,
	    class: 'total',
        }); // data.splice
    }; // insertStackedRemainder

    // retrieve total value

    let cumulative = 0;

    // Transform data (i.e., finding cumulative values and total) for easier charting
    var data_ = []
    data_[0] = data[0]
    for(var i=1; i<data.length; i++){
	var tmp = JSON.parse(JSON.stringify(data[i]));
	data_.push(tmp)
	data_[i].value = data[i].value - data[i-1].value
    }


    data_.map((datum) => {
        datum.start = cumulative;
        cumulative += datum.value;
        datum.end = cumulative;
        return datum.class = datum.value >= 0 ? 'positive' : 'negative';
    }); 
    

    return data_;
};


function drawWaterFallChart(data, calc){

    var margin = { top: 80, right: 30, bottom: 30, left: 65 };
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
    var padding = 0.4;

    data = updateData2(data, calc);

    var x = d3
	.scaleBand()
	.rangeRound([0, width])
	.padding(padding);

    var y = d3
	.scaleLinear()
	.range([ height, 0 ]);

    var xAxis = d3.axisBottom(x);

    var yAxis = d3
	.axisLeft(y)
	.tickFormat((d) => {
	    return d;
	});

    var chart = d3
	.select('.chart')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
	.attr('transform', `translate(${ margin.left },${ margin.top })`);

    // var width = 960
    // var height = 500

    var eurFormat = (amount) => {
	if (Math.abs(amount) > 1000000) {
	    return `${ Math.round(amount / 1000000) }M€`;
	}
	if (Math.abs(amount) > 1000) {
	    return `${ Math.round(amount / 1000) }K€`;
	}
	return `${ amount }€`;
    }; // eurFormat


    x.domain(data.map((d) => {
    	return d.Date;
    }));

    y.domain([
    	0,
    	d3.max(data, (d) => {
    	    return d.end;
    	})
    ]);
    
    chart
	.append('g')
	.attr('class', 'x axis')
	.attr('transform', `translate(0,${ height })`)
	.call(xAxis);
    

    chart
	.append('g')
	.attr('class', 'y axis')
	.call(yAxis);

    var bar = chart.selectAll('.bar')
    	.data(data)
    	.enter().append('g')
    	.attr('class', function(d){
    	    return `bar ${ d.class }`;
    	})
    	.attr('transform', function(d){
    	    return `translate(${ x(d.Date) },0)`;
    	});

    bar
    	.append('rect')
    	.attr('y', function(d){
    	    return y(Math.max(d.start, d.end));
    	})
    	.attr('height', function(d){
    	    return Math.abs(y(d.start) - y(d.end));
    	})
    	.attr('width', x.bandwidth());

    bar
    	.append('text')
    	.attr('x', x.bandwidth() / 2)
    	.attr('y', function(d) {
    	    return d.class === 'positive' ? y(d.end) : y(d.start);
    	})
    	.attr('dy', '-.5em')
    	.attr("text", function(d) {
    	    return d.class === 'total' ? eurFormat(d.start - d.end) : eurFormat(d.end - d.start);
    	})
    	.style('fill', 'black');


    bar
    	.filter((d, i) => {
    	    // filter out first bar and total bars
    	    return (d.class !== 'total' && i !== 0);
    	})
    	.append('ellipse')
    	.attr('class', 'bubble')
    	.attr('class', 'ellipse')
    	.attr('cx', x.bandwidth() / 2)
    	.attr('cy', (0 - margin.top) / 2)
    	.attr('rx', 30)
    	.attr('ry', '1em');

    bar
    	.filter((d, i) => {
    	    // filter out first bar and total bars
    	    return (d.class !== 'total' && i !== 0);
    	})
    	.append('text')
    	.attr('x', x.bandwidth() / 2)
    	.attr('y', (0 - margin.top) / 2)
    	.attr('dy', '.3em')
    	.attr('class', 'bubble')
    	.text((d) => {
    	    var percentage = d3.format('.1f')(((100 * (d.end - d.start)) / d.start));
    	    return `${ percentage }%`;
    	});
    bar
    	.filter((d, i) => {
    	    return i !== data.length - 1;
    	})
    	.append('line')
    	.attr('class', 'connector')
    	.attr('x1', x.bandwidth() + 5)
    	.attr('y1', function(d){
    	    return d.class === 'total' ? y(d.start) : y(d.end);
    	})
    	.attr('x2', (x.bandwidth() / (1 - padding)) - 5)
    	.attr('y2', function(d){
    	    return d.class === 'total' ? y(d.start) : y(d.end);
    	});


    chart.append("text")
            .attr("text-anchor", "middle")  
	.attr("transform", "translate("+ (padding/2 - 40) +","+(height/2)+")rotate(-90)")
	.style("font-size","12px")
	.style("font","Lato")
        .text("Price Predicted (USD)");    

    
    chart
      .append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + 25) + ")")
	.style("text-anchor", "middle")
    .style("font-size","12px")
    .style("font","Lato")
      .text("Date");
    
    
}
