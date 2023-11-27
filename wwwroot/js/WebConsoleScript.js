var checkedGrantItemsGlobal = [];
var checkedRevokeItemsGlobal = [];

$(document).on('show.bs.modal', '#permissionMatrixModal', function () {
    LoadPermissionMatrixData();
    $('#chkAdvancedSettings').prop('checked', false);
})

//On Grant modal closing.
$(document).on('hidden.bs.modal', '#permissionMatrixModal', function () {
    $("#permissionMatrixData").empty();
    selectedEntitiesForPermissionMatrix = null;
});

$(document).on('change', 'input[id=chkAdvancedSettings]', function () {
    var isCheckedAdvSettings = $('input[id=chkAdvancedSettings]:checked').val();
    if (typeof isCheckedAdvSettings === 'undefined') {
        $(".advSettings").hide();
    }
    else {
        if (isCheckedAdvSettings === 'on') {
            $(".advSettings").show();
        }
    }
});

function RefreshPage() {
    window.location.href = window.location.href;
}

function RedirectToLoginPage() {
    window.location = "/account/RedirectToLogin";
}

function IsFunctionExists(functionName) {
    if (typeof functionName !== 'undefined' && $.isFunction(functionName)) {
        return true;
    }
    return false;
}

function SetControlMaxHeight(ctrlId) {
    var control = $("#" + ctrlId);

    if (typeof control !== "undefined") {
        var windowHeight = $(window).height() - 320;
        control.css("max-height", windowHeight);
    }

    let dxDataGrid = $("#" + ctrlId).dxDataGrid("instance");
    if (typeof dxDataGrid !== "undefined") {
        dxDataGrid.repaint();
    }
}

function SetControlMaxHeight(ctrlId, dxControl) {
    var control = $("#" + ctrlId);

    if (typeof control !== "undefined") {
        var windowHeight = $(window).height() - 320;
        control.css("max-height", windowHeight);
    }


    if (typeof dxControl !== "undefined") {
        dxControl.repaint();
    }
}

function SetControlMaxHeightOnFullScreen(ctrlId) {
    var control = $("#" + ctrlId);

    if (typeof control !== "undefined") {
        let windowHeight;
        if (!$("body").hasClass("panel-fullscreen")) {
            windowHeight = $(window).height() - 120;
        }
        else {
            windowHeight = $(window).height() - 320;
        }
        control.css("max-height", windowHeight);
    }
}

function OnEntityPermissionsContentReady(e) {
    if (typeof ShowHideExportButton !== 'undefined' && $.isFunction(ShowHideExportButton)) {
        ShowHideExportButton(e.component);
    }
}

function UpdateHeight(dxObj) {
    //var dxObjHeight = dxObj.option("height");
    var windowHeight = $(window).height() - 320;

    dxObj.option("height", windowHeight);
}

function GenerateUrlForRole(urlToRedirect, roleId, isSharedRole, applicationId) {

    var appIdQString = '';
    if (!isSharedRole) {
        appIdQString = '&appId=' + applicationId;
    }

    return urlToRedirect + "/?roleId=" + roleId + appIdQString;
}

function GetControlActionUrl(controlId) {
    return GetControlData(controlId, 'request-url');
}

function GetControlData(controlId, dataId) {
    var control = $("#" + controlId);
    return control.data(dataId);
}

function GetDataGridInstance(gridId) {
    let grid = $("#" + gridId).dxDataGrid("instance");
    return grid;
}

function GetDataGridInstanceJS(gridId) {
    let element = document.getElementById(gridId);
    if (null === element) {
        return undefined;
    }
    let grid = DevExpress.ui.dxDataGrid.getInstance(element);

    return grid;
}

function GetTreeListInstance(treeListId) {
    return $("#" + treeListId).dxTreeList("instance");
}

function GetDxListInstance(listId) {
    return $("#" + listId).dxList("instance");
}

function GetTreeListInstanceJS(treeListId) {
    let element = document.getElementById(treeListId);
    let treeList = DevExpress.ui.dxTreeList.getInstance(element);
    return treeList;
}

function GetTreeViewInstance(treeId) {
    return $("#" + treeId).dxTreeView("instance");
}

function GetTreeViewInstanceJS(treeId) {
    let element = document.getElementById(treeId);
    let treeView = DevExpress.ui.dxTreeView.getInstance(element);
    return treeView;
}

function GetDataGridSelectedRowKeys(controlId) {
    var control = GetDataGridInstance(controlId);
    return control.getSelectedRowKeys();
}

function GetDataGridSelectedRowData(controlId) {
    var control = GetDataGridInstance(controlId);
    return control.getSelectedRowsData();
}


