function ShowAlertMessage(title, message, isError) {
    let color = 'white';
    if (typeof isError !== 'undefined') {
        if (isError) {
            color = 'red';
        }
        else {
            color = 'green';
        }
    }
    
    $.alert({
        title: title,
        icon: 'fal fa-warning',
        type: color,
        content: message,
    });
}

function ShowErrorMessage(message) {    
    let originalMessage = message;
    if (message.length > 50) {
        message = message.substring(0, 200);
        message += '...';
    }

    $("#errorMessagePanel").fadeIn();
    $("#errorMessage").text(message);
    $("#errorMessageDetail").text(originalMessage);    
}

function ClearErrorMessage() {
    $("#errorMessagePanel").fadeOut();
    $("#errorMessage").empty();
    $("#errorMessageDetail").empty();
}

//if ($("#IsOnPremise").is(":checked")) {
//    repositoryStorageType = $("#IsOnPremise").attr("data-Repositorystorage");
//}
//else if ($("#IsOnAzure").is(":checked")) {
//    repositoryStorageType = $("#IsOnAzure").attr("data-Repositorystorage");
//}
//else if ($("#IsOnAWS").is(":checked")) {
//    repositoryStorageType = $("#IsOnAWS").attr("data-Repositorystorage");
//}

function IsOnPremise() {
    return $("#IsOnPremise").is(":checked");
}
function IsOnAzure() {
    return $("#IsOnAzure").is(":checked");
}
function IsOnAWS() {
    return $("#IsOnAWS").is(":checked");
}

function IsExistingRepository() {
    return $("#IsExistingRepository").is(":checked");
}

function IsNewRepository() {
    return $("#IsNewRepository").is(":checked");
}

function IsSqlServerRepository() {
    return $("#IsSqlServerRepository").is(":checked");
}

function IsOracleRepository() {
    return $("#IsOracleRepository").is(":checked");
}

function IsWindowsAuthenticationInSql() {
    return $("#sqlServerWidowsAuthentication").is(":checked");
}

function IsSqlServerAuthenticationInSql() {
    return $("#sqlServerAuthentication").is(":checked");
}

function IsExistingRepositorySelectedInSql() {
    return $("#sqlSelectExistingDatabase").is(":checked");
}

function IsNewRepositorySelectedInSql() {
    return $("#sqlCreateDatabase").is(":checked");
}

function IsServiceNameSelectedInOracle() {
    return $("#oracleServiceNameSelect").is(":checked");
}

function IsSIDSelectedInOracle() {
    return $("#oracleSIDSelect").is(":checked");
}

function GetRepositorystorageType() {
    let repositoryStorageType = 0;
    if ($("#IsOnPremise").is(":checked")) {
        repositoryStorageType = $("#IsOnPremise").attr("data-Repositorystorage");
    }
    else if ($("#IsOnAzure").is(":checked")) {
        repositoryStorageType = $("#IsOnAzure").attr("data-Repositorystorage");
    }
    else if ($("#IsOnAWS").is(":checked")) {
        repositoryStorageType = $("#IsOnAWS").attr("data-Repositorystorage");
    }

    return repositoryStorageType;
}

//function ErrorAlert(message) {
//    let originalMessage = message;
//    if (message.length > 10) message = message.substring(0, 50);
//    toastr["error"](message, 'Error');

//    let toastContainer = $("#toast-container");
//    if (null !== toastContainer) {
//        toastContainer.prop('title', originalMessage);
//    }
    
//}

function scroll_to_class(element_class, removed_height) {
	var scroll_to = $(element_class).offset().top - removed_height;
	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 0);
	}
}

function bar_progress(progress_line_object, direction) {
	var number_of_steps = progress_line_object.data('number-of-steps');
	var now_value = progress_line_object.data('now-value');
	var new_value = 0;
	if(direction == 'right') {
		new_value = now_value + ( 100 / number_of_steps );
	}
	else if(direction == 'left') {
		new_value = now_value - ( 100 / number_of_steps );
	}
	progress_line_object.attr('style', 'width: ' + new_value + '%;').data('now-value', new_value);
}

function getNextStep(step, fieldSet, stepToCheck) {
    let nextStep = step;
    if (fieldSet[0].id.indexOf(stepToCheck) > -1) {
        if ($("#IsSqlRepository").is(':checked')) {
            nextStep = $("#step4_sqlrepository");
        }
        else if ($("#oracleRepository").is(':checked')) {
            nextStep = $("#step4_oraclerepository");
        }
    }

    return nextStep;
}

