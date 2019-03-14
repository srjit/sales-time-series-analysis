function updateData(data){
    
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

    return data;
};


function drawWaterFallChart(data){

    var margin = { top: 80, right: 30, bottom: 30, left: 50 };
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
    var padding = 0.4;

    updateData(data);

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
    	return d.name;
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
    	    return `translate(${ x(d.name) },0)`;
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

    console.log(bar);
    // // Add the value on each bar
    
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

    // // 	// Add the connecting line between each bar
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

}