function GetTreeListSelectedRowKeys(controlId) {
    var control = GetTreeListInstance(controlId);
    return control.getSelectedRowKeys();
}

function GetTreeListSelectedRowData(controlId) {
    var control = GetTreeListInstance(controlId);
    return control.getSelectedRowsData();
}

function OnTreeViewItemRendered(e) {
    var node = e.element.find(".dx-treeview-item");
    node.css("padding-top", "0px");
    node.css("padding-bottom", "0px");
    node.css("min-height", "10px");

    var search = e.element.find(".dx-treeview-search");
    if (null !== search) {
        search.css("max-width", "250px");
    }
}

function SuccessAlert(message, setTimeOutMethod, setTimeOutDelay) {

    toastr["success"](message);
    if (null !== setTimeOutMethod) {
        setTimeout(setTimeOutMethod, setTimeOutDelay);
    }

    //$.smallBox({
    //    title: "Success",
    //    content: "<i class='fa fa-clock-o'></i> <i>" + message + "</i>",
    //    color: "#659265",
    //    iconSmall: "fa fa-check fa-2x fadeInRight animated",
    //    timeout: timeOut
    //});

    //if (null !== setTimeOutMethod) {
    //    setTimeout(setTimeOutMethod, setTimeOutDelay);
    //}
}

function ErrorAlert(message, setTimeOutMethod, setTimeOutDelay) {
    toastr["error"](message);
    if (null !== setTimeOutMethod) {
        setTimeout(setTimeOutMethod, setTimeOutDelay);
    }

    //$.smallBox({
    //    title: "Error",
    //    content: "<i class='fa fa-clock-o'></i> <i>" + message + "</i>",
    //    color: "#C46A69",
    //    iconSmall: "fa fa-times fa-2x fadeInRight animated",
    //    timeout: 4000
    //});

    //if (null !== setTimeOutMethod) {
    //    setTimeout(setTimeOutMethod, setTimeOutDelay);
    //}
}

function ClearSessionStorage() {
    for (var i = 0; i < sessionStorage.length; i++) {
        var key = sessionStorage.key(i);
        if (key.startsWith("VG_")) {
            sessionStorage.removeItem(key);
        }
    }
}

function GetDataSource(ctrl) {
    return ctrl.option("dataSource");
}

function GetUnique(inputArray) {
    var outputArray = [];
    for (var i = 0; i < inputArray.length; i++) {
        if ((jQuery.inArray(inputArray[i], outputArray)) === -1) {
            outputArray.push(inputArray[i]);
        }
    }
    return outputArray;
}

function FindObjectsFromJSONArray(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] === 'object') {
            objects = objects.concat(FindObjectsFromJSONArray(obj[i], key, val));
        } else
            //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
            if (i === key && obj[i] === val || i === key && val === '') { //
                objects.push(obj);
            } else if (obj[i] === val && key === '') {
                //only add if the object is not already in the array
                if (objects.lastIndexOf(obj) === -1) {
                    objects.push(obj);
                }
            }
    }
    return objects;
}

function RemoveItemFromArray(source, id) {
    for (var i = 0; i < source.length; i++) {
        if (source[i].Id === id) {
            source.splice(i, 1);
            return source;
        }
    }
}

function ContextMenu_Preparing2(e) {
    if (e.row.rowType === "data") {
        e.items = [{
            text: "Clear Selection",
            onItemClick: function () {
                ClearSelection2();
            }
        },
        {
            text: "Export to",
            onItemClick: function () {
                //$("#gridContainer").dxDataGrid("instance").insertRow();
            },
            items: [{
                text: "Excel",
                onItemClick: function () {
                    //$("#gridContainer").dxDataGrid("instance").removeRow(e.row.rowIndex);
                }
            }]
        },
        {
            text: "Column Chooser",
            onItemClick: function () {
                ShowColumnChooser2();
            }
        }];
    }
}

function ShowColumnChooser2() {
    var grid = GetDataGridInstance('UserGrid2');
    grid.showColumnChooser();
}

function selection_changed2(selectedItems) {
    var data = selectedItems.selectedRowsData;
    var selectedItemsLength = data.length;

    $("#spanSelectedCount2").text(selectedItemsLength);

    if (data.length >= 0) {
        var UserGridSelected2 = GetDataGridInstance('UserGridSelected2');
        UserGridSelected2.option("dataSource", data);
    }
}

