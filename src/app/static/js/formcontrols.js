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
	}});
    } else if(tabname == 'forecast'){
	$.ajax({url: "/forecast", success: function(result){
	    console.log(result);
	    $('.container-fluid').html(result);
	}});
    }
}
