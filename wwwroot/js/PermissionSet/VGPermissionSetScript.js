$(document).on('change', '#chkShowSelectedpermissionSets', function (event) {
    if ($(this).is(":checked")) {
        $('#divSelectedPermissionSets').show();
        var permissionSetGridSelected = GetDataGridInstance('VGSelectedPermissionSet');
        permissionSetGridSelected.refresh();
    }
    else {
        $('#divSelectedPermissionSets').hide();
    }
});

$(document).on('click', '#removePermissionSet', function (event) {
    event.preventDefault();
    var removeButton = $(this);

    var dataGrid = GetDataGridInstance('PermissionSetGrid');
    if (dataGrid.getSelectedRowKeys().length === 0) {
        var selectOneMessage = removeButton.data('selectone-message');
        ErrorAlert(selectOneMessage, 1000, null, 0);
        return;
    }

    var confirmTitle = removeButton.data('confirmtitle-message');
    var confirmMessage = removeButton.data('confirm-message');

    OnVGConfirm(confirmTitle, confirmMessage, function ()
    {
        var url = removeButton.data('request-url');
        ProcessPermissionSetAction(url, dataGrid);
    });
});


$(document).on('click', '#editPermissionSets', function (event) {
    event.preventDefault();
    var editPermissionSetsButton = $(this);

    var dataGridSelectedItems = GetDataGridSelectedRowKeys('PermissionSetGrid');
    if (dataGridSelectedItems.length === 0) {
        var editPermissionSetSelectOne = editPermissionSetsButton.data('selectone-message');
        ErrorAlert(editPermissionSetSelectOne, 1000, null, 0);
        return;
    }

    if (dataGridSelectedItems.length > 1) {
        var editPermissionSetSelectOnlyOne = editPermissionSetsButton.data('selectonlyone-message');
        ErrorAlert(editPermissionSetSelectOnlyOne, 1000, null, 0);
        return;
    }

    $("#grantRevokePermissionSetsModal").modal();
});

//============ Generate Permission Matrix
$('#permissionSetPermissionMatrix').click(function (event) {
        event.preventDefault();
        var permissionMatrixButton = $(this);

        var selectedItems = GetDataGridSelectedRowKeys('PermissionSetGrid');        
        if (selectedItems.length === 0) {
            var selectOneMessage = permissionMatrixButton.data('selectone-message');
            ErrorAlert(selectOneMessage, 1000, null, 0);
            return;
        }

        var permissionSetGrid = GetDataGridInstance('PermissionSetGrid');
        let selectedData = permissionSetGrid.getSelectedRowsData();
        let applicationId = selectedData[0].ApplicationId;
        SetSelectedEntitiesForPermissionMatrix(selectedItems, 'PermissionSet', applicationId);
        $('#permissionMatrixModal').modal('show');
});

//Edit Permissions
$(document).on('click', '#editPermissions', function (event) {
    event.preventDefault();
    var editPermissionsButton = $(this);

    var dataGridSelectedItems = GetDataGridSelectedRowKeys('PermissionSetGrid');
    if (dataGridSelectedItems.length === 0) {
        var editPermissionsButtonSelectOne = editPermissionsButton.data('selectone-message');
        ErrorAlert(editPermissionsButtonSelectOne, 1000, null, 0);
        return;
    }

    if (dataGridSelectedItems.length > 1) {
        var editPermissionSetSelectOnlyOne = editPermissionsButton.data('selectonlyone-message');
        ErrorAlert(editPermissionSetSelectOnlyOne, 1000, null, 0);
        return;
    }

    $("#grantRevokePermissionsModal").modal();
});

