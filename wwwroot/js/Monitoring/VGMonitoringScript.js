function SetAttendanceMonitoringHeight() {
    var chart = $("#attendanceChart").data("dxChart");
    if (typeof chart !== 'undefined' && null !== chart) {
        UpdateHeight(chart);
    }
}

function SetAttendanceMonitoringHeightJS() {
    let element = document.getElementById('attendanceChart');
    let chart = DevExpress.ui.dxChart.getInstance(element);
    if (typeof chart !== 'undefined' && null !== chart) {
        UpdateHeight(chart);
    }
}

function SetHistoricalMonitoringHeight() {
    var chart = $("#historicalChart").data("dxChart");
    if (typeof chart !== 'undefined' && null !== chart) {
        UpdateHeight(chart);
    }
}

$(document).on('click', '#btnRefreshAttendanceHours', function (event) {
    event.preventDefault();

    var btnSearch = $(this);

    var url = btnSearch.data('request-url');

    $.ajax({
        url: url,
        type: 'POST',
        data: $("#frmAttendanceHoursChart").serialize(),
        success: function (result, status, xhr) {
            if (result.Success) {
                var attendanceChart = $("#attendanceChart").dxChart("instance");                
                var ds = attendanceChart.getDataSource();
                ds.requireTotalCount(true);

                ds.filter(result.Data);
                ds.load();
            }
            else {
                ErrorAlert(result.Data, 1000, null, 0);
            }
        },
        error: function (xhr, status, error) {
            if (xhr.status === 403) {
                RedirectToLoginPage();
            }
            else {
                ErrorAlert(xhr.statusText, 1000, null, 0);
            }
        }
    });

});


function OnAttendanceChartOnPointClick(e) {
    var data = e.target.data;

    var selectedColor = e.target.getColor();

    var formdata = $("#frmAttendanceHoursChart").serializeArray();
    var searchObject = {};
    $(formdata).each(function (index, obj) {
        searchObject[obj.name] = obj.value;
    });

    LoadMonitoringEventLogs(data, searchObject, selectedColor, 'AttendanceHoursMonitoringEventsEndPoint', 'GetAttendanceHoursMonitoringEvents');
    $("#monitoringEventViewerModal").modal('show');
}

function OnHistoricalChartOnPointClick(e) {
    var data = e.target.data;

    if ($.type(data.DateTimeValue) !== "string") {
        data.TimeSpanValue = data.DateTimeValue.getHours() + ":" + data.DateTimeValue.getMinutes() + ":" + data.DateTimeValue.getSeconds();
        var dateFormated = (parseInt(data.DateTimeValue.getMonth()) + 1) + "/" + data.DateTimeValue.getDate() + "/" + data.DateTimeValue.getFullYear();
        data.DateTimeValue = dateFormated;
    }

    var selectedColor = e.target.getColor();

    var formdata = $("#frmHistoricalDataChart").serializeArray();
    var searchObject = {};
    $(formdata).each(function (index, obj) {
        searchObject[obj.name] = obj.value;
    });

    LoadMonitoringEventLogs(data, searchObject, selectedColor, 'HistoricalDataMonitoringEventsEndPoint', 'GetHistoricalDataMonitoringEvents');
    $("#monitoringEventViewerModal").modal('show');
}



function OnAttendanceCustomizeTooltip(e) {
    var chart = $("#attendanceChart").dxChart("instance");
    return GenerateToolTipForAllSeries(e, chart);
}

function OnNotificationCustomizeTooltip(e) {
    var chart = $("#notificationChart").dxChart("instance");
    return GenerateToolTipForAllSeries(e, chart);
}


function OnHistoricalCustomizeTooltip(e) {
    var chart = $("#historicalChart").dxChart("instance");
    return GenerateToolTipForAllSeries(e, chart);
}

function GenerateToolTipForAllSeries(e, chart) {
    var tooltips = [];
    var series = chart.getAllSeries();
    var seriesName;
    var pointValue;


    for (var i = 0; i < series.length; i++) {
        seriesName = series[i].name;
        pointValue = series[i].getPointsByArg(e.argument)[0].originalValue;
        tooltips.push(seriesName + ": " + pointValue);
    }
    return {
        text: "<b>" + e.argumentText + "</b><br/>" + tooltips.join("<br/>")
    };
}

