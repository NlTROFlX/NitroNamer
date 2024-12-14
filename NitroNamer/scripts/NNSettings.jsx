var initialData = {
    "An": { "defaultValue": "NoAnimations", "customValue": "Custom{An}", "active": false },
    "Ar": { "defaultValue": "NoAspectRatio", "customValue": "Custom{Ar}", "active": false },
    "E": { "defaultValue": "No effects", "customValue": "Custom{E}", "active": false },
    "F": { "defaultValue": "NoFrameRate", "customValue": "Custom{F}", "active": false },
    "H": { "defaultValue": "NoHeight", "customValue": "Custom{H}", "active": false },
    "Lexp": { "defaultValue": "NoExpressions", "customValue": "Custom{Lexp}", "active": false },
    "Fext": { "defaultValue": "NoExtension", "customValue": "Custom{Fext}", "active": false },
    "Lmc": { "defaultValue": "NoMasks", "customValue": "Custom{Lmc}", "active": false },
    "Lmn": { "defaultValue": "NoMaskNames", "customValue": "Custom{Lmn}", "active": false },
    "R": { "defaultValue": "NoResolution", "customValue": "Custom{R}", "active": false },
    "Tm": { "defaultValue": "NoTrackMate", "customValue": "Custom{Tm}", "active": false },
    "W": { "defaultValue": "NoWidth", "customValue": "Custom{W}", "active": false }
};

var scriptMessageHead_1 = "NitroNamer - variable settings";

function readJSONFile(filePath) {
    var file = new File(filePath);
    var data = {};
    if (file.exists) {
        file.open("r");
        try {
            data = eval("(" + file.read() + ")");
        } catch (e) {
            alert("Error parsing JSON file: " + filePath, scriptMessageHead_1);
        }
        file.close();
    }
    return data;
}

function loadVariables() {
    var scriptFile = new File($.fileName);
    var variablesFilePath = scriptFile.path.replace("/scripts", "/scripts/variables.json");
    var variablesFile = new File(variablesFilePath);
    
    return readJSONFile(variablesFile);
}

var variablesData = loadVariables();
var lastText = "";
var userIsTyping = false; 

