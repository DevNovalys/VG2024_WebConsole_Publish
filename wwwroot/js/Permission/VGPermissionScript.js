
function UnSelectRow(id) {
    var permissionGridSelected = GetDataGridInstance('VGSelectedPermissionGrid');
    var keys = [];
    keys.push(id);

    permissionGridSelected.selectRows(keys, false);

    var treeList = GetTreeListInstance('PermissionTreeList');
    treeList.deselectRows(keys);
}

function OnSelectionChanged(selectedItems) {
    var data = selectedItems.selectedRowsData;
    var selectedItemsLength = data.length;

    $("#spanSelectedPermissionCount").text(selectedItemsLength);

    if (selectedItemsLength >= 0) {
        var permissionGridSelected = GetDataGridInstance('VGSelectedPermissionGrid');
        let permissionsData = $.grep(data, function (n, i) {
            return (!n.IsFolder);
        });
        permissionGridSelected.option("dataSource", permissionsData);

        if (selectedItemsLength == 1) {
            if (!data[0].IsFolder) {
                $("#duplicatePermission").removeClass("disabled");
            }
        }
        else {
            $("#duplicatePermission").addClass("disabled");
        }

        //=========================================
        var hasPermissionToDuplicatePermission = GetControlData('duplicatePermission', 'haspermission');
        hasPermissionToDuplicatePermission = hasPermissionToDuplicatePermission == 'True';
        if (!hasPermissionToDuplicatePermission) {
            if (!$("#duplicatePermission").hasClass('disabled')) {
                $("#duplicatePermission").addClass("disabled");
            }
        }

        //=========================================
        var hasPermissionToCreatePermission = GetControlData('createPermission', 'haspermission');
        hasPermissionToCreatePermission = hasPermissionToCreatePermission == 'True';
        if (!hasPermissionToCreatePermission) {
            if (!$("#createPermission").hasClass('disabled')) {
                $("#createPermission").addClass("disabled");
            }
        }
        else {
            var result = jQuery.grep(data, function (n, i) {
                return (!n.IsFolder);
            });
            if (data.length > 1 || result.length > 0) {
                if (!$("#createPermission").hasClass('disabled')) {
                    $("#createPermission").addClass("disabled");
                }
            }
            else {
                $("#createPermission").removeClass("disabled");
            }
        }

        //=========================================
        var hasPermissionToCreateFolder = GetControlData('createFolder', 'haspermission');
        hasPermissionToCreateFolder = hasPermissionToCreateFolder == 'True';
        if (!hasPermissionToCreateFolder) {
            if (!$("#createFolder").hasClass('disabled')) {
                $("#createFolder").addClass("disabled");
            }
        }
        else {
            var result = jQuery.grep(data, function (n, i) {
                return (!n.IsFolder);
            });

            if (data.length > 1 || result.length > 0) {
                if (!$("#createFolder").hasClass('disabled')) {
                    $("#createFolder").addClass("disabled");
                }
            }
            else {
                $("#createFolder").removeClass("disabled");
            }
        }
    }


}

function OnContextMenuPreparing(e) {
    if (e.row.rowType === "data") {
        e.items = [{
            text: "Clear Selection",
            onItemClick: function () {
                ClearPermissionSelection();
            }
        },
        {
            text: "Column Chooser",
            onItemClick: function () {
                var treeList = GetTreeListInstance('PermissionTreeList');
                ShowColumnChooser(treeList);
            }
        }];
    }
}

function RefreshTreeList(treeList) {
    treeList.deselectAll();
    treeList.clearSelection();
    treeList.clearFilter();
    CollapseAllNodes();
    treeList.refresh();
}

function ClearPermissionSelection() {
    var treeList = GetTreeListInstance('PermissionTreeList');
    treeList.deselectAll();
    treeList.clearSelection();

    var treeListData = treeList.getSelectedRowsData();
    var gridSelected = GetDataGridInstance('VGSelectedPermissionGrid');
    gridSelected.option("dataSource", treeListData);
}

function RemovePermission(url, selectedIds, treeList) {

    if (0 == selectedIds.length) {
        selectedIds = JSON.stringify(selectedIds);
    }

    $.ajax({
        url: url,
        type: 'POST',
        cache: false,
        data: { selectedIds: selectedIds },
        success: function (result) {
            if (result.Success) {
                SuccessAlert(result.Data, 2000, null, 1000);
                RefreshTreeList(treeList);
            }
            else {
                ErrorAlert(result.Data, 1000, null, 0);
            }
        },
        error: function (xhr, status, error) {

        }
    });
}

