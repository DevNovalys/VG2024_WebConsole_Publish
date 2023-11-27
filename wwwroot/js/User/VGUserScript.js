

function ShowPasswordPolicyRules(ctrl, url) {    
    $.ajax({
        url: url,
        type: 'GET',
        cache: false,
        success: function (result) {
            if (result.Success) {
                $('#' + ctrl).popover({
                    title: 'Password Policy',
                    content: result.Data,
                    html: true,
                    trigger: 'focus',
                    placement: 'left',
                    toggle: 'popover',
                    container: 'body'
                });
                $('#' + ctrl).popover('show');
            }
            else {
                ErrorAlert(result.Data, 1000, null, 0);
            }
        },
        error: function (xhr, status, error) {
            ErrorAlert(error, 1000, null, 0);
        }
    });
}

function UnSelectUserRow(id) {
    var UserGridSelected = GetDataGridInstance('UserGridSelected');
    var keys = [];
    keys.push(id);

    UserGridSelected.selectRows(keys, false);

    var grid1 = GetDataGridInstance('UserGrid');
    grid1.deselectRows(keys);
}

function OnItemRendered(e) {
    var node = e.element.find(".dx-treeview-item");
    node.css("padding-top", "0px");
    node.css("padding-bottom", "0px");
    //node.css("min-height", "10px");

    var search = e.element.find(".dx-treeview-search");
    if (null != search) {
        search.css("max-width", "250px");
    }
}

function OnAssignGroupTreeItemClick(e) {
    e.component.selectedItem = e.itemData;

    if (!timeout) {
        timeout = setTimeout(function () {
            timeout = null;
        }, 300);
    } else {
        AssignSelectedGroup(); //Called on double click on node.
    }
}

function OnGroupGridRowClick(e) {
    var component = e.component;

    if (!component.clickCount)
        component.clickCount = 1;
    else
        component.clickCount = component.clickCount + 1;

    /* Would be nice to check if you are double clicking the same row */

    if (component.clickCount == 1) {
        // Capture clicktime on first click
        component.lastClickTime = new Date();

        /* Set a timer to clear the click info if no second click occurs within the interval...
           should be just longer than your double click interval test */
        setTimeout(function () { component.lastClickTime = 0; component.clickCount = 0; }, 300);
    }
    else if (component.clickCount == 2) {
        // Check your click interval.
        if (((new Date()) - component.lastClickTime) < 300) {
            //Double click code
            RemoveSelectedGroup(component.getSelectedRowsData()[0].Id);
        }

        // Reset your click info
        component.clickCount = 0;
        component.lastClickTime = 0;
    }
}

