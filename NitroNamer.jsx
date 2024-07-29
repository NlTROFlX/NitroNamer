function buildUI(thisObj) {
    // Create a window or panel for the UI
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "NitroNamer", undefined, {resizeable: true});
    var globalWidthSizeElements = 300; // Set global width for UI elements
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.preferredSize.height = 122;
    win.active = true;
    win.margins = [4,4,4,4];

    // Create group for layer selection options
    var grpLayerSelection = win.add("group", undefined);
    grpLayerSelection.orientation = "row"; // Set orientation to horizontal
    grpLayerSelection.maximumSize.width = globalWidthSizeElements;

    // Add radio buttons for layer selection mode
    var rdoAllLayers = grpLayerSelection.add("radiobutton", undefined, "Total: ");
    rdoAllLayers.value = true; // Default to selecting all layers
    var txtAllLayersCount = grpLayerSelection.add("statictext", undefined, "");

    var rdoOnlySelected = grpLayerSelection.add("radiobutton", undefined, "Selected: ");
    var txtSelectedLayersCount = grpLayerSelection.add("statictext", undefined, "");

    // Get the script's file and folder path
    var scriptFile = new File($.fileName);
    var scriptFolderPath = scriptFile.path;

    // Add Copy button with icon and hover effect
    var btnCopy = grpLayerSelection.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/copy.png"), {style: "toolbutton"}, 0);
    btnCopy.size = [24, 24];
    btnCopy.imageSize = [24, 24];
    btnCopy.alignment = ["right", "center"];

    // Add Save button with icon and hover effect
    var btnSave = grpLayerSelection.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/save.png"), {style: "toolbutton"});
    btnSave.size = [24, 24];
    btnSave.imageSize = [24, 24];
    btnSave.alignment = ["right", "center"];

    // Add Delete button with icon and hover effect
    var btnCircleMinus = grpLayerSelection.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/delete.png"), {style: "toolbutton"});
    btnCircleMinus.size = [24, 24];
    btnCircleMinus.imageSize = [24, 24];
    btnCircleMinus.alignment = ["right", "center"];

    // Add Minimize button with icon and hover effect
    var btnMinimize = grpLayerSelection.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/minimize.png"), {style: "toolbutton"});
    btnMinimize.size = [24, 24];
    btnMinimize.imageSize = [24, 24];
    btnMinimize.alignment = ["right", "center"];

    // Mouse over and out event handlers for Minimize button
    function handleMouseOverMaximize() {
        btnMinimize.image = File(scriptFolderPath + "/NitroNamer/img/maximizeHover.png");
    }

    function handleMouseOutMaximize() {
        btnMinimize.image = File(scriptFolderPath + "/NitroNamer/img/maximize.png");
    }

    function handleMouseOverMinimize() {
        btnMinimize.image = File(scriptFolderPath + "/NitroNamer/img/minimizeHover.png");
    }

    function handleMouseOutMinimize() {
        btnMinimize.image = File(scriptFolderPath + "/NitroNamer/img/minimize.png");
    }

    // Load settings and populate dropdown with presets
    var settings = loadSettings();
    var userPresets = settings.userPresets || {};
    var presetTemplates = [];

    // Populate preset templates from user settings
    for (var key in userPresets) {
        if (userPresets.hasOwnProperty(key)) {
            presetTemplates.push(userPresets[key].template);
        }
    }

    // Create group for dropdown and buttons
    var grpDropdownAndButtons = win.add("group", undefined);
    grpDropdownAndButtons.orientation = "row";
    grpDropdownAndButtons.alignment = ["fill", "top"];
    grpDropdownAndButtons.margins = [0, -10, 0, 0];

    // Add dropdown list for layer mode presets
    var ddLayerMode = grpDropdownAndButtons.add("dropdownlist", undefined, presetTemplates);
    ddLayerMode.selection = 0;

    // Update presets dropdown change handler
    ddLayerMode.onChange = function() {
        var selectedPreset = ddLayerMode.selection;
        if (selectedPreset) {
            var presetTemplate = selectedPreset.text;
            var settings = loadSettings();
            var userPresets = settings.userPresets || {};

            for (var key in userPresets) {
                if (userPresets.hasOwnProperty(key) && userPresets[key].template === presetTemplate) {
                    var preset = userPresets[key];
                    rdoAllLayers.value = preset.allLayers;
                    rdoOnlySelected.value = !preset.allLayers;
                    txtTemplate.text = preset.template;
                    chkBriefly.value = preset.briefly;
                    ddBrieflyType.selection = preset.brieflyType || 0;

                    updateLayerCounts();
                    updatePreview();
                    resetRenameButtonIcon();
                    updateRenameButtonIcon(); // Ensure the button is updated

                    var currentSettings = {
                        allLayers: rdoAllLayers.value,
                        template: txtTemplate.text,
                        briefly: chkBriefly.value,
                        brieflyType: ddBrieflyType.selection.index,
                        selectedPresetIndex: ddLayerMode.selection.index
                    };
                    saveSettings(currentSettings, true);
                    break;
                }
            }
        }
    };

    // Event handlers for radio buttons to update UI and save settings
    rdoAllLayers.onClick = function() {
        if (rdoAllLayers.value) {
            rdoOnlySelected.value = false;
        } else {
            rdoOnlySelected.value = true;
        }
        updateLayerCounts();
        updatePreview();
        resetRenameButtonIcon();
        var currentSettings = {
            allLayers: rdoAllLayers.value,
            template: txtTemplate.text,
            briefly: chkBriefly.value,
            brieflyType: ddBrieflyType.selection.index
        };
        saveSettings(currentSettings, true);
    };

    rdoOnlySelected.onClick = function() {
        if (rdoOnlySelected.value) {
            rdoAllLayers.value = false;
        } else {
            rdoAllLayers.value = true;
        }
        updateLayerCounts();
        updatePreview();
        resetRenameButtonIcon();
        var currentSettings = {
            allLayers: rdoAllLayers.value,
            template: txtTemplate.text,
            briefly: chkBriefly.value,
            brieflyType: ddBrieflyType.selection.index
        };
        saveSettings(currentSettings, true);
    };

    // Custom trim function
    function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    // Function to check template field and update button icon and state
    function updateRenameButtonIcon() {
        var templateText = txtTemplate.text;
        if (trim(templateText) === "") {
            btnRename.image = warningIcon;
            btnRename.imageSize = [24, 24];
            btnRename.enabled = false;
        } else {
            resetRenameButtonIcon();
            btnRename.enabled = true;
        }
    }

    // Create group for template text field
    var grpTemplate = win.add("group", undefined);
    grpTemplate.orientation = "column";
    grpTemplate.margins = [0,-10,0,0];
    var txtTemplate = grpTemplate.add("edittext", undefined, "(Template for renaming)O_T.i", {multiline: false, scrolling: false});
    txtTemplate.alignment = ["fill", "top"];
    txtTemplate.margins = [0,-10,0,0];

    txtTemplate.addEventListener("click", function() {
        checkAndUpdateSettings(); // Check and update settings when the input field is clicked
    });

    txtTemplate.onChanging = function() {
        checkAndUpdateSettings(); // Check and update settings when the input field value is changing
        updatePreview();
        updateLayerCounts();
        updateRenameButtonIcon(); // Update button icon based on input value
    };

    // Save settings when template text field changes
    txtTemplate.onChange = function() {
        checkAndUpdateSettings(); // Check and update settings when the input field value changes
        var currentSettings = {
            allLayers: rdoAllLayers.value,
            template: txtTemplate.text,
            briefly: chkBriefly.value,
            brieflyType: ddBrieflyType.selection.index
        };
        saveSettings(currentSettings, true);
        updatePreview();
        updateLayerCounts();
        resetRenameButtonIcon();
        updateRenameButtonIcon();
    };

    // Event listener for Enter key in template text field
    txtTemplate.addEventListener("keydown", function(event) {
        checkAndUpdateSettings(); // Check and update settings when Enter key is pressed
        if (event.keyName === "Enter") {
            var selectedPreset = ddLayerMode.selection;
            if (selectedPreset) {
                var presetTemplate = selectedPreset.text;
                var settings = loadSettings();
                var userPresets = settings.userPresets || {};

                for (var key in userPresets) {
                    if (userPresets.hasOwnProperty(key) && userPresets[key].template === presetTemplate) {
                        var preset = userPresets[key];
                        rdoAllLayers.value = preset.allLayers;
                        rdoOnlySelected.value = !preset.allLayers;
                        txtTemplate.text = preset.template;
                        chkBriefly.value = preset.briefly;
                        ddBrieflyType.selection = preset.brieflyType || 0;

                        updateLayerCounts();
                        updatePreview();
                        resetRenameButtonIcon();
                        updateRenameButtonIcon(); // Ensure the button is updated

                        var currentSettings = {
                            allLayers: rdoAllLayers.value,
                            template: txtTemplate.text,
                            briefly: chkBriefly.value,
                            brieflyType: ddBrieflyType.selection.index,
                            selectedPresetIndex: ddLayerMode.selection.index
                        };
                        saveSettings(currentSettings, true);
                        break;
                    }
                }
            }
        }
    });

    // Set dropdown width after creating template text field
    win.onShow = function() {
        ddLayerMode.size = [txtTemplate.size[0], ddLayerMode.size[1]];
    };

    // Create group for text fields
    var grpTextFields = win.add("group", undefined);
    grpTextFields.orientation = "column";
    grpTextFields.alignChildren = ["fill", "top"];
    grpTextFields.alignment = ["right", "center"];
    grpTextFields.maximumSize.width = globalWidthSizeElements;

    // Add text fields for original and renamed layer names
    var txtOriginalLabel = grpTextFields.add("statictext", undefined, "Input layer with original name: ");
    txtOriginalLabel.maximumSize.height = 12;
    var txtOriginal = grpTextFields.add("edittext", undefined, "", {readonly: true});
    txtOriginal.alignment = ["fill", "top"];
    txtOriginal.maximumSize.width = globalWidthSizeElements;
    txtOriginal.margins = [0, -10, 0, 0];

    var txtRenamedLabel = grpTextFields.add("statictext", undefined, "Template result for layer(s): ");
    txtRenamedLabel.maximumSize.height = 12;
    var txtRenamed = grpTextFields.add("edittext", undefined, "", {readonly: true});
    txtRenamed.alignment = ["fill", "top"];
    txtRenamed.maximumSize.width = globalWidthSizeElements;
    txtRenamed.margins = [0, -10, 0, 0];

    // Set maximum and minimum width for text fields and dropdown
    txtTemplate.maximumSize.width = globalWidthSizeElements;
    txtTemplate.minimumSize.width = globalWidthSizeElements;
    txtOriginal.maximumSize.width = globalWidthSizeElements;
    txtOriginal.minimumSize.width = globalWidthSizeElements;
    txtRenamed.maximumSize.width = globalWidthSizeElements;
    txtRenamed.minimumSize.width = globalWidthSizeElements;
    ddLayerMode.maximumSize.width = globalWidthSizeElements;
    ddLayerMode.minimumSize.width = globalWidthSizeElements;

    var txtRenamedCompact;

    // Create group for "Briefly" checkbox and dropdown
    var grpBriefly = win.add("group", undefined);
    grpBriefly.orientation = "row";
    grpBriefly.alignChildren = [ "right", "center"];

    // Move buttons to the grpBriefly group
    var btnRename = grpBriefly.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/renameIcon.png"), { style: "toolbutton" });
    var warningIcon = File(scriptFolderPath + "/NitroNamer/img/warning.png");
    var warningIconHover = File(scriptFolderPath + "/NitroNamer/img/warningHover.png");
    btnRename.size = [24, 24]; // Set button size
    btnRename.imageSize = [24, 24]; // Set image size
    btnRename.alignment = ["left", "center"];

    var btnHelp = grpBriefly.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/helpIcon.png"), { style: "toolbutton" });
    btnHelp.size = [24, 24]; // Set button size
    btnHelp.imageSize = [24, 24]; // Set image size
    btnHelp.alignment = ["left", "center"];

    var btnVariables = grpBriefly.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/variablesIcon.png"), { style: "toolbutton" });
    btnVariables.size = [24, 24]; // Set button size
    btnVariables.imageSize = [24, 24]; // Set image size
    btnVariables.alignment = ["left", "center"];

    var btnReset = grpBriefly.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/resetIcon.png"), { style: "toolbutton" });
    btnReset.size = [24, 24]; // Set button size
    btnReset.imageSize = [24, 24]; // Set image size
    btnReset.alignment = ["left", "center"];

    // Add Settings button with icon and hover effect
    var btnSettings = grpBriefly.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/settings.png"), {style: "toolbutton"});
    btnSettings.size = [24, 24]; // Set button size
    btnSettings.imageSize = [24, 24]; // Set image size
    btnSettings.alignment = ["left", "center"];

    var chkBriefly = grpBriefly.add("checkbox", undefined);
    var ddBrieflyType = grpBriefly.add("dropdownlist", undefined, ["Camel Case", "Pascal Case", "Snake Case", "Kebab Case", "Screaming Snake Case"]);
    ddBrieflyType.maximumSize.width = 100;
    ddBrieflyType.selection = 0;

    // Event handler for "Briefly" checkbox
    chkBriefly.onClick = function() {
        var currentSettings = {
            allLayers: rdoAllLayers.value,
            template: txtTemplate.text,
            briefly: chkBriefly.value,
            brieflyType: ddBrieflyType.selection.index
        };
        saveSettings(currentSettings, true);
        updatePreview();
        updateLayerCounts();
        resetRenameButtonIcon();
    };

    // Event handler for "Briefly" dropdown
    ddBrieflyType.onChange = function() {
        var currentSettings = {
            allLayers: rdoAllLayers.value,
            template: txtTemplate.text,
            briefly: chkBriefly.value,
            brieflyType: ddBrieflyType.selection.index
        };
        saveSettings(currentSettings, true);
        updatePreview();
        updateLayerCounts();
        resetRenameButtonIcon();
    };
    grpBriefly.margins = [0,-10,0,0];

    // Function to reset Rename button icon
    function resetRenameButtonIcon() {
        btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIcon.png");
        btnRename.imageSize = [24, 24];
    }

    function addHoverEffect(button, iconPath) {
        button.addEventListener("mouseover", function() {
            button.image = File(iconPath + "Hover.png");
            button.imageSize = [24, 24];
        });
        button.addEventListener("mouseout", function() {
            button.image = File(iconPath + ".png");
            button.imageSize = [24, 24];
        });
    }

    addHoverEffect(btnCopy, scriptFolderPath + "/NitroNamer/img/copy");
    addHoverEffect(btnSave, scriptFolderPath + "/NitroNamer/img/save");
    addHoverEffect(btnCircleMinus, scriptFolderPath + "/NitroNamer/img/delete");
    addHoverEffect(btnMinimize, scriptFolderPath + "/NitroNamer/img/minimize");
    addHoverEffect(btnHelp, scriptFolderPath + "/NitroNamer/img/helpIcon");
    addHoverEffect(btnVariables, scriptFolderPath + "/NitroNamer/img/variablesIcon");
    addHoverEffect(btnReset, scriptFolderPath + "/NitroNamer/img/resetIcon");
    addHoverEffect(btnSettings, scriptFolderPath + "/NitroNamer/img/settings");


    // Event handlers for Rename button hover effect
    btnRename.addEventListener("mouseover", function() {
        checkAndUpdateSettings();
        updatePreview();
        updateLayerCounts();
        if (trim(txtTemplate.text) === "") {
            btnRename.image = warningIconHover;
        } else {
            btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIconHover.png");
        }
        btnRename.imageSize = [24, 24];
    });
    btnRename.addEventListener("mouseout", function() {
        updateRenameButtonIcon(); // Re-check the field value when mouse out
    });

    // Show variables when Variables button is clicked
    btnVariables.onClick = function() {
        var scriptFilePath = File(scriptFolderPath + "/NitroNamer/scripts/NNLayerInfo.jsx");
        if (scriptFilePath.exists) {
            $.evalFile(scriptFilePath);
        } else {
            alert("Script file not found: " + scriptFilePath.fsName);
        }
    };    

    // Copy layer name to template input field
    btnCopy.onClick = function() {
        var proj = app.project;
        if (proj && proj.activeItem instanceof CompItem) {
            var comp = proj.activeItem;
            var layer = null;
            if (comp.selectedLayers.length > 0) {
                layer = comp.selectedLayers[0];
            } else if (comp.numLayers > 0) {
                layer = comp.layer(1);
            }

            if (layer) {
                txtTemplate.text = "(" + layer.name + ")";
                updatePreview();
                updateLayerCounts();
                resetRenameButtonIcon();

                var currentSettings = {
                    allLayers: rdoAllLayers.value,
                    template: txtTemplate.text,
                    briefly: chkBriefly.value,
                    brieflyType: ddBrieflyType.selection.index
                };
                saveSettings(currentSettings, true);
            } else {
                alert("No layers in the composition.");
            }
        } else {
            alert("Please select a valid composition.");
        }
    };
    
    // Save settings when Save button is clicked
    btnSave.onClick = function() {
        var settings = {
            allLayers: rdoAllLayers.value,
            template: txtTemplate.text,
            briefly: chkBriefly.value,
            brieflyType: ddBrieflyType.selection.index
        };

        // Проверяем пустой шаблон
        if (!trim(settings.template)) {
            alert("Template cannot be empty.");
            return;
        }

        // Load current settings
        var existingSettings = loadSettings();
        var userPresets = existingSettings.userPresets || {};

        // Check for unique template
        for (var key in userPresets) {
            if (userPresets.hasOwnProperty(key) && userPresets[key].template === settings.template) {
                alert("A preset with this template already exists.");
                return;
            }
        }

        // Save the new preset
        var newPresetKey = saveSettings(settings, false);

        // Load updated settings
        var updatedSettings = loadSettings();
        updatePresetsDropdown(updatedSettings);

        // Set the selection to the newly saved preset
        var presetKeys = [];
        for (var key in updatedSettings.userPresets) {
            if (updatedSettings.userPresets.hasOwnProperty(key)) {
                presetKeys.push(key);
            }
        }

        var newPresetIndex = presetKeys.indexOf(newPresetKey);
        if (newPresetIndex !== -1) {
            ddLayerMode.selection = newPresetIndex;
        }

        // Ensure the template field remains the same
        txtTemplate.text = settings.template;
    };

    // Delete preset when Delete button is clicked
    btnCircleMinus.onClick = function() {
        var selectedPreset = ddLayerMode.selection;
        if (selectedPreset && selectedPreset.text !== "Save your new preset" && selectedPreset.text !== "Please select a preset to delete") {
            var presetTemplate = selectedPreset.text;

            // Save the current value of the template field
            var currentTemplateText = txtTemplate.text;

            // Load current settings
            var settings = loadSettings();
            var userPresets = settings.userPresets || {};

            // Find the key of the preset with the matching template and delete it
            var newUserPresets = {};
            var newPresetNumber = 1;
            for (var key in userPresets) {
                if (userPresets.hasOwnProperty(key)) {
                    if (userPresets[key].template !== presetTemplate) {
                        var newKey = "preset_" + newPresetNumber++;
                        newUserPresets[newKey] = userPresets[key];
                    }
                }
            }

            // Update settings
            settings.userPresets = newUserPresets;

            // Save updated settings
            var scriptFile = new File($.fileName);
            var scriptFolderPath = scriptFile.path + "/NitroNamer/settings";
            var settingsFile = new File(scriptFolderPath + "/settings.json");

            settingsFile.encoding = "UTF-8"; // Set encoding to UTF-8
            settingsFile.open("w");
            settingsFile.write(JSON.stringify(settings, null, 4));
            settingsFile.close();

            // Update preset list
            updatePresetsDropdown(settings);

            // Restore the template field value
            txtTemplate.text = currentTemplateText;

            // Update the current settings with the restored template value
            var currentSettings = {
                allLayers: rdoAllLayers.value,
                template: txtTemplate.text,
                briefly: chkBriefly.value,
                brieflyType: ddBrieflyType.selection.index
            };
            saveSettings(currentSettings, true);
        } else {
            updatePresetsDropdown(loadSettings());
        }
    };

    // Minimize or maximize the UI when Minimize button is clicked
    btnMinimize.onClick = function() {
        var settings = loadSettings();
        var currentSettings = settings.currentSettings || {};
        var isCompact = !currentSettings.UICompact; // Toggle value

        // Update the "UICompact" key in currentSettings
        currentSettings.UICompact = isCompact;
        settings.currentSettings = currentSettings;

        // Save the updated settings
        saveSettings(currentSettings, true);

        // Set the minimize button icon based on the new value
        setMinimizeButtonIcon(isCompact);
    };

    // Button click handler with Alt key functionality
    btnRename.onClick = function() {
        if (!btnRename.enabled) return; // Prevent renaming if the button is disabled

        var allLayers = rdoAllLayers.value;
        var template = txtTemplate.text;
        var briefly = chkBriefly.value;
        var brieflyType = ddBrieflyType.selection.text;

        // Check if the Alt key, Ctrl key, or Ctrl+Shift keys are held down
        var isAltPressed = ScriptUI.environment.keyboardState.altKey;
        var isCtrlPressed = ScriptUI.environment.keyboardState.ctrlKey;
        var isShiftPressed = ScriptUI.environment.keyboardState.shiftKey;
        var isCtrlShiftPressed = isCtrlPressed && isShiftPressed;

        // Initialize includeShyLayers and reverseOrder
        var includeShyLayers = isCtrlShiftPressed;
        var reverseOrder = isAltPressed;

        renameLayersByTemplate(allLayers, template, briefly, brieflyType, includeShyLayers, reverseOrder, isCtrlPressed, isShiftPressed, isAltPressed, isCtrlShiftPressed);

        updateLayerCounts();
        updatePreview();
        btnRename.image = File(scriptFolderPath + "/NitroNamer/img/doneIcon.png");
        btnRename.imageSize = [24, 24];
    };               

    // Show help when Help button is clicked
    btnHelp.onClick = function() {
        updateLayerCounts();
        var helpScriptPath = scriptFolderPath + "/NitroNamer/scripts/NNHelp.jsx";
        $.evalFile(helpScriptPath);
    };

    // Reset settings when Reset button is clicked
    btnReset.onClick = function() {
        rdoAllLayers.value = true;
        rdoOnlySelected.value = false;
        txtTemplate.text = "(Template for renaming)O_T.i";
        chkBriefly.value = false;
        ddBrieflyType.selection = 0;
        updateLayerCounts();
        updatePreview();
        resetRenameButtonIcon(); // Reset button icon to "Rename"
    };

    // Run NNSettings.jsx script when Settings button is clicked
    btnSettings.onClick = function() {
        var settingsScriptPath = scriptFolderPath + "/NitroNamer/scripts/NNSettings.jsx";
        $.evalFile(settingsScriptPath);
    };

    // Set the minimize button icon based on the UI state
    function setMinimizeButtonIcon(isCompact) {
        btnMinimize.removeEventListener("mouseover", handleMouseOverMaximize);
        btnMinimize.removeEventListener("mouseout", handleMouseOutMaximize);
        btnMinimize.removeEventListener("mouseover", handleMouseOverMinimize);
        btnMinimize.removeEventListener("mouseout", handleMouseOutMinimize);
    
        if (isCompact) {
            btnMinimize.image = File(scriptFolderPath + "/NitroNamer/img/maximize.png");
            btnMinimize.addEventListener("mouseover", handleMouseOverMaximize);
            btnMinimize.addEventListener("mouseout", handleMouseOutMaximize);
    
            // Hide UI elements
            btnRename.visible = false;
            btnHelp.visible = false;
            btnVariables.visible = false;
            btnReset.visible = false;
            btnSettings.visible = false; // Hide the settings button
            chkBriefly.visible = false;
            ddBrieflyType.visible = false;
            txtOriginalLabel.visible = false;
            txtOriginal.visible = false;
            txtRenamedLabel.visible = false;
            txtRenamed.visible = false;
    
            // Create a new txtRenamed field after txtTemplate
            if (!txtRenamedCompact) {
                txtRenamedCompact = grpTemplate.add("edittext", undefined, txtRenamed.text, {readonly: true});
                txtRenamedCompact.alignment = ["fill", "top"];
                txtRenamedCompact.margins = [0, -10, 0, 0];
            }
    
            // Adjust panel height
            win.layout.layout(true);
            win.layout.resize();
            win.size.height = 122;
            win.maximumSize.height = 122;
            win.maximumSize.width = globalWidthSizeElements + 8;
        } else {
            btnMinimize.image = File(scriptFolderPath + "/NitroNamer/img/minimize.png");
            btnMinimize.addEventListener("mouseover", handleMouseOverMinimize);
            btnMinimize.addEventListener("mouseout", handleMouseOutMinimize);
    
            // Show UI elements
            btnRename.visible = true;
            btnHelp.visible = true;
            btnVariables.visible = true;
            btnReset.visible = true;
            btnSettings.visible = true; // Show the settings button
            chkBriefly.visible = true;
            ddBrieflyType.visible = true;
            txtOriginalLabel.visible = true;
            txtOriginal.visible = true;
            txtRenamedLabel.visible = true;
            txtRenamed.visible = true;
    
            // Remove the compact txtRenamed field if it exists
            if (txtRenamedCompact) {
                grpTemplate.remove(txtRenamedCompact);
                txtRenamedCompact = null;
            }
    
            // Adjust panel height to automatic
            win.layout.layout(true);
            win.layout.resize();
            win.size.height = 122;
            win.maximumSize.height = 260;
        }
    
        // Force layout update
        win.layout.layout(true);
        win.layout.resize();
    }

    // Save settings to a JSON file
    function saveSettings(settings, isCurrent) {
        var scriptFile = new File($.fileName);
        var scriptFolderPath = scriptFile.path + "/NitroNamer/settings";
        var settingsFile = scriptFolderPath + "/settings.json";
    
        if (!Folder(scriptFolderPath).exists) {
            Folder(scriptFolderPath).create();
        }
    
        var existingSettings = loadSettings() || {};
        var userPresets = existingSettings.userPresets || {};
        var currentSettings = existingSettings.currentSettings || {};
    
        var newPresetKey = null; // Initialize new preset key
    
        if (isCurrent) {
            // Only update properties in currentSettings without replacing the entire object
            for (var key in settings) {
                if (settings.hasOwnProperty(key)) {
                    currentSettings[key] = settings[key];
                }
            }
        } else {
            // Считаем количество ключей в userPresets
            var nextPresetNumber = 1;
            for (var key in userPresets) {
                if (userPresets.hasOwnProperty(key)) {
                    nextPresetNumber++;
                }
            }
            newPresetKey = "preset_" + nextPresetNumber;
            userPresets[newPresetKey] = settings;
    
            // Move the new preset to the beginning
            var newUserPresets = {};
            newUserPresets[newPresetKey] = settings;
            for (var key in userPresets) {
                if (key !== newPresetKey) {
                    newUserPresets[key] = userPresets[key];
                }
            }
            userPresets = newUserPresets;
        }
    
        existingSettings.userPresets = userPresets;
        existingSettings.currentSettings = currentSettings;
    
        writeJSONFile(settingsFile, existingSettings);
    
        return newPresetKey; // Return the key of the newly saved preset
    }    

    function isArray(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
    }

    function readJSONFile(filePath) {
        var file = new File(filePath);
        var data = {};
        if (file.exists) {
            file.open("r");
            try {
                data = eval("(" + file.read() + ")");
            } catch (e) {
                alert("Error parsing JSON file: " + filePath);
            }
            file.close();
        }
        return data;
    }

    function writeJSONFile(filePath, data) {
        var file = new File(filePath);
        file.encoding = "UTF-8"; // Set encoding to UTF-8
        file.open("w");
        file.write(JSON.stringify(data, null, 4));
        file.close();
    }

    function checkAndCreateSettingsFile() {
        var scriptFile = new File($.fileName);
        var scriptFolderPath = scriptFile.path + "/NitroNamer/settings";
        var settingsFile = new File(scriptFolderPath + "/settings.json");
    
        if (!settingsFile.exists) {
            // Create the settings.json file and write initial settings
            var initialData = {
                "userPresets": {},
                "currentSettings": {
                    "UICompact": false
                }
            };
    
            settingsFile.encoding = "UTF-8"; // Set encoding to UTF-8
            if (settingsFile.open("w")) {
                settingsFile.write(JSON.stringify(initialData, null, 4));
                settingsFile.close();
            } else {
                alert("Error: Unable to create settings.json file.");
            }
        }
    }

    function checkAndCreateVariablesFile() {
        var scriptFile = new File($.fileName);
        var scriptFolderPath = scriptFile.path + "/NitroNamer/scripts";
        var variablesFile = new File(scriptFolderPath + "/variables.json");
    
        if (!variablesFile.exists) {
            // Create the variables.json file and write initial settings
            var initialData = {
                "An": { "defaultValue": "NoAnimations", "customValue": "Custom{An}", "active": true },
                "Ar": { "defaultValue": "NoAspectRatio", "customValue": "Custom{Ar}", "active": true },
                "E": { "defaultValue": "No effects", "customValue": "Custom{E}", "active": true },
                "F": { "defaultValue": "NoFrameRate", "customValue": "Custom{F}", "active": true },
                "H": { "defaultValue": "NoHeight", "customValue": "Custom{H}", "active": true },
                "Lexp": { "defaultValue": "NoExpressions", "customValue": "Custom{Lexp}", "active": true },
                "Fext": { "defaultValue": "NoExtension", "customValue": "Custom{Fext}", "active": true },
                "Lmc": { "defaultValue": "NoMasks", "customValue": "Custom{Lmc}", "active": true },
                "Lmn": { "defaultValue": "NoMaskNames", "customValue": "Custom{Lmn}", "active": true },
                "R": { "defaultValue": "NoResolution", "customValue": "Custom{R}", "active": true },
                "Tm": { "defaultValue": "NoTrackMate", "customValue": "Custom{Tm}", "active": true },
                "W": { "defaultValue": "NoWidth", "customValue": "Custom{W}", "active": true }
            };
    
            variablesFile.encoding = "UTF-8"; // Set encoding to UTF-8
            if (variablesFile.open("w")) {
                variablesFile.write(JSON.stringify(initialData, null, 4));
                variablesFile.close();
            } else {
                alert("Error: Unable to create variables.json file.");
            }
        }
    }

    function loadSettings() {
        var scriptFile = new File($.fileName);
        var scriptFolderPath = scriptFile.path + "/NitroNamer/settings";
        var settingsFile = scriptFolderPath + "/settings.json";
    
        var settings = readJSONFile(settingsFile);
    
        if (!settings.currentSettings) {
            settings.currentSettings = {};
        }
    
        if (settings.currentSettings.UICompact === undefined) {
            settings.currentSettings.UICompact = false;
        }
    
        return settings;
    }    

    var variableSettings;
    var lastModifiedTime;

    function loadVariableSettings() {
        var scriptFile = new File($.fileName);
        var scriptFolderPath = scriptFile.path + "/NitroNamer/scripts";
        var variablesFile = scriptFolderPath + "/variables.json";
        
        return readJSONFile(variablesFile);
    }    

    function getFileModifiedTime(filePath) {
        var file = new File(filePath);
        if (file.exists) {
            return file.modified;
        }
        return null;
    }    

    function getMaskCount(layer, settings, mode) {
        var maskCount = 0;
        var customSeparator = mode || ",";
    
        // Define mask modes (converted to lowercase)
        var maskModes = {
            "none": MaskMode.NONE,
            "add": MaskMode.ADD,
            "subtract": MaskMode.SUBTRACT,
            "intersect": MaskMode.INTERSECT,
            "lighten": MaskMode.LIGHTEN,
            "darken": MaskMode.DARKEN,
            "difference": MaskMode.DIFFERENCE
        };
    
        // Convert the mode to lowercase for case-insensitive comparison
        var lowerMode = mode ? mode.toLowerCase() : "";
    
        // Check if the mode is valid
        var isValidMode = maskModes.hasOwnProperty(lowerMode);
    
        if (layer.mask && layer.mask.numProperties > 0) {
            for (var i = 1; i <= layer.mask.numProperties; i++) {
                var mask = layer.mask.property(i);
    
                // Check the mask mode
                if (isValidMode && mask.maskMode === maskModes[lowerMode]) {
                    maskCount++;
                } else if (!isValidMode) {
                    maskCount++;
                }
            }
    
            return maskCount.toString();
        } else {
            if (settings && settings.Lmc) {
                return settings.Lmc.active ? settings.Lmc.customValue : settings.Lmc.defaultValue;
            } else {
                return "NoMasks";
            }
        }
    }

    function getMaskNames(layer, settings, mode) {
        var maskNames = [];
        var customSeparator = mode || ",";
    
        // Define mask modes (converted to lowercase)
        var maskModes = {
            "none": MaskMode.NONE,
            "add": MaskMode.ADD,
            "subtract": MaskMode.SUBTRACT,
            "intersect": MaskMode.INTERSECT,
            "lighten": MaskMode.LIGHTEN,
            "darken": MaskMode.DARKEN,
            "difference": MaskMode.DIFFERENCE
        };
    
        // Convert the mode to lowercase for case-insensitive comparison
        var lowerMode = mode ? mode.toLowerCase() : "";
    
        // Check if the mode is valid
        var isValidMode = maskModes.hasOwnProperty(lowerMode);
    
        if (layer.mask && layer.mask.numProperties > 0) {
            for (var i = 1; i <= layer.mask.numProperties; i++) {
                var mask = layer.mask.property(i);
    
                // Check the mask mode
                if (isValidMode && mask.maskMode === maskModes[lowerMode]) {
                    maskNames.push(mask.name);
                } else if (!isValidMode) {
                    maskNames.push(mask.name);
                }
            }
    
            if (isValidMode) {
                // Return mask names with specified mode
                return maskNames.join(", ");
            } else {
                // Return mask names with custom separator
                return maskNames.join(customSeparator);
            }
        } else {
            if (settings && settings.Lmn) {
                return settings.Lmn.active ? settings.Lmn.customValue : settings.Lmn.defaultValue;
            } else {
                return "NoMaskNames";
            }
        }
    }    
    
    // Load settings initially
    variableSettings = loadVariableSettings();

    // Apply settings to the UI
    function applySettings(settings) {
        // Temporarily disable the dropdown change handler
        ddLayerMode.onChange = null;

        if (settings && settings.currentSettings) {
            rdoAllLayers.value = settings.currentSettings.allLayers;
            rdoOnlySelected.value = !settings.currentSettings.allLayers;
            txtTemplate.text = settings.currentSettings.template || "(Template for renaming)O_T.i";
            chkBriefly.value = settings.currentSettings.briefly;
            ddBrieflyType.selection = settings.currentSettings.brieflyType || 0;

            updateLayerCounts();
            updatePreview();
            resetRenameButtonIcon();
        } else if (settings && settings.userPresets && Object.keys(settings.userPresets).length > 0) {
            var lastPresetKey = Object.keys(settings.userPresets).pop();
            var lastPreset = settings.userPresets[lastPresetKey];

            rdoAllLayers.value = lastPreset.allLayers;
            rdoOnlySelected.value = !lastPreset.allLayers;
            txtTemplate.text = lastPreset.template || "(Template for renaming)O_T.i";
            chkBriefly.value = lastPreset.briefly;
            ddBrieflyType.selection = lastPreset.brieflyType || 0;

            updateLayerCounts();
            updatePreview();
            resetRenameButtonIcon();
        }

        // Check for UICompact key and set the initial icon for btnMinimize
        var isCompact = settings.currentSettings && settings.currentSettings.UICompact;
        setMinimizeButtonIcon(isCompact);

        // Update presets dropdown
        updatePresetsDropdown(settings);

        if (settings.currentSettings && typeof settings.currentSettings.selectedPresetIndex !== 'undefined') {
            ddLayerMode.selection = settings.currentSettings.selectedPresetIndex;
        } else {
            ddLayerMode.selection = 0; // Select first item if no saved selection
        }

        // Explicitly set txtTemplate.text after updating the dropdown
        txtTemplate.text = settings.currentSettings.template || "(Template for renaming)O_T.i";

        // Re-enable the dropdown change handler
        ddLayerMode.onChange = dropdownChangeHandler;
    }

    // Event handler for dropdown change
    function dropdownChangeHandler() {
        var selectedPreset = ddLayerMode.selection;
        if (selectedPreset) {
            var presetTemplate = selectedPreset.text;
            var settings = loadSettings();
            var userPresets = settings.userPresets || {};

            for (var key in userPresets) {
                if (userPresets.hasOwnProperty(key) && userPresets[key].template === presetTemplate) {
                    var preset = userPresets[key];
                    rdoAllLayers.value = preset.allLayers;
                    rdoOnlySelected.value = !preset.allLayers;
                    txtTemplate.text = preset.template;
                    chkBriefly.value = preset.briefly;
                    ddBrieflyType.selection = preset.brieflyType || 0;

                    updateLayerCounts();
                    updatePreview();
                    resetRenameButtonIcon();

                    var currentSettings = {
                        allLayers: rdoAllLayers.value,
                        template: txtTemplate.text,
                        briefly: chkBriefly.value,
                        brieflyType: ddBrieflyType.selection.index,
                        selectedPresetIndex: ddLayerMode.selection.index
                    };
                    saveSettings(currentSettings, true);
                    break;
                }
            }
        }
    }

    // Update presets dropdown with current settings
    function updatePresetsDropdown(settings) {
        // Temporarily disable the dropdown change handler
        ddLayerMode.onChange = null;

        ddLayerMode.removeAll();
        var userPresets = settings.userPresets || {};
        var presetTemplates = [];

        for (var key in userPresets) {
            if (userPresets.hasOwnProperty(key)) {
                presetTemplates.push(userPresets[key].template);
            }
        }

        if (presetTemplates.length === 0) {
            ddLayerMode.add("item", "All presets have been deleted");
        } else {
            for (var i = 0; i < presetTemplates.length; i++) {
                ddLayerMode.add("item", presetTemplates[i]);
            }
        }

        if (settings.currentSettings && typeof settings.currentSettings.selectedPresetIndex !== 'undefined') {
            ddLayerMode.selection = settings.currentSettings.selectedPresetIndex;
        } else {
            ddLayerMode.selection = 0; // Select first item if no saved selection
        }

        // Re-enable the dropdown change handler
        ddLayerMode.onChange = dropdownChangeHandler;
    }

    // Update layer counts in the UI
    function updateLayerCounts() {
        var proj = app.project;
        if (proj) {
            var comp = proj.activeItem;
            if (comp && comp instanceof CompItem) {
                txtAllLayersCount.text = comp.numLayers;
                var selectedLayersCount = 0;
                for (var i = 1; i <= comp.numLayers; i++) {
                    if (comp.layer(i).selected) {
                        selectedLayersCount++;
                    }
                }
                txtSelectedLayersCount.text = selectedLayersCount;
                txtAllLayersCount.visible = rdoAllLayers.value;
                txtSelectedLayersCount.visible = rdoOnlySelected.value;
            } else {
                txtAllLayersCount.text = "0";
                txtSelectedLayersCount.text = "0";
            }
        } else {
            txtAllLayersCount.text = "0";
            txtSelectedLayersCount.text = "0";
        }
    }

    // Update preview of the new layer name
    function updatePreview() {
        checkAndUpdateSettings(); // Check and update settings before updating the preview
    
        var proj = app.project;
        if (proj) {
            var comp = proj.activeItem;
            if (comp && comp instanceof CompItem && comp.numLayers > 0) {
                var layer = null;
                if (rdoAllLayers.value) {
                    layer = comp.selectedLayers.length > 0 ? comp.selectedLayers[0] : comp.layer(1);
                } else if (rdoOnlySelected.value) {
                    layer = comp.selectedLayers.length > 0 ? comp.selectedLayers[0] : comp.layer(1);
                }
                if (layer) {
                    var originalName = layer.name;
                    var template = txtTemplate.text;
                    var briefly = chkBriefly.value;
                    var brieflyType = ddBrieflyType.selection.text;
                    var newName = generateNewName(layer, template, briefly, brieflyType, variableSettings);
                    txtOriginal.text = originalName;
                    txtRenamed.text = newName;
                    if (txtRenamedCompact) {
                        txtRenamedCompact.text = newName;
                    }
                } else {
                    txtOriginal.text = "No layers in composition.";
                    txtRenamed.text = "No layers in composition.";
                    if (txtRenamedCompact) {
                        txtRenamedCompact.text = "No layers in composition.";
                    }
                }
            } else {
                txtOriginal.text = "No composition selected.";
                txtRenamed.text = "No composition selected.";
                if (txtRenamedCompact) {
                    txtRenamedCompact.text = "No composition selected.";
                }
            }
        } else {
            txtOriginal.text = "No project open.";
            txtRenamed.text = "No project open.";
            if (txtRenamedCompact) {
                txtRenamedCompact.text = "No project open.";
            }
        }
    }    

    function checkAndUpdateSettings() {
        var scriptFile = new File($.fileName);
        var scriptFolderPath = scriptFile.path + "/NitroNamer/scripts";
        var variablesFile = scriptFolderPath + "/variables.json";
        
        var currentModifiedTime = getFileModifiedTime(variablesFile);
        if (currentModifiedTime && (!lastModifiedTime || currentModifiedTime.getTime() !== lastModifiedTime.getTime())) {
            variableSettings = loadVariableSettings();
            lastModifiedTime = currentModifiedTime;
        }
    }    

    // Generate new name for a layer based on the template
    function generateNewName(layer, template, briefly, brieflyType, settings) {
        checkAndUpdateSettings(); // Check and update settings before generating the new name
    
        var variables = {
            "T": getLayerType(layer),
            "i": layer.index,
            "I": localIndex,
            "O": layer.name,
            "E": getEffectNames(layer, settings),
            "An": getAnimatedProperties(layer, settings),
            "F": getFrameRate(layer, settings),
            "R": getResolution(layer, settings),
            "D": getDuration(layer),
            "Df": getDurationInFrames(layer),
            "C": app.project.activeItem.name,
            "Ip": layer.inPoint.toFixed(2),
            "Op": layer.outPoint.toFixed(2),
            "S": getSourceName(layer),
            "W": getWidth(layer, settings),
            "H": getHeight(layer, settings),
            "Tm": getTrackMatteType(layer, settings),
            "Ar": getAspectRatio(layer, settings),
            "Ec": getEffectsCount(layer),
            "Pn": getProjectName(),
            "Lpos": getLayerPosition(layer),
            "Lsc": getLayerScale(layer),
            "Lrot": getLayerRotation(layer),
            "Lops": getLayerOpacity(layer),
            "Lexp": getExpressionControlledProperties(layer, settings),
            "Fext": getFileExtension(layer, settings),
            "Lpnt": getLayerParentName(layer),
            "LpntIndex": getLayerParentIndex(layer),
            "Cd": getCurrentDate(),
            "Lmc": getMaskCount(layer, settings),
            "Lmn": getMaskNames(layer, settings)
        };
    
        if (briefly) {
            variables.F = parseFloat(variables.F).toFixed(2); 
        }
    
        var newName = replaceVariables(template, variables, layer.name, layer, settings);
    
        if (briefly) {
            newName = toBrieflyCase(newName, brieflyType);
        }
    
        return newName;
    }
    
    function toBrieflyCase(str, caseType) {
        switch (caseType) {
            case "Camel Case":
                return toCamelCase(str);
            case "Pascal Case":
                return toPascalCase(str);
            case "Snake Case":
                return toSnakeCase(str);
            case "Kebab Case":
                return toKebabCase(str);
            case "Screaming Snake Case":
                return toScreamingSnakeCase(str);
            default:
                return str;
        }
    }
    

    // Get the list of properties controlled by expressions
    function getExpressionControlledProperties(layer, settings, filter) {
        var expressionProps = [];
        var customSeparator = filter || ", ";
        var filterMode = filter && !/[*,]/.test(filter);

        function checkPropertyGroup(propertyGroup) {
            for (var i = 1; i <= propertyGroup.numProperties; i++) {
                var prop = propertyGroup.property(i);
                if (prop.expression && prop.expressionEnabled) {
                    if (filterMode && prop.name.toLowerCase() === filter.toLowerCase()) {
                        expressionProps.push(prop.name);
                    } else if (!filterMode) {
                        expressionProps.push(prop.name);
                    }
                }

                if (prop instanceof PropertyGroup || prop instanceof MaskPropertyGroup) {
                    checkPropertyGroup(prop);
                }
            }
        }

        checkPropertyGroup(layer);

        if (expressionProps.length > 0) {
            return expressionProps.join(customSeparator);
        } else {
            if (settings && settings.Lexp) {
                return settings.Lexp.active ? settings.Lexp.customValue : settings.Lexp.defaultValue;
            } else {
                return "NoExpressions";
            }
        }
    }

    // Get the track matte type of a layer
    function getTrackMatteType(layer, settings) {
        if (layer instanceof CameraLayer || layer instanceof LightLayer) {
            return settings && settings.Tm ? (settings.Tm.active ? settings.Tm.customValue : settings.Tm.defaultValue) : "NoTrackMate";
        } else if (layer.isTrackMatte) {
            return "TM:Source";
        } else if (layer.trackMatteType !== undefined && layer.trackMatteType !== TrackMatteType.NO_TRACK_MATTE) {
            var matteType;
            switch (layer.trackMatteType) {
                case TrackMatteType.ALPHA:
                    matteType = "Alpha";
                    break;
                case TrackMatteType.ALPHA_INVERTED:
                    matteType = "Alpha Inverted";
                    break;
                case TrackMatteType.LUMA:
                    matteType = "Luma";
                    break;
                case TrackMatteType.LUMA_INVERTED:
                    matteType = "Luma Inverted";
                    break;
                default:
                    matteType = "Unknown Track Matte";
            }
            return "TM:" + matteType;
        } else {
            return settings && settings.Tm ? (settings.Tm.active ? settings.Tm.customValue : settings.Tm.defaultValue) : "NoTrackMate";
        }
    }    

    // Convert string to camel case
    function toCamelCase(str) {
        var result = "";
        var capitalizeNext = false;

        for (var i = 0; i < str.length; i++) {
            var currentChar = str.charAt(i);
            var charCode = str.charCodeAt(i);

            if ((charCode >= 48 && charCode <= 57) || // цифры
                (charCode >= 65 && charCode <= 90) || // заглавные буквы
                (charCode >= 97 && charCode <= 122)) { // строчные буквы
                if (capitalizeNext) {
                    result += currentChar.toUpperCase();
                    capitalizeNext = false;
                } else {
                    result += currentChar.toLowerCase();
                }
            } else {
                result += currentChar; // Сохраняем символ, который не является буквой или цифрой
                capitalizeNext = true;
            }
        }

        return result;
    }

    // Convert string to pascal case
    function toPascalCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    // Convert string to snake case
    function toSnakeCase(str) {
        return str.replace(/\s+/g, '_').toLowerCase();
    }

    // Convert string to kebab case
    function toKebabCase(str) {
        return str.replace(/\s+/g, '-').toLowerCase();
    }

    // Convert string to screaming snake case
    function toScreamingSnakeCase(str) {
        return str.replace(/\s+/g, '_').toUpperCase();
    }

    // Get the type of a layer
    function getLayerType(layer) {
        if (layer.nullLayer) return "Null";
        if (layer.adjustmentLayer) return "Adjustment";
        if (layer instanceof AVLayer && layer.hasVideo) {
            if (layer.source instanceof CompItem) return "Pre-comp";
            if (layer.source instanceof FootageItem) {
                if (layer.source.mainSource instanceof SolidSource) return "Solid";
                if (layer.source.mainSource instanceof FileSource) return "Footage";
                if (layer.source.mainSource instanceof AudioSource) return "Audio";
            }
        }
        if (layer instanceof ShapeLayer) return "Shape";
        if (layer instanceof TextLayer) return "Text";
        if (layer instanceof LightLayer) return "Light";
        if (layer instanceof CameraLayer) return "Camera";
        if (layer.hasAudio && !layer.hasVideo) return "Audio";
        return "Unknown";
    }

    // Get the frame rate of a layer
    function getFrameRate(layer, settings) {
        if (layer.nullLayer || layer.adjustmentLayer || layer instanceof LightLayer || layer instanceof CameraLayer || layer instanceof TextLayer || layer instanceof ShapeLayer || layer.hasAudio) {
            return settings && settings.F ? (settings.F.active ? settings.F.customValue : settings.F.defaultValue) : "NoFrameRate";
        }
        if (layer.source && layer.source.mainSource instanceof SolidSource) {
            return settings && settings.F ? (settings.F.active ? settings.F.customValue : settings.F.defaultValue) : "NoFrameRate";
        }
        if (layer.source) {
            return layer.source.frameRate.toFixed(2);
        }
        return settings && settings.F ? (settings.F.active ? settings.F.customValue : settings.F.defaultValue) : "NoFrameRate";
    }    

    // Get the resolution of a layer
    function getResolution(layer, settings) {
        if (layer.nullLayer || layer.adjustmentLayer) {
            return settings && settings.R ? (settings.R.active ? settings.R.customValue : settings.R.defaultValue) : "NoResolution";
        }
        if (layer.source && layer.source.width && layer.source.height) {
            return layer.source.width + "*" + layer.source.height;
        }
        return settings && settings.R ? (settings.R.active ? settings.R.customValue : settings.R.defaultValue) : "NoResolution";
    }    

    // Get the duration of a layer in HH:MM:SS format
    function getDuration(layer) {
        var duration;
        if (layer.source && layer.source.duration) {
            duration = layer.source.duration;
        } else {
            duration = layer.outPoint - layer.inPoint;
        }

        var hours = Math.floor(duration / 3600);
        var minutes = Math.floor((duration % 3600) / 60);
        var seconds = Math.floor(duration % 60);
        var milliseconds = Math.floor((duration * 1000) % 1000);

        return function(format) {
            switch (format) {
                case '1':
                    return (hours < 10 ? "0" + hours : hours);
                case '2':
                    return (minutes < 10 ? "0" + minutes : minutes);
                case '3':
                    return (seconds < 10 ? "0" + seconds : seconds);
                case '4':
                    return (milliseconds < 100 ? (milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds) : milliseconds);
                default:
                    return (hours < 10 ? "0" + hours : hours) + ":" +
                        (minutes < 10 ? "0" + minutes : minutes) + ":" +
                        (seconds < 10 ? "0" + seconds : seconds);
            }
        };
    }   

    // Get the source name of a layer
    function getSourceName(layer) {
        if (layer.source) {
            return layer.source.name;
        }
        return layer.name; // Use the original name if there is no source name
    }

    // Get the width of a layer
    function getWidth(layer, settings) {
        if (layer.nullLayer || layer.adjustmentLayer) {
            return settings && settings.W ? (settings.W.active ? settings.W.customValue : settings.W.defaultValue) : "NoWidth";
        }
        if (layer.source && layer.source.width) {
            return layer.source.width.toString();
        }
        return settings && settings.W ? (settings.W.active ? settings.W.customValue : settings.W.defaultValue) : "NoWidth";
    }    

    // Get the height of a layer
    function getHeight(layer, settings) {
        if (layer.nullLayer || layer.adjustmentLayer) {
            return settings && settings.H ? (settings.H.active ? settings.H.customValue : settings.H.defaultValue) : "NoHeight";
        }
        if (layer.source && layer.source.height) {
            return layer.source.height.toString();
        }
        return settings && settings.H ? (settings.H.active ? settings.H.customValue : settings.H.defaultValue) : "NoHeight";
    }    

    // Get the position of a layer
    function getLayerPosition(layer) {
        if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
            return ""; // Return an empty string for Audio type layers
        }

        if (layer.transform && layer.transform.position) {
            var pos = layer.transform.position.value;

            // Ensure pos is an array
            if (typeof pos === 'number') {
                pos = [pos];
            } else if (Object.prototype.toString.call(pos) !== '[object Array]') {
                pos = [].slice.call(pos);
            }

            if (layer instanceof CameraLayer || layer instanceof LightLayer || layer.threeDLayer) {
                // Ensure position is returned as X, Y, Z for Camera, Light, and 3D layers
                var roundedPos = [0, 0, 0]; // Default to [0, 0, 0] for safety
                for (var i = 0; i < 3; i++) {
                    roundedPos[i] = pos[i] !== undefined ? Math.round(pos[i] * 10) / 10 : 0;
                }
                return roundedPos.join(", ");
            } else {
                // Return X, Y for 2D layers
                var roundedPos2D = [0, 0]; // Default to [0, 0] for safety
                for (var j = 0; j < 2; j++) {
                    roundedPos2D[j] = pos[j] !== undefined ? Math.round(pos[j] * 10) / 10 : 0;
                }
                return roundedPos2D.join(", ");
            }
        }
        return "NoPosition";
    }

    // Add new "Ar(px)" mode to get the aspect ratio in pixels
    function getAspectRatio(layer, settings, inPixels) {
        if (layer.nullLayer || layer.adjustmentLayer) {
            return settings && settings.Ar ? (settings.Ar.active ? settings.Ar.customValue : settings.Ar.defaultValue) : "NoAspectRatio";
        }
        if (layer.source && layer.source.width && layer.source.height) {
            var width = layer.source.width;
            var height = layer.source.height;

            if (inPixels) {
                return width + "px:" + height + "px";
            }

            var gcd = function(a, b) {
                return b == 0 ? a : gcd(b, a % b);
            };
            var divisor = gcd(width, height);
            return (width / divisor) + ":" + (height / divisor);
        }
        return settings && settings.Ar ? (settings.Ar.active ? settings.Ar.customValue : settings.Ar.defaultValue) : "NoAspectRatio";
    }

    // Get the number of effects applied to a layer
    function getEffectsCount(layer) {
        if (layer.property("ADBE Effect Parade")) {
            return layer.property("ADBE Effect Parade").numProperties;
        }
        return 0;
    }

    // Get the project name
    function getProjectName() {
        var projectName = "Untitled Project";
        if (app.project.file) {
            var projectFileName = app.project.file.name;
            var lastDotIndex = projectFileName.lastIndexOf('.');
            if (lastDotIndex !== -1) {
                projectName = projectFileName.substring(0, lastDotIndex);
            } else {
                projectName = projectFileName;
            }
        }
        return decodeURIComponent(projectName); // Decode any URL-encoded characters
    }

    // Get the animated properties of a layer
    function getAnimatedProperties(layer, settings, filter) {
        var animatedProps = [];
        var customSeparator = filter || ", ";
        var filterMode = filter && !/[*,]/.test(filter);

        function checkPropertyGroup(propertyGroup) {
            for (var i = 1; i <= propertyGroup.numProperties; i++) {
                var prop = propertyGroup.property(i);
                if (prop.numKeys > 0) {
                    if (filterMode && prop.name.toLowerCase() === filter.toLowerCase()) {
                        animatedProps.push(prop.name);
                    } else if (!filterMode) {
                        animatedProps.push(prop.name);
                    }
                }
                if (prop instanceof PropertyGroup || prop instanceof MaskPropertyGroup) {
                    checkPropertyGroup(prop);
                }
            }
        }

        checkPropertyGroup(layer);

        if (animatedProps.length > 0) {
            return animatedProps.join(customSeparator);
        } else {
            if (settings && settings.An) {
                return settings.An.active ? settings.An.customValue : settings.An.defaultValue;
            } else {
                return "NoAnimations";
            }
        }
    }

    // Get the scale of a layer
    function getLayerScale(layer) {
        if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
            return ""; // Return an empty string for Audio type layers
        }

        if (layer.transform && layer.transform.scale) {
            var sc = layer.transform.scale.value;

            // Ensure sc is an array
            if (typeof sc === 'number') {
                sc = [sc];
            } else if (Object.prototype.toString.call(sc) !== '[object Array]') {
                sc = [].slice.call(sc);
            }

            if (layer instanceof CameraLayer || layer instanceof LightLayer || layer.threeDLayer) {
                // Ensure scale is returned as X, Y, Z for Camera, Light, and 3D layers
                var roundedSc = [0, 0, 0]; // Default to [0, 0, 0] for safety
                for (var i = 0; i < 3; i++) {
                    roundedSc[i] = sc[i] !== undefined ? Math.round(sc[i] * 10) / 10 : 0;
                }
                return roundedSc.join(", ");
            } else {
                // Return X, Y for 2D layers
                var roundedSc2D = [0, 0]; // Default to [0, 0] for safety
                for (var j = 0; j < 2; j++) {
                    roundedSc2D[j] = sc[j] !== undefined ? Math.round(sc[j] * 10) / 10 : 0;
                }
                return roundedSc2D.join(", ");
            }
        }
        return "NoScale";
    }

    // Get the rotation of a layer
    function getLayerRotation(layer) {
        if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
            return ""; // Return an empty string for Audio type layers
        }

        if (layer.transform) {
            var rotation;

            // Handle 3D layers
            if (layer.threeDLayer) {
                var rotationX = layer.transform.xRotation ? layer.transform.xRotation.value : 0;
                var rotationY = layer.transform.yRotation ? layer.transform.yRotation.value : 0;
                var rotationZ = layer.transform.zRotation ? layer.transform.zRotation.value : 0;
                rotation = [rotationX, rotationY, rotationZ];
            } else {
                // Handle 2D layers and layers without xRotation, yRotation, zRotation properties
                rotation = layer.transform.rotation ? [layer.transform.rotation.value] : [0];
            }

            // Ensure rotation is an array
            if (typeof rotation === 'number') {
                rotation = [rotation];
            } else if (Object.prototype.toString.call(rotation) !== '[object Array]') {
                rotation = [].slice.call(rotation);
            }

            // Ensure position is returned as X, Y, Z for Camera, Light, and 3D layers
            if (layer instanceof CameraLayer || layer instanceof LightLayer || layer.threeDLayer) {
                var roundedRot = [0, 0, 0]; // Default to [0, 0, 0] for safety
                for (var i = 0; i < 3; i++) {
                    roundedRot[i] = rotation[i] !== undefined ? Math.round(rotation[i] * 10) / 10 : 0;
                }
                return roundedRot.join(", ");
            } else {
                // Return X for 2D layers
                var roundedRot2D = [0]; // Default to [0] for safety
                roundedRot2D[0] = rotation[0] !== undefined ? Math.round(rotation[0] * 10) / 10 : 0;
                return roundedRot2D.join(", ");
            }
        }
        return "NoRotation";
    }

    // Get the file extension of a layer's source file
    function getFileExtension(layer, settings, customExtension) {
        if (layer.source && layer.source.file && layer.source.file.name) {
            var fileName = layer.source.file.name;
            var extension = fileName.split('.').pop();
            if (customExtension) {
                return extension.toLowerCase() === customExtension.toLowerCase() ? customExtension : (settings && settings.Fext ? (settings.Fext.active ? settings.Fext.customValue : settings.Fext.defaultValue) : "NoExtension");
            }
            return extension;
        }
        return settings && settings.Fext ? (settings.Fext.active ? settings.Fext.customValue : settings.Fext.defaultValue) : "NoExtension";
    }

    // Get the opacity of a layer
    function getLayerOpacity(layer) {
        if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
            return ""; // Return an empty string for Audio type layers
        }

        if (layer.transform && layer.transform.opacity) {
            var opacity = layer.transform.opacity.value;
            return Math.round(opacity * 10) / 10;
        }
        return "NoOpacity";
    }

    // Get the duration of a layer in frames based on the in and out points
    function getDurationInFrames(layer) {
        if (layer && layer.containingComp) {
            var frameRate = layer.containingComp.frameRate;
            var duration = (layer.outPoint - layer.inPoint) * frameRate;
            return Math.round(duration);
        }
        return "NoDuration";
    }

    // Get the parent name of a layer, keeping the original name for top-level parents
    function getLayerParentName(layer) {
        if (!layer || !layer.containingComp) {
            return "NoParent";
        }
        if (layer.parent) {
            return layer.parent.name;
        }
        // If the layer has no parent but is a parent to another layer, keep its original name
        if (isParentLayer(layer)) {
            return layer.name;
        }
        return "NoParent";
    }

    // Check if the layer is a parent layer
    function isParentLayer(layer) {
        if (!layer || !layer.containingComp) {
            return false;
        }
        var comp = layer.containingComp;
        for (var i = 1; i <= comp.numLayers; i++) {
            if (comp.layer(i).parent === layer) {
                return true;
            }
        }
        return false;
    }

    // Check if the layer is bound to another layer
    function isBoundLayer(layer) {
        return layer.parent !== null;
    }

    // Get the index of the layer relative to other layers with the same parent
    function getLayerParentIndex(layer) {
        if (!layer.parent) {
            return "";
        }

        var parentLayer = layer.parent;
        var comp = layer.containingComp;
        var sameParentLayers = [];
        
        for (var i = 1; i <= comp.numLayers; i++) {
            var currentLayer = comp.layer(i);
            if (currentLayer.parent === parentLayer) {
                sameParentLayers.push(currentLayer);
            }
        }
        
        var relativeIndex = sameParentLayers.indexOf(layer) + 1;
        return relativeIndex;
    }

    // Function to check if a layer should preserve its name
    function shouldPreserveName(layer) {
        return !layer.parent && isParentLayer(layer);
    }

    function getParentChildHierarchy(comp) {
        var layerInfo = [];
        for (var i = 1; i <= comp.numLayers; i++) {
            var layer = comp.layer(i);
            layerInfo.push({layer: layer, parent: layer.parent});
        }
        return layerInfo;
    }
    
    function getCurrentDate(format) {
        var date = new Date();
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear().toString();
        
        switch (format) {
            case '1':
                return day;
            case '2':
                return month;
            case '3':
                return year;
            default:
                return day + "." + month + "." + year;
        }
    }
    
    function sortLayersByHierarchy(layerInfo) {
        var sortedLayers = [];
        var visitedLayers = []; // Use an array instead of Set
    
        function addLayerAndChildren(layer) {
            if (visitedLayers.indexOf(layer) === -1) {
                visitedLayers.push(layer);
                for (var j = 0; j < layerInfo.length; j++) {
                    if (layerInfo[j].parent === layer) {
                        addLayerAndChildren(layerInfo[j].layer);
                    }
                }
                sortedLayers.push(layer);
            }
        }
    
        for (var i = 0; i < layerInfo.length; i++) {
            addLayerAndChildren(layerInfo[i].layer);
        }
    
        return sortedLayers;
    }
    
    // Get the layer order based on the mode and reverse flag
    function getLayerOrder(comp, allLayers, reverseOrder) {
        var layers = [];
        if (allLayers) {
            for (var i = 1; i <= comp.numLayers; i++) {
                layers.push(comp.layer(i));
            }
        } else {
            for (var j = 0; j < comp.selectedLayers.length; j++) {
                layers.push(comp.selectedLayers[j]);
            }
        }
    
        // Reverse order if reverseOrder flag is true
        if (reverseOrder) {
            layers.reverse();
        }
        return layers;
    }    

    // Replace variables in the template with actual values
    function replaceVariables(template, variables, originalName, layer, settings) {
        var usedVariables = [];
        var result = template;

        // Pre-check for any parentheses that don't contain variables
        if (template.match(/^\(([^()]+)\)$/)) {
            return template.match(/^\(([^()]+)\)$/)[1];
        }

        var regex = /\(([^()]+)\)|E\(([^)]+)\)|E\{([^}]+)\}|An\(([^)]+)\)|An\{([^}]+)\}|Lexp\(([^)]+)\)|D\(([^)]+)\)|Df|D|Ec|Fext\(([^)]+)\)|Fext|Lexp|Ip|Op|Tm|An|Ar\(([^)]+)\)|Ar|Pn|Lpos|Lsc|Lrot|Lops|Lpnt\(([^)]+)\)|Lpnt|Cd\(([^)]+)\)|Cd|Lmc\(([^)]+)\)|Lmc|Lmn\(([^)]+)\)|Lmn|[A-Z]|i|I|S|W|H/g;

        var replacements = {
            'An': { 'regex': /An\(([^)]+)\)/, 'value': '' },
            'E': { 'regex': /E\(([^)]+)\)/, 'value': '' },
            'Lexp': { 'regex': /Lexp\(([^)]+)\)/, 'value': '' },
            'Fext': { 'regex': /Fext\(([^)]+)\)/, 'value': '' },
            'Lmc': { 'regex': /Lmc\(([^)]+)\)/, 'value': '' },
            'Lmn': { 'regex': /Lmn\(([^)]+)\)/, 'value': '' }
        };

        result = result.replace(regex, function(match, group, customEffectDelimiterParentheses, customEffectDelimiterBraces, customAnimDelimiterParentheses, customAnimDelimiterBraces, customLexpDelimiter, durationFormat, customFext, customAr, parentIndex, dateFormat, customMaskCountMode, customMaskNameDelimiter) {
            var value;

            if (group !== undefined) {
                return group;
            } else if (customEffectDelimiterParentheses !== undefined) {
                var effectsString = getEffectNames(layer, settings, customEffectDelimiterParentheses);
                replacements['E'].value = effectsString;
                usedVariables.push('E');
                return effectsString;
            } else if (customEffectDelimiterBraces !== undefined) {
                var effectsString = getEffectNames(layer, settings, customEffectDelimiterBraces);
                replacements['E'].value = effectsString;
                usedVariables.push('E');
                return effectsString;
            } else if (customAnimDelimiterParentheses !== undefined) {
                var animatedPropsString = getAnimatedProperties(layer, settings, customAnimDelimiterParentheses);
                replacements['An'].value = animatedPropsString;
                usedVariables.push('An');
                return animatedPropsString;
            } else if (customAnimDelimiterBraces !== undefined) {
                var animatedPropsString = getAnimatedProperties(layer, settings, customAnimDelimiterBraces);
                replacements['An'].value = animatedPropsString;
                usedVariables.push('An');
                return animatedPropsString;
            } else if (customLexpDelimiter !== undefined) {
                var lexpString = getExpressionControlledProperties(layer, settings, customLexpDelimiter);
                replacements['Lexp'].value = lexpString;
                usedVariables.push('Lexp');
                return lexpString;
            } else if (customFext !== undefined) {
                value = getFileExtension(layer, settings, customFext);
            } else if (customAr !== undefined) {
                value = getAspectRatio(layer, settings, true);
            } else if (durationFormat !== undefined) {
                value = typeof variables['D'] === 'function' ? variables['D'](durationFormat) : variables['D'];
            } else if (match === 'D') {
                value = typeof variables['D'] === 'function' ? variables['D']() : variables['D'];
            } else if (match === 'Df') {
                value = variables['Df'];
            } else if (match === 'Ec') {
                value = variables['Ec'];
            } else if (match === 'Fext') {
                value = variables['Fext'];
            } else if (match === 'Lexp') {
                value = variables['Lexp'];
            } else if (match === 'Ip') {
                value = variables['Ip'];
            } else if (match === 'Op') {
                value = variables['Op'];
            } else if (match === 'Tm') {
                value = variables['Tm'];
            } else if (match === 'Ar') {
                value = variables['Ar'];
            } else if (match === 'Pn') {
                value = variables['Pn'];
            } else if (match === 'Lpos') {
                value = variables['Lpos'];
            } else if (match === 'Lsc') {
                value = variables['Lsc'];
            } else if (match === 'Lrot') {
                value = variables['Lrot'];
            } else if (match === 'Lops') {
                value = variables['Lops'];
            } else if (match === 'Lpnt') {
                if (isParentLayer(layer) && !isBoundLayer(layer)) {
                    value = originalName;
                } else {
                    value = variables['Lpnt'];
                }
            } else if (parentIndex !== undefined) {
                value = variables['LpntIndex'];
            } else if (dateFormat !== undefined) {
                value = getCurrentDate(dateFormat);
            } else if (match === 'Cd') {
                value = getCurrentDate();
            } else if (customMaskCountMode !== undefined) {
                var maskCountString = getMaskCount(layer, settings, customMaskCountMode);
                replacements['Lmc'].value = maskCountString;
                usedVariables.push('Lmc');
                return maskCountString;
            } else if (customMaskNameDelimiter !== undefined) {
                var maskNamesString = getMaskNames(layer, settings, customMaskNameDelimiter);
                replacements['Lmn'].value = maskNamesString;
                usedVariables.push('Lmn');
                return maskNamesString;
            } else if (match === 'Lmc') {
                value = getMaskCount(layer, settings);
            } else if (match === 'Lmn') {
                value = getMaskNames(layer, settings);
            } else {
                value = variables[match];
            }

            if (value !== undefined && value !== "") {
                usedVariables.push(match);
                return value;
            } else {
                return "";
            }
        });

        // Handle the case where An(Separator) is the only variable in the template
        if (usedVariables.length === 0 && template.indexOf('An(') !== -1) {
            var customAnimDelimiter = template.match(/An\(([^)]+)\)/);
            if (customAnimDelimiter) {
                var customAnimDelimiterValue = customAnimDelimiter[1];
                var animatedPropsString = getAnimatedProperties(layer, settings, customAnimDelimiterValue);
                result = animatedPropsString;
                usedVariables.push('An');
            }
        }

        // Handle the case where E(Separator) is the only variable in the template
        if (usedVariables.length === 0 && template.indexOf('E(') !== -1) {
            var customEffectDelimiter = template.match(/E\(([^)]+)\)/);
            if (customEffectDelimiter) {
                var customEffectDelimiterValue = customEffectDelimiter[1];
                var effectsString = getEffectNames(layer, settings, customEffectDelimiterValue);
                result = effectsString;
                usedVariables.push('E');
            }
        }

        // Handle the case where Lexp(Separator) is the only variable in the template
        if (usedVariables.length === 0 && template.indexOf('Lexp(') !== -1) {
            var customLexpDelimiter = template.match(/Lexp\(([^)]+)\)/);
            if (customLexpDelimiter) {
                var customLexpDelimiterValue = customLexpDelimiter[1];
                var lexpString = getExpressionControlledProperties(layer, settings, customLexpDelimiterValue);
                result = lexpString;
                usedVariables.push('Lexp');
            }
        }

        // Handle the case where Fext(Separator) is the only variable in the template
        if (usedVariables.length === 0 && template.indexOf('Fext(') !== -1) {
            var customFextDelimiter = template.match(/Fext\(([^)]+)\)/);
            if (customFextDelimiter) {
                var customFextDelimiterValue = customFextDelimiter[1];
                var fextString = getFileExtension(layer, settings, customFextDelimiterValue);
                result = fextString;
                usedVariables.push('Fext');
            }
        }

        // If both "An" and "E" were used, replace their placeholders with actual values
        if (usedVariables.indexOf('An') !== -1) {
            result = result.replace(replacements['An'].regex, replacements['An'].value);
        }

        if (usedVariables.indexOf('E') !== -1) {
            result = result.replace(replacements['E'].regex, replacements['E'].value);
        }

        // If "Lexp" was used, replace its placeholder with actual values
        if (usedVariables.indexOf('Lexp') !== -1) {
            result = result.replace(replacements['Lexp'].regex, replacements['Lexp'].value);
        }

        // If "Fext" was used, replace its placeholder with actual values
        if (usedVariables.indexOf('Fext') !== -1) {
            result = result.replace(replacements['Fext'].regex, replacements['Fext'].value);
        }

        // If "Lmc" was used, replace its placeholder with actual values
        if (usedVariables.indexOf('Lmc') !== -1) {
            result = result.replace(replacements['Lmc'].regex, replacements['Lmc'].value);
        }

        // If "Lmn" was used, replace its placeholder with actual values
        if (usedVariables.indexOf('Lmn') !== -1) {
            result = result.replace(replacements['Lmn'].regex, replacements['Lmn'].value);
        }

        if (usedVariables.length === 0) {
            return result;
        }

        return result;
    }

    var localIndex = 1; // Global local index

    // Rename layers based on the template
    function renameLayersByTemplate(allLayers, template, briefly, brieflyType, includeShyLayers, reverseOrder, isCtrlPressed, isShiftPressed, isAltPressed, isCtrlShiftPressed) {
        checkAndUpdateSettings(); // Check and update settings before renaming layers
    
        var proj = app.project;
        if (proj && proj.activeItem instanceof CompItem) {
            var comp = proj.activeItem;
            if (comp.numLayers > 0) {
                app.beginUndoGroup("Rename Layers by Template");
    
                // Determine the layer order
                var layers = getLayerOrder(comp, allLayers, isCtrlShiftPressed); // Use isCtrlShiftPressed for inversion
                
                var validLayerCount = 0; // Initialize valid layer count
    
                // First pass to count valid layers
                for (var i = 0; i < layers.length; i++) {
                    var layer = layers[i];
                    if (layer.locked) continue; // Skip locked layers
                    validLayerCount++;
                }
    
                var validIndex = 1; // Initialize valid layer index
    
                // Second pass to rename layers
                for (var i = 0; i < layers.length; i++) {
                    var layer = layers[i];
                    if (layer.shy && !includeShyLayers) continue;
                    if (layer.locked) continue; // Skip locked layers
                    if (!allLayers && !layer.selected) continue;
    
                    var variables = {
                        "T": getLayerType(layer),
                        "i": layer.index,
                        "I": validIndex,  // Set I to the valid layer index
                        "O": layer.name,
                        "E": getEffectNames(layer, variableSettings),
                        "An": getAnimatedProperties(layer, variableSettings),
                        "F": getFrameRate(layer, variableSettings),
                        "R": getResolution(layer, variableSettings),
                        "D": getDuration(layer),
                        "Df": getDurationInFrames(layer),
                        "C": comp.name,
                        "Ip": layer.inPoint.toFixed(2),
                        "Op": layer.outPoint.toFixed(2),
                        "S": getSourceName(layer),
                        "W": getWidth(layer, variableSettings),
                        "H": getHeight(layer, variableSettings),
                        "Tm": getTrackMatteType(layer, variableSettings),
                        "Ar": getAspectRatio(layer, variableSettings),
                        "Ec": getEffectsCount(layer),
                        "Pn": getProjectName(),
                        "Lpos": getLayerPosition(layer),
                        "Lsc": getLayerScale(layer),
                        "Lrot": getLayerRotation(layer),
                        "Lops": getLayerOpacity(layer),
                        "Lexp": getExpressionControlledProperties(layer, variableSettings),
                        "Fext": getFileExtension(layer, variableSettings),
                        "Lpnt": layer.parent ? layer.parent.name : "NoParent",
                        "LpntIndex": getLayerParentIndex(layer),
                        "Lmc": getMaskCount(layer, variableSettings),
                        "Lmn": getMaskNames(layer, variableSettings)
                    };
    
                    var newName = replaceVariables(template, variables, layer.name, layer, variableSettings);
    
                    if (briefly) {
                        switch (brieflyType) {
                            case "Camel Case":
                                newName = toCamelCase(newName);
                                break;
                            case "Pascal Case":
                                newName = toPascalCase(newName);
                                break;
                            case "Snake Case":
                                newName = toSnakeCase(newName);
                                break;
                            case "Kebab Case":
                                newName = toKebabCase(newName);
                                break;
                            case "Screaming Snake Case":
                                newName = toScreamingSnakeCase(newName);
                                break;
                        }
                    }
    
                    if (isCtrlPressed && !isShiftPressed) {
                        layer.name = layer.name + newName;
                    } else if (isShiftPressed && !isCtrlPressed) {
                        layer.name = newName + layer.name;
                    } else {
                        layer.name = newName;
                    }
    
                    validIndex++; // Increment valid layer index
                }
    
                app.endUndoGroup();
            } else {
                alert("No layers in the active composition.");
            }
        } else {
            alert("Please select a valid composition.");
        }
    }    

    // Get the effect names applied to a layer with optional filtering and custom separator
    function getEffectNames(layer, settings, filter) {
        var effectNames = [];
        var customSeparator = filter || ", ";

        if (layer.property("ADBE Effect Parade") && layer.property("ADBE Effect Parade").numProperties > 0) {
            for (var j = 1; j <= layer.property("ADBE Effect Parade").numProperties; j++) {
                var effect = layer.property("ADBE Effect Parade").property(j);
                if (filter && effect.name.toLowerCase() === filter.toLowerCase()) {
                    effectNames.push(effect.name);
                    break; // Stop after finding the matching effect
                } else if (!filter) {
                    effectNames.push(effect.name);
                }
            }
        }

        if (filter && effectNames.length === 0) {
            // If filter is provided and no matching effects found, treat the filter as a custom separator
            return getEffectNames(layer, { E: { active: true, customValue: "No effects", defaultValue: "No effects" } }).split(", ").join(filter);
        } else {
            if (effectNames.length > 0) {
                return effectNames.join(customSeparator);
            } else {
                if (settings && settings.E) {
                    return settings.E.active ? settings.E.customValue : settings.E.defaultValue;
                } else {
                    return "No effects";
                }
            }
        }
    }

    checkAndCreateSettingsFile();
    checkAndCreateVariablesFile();

    var settings = loadSettings();
    applySettings(settings);

    updateLayerCounts();
    updatePreview();
    updateRenameButtonIcon();

    if (win instanceof Window) {
        win.center();
        win.show();
    }
    return win;
}

var myScriptPal = buildUI(this);
if (myScriptPal instanceof Panel) {
    myScriptPal.layout.layout(true);
} else {
    myScriptPal.center();
    myScriptPal.show();
}