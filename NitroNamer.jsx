function buildUI(thisObj) {

    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "NitroNamer 2024.4 - dev", undefined, {resizeable: true});
    var globalWidthSizeElements = 310; 
    var globalWidthSizeElementsCorrect = 14;
    var globalHeightSizeElementsMax = 376;
    var globalHeightSizeElementsMin = 146;
    var globalSpacingElements = 4;
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.active = true;
    win.margins = [4,4,4,4];
    win.layout.layout(true);

    var scriptMessageHead_1 = "NitroNamer 2024.4 - dev";

    var grpLayerSelection = win.add("group", undefined);
    grpLayerSelection.orientation = "row"; 
    grpLayerSelection.maximumSize.width = globalWidthSizeElements;
    grpLayerSelection.alignChildren = ["fill", "left"];
    grpLayerSelection.spacing = 0;

    var rdoAllLayers = grpLayerSelection.add("radiobutton", undefined, "Total: ");
    rdoAllLayers.value = true; 
    rdoAllLayers.alignment = ["left", "center"];
    var txtAllLayersCount = grpLayerSelection.add("statictext", undefined, "");
    txtAllLayersCount.alignment = ["left", "center"];
    txtAllLayersCount.minimumSize = [20, txtAllLayersCount.minimumSize.height];
    txtAllLayersCount.maximumSize = [50, txtAllLayersCount.maximumSize.height];

    var rdoOnlySelected = grpLayerSelection.add("radiobutton", undefined, "Selected: ");
    rdoOnlySelected.alignment = ["left", "center"];
    var txtSelectedLayersCount = grpLayerSelection.add("statictext", undefined, "");
    txtSelectedLayersCount.alignment = ["left", "center"];
    txtSelectedLayersCount.minimumSize = [20, txtSelectedLayersCount.minimumSize.height];
    txtSelectedLayersCount.maximumSize = [50, txtSelectedLayersCount.maximumSize.height];

    var scriptFile = new File($.fileName);
    var scriptFolderPath = scriptFile.path;

    var btnCopy = grpLayerSelection.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/copy.png"), {style: "toolbutton"}, 0);
    btnCopy.size = [24, 24];
    btnCopy.imageSize = [24, 24];
    btnCopy.alignment = ["right", "center"];

    var btnFavorites = grpLayerSelection.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/favorites.png"), {style: "toolbutton"});
    btnFavorites.size = [24, 24];
    btnFavorites.imageSize = [24, 24];
    btnFavorites.alignment = ["right", "center"];

    var btnSave = grpLayerSelection.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/save.png"), {style: "toolbutton"});
    btnSave.size = [24, 24];
    btnSave.imageSize = [24, 24];
    btnSave.alignment = ["right", "center"];

    var btnCircleMinus = grpLayerSelection.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/delete.png"), {style: "toolbutton"});
    btnCircleMinus.size = [24, 24];
    btnCircleMinus.imageSize = [24, 24];
    btnCircleMinus.alignment = ["right", "center"];

    var btnMinimize = grpLayerSelection.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/minimize.png"), {style: "toolbutton"});
    btnMinimize.size = [24, 24];
    btnMinimize.imageSize = [24, 24];
    btnMinimize.alignment = ["right", "center"];

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

    var settings = loadSettings();
    var userPresets = settings.userPresets || {};
    var presetTemplates = [];

    for (var key in userPresets) {
        if (userPresets.hasOwnProperty(key)) {
            presetTemplates.push(userPresets[key].template);
        }
    }

    var modes = ["chart", "date", "longArrowDown", "longArrowUp", "favorites", "search"];
    var currentModeIndex = 0; 
    var isActive = false;
    var isMouseOverButton = false;

    var grpDropdownAndButtons = win.add("group", undefined);
    grpDropdownAndButtons.orientation = "row";
    grpDropdownAndButtons.alignment = ["fill", "top"];
    grpDropdownAndButtons.margins = [0, -10, 0, 0];
    grpDropdownAndButtons.spacing = globalSpacingElements;

    var btnModeSwitch = grpDropdownAndButtons.add(
        "iconbutton",
        undefined,
        File(scriptFolderPath + "/NitroNamer/img/" + modes[0] + ".png"), 
        { style: "toolbutton" }
    );
    btnModeSwitch.size = [24, 24];
    btnModeSwitch.imageSize = [24, 24];
    btnModeSwitch.alignment = ["left", "center"];

    function updateModeSwitchTooltip() {
        var currentMode = modes[currentModeIndex];
        var tooltip = getTooltip("btnModeSwitch", currentMode);
        btnModeSwitch.helpTip = tooltip;
    }

    updateModeSwitchTooltip();

    var ddLayerMode = grpDropdownAndButtons.add("dropdownlist", undefined, presetTemplates);
    ddLayerMode.maximumSize.width = globalWidthSizeElements - 42;
    ddLayerMode.selection = 0;

    ddLayerMode.onChange = function() {
        var selectedPreset = ddLayerMode.selection;
        if (selectedPreset) {
            var presetTemplate = selectedPreset.text;
            var settings = loadSettings();
            var userPresets = settings.userPresets || {};

            for (var key in userPresets) {
                if (userPresets.hasOwnProperty(key) && userPresets[key].template === presetTemplate) {
                    var preset = userPresets[key];

                    if (preset.hasOwnProperty('usageFrequency')) {
                        preset.usageFrequency += 1;
                    } else {
                        preset.usageFrequency = 1;
                    }

                    userPresets[key] = preset;
                    settings.userPresets = userPresets;
                    var settingsFile = scriptFolderPath + "/NitroNamer/settings/settings.json";
                    writeJSONFile(settingsFile, settings);

                    rdoAllLayers.value = preset.allLayers;
                    rdoOnlySelected.value = !preset.allLayers;
                    txtTemplate.text = preset.template;
                    chkBriefly.value = preset.briefly;
                    ddBrieflyType.selection = preset.brieflyType || 0;

                    updateLayerCounts();
                    updatePreview();
                    resetRenameButtonIcon();
                    updateRenameButtonIcon();

                    var currentSettings = {
                        allLayers: rdoAllLayers.value,
                        template: txtTemplate.text,
                        briefly: chkBriefly.value,
                        brieflyType: ddBrieflyType.selection.index,
                        selectedPresetTemplate: preset.template
                    };
                    saveSettings(currentSettings, true);

                    updateFavoritesButtonIcon(preset.favoritesTemplate);

                    updatePresetsDropdown(settings);

                    break;
                }
            }
        }
    };    

    btnModeSwitch.onClick = function() {
        var isAltPressed = ScriptUI.environment.keyboardState.altKey;
        var isCtrlPressed = ScriptUI.environment.keyboardState.ctrlKey;
    
        if (isAltPressed) {
            isActive = !isActive;
        } else if (isCtrlPressed) {
            currentModeIndex = (currentModeIndex - 1 + modes.length) % modes.length;
            if (isActive) {
                isActive = false;
            }
        } else {
            currentModeIndex = (currentModeIndex + 1) % modes.length;
            if (isActive) {
                isActive = false;
            }
        }
        updateModeButtonIcon();
        updateModeSwitchTooltip();
        saveCurrentSettings();
    
        updatePresetsDropdown(loadSettings());
    };    

    btnModeSwitch.addEventListener("mouseover", function() {
        isMouseOverButton = true;
        updateModeButtonIcon();
        updateModeSwitchTooltip();
    });

    btnModeSwitch.addEventListener("mouseout", function() {
        isMouseOverButton = false;
        updateModeButtonIcon();
        updateModeSwitchTooltip();
    });

    function updateModeButtonIcon() {
        var mode = modes[currentModeIndex];
        var iconFilename;
        if (isActive) {
            iconFilename = mode + "Hover.png";
        } else if (isMouseOverButton) {
            iconFilename = mode + "ModeHover.png";
        } else {
            iconFilename = mode + ".png";
        }
        btnModeSwitch.image = File(scriptFolderPath + "/NitroNamer/img/" + iconFilename);
        btnModeSwitch.imageSize = [24, 24];
    }    

    function saveCurrentSettings() {
        var currentSettings = {
            allLayers: rdoAllLayers.value,
            template: txtTemplate.text,
            briefly: chkBriefly.value,
            brieflyType: ddBrieflyType.selection.index,
            modeIndex: currentModeIndex,
            modeActive: isActive,
            selectedPresetTemplate: ddLayerMode.selection && ddLayerMode.selection.preset ? ddLayerMode.selection.preset.template : ""
        };
        saveSettings(currentSettings, true);
    }    

    function handleRadioButtonClick() {
        if (this === rdoAllLayers) {
            rdoAllLayers.value = true;
            rdoOnlySelected.value = false;
        } else if (this === rdoOnlySelected) {
            rdoAllLayers.value = false;
            rdoOnlySelected.value = true;
        }
        updateLayerCounts();
        updatePreview();
        resetRenameButtonIcon();
        saveCurrentSettings();
    }

    rdoAllLayers.onClick = handleRadioButtonClick;
    rdoOnlySelected.onClick = handleRadioButtonClick;

    function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

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

    var grpTemplate = win.add("group", undefined);
    grpTemplate.orientation = "column";
    grpTemplate.margins = [0,-10,0,0];
    grpTemplate.spacing = globalSpacingElements;
    var txtTemplate = grpTemplate.add("edittext", undefined, "(LayerName).i", {multiline: false, scrolling: false});
    txtTemplate.alignment = ["fill", "top"];
    txtTemplate.margins = [0,-10,0,0];
    txtTemplate.maximumSize.width = globalWidthSizeElements;

    txtTemplate.addEventListener("click", function() {
        checkAndUpdateSettings(); 
    });

    txtTemplate.onChanging = function() {
        checkAndUpdateSettings(); 
        updatePreview();
        updateLayerCounts();
        updateRenameButtonIcon(); 
    
        // Если активен режим "search", обновляем выпадающий список
        if (isActive && modes[currentModeIndex] === "search") {
            updatePresetsDropdown(loadSettings());
        }
    };

    txtTemplate.onChange = function() {
        checkAndUpdateSettings(); 
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
    
        // Если активен режим "search", обновляем выпадающий список
        if (isActive && modes[currentModeIndex] === "search") {
            updatePresetsDropdown(loadSettings());
        }
    };

    txtTemplate.addEventListener("keydown", function(event) {
        checkAndUpdateSettings(); 
        if (event.keyName === "Enter") {
            var selectedPreset = ddLayerMode.selection;
            if (selectedPreset) {
                var presetTemplate = selectedPreset.text;
                var settings = loadSettings();
                var userPresets = settings.userPresets || {};

                for (var key in userPresets) {
                    if (userPresets.hasOwnProperty(key) && userPresets[key].template === presetTemplate) {
                        var preset = userPresets[key];

                        if (preset.hasOwnProperty('usageFrequency')) {
                            preset.usageFrequency += 1;
                        } else {
                            preset.usageFrequency = 1;
                        }

                        userPresets[key] = preset;

                        settings.userPresets = userPresets;
                        var scriptFile = new File($.fileName);
                        var scriptFolderPath = scriptFile.path + "/NitroNamer/settings";
                        var settingsFile = scriptFolderPath + "/settings.json";

                        writeJSONFile(settingsFile, settings);

                        rdoAllLayers.value = preset.allLayers;
                        rdoOnlySelected.value = !preset.allLayers;
                        txtTemplate.text = preset.template;
                        chkBriefly.value = preset.briefly;
                        ddBrieflyType.selection = preset.brieflyType || 0;

                        updateLayerCounts();
                        updatePreview();
                        resetRenameButtonIcon();
                        updateRenameButtonIcon(); 

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

    win.onShow = function() {
        ddLayerMode.size = [txtTemplate.size[0], ddLayerMode.size[1]];
    };

    var grpTextFields = win.add("group", undefined);
    grpTextFields.orientation = "column";
    grpTextFields.alignChildren = ["left", "top"];
    grpTextFields.alignment = ["left", "center"];
    grpTextFields.maximumSize.width = globalWidthSizeElements - globalWidthSizeElementsCorrect;
    grpTextFields.spacing = globalSpacingElements;
    grpTextFields.margins = [0, -10, 0, 0];

    var txtOriginalLabel = grpTextFields.add("statictext", undefined, "The original name of the layer: ");
    txtOriginalLabel.maximumSize.height = 14;
    txtOriginalLabel.margins = [0, -10, 0, 0];
    var txtOriginal = grpTextFields.add("edittext", undefined, "", {readonly: true});
    txtOriginal.alignment = ["left", "top"];
    txtOriginal.margins = [0, -10, 0, 0];

    var txtRenamedLabel = grpTextFields.add("statictext", undefined, "Template result for layer(s): ");
    txtRenamedLabel.maximumSize.height = 14;
    txtRenamedLabel.margins = [0, -10, 0, 0];
    var txtRenamed = grpTextFields.add("edittext", undefined, "", {readonly: true});
    txtRenamed.alignment = ["left", "top"];
    txtRenamed.margins = [0, -10, 0, 0];

    var txtRenamedCompact;

    var grpBriefly = win.add("group", undefined);
    grpBriefly.orientation = "row";
    grpBriefly.alignChildren = [ "right", "center"];
    grpBriefly.spacing = grpTextFields;
    grpBriefly.margins = [0, 0, 0, 0];

    var btnRename = grpBriefly.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/renameIcon.png"), { style: "toolbutton" });
    var warningIcon = File(scriptFolderPath + "/NitroNamer/img/warning.png");
    var warningIconHover = File(scriptFolderPath + "/NitroNamer/img/warningHover.png");
    btnRename.size = [24, 24]; 
    btnRename.imageSize = [24, 24]; 
    btnRename.alignment = ["left", "center"];

    var btnVariables = grpBriefly.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/variablesIcon.png"), { style: "toolbutton" });
    btnVariables.size = [24, 24]; 
    btnVariables.imageSize = [24, 24]; 
    btnVariables.alignment = ["left", "center"];

    var btnHelp = grpBriefly.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/helpIcon.png"), { style: "toolbutton" });
    btnHelp.size = [24, 24]; 
    btnHelp.imageSize = [24, 24]; 
    btnHelp.alignment = ["left", "center"];

    var btnReset = grpBriefly.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/resetIcon.png"), { style: "toolbutton" });
    btnReset.size = [24, 24]; 
    btnReset.imageSize = [24, 24]; 
    btnReset.alignment = ["left", "center"];

    var btnSettings = grpBriefly.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/settings.png"), {style: "toolbutton"});
    btnSettings.size = [24, 24]; 
    btnSettings.imageSize = [24, 24]; 
    btnSettings.alignment = ["left", "center"];

    var chkBriefly = grpBriefly.add("checkbox", undefined);
    var ddBrieflyType = grpBriefly.add("dropdownlist", undefined, ["Camel Case", "Pascal Case", "Snake Case", "Kebab Case", "Screaming Snake Case"]);
    ddBrieflyType.maximumSize.width = 150;
    ddBrieflyType.selection = 0;

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
    addHoverEffect(btnFavorites, scriptFolderPath + "/NitroNamer/img/favorites");
    addHoverEffect(btnSave, scriptFolderPath + "/NitroNamer/img/save");
    addHoverEffect(btnCircleMinus, scriptFolderPath + "/NitroNamer/img/delete");
    addHoverEffect(btnMinimize, scriptFolderPath + "/NitroNamer/img/minimize");
    addHoverEffect(btnHelp, scriptFolderPath + "/NitroNamer/img/helpIcon");
    addHoverEffect(btnVariables, scriptFolderPath + "/NitroNamer/img/variablesIcon");
    addHoverEffect(btnReset, scriptFolderPath + "/NitroNamer/img/resetIcon");
    addHoverEffect(btnSettings, scriptFolderPath + "/NitroNamer/img/settings");

    btnRename.addEventListener("mouseover", function() {
        checkAndUpdateSettings();
        updatePreview();
        updateLayerCounts();

        var isCtrlPressed = ScriptUI.environment.keyboardState.ctrlKey;
        var isShiftPressed = ScriptUI.environment.keyboardState.shiftKey;
        var isAltPressed = ScriptUI.environment.keyboardState.altKey; 

        if (trim(txtTemplate.text) === "") {
            btnRename.image = warningIconHover;
        } else if (isAltPressed) { 
            btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIconHoverReverse.png");
        } else if (isCtrlPressed) {
            btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIconHoverAfter.png");
        } else if (isShiftPressed) {
            btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIconHoverBefore.png");
        } else {
            btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIconHover.png");
        }
        btnRename.imageSize = [24, 24];
    });

    btnRename.addEventListener("mouseout", function() {
        updateRenameButtonIcon(); 
    });

    btnVariables.onClick = function() {
        var scriptFilePath = File(scriptFolderPath + "/NitroNamer/scripts/NNLayerInfo.jsx");
        if (scriptFilePath.exists) {
            $.evalFile(scriptFilePath);
        } else {
            alert("Script file not found: " + scriptFilePath.fsName, scriptMessageHead_1);
        }
    };

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
                alert("No layers in the composition.", scriptMessageHead_1);
            }
        } else {
            alert("Please select a valid composition.", scriptMessageHead_1);
        }
    };

    btnFavorites.onClick = function() {
        var selectedPreset = ddLayerMode.selection;
        if (selectedPreset) {
            var presetTemplate = selectedPreset.text;
            var settings = loadSettings();
            var userPresets = settings.userPresets || {};

            for (var key in userPresets) {
                if (userPresets.hasOwnProperty(key) && userPresets[key].template === presetTemplate) {
                    var preset = userPresets[key];

                    preset.favoritesTemplate = !preset.favoritesTemplate;

                    userPresets[key] = preset;

                    settings.userPresets = userPresets;
                    var scriptFile = new File($.fileName);
                    var scriptFolderPath = scriptFile.path + "/NitroNamer/settings";
                    var settingsFile = scriptFolderPath + "/settings.json";

                    writeJSONFile(settingsFile, settings);

                    updateFavoritesButtonIcon(preset.favoritesTemplate);

                    break;
                }
            }
        }
    };    

    btnFavorites.addEventListener("mouseover", function() {
        var isFavorite = btnFavorites.isFavorite;

        if (isFavorite) {
            btnFavorites.image = File(scriptFolderPath + "/NitroNamer/img/favoritesHover.png");
        } else {
            btnFavorites.image = File(scriptFolderPath + "/NitroNamer/img/favoritesHover.png");
        }
        btnFavorites.imageSize = [24, 24];
    });

    btnFavorites.addEventListener("mouseout", function() {
        var isFavorite = btnFavorites.isFavorite;
        updateFavoritesButtonIcon(isFavorite);
    });

    function updateFavoritesButtonIcon(isFavorite) {
        btnFavorites.isFavorite = isFavorite; 

        if (isFavorite) {
            btnFavorites.image = File(scriptFolderPath + "/NitroNamer/img/favoritesHover.png");
        } else {
            btnFavorites.image = File(scriptFolderPath + "/NitroNamer/img/favorites.png");
        }
        btnFavorites.imageSize = [24, 24];
    }    

    btnSave.onClick = function() {
        var settings = {
            allLayers: rdoAllLayers.value,
            template: txtTemplate.text,
            briefly: chkBriefly.value,
            brieflyType: ddBrieflyType.selection.index
        };

        if (!trim(settings.template)) {
            alert("Template cannot be empty.", scriptMessageHead_1);
            return;
        }

        var existingSettings = loadSettings();
        var userPresets = existingSettings.userPresets || {};

        if (ScriptUI.environment.keyboardState.shiftKey) {
            var selectedPreset = ddLayerMode.selection;
            if (selectedPreset && selectedPreset.text !== "Save your new preset" && selectedPreset.text !== "Please select a preset to delete") {
                var presetTemplate = selectedPreset.text;

                for (var key in userPresets) {
                    if (userPresets.hasOwnProperty(key) && userPresets[key].template === presetTemplate) {
                        userPresets[key] = settings;
                        writeJSONFile(new File(scriptFolderPath + "/NitroNamer/settings/settings.json"), existingSettings);
                        btnSave.image = File(scriptFolderPath + "/NitroNamer/img/refreshHover.png");
                        updatePresetsDropdown(existingSettings);
                        break;
                    }
                }
            }
        } else {

            for (var key in userPresets) {
                if (userPresets.hasOwnProperty(key) && userPresets[key].template === settings.template) {
                    alert("A preset with this template already exists.", scriptMessageHead_1);
                    return;
                }
            }

            var newPresetKey = saveSettings(settings, false);

            var updatedSettings = loadSettings();
            updatePresetsDropdown(updatedSettings);

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

            txtTemplate.text = settings.template;

            if (newPresetKey && updatedSettings.userPresets[newPresetKey]) {
                var newPreset = updatedSettings.userPresets[newPresetKey];
                updateFavoritesButtonIcon(newPreset.favoritesTemplate);
            }
        }
    };

    btnSave.addEventListener("mouseover", function() {
        if (ScriptUI.environment.keyboardState.shiftKey) {
            btnSave.image = File(scriptFolderPath + "/NitroNamer/img/refreshHover.png");
        } else {
            btnSave.image = File(scriptFolderPath + "/NitroNamer/img/saveHover.png");
        }
    });

    btnSave.addEventListener("mouseout", function() {
        btnSave.image = File(scriptFolderPath + "/NitroNamer/img/save.png");
    });

    btnCircleMinus.onClick = function() {
        var selectedItem = ddLayerMode.selection;
        var selectedPreset = ddLayerMode.selection;
        if (selectedItem && selectedPreset && selectedPreset.text !== "Save your new preset" && selectedPreset.text !== "Please select a preset to delete") {
            var presetTemplate = selectedItem.preset.template;

            var currentTemplateText = txtTemplate.text;

            var settings = loadSettings();
            var userPresets = settings.userPresets || {};

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

            settings.userPresets = newUserPresets;

            var scriptFile = new File($.fileName);
            var scriptFolderPath = scriptFile.path + "/NitroNamer/settings";
            var settingsFile = new File(scriptFolderPath + "/settings.json");

            settingsFile.encoding = "UTF-8"; 
            settingsFile.open("w");
            settingsFile.write(JSON.stringify(settings, null, 4));
            settingsFile.close();

            updatePresetsDropdown(settings);

            txtTemplate.text = currentTemplateText;

            var currentSettings = {
                allLayers: rdoAllLayers.value,
                template: txtTemplate.text,
                briefly: chkBriefly.value,
                brieflyType: ddBrieflyType.selection.index
            };
            saveSettings(currentSettings, true);

            var selectedPreset = ddLayerMode.selection;
            if (selectedPreset) {
                var presetTemplate = selectedPreset.text;
                var settings = loadSettings();
                var userPresets = settings.userPresets || {};

                var isFavorite = false; 
                for (var key in userPresets) {
                    if (userPresets.hasOwnProperty(key) && userPresets[key].template === presetTemplate) {
                        var preset = userPresets[key];
                        isFavorite = preset.favoritesTemplate || false;
                        break;
                    }
                }
                updateFavoritesButtonIcon(isFavorite);
            } else {

                updateFavoritesButtonIcon(false);
            }
        } else {
            updatePresetsDropdown(loadSettings());
        }
    };

    btnMinimize.onClick = function() {
        var settings = loadSettings();
        var currentSettings = settings.currentSettings || {};
        var isCompact = !currentSettings.UICompact; 

        currentSettings.UICompact = isCompact;
        settings.currentSettings = currentSettings;

        saveSettings(currentSettings, true);

        setMinimizeButtonIcon(isCompact);
    };

    btnRename.onClick = function() {
        if (!btnRename.enabled) return; 

        var allLayers = rdoAllLayers.value;
        var template = txtTemplate.text;
        var briefly = chkBriefly.value;
        var brieflyType = ddBrieflyType.selection.text;

        var isAltPressed = ScriptUI.environment.keyboardState.altKey;
        var isCtrlPressed = ScriptUI.environment.keyboardState.ctrlKey;
        var isShiftPressed = ScriptUI.environment.keyboardState.shiftKey;
        var isCtrlShiftPressed = isCtrlPressed && isShiftPressed;

        var includeShyLayers = isCtrlShiftPressed;
        var reverseOrder = isAltPressed;

        renameLayersByTemplate(allLayers, template, briefly, brieflyType, includeShyLayers, reverseOrder, isCtrlPressed, isShiftPressed, isAltPressed, isCtrlShiftPressed);

        updateLayerCounts();
        updatePreview();
        btnRename.image = File(scriptFolderPath + "/NitroNamer/img/doneIcon.png");
        btnRename.imageSize = [24, 24];
    };               

    btnHelp.onClick = function() {
        updateLayerCounts();
        var helpScriptPath = scriptFolderPath + "/NitroNamer/scripts/NNHelp.jsx";
        $.evalFile(helpScriptPath);
    };

    btnReset.onClick = function() {
        rdoAllLayers.value = true;
        rdoOnlySelected.value = false;
        txtTemplate.text = "(LayerName).i";
        chkBriefly.value = false;
        ddBrieflyType.selection = 0;
        updateLayerCounts();
        updatePreview();
        resetRenameButtonIcon(); 
    };

    btnSettings.onClick = function() {
        var settingsScriptPath = scriptFolderPath + "/NitroNamer/scripts/NNSettings.jsx";
        $.evalFile(settingsScriptPath);
    };

    function setMinimizeButtonIcon(isCompact) {
        btnMinimize.removeEventListener("mouseover", handleMouseOverMaximize);
        btnMinimize.removeEventListener("mouseout", handleMouseOutMaximize);
        btnMinimize.removeEventListener("mouseover", handleMouseOverMinimize);
        btnMinimize.removeEventListener("mouseout", handleMouseOutMinimize);

        if (isCompact) {
            btnMinimize.image = File(scriptFolderPath + "/NitroNamer/img/maximize.png");
            btnMinimize.addEventListener("mouseover", handleMouseOverMaximize);
            btnMinimize.addEventListener("mouseout", handleMouseOutMaximize);

            txtOriginal.minimumSize.width = globalWidthSizeElements - 14;
            txtOriginal.margins = [0,0,0,0];
            txtRenamed.minimumSize.width = globalWidthSizeElements - 14;
            txtRenamed.margins = [0,0,0,0];

            grpTextFields.remove(txtOriginalLabel);
            grpTextFields.remove(txtOriginal);
            grpTextFields.remove(txtRenamedLabel);

            txtOriginalLabel = null;
            txtOriginal = null;
            txtRenamedLabel = null;

            grpTextFields.margins = [0, -10, 0, -10];

            if (txtRenamedCompact) {
                txtRenamedCompact.visible = true;
            }

            updatePreview();
            win.minimumSize.height = globalHeightSizeElementsMin;
            win.maximumSize.height = globalHeightSizeElementsMin;
        } else {
            btnMinimize.image = File(scriptFolderPath + "/NitroNamer/img/minimize.png");
            btnMinimize.addEventListener("mouseover", handleMouseOverMinimize);
            btnMinimize.addEventListener("mouseout", handleMouseOutMinimize);

            while (grpTextFields.children.length > 0) {
                grpTextFields.remove(grpTextFields.children[0]);
            }

            txtOriginalLabel = grpTextFields.add("statictext", undefined, "The original name of the layer: ");
            txtOriginalLabel.maximumSize.height = 14;
            txtOriginalLabel.alignment = ["left", "top"];
            txtOriginalLabel.margins = [0, -100, 0, -100];

            txtOriginal = grpTextFields.add("edittext", undefined, "", { readonly: true });
            txtOriginal.alignment = ["left", "top"];
            txtOriginal.minimumSize.width = globalWidthSizeElements - 14;
            txtOriginal.margins = [0, -100, 0, -100];

            txtRenamedLabel = grpTextFields.add("statictext", undefined, "Template result for layer(s): ");
            txtRenamedLabel.maximumSize.height = 14;
            txtRenamedLabel.alignment = ["left", "top"];
            txtRenamedLabel.margins = [0, -100, 0, -100];

            txtRenamed = grpTextFields.add("edittext", undefined, "", { readonly: true });
            txtRenamed.alignment = ["left", "top"];
            txtRenamed.minimumSize.width = globalWidthSizeElements - 14;
            txtRenamed.margins = [0, -100, 0, -100];

            if (txtRenamedCompact) {
                txtRenamedCompact.visible = false;
            }

            updatePreview();

            win.minimumSize.height = globalHeightSizeElementsMin;
            win.maximumSize.height = globalHeightSizeElementsMax;
            win.minimumSize.width = globalWidthSizeElements  - globalWidthSizeElementsCorrect;
            win.maximumSize.width = globalWidthSizeElements;
        }

        win.layout.layout(true);
        win.layout.resize();
    }
    
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

        var newPresetKey = null; 

        if (isCurrent) {

            for (var key in settings) {
                if (settings.hasOwnProperty(key)) {
                    currentSettings[key] = settings[key];
                }
            }
        } else {
            var presetSettings = settings; 

            presetSettings.creationDate = new Date().getTime();

            presetSettings.usageFrequency = 0;

            presetSettings.favoritesTemplate = false;

            var nextPresetNumber = 1;
            for (var key in userPresets) {
                if (userPresets.hasOwnProperty(key)) {
                    nextPresetNumber++;
                }
            }
            newPresetKey = "preset_" + nextPresetNumber;
            userPresets[newPresetKey] = presetSettings;

            var newUserPresets = {};
            newUserPresets[newPresetKey] = presetSettings;
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

        return newPresetKey; 
    }    

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

    function writeJSONFile(filePath, data) {
        var file = new File(filePath);
        file.encoding = "UTF-8"; 
        file.open("w");
        file.write(JSON.stringify(data, null, 4));
        file.close();
    }

    function checkAndCreateSettingsFile() {
        var scriptFile = new File($.fileName);
        var scriptFolderPath = scriptFile.path + "/NitroNamer/settings";
        var settingsFile = new File(scriptFolderPath + "/settings.json");

        if (!settingsFile.exists) {

            var initialData = {
                "userPresets": {},
                "currentSettings": {
                    "UICompact": false
                }
            };

            settingsFile.encoding = "UTF-8"; 
            if (settingsFile.open("w")) {
                settingsFile.write(JSON.stringify(initialData, null, 4));
                settingsFile.close();
            } else {
                alert("Error: Unable to create settings.json file.", scriptMessageHead_1);
            }
        }
    }

    function checkAndCreateVariablesFile() {
        var scriptFile = new File($.fileName);
        var scriptFolderPath = scriptFile.path + "/NitroNamer/scripts";
        var variablesFile = new File(scriptFolderPath + "/variables.json");

        if (!variablesFile.exists) {

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

            variablesFile.encoding = "UTF-8"; 
            if (variablesFile.open("w")) {
                variablesFile.write(JSON.stringify(initialData, null, 4));
                variablesFile.close();
            } else {
                alert("Error: Unable to create variables.json file.", scriptMessageHead_1);
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

    function getMaskCount(layer, settings, maskFilter, customSeparator) {
        var maskCount = 0;

        var maskModes = {
            "none": MaskMode.NONE,
            "add": MaskMode.ADD,
            "subtract": MaskMode.SUBTRACT,
            "intersect": MaskMode.INTERSECT,
            "lighten": MaskMode.LIGHTEN,
            "darken": MaskMode.DARKEN,
            "difference": MaskMode.DIFFERENCE
        };

        var filterList = null;

        if (maskFilter) {

            filterList = maskFilter.split(',').map(function(item) {
                return item.trim();
            });
        }

        if (layer.mask && layer.mask.numProperties > 0) {
            for (var i = 1; i <= layer.mask.numProperties; i++) {
                var mask = layer.mask.property(i);

                var includeMask = false;

                if (filterList) {

                    for (var j = 0; j < filterList.length; j++) {
                        var filterItem = filterList[j];

                        if (mask.name.trim().toLowerCase() === filterItem.trim().toLowerCase()) {
                            includeMask = true;
                            break;
                        }

                        var lowerFilterItem = filterItem.trim().toLowerCase();
                        if (maskModes.hasOwnProperty(lowerFilterItem)) {
                            if (mask.maskMode === maskModes[lowerFilterItem]) {
                                includeMask = true;
                                break;
                            }
                        }
                    }
                } else {

                    includeMask = true;
                }

                if (includeMask) {
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

    function getMaskNames(layer, settings, maskFilter, customSeparator) {
        var maskNames = [];
        var separator = customSeparator || ", "; 

        var maskModes = {
            "none": MaskMode.NONE,
            "add": MaskMode.ADD,
            "subtract": MaskMode.SUBTRACT,
            "intersect": MaskMode.INTERSECT,
            "lighten": MaskMode.LIGHTEN,
            "darken": MaskMode.DARKEN,
            "difference": MaskMode.DIFFERENCE
        };

        var filterList = null;

        if (maskFilter) {

            filterList = maskFilter.split(',').map(function(item) {
                return item.trim();
            });
        }

        if (layer.mask && layer.mask.numProperties > 0) {
            for (var i = 1; i <= layer.mask.numProperties; i++) {
                var mask = layer.mask.property(i);

                var includeMask = false;

                if (filterList) {

                    for (var j = 0; j < filterList.length; j++) {
                        var filterItem = filterList[j];

                        if (mask.name.trim().toLowerCase() === filterItem.trim().toLowerCase()) {
                            includeMask = true;
                            break;
                        }

                        var lowerFilterItem = filterItem.trim().toLowerCase();
                        if (maskModes.hasOwnProperty(lowerFilterItem)) {
                            if (mask.maskMode === maskModes[lowerFilterItem]) {
                                includeMask = true;
                                break;
                            }
                        }
                    }
                } else {

                    includeMask = true;
                }

                if (includeMask) {
                    maskNames.push(mask.name);
                }
            }

            if (maskNames.length > 0) {
                return maskNames.join(separator);
            }
        } 

        if (settings && settings.Lmn) {
            return settings.Lmn.active ? settings.Lmn.customValue : settings.Lmn.defaultValue;
        } else {
            return "NoMaskNames";
        }
    }    

    variableSettings = loadVariableSettings();

    function applySettings(settings) {

        ddLayerMode.onChange = null;

        if (settings && settings.currentSettings) {
            rdoAllLayers.value = settings.currentSettings.allLayers;
            rdoOnlySelected.value = !settings.currentSettings.allLayers;
            txtTemplate.text = settings.currentSettings.template || "(LayerName).i";
            chkBriefly.value = settings.currentSettings.briefly;
            ddBrieflyType.selection = settings.currentSettings.brieflyType || 0;

            currentModeIndex = settings.currentSettings.modeIndex !== undefined ? settings.currentSettings.modeIndex : 0;
            isActive = settings.currentSettings.modeActive !== undefined ? settings.currentSettings.modeActive : false;

            updateLayerCounts();
            updatePreview();
            resetRenameButtonIcon();
        } else if (settings && settings.userPresets && Object.keys(settings.userPresets).length > 0) {
            var lastPresetKey = Object.keys(settings.userPresets).pop();
            var lastPreset = settings.userPresets[lastPresetKey];

            rdoAllLayers.value = lastPreset.allLayers;
            rdoOnlySelected.value = !lastPreset.allLayers;
            txtTemplate.text = lastPreset.template || "(LayerName).i";
            chkBriefly.value = lastPreset.briefly;
            ddBrieflyType.selection = lastPreset.brieflyType || 0;

            currentModeIndex = 0;
            isActive = false;

            updateLayerCounts();
            updatePreview();
            resetRenameButtonIcon();
        }

        var isCompact = settings.currentSettings && settings.currentSettings.UICompact;
        setMinimizeButtonIcon(isCompact);

        updatePresetsDropdown(settings);

        var selectedPresetTemplate = settings.currentSettings.selectedPresetTemplate;

        if (selectedPresetTemplate) {
            for (var i = 0; i < ddLayerMode.items.length; i++) {
                if (ddLayerMode.items[i].text === selectedPresetTemplate) {
                    ddLayerMode.selection = i;
                    break;
                }
            }
        } else {
            ddLayerMode.selection = 0;
        }

        updateModeButtonIcon();

        if (settings.currentSettings && typeof settings.currentSettings.selectedPresetIndex !== 'undefined') {
            ddLayerMode.selection = settings.currentSettings.selectedPresetIndex;
        } else {
            ddLayerMode.selection = 0; 
        }

        txtTemplate.text = settings.currentSettings.template || "(LayerName).i";

        ddLayerMode.onChange = dropdownChangeHandler;

        if (settings && settings.userPresets && ddLayerMode.selection) {
            var selectedPresetTemplate = ddLayerMode.selection.text;
            var userPresets = settings.userPresets;

            var isFavorite = false;
            for (var key in userPresets) {
                if (userPresets.hasOwnProperty(key) && userPresets[key].template === selectedPresetTemplate) {
                    var preset = userPresets[key];
                    isFavorite = preset.favoritesTemplate || false;
                    break;
                }
            }
            updateFavoritesButtonIcon(isFavorite);
        } else {
            updateFavoritesButtonIcon(false);
        }
    }

    function dropdownChangeHandler() {
        var selectedItem = ddLayerMode.selection;
        if (selectedItem && selectedItem.preset) {
            var preset = selectedItem.preset;
            var selectedTemplate = preset.template; 
    
            var settings = loadSettings();
            var userPresets = settings.userPresets || {};
    
            // Увеличиваем usageFrequency при каждом выборе пресета
            if (preset.hasOwnProperty('usageFrequency')) {
                preset.usageFrequency += 1;
            } else {
                preset.usageFrequency = 1;
            }
    
            // Обновляем пресет в userPresets
            for (var key in userPresets) {
                if (userPresets.hasOwnProperty(key) && userPresets[key].template === preset.template) {
                    userPresets[key] = preset;
                    break;
                }
            }
    
            settings.userPresets = userPresets;
            var settingsFile = scriptFolderPath + "/NitroNamer/settings/settings.json";
            writeJSONFile(settingsFile, settings);
    
            // Остальной код остается без изменений...
    
            rdoAllLayers.value = preset.allLayers;
            rdoOnlySelected.value = !preset.allLayers;
            txtTemplate.text = preset.template;
            chkBriefly.value = preset.briefly;
            ddBrieflyType.selection = preset.brieflyType || 0;
    
            updateLayerCounts();
            updatePreview();
            resetRenameButtonIcon();
            updateRenameButtonIcon();
    
            var currentSettings = {
                allLayers: rdoAllLayers.value,
                template: txtTemplate.text,
                briefly: chkBriefly.value,
                brieflyType: ddBrieflyType.selection.index,
                selectedPresetTemplate: preset.template
            };
            saveSettings(currentSettings, true);
    
            updateFavoritesButtonIcon(preset.favoritesTemplate);
    
            updatePresetsDropdown(settings);
    
            ddLayerMode.onChange = null;
    
            for (var i = 0; i < ddLayerMode.items.length; i++) {
                var item = ddLayerMode.items[i];
                if (item.preset && item.preset.template === selectedTemplate) {
                    ddLayerMode.selection = i;
                    break;
                }
            }
    
            ddLayerMode.onChange = dropdownChangeHandler;
        }
    }    

    function updatePresetsDropdown(settings) {
        ddLayerMode.onChange = null;
        
        ddLayerMode.removeAll();
        var userPresets = settings.userPresets || {};
        
        var presetsArray = [];
        
        var searchTerm = txtTemplate.text.toLowerCase();
        
        for (var key in userPresets) {
            if (userPresets.hasOwnProperty(key)) {
                var preset = userPresets[key];
        
                // Обработка режима "favorites"
                if (isActive && modes[currentModeIndex] === "favorites") {
                    if (preset.favoritesTemplate) {
                        presetsArray.push(preset);
                    }
                }
                // Обработка режима "search"
                else if (isActive && modes[currentModeIndex] === "search") {
                    if (searchTerm === "") {
                        // Если поисковый запрос пуст, показываем все пресеты
                        presetsArray.push(preset);
                    } else {
                        // Проверяем, содержит ли шаблон пресета поисковый запрос
                        if (preset.template.toLowerCase().indexOf(searchTerm) !== -1) {
                            presetsArray.push(preset);
                        }
                    }
                } else {
                    // Для остальных режимов или когда режим не активен, добавляем все пресеты
                    presetsArray.push(preset);
                }
            }
        }
        
        // Сортировка пресетов
        if (isActive) {
            if (modes[currentModeIndex] === "chart") {
                // Сортировка по частоте использования
                presetsArray.sort(function(a, b) {
                    return (b.usageFrequency || 0) - (a.usageFrequency || 0);
                });
            } else if (modes[currentModeIndex] === "date") {
                // Сортировка по дате создания
                presetsArray.sort(function(a, b) {
                    var dateA = new Date(a.creationDate);
                    var dateB = new Date(b.creationDate);
        
                    if (isNaN(dateA.getTime())) {
                        dateA = new Date(0);
                    }
                    if (isNaN(dateB.getTime())) {
                        dateB = new Date(0);
                    }
        
                    return dateA.getTime() - dateB.getTime();
                });
            } else if (modes[currentModeIndex] === "longArrowDown") {
                // Сортировка по длине шаблона (убывание)
                presetsArray.sort(function(a, b) {
                    return b.template.length - a.template.length;
                });
            } else if (modes[currentModeIndex] === "longArrowUp") {
                // Сортировка по длине шаблона (возрастание)
                presetsArray.sort(function(a, b) {
                    return a.template.length - b.template.length;
                });
            }
            // Для режимов "favorites" и "search" дополнительная сортировка не требуется
        }
        
        // Заполнение выпадающего списка
        if (presetsArray.length === 0) {
            ddLayerMode.add("item", "No presets saved or suitable presets.");
        } else {
            for (var i = 0; i < presetsArray.length; i++) {
                var displayText = presetsArray[i].template;
        
                if (isActive) {
                    if (modes[currentModeIndex] === "chart") {
                        displayText += " {" + (presetsArray[i].usageFrequency || 0) + "}";
                    } else if (modes[currentModeIndex] === "date") {
                        if (presetsArray[i].creationDate) {
                            var creationDate = new Date(presetsArray[i].creationDate);
                            if (!isNaN(creationDate.getTime())) {
                                var formattedDate = creationDate.getFullYear() + "-" +
                                                    ("0" + (creationDate.getMonth() + 1)).slice(-2) + "-" +
                                                    ("0" + creationDate.getDate()).slice(-2);
                                displayText += " {" + formattedDate + "}";
                            } else {
                                displayText += " {Unknown date}";
                            }
                        } else {
                            displayText += " {Unknown date}";
                        }
                    } else if (modes[currentModeIndex] === "longArrowDown" || modes[currentModeIndex] === "longArrowUp") {
                        displayText += " {" + presetsArray[i].template.length + "}";
                    }
                    // В режимах "favorites" и "search" дополнительную информацию не добавляем
                }
        
                var item = ddLayerMode.add("item", displayText);
                item.preset = presetsArray[i];
            }
        }
        
        // Выбор текущего пресета
        var selectedPresetTemplate = settings.currentSettings ? settings.currentSettings.selectedPresetTemplate : null;
        var selectedIndex = -1;
        
        for (var i = 0; i < ddLayerMode.items.length; i++) {
            var itemPresetTemplate = ddLayerMode.items[i].preset ? ddLayerMode.items[i].preset.template : null;
            if (itemPresetTemplate === selectedPresetTemplate) {
                selectedIndex = i;
                break;
            }
        }
        
        if (selectedIndex !== -1) {
            ddLayerMode.selection = selectedIndex;
        } else {
            ddLayerMode.selection = 0;
        }
        
        ddLayerMode.onChange = dropdownChangeHandler;
    }    

    function updateLayerCounts() {
        var proj = app.project;
        if (proj) {
            var comp = proj.activeItem;
            if (comp && comp instanceof CompItem) {
                var totalLayerCount = 0;
                var selectedLayerCount = 0;
                for (var i = 1; i <= comp.numLayers; i++) {
                    var layer = comp.layer(i);

                    if (!layer.locked && !layer.shy) {
                        totalLayerCount++;
                        if (layer.selected) {
                            selectedLayerCount++;
                        }
                    }
                }
                txtAllLayersCount.text = totalLayerCount.toString();
                txtSelectedLayersCount.text = selectedLayerCount.toString();
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

    function updatePreview() {
        var settings = loadSettings();
        var isCompact = settings.currentSettings && settings.currentSettings.UICompact;

        resetLocalIndex();
        checkAndUpdateSettings(); 

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

                    if (!isCompact) {
                        txtOriginal.text = originalName;
                        txtRenamed.text = newName;
                    }
                    if (txtRenamed) {
                        txtRenamed.text = newName; 
                    }
                } else {
                    if (!isCompact) {
                        txtOriginal.text = "No layers in composition.";
                        txtRenamed.text = "No layers in composition.";
                    }
                    if (txtRenamed) {
                        txtRenamed.text = "No layers in composition.";
                    }
                }
            } else {
                if (!isCompact) {
                    txtOriginal.text = "No composition selected.";
                    txtRenamed.text = "No composition selected.";
                }
                if (txtRenamed) {
                    txtRenamed.text = "No composition selected.";
                }
            }
        } else {
            if (!isCompact) {
                txtOriginal.text = "No project open.";
                txtRenamed.text = "No project open.";
            }
            if (txtRenamed) {
                txtRenamed.text = "No project open.";
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

    function generateNewName(layer, template, briefly, brieflyType, settings) {
        resetLocalIndex();
        checkAndUpdateSettings(); 
        incrementValues = {}; 

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
            "Ec": getEffectsCount(layer, settings),
            "Pn": getProjectName(),
            "Lpos": getLayerPosition(layer),
            "Lsc": getLayerScale(layer),
            "Lrot": getLayerRotation(layer),
            "Lops": getLayerOpacity(layer),
            "Lexp": getExpressionControlledProperties(layer, settings),
            "Fext": getFileExtension(layer, settings),
            "Lpnt": getImmediateParentName(layer),
            "LpntIndex": getLayerParentIndex(layer),
            "Cd": getCurrentDate(),
            "Lmc": getMaskCount(layer, settings),
            "Lmn": getMaskNames(layer, settings)
        };

        if (briefly && !isNaN(parseFloat(variables.F))) {
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

    function getExpressionControlledProperties(layer, settings, propertiesFilter, customSeparator) {
        var expressionProps = [];
        var propertyNames = null;
        var separator = customSeparator || ", "; 

        if (propertiesFilter) {

            propertyNames = propertiesFilter.split(',').map(function(name) {
                return name.trim().toLowerCase();
            });
        }

        function checkPropertyGroup(propertyGroup) {
            for (var i = 1; i <= propertyGroup.numProperties; i++) {
                var prop = propertyGroup.property(i);
                if (prop.expression && prop.expressionEnabled) {
                    if (propertyNames) {

                        if (propertyNames.indexOf(prop.name.toLowerCase()) !== -1) {
                            expressionProps.push(prop.name);
                        }
                    } else {
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
            return expressionProps.join(separator);
        } else {

            if (settings && settings.Lexp) {
                return settings.Lexp.active ? settings.Lexp.customValue : settings.Lexp.defaultValue;
            } else {
                return "NoExpressions";
            }
        }
    }    

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

    function toCamelCase(str) {
        var result = "";
        var capitalizeNext = false;

        for (var i = 0; i < str.length; i++) {
            var currentChar = str.charAt(i);
            var charCode = str.charCodeAt(i);

            if ((charCode >= 48 && charCode <= 57) || 
                (charCode >= 65 && charCode <= 90) || 
                (charCode >= 97 && charCode <= 122)) { 
                if (capitalizeNext) {
                    result += currentChar.toUpperCase();
                    capitalizeNext = false;
                } else {
                    result += currentChar.toLowerCase();
                }
            } else {
                result += currentChar; 
                capitalizeNext = true;
            }
        }

        return result;
    }

    function toPascalCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    function toSnakeCase(str) {
        return str.replace(/\s+/g, '_').toLowerCase();
    }

    function toKebabCase(str) {
        return str.replace(/\s+/g, '-').toLowerCase();
    }

    function toScreamingSnakeCase(str) {
        return str.replace(/\s+/g, '_').toUpperCase();
    }

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

    function getFrameRate(layer, settings) {
        if (layer.nullLayer || layer.adjustmentLayer || layer instanceof LightLayer || layer instanceof CameraLayer || layer instanceof TextLayer || layer instanceof ShapeLayer || layer.hasAudio) {
            return settings && settings.F ? (settings.F.active ? settings.F.customValue : settings.F.defaultValue) : "NoFrameRate";
        }
        if (layer.source && layer.source.mainSource instanceof SolidSource) {
            return settings && settings.F ? (settings.F.active ? settings.F.customValue : settings.F.defaultValue) : "NoFrameRate";
        }
        if (layer.source && !isNaN(layer.source.frameRate)) {
            return layer.source.frameRate.toFixed(2);
        }
        return settings && settings.F ? (settings.F.active ? settings.F.customValue : settings.F.defaultValue) : "NoFrameRate";
    }    

    function getResolution(layer, settings) {
        if (layer.nullLayer || layer.adjustmentLayer) {
            return settings && settings.R ? (settings.R.active ? settings.R.customValue : settings.R.defaultValue) : "NoResolution";
        }
        if (layer.source && layer.source.width && layer.source.height) {
            return layer.source.width + "*" + layer.source.height;
        }
        return settings && settings.R ? (settings.R.active ? settings.R.customValue : settings.R.defaultValue) : "NoResolution";
    }    

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

    function getSourceName(layer) {
        if (layer.source) {
            return layer.source.name;
        }
        return layer.name; 
    }

    function getWidth(layer, settings) {
        if (layer.nullLayer || layer.adjustmentLayer) {
            return settings && settings.W ? (settings.W.active ? settings.W.customValue : settings.W.defaultValue) : "NoWidth";
        }
        if (layer.source && layer.source.width) {
            return layer.source.width.toString();
        }
        return settings && settings.W ? (settings.W.active ? settings.W.customValue : settings.W.defaultValue) : "NoWidth";
    }    

    function getHeight(layer, settings) {
        if (layer.nullLayer || layer.adjustmentLayer) {
            return settings && settings.H ? (settings.H.active ? settings.H.customValue : settings.H.defaultValue) : "NoHeight";
        }
        if (layer.source && layer.source.height) {
            return layer.source.height.toString();
        }
        return settings && settings.H ? (settings.H.active ? settings.H.customValue : settings.H.defaultValue) : "NoHeight";
    }    

    function getLayerPosition(layer) {
        if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
            return ""; 
        }

        if (layer.transform && layer.transform.position) {
            var pos = layer.transform.position.value;

            if (typeof pos === 'number') {
                pos = [pos];
            } else if (Object.prototype.toString.call(pos) !== '[object Array]') {
                pos = [].slice.call(pos);
            }

            if (layer instanceof CameraLayer || layer instanceof LightLayer || layer.threeDLayer) {

                var roundedPos = [0, 0, 0]; 
                for (var i = 0; i < 3; i++) {
                    roundedPos[i] = pos[i] !== undefined ? Math.round(pos[i] * 10) / 10 : 0;
                }
                return roundedPos.join(", ");
            } else {

                var roundedPos2D = [0, 0]; 
                for (var j = 0; j < 2; j++) {
                    roundedPos2D[j] = pos[j] !== undefined ? Math.round(pos[j] * 10) / 10 : 0;
                }
                return roundedPos2D.join(", ");
            }
        }
        return "NoPosition";
    }

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

    function getEffectsCount(layer, settings, effectsFilter) {
        var effectsCount = 0;
        var effectsNamesFilter = null;

        if (effectsFilter) {
            effectsNamesFilter = effectsFilter.split(',').map(function(name) {
                return name.trim().toLowerCase();
            });
        }

        if (layer.property("ADBE Effect Parade") && layer.property("ADBE Effect Parade").numProperties > 0) {
            for (var j = 1; j <= layer.property("ADBE Effect Parade").numProperties; j++) {
                var effect = layer.property("ADBE Effect Parade").property(j);

                if (effectsNamesFilter) {
                    if (effectsNamesFilter.indexOf(effect.name.trim().toLowerCase()) !== -1) {
                        effectsCount++;
                    }
                } else {
                    effectsCount++;
                }
            }

            return effectsCount.toString();
        } else {
            if (settings && settings.Ec) {
                return settings.Ec.active ? settings.Ec.customValue : settings.Ec.defaultValue;
            } else {
                return "NoEffects";
            }
        }
    }    

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
        return decodeURIComponent(projectName); 
    }

    function getAnimatedProperties(layer, settings, propertiesFilter, customSeparator) {
        var animatedProps = [];
        var propertyNames = null;
        var separator = customSeparator || ", "; 

        if (propertiesFilter) {

            propertyNames = propertiesFilter.split(',').map(function(name) {
                return name.trim().toLowerCase();
            });
        }

        var hasAnyAnimatedProperty = false;

        function checkPropertyGroup(propertyGroup) {
            for (var i = 1; i <= propertyGroup.numProperties; i++) {
                var prop = propertyGroup.property(i);
                if (prop.numKeys > 0) {
                    hasAnyAnimatedProperty = true;
                    if (propertyNames) {

                        if (propertyNames.indexOf(prop.name.toLowerCase()) !== -1) {
                            animatedProps.push(prop.name);
                        }
                    } else {
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
            return animatedProps.join(separator);
        } else {

            if (settings && settings.An) {
                return settings.An.active ? settings.An.customValue : settings.An.defaultValue;
            } else {
                return "NoAnimations";
            }
        }
    }    

    function getLayerScale(layer) {
        if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
            return ""; 
        }

        if (layer.transform && layer.transform.scale) {
            var sc = layer.transform.scale.value;

            if (typeof sc === 'number') {
                sc = [sc];
            } else if (Object.prototype.toString.call(sc) !== '[object Array]') {
                sc = [].slice.call(sc);
            }

            if (layer instanceof CameraLayer || layer instanceof LightLayer || layer.threeDLayer) {

                var roundedSc = [0, 0, 0]; 
                for (var i = 0; i < 3; i++) {
                    roundedSc[i] = sc[i] !== undefined ? Math.round(sc[i] * 10) / 10 : 0;
                }
                return roundedSc.join(", ");
            } else {

                var roundedSc2D = [0, 0]; 
                for (var j = 0; j < 2; j++) {
                    roundedSc2D[j] = sc[j] !== undefined ? Math.round(sc[j] * 10) / 10 : 0;
                }
                return roundedSc2D.join(", ");
            }
        }
        return "NoScale";
    }

    function getLayerRotation(layer) {
        if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
            return ""; 
        }

        if (layer.transform) {
            var rotation;

            if (layer.threeDLayer) {
                var rotationX = layer.transform.xRotation ? layer.transform.xRotation.value : 0;
                var rotationY = layer.transform.yRotation ? layer.transform.yRotation.value : 0;
                var rotationZ = layer.transform.zRotation ? layer.transform.zRotation.value : 0;
                rotation = [rotationX, rotationY, rotationZ];
            } else {

                rotation = layer.transform.rotation ? [layer.transform.rotation.value] : [0];
            }

            if (typeof rotation === 'number') {
                rotation = [rotation];
            } else if (Object.prototype.toString.call(rotation) !== '[object Array]') {
                rotation = [].slice.call(rotation);
            }

            if (layer instanceof CameraLayer || layer instanceof LightLayer || layer.threeDLayer) {
                var roundedRot = [0, 0, 0]; 
                for (var i = 0; i < 3; i++) {
                    roundedRot[i] = rotation[i] !== undefined ? Math.round(rotation[i] * 10) / 10 : 0;
                }
                return roundedRot.join(", ");
            } else {

                var roundedRot2D = [0]; 
                roundedRot2D[0] = rotation[0] !== undefined ? Math.round(rotation[0] * 10) / 10 : 0;
                return roundedRot2D.join(", ");
            }
        }
        return "NoRotation";
    }

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

    function getLayerOpacity(layer) {
        if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
            return ""; 
        }

        if (layer.transform && layer.transform.opacity) {
            var opacity = layer.transform.opacity.value;
            return Math.round(opacity * 10) / 10;
        }
        return "NoOpacity";
    }

    function getDurationInFrames(layer) {
        if (layer && layer.containingComp) {
            var frameRate = layer.containingComp.frameRate;
            var duration = (layer.outPoint - layer.inPoint) * frameRate;
            return Math.round(duration);
        }
        return "NoDuration";
    }

    function getImmediateParentName(layer) {
        var currentLayer = layer;

        while (currentLayer.parent) {
            currentLayer = currentLayer.parent;
        }

        return currentLayer.name; 
    }

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

    function isBoundLayer(layer) {
        return layer.parent !== null;
    }

    function getLayerParentIndex(layer) {
        var comp = layer.containingComp;

        if (!layer.parent && !isParentLayer(layer)) {
            return layer.name;
        }

        if (isParentLayer(layer) && !layer.parent) {
            return layer.name;
        }

        if (layer.parent) {
            var parentLayer = layer.parent;
            var childLayers = [];

            for (var i = 1; i <= comp.numLayers; i++) {
                var currentLayer = comp.layer(i);
                if (currentLayer.parent === parentLayer) {
                    childLayers.push(currentLayer);
                }
            }

            childLayers.sort(function(a, b) {
                return a.index - b.index;
            });

            var allAbove = true;
            var allBelow = true;

            for (var i = 0; i < childLayers.length; i++) {
                if (childLayers[i].index > parentLayer.index) {
                    allAbove = false;
                }
                if (childLayers[i].index < parentLayer.index) {
                    allBelow = false;
                }
            }

            var relativeIndex;

            if (allAbove) {
                relativeIndex = childLayers.length - childLayers.indexOf(layer);
            } 

            else if (allBelow) {
                relativeIndex = childLayers.indexOf(layer) + 1;
            } 

            else {
                relativeIndex = childLayers.indexOf(layer) + 1;
            }

            return relativeIndex.toString();
        }

        return layer.name;
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

        if (reverseOrder) {
            layers.reverse();
        }
        return layers;
    }

    function resetLocalIndex() {
        localIndex = 1;
    }

    var incrementValues = {};

    function replaceVariables(template, variables, originalName, layer, settings) {
        var usedVariables = [];
        var result = template;

        if (template.match(/^\(([^()]+)\)$/)) {
            return template.match(/^\(([^()]+)\)$/)[1];
        }

        var regex = /\(([^()]+)\)|Df|Ec\(([^()\[\]]+?)\)|Ec|E\(\[([^\[\]]+)\]\)|E\(([^()\[\]]+?)(?:\[(.*?)\])?\)|E|An\(\[([^\[\]]+)\]\)|An\(([^()\[\]]+?)(?:\[(.*?)\])?\)|An|Lexp\(\[([^\[\]]+)\]\)|Lexp\(([^()\[\]]+?)(?:\[(.*?)\])?\)|Lexp|D\(([^()\[\]]+)\)|D|Fext\(([^()\[\]]+)\)|Fext|Ip|Op|Tm|Ar\(([^()\[\]]+)\)|Ar|Pn|Lpos|Lsc|Lrot|Lops|Lpnt\(([^()\[\]]+)\)|Lpnt|Cd\(([^()\[\]]+)\)|Cd|Lmc\(\[([^\[\]]+)\]\)|Lmc\(([^()\[\]]+?)(?:\[(.*?)\])?\)|Lmc|Lmn\(\[([^\[\]]+)\]\)|Lmn\(([^()\[\]]+?)(?:\[(.*?)\])?\)|Lmn|I\(([^()\[\]]+)\)|I|[A-Z]|i|S|W|H/g;

        var incrementValues = {}; 

        result = result.replace(regex, function(match,
            group,
            ecFilters,
            eSeparatorOnly, eEffects, eSeparator,
            anSeparatorOnly, anProps, anSeparator,
            lexpSeparatorOnly, lexpProps, lexpSeparator,
            durationFormat,
            customFext,
            customAr,
            parentIndex,
            dateFormat,
            lmcSeparatorOnly, lmcFilters, lmcSeparator,
            lmnSeparatorOnly, lmnFilters, lmnSeparator,
            customI
        ) {
            var value;

            if (group !== undefined) {

                return group;
            } else if (eSeparatorOnly !== undefined) {

                value = getEffectNames(layer, settings, null, eSeparatorOnly);
            } else if (eEffects !== undefined) {

                value = getEffectNames(layer, settings, eEffects, eSeparator);
            } else if (match === 'E') {

                value = getEffectNames(layer, settings);
            } else if (customI !== undefined) {

                var uniqueKey = "I(" + customI + ")_" + usedVariables.length;
                var initialValue = parseInt(customI, 10);
                if (!incrementValues[uniqueKey]) {
                    incrementValues[uniqueKey] = initialValue; 
                }
                value = incrementValues[uniqueKey]++;
                usedVariables.push(uniqueKey);
                return value;
            } else if (match === 'I') {

                value = localIndex++; 
            } else if (anSeparatorOnly !== undefined) {

                value = getAnimatedProperties(layer, settings, null, anSeparatorOnly);
            } else if (anProps !== undefined) {

                value = getAnimatedProperties(layer, settings, anProps, anSeparator);
            } else if (match === 'An') {

                value = getAnimatedProperties(layer, settings);
            } else if (lexpSeparatorOnly !== undefined) {

                value = getExpressionControlledProperties(layer, settings, null, lexpSeparatorOnly);
            } else if (lexpProps !== undefined) {

                value = getExpressionControlledProperties(layer, settings, lexpProps, lexpSeparator);
            } else if (match === 'Lexp') {

                value = getExpressionControlledProperties(layer, settings);
            } else if (match === 'Fext') {

                value = variables['Fext'];
            } else if (lmnSeparatorOnly !== undefined) {

                value = getMaskNames(layer, settings, null, lmnSeparatorOnly);
            } else if (lmnFilters !== undefined) {

                value = getMaskNames(layer, settings, lmnFilters, lmnSeparator);
            } else if (match === 'Lmn') {

                value = getMaskNames(layer, settings);
            } else if (lmcSeparatorOnly !== undefined) {

                value = getMaskCount(layer, settings, null, lmcSeparatorOnly);
            } else if (lmcFilters !== undefined) {

                value = getMaskCount(layer, settings, lmcFilters, lmcSeparator);
            } else if (match === 'Lmc') {

                value = getMaskCount(layer, settings);
            } else if (customAr !== undefined) {

                value = getAspectRatio(layer, settings, true);
            } else if (match === 'Ar') {

                value = variables['Ar'];
            } else if (durationFormat !== undefined) {

                value = typeof variables['D'] === 'function' ? variables['D'](durationFormat) : variables['D'];
            } else if (match === 'D') {

                value = typeof variables['D'] === 'function' ? variables['D']() : variables['D'];
            } else if (match === 'Df') {

                value = variables['Df'];
            } else if (ecFilters !== undefined) {

                value = getEffectsCount(layer, settings, ecFilters);
            } else if (match === 'Ec') {

                value = getEffectsCount(layer, settings);
            } else if (match === 'Ip') {

                value = variables['Ip'];
            } else if (match === 'Op') {

                value = variables['Op'];
            } else if (match === 'Tm') {

                value = variables['Tm'];
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

                value = variables['Lpnt'];
            } else if (parentIndex !== undefined) {

                value = variables['LpntIndex'];
            } else if (dateFormat !== undefined) {

                value = getCurrentDate(dateFormat);
            } else if (match === 'Cd') {

                value = getCurrentDate();
            } else if (/[A-Z]/.test(match)) {

                value = variables[match];
            } else if (match === 'i') {

                value = variables['i'];
            } else if (match === 'S') {

                value = variables['S'];
            } else if (match === 'W') {

                value = variables['W'];
            } else if (match === 'H') {

                value = variables['H'];
            } else {

                value = '';
            }

            if (value !== undefined && value !== "") {
                usedVariables.push(match);
                return value;
            } else {
                return "";
            }
        });

        if (result === originalName || result === "") {
            return originalName;
        }

        return result;
    }    

    var localIndex = 0; 

    function renameLayersByTemplate(allLayers, template, briefly, brieflyType, includeShyLayers, reverseOrder, isCtrlPressed, isShiftPressed, isAltPressed) {
        checkAndUpdateSettings(); 
        incrementValues = {};
        localIndex = 1;

        var proj = app.project;
        if (proj && proj.activeItem instanceof CompItem) {
            var comp = proj.activeItem;
            if (comp.numLayers > 0) {
                app.beginUndoGroup("Rename Layers by Template");

                var layers = getLayerOrder(comp, allLayers, isAltPressed);

                var newNames = []; 

                for (var i = 0; i < layers.length; i++) {
                    var layer = layers[i];
                    if (layer.shy && !includeShyLayers) continue;
                    if (layer.locked) continue; 
                    if (!allLayers && !layer.selected) continue;

                    var variables = {
                        "T": getLayerType(layer),
                        "i": layer.index,
                        "I": localIndex,  
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
                        "Ec": getEffectsCount(layer, variableSettings),
                        "Pn": getProjectName(),
                        "Lpos": getLayerPosition(layer),
                        "Lsc": getLayerScale(layer),
                        "Lrot": getLayerRotation(layer),
                        "Lops": getLayerOpacity(layer),
                        "Lexp": getExpressionControlledProperties(layer, variableSettings),
                        "Fext": getFileExtension(layer, variableSettings),
                        "LpntIndex": getLayerParentIndex(layer),
                        "Lpnt": getImmediateParentName(layer), 
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

                    newNames.push({
                        layer: layer,
                        newName: newName
                    });
                }

                for (var j = 0; j < newNames.length; j++) {
                    var layerData = newNames[j];
                    var layer = layerData.layer;
                    var newName = layerData.newName;

                    if (isCtrlPressed) {
                        layer.name = layer.name + newName;
                    } else if (isShiftPressed) {
                        layer.name = newName + layer.name;
                    } else {
                        layer.name = newName;
                    }
                }

                app.endUndoGroup();
            } else {
                alert("No layers in the active composition.", scriptMessageHead_1);
            }
        } else {
            alert("Please select a valid composition.", scriptMessageHead_1);
        }
    }

    function getEffectNames(layer, settings, effectsFilter, customSeparator) {
        var effectNames = [];
        var effectNamesFilter = null;
        var separator = customSeparator || ", "; 

        if (effectsFilter) {

            effectNamesFilter = effectsFilter.split(',').map(function(name) {
                return name.trim().toLowerCase();
            });
        }

        if (layer.property("ADBE Effect Parade") && layer.property("ADBE Effect Parade").numProperties > 0) {
            function checkEffects() {
                for (var j = 1; j <= layer.property("ADBE Effect Parade").numProperties; j++) {
                    var effect = layer.property("ADBE Effect Parade").property(j);
                    if (effectNamesFilter) {

                        if (effectNamesFilter.indexOf(effect.name.toLowerCase()) !== -1) {
                            effectNames.push(effect.name);
                        }
                    } else {
                        effectNames.push(effect.name);
                    }
                }
            }

            checkEffects();

            if (effectNames.length > 0) {
                return effectNames.join(separator);
            } else {

                if (settings && settings.E) {
                    return settings.E.active ? settings.E.customValue : settings.E.defaultValue;
                } else {
                    return "NoEffects";
                }
            }
        } else {

            if (settings && settings.E) {
                return settings.E.active ? settings.E.customValue : settings.E.defaultValue;
            } else {
                return "NoEffects";
            }
        }
    }

    checkAndCreateSettingsFile();
    checkAndCreateVariablesFile();

    var tooltipsFilePath = scriptFolderPath + "/NitroNamer/settings/tooltips.json";

    function checkAndCreateTooltipsFile() {
        var tooltipsFile = new File(tooltipsFilePath);
        if (!tooltipsFile.exists) {

            var initialSettingsScriptPath = scriptFolderPath + "/NitroNamer/settings/initialSettings.jsx";
            var initialSettingsScriptFile = new File(initialSettingsScriptPath);

            if (initialSettingsScriptFile.exists) {

                $.evalFile(initialSettingsScriptFile);
            } else {
                alert("Error: initialSettings.jsx not found at " + initialSettingsScriptPath, scriptMessageHead_1);
            }

            if (!tooltipsFile.exists) {

                var forceSettingsScriptPath = scriptFolderPath + "/NitroNamer/settings/forceSettings.jsx";
                var forceSettingsScriptFile = new File(forceSettingsScriptPath);

                if (forceSettingsScriptFile.exists) {

                    $.evalFile(forceSettingsScriptFile);
                } else {
                    alert("Error: forceSettings.jsx not found at " + forceSettingsScriptPath, scriptMessageHead_1);
                }
            }
        }
    }

    function loadTooltips() {
        var tooltipsFile = new File(tooltipsFilePath);
        if (tooltipsFile.exists) {
            var tooltipsData = readJSONFile(tooltipsFilePath);
            return tooltipsData;
        } else {
            return null;
        }
    }

    function getTooltip(buttonName, mode) {
        if (tooltipsData && tooltipsData.NitroNamer && tooltipsData.NitroNamer.tooltips && tooltipsData.NitroNamer.tooltips.buttons) {
            var key = mode ? buttonName + "_" + mode : buttonName;
            return tooltipsData.NitroNamer.tooltips.buttons[key] || tooltipsData.NitroNamer.tooltips.buttons[buttonName];
        }
        return "";
    }

    checkAndCreateTooltipsFile();

    var tooltipsData = loadTooltips();

    function applyTooltips(tooltipsData) {
        if (tooltipsData && tooltipsData.NitroNamer && tooltipsData.NitroNamer.tooltips) {
            var tooltips = tooltipsData.NitroNamer.tooltips;

            if (tooltips.buttons) {
                if (tooltips.buttons.btnCopy) {
                    btnCopy.helpTip = tooltips.buttons.btnCopy;
                }
                if (tooltips.buttons.btnSave) {
                    btnSave.helpTip = tooltips.buttons.btnSave;
                }
                if (tooltips.buttons.btnCircleMinus) {
                    btnCircleMinus.helpTip = tooltips.buttons.btnCircleMinus;
                }
                if (tooltips.buttons.btnMinimize) {
                    btnMinimize.helpTip = tooltips.buttons.btnMinimize;
                }
                if (tooltips.buttons.btnRename) {
                    btnRename.helpTip = tooltips.buttons.btnRename;
                }
                if (tooltips.buttons.btnVariables) {
                    btnVariables.helpTip = tooltips.buttons.btnVariables;
                }
                if (tooltips.buttons.btnHelp) {
                    btnHelp.helpTip = tooltips.buttons.btnHelp;
                }
                if (tooltips.buttons.btnReset) {
                    btnReset.helpTip = tooltips.buttons.btnReset;
                }
                if (tooltips.buttons.btnSettings) {
                    btnSettings.helpTip = tooltips.buttons.btnSettings;
                }

            }

            if (tooltips.radioButtons) {
                if (tooltips.radioButtons.rdoAllLayers) {
                    rdoAllLayers.helpTip = tooltips.radioButtons.rdoAllLayers;
                }
                if (tooltips.radioButtons.rdoOnlySelected) {
                    rdoOnlySelected.helpTip = tooltips.radioButtons.rdoOnlySelected;
                }
            }

            if (tooltips.textFields) {
                if (tooltips.textFields.txtTemplate) {
                    txtTemplate.helpTip = tooltips.textFields.txtTemplate;
                }
            }

            if (tooltips.checkboxes) {
                if (tooltips.checkboxes.chkBriefly) {
                    chkBriefly.helpTip = tooltips.checkboxes.chkBriefly;
                }
            }

            if (tooltips.dropdowns) {
                if (tooltips.dropdowns.ddLayerMode) {
                    ddLayerMode.helpTip = tooltips.dropdowns.ddLayerMode;
                }
                if (tooltips.dropdowns.ddBrieflyType) {
                    ddBrieflyType.helpTip = tooltips.dropdowns.ddBrieflyType;
                }
            }
        }
    }

    applyTooltips(tooltipsData);

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