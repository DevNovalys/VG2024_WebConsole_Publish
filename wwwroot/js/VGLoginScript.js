
//**************************************************************************************************
// Name: VGLoginScript.js
// METHODS
//**************************************************************************************************

var mfaInterval;

function GetReturnUrl() {
    if (IsQueryStringExists('ReturnUrl')) {
        let returnUrl = FindQueryString();
        if (0 < returnUrl.length) {
            return returnUrl[1].toLowerCase();
        }
    }
    return '';
}

function ShowValidationSummaryError(errorMessage) {
    $("#validationSummary ul:first li:first").text(errorMessage);
    $('#validationSummary').addClass('validation-summary-errors');
    $('#validationSummary').removeClass('validation-summary-valid');
    $("#validationSummary ul:first li:first").show();
}

function HideValidationErrorSummary() {
    $('#validationSummary').removeClass('validation-summary-errors');
    $('#validationSummary').addClass('validation-summary-valid');
    $("#validationSummary ul:first li:first").hide();
}

function OnError(xhr) {
    let responseText;
    let errorMessage;

    try {
        if (typeof xhr.responseJSON !== 'undefined') {
            responseText = xhr.responseJSON.Message;
        }
        if (typeof xhr.responseText !== 'undefined') {
            responseText = jQuery.parseJSON(xhr.responseText);
        }

        if (!responseText || typeof responseText === 'undefined') {
            responseText = 'Some error has occurred';
        }

        errorMessage = responseText.Message;
    } catch (e) {
        errorMessage = xhr.responseText;
    }

    ShowValidationSummaryError(errorMessage);

    setTimeout(function () {
        $("#mfaLinkModal").modal("hide");
        $("#mfaOTPModal").modal("hide");
    }, 500);
}

function GetMFAExpirationTime(selectedMFAOption) {
    let expireTime;
    jQuery.ajaxSetup({ async: false });
    $.get("identity/account/login?handler=ExpirationTime", { mfaAuthMode: selectedMFAOption }, function (result) {
        expireTime = result;
    })
        .done(function () {
        })
        .fail(function () {
            console.error('Error');
        })
        .always(function () {
        });

    return expireTime;
}

function BindMFAAvailableList(selector, tasks) {
    let lstAvailableMFA = $(selector).dxList({
        dataSource: tasks,
        keyExpr: 'id',
        showSelectionControls: false,
        selectionMode: "single",
        itemTemplate(data) {
            const result = $('<div>').addClass('mfaDiv');
            $('<div>').html('<i class="fal fa-fw ' + data.img + '"></i>' + '&nbsp;' + data.text).appendTo(result);
            return result;
        },
    }).dxList('instance');
    lstAvailableMFA.selectItem(0);
}

function GetMFAAvailableListDataSource() {
    let mfaListInstance = GetDxListInstance('mfaAvailablesList');
    return mfaListInstance.option("dataSource");
}

function GetSelectedMFA() {
    let mfaListInstance = GetDxListInstance('mfaAvailablesList');
    let selectedMFAOptions = mfaListInstance.option("selectedItems");
    if (0 === selectedMFAOptions.length || 1 < selectedMFAOptions.length) {
        return;
    }
    let selectedMFAOption = selectedMFAOptions[0];

    let mfaSource = GetMFAAvailableListDataSource();
    return mfaSource.find(x => x.id === selectedMFAOption.id);
}

function ExecuteMFA() {
    try {
        //Get selected item id        
        let selectedItem = GetSelectedMFA();

        if (1 == selectedItem.mfaAuthMode) {
            $("#mfaLinkModalV2").modal("show");
        }
        else {
            $('#mfaAvailableSelection').modal('hide');
            ShowLoading('loadPanel', 'Sending OTP');
        }

        $.ajaxSetup({
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("XSRF-TOKEN",
                    $('input:hidden[name="__RequestVerificationToken"]').val());
            }
        });
        $.post("identity/account/login?handler=AuthenticateMFAV2", { requestId: selectedItem.requestId, mfaAvailableId: selectedItem.id, authenticationMode: selectedItem.mfaAuthMode }, function (result) {

        })
            .done(function (result) {
                if (result.Success) {
                    if (result.IsRedirect) {
                        window.location.href = result.Data;
                    }
                    if (result.IsOTP) {
                        $("#mfaOTPModalV2").modal("show");                        
                    }
                }
            })
            .fail(function (response) {
                OnError(response);
            })
            .always(function () {
                HideLoading('loadPanel');
                $("#mfaLinkModalV2").modal("hide");
                $("#mfaAvailableSelection").modal("hide");
            });
    }
    catch (err) {
    }
}

//**************************************************************************************************
// EVENTS
//**************************************************************************************************


