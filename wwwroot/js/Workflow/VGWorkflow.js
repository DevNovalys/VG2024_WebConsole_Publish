function RemoveActiveGlobally() {
    $("#app a").removeClass('vgActive');
}

function GetClassFromNamespace(fullNamespace) {
    let nameSpace = fullNamespace.substring(0, fullNamespace.indexOf(','));
    let className = nameSpace.substring(nameSpace.lastIndexOf('.') + 1);

    return className;
}

function IsNodeValidated() {
    if (vgWorkflow.currentNode === null)
        return true;

    return vgWorkflow.currentNode.isNodeValidated;
}

function ShowNodeProperties() {

    $('#workflowPropertiesModal').modal('show');



    //$("#workflowArticle").removeClass();
    //$("#workflowArticle").addClass("col-sm-12 col-md-12 col-lg-9");
    //$("#nodePropertiesArticle").show();    
}

function HideNodeProperties() {
    $('#workflowPropertiesModal').modal('hide');

    //$("#workflowArticle").removeClass();
    //$("#workflowArticle").addClass("col-sm-12 col-md-12 col-lg-12");
    //$("#nodePropertiesArticle").hide();
}

function IsGuid(stringToTest) {
    if (stringToTest[0] === "{") {
        stringToTest = stringToTest.substring(1, stringToTest.length - 1);
    }
    var regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
    return regexGuid.test(stringToTest);
}

function FilterByActiveNodeTab(event) {
    var tab = document.getElementsByClassName("tab")[0];
    var ps = tab.getElementsByClassName("active")[0];
    var selectedTabType = ps.id.substring(1).toLowerCase();

    //var selectedTabType = $("#tab").find(".active").data("node-type").toLowerCase();
    var tabContentDataValue;
    var tabContentDataType;
    var searchValue = document.getElementById("nodeSearch");
    filter = searchValue.value.toLowerCase();

    $('#divContent').children('a').each(function () {
        tabContentDataType = $(this).data("node-type").toLowerCase();
        tabContentDataValue = $(this).data("node-value").toLowerCase();
        document.getElementById($(this).attr('id')).style.display = "none";

        if (selectedTabType === "all" || selectedTabType === tabContentDataType) {
            if (tabContentDataValue.toLowerCase().indexOf(filter) > -1) {
                document.getElementById($(this).attr('id')).style.display = "block";
            }
        }
    });
}

function ActiveNodeTab(evt, linkName) {
    var i, tabcontent, tablinks;

    //Mark clicked link to active.
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById("p" + linkName).className += " active";

    //Filter right panel according to the selected link

    $('#divContent').children('a').each(function () {
        document.getElementById($(this).attr('id')).style.display = "block";
        if (linkName !== "All" && $(this).data("node-type") !== linkName) {
            document.getElementById($(this).attr('id')).style.display = "none";
        }
    });
}

function GetNewNode(name, url) {    
    let nodeData;    
    $.ajax({
        url: url,
        type: 'GET',
        cache: false,
        async: false,
        data: { className: name },
        success: function (result) {
            if (result.Success) {                
                nodeData = JSON.parse(result.Data);

                //Since node data might come from cache, so generating new GUID.
                //nodeData.Id = GenerateGUID();
                GenerateIds(nodeData);
                nodeData.name = GetNewNodeName(nodeData);
            }
            else {
                ErrorAlert(result.Data, 1000, null, 0);
            }
        },
        error: function (xhr, status, error) {

        }
    });

    return nodeData;
}

function GenerateIds(node) {
    node.id = GenerateGUID();
    if (typeof node.children === 'undefined') {
           return;
       }
    node.children.forEach(function (seq) {
        seq.id = GenerateGUID();
    });
}

function GetNewNodeName(node) {
    var nodes = [];
    GetNodeName(vgWorkflow.treeData.process.rootSequence, nodes);
    let totalNodes = nodes.length;
    let newNodeName = "Node";
    if(node.name.length != 0) {
        newNodeName = node.name;
    }
    newNodeName = newNodeName + totalNodes;

    while(nodes.indexOf(newNodeName) > -1) {
      totalNodes++;
      newNodeName = "Node" + totalNodes;
    }

    return newNodeName;
}


