// File does not exist or is empty, write the initial structure
var initialData = {
    "An": { "defaultValue": "NoAnimations", "customValue": "Custom{An}", "active": true },
    "Ar": { "defaultValue": "NoAspectRatio", "customValue": "Custom{Ar}", "active": true },
    "E": { "defaultValue": "No effects", "customValue": "Custom{E}", "active": true },
    "F": { "defaultValue": "NoFrameRate", "customValue": "Custom{F}", "active": true },
    "H": { "defaultValue": "NoHeight", "customValue": "Custom{H}", "active": true },
    "Lexp": { "defaultValue": "NoExpressions", "customValue": "Custom{Lexp}", "active": true },
    "Fext": { "defaultValue": "NoExpressions", "customValue": "Custom{Lexp}", "active": true },
    "R": { "defaultValue": "NoResolution", "customValue": "Custom{R}", "active": true },
    "Tm": { "defaultValue": "NoTrackMate", "customValue": "Custom{Tm}", "active": true },
    "W": { "defaultValue": "NoWidth", "customValue": "Custom{W}", "active": true }
};

var scriptMessageHead_1 = "NitroNamer - variable settings";

// Function to load variables from JSON file
function loadVariables() {
    var scriptFile = new File($.fileName);
    var variablesFilePath = scriptFile.path.replace("/scripts", "/scripts/variables.json");
    var variablesFile = new File(variablesFilePath);

    if (variablesFile.exists) {
        variablesFile.open("r");
        var content = variablesFile.read();
        variablesFile.close();
        return JSON.parse(content);
    }
    return {};
}

var variablesData = loadVariables();
var lastText = "";
var userIsTyping = false; // Flag to track if the user is typing