var getNodeKeys = function (node) {
    var keys = [];
    keys.push(node.key);
    node.children.forEach(function (item) {
        keys = keys.concat(getNodeKeys(item));
    });
    return keys;
}

function CollapseAllNodes() {
    var treeList = GetTreeListInstance('PermissionTreeList');
    var keys = getNodeKeys(treeList.__root);
    treeList.beginUpdate();
    keys.forEach(function (key) {
        //expanded ? treeList.collapseRow(key) : treeList.expandRow(key);
        treeList.collapseRow(key);
    });

    treeList.endUpdate();
}

function RemovePermissionFolder(url, selectedIds, appId, treeList) {

    if (0 < selectedIds.length) {

        $.ajax({
            url: url,
            type: 'POST',
            cache: false,
            data: { selectedIds: selectedIds, applicationId: appId },
            success: function (result) {
                if (result.Success) {
                    SuccessAlert(result.Data, 2000, null, 1000);
                    RefreshTreeList(treeList);
                }
                else {
                    ErrorAlert(result.Data, 1000, null, 0);
                }
            },
            error: function (xhr, status, error) {

            }
        });
    }
}

$(document).on('change', '#chkShowSelectedpermissions', function (event) {
    if ($(this).is(":checked")) {
        $('#divSelectedPermissions').show();
        var permissionGridSelected = GetDataGridInstance('VGSelectedPermissionGrid');
        permissionGridSelected.refresh();
    }
    else {
        $('#divSelectedPermissions').hide();
    }
});

$(document).on('click', '#btnDuplicatepermission', function (event) {
    event.preventDefault();

    if ($("#frmDuplicatePermission").valid()) {

        var permissionName = $("#duplicatePermissionName").val();
        var url = GetControlActionUrl('btnDuplicatepermission');

        var treeList = GetTreeListInstance('PermissionTreeList');
        var selectedRows = treeList.getSelectedRowKeys();

        var selectedPermission = selectedRows[0];

        $.ajax({
            url: url,
            type: 'POST',
            data: { permissionName: permissionName, selectedPermissionId: selectedPermission },
            cache: false,
            success: function (result) {
                if (result.Success) {
                    SuccessAlert(result.Data, 2000, null, 1000);
                    $("#duplicatePermissionModal").modal('hide');

                    var treeList = GetTreeListInstance('PermissionTreeList');
                    RefreshTreeList(treeList);
                }
                else {
                    ErrorAlert(result.Data, 1000, null, 0);
                }
            },
            error: function (xhr, status, error) {

            }
        });

    }
});

$(document).on('click', '#removePermission', function (event) {
    event.preventDefault();
    var removeButton = $(this);

    var treeList = GetTreeListInstance('PermissionTreeList');
    var selectedRows = treeList.getSelectedRowKeys();
    var selectedRowsData = treeList.getSelectedRowsData();

    if (selectedRows.length === 0) {
        var selectOneMessage = removeButton.data('selectone-message');
        ErrorAlert(selectOneMessage, 1000, null, 0);
        return;
    }

    var permissionIds = [];

    var result = jQuery.grep(selectedRowsData, function (n, i) {
        return (n.IsFolder);
    });

    if (result.length > 0) {
        var selectOnlyOneMessage = removeButton.data('selectonlyone-message');
        ErrorAlert(selectOnlyOneMessage, 1000, null, 0);
        return;
    }

    result = jQuery.grep(selectedRowsData, function (n, i) {
        return (n.IsFolder);
    });

    if (result.length > 0) {
        var selectOnlyPermissionMessage = removeButton.data('selectonly-message');
        ErrorAlert(selectOnlyPermissionMessage, 1000, null, 0);
        return;
    }

    $.each(selectedRowsData, function (i, v) {
        if (!v.IsFolder) {
            permissionIds.push(v.Id);
        }
    });


    var confirmTitle = removeButton.data('removeconfirmtitle-message');
    var confirmMessage = removeButton.data('removeconfirm-message');

    OnVGConfirm(confirmTitle, confirmMessage, function () {
        var url = removeButton.data('request-url');
        RemovePermission(url, permissionIds, treeList);
    });
});