function GetNodeName(sequence, nodes) {
    sequence.nodes.forEach(function (node) {
        nodes.push(node.name);
        
       if (typeof node.children === 'undefined') {
           return;
       }

       node.children.forEach(function (seq) {
           GetNodeName(seq, nodes);
       });
    });
}

function AddNodeToSequence(sequence, rootId, idToFind, node) {
    if (rootId == idToFind) {        
        sequence.nodes.splice(0, 0, node);
    }
    else {
        var findIndex = sequence.nodes.findIndex(x => x.id === idToFind);
        if (0 <= findIndex) {
            sequence.nodes.splice(findIndex + 1, 0, node);
        }
        else {
            sequence.nodes.forEach(function (element) {
                if (typeof element.children === 'undefined') {
                    return;
                }

                element.children.forEach(function (seq) {
                    AddNodeToSequence(seq, seq.id, idToFind, node);
                });
            });
        }
    }
}


var clickedNodeSequence = null;
var found = false;
function GetSequenceFromNode(sequence, clickedNode) {
    let nodeIndex = sequence.nodes.findIndex(x => x.id === clickedNode.id);        
    let foundSeq;
    let foundNode;

    if(nodeIndex > -1) {        
        let seqNode = {
            sequence: sequence,
            node: null
        };        
        clickedNodeSequence = seqNode;
        return true;
    }
    
    for (let i = 0; i < sequence.nodes.length; i++) {      
  
        if (sequence.nodes[i].children === undefined) {
            continue;
        }
    
        for (let j = 0; j < sequence.nodes[i].children.length; j++) {
            if (GetSequenceFromNode(sequence.nodes[i].children[j], clickedNode)) {
                 if(!found) {
                     foundSeq = sequence.nodes[i].children[j];
                     foundNode = sequence.nodes[i];
                    found = true;
                    let seqNode = {
                        sequence: foundSeq,
                        node: foundNode
                    };
                    clickedNodeSequence = seqNode;
                 }
             }
        }
    }
}


function GetSequenceForVariableNames(sequence, node) {    
    let clickedNode = node;
    clickedNodeSequence = null;
    GetSequenceFromNode(sequence, node);
    let variables = [];
    let cNodeSeq = null;
    while(0 === 0) {
         let variab = GetVariableFromNode(clickedNodeSequence, node, clickedNode);
         variab.forEach(function(item) {
             variables.push(item);
         });      

         node = clickedNodeSequence.node;

         if(clickedNodeSequence.node === null) {
            break;
         }   
         
         found = false;
         GetSequenceFromNode(sequence, node);
    }

    return variables;
}

function GetVariableFromNode(clickedNodeSequence, node, clickedNode) {
    let nodeIndex = clickedNodeSequence.sequence.nodes.findIndex(x => x.Id === node.Id);
    let vars = [];
    
    while(nodeIndex > -1) {
        let seqNode = clickedNodeSequence.sequence.nodes[nodeIndex];
        if(seqNode.Id === clickedNode.Id) {
            nodeIndex--;
            continue;
        }
        if (typeof seqNode.VariableName !== 'undefined') {
            vars.push(seqNode.variableName);
        }
        nodeIndex--;
    }

    return vars;
}

function DeleteNodeFromSequence(sequence, node) {
    var sequenceNodes = sequence.nodes;
    var deleteNodeIndex = sequenceNodes.findIndex(x => x.id === node.id);

    if (typeof deleteNodeIndex === 'undefined' || -1 === deleteNodeIndex) {
        sequenceNodes.forEach(function (node) {
            if (typeof node.children === 'undefined') {
                return;
            }

            node.children.forEach(function (seq) {
                DeleteNodeFromSequence(seq, node);
            });
        });
    }
    else {
        sequenceNodes.splice(deleteNodeIndex, 1);
    }
}

