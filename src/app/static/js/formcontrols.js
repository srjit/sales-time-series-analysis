// $( "#algorithm" ).on("changed.bs.select", function() {
//   alert( "Handler for .change() called." );
// });

function show_hide_params(){

    var algorithm = $('#algorithm').val();
    if(algorithm == 'xgboost'){
	$('#xgboostparams').show();
	$('#lstmparams').hide();
	$('#arimaparams').hide();	
    }
    if(algorithm == 'lstm'){
	$('#lstmparams').show();
	$('#xgboostparams').hide();
	$('#arimaparams').hide();	
    }
    if(algorithm == 'arima'){
	$('#arimaparams').show();	
	$('#lstmparams').hide();
	$('#xgboostparams').hide();
    }
}


function getTab(tabname){
    if(tabname == 'home'){
	$.ajax({url: "/configure", success: function(result){
	    $('.container-fluid').html(result);
	}});
    } else if(tabname == 'forecast'){
	$('.container-fluid').html('');
    }
}