function SetNotificationMonitoringHeight() {
    var chart = $("#notificationChart").data("dxChart");
    if (typeof chart !== 'undefined' && null !== chart) {
        UpdateHeight(chart);
    }
}

function AttendanceChartOnDone(e) {
    setTimeout(RenderChart, 1000);

    if (typeof OnAppChartLoaded !== 'undefined' && $.isFunction(OnAppChartLoaded)) {
        OnAppChartLoaded(e);
    }
}

function HistoricalChartOnDone(e) {
    setTimeout(RenderChart, 1000);
}

function NotificationChartOnDone(e) {
    setTimeout(RenderChart, 1000);
}

function RenderChart() {
    var chart = $("#attendanceChart").data("dxChart");
    if (undefined !== chart && null !== chart) {
        chart.render();
    }

    chart = $("#historicalChart").data("dxChart");
    if (undefined !== chart && null !== chart) {
        chart.render();
    }

    chart = $("#notificationChart").data("dxChart");
    if (undefined !== chart && null !== chart) {
        chart.render();
    }
}


$(document).on('click', '#btnRefreshHistoricalData', function (event) {
    event.preventDefault();

    if (!$("#frmHistoricalDataChart").valid()) {
        return;
    }

    var selectedChartType = $('#MonitoringChartType').val();

    //Validate start date and end date.
    var startDate = $('#HistoricalStartDate').datepicker("getDate");
    var endDate = $('#HistoricalEndDate').datepicker("getDate");

    var diffDays = (endDate - startDate) / 1000 / 60 / 60 / 24;

    if (selectedChartType === '0') //Hourly
    {
        if (diffDays > 3) {
            ErrorAlert('For hourly graph, you can get maximum 3 days data.', 1000, null, 0);
            return;
        }
    }

    var btnSearch = $(this);
    var url = btnSearch.data('request-url');

    var chartLegends = '';
    //Get all selected checkbox
    var selected = $("#lstChartLegends option:selected");
    if (0 === selected.length) {
        ErrorAlert('Select atleast one chart legend', 1000, null, 0);
    }

    selected.each(function () {
        var id = $(this).val();
        id = id.replace('chkEventId_', '');
        chartLegends += id + ',';
    });
    chartLegends = chartLegends.replace(/,\s*$/, "");

    var ajaxData = $("#frmHistoricalDataChart").serialize();

    ajaxData += "&SelectedChartLegends=" + encodeURIComponent(chartLegends);


    $.ajax({
        url: url,
        type: 'POST',
        cache: false,
        async: false,
        data: ajaxData,
        success: function (result) {
            if (result.Success) {

                var chart = $("#historicalChart").dxChart("instance");



                var ds = chart.getDataSource();
                ds.requireTotalCount(true);
                ds.filter(result.Data);

                if (selectedChartType === '0') //Hourly
                {
                    console.log('Hourly');
                    chart.option('argumentAxis',
                        {
                            label: {
                                format: 'longTime'
                            },
                            tickInterval: {
                                hours: 1
                            }
                        });
                    chart.option('tooltip',
                        {
                            argumentFormat: 'longTime'
                        });
                    chart.option('title', {
                        subtitle: 'Hourly'
                    });
                }
                else if (selectedChartType === '1') //Daily
                {
                    console.log('Daily');
                    chart.option('argumentAxis',
                        {
                            label: {
                                format: 'shortDate'
                            },
                            tickInterval: {
                                days: 1
                            }
                        });
                    chart.option('tooltip',
                        {
                            argumentFormat: 'shortDate'
                        });
                    chart.option('title', {
                        subtitle: 'Daily'
                    });
                }
                else if (selectedChartType === '2') //Monthly
                {
                    console.log('Monthly');
                    //chart.option({
                    //    argumentAxis: {
                    //        label: {
                    //            format: 'monthAndYear'
                    //        },
                    //        tickInterval: {
                    //            months: 1
                    //        }
                    //    },
                    //    tooltip: {
                    //        argumentFormat: 'monthAndYear'
                    //    },
                    //    title: {
                    //        subtitle: 'Monthly'
                    //    }
                    //});

                    chart.option('argumentAxis',
                        {
                            label: {
                                format: 'monthAndYear'
                            },
                            tickInterval: {
                                months: 1
                            }
                        });
                    chart.option('tooltip',
                        {
                            argumentFormat: 'monthAndYear'
                        });
                    chart.option('title', {
                        subtitle: 'Monthly'
                    });
                }

                //var ds = chart.getDataSource();
                //ds.requireTotalCount(true);

                //ds.filter(result.Data);

                chart.option('dataSource', []);

                //Show indicator
                chart.showLoadingIndicator();

                ds.load().done(() => {
                    chart.option("dataSource", ds);
                    chart.hideLoadingIndicator();
                });

                //ds.reload();
            }
            else {
                ErrorAlert(result.Data, 1000, null, 0);
            }
        },
        error: function (xhr, status, error) {
            if (xhr.status === 403) {
                RedirectToLoginPage();
            }
            else {
                ErrorAlert(xhr.statusText, 1000, null, 0);
            }
        }
    });

});