function buildNewUI(thisObj) {
    
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "NitroNamer - variable settings", undefined, {resizeable: true});
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.preferredSize.height = 50;
    win.margins = [4, 4, 4, 4];

    
    var grpDropdownAndInput = win.add("group", undefined);
    grpDropdownAndInput.orientation = "row"; 
    grpDropdownAndInput.alignChildren = ["fill", "center"];
    grpDropdownAndInput.margins = [0,0,0,0];
    grpDropdownAndInput.size = [175,24];

    
    var inputFieldVariableName = grpDropdownAndInput.add("edittext", undefined, "");
    inputFieldVariableName.characters = 10; 

    
    var scriptFile = new File($.fileName);
    var scriptFolderPath = scriptFile.path.replace("/scripts", "/img"); 
    var iconFile = new File(scriptFolderPath + "/search.png");
    if (iconFile.exists) {
        var icon = grpDropdownAndInput.add("image", undefined, iconFile);
        icon.size = [24, 24]; 
    } else {
        alert("Icon file not found: " + iconFile.fsName, scriptMessageHead_1);
    }

    
    var variableNames = ["An", "Ar", "E", "F", "R", "H", "W", "Lexp", "Fext", "Lmc", "Lmn",  "Tm"];
    var ddVariableNames = grpDropdownAndInput.add("dropdownlist", undefined, variableNames);
    ddVariableNames.selection = 0; 

    
    var grpInputTextFieldVariableName = win.add("group", undefined);
    grpInputTextFieldVariableName.orientation = "column";
    grpInputTextFieldVariableName.alignment = ["fill", "left"];
    grpInputTextFieldVariableName.size=[100,12];
    grpInputTextFieldVariableName.margins = [0, -10, 0, 0];

    var originalTextFieldLabel  = "Value of an undefined variable"; 

    var inputTextFieldVariableName = grpInputTextFieldVariableName.add("statictext", undefined, originalTextFieldLabel );
    inputTextFieldVariableName.maximumSize.height = 12;
    inputTextFieldVariableName.alignment = ["fill", "center"];
    inputTextFieldVariableName.margins = [0, -10, 0, 0];

    
    var grpInputAndButton = win.add("group", undefined);
    grpInputAndButton.orientation = "row"; 
    grpInputAndButton.alignChildren = ["fill", "left"];
    grpInputAndButton.margins = [0,-10,0,0];

    
    var inputFieldVariableValue = grpInputAndButton.add("edittext", undefined, "");
    inputFieldVariableValue.characters = 20; 
    inputFieldVariableValue.size = [150, 24]; 
    inputFieldVariableValue.margins = [0,-10,0,0];

    function filterDropdownList() {
        var searchText = inputFieldVariableName.text.toLowerCase(); 
        if (searchText === lastText) return; 
        lastText = searchText;
    
        ddVariableNames.removeAll(); 
    
        
        for (var i = 0; i < variableNames.length; i++) {
            if (variableNames[i].toLowerCase().indexOf(searchText) !== -1) {
                ddVariableNames.add("item", variableNames[i]);
            }
        }
    
        
        if (ddVariableNames.items.length === 0) {
            ddVariableNames.add("item", "No matches found");
        } else {
            ddVariableNames.selection = 0; 
        }
    
        userIsTyping = false; 
    }

    
    var saveIconFile = new File(scriptFolderPath + "/save.png");
    var saveIconHoverFile = new File(scriptFolderPath + "/saveHover.png");
    var deleteIconHoverFile = new File(scriptFolderPath + "/deleteHover.png");
    var resetIconHoverFile = new File(scriptFolderPath + "/resetIconHover.png");
    var warningIconFile = new File(scriptFolderPath + "/warning.png");
    var warningIconHoverFile = new File(scriptFolderPath + "/warningHover.png");
    var doneIconFile = new File(scriptFolderPath + "/doneIcon.png");

    var btnSave = grpInputAndButton.add("iconbutton", undefined, saveIconFile, {style: "toolbutton"});
    btnSave.size = [24, 24]; 
    btnSave.imageSize = [24, 24]; 

    
    var grpRadioButtons = win.add("group", undefined);
    grpRadioButtons.orientation = "row"; 
    grpRadioButtons.alignChildren = ["center", "center"]; 
    grpRadioButtons.alignment = ["center", "bottom"]; 
    grpRadioButtons.margins = [0,-10,0,0];

    
    var rdoDefault = grpRadioButtons.add("radiobutton", undefined, "Default value");
    var rdoCustom = grpRadioButtons.add("radiobutton", undefined, "Custom value");

    
    rdoDefault.value = true;

    btnSave.addEventListener("mouseover", function(event) {
        if (ScriptUI.environment.keyboardState.shiftKey) {
            btnSave.image = deleteIconHoverFile;
        } else if (ScriptUI.environment.keyboardState.ctrlKey && ScriptUI.environment.keyboardState.altKey) {
            btnSave.image = resetIconHoverFile;
        } else if (!initialData[inputFieldVariableName.text]) {
            btnSave.image = warningIconHoverFile;
        } else {
            btnSave.image = saveIconHoverFile;
        }
        btnSave.imageSize = [24, 24];
    });
    
    btnSave.addEventListener("mouseout", function(event) {
        btnSave.image = saveIconFile;
        btnSave.imageSize = [24, 24];
    });

    
    function resetUIFields() {
        inputFieldVariableName.text = "";
        inputFieldVariableValue.text = "";
        ddVariableNames.removeAll();
        for (var i = 0; i < variableNames.length; i++) {
            ddVariableNames.add("item", variableNames[i]);
        }
        ddVariableNames.selection = 0;
        rdoDefault.value = true;
    }

    var variablesData = loadVariables();

    
    inputFieldVariableName.onChanging = function() {
        userIsTyping = true; 
        filterDropdownList(); 

        
        if (variablesData && variablesData[inputFieldVariableName.text]) {
            inputTextFieldVariableName.text = originalTextFieldLabel;
            btnSave.image = saveIconFile;
        } else {
            inputTextFieldVariableName.text = "Invalid variable name";
            btnSave.image = warningIconFile;
        }
        btnSave.imageSize = [24, 24];
    };

    
    ddVariableNames.onChange = function() {
        if (ddVariableNames.selection) {
            inputFieldVariableName.text = ddVariableNames.selection.text;

            
            if (variablesData && variablesData[inputFieldVariableName.text]) {
                var variableSettings = variablesData[inputFieldVariableName.text];

                if (variableSettings.active) {
                    inputFieldVariableValue.text = variableSettings.customValue;
                    rdoCustom.value = true;
                } else {
                    inputFieldVariableValue.text = variableSettings.defaultValue;
                    rdoDefault.value = true;
                }
            }
        }
    };
    
    
    inputFieldVariableName.addEventListener("keydown", function(event) {
        if (event.keyName === "Enter" && ddVariableNames.selection) {
            inputFieldVariableName.text = ddVariableNames.selection.text;

            
            if (variablesData && variablesData[inputFieldVariableName.text]) {
                var variableSettings = variablesData[inputFieldVariableName.text];

                if (variableSettings.active) {
                    inputFieldVariableValue.text = variableSettings.customValue;
                    rdoCustom.value = true;
                } else {
                    inputFieldVariableValue.text = variableSettings.defaultValue;
                    rdoDefault.value = true;
                }
            }
        }
    });

    
    btnSave.onClick = function() {
        var scriptFile = new File($.fileName);
        var variablesFilePath = scriptFile.path.replace("/scripts", "/scripts/variables.json");
        var variablesFile = new File(variablesFilePath);

        if (!initialData[inputFieldVariableName.text]) {
            
            btnSave.image = warningIconFile;
            btnSave.imageSize = [24, 24];

            inputTextFieldVariableName.text = "Invalid variable name";
        } else {
            if (ScriptUI.environment.keyboardState.shiftKey) {
                
                if (variablesData && inputFieldVariableName.text) {
                    var variableName = inputFieldVariableName.text;
                    if (initialData[variableName]) {
                        variablesData[variableName] = {
                            "defaultValue": initialData[variableName].defaultValue,
                            "customValue": initialData[variableName].customValue,
                            "active": initialData[variableName].active
                        };
                    }

                    variablesFile.open("w");
                    variablesFile.encoding = "UTF-8";
                    variablesFile.write(JSON.stringify(variablesData, null, 4));
                    variablesFile.close();

                    resetUIFields();
                    alert("Settings reset for variable: " + variableName, scriptMessageHead_1);
                }
            } else if (ScriptUI.environment.keyboardState.ctrlKey && ScriptUI.environment.keyboardState.altKey) {
                
                for (var key in initialData) {
                    if (initialData.hasOwnProperty(key)) {
                        variablesData[key] = {
                            "defaultValue": initialData[key].defaultValue,
                            "customValue": initialData[key].customValue,
                            "active": initialData[key].active
                        };
                    }
                }

                variablesFile.open("w");
                variablesFile.encoding = "UTF-8";
                variablesFile.write(JSON.stringify(variablesData, null, 4));
                variablesFile.close();

                resetUIFields();
                alert("All settings reset to initial values.", scriptMessageHead_1);
            } else {
                
                if (variablesData && inputFieldVariableName.text) {
                    var variableName = inputFieldVariableName.text;

                    
                    if (!variablesData[variableName]) {
                        variablesData[variableName] = {
                            "defaultValue": "",
                            "customValue": "",
                            "active": false
                        };
                    }

                    var variableSettings = variablesData[variableName];

                    
                    if (rdoDefault.value) {
                        variableSettings.defaultValue = inputFieldVariableValue.text;
                        variableSettings.active = false;
                    } else if (rdoCustom.value) {
                        variableSettings.customValue = inputFieldVariableValue.text;
                        variableSettings.active = true;
                    }

                    
                    variablesFile.open("w");
                    variablesFile.encoding = "UTF-8";
                    variablesFile.write(JSON.stringify(variablesData, null, 4));
                    variablesFile.close();

                    inputTextFieldVariableName.text = "Variable settings saved";
                    btnSave.image = doneIconFile;

                    
                    btnSave.addEventListener("mouseout", function resetIconAndText(event) {
                        inputTextFieldVariableName.text = originalTextFieldLabel;
                        btnSave.image = saveIconFile;
                        btnSave.removeEventListener("mouseout", resetIconAndText);
                    });
                } else {
                    alert("Please enter a valid variable name.", scriptMessageHead_1);
                }
            }
        }
    };

    
    rdoDefault.onClick = function() {
        if (variablesData && variablesData[inputFieldVariableName.text]) {
            var variableSettings = variablesData[inputFieldVariableName.text];
            inputFieldVariableValue.text = variableSettings.defaultValue;
            variableSettings.active = false;
        }
    };

    rdoCustom.onClick = function() {
        if (variablesData && variablesData[inputFieldVariableName.text]) {
            var variableSettings = variablesData[inputFieldVariableName.text];
            inputFieldVariableValue.text = variableSettings.customValue;
            variableSettings.active = true;
        }
    };

    
    if (win instanceof Window) {
        win.center();
        win.show();
    }

    return win;
}

var myNewScriptPal = buildNewUI(this);
if (myNewScriptPal instanceof Panel) {
    myNewScriptPal.layout.layout(true);
} else {
    myNewScriptPal.center();
    myNewScriptPal.show();
}