//================
$(document).on('change', '#chkShowSelectedUsers2', function (event) {
    if ($(this).is(":checked")) {
        $('#divSelectedUsers2').show();
        var UserGridSelected = GetDataGridInstance('UserGridSelected2');
        UserGridSelected.refresh();
    }
    else {
        $('#divSelectedUsers2').hide();
    }
});

function UnSelectRow2(id) {
    var UserGridSelected2 = GetDataGridInstance('UserGridSelected2');
    var keys = [];
    keys.push(id);

    UserGridSelected2.selectRows(keys, false);

    var grid = GetDataGridInstance('UserGrid2');
    grid.deselectRows(keys);
}

var timeout = null;
function OnGrantTreeItemClick(e) {
    e.component.selectedItem = e.itemData;

    if (!timeout) {
        timeout = setTimeout(function () {
            timeout = null;
        }, 300);
    } else {
        GrantSelectedRole(); //Called on double click on node.
    }

}

function OnRevokeTreeItemClick(e) {
    e.component.selectedItem = e.itemData;

    if (!timeout) {
        timeout = setTimeout(function () {
            timeout = null;
        }, 300);
    } else {
        RevokeSelectedRole(); //Called on double click on node.
    }
}

function ShowColumnChooser(grid) {
    grid.showColumnChooser();
}

//function ExportUsers(grid) {
//    grid.exportToExcel(false);
//}


function ExportData(grid) {
    ExportToExcel(grid, false);
}

function ExportToExcel(grid, selectedOnly) {

    if (0 === grid.totalCount())
        return;

    if (selectedOnly) {
        var selectedItems = grid.getSelectedRowKeys();
        if (0 == selectedItems.length) {
            return;
        }
    }

    grid.exportToExcel(selectedOnly);
}


function ContextMenuForPermission_Preparing(e) {
    //if (e.row.rowType === "data") {
    e.items = [
        {
            text: "Export to",
            onItemClick: function () {
            },
            items: [{
                text: "Excel",
                onItemClick: function () {
                    ExportPermissions();
                }
            }]
        }];
    //}
}

function ExportPermissions() {
    var permissionsGrid = GetDataGridInstance('entityPermissions');
    if (0 === permissionsGrid.totalCount())
        return;

    permissionsGrid.exportToExcel(false);
}

function SetGroupIdForPermission(entityId, title) {
    SetPermissionView(entityId, 'Group:' + title, 'VGGroup', 'GroupEndPoint');
}

function SetRoleIdForPermission(entityId, title) {
    SetPermissionView(entityId, 'Role: ' + title, 'VGRole', 'RoleEndPoint');
}

function SetUserIdForPermission(entityId, title) {
    SetPermissionView(entityId, 'User: ' + title, 'VGUser', 'UserEndPoint');
}

function SetPermissionSetIdForPermission(entityId, title) {
    SetPermissionView(entityId, 'Permission Set: ' + title, 'VGApplication', 'PermissionSetEndPoint');
}

function SetPermissionView(entityId, title, areaNameToGetAllPermissions, controllerNameToGetAllPermissions) {
    viewPermissionsForEntityId = entityId;
    areaName = areaNameToGetAllPermissions;
    controllerName = controllerNameToGetAllPermissions;
    titleText = title;
}

function SetPermissionComingFromParameter(permissionIdParam, entityIdParam, entityTypeParam, entityNameParam) {
    permissionId = permissionIdParam;
    entityId = entityIdParam;
    entityType = entityTypeParam;
    entityName = entityNameParam;
}

function OnApplicationChartPointClick(e) {
    var data = e.target.data;

    var selectedColor = e.target.getColor();

    //var formdata = $("#frmAttendanceHoursChart").serializeArray();
    var searchObject = {};
    //$(formdata).each(function (index, obj) {
    //    searchObject[obj.name] = obj.value;
    //});


    LoadMonitoringEventLogs(data, searchObject, selectedColor, 'AttendanceHoursMonitoringEvents', 'GetAttendanceHoursMonitoringEvents');
    $("#monitoringEventViewerModal").modal('show');
}