function buildNewUI(thisObj) {
    // Create a window or panel for the UI
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "NitroNamer - variable settings", undefined, {resizeable: true});
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.preferredSize.height = 50;
    win.margins = [4, 4, 4, 4];

    // Create a group for the drop-down list, icon, and input field
    var grpDropdownAndInput = win.add("group", undefined);
    grpDropdownAndInput.orientation = "row"; // Set orientation to horizontal
    grpDropdownAndInput.alignChildren = ["fill", "center"];
    grpDropdownAndInput.margins = [0,0,0,0];
    grpDropdownAndInput.size = [175,24];

    // Add input field for variable name
    var inputFieldVariableName = grpDropdownAndInput.add("edittext", undefined, "");
    inputFieldVariableName.characters = 10; // Set width of the input field

    // Add icon
    var scriptFile = new File($.fileName);
    var scriptFolderPath = scriptFile.path.replace("/scripts", "/img"); // Adjust the path to point to the img folder
    var iconFile = new File(scriptFolderPath + "/search.png");
    if (iconFile.exists) {
        var icon = grpDropdownAndInput.add("image", undefined, iconFile);
        icon.size = [24, 24]; // Set the size of the icon
    } else {
        alert("Icon file not found: " + iconFile.fsName, scriptMessageHead_1);
    }

    // Add drop-down list with variable names
    var variableNames = ["An", "Ar", "E", "F", "R", "H", "W", "Lexp", "Fext",  "Tm"];
    var ddVariableNames = grpDropdownAndInput.add("dropdownlist", undefined, variableNames);
    ddVariableNames.selection = 0; // Select the first item by default

    // Add inscription
    var grpInputTextFieldVariableName = win.add("group", undefined);
    grpInputTextFieldVariableName.orientation = "column";
    grpInputTextFieldVariableName.alignment = ["fill", "left"];
    grpInputTextFieldVariableName.size=[100,12];
    grpInputTextFieldVariableName.margins = [0, -10, 0, 0];

    var originalTextFieldLabel  = "Value of an undefined variable"; // the original label text

    var inputTextFieldVariableName = grpInputTextFieldVariableName.add("statictext", undefined, originalTextFieldLabel );
    inputTextFieldVariableName.maximumSize.height = 12;
    inputTextFieldVariableName.alignment = ["fill", "center"];
    inputTextFieldVariableName.margins = [0, -10, 0, 0];

    // Create a group for the input field and save button
    var grpInputAndButton = win.add("group", undefined);
    grpInputAndButton.orientation = "row"; // Set orientation to horizontal
    grpInputAndButton.alignChildren = ["fill", "left"];
    grpInputAndButton.margins = [0,-10,0,0];

    // Add input field for variable value
    var inputFieldVariableValue = grpInputAndButton.add("edittext", undefined, "");
    inputFieldVariableValue.characters = 20; // Set width of the input field
    inputFieldVariableValue.size = [150, 24]; // Set the size of the input field
    inputFieldVariableValue.margins = [0,-10,0,0];

    function filterDropdownList() {
        var searchText = inputFieldVariableName.text.toLowerCase(); // Get the input text and convert to lowercase
        if (searchText === lastText) return; // Exit if the text hasn't changed
        lastText = searchText;
    
        ddVariableNames.removeAll(); // Clear current dropdown items
    
        // Filter and add items to the dropdown list
        for (var i = 0; i < variableNames.length; i++) {
            if (variableNames[i].toLowerCase().indexOf(searchText) !== -1) {
                ddVariableNames.add("item", variableNames[i]);
            }
        }
    
        // If no matching items, add a message
        if (ddVariableNames.items.length === 0) {
            ddVariableNames.add("item", "No matches found");
        } else {
            ddVariableNames.selection = 0; // Select the first item
        }
    
        userIsTyping = false; // Reset typing flag
    }

    // Add save button with icon and hover effect
    var saveIconFile = new File(scriptFolderPath + "/save.png");
    var saveIconHoverFile = new File(scriptFolderPath + "/saveHover.png");
    var deleteIconHoverFile = new File(scriptFolderPath + "/deleteHover.png");
    var resetIconHoverFile = new File(scriptFolderPath + "/resetIconHover.png");
    var warningIconFile = new File(scriptFolderPath + "/warning.png");
    var warningIconHoverFile = new File(scriptFolderPath + "/warningHover.png");
    var doneIconFile = new File(scriptFolderPath + "/doneIcon.png");

    var btnSave = grpInputAndButton.add("iconbutton", undefined, saveIconFile, {style: "toolbutton"});
    btnSave.size = [24, 24]; // Set button size
    btnSave.imageSize = [24, 24]; // Set image size

    // Create a group for the radio buttons
    var grpRadioButtons = win.add("group", undefined);
    grpRadioButtons.orientation = "row"; // Set orientation to horizontal
    grpRadioButtons.alignChildren = ["center", "center"]; // Center the buttons
    grpRadioButtons.alignment = ["center", "bottom"]; // Align the group to the center bottom

    // Add radio buttons
    var rdoDefault = grpRadioButtons.add("radiobutton", undefined, "Default value");
    var rdoCustom = grpRadioButtons.add("radiobutton", undefined, "Custom value");

    // Set the default selection
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

    // Function to reset UI fields
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

    // Event listener for input field changes
    inputFieldVariableName.onChanging = function() {
        userIsTyping = true; // Set typing flag
        filterDropdownList(); // Call the filter function

        // Check if the entered variable name exists in JSON data
        if (variablesData && variablesData[inputFieldVariableName.text]) {
            inputTextFieldVariableName.text = originalTextFieldLabel;
            btnSave.image = saveIconFile;
        } else {
            inputTextFieldVariableName.text = "Invalid variable name";
            btnSave.image = warningIconFile;
        }
        btnSave.imageSize = [24, 24];
    };

    // Add event listener to dropdown list
    ddVariableNames.onChange = function() {
        if (ddVariableNames.selection) {
            inputFieldVariableName.text = ddVariableNames.selection.text;

            // Check if the selected variable name exists in JSON data
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
    
    // Add event listener to handle Enter key press in input field
    inputFieldVariableName.addEventListener("keydown", function(event) {
        if (event.keyName === "Enter" && ddVariableNames.selection) {
            inputFieldVariableName.text = ddVariableNames.selection.text;

            // Check if the selected variable name exists in JSON data
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

    // Add event listener to save button
    btnSave.onClick = function() {
        var scriptFile = new File($.fileName);
        var variablesFilePath = scriptFile.path.replace("/scripts", "/scripts/variables.json");
        var variablesFile = new File(variablesFilePath);

        if (!initialData[inputFieldVariableName.text]) {
            // Variable does not exist, show warning icon and change text
            btnSave.image = warningIconFile;
            btnSave.imageSize = [24, 24];

            inputTextFieldVariableName.text = "Invalid variable name";
        } else {
            if (ScriptUI.environment.keyboardState.shiftKey) {
                // Reset current variable settings to initialData
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
                    alert("Settings reset for variable: " + variableName);
                }
            } else if (ScriptUI.environment.keyboardState.ctrlKey && ScriptUI.environment.keyboardState.altKey) {
                // Reset all variables to initialData
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
                alert("All settings reset to initial values.");
            } else {
                // Save current settings
                if (variablesData && inputFieldVariableName.text) {
                    var variableName = inputFieldVariableName.text;

                    // Ensure the variable entry exists in variablesData
                    if (!variablesData[variableName]) {
                        variablesData[variableName] = {
                            "defaultValue": "",
                            "customValue": "",
                            "active": false
                        };
                    }

                    var variableSettings = variablesData[variableName];

                    // Save the value based on which radio button is active
                    if (rdoDefault.value) {
                        variableSettings.defaultValue = inputFieldVariableValue.text;
                        variableSettings.active = false;
                    } else if (rdoCustom.value) {
                        variableSettings.customValue = inputFieldVariableValue.text;
                        variableSettings.active = true;
                    }

                    // Save the updated settings back to the JSON file
                    variablesFile.open("w");
                    variablesFile.encoding = "UTF-8";
                    variablesFile.write(JSON.stringify(variablesData, null, 4));
                    variablesFile.close();

                    inputTextFieldVariableName.text = "Variable settings saved";
                    btnSave.image = doneIconFile;

                    // Reset the text and icon back after mouseout
                    btnSave.addEventListener("mouseout", function resetIconAndText(event) {
                        inputTextFieldVariableName.text = originalTextFieldLabel;
                        btnSave.image = saveIconFile;
                        btnSave.removeEventListener("mouseout", resetIconAndText);
                    });
                } else {
                    alert("Please enter a valid variable name.");
                }
            }
        }
    };

    // Add event listeners for radio buttons
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

    // Display the window or panel
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