function ProcessUserAction(url, grid) {
    
    var selectedRow = grid.getSelectedRowKeys();    

    $.ajax({
        url: url,
        type: 'POST',
        cache: false,
        data: { userId: selectedRow },
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

function ClearSelection() {
    var grid1 = GetDataGridInstance('UserGrid');
    grid1.deselectAll();
    grid1.clearSelection();

    var data = grid1.getSelectedRowsData();
    var UserGridSelected = GetDataGridInstance('UserGridSelected');
    UserGridSelected.option("dataSource", data);
}

function ContextMenu_Preparing(e) {
    if (typeof canRightClick === 'undefined') {
        canRightClick = true;
    }

    if (!canRightClick)
        return;

    let grid = e.component;

    if (e.row.rowType === "data") {
        e.items = [{
            text: "Clear Selection",
            onItemClick: function () {
                ClearSelection();
            }
        },
        {
            text: "Clear State",
            onItemClick: function () {                
                let storageKey = grid.option("stateStoring").storageKey;
                localStorage.removeItem(storageKey);
            }
        },
        {
            text: "Export to Excel",
            onItemClick: function () {
                
            },
            items: [{
                text: "Selected",
                onItemClick: function () {
                    //var grid = GetDataGridInstance('UserGrid');
                    ExportToExcel(grid, true);
                }
            },
                {
                    text: "All",
                    onItemClick: function () {
                        //var grid = GetDataGridInstance('UserGrid');
                        ExportToExcel(grid, false);
                    }
            }]
        },
        {
            text: "Column Chooser",
            onItemClick: function () {
                //var grid = GetDataGridInstance('UserGrid');
                ShowColumnChooser(grid);
            }
        }];
    }
}



function selection_changed(selectedItems) {
    var data = selectedItems.selectedRowsData;
    var selectedItemsLength = data.length;

    $("#spanSelectedCount").text(selectedItemsLength);

    if (data.length >= 0) {
        var UserGridSelected = GetDataGridInstance('UserGridSelected');
        UserGridSelected.option("dataSource", data);        
    }
}

$(document).on('keydown', '#frmSearchUser', function (e) {
    if (e.which === 13) { // return
        $('#btnSearch').trigger('click');
    }
});

//================
$(document).on('change', '#chkShowSelectedUsers', function (event) {
    if ($(this).is(":checked")) {
        $('#divSelectedUsers').show();
        var UserGridSelected = GetDataGridInstance('UserGridSelected');
        UserGridSelected.refresh();
    }
    else {
        $('#divSelectedUsers').hide();
    }
});

$(document).on('click', '#btnSearch', function (event) {
    event.preventDefault();

    var btnSearch = $(this);

    var selected = $('#ddlSearchCriteria :selected');
    var selectedValue = selected.val();
    var selectedData = selected.data('attribute');
    var selectedSearchValue;
    var selectedSearchValue2;
    var ddlEqualsBetweenValue;
    var ddlSearchTextTypeValue = 0;

    if ($('#txtSearchValue1').length) {
        selectedSearchValue = $('#txtSearchValue1').val();
    }
    if ($('#ddlSearchCriteriaValue').length) {
        selectedSearchValue = $('#ddlSearchCriteriaValue').val();
    }
    if ($('#ddlEqualsBetween').length) {
        ddlEqualsBetweenValue = $('#ddlEqualsBetween').val();
    }
    if ($('#txtSearchValue2').length) {
        selectedSearchValue2 = $('#txtSearchValue2').val();
    }
    if($('#chkIncludeNewUsers').length) {
        selectedSearchValue2 = $('#chkIncludeNewUsers').is(":checked");
    }
    if ($('#ddlSearchTextType').length) {
        ddlSearchTextTypeValue = $('#ddlSearchTextType').val();
    }

    var url = btnSearch.data('request-url');

    $.ajax({
        url: url,
        type: 'POST',
        cache: false,
        data: { selectedValue: selectedValue, isAttribute: selectedData, selectedSearchValue: selectedSearchValue, equalBetweenValue: ddlEqualsBetweenValue, selectedSearchValue2: selectedSearchValue2, selectedSearchTextTypeValue: ddlSearchTextTypeValue },
        success: function (result) {
            if (result.Success) {
                var grid1 = GetDataGridInstance('UserGrid');
                grid1.clearFilter();
                grid1.filter([result.Data]);

                //ClearSelection();
            }
            else {
                ErrorAlert(result.Data, 1000, null, 0);
            }
        },
        error: function (xhr, status, error) {

        }
    });

});


$(document).on('change', '#ddlSearchCriteria', function () {

    var ddlSearchCriteria = $(this);

    var selected = $('option:selected', this);
    var selectedValue = selected.val();
    var selectedData = selected.data('attribute');

    var url = ddlSearchCriteria.data('request-url');
    //getLoadPanelInstance().show();

    $.ajax({
        url: url,
        type: 'GET',
        cache: false,
        data: { selectedValue: selectedValue, isAttribute: selectedData },
        complete: function () {
                    //getLoadPanelInstance().hide();
                },
        success: function (result) {
            $("#spnSearch").empty();
            $("#spnSearch").html(result);
        },
        error: function (xhr, status, error) {

        }
    });
});

$(document).ready(function () {

    //============ DUPLICATE USER
    $('#duplicateUser').click(function (event) {
        event.preventDefault();
        var duplicateUserButton = $(this);

        var dataGrid = GetDataGridInstance('UserGrid');
        var selectedRows = dataGrid.getSelectedRowKeys();        
        if (selectedRows.length !== 1) {
            var selectOneMessage = duplicateUserButton.data('selectone-message');
            ErrorAlert(selectOneMessage, 1000, null, 0);
            return;
        }

        let selectedRowsData = dataGrid.getSelectedRowsData()[0];
        let canDuplicateUser = selectedRowsData.CanDuplicateUser;

        if (!canDuplicateUser) {
            ErrorAlert('This functionality is not available for this type of users.', 1000, null, 0);
            return;
        }

        var confirmTitle = duplicateUserButton.data('confirmtitle-message');
        var confirmMessage = duplicateUserButton.data('confirm-message');
        

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
                        var url = duplicateUserButton.data('request-url');
                        var selectedRow = selectedRows[0];
                        window.location.href = url + '/' + selectedRow;
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

    });
    
    //============ REMOVE USER
    $('#removeUser').click(function (event) {
        event.preventDefault();
        var removeButton = $(this);

        var dataGrid = GetDataGridInstance('UserGrid');
        if (dataGrid.getSelectedRowKeys().length === 0) {
            var selectOneMessage = removeButton.data('selectone-message');
            ErrorAlert(selectOneMessage, 1000, null, 0);
            return;
        }

        var confirmTitle = removeButton.data('removeuserconfirmtitle-message');
        var confirmMessage = removeButton.data('removeuserconfirm-message');
        var url = removeButton.data('request-url');

        OnVGConfirm(confirmTitle, confirmMessage, function () { ProcessUserAction(url, dataGrid); });

        //$.SmartMessageBox({
        //    title: confirmTitle,
        //    content: confirmMessage,
        //    buttons: '[No][Yes]'
        //}, function (ButtonPressed) {
        //    if (ButtonPressed === "Yes") {
        //        var url = removeButton.data('request-url');
        //        ProcessUserAction(url, dataGrid);
        //    }
        //});
    });

    //============ LOCK USER
    $('#lockUser').click(function (event) {
        event.preventDefault();
        var lockUserButton = $(this);

        var dataGrid = GetDataGridInstance('UserGrid');
        if (dataGrid.getSelectedRowKeys().length === 0) {
            var selectOneMessage = lockUserButton.data('selectone-message');
            ErrorAlert(selectOneMessage, 1000, null, 0);
            return;
        }

        var confirmTitle = lockUserButton.data('removeconfirmtitle-message');
        var confirmMessage = lockUserButton.data('removeconfirm-message');
        var url = lockUserButton.data('request-url');
        OnVGConfirm(confirmTitle, confirmMessage, function () { ProcessUserAction(url, dataGrid); });
    });

    //============ UnLOCK USER
    $('#unLockUser').click(function (event) {
        event.preventDefault();
        var unLockUserButton = $(this);

        var dataGrid = GetDataGridInstance('UserGrid');
        if (dataGrid.getSelectedRowKeys().length === 0) {
            var selectOneMessage = unLockUserButton.data('selectone-message');
            ErrorAlert(selectOneMessage, 1000, null, 0);
            return;
        }

        var confirmTitle = unLockUserButton.data('removeconfirmtitle-message');
        var confirmMessage = unLockUserButton.data('removeconfirm-message');
        var url = unLockUserButton.data('request-url');
        OnVGConfirm(confirmTitle, confirmMessage, function () { ProcessUserAction(url, dataGrid); });
    });

    //============ Approve USER
    $('#approveUser').click(function (event) {
        event.preventDefault();
        var approveUserButton = $(this);

        var dataGrid = GetDataGridInstance('UserGrid');
        if (dataGrid.getSelectedRowKeys().length === 0) {
            var selectOneMessage = approveUserButton.data('selectone-message');
            ErrorAlert(selectOneMessage, 1000, null, 0);
            return;
        }

        var confirmTitle = approveUserButton.data('removeconfirmtitle-message');
        var confirmMessage = approveUserButton.data('removeconfirm-message');
        var url = approveUserButton.data('request-url');
        OnVGConfirm(confirmTitle, confirmMessage, function () { ProcessUserAction(url, dataGrid); });
    });

    //============ UnApprove USER
    $('#unApproveUser').click(function (event) {
        event.preventDefault();
        var unApproveUserButton = $(this);

        var dataGrid = GetDataGridInstance('UserGrid');
        if (dataGrid.getSelectedRowKeys().length === 0) {
            var selectOneMessage = unApproveUserButton.data('selectone-message');
            ErrorAlert(selectOneMessage, 1000, null, 0);
            return;
        }

        var confirmTitle = unApproveUserButton.data('removeconfirmtitle-message');
        var confirmMessage = unApproveUserButton.data('removeconfirm-message');
        var url = unApproveUserButton.data('request-url');
        OnVGConfirm(confirmTitle, confirmMessage, function () { ProcessUserAction(url, dataGrid); });
    });

//============ Generate Permission Matrix
    $('#userPermissionMatrix').click(function (event) {
        event.preventDefault();

        var userPermissionMatrixButton = $(this);
        var dataGrid = GetDataGridInstance('UserGrid');

        GenerateUserPermissionMatrix(dataGrid, userPermissionMatrixButton);
    });

    function GenerateUserPermissionMatrix(dataGrid, permissionMatrixButton) {
        var selectedItems = dataGrid.getSelectedRowKeys();
        if (0 === selectedItems.length) {
            var selectOneMessage = permissionMatrixButton.data('selectone-message');
            ErrorAlert(selectOneMessage, 1000, null, 0);
            return;
        }

        SetSelectedEntitiesForPermissionMatrix(selectedItems, 'User');
        $('#permissionMatrixModal').modal('show');
    }

    //============ Grant Role
    $('#grantRoleToSelectedUsers').click(function (event) {
        event.preventDefault();
        var grantRoleButton = $(this);

        var dataGrid = GetDataGridInstance('UserGrid');
        if (dataGrid.getSelectedRowKeys().length === 0) {
            var selectOneMessage = grantRoleButton.data('selectone-message');
            ErrorAlert(selectOneMessage, 1000, null, 0);
            return;
        }

        BindTreeToGrantRole();
        $("#grantRoleModal").modal();
        
    });

    //============ Revoke Role
    $('#revokeRoleFromSelectedUsers').click(function (event) {
        event.preventDefault();        
        var revokeRoleButton = $(this);

        var dataGrid = GetDataGridInstance('UserGrid');
        var selectedUsers = dataGrid.getSelectedRowKeys();

        if (selectedUsers.length === 0) {
            var selectOneMessage = revokeRoleButton.data('selectone-message');
            ErrorAlert(selectOneMessage, 1000, null, 0);
            return;
        }

        var url = revokeRoleButton.data('request-url');        
        BindTreeToRevokeRole(url, selectedUsers);

        $("#revokeRoleModal").modal();
    });

    //============ Assign Group
    $('#assignGroup').click(function (event) {
        event.preventDefault();
        var assignGroupButton = $(this);

        var dataGrid = GetDataGridInstance('UserGrid');
        if (dataGrid.getSelectedRowKeys().length === 0) {
            var selectOneMessage = assignGroupButton.data('selectone-message');
            ErrorAlert(selectOneMessage, 1000, null, 0);
            return;
        }

        $("#assignGroupModal").modal();
        BindTreeToAssignGroup();
    });

    //============ Remove Group
    $('#removeGroup').click(function (event) {
        event.preventDefault();
        var removeGroupButton = $(this);

        var dataGrid = GetDataGridInstance('UserGrid');
        if (dataGrid.getSelectedRowKeys().length === 0) {
            var selectOneMessage = removeGroupButton.data('selectone-message');
            ErrorAlert(selectOneMessage, 1000, null, 0);
            return;
        }

        $("#removeGroupModal").modal();
        BindTreeToRemoveGroup();
    });

    
});



