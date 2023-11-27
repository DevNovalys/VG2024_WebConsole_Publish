function UnSelectRow(id) {
    var roleGridSelected = GetDataGridInstance('VGSelectedRole');
    var keys = [];
    keys.push(id);

    roleGridSelected.selectRows(keys, false);

    var grid1 = GetDataGridInstance('RoleGrid');
    grid1.deselectRows(keys);
}


function roleSelection_changed(selectedItems) {

    //Grant Permission Set
    var hasPermission = GetControlData('editPermissionSetsLI', 'haspermission');
    hasPermission = hasPermission === 'True';

    if (!hasPermission) {
        if (!$("#editPermissionSetsLI").hasClass('disabled')) {
            $("#editPermissionSetsLI").addClass("disabled");
        }

        //if (!$("#editPermissionsLI").hasClass('disabled')) {
        //    $("#editPermissionsLI").addClass("disabled");
        //}
        //return;
    }

    //Grant Permission
    hasPermission = GetControlData('editPermissionsLI', 'haspermission');
    hasPermission = hasPermission === 'True';

    if (!hasPermission) {
        if (!$("#editPermissionsLI").hasClass('disabled')) {
            $("#editPermissionsLI").addClass("disabled");
        }
    }

    var data = selectedItems.selectedRowsData;
    var selectedItemsLength = data.length;

    $("#spanSelectedRoleCount").text(selectedItemsLength);

    if (data.length >= 0) {
        var roleGridSelected = GetDataGridInstance('VGSelectedRole');
        roleGridSelected.option("dataSource", data);


        //Enable edit permission and permission set
        if (data.length === 1 && !data[0].IsMembershipManagerRole) {
            $("#editPermissionSetsLI").removeClass("disabled");
            $("#editPermissionsLI").removeClass("disabled");
        }
        else {
            $("#editPermissionSetsLI").addClass("disabled");
            $("#editPermissionsLI").addClass("disabled");
        }
    }
    else {
        //Disable edit permission and permission set
        $("#editPermissionSetsLI").addClass("disabled");
        $("#editPermissionsLI").addClass("disabled");
    }
}

function roleContextMenu_Preparing(e) {
    let grid = e.component;
    if (e.row.rowType === "data") {
        e.items = [{
            text: "Clear Selection",
            onItemClick: function () {
                ClearRoleSelection();
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
                var grid = GetDataGridInstance('RoleGrid');
                ShowColumnChooser(grid);
            }
        }];
    }
}

function ClearRoleSelection() {
    var grid = GetDataGridInstance('RoleGrid');
    grid.deselectAll();
    grid.clearSelection();

    var data = grid.getSelectedRowsData();
    var roleGridSelected = GetDataGridInstance('VGSelectedRole');
    roleGridSelected.option("dataSource", data);
}