$(document).on('click', '#btnRefreshNotificationData', function (event) {
    event.preventDefault();

    var selectedChartType = $('#NotificationMonitoringChartType').val();

    //Validate start date and end date.
    var startDate = $('#NotificationStartDate').datepicker("getDate");
    var endDate = $('#NotificationEndDate').datepicker("getDate");

    var diffDays = (endDate - startDate) / 1000 / 60 / 60 / 24;

    if (selectedChartType === '0') //Hourly
    {
        if (diffDays > 3) {
            ErrorAlert('For hourly graph, you can get maximum 3 days data.', 1000, null, 0);
            return;
        }
    }

    var btnSearch = $(this);
    var url = btnSearch.data('request-url');

    var ajaxData = $("#notificationMonitoringForm").serialize();

    $.ajax({
        url: url,
        type: 'POST',
        cache: false,
        async: false,
        data: ajaxData,
        success: function (result) {
            if (result.Success) {
                var chart = $("#notificationChart").dxChart("instance");

                if (selectedChartType === '0') //Hourly
                {
                    chart.option('argumentAxis',
                        {
                            label: {
                                format: 'longTime'
                            },
                            tickInterval: {
                                hours: 1
                            }
                        });
                    chart.option('tooltip',
                        {
                            argumentFormat: 'longTime'
                        });
                    chart.option('title', {
                        subtitle: 'Hourly'
                    });
                }
                else if (selectedChartType === '1') //Daily
                {
                    chart.option('argumentAxis',
                        {
                            label: {
                                format: 'shortDate'
                            },
                            tickInterval: {
                                days: 1
                            }
                        });
                    chart.option('tooltip',
                        {
                            argumentFormat: 'longDate'
                        });
                    chart.option('title', {
                        subtitle: 'Daily'
                    });
                }
                else if (selectedChartType === '2') //Monthly
                {
                    chart.option('argumentAxis',
                        {
                            label: {
                                format: 'monthAndYear'
                            },
                            tickInterval: {
                                months: 1
                            }
                        });
                    chart.option('tooltip',
                        {
                            argumentFormat: 'month'
                        });
                    chart.option('title', {
                        subtitle: 'Monthly'
                    });
                }

                var ds = chart.getDataSource();
                ds.requireTotalCount(true);

                ds.filter(result.Data);
                ds.load();
            }
            else {
                ErrorAlert(result.Data, 1000, null, 0);
            }
        },
        error: function (xhr, status, error) {
            if (xhr.status === 403) {
                RedirectToLoginPage();
            }
            else {
                ErrorAlert(xhr.statusText, 1000, null, 0);
            }
        }
    });

});

function OnNotificationChartOnPointClick(e) {
    var data = e.target.data;

    if ($.type(data.DateTimeValue) !== "string") {
        data.TimeSpanValue = data.DateTimeValue.getHours() + ":" + data.DateTimeValue.getMinutes() + ":" + data.DateTimeValue.getSeconds();
        var dateFormated = (parseInt(data.DateTimeValue.getMonth()) + 1) + "/" + data.DateTimeValue.getDate() + "/" + data.DateTimeValue.getFullYear();
        data.DateTimeValue = dateFormated;
    }

    var selectedColor = e.target.getColor();

    var formdata = $("#notificationMonitoringForm").serializeArray();
    var searchObject = {};
    $(formdata).each(function (index, obj) {
        searchObject[obj.name] = obj.value;
    });

    LoadMonitoringEventLogs(data, searchObject, selectedColor, 'HistoricalDataMonitoringEventsEndPoint', 'GetNotificationDataMonitoringEvents');
    $("#monitoringEventViewerModal").modal('show');
}