function GrantRevokeRole(tree1, tree2, checkedRoleItems) {
    var currentRolesTreeSource = [];
    var newSource = [];

    for (var i = 0; i < checkedRoleItems.length; i++) {
        //Get Selected item
        var selectedItem = checkedRoleItems[i]; //tree1.selectedItem; //Get the current selected item

        if (null == selectedItem)
            continue;

        if (selectedItem.IsDisabled)
            continue;

        //Get selected item id
        var id = selectedItem.Id;

        //Check selected item is application or role.
        if (id.indexOf("|") <= 0)
            continue;

        //Get Tree 1 datasource and find selected object from it.
        var source = tree1.option("dataSource");

        var foundNodes = FindObjectsFromJSONArray(source, 'Id', id);

        if (null == foundNodes || 0 == foundNodes.length)
            continue;

        //Get selected node from the found list.
        var selectedNode = foundNodes[0];

        //Get Tree 2 datasource.
        currentRolesTreeSource = tree2.option("dataSource");

        //copy selected node to datasource of tree 2
        currentRolesTreeSource.push(selectedNode);

        //Create new source for tree 1 after removing selected id from the source.
        //var newSource = $.grep(source, function (e) {
        //    return e.Id != id;
        //});

        newSource = RemoveItemFromArray(source, id);
    }

    checkedGrantItemsGlobal = [];
    checkedRevokeItemsGlobal = [];

    //Refresh both tree view
    //Tree 1
    if (0 < newSource.length) {
        RefreshTreeView(tree1, newSource);
        //tree1.unselectAll();
    }

    //Tree 2
    if (0 < currentRolesTreeSource.length) {
        RefreshTreeView(tree2, currentRolesTreeSource);
        //tree2.unselectAll();
    }

    tree1.unselectAll();
    tree2.unselectAll();
}

function grantRoleTreeViewItem_selectionChanged(e) {
    var item = e.node, checkedItems = [];
    var selectedNode;
    var checkedGrantTree = e.component;

    if (IsChildNode(item)) {
        selectedNode = item.itemData;
        checkedItems.push(selectedNode);
    }
    else {
        $.each(item.items, function (index, node) {
            selectedNode = node.itemData;
            checkedItems.push(selectedNode);
        });
    }

    $.each(checkedItems, function (index, selectedTreeNode) {
        var foundNodes2 = FindObjectsFromJSONArray(checkedGrantItemsGlobal, 'Id', selectedTreeNode.Id);

        if (selectedTreeNode.IsDisabled) {
            checkedGrantTree.unselectItem(selectedTreeNode.Id);
            return; //equivalent to continue; and if break then return false;
        }

        if (selectedTreeNode.selected && 0 == foundNodes2.length) {
            checkedGrantItemsGlobal.push(selectedTreeNode);
        }

        if (!selectedTreeNode.selected && 0 < foundNodes2.length) {
            RemoveItemFromArray(checkedGrantItemsGlobal, selectedTreeNode.Id);
        }
    });
}




function revokeRoleTreeViewItem_selectionChanged(e) {
    var item = e.node, checkedItems = [];
    var selectedNode;
    var checkedRevokeTree = e.component;

    if (IsChildNode(item)) {
        selectedNode = item.itemData;
        checkedItems.push(selectedNode);
    }
    else {
        $.each(item.items, function (index, node) {
            selectedNode = node.itemData;
            checkedItems.push(selectedNode);
        });
    }

    $.each(checkedItems, function (index, selectedTreeNode) {
        var foundNodes2 = FindObjectsFromJSONArray(checkedRevokeItemsGlobal, 'Id', selectedTreeNode.Id);

        if (selectedTreeNode.IsDisabled) {
            checkedRevokeTree.unselectItem(selectedTreeNode.Id);
            return; //equivalent to continue; and if break then return false;
        }

        if (selectedTreeNode.selected && 0 == foundNodes2.length) {
            checkedRevokeItemsGlobal.push(selectedTreeNode);
        }

        if (!selectedTreeNode.selected && 0 < foundNodes2.length) {
            RemoveItemFromArray(checkedRevokeItemsGlobal, selectedTreeNode.Id);
        }
    });
}

function IsChildNode(data) {
    return !data.items.length;
}

function GetFormattedVariableString(variableName) {
    return '{' + variableName + '}';
}

//With append
function AddParameter(controlName, valueToAppend) {
    valueToAppend = GetFormattedVariableString(valueToAppend);
    let currentValue = $('#' + controlName + '').val();
    let inputSeperator = $('#' + controlName + '').attr('data-variableSeperator');

    if (inputSeperator === undefined) {
        inputSeperator = '';
    }
    valueToAppend = valueToAppend + inputSeperator;
    $('#' + controlName + '').val(currentValue + valueToAppend);
}

//Single value
function AddParameterSingle(controlName, valueToAppend) {
    valueToAppend = GetFormattedVariableString(valueToAppend);
    $('#' + controlName + '').val(valueToAppend);
}

function OnDataErrorOccurred(e) {
    let message = e.error.message;
    setTimeout(() => {
        let errorRow = document.querySelector(".dx-datagrid-edit-popup .dx-error-message");
        errorRow.innerHTML = message;
    });
}

