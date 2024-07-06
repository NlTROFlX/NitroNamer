function buildUI(thisObj) {
    // Create a window or panel for the UI
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "NitroNamer", undefined, {resizeable: true});
    var globalWidthSizeElements = 284; // Set global width for UI elements
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.preferredSize.height = 122;
    win.active = true;
    win.margins = [4,4,4,4];

    // Create group for layer selection options
    var grpLayerSelection = win.add("group", undefined);
    grpLayerSelection.orientation = "row"; // Set orientation to horizontal

    // Add radio buttons for layer selection mode
    var rdoAllLayers = grpLayerSelection.add("radiobutton", undefined, "Total: ");
    rdoAllLayers.value = true; // Default to selecting all layers
    var txtAllLayersCount = grpLayerSelection.add("statictext", undefined, "");

    var rdoOnlySelected = grpLayerSelection.add("radiobutton", undefined, "Selected: ");
    var txtSelectedLayersCount = grpLayerSelection.add("statictext", undefined, "");

    // Get the script's file and folder path
    var scriptFile = new File($.fileName);
    var scriptFolderPath = scriptFile.path;

    // Add Save button with icon and hover effect
    var btnSave = grpLayerSelection.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/save.png"), {style: "toolbutton"});
    btnSave.size = [24, 24];
    btnSave.imageSize = [24, 24];
    btnSave.alignment = ["right", "center"];
    btnSave.addEventListener("mouseover", function() {
        btnSave.image = File(scriptFolderPath + "/NitroNamer/img/saveHover.png");
        btnSave.imageSize = [24, 24];
    });
    btnSave.addEventListener("mouseout", function() {
        btnSave.image = File(scriptFolderPath + "/NitroNamer/img/save.png");
        btnSave.imageSize = [24, 24];
    });

    // Add Delete button with icon and hover effect
    var btnCircleMinus = grpLayerSelection.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/delete.png"), {style: "toolbutton"});
    btnCircleMinus.size = [24, 24];
    btnCircleMinus.imageSize = [24, 24];
    btnCircleMinus.alignment = ["right", "center"];
    btnCircleMinus.addEventListener("mouseover", function() {
        btnCircleMinus.image = File(scriptFolderPath + "/NitroNamer/img/deleteHover.png");
        btnCircleMinus.imageSize = [24, 24];
    });
    btnCircleMinus.addEventListener("mouseout", function() {
        btnCircleMinus.image = File(scriptFolderPath + "/NitroNamer/img/delete.png");
        btnCircleMinus.imageSize = [24, 24];
    });

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

    // Event handler for dropdown list change
    ddLayerMode.onChange = function() {
        var selectedPreset = ddLayerMode.selection;
        if (selectedPreset) {
            var presetTemplate = selectedPreset.text;
            var settings = loadSettings();
            var userPresets = settings.userPresets || {};

            // Find and apply the selected preset settings
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

    // Create group for template text field
    var grpTemplate = win.add("group", undefined);
    grpTemplate.orientation = "column";
    grpTemplate.margins = [0,-10,0,0];
    var txtTemplate = grpTemplate.add("edittext", undefined, "(Template for renaming)O_T.i", {multiline: false, scrolling: false});
    txtTemplate.alignment = ["fill", "top"];
    txtTemplate.margins = [0,-10,0,0];
    txtTemplate.onChanging = function() {
        updatePreview();
        updateLayerCounts();
        resetRenameButtonIcon();
    };

    // Save settings when template text field changes
    txtTemplate.onChange = function() {
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

    // Event listener for Enter key in template text field
    txtTemplate.addEventListener("keydown", function(event) {
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

    // Add text fields for original and renamed layer names
    var txtOriginalLabel = grpTextFields.add("statictext", undefined, "Input layer name: ");
    txtOriginalLabel.maximumSize.height = 8;
    var txtOriginal = grpTextFields.add("edittext", undefined, "", {readonly: true});
    txtOriginal.alignment = ["fill", "top"];
    txtOriginal.maximumSize.width = globalWidthSizeElements;
    txtOriginal.margins = [0, -10, 0, 0];

    var txtRenamedLabel = grpTextFields.add("statictext", undefined, "Template result: ");
    txtRenamedLabel.maximumSize.height = 8;
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
    var chkBriefly = grpBriefly.add("checkbox", undefined, "Briefly");
    var ddBrieflyType = grpBriefly.add("dropdownlist", undefined, ["Camel Case", "Pascal Case", "Snake Case", "Kebab Case", "Screaming Snake Case", "This Comp"]);
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

    // Create group for main action buttons
    var grpButtons = win.add("group", undefined);
    grpButtons.orientation = "row";
    grpButtons.margins = [0,-10,0,0];

    // Add Rename button with icon and hover effect
    var btnRename = grpButtons.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/renameIcon.png"), { style: "toolbutton" });
    btnRename.size = [32, 32]; // Set button size
    btnRename.imageSize = [24, 24]; // Set image size

    // Add Help button with icon and hover effect
    var btnHelp = grpButtons.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/helpIcon.png"), { style: "toolbutton" });
    btnHelp.size = [32, 32]; // Set button size
    btnHelp.imageSize = [24, 24]; // Set image size

    // Add Variables button with icon and hover effect
    var btnVariables = grpButtons.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/variablesIcon.png"), { style: "toolbutton" });
    btnVariables.size = [32, 32]; // Set button size
    btnVariables.imageSize = [24, 24]; // Set image size

    // Add Reset button with icon and hover effect
    var btnReset = grpButtons.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/resetIcon.png"), { style: "toolbutton" });
    btnReset.size = [32, 32]; // Set button size
    btnReset.imageSize = [24, 24]; // Set image size

    // Function to reset Rename button icon
    function resetRenameButtonIcon() {
        btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIcon.png");
        btnRename.imageSize = [24, 24];
    }

    // Event handlers for Rename button hover effect
    btnRename.addEventListener("mouseover", function() {
        btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIconHover.png");
        btnRename.imageSize = [24, 24];
    });
    btnRename.addEventListener("mouseout", function() {
        btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIcon.png");
        btnRename.imageSize = [24, 24];
    });

    // Event handlers for Help button hover effect
    btnHelp.addEventListener("mouseover", function() {
        btnHelp.image = File(scriptFolderPath + "/NitroNamer/img/helpIconHover.png");
        btnHelp.imageSize = [24, 24];
    });
    btnHelp.addEventListener("mouseout", function() {
        btnHelp.image = File(scriptFolderPath + "/NitroNamer/img/helpIcon.png");
        btnHelp.imageSize = [24, 24];
    });

    // Event handlers for Reset button hover effect
    btnReset.addEventListener("mouseover", function() {
        btnReset.image = File(scriptFolderPath + "/NitroNamer/img/resetIconHover.png");
        btnReset.imageSize = [24, 24];
    });
    btnReset.addEventListener("mouseout", function() {
        btnReset.image = File(scriptFolderPath + "/NitroNamer/img/resetIcon.png");
        btnReset.imageSize = [24, 24];
    });

    // Event handlers for Variables button hover effect
    btnVariables.addEventListener("mouseover", function() {
        btnVariables.image = File(scriptFolderPath + "/NitroNamer/img/variablesIconHover.png");
        btnVariables.imageSize = [24, 24];
    });
    btnVariables.addEventListener("mouseout", function() {
        btnVariables.image = File(scriptFolderPath + "/NitroNamer/img/variablesIcon.png");
        btnVariables.imageSize = [24, 24];
    });

    // Show variables when Variables button is clicked
    btnVariables.onClick = function() {
        showVariables();
    };

    // Save settings when Save button is clicked
    btnSave.onClick = function() {
        var settings = {
            allLayers: rdoAllLayers.value,
            template: txtTemplate.text,
            briefly: chkBriefly.value,
            brieflyType: ddBrieflyType.selection.index
        };

        // Check for empty template
        if (!settings.template.trim()) {
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
        var presetKeys = Object.keys(updatedSettings.userPresets);
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

    // Rename layers when Rename button is clicked
    btnRename.onClick = function() {
        var allLayers = rdoAllLayers.value;
        var template = txtTemplate.text;
        var briefly = chkBriefly.value;
        var brieflyType = ddBrieflyType.selection.text;
        renameLayersByTemplate(allLayers, template, briefly, brieflyType);
        updateLayerCounts();
        updatePreview();  // Ensure IN and OUT fields are updated
        btnRename.image = File(scriptFolderPath + "/NitroNamer/img/doneIcon.png"); // Change button icon to "Done!" icon
        btnRename.imageSize = [24, 24]; // Ensure the "Done!" icon is also resized
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
        var settingsFile = new File(scriptFolderPath + "/settings.json");

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
            var nextPresetNumber = Object.keys(userPresets).length + 1;
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

        settingsFile.encoding = "UTF-8"; // Set encoding to UTF-8
        settingsFile.open("w");
        settingsFile.write(JSON.stringify(existingSettings, null, 4));
        settingsFile.close();

        return newPresetKey; // Return the key of the newly saved preset
    }

    // Load settings from a JSON file
    function loadSettings() {
        var scriptFile = new File($.fileName);
        var scriptFolderPath = scriptFile.path + "/NitroNamer/settings";
        var settingsFile = new File(scriptFolderPath + "/settings.json");

        var settings = {};
        if (settingsFile.exists) {
            settingsFile.open("r");
            settings = JSON.parse(settingsFile.read());
            settingsFile.close();
        }

        if (!settings.currentSettings) {
            settings.currentSettings = {};
        }

        if (settings.currentSettings.UICompact === undefined) {
            settings.currentSettings.UICompact = false;
        }

        return settings;
    }

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
                    var newName = generateNewName(layer, template, briefly, brieflyType);
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

    // Generate new name for a layer based on the template
    function generateNewName(layer, template, briefly, brieflyType) {
        var effectNames = [];
        if (layer.property("ADBE Effect Parade") && layer.property("ADBE Effect Parade").numProperties > 0) {
            for (var j = 1; j <= layer.property("ADBE Effect Parade").numProperties; j++) {
                var effect = layer.property("ADBE Effect Parade").property(j);
                effectNames.push(effect.name);
            }
        }
    
        var effectsString = effectNames.length > 0 ? effectNames.join(", ") : "ClearLayer";
        var compName = app.project.activeItem.name;
        var frameRate = getFrameRate(layer);
        var duration = getDuration(layer);
        var shortDuration = getShortDuration(layer);
        var mediumDuration = getMediumDuration(layer);
        var projectName = getProjectName();
    
        if (briefly) {
            frameRate = parseFloat(frameRate).toFixed(2); 
        }
    
        var animatedProps = getAnimatedProperties(layer);
        var animatedPropsString = animatedProps.length > 0 ? animatedProps.join(", ") : "NoAnimations";
    
        var variables = {
            "T": getLayerType(layer),
            "i": layer.index,
            "I": localIndex,
            "O": layer.name,
            "E": effectsString,
            "An": animatedPropsString,
            "F": getFrameRate(layer),
            "R": getResolution(layer),
            "D": getDuration(layer),
            "Dd": getShortDuration(layer),
            "Ddd": getMediumDuration(layer),
            "C": compName,
            "Ip": layer.inPoint.toFixed(2),
            "Op": layer.outPoint.toFixed(2),
            "S": getSourceName(layer),
            "W": getWidth(layer),
            "H": getHeight(layer),
            "Tm": getTrackMatteType(layer),
            "Ar": getAspectRatio(layer),
            "Ec": getEffectsCount(layer),
            "Pn": projectName,
            "Lpos": getLayerPosition(layer),
            "Lsc": getLayerScale(layer),
            "Lrot": getLayerRotation(layer),
            "Lops": getLayerOpacity(layer)
        };
    
        var newName = replaceVariables(template, variables);
    
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
                case "This Comp":
                    newName = toThisComp(newName);
                    break;
            }
        }
    
        return newName;
    }

    // Get the track matte type of a layer
    function getTrackMatteType(layer) {
        if (layer instanceof CameraLayer || layer instanceof LightLayer) {
            return "NoTrackMate";
        } else if (layer.isTrackMatte) {
            return "TM:Source";
        } else if (layer.trackMatteType !== undefined && layer.trackMatteType !== TrackMatteType.NO_TRACK_MATTE && (
                layer.trackMatteType === TrackMatteType.ALPHA ||
                layer.trackMatteType === TrackMatteType.ALPHA_INVERTED ||
                layer.trackMatteType === TrackMatteType.LUMA ||
                layer.trackMatteType === TrackMatteType.LUMA_INVERTED)) {
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
            return "NoTrackMate";
        }
    }

    // Convert string to camel case
    function toCamelCase(str) {
        return str.split(/(\d+|\W+)/).map(function(part, index) {
            if (index === 0) {
                return part.toLowerCase();
            }
            return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        }).join('');
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

    // Add comp name to the string
    function toThisComp(str) {
        var compName = app.project.activeItem.name;
        return "[" + compName + "] " + str;
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
    function getFrameRate(layer) {
        if (layer.nullLayer || layer.adjustmentLayer || layer instanceof LightLayer || layer instanceof CameraLayer || layer instanceof TextLayer || layer instanceof ShapeLayer || layer.hasAudio) {
            return "NoFrameRate";
        }
        if (layer.source && layer.source.mainSource instanceof SolidSource) {
            return "NoFrameRate";
        }
        if (layer.source) {
            return layer.source.frameRate.toFixed(2);
        }
        return "NoFrameRate";
    }

    // Get the resolution of a layer
    function getResolution(layer) {
        if (layer.nullLayer || layer.adjustmentLayer) {
            return "NoResolution";
        }
        if (layer.source && layer.source.width && layer.source.height) {
            return layer.source.width + "*" + layer.source.height;
        }
        return "NoResolution";
    }

    function getDuration(layer) {
        var duration;
        if (layer.source && layer.source.duration) {
            duration = layer.source.duration;
        } else if (layer.hasAudio || layer.hasVideo) {
            duration = layer.outPoint - layer.inPoint;
        } else {
            return "NoLimit";
        }
    
        var hours = Math.floor(duration / 3600);
        var minutes = Math.floor((duration % 3600) / 60);
        var seconds = Math.floor(duration % 60);
        return (hours < 10 ? "0" + hours : hours) + ":" +
               (minutes < 10 ? "0" + minutes : minutes) + ":" +
               (seconds < 10 ? "0" + seconds : seconds);
    }
    
    function getShortDuration(layer) {
        var duration;
        if (layer.source && layer.source.duration) {
            duration = layer.source.duration;
        } else if (layer.hasAudio || layer.hasVideo) {
            duration = layer.outPoint - layer.inPoint;
        } else {
            return "NoLimit";
        }
    
        var seconds = Math.floor(duration);
        return seconds + "Sec";
    }
    
    function getMediumDuration(layer) {
        var duration;
        if (layer.source && layer.source.duration) {
            duration = layer.source.duration;
        } else if (layer.hasAudio || layer.hasVideo) {
            duration = layer.outPoint - layer.inPoint;
        } else {
            return "NoLimit";
        }
    
        var minutes = Math.floor(duration / 60);
        var seconds = Math.floor(duration % 60);
        return minutes + "min." + (seconds < 10 ? "0" + seconds : seconds) + "sec";
    }

    // Get the source name of a layer
    function getSourceName(layer) {
        if (layer.source) {
            return layer.source.name;
        }
        return "NoSource";
    }

    // Get the width of a layer
    function getWidth(layer) {
        if (layer.nullLayer || layer.adjustmentLayer) {
            return "NoWidth";
        }
        if (layer.source && layer.source.width) {
            return layer.source.width.toString();
        }
        return "NoWidth";
    }

    // Get the height of a layer
    function getHeight(layer) {
        if (layer.nullLayer || layer.adjustmentLayer) {
            return "NoHeight";
        }
        if (layer.source && layer.source.height) {
            return layer.source.height.toString();
        }
        return "NoHeight";
    }

    // Get the position of a layer
    function getLayerPosition(layer) {
        if (layer.transform && layer.transform.position) {
            var pos = layer.transform.position.value;
            var roundedPos = pos.map(function(coord) {
                return Math.round(coord * 10) / 10;
            });
            return layer.threeDLayer ? roundedPos.join(", ") : roundedPos.slice(0, 2).join(", ");
        }
        return "NoPosition";
    }

    // Get the aspect ratio of a layer
    function getAspectRatio(layer) {
        if (layer.nullLayer || layer.adjustmentLayer) {
            return "NoAspectRatio";
        }
        if (layer.source && layer.source.width && layer.source.height) {
            var width = layer.source.width;
            var height = layer.source.height;
            var gcd = function(a, b) {
                return b == 0 ? a : gcd(b, a % b);
            };
            var divisor = gcd(width, height);
            return (width / divisor) + ":" + (height / divisor);
        }
        return "NoAspectRatio";
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
        return projectName;
    }

    // Get the animated properties of a layer
    function getAnimatedProperties(layer) {
        var animatedProps = [];

        function checkPropertyGroup(propertyGroup) {
            for (var i = 1; i <= propertyGroup.numProperties; i++) {
                var prop = propertyGroup.property(i);

                if (prop.numKeys > 0) {
                    animatedProps.push(prop.name);
                }

                if (prop instanceof PropertyGroup || prop instanceof MaskPropertyGroup) {
                    checkPropertyGroup(prop);
                }
            }
        }

        checkPropertyGroup(layer);
        return animatedProps;
    }

    // Get the scale of a layer
    function getLayerScale(layer) {
        if (layer.transform && layer.transform.scale) {
            var scale = layer.transform.scale.value;
            var roundedScale = scale.map(function(coord) {
                return Math.round(coord * 10) / 10;
            });
            return layer.threeDLayer ? roundedScale.join(", ") : roundedScale.slice(0, 2).join(", ");
        }
        return "NoScale";
    }

    // Get the rotation of a layer
    function getLayerRotation(layer) {
        if (layer.threeDLayer) {
            // For 3D layers, concatenate the X, Y, and Z rotations
            var rotationX = layer.transform.xRotation ? layer.transform.xRotation.value : 0;
            var rotationY = layer.transform.yRotation ? layer.transform.yRotation.value : 0;
            var rotationZ = layer.transform.zRotation ? layer.transform.zRotation.value : 0;
            return [rotationX, rotationY, rotationZ].map(function(value) {
                return Math.round(value * 10) / 10;
            }).join(", ");
        } else {
            // For 2D layers, use the regular rotation property
            if (layer.transform && layer.transform.rotation) {
                var rotation = layer.transform.rotation.value;
                return Math.round(rotation * 10) / 10;
            }
            return "NoRotation";
        }
    }

    // Get the opacity of a layer
    function getLayerOpacity(layer) {
        if (layer.transform && layer.transform.opacity) {
            var opacity = layer.transform.opacity.value;
            return Math.round(opacity * 10) / 10;
        }
        return "NoOpacity";
    }

    // Replace variables in the template with actual values
    function replaceVariables(template, variables) {
        return template.replace(/\(([^()]+)\)|E\(([^)]+)\)|Ec|E\{([^}]+)\}|An\(([^)]+)\)|An\{([^}]+)\}|E|An|Ip|Op|Dd{0,2}|Tm|Ar|Pn|Lpos|Lsc|Lrot|Lops|[A-Z]|i|I|S|W|H/g, function(match, group, customEffectDelimiterParentheses, customEffectDelimiterBraces, customAnimDelimiterParentheses, customAnimDelimiterBraces) {
            if (group) {
                return group;  // Handle text inside parentheses
            } else if (customEffectDelimiterParentheses !== undefined) {
                var effectsString = variables['E'].split(', ').join(customEffectDelimiterParentheses);
                return effectsString;
            } else if (customEffectDelimiterBraces !== undefined) {
                var effectsString = variables['E'].split(', ').join(customEffectDelimiterBraces);
                return effectsString;
            } else if (customAnimDelimiterParentheses !== undefined) {
                var animatedPropsString = variables['An'].split(', ').join(customAnimDelimiterParentheses);
                return animatedPropsString;
            } else if (customAnimDelimiterBraces !== undefined) {
                var animatedPropsString = variables['An'].split(', ').join(customAnimDelimiterBraces);
                return animatedPropsString;
            } else if (match === 'E') {
                return variables['E'];
            } else if (match === 'An') {
                return variables['An'];
            } else if (match === 'Ip') {
                return variables['Ip'];
            } else if (match === 'Op') {
                return variables['Op'];
            } else if (match === 'Dd') {
                return variables['Dd'];
            } else if (match === 'Ddd') {
                return variables['Ddd'];
            } else if (match === 'Tm') {
                return variables['Tm'];
            } else if (match === 'Ar') {
                return variables['Ar'];
            } else if (match === 'Pn') {
                return variables['Pn'];
            } else if (match === 'Lpos') {
                return variables['Lpos'];
            } else if (match === 'Lsc') {
                return variables['Lsc'];
            } else if (match === 'Lrot') {
                return variables['Lrot'];
            } else if (match === 'Lops') {
                return variables['Lops'];
            } else if (match === 'Ec') {
                return variables['Ec'];
            } else {
                return variables[match] !== undefined ? variables[match] : match;
            }
        });
    }

    var localIndex = 1; // Global local index

    // Rename layers based on the template
    function renameLayersByTemplate(allLayers, template, briefly, brieflyType) {
        var proj = app.project;
    
        if (proj) {
            var comp = proj.activeItem;
    
            if (comp && comp instanceof CompItem) {
                app.beginUndoGroup("Rename Layers by Template");
    
                // Reset local index before renaming
                localIndex = 1;
    
                for (var i = 1; i <= comp.numLayers; i++) {
                    var layer = comp.layer(i);
    
                    if (allLayers || layer.selected) {
                        var effectNames = [];
                        if (layer.property("ADBE Effect Parade") && layer.property("ADBE Effect Parade").numProperties > 0) {
                            for (var j = 1; j <= layer.property("ADBE Effect Parade").numProperties; j++) {
                                var effect = layer.property("ADBE Effect Parade").property(j);
                                effectNames.push(effect.name);
                            }
                        }
    
                        var effectsString = effectNames.length > 0 ? effectNames.join(", ") : "ClearLayer";
                        var compName = app.project.activeItem.name;
                        var projectName = getProjectName();
    
                        var animatedProps = getAnimatedProperties(layer);
                        var animatedPropsString = animatedProps.length > 0 ? animatedProps.join(", ") : "NoAnimations";
    
                        var variables = {
                            "T": getLayerType(layer),
                            "i": i,
                            "I": localIndex,  // Using local index
                            "O": layer.name,
                            "E": effectsString,
                            "An": animatedPropsString,
                            "F": getFrameRate(layer),
                            "R": getResolution(layer),
                            "D": getDuration(layer),
                            "Dd": getShortDuration(layer),
                            "Ddd": getMediumDuration(layer),
                            "C": compName,
                            "Ip": layer.inPoint.toFixed(2),  // In point
                            "Op": layer.outPoint.toFixed(2), // Out point
                            "S": getSourceName(layer),
                            "W": getWidth(layer),
                            "H": getHeight(layer),
                            "Tm": getTrackMatteType(layer),
                            "Ar": getAspectRatio(layer),
                            "Ec": getEffectsCount(layer),
                            "Pn": projectName, 
                            "Lpos": getLayerPosition(layer),
                            "Lsc": getLayerScale(layer),
                            "Lrot": getLayerRotation(layer),
                            "Lops": getLayerOpacity(layer)
                        };
    
                        var newName = replaceVariables(template, variables);
    
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
                                case "This Comp":
                                    newName = toThisComp(newName);
                                    break;
                            }
                        }
    
                        layer.name = newName;
    
                        // Increment local index after renaming the layer
                        localIndex++;
                    }
                }
    
                app.endUndoGroup();
            } else {
                alert("Please select a composition or layer.", "NitroNamer");
            }
        } else {
            alert("Project not found.");
        }
    }

    // Show help window
    function showHelp() {
        var helpWin = new Window("dialog", "NitroNamer - Help panel", undefined, {resizeable: true});
        helpWin.orientation = "column";
        helpWin.alignChildren = ["fill", "top"];
        helpWin.add("statictext", undefined, "Available variables:");
        helpWin.add("statictext", undefined, "C - Current composition name");
        helpWin.add("statictext", undefined, "D - Duration (HH:MM:SS)");
        helpWin.add("statictext", undefined, "Dd - By seconds duration (0Sec)");
        helpWin.add("statictext", undefined, "Ddd - By minute duration (0Min.0Sec)");
        helpWin.add("statictext", undefined, "E or E{#} - Name of effects. If you specify the variable E with curly braces, you can specify the character through which the effects will be listed.");
        helpWin.add("statictext", undefined, "F - Frame Rate");
        helpWin.add("statictext", undefined, "H - Height of the layer");
        helpWin.add("statictext", undefined, "I - Local index of selected layers (for selected mode, works the same as 'i' for total mode)");
        helpWin.add("statictext", undefined, "i - Layer index");
        helpWin.add("statictext", undefined, "Ip - In point of the layer");
        helpWin.add("statictext", undefined, "M - Source name (file or pre-comp)");
        helpWin.add("statictext", undefined, "O - Original name of the layer");
        helpWin.add("statictext", undefined, "Op - Out point of the layer");
        helpWin.add("statictext", undefined, "R - Resolution (Width*Height)");
        helpWin.add("statictext", undefined, "T - Layer type (Pre-comp, Footage, Shape, Solid, Null, Adjustment, Audio, Text, Light, Camera)");
        helpWin.add("statictext", undefined, "W - Width of the layer");
        helpWin.add("statictext", undefined, "(Any text) - You can write any text in parentheses, it will not be counted as variables");

        var btnClose = helpWin.add("button", undefined, "Close");
        btnClose.onClick = function() {
            helpWin.close();
        };

        // Add the new button to open the URL
        var btnNitrofix = helpWin.add("button", undefined, "NitroNamer 2024.2 | Say thanks or buy a coffee for NITROFIX");
        btnNitrofix.onClick = function() {
            var url = "https://boosty.to/nitrofix";
            if ($.os.indexOf("Windows") !== -1) {
                system.callSystem("cmd.exe /c start " + url);
            } else {
                system.callSystem("open " + url);
            }
        };

        helpWin.center();
        helpWin.show();
    }

    // Show current layer variables
    function showVariables() {
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
                    var projectName = getProjectName(); // Use the new function

                    var variables = {
                        "T": getLayerType(layer),
                        "i": layer.index,
                        "I": localIndex,
                        "O": layer.name,
                        "E": getEffectNames(layer),
                        "F": getFrameRate(layer),
                        "R": getResolution(layer),
                        "D": getDuration(layer),
                        "Dd": getShortDuration(layer),
                        "Ddd": getMediumDuration(layer),
                        "C": comp.name,
                        "Ip": layer.inPoint.toFixed(2),
                        "Op": layer.outPoint.toFixed(2),
                        "S": getSourceName(layer),
                        "W": getWidth(layer),
                        "H": getHeight(layer),
                        "Tm": getTrackMatteType(layer),
                        "Ec": getEffectsCount(layer),
                        "Pn": projectName,
                        "Lpos": getLayerPosition(layer),
                        "Lsc": getLayerScale(layer),
                        "Lrot": getLayerRotation(layer),
                        "Lops": getLayerOpacity(layer)
                    };

                    var variablesWin = new Window("dialog", "Current Layer Variables", undefined, {resizeable: true});
                    variablesWin.orientation = "column";
                    variablesWin.alignChildren = ["fill", "top"];
                    
                    for (var key in variables) {
                        if (variables.hasOwnProperty(key)) {
                            variablesWin.add("statictext", undefined, key + ": " + variables[key]);
                        }
                    }

                    var btnClose = variablesWin.add("button", undefined, "Close");
                    btnClose.onClick = function() {
                        variablesWin.close();
                    };

                    variablesWin.center();
                    variablesWin.show();
                } else {
                    alert("No composition selected.", "NitroNamer");
                }
            } else {
                alert("No composition selected.", "NitroNamer");
            }
        } else {
            alert("No project open.");
        }
    }

    // Get the effect names applied to a layer
    function getEffectNames(layer) {
        var effectNames = [];
        if (layer.property("ADBE Effect Parade") && layer.property("ADBE Effect Parade").numProperties > 0) {
            for (var j = 1; j <= layer.property("ADBE Effect Parade").numProperties; j++) {
                var effect = layer.property("ADBE Effect Parade").property(j);
                effectNames.push(effect.name);
            }
        }
        return effectNames.length > 0 ? effectNames.join(", ") : "No effects";
    }

    var settings = loadSettings();
    applySettings(settings);

    updateLayerCounts();
    updatePreview();

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