$(document).on('click', '#removeFolder', function (event) {
    event.preventDefault();
    var removeButton = $(this);
    var appId;

    var treeList = GetTreeListInstance('PermissionTreeList');
    var selectedRows = treeList.getSelectedRowKeys();
    var selectedRowsData = treeList.getSelectedRowsData();

    //Select atleast one item to remove folder.============================================
    if (selectedRows.length === 0) {
        var selectOneMessage = removeButton.data('selectone-message');
        ErrorAlert(selectOneMessage, 1000, null, 0);
        return;
    }

    var folderIds = [];

    //Select only folder ===============================================================
    result = jQuery.grep(selectedRowsData, function (n, i) {
        return (!n.IsFolder);
    });


    if (result.length > 0) {
        var selectOnlyFolderMessage = removeButton.data('selectonly-message');
        ErrorAlert(selectOnlyFolderMessage, 1000, null, 0);
        return;
    }

    //Select only one folder =====================================================================
    result = jQuery.grep(selectedRowsData, function (n, i) {
        return (n.IsFolder);
    });

    if (result.length > 1) {
        var selectOnlyOneMessage = removeButton.data('selectonlyone-message');
        ErrorAlert(selectOnlyOneMessage, 1000, null, 0);
        return;
    }

    //Check if child exists. =====================================================================
    result = jQuery.grep(selectedRowsData, function (n, i) {
        return (n.HasItems);
    });

    if (result.length > 0) {
        var hasItemsmessage = removeButton.data('childexists-message');
        ErrorAlert(hasItemsmessage, 1000, null, 0);
        return;
    }

    $.each(selectedRowsData, function (i, v) {
        if (v.IsFolder) {
            folderIds.push(v.Id);
        }
    });

    var confirmTitle = removeButton.data('removeconfirmtitle-message');
    var confirmMessage = removeButton.data('removeconfirm-message');

    OnVGConfirm(confirmTitle, confirmMessage, function () {
        var url = removeButton.data('request-url');
        appId = selectedRowsData[0].ApplicationId;

        RemovePermissionFolder(url, folderIds, appId, treeList);
    });
});

function PSToggleSelection(e, columnName) {
    var dgInstance = GetDataGridInstance('PowerServerSecurityGrid');
    var visibleRows = dgInstance.getVisibleRows();

    if (visibleRows.length > 0) {
        dgInstance.beginUpdate();
        for (var i = 0; i < visibleRows.length; i++) {
            if (visibleRows[i].rowType === 'group') {
                continue;
            }

            if (visibleRows[i].data.ComponentType === '_TABLE') {
                continue;
            }

            dgInstance.cellValue(visibleRows[i].rowIndex, columnName, e.value);
        }
        dgInstance.endUpdate();
    }
}

function sendBatchRequest(url, changes) {

    var dgInstance = GetDataGridInstance('PowerServerSecurityGrid');
    var visibleRows = dgInstance.getVisibleRows();

    let changeList = [];
    for (var i = 0; i < changes.length; i++) {
        let changeObj = {};
        let key = changes[i].key;

        changeObj.data = changes[i].data;
        changeObj.key = key;
        changeObj.type = changes[i].type;


        let selectedRow = visibleRows.filter(function (e) {
            return e.key === key;
        });
        changeObj.componentType = selectedRow[0].data.ComponentType;
        changeList.push(changeObj);
    }

    var d = $.Deferred();
    $.ajax(url, {
        method: "POST",
        //data: JSON.stringify(changes),
        data: JSON.stringify(changeList),
        cache: false,
        contentType: 'application/json',
        xhrFields: { withCredentials: true }
    }).done(d.resolve).fail(function (xhr) {
        d.reject(xhr.responseJSON ? xhr.responseJSON.Message : xhr.statusText);
    });

    return d.promise();
}

function CheckTableDataRows(gridInstance, data, columName) {
    let visibleRows = gridInstance.getVisibleRows();
    for (var i = 0; i < visibleRows.length; i++) {
        if (visibleRows[i].rowType !== 'data') {
            continue;
        }

        if (visibleRows[i].data.ComponentType === '_TABLE') {            
            continue;
        }

        if ($.inArray(visibleRows[i].data.Name, data) === -1) {
            gridInstance.cellValue(visibleRows[i].rowIndex, columName, false);
            continue;
        }

        gridInstance.cellValue(visibleRows[i].rowIndex, columName, true);
    }
}