function GoNext(thisObj) {
    var parent_fieldset = thisObj.parents('fieldset');
    var next_step = true;
    // navigation steps / progress steps
    var current_active_step = thisObj.parents('.f1').find('.f1-step.active');
    var progress_line = thisObj.parents('.f1').find('.f1-progress-line');

    // fields validation
    //parent_fieldset.find('input[type="text"], input[type="password"], textarea').each(function () {
    //    if ($(this).val() == "") {
    //        $(this).addClass('input-error');
    //        next_step = false;
    //    }
    //    else {
    //        $(this).removeClass('input-error');
    //    }
    //});
    // fields validation

    if (next_step) {
        parent_fieldset.fadeOut(400, function () {
            // change icons
            current_active_step.removeClass('active').addClass('activated').next().addClass('active');
            // progress bar
            bar_progress(progress_line, 'right');
            // show next step
            //let nextStep = $(this).next();

            let nextStep = getNextStep($(this).next(), parent_fieldset, 'step3');

            nextStep.fadeIn();
            // scroll window to beginning of the form
            scroll_to_class($('.f1'), 20);
        });
    }
}

function ShowLoader() {    
    $("#loadPanel").dxLoadPanel("instance").show();
    $(".dx-loadpanel-message").show();
}

function HideLoader() {    
    $(".dx-loadpanel-message").hide();
    $("#loadPanel").dxLoadPanel("instance").hide();
}

jQuery(document).ready(function () {

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": false,
        "positionClass": "toast-top-center",
        "preventDuplicates": true,
        "onclick": null,
        "showDuration": 300,
        "hideDuration": 100,
        "timeOut": 5000,
        "extendedTimeOut": 1000,
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
	
    /*
        Fullscreen background
    */
    //$.backstretch("assets/img/backgrounds/1.jpg");
    
    //$('#top-navbar-1').on('shown.bs.collapse', function(){
    //	$.backstretch("resize");
    //});
    //$('#top-navbar-1').on('hidden.bs.collapse', function(){
    //	$.backstretch("resize");
    //});
    
    /*
        Form
    */
    $('.f1 fieldset:first').fadeIn('slow');
    
    $('.f1 input[type="text"], .f1 input[type="password"], .f1 textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });
    
    // next step
    //$('.f1 .btn-next').on('click', function () {
    //    GoNext($(this));    	
    //});

    // previous step
    $('.f1 .btn-previous').on('click', function() {
    	// navigation steps / progress steps
    	var current_active_step = $(this).parents('.f1').find('.f1-step.active');
    	var progress_line = $(this).parents('.f1').find('.f1-progress-line');
        

    	$(this).parents('fieldset').fadeOut(400, function() {
    		// change icons
    		current_active_step.removeClass('active').prev().removeClass('activated').addClass('active');
    		// progress bar
            bar_progress(progress_line, 'left');

    		// show previous step
    		//$(this).prev().fadeIn();
            let current_fieldset = $(this);
            let prevStep = $(this).prev();
            if (current_fieldset[0].id.indexOf('step4') > -1) {
                prevStep = $("#step3_selectrepositorytype");
            }            
            prevStep.fadeIn();

    		// scroll window to beginning of the form
			scroll_to_class( $('.f1'), 20 );
    	});
    });
    
    // submit
    $('.f1').on('submit', function(e) {
    	
    	// fields validation
    	$(this).find('input[type="text"], input[type="password"], textarea').each(function() {
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	// fields validation
    	
    });
    
    //$('#sqlServerDatabaseName').editableSelect();

    $("#sqlServerWidowsAuthentication, #sqlServerAuthentication").change(function () {
        if ($("#sqlServerWidowsAuthentication").is(":checked")) {
            $("#SqlServerUsername").attr("disabled", "disabled"); 
            $("#SqlServerPassword").attr("disabled", "disabled"); 
        }
        else if ($("#sqlServerAuthentication").is(":checked")) {
            $("#SqlServerUsername").removeAttr("disabled"); 
            $("#SqlServerPassword").removeAttr("disabled"); 
        }
    }); 

    $("#oracleServiceNameSelect, #oracleSIDSelect").change(function () {
        if ($("#oracleServiceNameSelect").is(":checked")) {
            $("#oracleSIDName").attr("disabled", "disabled");
            $("#oracleServiceName").removeAttr("disabled");
        }
        else if ($("#sqlServerAuthentication").is(":checked")) {
            $("#oracleServiceName").attr("disabled", "disabled");
            $("#oracleSIDName").removeAttr("disabled");
        }
    }); 

    $("#sqlSelectExistingDatabase, #sqlCreateDatabase").change(function () {
        if (IsExistingRepositorySelectedInSql()) {
            $("#newSqlDatabaseName").attr("disabled", "disabled");
            $("#sqlServerDatabaseName").removeAttr("disabled");
        }
        else if (IsNewRepositorySelectedInSql()) {
            $("#sqlServerDatabaseName").attr("disabled", "disabled");
            $("#newSqlDatabaseName").removeAttr("disabled");
        }
    }); 

    

});
