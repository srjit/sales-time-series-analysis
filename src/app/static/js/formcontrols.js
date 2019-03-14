// $( "#algorithm" ).on("changed.bs.select", function() {
//   alert( "Handler for .change() called." );
// });

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
	    //	    demo2();
	    // d3.csv('data.csv', type, (error, data) => {
	    data = [{"name":"1st revenue","value":6000000},
		    {"name":"2nd revenu","value":2000000},
		    {"name":"1st spend","value":-3000000},
		    {"name":"3rd revenue","value":4000000},
		    {"name":"2nd spend","value":-5500000},
		    {"name":"4th revenue","value":800000}]
	    drawWaterFallChart(data);
	    // });
	    
	}});
    }
}