//Edit Roles
$(document).on('click', '#editRoles', function (event) {
    event.preventDefault();
    var editRolesButton = $(this);

    var dataGridSelectedItems = GetDataGridSelectedRowKeys('PermissionSetGrid');
    if (dataGridSelectedItems.length === 0) {
        var editRolesButtonSelectOne = editRolesButton.data('selectone-message');
        ErrorAlert(editRolesButtonSelectOne, 1000, null, 0);
        return;
    }

    if (dataGridSelectedItems.length > 1) {
        var editRolesButtonSelectOnlyOne = editRolesButton.data('selectonlyone-message');
        ErrorAlert(editRolesButtonSelectOnlyOne, 1000, null, 0);
        return;
    }

    $("#grantRevokeRoles").modal();
});



//===========================================================================================================

function OnItemRendered(e) {
    var node = e.element.find(".dx-treeview-item");
    node.css("padding-top", "0px");
    node.css("padding-bottom", "0px");
    node.css("min-height", "10px");

    var search = e.element.find(".dx-treeview-search");
    if (null != search) {
        search.css("max-width", "250px");
    }
}

function BindTreeToGrantRevokePermissions(url, permissionSetId) {
    $.ajax({
        url: url,
        type: 'GET',
        data: { permissionSetId: permissionSetId },
        cache: false,
        success: function (result) {
            if (result.Success) {
                BindDataToAllPermissionTree(result.Data.GrantTreesource);
                BindDataToCurrentPermisionTree(result.Data.RevokeTreeSource);
            }
            else {
                ErrorAlert(result.Data, 1000, null, 0);
            }
        },
        error: function (xhr, status, error) {

        }
    });
}

function RefreshTreeView(tree, source) {
    tree.option("dataSource", []);
    tree.option("dataSource", source);
}

function GetAllPermissionSetTreeViewInstance() {
    return GetTreeViewInstance('allPermissionSetsTree');
}

function GetCurrentPermissionSetTreeViewInstance() {
    return GetTreeViewInstance('currentPermissionSetsTree');
}

function BindDataToAllPermissionSetTree(data) {
    var allPermissionSetsTree = GetAllPermissionSetTreeViewInstance();
    allPermissionSetsTree.option("dataSource", data);
}

function BindDataToCurrentPermisionSetsTree(data) {
    var currentPermissionSetsTree = GetCurrentPermissionSetTreeViewInstance();
    currentPermissionSetsTree.option("dataSource", data);
}

function ProcessPermissionSetAction(url, grid) {

    var selectedRow = grid.getSelectedRowKeys();

    $.ajax({
        url: url,
        type: 'POST',
        cache: false,
        data: { permissionSetIds: selectedRow },
        success: function (result) {
            if (result.Success) {
                SuccessAlert(result.Data, 2000, null, 1000);
                grid.refresh();
                grid.deselectAll();
                grid.clearSelection();
            }
            else {
                ErrorAlert(result.Data, 1000, null, 0);
            }
        },
        error: function (xhr, status, error) {

        }
    });
}

function UnSelectRow(id) {
    var permissionSetGridSelected = GetDataGridInstance('VGSelectedPermissionSet');
    var keys = [];
    keys.push(id);

    //permissionSetGridSelected.selectRows(keys, false);
    //let rowIndex = permissionSetGridSelected.getRowIndexByKey(id);
    //permissionSetGridSelected.deleteRow(rowIndex);
    //permissionSetGridSelected.refresh();

    

    var grid1 = GetDataGridInstance('PermissionSetGrid');
    grid1.deselectRows(keys);

    let selectedLength = grid1.getSelectedRowKeys().length;
    if (0 === selectedLength) {
        //grid1.deselectAll();
        //grid1.clearSelection();

        var data = grid1.getSelectedRowsData();
        permissionSetGridSelected.option("dataSource", data);
    }
}

function permissionSetContextMenu_Preparing(e) {
    let grid = e.component;
    if (e.row.rowType === "data") {
        e.items = [{
            text: "Clear Selection",
            onItemClick: function () {
                ClearPermissionSetSelection();
            }
        },
        {
            text: "Export to Excel",
            onItemClick: function () {

            },
            items: [{
                text: "Selected",
                onItemClick: function () {
                    ExportToExcel(grid, true);
                }
            },
            {
                text: "All",
                onItemClick: function () {
                    ExportToExcel(grid, false);
                }
            }]
        },
        {
            text: "Column Chooser",
            onItemClick: function () {
                var grid = GetDataGridInstance('PermissionSetGrid');
                ShowColumnChooser(grid);
            }
        }];
    }
}

