function buildUI(thisObj) {
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "NitroNamer", undefined, {resizeable: true});
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.active = true;
    win.margins = [4,4,4,4];

    var grpLayerSelection = win.add("group", undefined);
    grpLayerSelection.orientation = "row"; // Изменено на горизонтальную ориентацию

    var rdoAllLayers = grpLayerSelection.add("radiobutton", undefined, "Total: ");
    rdoAllLayers.value = true;
    var txtAllLayersCount = grpLayerSelection.add("statictext", undefined, "");

    var rdoOnlySelected = grpLayerSelection.add("radiobutton", undefined, "Selected: ");
    var txtSelectedLayersCount = grpLayerSelection.add("statictext", undefined, "");

    var scriptFile = new File($.fileName);
    var scriptFolderPath = scriptFile.path;

    // Добавить кнопки в grpLayerSelection
    var btnSave = grpLayerSelection.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/save.png"), {style: "toolbutton"});
    btnSave.size = [24, 24];
    btnSave.imageSize = [24, 24];

    btnSave.addEventListener("mouseover", function() {
        btnSave.image = File(scriptFolderPath + "/NitroNamer/img/saveHover.png");
        btnSave.imageSize = [24, 24];
    });
    btnSave.addEventListener("mouseout", function() {
        btnSave.image = File(scriptFolderPath + "/NitroNamer/img/save.png");
        btnSave.imageSize = [24, 24];
    });

    var btnCircleMinus = grpLayerSelection.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/delete.png"), {style: "toolbutton"});
    btnCircleMinus.size = [24, 24];
    btnCircleMinus.imageSize = [24, 24];

    btnCircleMinus.addEventListener("mouseover", function() {
        btnCircleMinus.image = File(scriptFolderPath + "/NitroNamer/img/deleteHover.png");
        btnCircleMinus.imageSize = [24, 24];
    });
    btnCircleMinus.addEventListener("mouseout", function() {
        btnCircleMinus.image = File(scriptFolderPath + "/NitroNamer/img/delete.png");
        btnCircleMinus.imageSize = [24, 24];
    });

    // Загрузить настройки и заполнить выпадающий список пресетами
    var settings = loadSettings();
    var userPresets = settings.userPresets || {};
    var presetTemplates = [];

    for (var key in userPresets) {
        if (userPresets.hasOwnProperty(key)) {
            presetTemplates.push(userPresets[key].template);
        }
    }

    // Новая группа для выпадающего списка
    var grpDropdownAndButtons = win.add("group", undefined);
    grpDropdownAndButtons.orientation = "row";
    grpDropdownAndButtons.alignment = ["fill", "top"];
    grpDropdownAndButtons.margins = [0, -10, 0, 0]; // Отступы от краев группы (верхний отступ 5px)

    // Добавить выпадающий список
    var ddLayerMode = grpDropdownAndButtons.add("dropdownlist", undefined, presetTemplates);
    ddLayerMode.selection = 0;

    ddLayerMode.onChange = function() {
        var selectedPreset = ddLayerMode.selection;
        if (selectedPreset) {
            var presetTemplate = selectedPreset.text;
    
            // Загрузить текущие настройки
            var settings = loadSettings();
            var userPresets = settings.userPresets || {};
    
            // Найти ключ пресета с соответствующим шаблоном
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
    
                    // Сохранить текущий выбор пресета
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

    // Обновить функции переключения режимов
    rdoAllLayers.onClick = function() {
        if (rdoAllLayers.value) {
            rdoOnlySelected.value = false;
        } else {
            rdoOnlySelected.value = true;
        }
        updateLayerCounts();
        updatePreview();
        resetRenameButtonIcon();
        
        // Сохранить текущие настройки
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
        
        // Сохранить текущие настройки
        var currentSettings = {
            allLayers: rdoAllLayers.value,
            template: txtTemplate.text,
            briefly: chkBriefly.value,
            brieflyType: ddBrieflyType.selection.index
        };
        saveSettings(currentSettings, true);
    };
    
    var grpTemplate = win.add("group", undefined);
    grpTemplate.orientation = "column";
    grpTemplate.margins = [0,-10,0,0];
    var txtTemplate = grpTemplate.add("edittext", undefined, "(Template for renaming)O_T.i", {multiline: false, scrolling: false}); // Установлено значение по умолчанию
    txtTemplate.alignment = ["fill", "top"];
    txtTemplate.margins = [0,-10,0,0];
    txtTemplate.onChanging = function() {
        updatePreview();
        updateLayerCounts();
        resetRenameButtonIcon();
    };
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
    txtTemplate.addEventListener("keydown", function(event) {
    if (event.keyName === "Enter") {
        var selectedPreset = ddLayerMode.selection;
        if (selectedPreset) {
            var presetTemplate = selectedPreset.text;
            
            // Загрузить текущие настройки
            var settings = loadSettings();
            var userPresets = settings.userPresets || {};
            
            // Найти ключ пресета с соответствующим шаблоном
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
                     
    // Установить ширину выпадающего списка после создания txtTemplate
    win.onShow = function() {
        ddLayerMode.size = [txtTemplate.size[0], ddLayerMode.size[1]];
    };

    var txtOriginalLabel = win.add("statictext", undefined, "Input layer name: ");
    txtOriginalLabel.maximumSize.height = 8;
    var txtOriginal = win.add("edittext", undefined, "", {readonly: true});
    txtOriginal.alignment = ["fill", "top"];
    txtOriginal.margins = [0,-10,0,0];

    var txtRenamedLabel = win.add("statictext", undefined, "Template result: ");
    txtRenamedLabel.maximumSize.height = 8;
    var txtRenamed = win.add("edittext", undefined, "", {readonly: true});
    txtRenamed.alignment = ["fill", "top"];
    txtRenamed.margins = [0,-10,0,0];

    var grpBriefly = win.add("group", undefined);
    grpBriefly.orientation = "row";
    var chkBriefly = grpBriefly.add("checkbox", undefined, "Briefly");
    var ddBrieflyType = grpBriefly.add("dropdownlist", undefined, ["Camel Case", "Pascal Case", "Snake Case", "Kebab Case", "Screaming Snake Case", "This Comp"]);
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

    var grpButtons = win.add("group", undefined);
    grpButtons.orientation = "row";
    grpButtons.margins = [0,-10,0,0];

    var btnRename = grpButtons.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/renameIcon.png"), { style: "toolbutton" });
    btnRename.size = [32, 32]; // Установить размер кнопки
    btnRename.imageSize = [24, 24]; // Установить размер изображения

    var btnHelp = grpButtons.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/helpIcon.png"), { style: "toolbutton" });
    btnHelp.size = [32, 32]; // Установить размер кнопки
    btnHelp.imageSize = [24, 24]; // Установить размер изображения

    var btnVariables = grpButtons.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/variablesIcon.png"), { style: "toolbutton" });
    btnVariables.size = [32, 32]; // Установить размер кнопки
    btnVariables.imageSize = [24, 24]; // Установить размер изображения

    var btnReset = grpButtons.add("iconbutton", undefined, File(scriptFolderPath + "/NitroNamer/img/resetIcon.png"), { style: "toolbutton" });
    btnReset.size = [32, 32]; // Установить размер кнопки
    btnReset.imageSize = [24, 24]; // Установить размер изображения

    function resetRenameButtonIcon() {
        btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIcon.png");
        btnRename.imageSize = [24, 24];
    }

    // Обработчики событий для кнопки переименования
    btnRename.addEventListener("mouseover", function() {
        btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIconHover.png");
        btnRename.imageSize = [24, 24];
    });
    btnRename.addEventListener("mouseout", function() {
        btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIcon.png");
        btnRename.imageSize = [24, 24];
    });

    // Обработчики событий для кнопки помощи
    btnHelp.addEventListener("mouseover", function() {
        btnHelp.image = File(scriptFolderPath + "/NitroNamer/img/helpIconHover.png");
        btnHelp.imageSize = [24, 24];
    });
    btnHelp.addEventListener("mouseout", function() {
        btnHelp.image = File(scriptFolderPath + "/NitroNamer/img/helpIcon.png");
        btnHelp.imageSize = [24, 24];
    });

    // Обработчики событий для кнопки сброса
    btnReset.addEventListener("mouseover", function() {
        btnReset.image = File(scriptFolderPath + "/NitroNamer/img/resetIconHover.png");
        btnReset.imageSize = [24, 24];
    });
    btnReset.addEventListener("mouseout", function() {
        btnReset.image = File(scriptFolderPath + "/NitroNamer/img/resetIcon.png");
        btnReset.imageSize = [24, 24];
    });

    // Обработчики событий для кнопки переменных
    btnVariables.addEventListener("mouseover", function() {
        btnVariables.image = File(scriptFolderPath + "/NitroNamer/img/variablesIconHover.png");
        btnVariables.imageSize = [24, 24];
    });
    btnVariables.addEventListener("mouseout", function() {
        btnVariables.image = File(scriptFolderPath + "/NitroNamer/img/variablesIcon.png");
        btnVariables.imageSize = [24, 24];
    });
    btnVariables.onClick = function() {
        showVariables();
    };

    btnSave.onClick = function() {
        var settings = {
            allLayers: rdoAllLayers.value,
            template: txtTemplate.text,
            briefly: chkBriefly.value,
            brieflyType: ddBrieflyType.selection.index
        };
    
        // Проверка на пустой шаблон
        if (!settings.template.trim()) {
            alert("Template cannot be empty.");
            return;
        }
    
        // Загрузить текущие настройки
        var existingSettings = loadSettings();
        var userPresets = existingSettings.userPresets || {};
    
        // Проверка на уникальность шаблона
        for (var key in userPresets) {
            if (userPresets.hasOwnProperty(key) && userPresets[key].template === settings.template) {
                alert("A preset with this template already exists.");
                return;
            }
        }
    
        saveSettings(settings, false);
    
        // Обновить список пресетов
        var updatedSettings = loadSettings();
        updatePresetsDropdown(updatedSettings);
    };            
    
    btnCircleMinus.onClick = function() {
        var selectedPreset = ddLayerMode.selection;
        if (selectedPreset && selectedPreset.text !== "Save your new preset" && selectedPreset.text !== "Please select a preset to delete") {
            var presetTemplate = selectedPreset.text;
    
            // Сохранить текущее значение полей ввода шаблона и результата
            var currentTemplateText = txtTemplate.text;
            var currentResultText = txtRenamed.text;
    
            // Загрузить текущие настройки
            var settings = loadSettings();
            var userPresets = settings.userPresets || {};
    
            // Найти ключ пресета с соответствующим шаблоном и удалить его
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
    
            // Обновить настройки
            settings.userPresets = newUserPresets;
    
            // Сохранить обновленные настройки
            var scriptFile = new File($.fileName);
            var scriptFolderPath = scriptFile.path + "/NitroNamer/settings";
            var settingsFile = new File(scriptFolderPath + "/settings.json");
    
            settingsFile.encoding = "UTF-8"; // Устанавливаем кодировку UTF-8
            settingsFile.open("w");
            settingsFile.write(JSON.stringify(settings, null, 4));
            settingsFile.close();
    
            // Обновить список пресетов
            updatePresetsDropdown(settings);
    
            // Восстановить значения полей ввода шаблона и результата
            txtTemplate.text = currentTemplateText;
            txtRenamed.text = currentResultText;
        } else {
            updatePresetsDropdown(loadSettings());
        }
    };               

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

    btnHelp.onClick = function() {
        showHelp();
        updateLayerCounts();
    };

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

    // Добавить функции для работы с JSON с логированием
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
    
        if (isCurrent) {
            currentSettings = settings;
        } else {
            var nextPresetNumber = Object.keys(userPresets).length + 1;
            var uniqueKey = "preset_" + nextPresetNumber;
            userPresets[uniqueKey] = settings;
        }
    
        existingSettings.userPresets = userPresets;
        existingSettings.currentSettings = currentSettings;
    
        settingsFile.encoding = "UTF-8"; // Устанавливаем кодировку UTF-8
        settingsFile.open("w");
        settingsFile.write(JSON.stringify(existingSettings, null, 4));
        settingsFile.close();
    }            
    
    function loadSettings() {
        var scriptFile = new File($.fileName);
        var scriptFolderPath = scriptFile.path + "/NitroNamer/settings";
        var settingsFile = new File(scriptFolderPath + "/settings.json");
    
        if (settingsFile.exists) {
            settingsFile.open("r");
            var settings = JSON.parse(settingsFile.read());
            settingsFile.close();
            return settings;
        }
    
        return {};
    }
    
    function applySettings(settings) {
        if (settings && settings.userPresets && Object.keys(settings.userPresets).length > 0) {
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
        } else if (settings && settings.currentSettings) {
            rdoAllLayers.value = settings.currentSettings.allLayers;
            rdoOnlySelected.value = !settings.currentSettings.allLayers;
            txtTemplate.text = settings.currentSettings.template || "(Template for renaming)O_T.i";
            chkBriefly.value = settings.currentSettings.briefly;
            ddBrieflyType.selection = settings.currentSettings.brieflyType || 0;
    
            updateLayerCounts();
            updatePreview();
            resetRenameButtonIcon();
        }
    
        // Обновить список пресетов
        updatePresetsDropdown(settings);
    
        // Установить сохраненный выбор пресета
        if (settings.currentSettings && typeof settings.currentSettings.selectedPresetIndex !== 'undefined') {
            ddLayerMode.selection = settings.currentSettings.selectedPresetIndex;
        } else {
            ddLayerMode.selection = 0; // Выбрать первый элемент, если нет сохраненного выбора
        }
    }    
    
    function updatePresetsDropdown(settings) {
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
    
        // Установить сохраненный выбор пресета
        if (settings.currentSettings && typeof settings.currentSettings.selectedPresetIndex !== 'undefined') {
            ddLayerMode.selection = settings.currentSettings.selectedPresetIndex;
        } else {
            ddLayerMode.selection = 0; // Выбрать первый элемент, если нет сохраненного выбора
        }
    }        

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

    function updatePreview() {
        var proj = app.project;
        if (proj) {
            var comp = proj.activeItem;
            if (comp && comp instanceof CompItem && comp.numLayers > 0) { // Добавлена проверка на наличие слоев
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
                } else {
                    txtOriginal.text = "No layers in composition.";
                    txtRenamed.text = "No layers in composition.";
                }
            } else {
                txtOriginal.text = "No composition selected.";
                txtRenamed.text = "No composition selected.";
            }
        } else {
            txtOriginal.text = "No project open.";
            txtRenamed.text = "No project open.";
        }
    }        

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
    
        if (briefly) {
            frameRate = parseFloat(frameRate).toFixed(2); // Ensure frame rate is formatted correctly
        }
    
        var variables = {
            "T": getLayerType(layer),
            "i": layer.index,
            "I": localIndex,
            "O": layer.name,
            "E": effectsString,
            "F": frameRate,
            "R": getResolution(layer),
            "D": duration,
            "Dd": shortDuration,
            "Ddd": mediumDuration,
            "C": compName,
            "Ip": layer.inPoint.toFixed(2),  // In point
            "Op": layer.outPoint.toFixed(2), // Out point
            "M": getSourceName(layer),       // Добавлено
            "W": getWidth(layer),            // Добавлено
            "H": getHeight(layer)            // Добавлено
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
                    

    function toCamelCase(str) {
        return str.split(/(\d+\.\d{2}|\d{2}:\d{2}:\d{2}|\d+min\.\d+sec|\d+min\.\d{2}sec)/).map(function(part, index) {
            if (index % 2 === 0) {
                return part.replace(/(?:^\w|[A-Z]|\b\w|\s+|_)/g, function(match, index) {
                    if (+match === 0) return "";
                    return index === 0 ? match.toLowerCase() : match.toUpperCase();
                });
            }
            return part;
        }).join('');
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

    function toThisComp(str) {
        var compName = app.project.activeItem.name;
        return "[" + compName + "] " + str;
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
        if (layer.source && layer.source.duration) {
            var duration = layer.source.duration;
            var hours = Math.floor(duration / 3600);
            var minutes = Math.floor((duration % 3600) / 60);
            var seconds = Math.floor(duration % 60);
            return (hours < 10 ? "0" + hours : hours) + ":" +
                   (minutes < 10 ? "0" + minutes : minutes) + ":" +
                   (seconds < 10 ? "0" + seconds : seconds);
        }
        return "NoLimit";
    }

    function getShortDuration(layer) {
        if (layer.source && layer.source.duration) {
            var seconds = Math.floor(layer.source.duration);
            return seconds + "Sec";
        }
        return "NoLimit";
    }

    function getMediumDuration(layer) {
        if (layer.source && layer.source.duration) {
            var duration = layer.source.duration;
            var minutes = Math.floor(duration / 60);
            var seconds = Math.floor(duration % 60);
            return minutes + "min." + (seconds < 10 ? "0" + seconds : seconds) + "sec";
        }
        return "NoLimit";
    }

    function getSourceName(layer) {
        if (layer.source) {
            return layer.source.name;
        }
        return "NoSource";
    }
    
    function getWidth(layer) {
        if (layer.source && layer.source.width) {
            return layer.source.width.toString();
        }
        return "NoWidth";
    }
    
    function getHeight(layer) {
        if (layer.source && layer.source.height) {
            return layer.source.height.toString();
        }
        return "NoHeight";
    }

    function replaceVariables(template, variables) {
        return template.replace(/\(([^()]+)\)|E\{([^}]+)\}|Ip|Op|Dd{0,2}|[A-Z]|i|I|M|W|H/g, function(match, group, customDelimiter) {
            if (group) {
                return group;  // Handle text inside parentheses
            } else if (customDelimiter !== undefined) {
                // Handle the custom delimiter for E
                var effectsString = variables['E'].split(', ').join(customDelimiter);
                return effectsString;
            } else if (match === 'Ip') {
                return variables['Ip'];
            } else if (match === 'Op') {
                return variables['Op'];
            } else if (match === 'Dd') {
                return variables['Dd'];
            } else if (match === 'Ddd') {
                return variables['Ddd'];
            } else {
                return variables[match] !== undefined ? variables[match] : match;
            }
        });
    }        

    var localIndex = 1; // Глобальный локальный индекс

    function renameLayersByTemplate(allLayers, template, briefly, brieflyType) {
        var proj = app.project;
    
        if (proj) {
            var comp = proj.activeItem;
    
            if (comp && comp instanceof CompItem) {
                app.beginUndoGroup("Rename Layers by Template");
    
                // Сброс локального индекса перед переименованием
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
    
                        var variables = {
                            "T": getLayerType(layer),
                            "i": i,
                            "I": localIndex,  // Используем локальный индекс
                            "O": layer.name,
                            "E": effectsString,
                            "F": getFrameRate(layer),
                            "R": getResolution(layer),
                            "D": getDuration(layer),
                            "Dd": getShortDuration(layer),
                            "Ddd": getMediumDuration(layer),
                            "C": compName,
                            "Ip": layer.inPoint.toFixed(2),  // In point
                            "Op": layer.outPoint.toFixed(2), // Out point
                            "M": getSourceName(layer),       // Добавлено
                            "W": getWidth(layer),            // Добавлено
                            "H": getHeight(layer)            // Добавлено
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
    
                        // Увеличиваем локальный индекс после переименования слоя
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

    // Функция отображения текущих переменных для выбранного слоя
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
                        "Op": layer.outPoint.toFixed(2)
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

    // Функция получения списка эффектов слоя
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