$(document).on("click", "#js-login-btn", function (e) {
    e.preventDefault();

    // Fetch form to apply custom Bootstrap validation
    var form = $("#js-login");

    if (form[0].checkValidity() === false) {
        e.preventDefault();
        e.stopPropagation();
    }

    form.addClass('was-validated');
    ShowLoading('loadPanel');

    let authMode = $('#Input_AuthenticationMode').find(":selected").val();
    let userName = $("#Username").val();
    let password = $("#Password").val();
    let returnUrl = GetReturnUrl();
    let rememberMe = $("#chkRememberMe").is(":checked");

    HideValidationErrorSummary();

    let data = { authMode: authMode, userName: userName, password: password, returnUrl: returnUrl, rememberMe: rememberMe };
    $.ajaxSetup({
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        }
    });
    $.post("identity/account/login?handler=Authentication", data, function (result, status, xhr) {


    }, "json")
        .done(function (result) {
            if (result.Success) {
                if (result.IsRedirect) {
                    if (result.PasswordDoesNotPassValidation) {
                        $.confirm({
                            title: 'Password policy changed',
                            content: 'Password policy is changed, so your password is not secure enough. Do you want to change your password?',
                            escapeKey: 'cancel',
                            backgroundDismiss: function () {
                                return 'cancel'; // the button will handle it
                            },
                            closeIcon: true,
                            theme: 'bootstrap',
                            buttons: {
                                confirm: {
                                    text: 'Ok',
                                    action: function () {                                        
                                        window.location.href = result.ChangePasswordUrl;
                                    }
                                },
                                cancel: {
                                    text: 'Cancel', // With spaces and symbols
                                    action: function () {
                                        window.location.href = result.Data;
                                    }
                                }
                            }
                        });
                    }
                    else {
                        ShowLoading('loadPanel', 'Redirecting...');
                        window.location.href = result.Data;
                    }
                }
                else {
                    //MFA
                    form.removeClass('was-validated');
                    let mfaList = result.Data;
                    let mfaDataSource = [];
                    $.each(mfaList, function (key, value) {
                        if (value.NeedEnrollment) {
                            value.MFAOptionMessage = '<a href="' + value.EnrollmentUrl + '">' + value.MFAOptionMessage + '</a>';
                            value.ImageIcon = 'fa-shield-alt';
                        }
                        mfaDataSource.push({ id: value.Id, text: value.MFAOptionMessage, selectedOptionText: value.MFASelectedOptionMessage, img: value.ImageIcon, requestId: value.RequestId, mfaAuthMode: value.AuthenticationMode });
                    });
                    BindMFAAvailableList('#mfaAvailablesList', mfaDataSource);

                    if (1 < mfaList.length) {
                        let loginPanelHeight = $("#loginPanel").height();                        
                        $("#divMFAAvailableSelectionBody").height(loginPanelHeight - 55);
                        $('#mfaAvailableSelection').modal('handleUpdate');
                        $('#mfaAvailableSelection').modal('show');                        
                    }
                    else {
                        //only 1 item in the list
                        ExecuteMFA();
                    }
                }
            }
            else {

            }
        })
        .fail(function (e) {
            console.error('Error');
            OnError(e);
        })
        .always(function (a) {
            HideLoading('loadPanel');
        });
});

function OnConfirmationCallAction(data) {
    window.location.href = data;
}

//#region -- MFA EVENTS

$(document).on("click", "#js-cancel-btn-mfa", function (e) {
    e.preventDefault();

    window.location.href = window.location.href;
});

$(document).on("click", "#js-login-btn-mfa", function (e) {
    e.preventDefault();

    ExecuteMFA();

    ////Get selected item id        
    //let selectedItem = GetSelectedMFA();

    //if (1 == selectedItem.mfaAuthMode) {
    //    $("#mfaLinkModalV2").modal("show");
    //}
    //else {
    //    $('#mfaAvailableSelection').modal('hide');
    //    ShowLoading('loadPanel', 'Sending OTP');
    //}

    //$.ajaxSetup({
    //    async: true,
    //    beforeSend: function (xhr) {
    //        xhr.setRequestHeader("XSRF-TOKEN",
    //            $('input:hidden[name="__RequestVerificationToken"]').val());
    //    }
    //});
    //$.post("identity/account/login?handler=AuthenticateMFAV2", { requestId: selectedItem.requestId, mfaAvailableId: selectedItem.id, authenticationMode: selectedItem.mfaAuthMode }, function (result) {

    //})
    //.done(function (result) {
    //    if (result.Success) {
    //        if (result.IsRedirect) {
    //            window.location.href = result.Data;
    //        }
    //        if (result.IsOTP) {
    //            $("#mfaOTPModalV2").modal("show");
    //        }
    //    }
    //})
    //.fail(function (response) {
    //    OnError(response);
    //})
    //.always(function () {
    //    HideLoading('loadPanel');
    //    $("#mfaLinkModalV2").modal("hide");
    //    $("#mfaAvailableSelection").modal("hide");
    //});
});