function ClearPermissionSetSelection() {
    var grid = GetDataGridInstance('PermissionSetGrid');
    grid.deselectAll();
    grid.clearSelection();

    var data = grid.getSelectedRowsData();
    var gridSelected = GetDataGridInstance('VGSelectedPermissionSet');
    gridSelected.option("dataSource", data);
}

function permissionSetSelection_changed(selectedItems) {
    
    var data = selectedItems.selectedRowsData;
    var selectedItemsLength = data.length;

    $("#spanSelectedPermissionSetCount").text(selectedItemsLength);

    if (0 < data.length) {
        var permissionSetGridSelected = GetDataGridInstance('VGSelectedPermissionSet');
        permissionSetGridSelected.option("dataSource", data);

        //Enable/Disable Remove button
        var systemPermissionSets = jQuery.grep(data, function (n, i) {
            return (n.IsBuiltIn);
        });

        var hasSystemPermissionSetSelected = 0 < systemPermissionSets.length;

        //Remove PermissionSet
        var hasPermissionToRemovePermissionSet = GetControlData('removePermissionSetLI', 'haspermission');
        hasPermissionToRemovePermissionSet = hasPermissionToRemovePermissionSet === 'True';
        if (!hasPermissionToRemovePermissionSet || hasSystemPermissionSetSelected) {
            if (!$("#removePermissionSetLI").hasClass('disabled')) {
                $("#removePermissionSetLI").addClass("disabled");
            }
        }
        else {
            $("#removePermissionSetLI").removeClass("disabled");
        }

        //removePermissionSetLI
        //Enable edit permission and permission set
        if (data.length === 1) {

            //Edit Permission Sets
            var hasPermissionToEditPermissionSets = GetControlData('editPermissionSetsLI', 'haspermission');
            hasPermissionToEditPermissionSets = hasPermissionToEditPermissionSets === 'True';
            if (!hasPermissionToEditPermissionSets || hasSystemPermissionSetSelected) {
                if (!$("#editPermissionSetsLI").hasClass('disabled')) {
                    $("#editPermissionSetsLI").addClass("disabled");
                }
            }
            else {
                $("#editPermissionSetsLI").removeClass("disabled");
            }

            //Edit Permissions
            var hasPermissionToEditPermissions = GetControlData('editPermissionsLI', 'haspermission');
            hasPermissionToEditPermissions = hasPermissionToEditPermissions === 'True';
            if (!hasPermissionToEditPermissions || hasSystemPermissionSetSelected) {
                if (!$("#editPermissionsLI").hasClass('disabled')) {
                    $("#editPermissionsLI").addClass("disabled");
                }
            }
            else {
                $("#editPermissionsLI").removeClass("disabled");
            }

            //Edit Roles
            var hasPermissionToEditRoles = GetControlData('editRolesLI', 'haspermission');
            hasPermissionToEditRoles = hasPermissionToEditRoles === 'True';
            if (!hasPermissionToEditRoles) {
                if (!$("#editRolesLI").hasClass('disabled')) {
                    $("#editRolesLI").addClass("disabled");
                }
            }
            else {
                $("#editRolesLI").removeClass("disabled");
            }
        }
        else {
            $("#editPermissionSetsLI").addClass("disabled");
            $("#editPermissionsLI").addClass("disabled");
            $("#editRolesLI").addClass("disabled");            
        }
       
    }
    else {
        //Disable edit permission and permission set
        $("#editPermissionSetsLI").addClass("disabled");
        $("#editPermissionsLI").addClass("disabled");
        $("#editRolesLI").addClass("disabled");
        $("#removePermissionSetLI").addClass("disabled");
    }
}