function GenerateGUID() {
    var d = new Date().getTime();
    var guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return guid;
}

function DeleteNodeSuccessCallBack(parentSequenceNodes, deleteNodeId) {
    var deleteNodeIndex = parentSequenceNodes.findIndex(x => x.Id === deleteNodeId);
    if (typeof deleteNodeIndex === 'undefined' || -1 === deleteNodeIndex) {
        deleteNodeIndex = parentSequenceNodes.findIndex(x => x.id === deleteNodeId);
    }
    if (-1 < deleteNodeIndex) {
        parentSequenceNodes.splice(deleteNodeIndex, 1);
    }
}

function CallAjaxMethod(type, url, data, contentType, successCallbackAction, errorCallback) {
    //show loading... image

    if (null === contentType) {
        contentType = 'application/json';
    }

    if (null === errorCallback) {
        errorCallback = function (xhr, textStatus, errorThrown) {
            ErrorAlert('Some error has occured', 1000, null, 0);
        };
    }

    var successCallback = function (result) {
        if (result.Success) {
            if (null !== successCallbackAction) {
                successCallbackAction();
            }
            SuccessAlert(result.Data, 2000, null, 1000);
        }
        else {
            ErrorAlert(result.Data, 1000, null, 0);
        }
    };

    $.ajax({
        type: type,
        url: url,
        data: data,
        contentType: contentType,
        dataType: 'json',
        success: successCallback,
        error: errorCallback
    });
}

//Variable Type 2 is string
function GetVariableDefaultObject() {
    return {
             "$type": "Novalys.VisualGuard.Security.WorkFlow.VGWorkFlowVariable, Novalys.VisualGuard.Security",
             "description": "",
             "id": GenerateGUID(),
             "name": "",
             "value": "",
             "variableType": 2
           }
}

function GetParentVariables(node) {
    return [];    
}

function GetOperatorsList() {                
    let operators = ["and", "or", "==", "!=", ">=", "<=", ">", "<", "is", "like", "between"];
    return operators;
}

function AddWorkflowParameterToControl(variableName, event) {
    event.preventDefault();

    var callingControl = event.target;
    var varInputLabel = $(callingControl).parents("div.variable")[0];
    var varInput = $(varInputLabel).find("input")[0];
    if(undefined === varInput) {
        varInput = $(varInputLabel).find("textarea")[0];
    }
    
    var varInputData = $(varInput).attr("data-variableType");
    var varInputId = $(varInput).attr("Id");
    //variableName = '#' + variableName;

    let currentValue = $('#' + varInputId + '').val();
    let inputSeperator = $('#' + varInputId + '').attr('data-variableSeperator');        

    if(inputSeperator === undefined) {
        inputSeperator = '';
    }
    variableName = variableName + inputSeperator;
    $('#' + varInputId + '').val(currentValue + ' ' + variableName + ' ');
    $("#" + varInputId).focus();  
    $(".dropdown-menu").removeClass("show");
}

function GetVariablesForIfNode() {  
    let ifNodeVariables = [];

    let variable = {"variable":{"name":"CurrentUserId"},"variableType":"String"}; 
    ifNodeVariables.push(variable);
    variable = { "variable": { "name": "CurrentUserName" },"variableType":"String"}; 
    ifNodeVariables.push(variable);
    variable = { "variable": { "name": "Principal" },"variableType":"VGIPrincipal"}; 
    ifNodeVariables.push(variable);
    variable = { "variable": { "name": "Runtime" },"variableType":"VGSecurityRuntime"}; 
    ifNodeVariables.push(variable);

    var vars = GetVariableList();
    var result = $.merge(ifNodeVariables, vars);

    return result;
}

function GetVariableList() {
    let vars = [];
    let variable;
    $.each(vgWorkflow.workflow.variables, function(key, value) {
        if (undefined !== value.variable) {
          variable = { "variable": { "name": value.variable.Name },"variableType":value.variableType}; 
      }
      else {
          variable = { "variable": { "name": value },"variableType":''}; 
      }
      vars.push(variable);
    });
    return vars;
}