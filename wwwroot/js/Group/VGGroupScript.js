
function OnItemRendered(e) {
    var node = e.element.find(".dx-treeview-item");
    node.css("padding-top", "0px");
    node.css("padding-bottom", "0px");
    node.css("min-height", "10px");

    var search = e.element.find(".dx-treeview-search");
    if (null !== search) {
        search.css("max-width", "250px");
    }
}

var getNodeKeys = function (node) {
    var keys = [];
    keys.push(node.key);
    node.children.forEach(function (item) {
        keys = keys.concat(getNodeKeys(item));
    });
    return keys;
};

function CollapsAllNodes() {   
    var treeList = GetTreeListInstance('GroupTreeList');
    var keys = getNodeKeys(treeList.getRootNode());
    treeList.beginUpdate();
    keys.forEach(function (key) {
        treeList.collapseRow(key);
    });
    treeList.endUpdate();     
}

function ProcessGroupAction(url, tree, rowsToProcess) {    
    if (null === rowsToProcess) {
        rowsToProcess = JSON.stringify(rowsToProcess);
    }

    $.ajax({
        url: url,
        type: 'POST',
        cache: false,
        data: { groupIds: rowsToProcess },
        success: function (result) {
            if (result.Success) {
                SuccessAlert(result.Data, 2000, null, 1000);   
                CollapsAllNodes();
                tree.deselectAll();
                tree.clearSelection();

                jsFilterValue = '';
                tree.refresh();
            }
            else {
                ErrorAlert(result.Data, 1000, null, 0);
            }
        },
        error: function (xhr, status, error) {

        }
    });
}

//============ Generate Permission Matrix
$('#groupPermissionMatrix').click(function (event) {
        event.preventDefault();
        var permissionMatrixButton = $(this);
        var treeList = GetTreeListInstance('GroupTreeList');

        GenerateGroupsUserPermissionMatrix(treeList, permissionMatrixButton);
});

$('#generatePermMatrixGroupUsers').click(function (event) {
    event.preventDefault();

    var userPermissionMatrixButton = $(this);    
    var dataGrid = GetDataGridInstance('UserGrid2');

    GenerateUserPermissionMatrixForGroup(dataGrid, userPermissionMatrixButton);
});

function GenerateUserPermissionMatrixForGroup(dataGrid, permissionMatrixButton) {
    var selectedItems = dataGrid.getSelectedRowKeys();
    if (0 === selectedItems.length) {
        var selectOneMessage = permissionMatrixButton.data('selectone-message');
        ErrorAlert(selectOneMessage, 1000, null, 0);
        return;
    }

    SetSelectedEntitiesForPermissionMatrix(selectedItems, 'User');
    $('#permissionMatrixModal').modal('show');
}


function GenerateGroupsUserPermissionMatrix(treeList, permissionMatrixButton) {    
    var selectedItems = treeList.getSelectedRowKeys();
    if (0 === selectedItems.length) {
        var selectOneMessage = permissionMatrixButton.data('selectone-message');
        ErrorAlert(selectOneMessage, 1000, null, 0);
        return;
    }

    SetSelectedEntitiesForPermissionMatrix(selectedItems, 'Group');
    $('#permissionMatrixModal').modal('show');
}

//================
$('#chkShowSelectedGroups').change(function () {
    if ($(this).is(":checked")) {
        $('#divSelectedGroups').show();
        //var treeList = GetTreeListInstance('GroupTreeList');
        //treeList.refresh();
    }
    else {
        $('#divSelectedGroups').hide();
    }
});

//============ REMOVE GROUP
$('#deleteGroup').click(function (event) {    
    event.preventDefault();
    var removeButton = $(this);

    var treeList = GetTreeListInstance('GroupTreeList');
    var selectedGroupsData = treeList.getSelectedRowsData();
    var rowsToRemove = [];

    if (null === selectedGroupsData || selectedGroupsData.length === 0) {
        var selectOneMessage = removeButton.data('selectone-message');
        ErrorAlert(selectOneMessage, 1000, null, 0);
        return;
    }

    var isChildSelected = true;
    $.each(selectedGroupsData, function (key, value) {        
        if (!value.HasItems) {
            rowsToRemove.push(value.Id);
            return;
        }
        else {
            arr = jQuery.grep(selectedGroupsData, function (a) {
                return a.ParentId === value.Id;
            });

            if (null !== arr && arr.length > 0) {
                rowsToRemove.push(value.Id);
            }
            else {
                isChildSelected = false;                
                return false;
            }
        }
    });

    if (!isChildSelected) {
        var childExistsMessage = removeButton.data('childexists-message');
        ErrorAlert(childExistsMessage, 1000, null, 0);
        return;
    }

    var confirmTitle = removeButton.data('confirmtitle-message');
    var confirmMessage = removeButton.data('confirmmessage-message');

    OnVGConfirm(confirmTitle, confirmMessage, function ()
    {
        var url = removeButton.data('request-url');
        ProcessGroupAction(url, treeList, rowsToRemove);
    });
});

//============ Grant Role
$('#grantRole').click(function (event) {
    event.preventDefault();
    var grantRoleButton = $(this);
    var treeList = GetTreeListInstance('GroupTreeList');
    var selectedGroups = treeList.getSelectedRowKeys();
    if (null === selectedGroups || selectedGroups.length === 0) {
        var selectOneMessage = grantRoleButton.data('selectone-message');
        ErrorAlert(selectOneMessage, 1000, null, 0);
        return;
    }

    BindTreeToGrantRole();
    $("#grantRoleModal").modal();
    
});

//============ Revoke Role
$('#revokeRole').click(function (event) {    
    event.preventDefault();
    var revokeRoleButton = $(this);
    var treeList = GetTreeListInstance('GroupTreeList');
    var selectedGroups = treeList.getSelectedRowKeys();

    if (null === selectedGroups || selectedGroups.length === 0) {
        var selectOneMessage = revokeRoleButton.data('selectone-message');
        ErrorAlert(selectOneMessage, 1000, null, 0);
        return;
    }

    var url = revokeRoleButton.data('request-url');    
    BindTreeToRevokeRole(url, selectedGroups);

    $("#revokeRoleModal").modal();
});

//============ Add user from index page
$('#addUserToGroup').click(function (event) {
    event.preventDefault();
    var addUserToGroupButton = $(this);

    var treeList = GetTreeListInstance('GroupTreeList');
    var selectedGroups = treeList.getSelectedRowKeys();

    if (selectedGroups.length === 0) {
        var selectOneMessage = addUserToGroupButton.data('selectone-message');
        ErrorAlert(selectOneMessage, 1000, null, 0);
        return;
    }

    //var url = addUserToGroupButton.data('request-url');
    //BindTreeToRevokeRole(url, selectedGroups);

    $("#addUserModal").modal();
});

//============ add user from edit group
$('#assignUsersToGroups').click(function (event) {
    
    event.preventDefault();   

    $("#addUserModal").modal();
});



