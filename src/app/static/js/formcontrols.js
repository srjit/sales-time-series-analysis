
function show_hide_params(){

    var algorithm = $('#algorithm').val();
    if(algorithm == 'xgboost'){
	$('#xgboostparams').show();
	$('#lstmparams').hide();
	$('#arimaparams').hide();
	$('#parameters').show();
    }
    if(algorithm == 'lstm'){
	$('#lstmparams').show();
	$('#xgboostparams').hide();
	$('#arimaparams').hide();
	$('#parameters').show();
    }
    if(algorithm == 'arima'){
	$('#arimaparams').show();	
	$('#lstmparams').hide();
	$('#xgboostparams').hide();
	$('#parameters').show();
    }
}



function getForecastData(algorithm, store){
    $("#water-chart").empty();
    $.ajax({url: "/getpredictions",
    	    data: {
    		"algorithm": algorithm
    	    },
    	    contentType: 'application/json;charset=UTF-8',
    	    success: function(result){
		data = $.parseJSON(result)
		data_ = $.parseJSON(data[store])
		drawWaterFallChart(data_.slice(1, 10), true);
		var location_text = "Location: " + store
		$('#location').text(location_text);
		$('#forecast-div').show();
    	    }
    	   });
};


function getValidationsData(algorithm){
    console.log("This must print");
    $("#viz1").empty();
    $.ajax({url: "/getvalidation",
    	    data: {
    		"algorithm": algorithm
    	    },
    	    contentType: 'application/json;charset=UTF-8',
    	    success: function(result){
		data = $.parseJSON(result)
		displayData(result);
    	    }
    	});
};


function getTab(tabname){
    if(tabname == 'home'){
	$.ajax({url: "/configure", success: function(result){
	    $('.container-fluid').html(result);
	    $('#home').addClass('active');
	    $('#forecat').removeClass('active');
	    
	}});
    } else if(tabname == 'forecast'){
	$.ajax({url: "/forecast", success: function(result){
	    $('.container-fluid').html(result);
	    $('#home').removeClass('active');
	    $('#forecast').addClass('active');
	    //displayData();
	    areachart();
	    var algorithm = $('#predalgorithm').val();
	    getValidationsData(algorithm)
	    //predictions = getForecastData("lstm", "Detroit");
	    

	    // data = [{"name":"Base Price","value":76819.40},
	    // 	    {"name":"Day + 1","value":2144.46},
	    // 	    {"name":"Day + 2","value":-4139.14},
	    // 	    {"name":"Day + 3","value":3699.20},
	    // 	    {"name":"Day + 4","value":-2078.02},
	    // 	    {"name":"Day + 5","value":4200.20},
	    // 	    {"name":"Day + 6","value":-3910.10},
	    // 	    {"name":"Day + 7","value":2576.75},
	    // 	    {"name":"Day + 8","value":6000.23}]
	    // drawWaterFallChart(data, false);
	}});
    }
}



function showpred(){
    var algorithm = $('#predalgorithm').val();
    getValidationsData(algorithm);
}