$(document).on("click", "#btnCancelMFALink", function (e) {
    e.preventDefault();

    ShowLoading('loadPanel');

    let selectedItem = GetSelectedMFA();
    let requestId = selectedItem.requestId;

    jQuery.ajaxSetup({ async: false });
    $.get("identity/account/login?handler=CancelMFAV2", { requestId: requestId }, function (result) {

    })
        .done(function (result) {

        })
        .fail(function (e) {
            console.error('Error');
            $("#mfaLinkModalV2").modal("hide");
            OnError(result);
        })
        .always(function (e) {
            HideLoading('loadPanel');
        });
});

$("#mfaLinkModalV2").on('show.bs.modal', function () {

    let selectedItem = GetSelectedMFA();
    $("#selectedOptionMessage").html(selectedItem.selectedOptionText);

    let linkMode = GetLinkMode();
    let timeExpire = GetMFAExpirationTime(linkMode);
    mfaInterval = null;
    $('.mfaLinkCountdown').html('');
    mfaInterval = setInterval(function () {
        var timer = timeExpire.split(':');

        //by parsing integer, I avoid all extra string processing
        var minutes = parseInt(timer[0], 10);
        var seconds = parseInt(timer[1], 10);
        --seconds;
        minutes = (seconds < 0) ? --minutes : minutes;
        if (minutes < 0) {
            $("#mfaOTPModalV2").modal("hide");
            $("#mfaLinkModalV2").modal("hide");
        }
        seconds = (seconds < 0) ? 59 : seconds;
        seconds = (seconds < 10) ? '0' + seconds : seconds;

        $('.mfaLinkCountdown').html(minutes + ':' + seconds);
        timeExpire = minutes + ':' + seconds;
    }, 1000);
});

//On Grant modal closing.
$("#mfaLinkModalV2").on('hidden.bs.modal', function () {
    clearInterval(mfaInterval);
    $("#mfaAvailableSelection").modal("hide");
});

$('#mfaSecureCode').keypress(function (e) {
    var key = e.which;
    if (key == 13) {
        $("#js-login-btnOTP").click();
        return true;
    }
});

$(document).on("click", "#js-cancel-btnOTP", function (e) {
    e.preventDefault();
    window.location.href = window.location.href;
});

$(document).on("click", "#js-login-btnOTP", function (e) {
    e.preventDefault();
        
    let otpCode = $("#mfaSecureCode").val();    
    if (otpCode.trim().length === 0) {
        return;
    }

    ShowLoading('loadPanel');
    let mfaListInstance = $("#mfaAvailablesList").dxList("instance");
    let selectedMFAOptions = mfaListInstance.option("selectedItems");
    if (0 === selectedMFAOptions.length || 1 < selectedMFAOptions.length) {
        return;
    }
    let selectedMFAOption = selectedMFAOptions[0];
    let mfaSource = mfaListInstance.option("dataSource");
    let selectedItem = mfaSource.find(x => x.id === selectedMFAOption.id);

    $.ajaxSetup({
        async: true,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("XSRF-TOKEN",
                $('input:hidden[name="__RequestVerificationToken"]').val());
        }
    });
    $.post("identity/account/login?handler=AuthenticateMFAOTP", { requestId: selectedItem.requestId, mfaAvailableId: selectedItem.id, secureCode: otpCode }, function (result) {
        //
    })
    .done(function (result) {
        if (result.Success) {
            if (result.IsRedirect) {
                ShowLoading('loadPanel', 'Redirecting...');
                window.location.href = result.Data;
            }
        }
    })
    .fail(function (response) {
        OnError(response);
        $("#mfaOTPModalV2").modal("hide");
        $("#mfaAvailableSelection").modal("hide");
    })
    .always(function () {
        HideLoading('loadPanel');
    });
});

//On modal loading
$("#mfaOTPModalV2").on('show.bs.modal', function () {

    let selectedItem = GetSelectedMFA();
    $("#selectedOTPMessage").html(selectedItem.selectedOptionText);

    let otpMode = GetOTPMode();;
    let timeExpire = GetMFAExpirationTime(otpMode);
    mfaInterval = null;
    $('.mfaOTPCountdown').html('');
    $('#mfaSecureCode').val('');
    mfaInterval = setInterval(function () {
        var timer = timeExpire.split(':');

        //by parsing integer, I avoid all extra string processing
        var minutes = parseInt(timer[0], 10);
        var seconds = parseInt(timer[1], 10);
        --seconds;
        minutes = (seconds < 0) ? --minutes : minutes;
        if (minutes < 0) {
            //Timeup
            //TimeoutExpired();
            $("#mfaOTPModalV2").modal("hide");
            $("#mfaLinkModalV2").modal("hide");
        }
        seconds = (seconds < 0) ? 59 : seconds;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        //minutes = (minutes < 10) ?  minutes : minutes;

        $('.mfaOTPCountdown').html(minutes + ':' + seconds);
        timeExpire = minutes + ':' + seconds;
    }, 1000);
});

//On Grant modal closing.
$("#mfaOTPModalV2").on('hidden.bs.modal', function () {
    clearInterval(mfaInterval);
    $("#mfaAvailableSelection").modal("hide");
});

//#endregion
