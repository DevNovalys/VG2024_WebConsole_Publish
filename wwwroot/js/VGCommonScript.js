var vgCommonScript = {
    Ajax: function (httpMethod, url, data, successCallBack, completeCallBack, type, contentType, async, cache) {
        if (typeof type === "undefined") {
            type = 'json';
        }
        if (typeof contentType === "undefined") {
            contentType = 'application/json; charset=utf-8';
        }
        if (typeof async === "undefined") {
            async = false;
        }
        if (typeof cache === "undefined") {
            cache = false;
        }

        var ajaxObj = $.ajax({
            type: httpMethod.toUpperCase(),
            url: url,
            data: data,
            dataType: type,
            contentType: contentType,
            async: async,
            cache: cache,
            success: successCallBack,
            error: function (err, type, httpStatus) {
                Common.AjaxFailureCallback(err, type, httpStatus);
            },
            complete: completeCallBack
        });

        return ajaxObj;

    },

    AjaxFailureCallback: function (err, type, httpStatus) {
        let failureMessage = 'Error occurred in ajax call ' + err.status + ' - ' + err.responseText + ' - ' + httpStatus;
        console.error(failureMessage);
    }
}