function OnEventLogCellHoverChanged(e) {
    e.cellElement.mousemove(function () {
        if (e.columnIndex === 0 || e.columnIndex === 2) {
            if (e.rowType === 'data') {
                var id = e.row.data.Id;
                var message = e.row.data.Message;
                popover = GetPopOver();
                popover.option("contentTemplate", message);
                popover.option("target", e.cellElement[0]);
                $("#popoverContainer").dxPopover("show");
            }
        }
    });
}

function ShowEventLogMessage(id, containerBody, message) {

    //var eventLogGrid = GetDataGridInstance('EventLogGrid');
    //var keys = [];
    //keys.push(id);

    //eventLogGrid.selectRows(keys, false);

    //var selectedRow = GetDataGridSelectedRowData('EventLogGrid');

    $('.popover').remove();

    $('#' + id).popover({
        title: 'Message',
        content: message, //selectedRow[0].Message,
        html: true,
        trigger: 'hover',
        placement: 'right',
        toggle: 'popover',
        container: containerBody
    });
    $('#' + id).popover('show');
}

function ExportCurrentPageToExcel(grid) {
    grid.selectAll();
    grid.beginUpdate();
    grid.columnOption("Message", "visible", true);

    ExportToExcel(grid, true);

    grid.columnOption("Message", "visible", false);
    grid.endUpdate();
    grid.deselectAll();
}

function ExportAllToExcel(grid) {    
    grid.beginUpdate();
    grid.columnOption("Message", "visible", true);

    ExportToExcel(grid, false);

    grid.columnOption("Message", "visible", false);
    grid.endUpdate();    
}

function OnEventLogContextMenuPreparing(e) {
    
    if (typeof canRightClick === 'undefined') {
        canRightClick = true;
    }   

    if (!canRightClick)
        return;

    var grid = e.component;

    if (e.row.rowType === "data") {
        e.items = [{
            text: "Refresh",
            onItemClick: function () {                
                grid.refresh();
            }
        },
        {
            text: "Export to Excel",
            onItemClick: function () {

            },
            items: [{
                text: "Current Page",
                onItemClick: function () {
                    ExportCurrentPageToExcel(grid);
                }
            },
            {
                text: "All",
                onItemClick: function () {                    
                    ExportAllToExcel(grid);
                }
            }]
        },
        {
            text: "Column Chooser",
            onItemClick: function () {                
                ShowColumnChooser(grid);
            }
        }];
    }
}