function buildNewUI(thisObj) {
    // Create a window or panel for the UI
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Variable Input Panel", undefined, {resizeable: true});
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.preferredSize.height = 50;
    win.margins = [4, 4, 4, 4];

    // Create a group for the drop-down list, icon, and input field
    var grpDropdownAndInput = win.add("group", undefined);
    grpDropdownAndInput.orientation = "row"; // Set orientation to horizontal
    grpDropdownAndInput.alignChildren = ["fill", "center"];
    grpDropdownAndInput.margins = [0,0,0,0];
    grpDropdownAndInput.size = [175,24]

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
        alert("Icon file not found: " + iconFile.fsName);
    }

    // Add drop-down list with variable names
    var variableNames = ["An", "Ar", "D", "F", "H", "Lexp", "R", "S", "Tm", "W"];
    var ddVariableNames = grpDropdownAndInput.add("dropdownlist", undefined, variableNames);
    ddVariableNames.selection = 0; // Select the first item by default

    // Add inscription
    var grpInputTextFieldVariableName = win.add("group", undefined);
    grpInputTextFieldVariableName.orientation = "column";
    grpInputTextFieldVariableName.alignment = ["fill", "left"];
    grpInputTextFieldVariableName.size=[100,12];
    grpInputTextFieldVariableName.margins = [0, -10, 0, 0];

    var inputTextFieldVariableName = grpInputTextFieldVariableName.add("statictext", undefined, "Value of the variable if it is not defined");
    inputTextFieldVariableName.maximumSize.height = 12;
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

    // Add save button with icon and hover effect
    var saveIconFile = new File(scriptFolderPath + "/save.png");
    var saveIconHoverFile = new File(scriptFolderPath + "/saveHover.png");
    var btnSave = grpInputAndButton.add("iconbutton", undefined, saveIconFile, {style: "toolbutton"});
    btnSave.size = [24, 24]; // Set button size
    btnSave.imageSize = [24, 24]; // Set image size

    // Create a group for the radio buttons
    var grpRadioButtons = win.add("group", undefined);
    grpRadioButtons.orientation = "row"; // Set orientation to horizontal
    grpRadioButtons.alignChildren = ["center", "center"]; // Center the buttons
    grpRadioButtons.alignment = ["center", "bottom"]; // Align the group to the center bottom

    // Add radio buttons
    var rdoDefault = grpRadioButtons.add("radiobutton", undefined, "Default");
    var rdoCustom = grpRadioButtons.add("radiobutton", undefined, "Custom");

    // Set the default selection
    rdoDefault.value = true;


    btnSave.addEventListener("mouseover", function() {
        btnSave.image = saveIconHoverFile;
        btnSave.imageSize = [24, 24];
    });
    btnSave.addEventListener("mouseout", function() {
        btnSave.image = saveIconFile;
        btnSave.imageSize = [24, 24];
    });

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
        return null;
    }

    var variablesData = loadVariables();

    // Filtering functionality
    inputFieldVariableName.onChanging = function() {
        var searchText = inputFieldVariableName.text.toLowerCase(); // Get the input text and convert to lowercase
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
    
        // Check if the entered variable name exists in JSON data
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

    // Display the window or panel
    if (win instanceof Window) {
        win.center();
        win.show();
    }

    return win;
}

function initializeVariablesFile() {
    var scriptFile = new File($.fileName);
    var variablesFilePath = scriptFile.path.replace("/scripts", "/scripts/variables.json");
    var variablesFile = new File(variablesFilePath);

    // Check if the file exists and is not empty
    if (variablesFile.exists) {
        variablesFile.open("r");
        var content = variablesFile.read();
        variablesFile.close();
        if (content) {
            // File exists and is not empty, do nothing
            return;
        }
    }

    // File does not exist or is empty, write the initial structure
    var initialData = {
        "An": { "defaultValue": "NoAnimations", "customValue": "Custom{An}", "active": true },
        "Ar": { "defaultValue": "NoAspectRatio", "customValue": "Custom{Ar}", "active": true },
        "E": { "defaultValue": "No effects", "customValue": "Custom{E}", "active": true },
        "F": { "defaultValue": "NoFrameRate", "customValue": "Custom{F}", "active": true },
        "H": { "defaultValue": "NoHeight", "customValue": "Custom{H}", "active": true },
        "Lexp": { "defaultValue": "NoExpressions", "customValue": "Custom{Lexp}", "active": true },
        "R": { "defaultValue": "NoResolution", "customValue": "Custom{R}", "active": true },
        "S": { "defaultValue": "NoSource", "customValue": "Custom{S}", "active": true },
        "Tm": { "defaultValue": "NoTrackMate", "customValue": "Custom{Tm}", "active": true },
        "W": { "defaultValue": "NoWidth", "customValue": "Custom{W}", "active": true }
    };

    variablesFile.open("w");
    variablesFile.encoding = "UTF-8";
    variablesFile.write(JSON.stringify(initialData, null, 4));
    variablesFile.close();
}

initializeVariablesFile(); // Initialize the variables file if necessary

var myNewScriptPal = buildNewUI(this);
if (myNewScriptPal instanceof Panel) {
    myNewScriptPal.layout.layout(true);
} else {
    myNewScriptPal.center();
    myNewScriptPal.show();
}