function OnVGConfirm(confirmTitle, confirmMessage, onOKFunction) {
    $.confirm({
        title: confirmTitle,
        content: confirmMessage,
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
                    onOKFunction();
                }
            },
            cancel: {
                text: 'Cancel', // With spaces and symbols
                action: function () {
                    //$.alert('You clicked on "heyThere"');
                }
            }
        }
    });
}

function GetLoadPanelInstance(loadId) {
    return $("#" + loadId).dxLoadPanel("instance");
}

function ShowLoading(loadId, message = 'Please wait...') {
    GetLoadPanelInstance(loadId).option("message", message);
    GetLoadPanelInstance(loadId).show();
}

function HideLoading(loadId) {
    GetLoadPanelInstance(loadId).hide();
}

function ShowLoader() {
    $("#loadPanel").dxLoadPanel("instance").show();
    $(".dx-loadpanel-message").show();
}

function HideLoader() {
    $(".dx-loadpanel-message").hide();
    $("#loadPanel").dxLoadPanel("instance").hide();
}

function OnDataGridRowPrepared(e) {
    if (e.rowType == 'data') {
        e.rowElement[0].addEventListener("mouseover", function () {
            e.rowElement.find("td").css('background', '#e6e6e6');
            e.rowElement.css("transition", "background-color 0.5s");
        });
        e.rowElement[0].addEventListener("mouseleave", function () {
            e.rowElement.find("td").css('background', "");
        });
    }
}

function OnChartLegendClick(e) {
    var series = e.target;
    if (series.isVisible()) {
        series.hide();
    } else {
        series.show();
    }
}

function DownloadFile(urlToSend, fileName, dataToSend) {
    var req = new XMLHttpRequest();
    const queryString = new URLSearchParams(dataToSend).toString();
    let url = urlToSend + '?' + queryString;
    req.open("GET", url, true);

    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.responseType = "blob";

    req.onreadystatechange = function (oEvent) {
        if (req.readyState === 4) {
            if (req.status === 200) {
                var blob = req.response;
                if (0 < blob.size) {
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = fileName;
                    link.click();
                }
            } else {
                console.error("Error", req.statusText);
                return;
            }
        }
    };

    //req.onload = function (event) {
    //    var blob = req.response;
    //    if (0 < blob.size) {
    //        var link = document.createElement('a');
    //        link.href = window.URL.createObjectURL(blob);
    //        link.download = fileName;
    //        link.click();
    //    }
    //};

    req.send();
}

//function OnVGDataErrorOccurred(e) {
//    console.log(e);
//    this.dataErrorMessage = "The server returned an error: " + e.error.message;
//}

//function onVGLoadError(e) {
//    console.log(e);
//}

function ExpandAllTreeView(dxTreeViewId) {
    let dxTreeView = GetTreeViewInstance(dxTreeViewId);
    dxTreeView.expandAll();
    return false;
}

function CollapseAllTreeView(dxTreeViewId) {
    let dxTreeView = GetTreeViewInstance(dxTreeViewId);
    dxTreeView.collapseAll();
    return false;
}

function InitWebTour(steps, wt) {
    wt.setSteps(steps);
    wt.start();
}

function ReloadWithParam(params) {
    let url = window.location.href;
    if (url.indexOf('?') > -1) {
        url += '&' + params
    } else {
        url += '?' + params
    }
    window.location.href = url;
}

function IsQueryStringExists(field) {
    if (field.length) {
        field = field.toLowerCase();
    }
    var url = window.location.href.toLowerCase();
    if (url.indexOf('?' + field + '=') != -1)
        return true;
    else if (url.indexOf('&' + field + '=') != -1)
        return true;
    return false;
}

function FindQueryString() {
    var vars = [], hash;
    var hashes = window.location.href.toLowerCase().slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0].toLowerCase());
        vars.push(hash[1].toLowerCase());
        //vars[hash[0]] = hash[1].toLowerCase();
    }
    return vars;
}

//mm/dd/yyyy date validation
function IsValidDate(value) {
    if (value.match(/\d{1,2}[^\d]\d{1,2}[^\d]\d{4,4}/gi) == null)
        return false;
    else {
        var t = value.split(/[^\d]/);
        var m0 = parseInt(t[0], 10);// Month in JavaScript Date object is 0-based
        var dd = parseInt(t[1], 10) - 1;
        var yyyy = parseInt(t[2], 10);
        var date = moment(yyyy + "-" + m0 + "-" + dd);
        if (!date.isValid()) {
            return false;
        }
        return true;
    }
}

function IsPositiveInteger(val) {
    return val == "0" || ((val | 0) > 0 && val % 1 == 0);
}