function ProcessRoleAction(url, grid) {

    var selectedRow = grid.getSelectedRowKeys();
    var data = grid.getSelectedRowsData();
    var applicationId = data[0].ApplicationId;

    $.ajax({
        url: url,
        type: 'POST',
        cache: false,
        data: { roleId: selectedRow, appId: applicationId },
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

function BindTreeToGrantRevokePermissions(url, roleId, appId) {
    $.ajax({
        url: url,
        type: 'GET',
        data: { roleId: roleId, appId: appId },
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



function BindDataToAllPermissionSetTree(data) {
    var allPermissionSetsTree = GetAllPermissionSetTreeViewInstance();    
    allPermissionSetsTree.option("dataSource", data);
}

function BindDataToCurrentPermisionSetsTree(data) {
    var currentPermissionSetsTree = GetCurrentPermissionSetTreeViewInstance();
    currentPermissionSetsTree.option("dataSource", data);
}


function RefreshTreeView(tree, source) {
    tree.option("dataSource", []);
    tree.option("dataSource", source);
}



//============================ Events

//============ Generate Permission Matrix
$('#rolePermissionMatrix').click(function (event) {
        event.preventDefault();
        var permissionMatrixButton = $(this);

        var roleGrid = GetDataGridInstance('RoleGrid');
    var selectedItems = roleGrid.getSelectedRowKeys();
    
        if (selectedItems.length === 0) {
            var selectOneMessage = permissionMatrixButton.data('selectone-message');
            ErrorAlert(selectOneMessage, 1000, null, 0);
            return;
        }

    let selectedData = roleGrid.getSelectedRowsData();
    let applicationId = selectedData[0].ApplicationId;
    SetSelectedEntitiesForPermissionMatrix(selectedItems, 'Role', applicationId);
        $('#permissionMatrixModal').modal('show');
});

//================
$(document).on('change', '#chkShowSelectedRoles', function (event) {
    if ($(this).is(":checked")) {
        $('#divSelectedRoles').show();
        var roleGridSelected = GetDataGridInstance('VGSelectedRole');
        roleGridSelected.refresh();
    }
    else {
        $('#divSelectedRoles').hide();
    }
});

$('#generatePermMatrixGroupRoles').click(function (event) {
    event.preventDefault();

    var userPermissionMatrixButton = $(this);
    var dataGrid = GetDataGridInstance('UserGrid2');

    GenerateUserPermissionMatrixForRoles(dataGrid, userPermissionMatrixButton);
});

function GenerateUserPermissionMatrixForRoles(dataGrid, permissionMatrixButton) {
    var selectedItems = dataGrid.getSelectedRowKeys();
    if (0 === selectedItems.length) {
        var selectOneMessage = permissionMatrixButton.data('selectone-message');
        ErrorAlert(selectOneMessage, 1000, null, 0);
        return;
    }

    SetSelectedEntitiesForPermissionMatrix(selectedItems, 'User');
    $('#permissionMatrixModal').modal('show');
}

//============ REMOVE Group

$(document).on('click', '#removeRole', function (event) {
    event.preventDefault();
    var removeButton = $(this);

    var dataGrid = GetDataGridInstance('RoleGrid');
    if (dataGrid.getSelectedRowKeys().length === 0) {
        var selectOneItemMessage = removeButton.data('selectone-message');
        ErrorAlert(selectOneItemMessage, 1000, null, 0);
        return;
    }

    var confirmTitle = removeButton.data('removeroletitle-message');
    var confirmMessage = removeButton.data('removerole-message');

    OnVGConfirm(confirmTitle, confirmMessage, function ()
    {
        var url = removeButton.data('request-url');
        ProcessRoleAction(url, dataGrid);
    });
});

function GetAllPermissionSetTreeViewInstance() {
    return GetTreeViewInstance('allPermissionSetsTree');
}

function GetCurrentPermissionSetTreeViewInstance() {
    return GetTreeViewInstance('currentPermissionSetsTree');
}



function BindGroupsToAssignForRole(result) {
    var allGroupsTree = GetAllGroupsTree();
    allGroupsTree.option("dataSource", result);
}

function BindGroupsToRemoveFromRole(result) {
    var assignedGroupsGrid = GetAssignedGroupsGrid();
    assignedGroupsGrid.option("dataSource", result);
}

function RemoveUsersFromRole(url, selectedUsers, selectedItems, applicationId) {
    $.ajax({
        url: url,
        type: 'POST',
        async: false,
        data: { userIds: selectedUsers, roleIds: selectedItems, applicationId: applicationId },
        cache: false,
        success: function (result) {
            if (result.Success) {
                SuccessAlert(result.Data, 1000, null, 1000);                
                $("#removeUserModal").modal("hide");
            }
            else {
                ErrorAlert(result.Data, 1000, null, 0);
            }
        },
        error: function (xhr, status, error) {

        }
    });
}

//=========== Edit Permission Sets
$(document).on('click', '#editPermissionSets', function (event) {
    event.preventDefault();
    var editPermissionSetsButton = $(this);
        
    var dataGridSelectedItems = GetDataGridSelectedRowKeys('RoleGrid');
    if (dataGridSelectedItems.length === 0) {
        var selectoneMessage = editPermissionSetsButton.data('selectone-message');
        ErrorAlert(selectoneMessage, 1000, null, 0);
        return;
    }

    if (dataGridSelectedItems.length > 1) {
        var selectonlyoneMessage = editPermissionSetsButton.data('selectonlyone-message');
        ErrorAlert(selectonlyoneMessage, 1000, null, 0);
        return;
    }   

    $("#grantRevokePermissionSetsModal").modal();
});

//Edit Permissions
$(document).on('click', '#editPermissions', function (event) {
    event.preventDefault();
    var editPermissionsButton = $(this);

    var dataGridSelectedItems = GetDataGridSelectedRowKeys('RoleGrid');
    if (dataGridSelectedItems.length === 0) {
        var selectoneMessage = editPermissionsButton.data('selectone-message');
        ErrorAlert(selectoneMessage, 1000, null, 0);
        return;
    }

    if (dataGridSelectedItems.length > 1) {
        var selectonlyoneMessage = editPermissionsButton.data('selectonlyone-message');
        ErrorAlert(selectonlyoneMessage, 1000, null, 0);
        return;
    }

    $("#grantRevokePermissionsModal").modal();
});


$(document).on('click', '#grantRoleToUsers', function (event) {
    event.preventDefault();
    var grantRoleToUsersButton = $(this);

    var roleGrid = GetDataGridInstance('RoleGrid');
    var selectedRolesData = roleGrid.getSelectedRowsData();

    if (null === selectedRolesData || selectedRolesData.length === 0) {
        var selectoneMessage = grantRoleToUsersButton.data('selectone-message');
        ErrorAlert(selectoneMessage, 1000, null, 0);
        return;
    }

    var foundRoleNotGrantedToUsers = $.grep(selectedRolesData, function (e) {
        return e.CanGrantToUser !== true;
    });

    //If any one selected role can not be granted to user then return.
    if (0 < foundRoleNotGrantedToUsers.length) {
        var errorInGrantRoleMessage = grantRoleToUsersButton.data('erroringrantrole-message');
        ErrorAlert(errorInGrantRoleMessage, 1000, null, 0);
        return;
    }

    $("#addUserModal").modal();    
});

$(document).on('click', '#revokeRoleFromUsers', function (event) {
    event.preventDefault();
    var revokeRoleFromUsersButton = $(this);

    var roleGrid = GetDataGridInstance('RoleGrid');
    var selectedRoles = roleGrid.getSelectedRowKeys();

    if (null === selectedRoles || selectedRoles.length === 0) {
        var selectoneMessage = revokeRoleFromUsersButton.data('selectone-message');
        ErrorAlert(selectoneMessage, 1000, null, 0);
        return;
    }

    $("#removeUserModal").modal();    
    
});

$(document).on('click', '#editGroups', function (event) {
    event.preventDefault();
    var editGroupsButton = $(this);

    var roleGrid = GetDataGridInstance('RoleGrid');
    var selectedRoles = roleGrid.getSelectedRowKeys();

    if (null === selectedRoles || selectedRoles.length === 0) {
        var selectoneMessage = editGroupsButton.data('selectone-message');
        ErrorAlert(selectoneMessage, 1000, null, 0);
        return;
    }
    
    $("#assignRemoveGroups").modal();

});

$(document).on('click', '#addRole', function (event) {
    event.preventDefault();
        
    if (null !== wt) {
        wt.stop();
    }
    $("#createRoleModal").modal();
});




