
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
	    drawSimpleChart();
	    data = [{"name":"Base Price","value":76819.40},
		    {"name":"Day + 1","value":2144.46},
		    {"name":"Day + 2","value":-4139.14},
		    {"name":"Day + 3","value":3699.20},
		    {"name":"Day + 4","value":-2078.02},
		    {"name":"Day + 5","value":4200.20},
		    {"name":"Day + 6","value":-3910.10},
		    {"name":"Day + 7","value":2576.75},
		    {"name":"Day + 8","value":6000.23}]
	    drawWaterFallChart(data);
	}});
    }
}
