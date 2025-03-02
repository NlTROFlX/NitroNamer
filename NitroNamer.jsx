#include "json2.js";

if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {
        if (this === null || this === undefined) {
            throw new TypeError('Array.prototype.map called on null or undefined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        var T = thisArg || undefined;
        var A = new Array(len);
        for (var i = 0; i < len; i++) {
            if (i in O) {
                A[i] = callback.call(T, O[i], i, O);
            }
        }
        return A;
    };
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function(callback, thisArg) {
        if (this === null || this === undefined) {
            throw new TypeError('Array.prototype.filter called on null or undefined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        var T = thisArg || undefined;
        var res = [];
        for (var i = 0; i < len; i++) {
            if (i in O) {
                var val = O[i];
                if (callback.call(T, val, i, O)) {
                    res.push(val);
                }
            }
        }
        return res;
    };
}

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
        if (this === null || this === undefined) {
            throw new TypeError('Array.prototype.forEach called on null or undefined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (typeof callback !== "function") {
            throw new TypeError(callback + " is not a function");
        }
        var T = thisArg || undefined;
        for (var i = 0; i < len; i++) {
            if (i in O) {
                callback.call(T, O[i], i, O);
            }
        }
    };
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        if (this === null) {
            throw new TypeError('"this" is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = +fromIndex || 0;
        if (Math.abs(n) === Infinity) {
            n = 0;
        }
        if (n >= len) {
            return -1;
        }
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

var incrementValues = {};
var localIndex = 0;

function buildUI(thisObj) {
	var scriptMessageHead_1 = "NitroNamer 2025.1 - dev";
	var defaultTemplatePreset1 = "[LayerName].i"
	var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptMessageHead_1, undefined, {
		resizeable: !0
	});
	var globalWidthSizeElements = 310;
	var globalWidthSizeElementsCorrect = 14;
	var globalHeightSizeElementsMax = 376;
	var globalHeightSizeElementsMin = 146;
	var globalSpacingElements = 4;
	win.orientation = "column";
	win.alignChildren = ["fill", "top"];
	win.active = !0;
	win.margins = [0, 0, 0, 0];
	win.layout.layout(!0);
	var grpLayerSelection = win.add("group", undefined);
	grpLayerSelection.orientation = "row";
	grpLayerSelection.maximumSize.width = globalWidthSizeElements;
	grpLayerSelection.alignChildren = ["fill", "left"];
	grpLayerSelection.margins = [4, 0, 0, 0];
	grpLayerSelection.spacing = 0;
	var rdoAllLayers = grpLayerSelection.add("radiobutton", undefined, "Total: ");
	rdoAllLayers.value = !0;
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
	var btnCopy = grpLayerSelection.add("image", undefined, File(scriptFolderPath + "/NitroNamer/img/copy.png"));
	btnCopy.size = [24, 24];
	btnCopy.alignment = ["right", "center"];
	var btnFavorites = grpLayerSelection.add("image", undefined, File(scriptFolderPath + "/NitroNamer/img/favorites.png"));
	btnFavorites.size = [24, 24];
	btnFavorites.alignment = ["right", "center"];
	var btnSave = grpLayerSelection.add("image", undefined, File(scriptFolderPath + "/NitroNamer/img/save.png"));
	btnSave.size = [24, 24];
	btnSave.alignment = ["right", "center"];
	var btnCircleMinus = grpLayerSelection.add("image", undefined, File(scriptFolderPath + "/NitroNamer/img/delete.png"));
	btnCircleMinus.size = [24, 24];
	btnCircleMinus.alignment = ["right", "center"];
	var btnMinimize = grpLayerSelection.add("image", undefined, File(scriptFolderPath + "/NitroNamer/img/favorites.png"));
	btnMinimize.size = [24, 24];
	btnMinimize.alignment = ["right", "center"];

	function handleMouseOverMaximize() {
		btnMinimize.image = File(scriptFolderPath + "/NitroNamer/img/maximizeHover.png")
	}

	function handleMouseOutMaximize() {
		btnMinimize.image = File(scriptFolderPath + "/NitroNamer/img/maximize.png")
	}

	function handleMouseOverMinimize() {
		btnMinimize.image = File(scriptFolderPath + "/NitroNamer/img/minimizeHover.png")
	}

	function handleMouseOutMinimize() {
		btnMinimize.image = File(scriptFolderPath + "/NitroNamer/img/minimize.png")
	}
	var settings = loadSettings();
	var userPresets = settings.userPresets || {};
	var presetTemplates = [];
	for (var key in userPresets) {
		if (userPresets.hasOwnProperty(key)) {
			presetTemplates.push(userPresets[key].template)
		}
	}
	var modes = ["chart", "date", "longArrowDown", "longArrowUp", "favorites", "search"];
	var currentModeIndex = 0;
	var isActive = !1;
	var isMouseOverButton = !1;
	var grpDropdownAndButtons = win.add("group", undefined);
	grpDropdownAndButtons.orientation = "row";
	grpDropdownAndButtons.alignment = ["fill", "top"];
	grpDropdownAndButtons.margins = [0, -10, 0, 0];
	grpDropdownAndButtons.spacing = globalSpacingElements;
	var btnModeSwitch = grpDropdownAndButtons.add("image", undefined, File(scriptFolderPath + "/NitroNamer/img/" + modes[0] + ".png"));
	btnModeSwitch.size = [24, 24];
	btnModeSwitch.alignment = ["left", "center"];

	function updateModeSwitchTooltip() {
		var currentMode = modes[currentModeIndex];
		var tooltip = getTooltip("btnModeSwitch", currentMode);
		btnModeSwitch.helpTip = tooltip
	}
	updateModeSwitchTooltip();
	var ddLayerMode = grpDropdownAndButtons.add("dropdownlist", undefined, presetTemplates);
	ddLayerMode.minimumSize.width = globalWidthSizeElements - 42;
	ddLayerMode.maximumSize.width = globalWidthSizeElements - 42;
	ddLayerMode.selection = 0;
	ddLayerMode.onChange = function () {
		var selectedPreset = ddLayerMode.selection;
		if (selectedPreset) {
			var presetTemplate = selectedPreset.text;
			var settings = loadSettings();
			var userPresets = settings.userPresets || {};
			for (var key in userPresets) {
				if (userPresets.hasOwnProperty(key) && userPresets[key].template === presetTemplate) {
					var preset = userPresets[key];
					if (preset.hasOwnProperty('usageFrequency')) {
						preset.usageFrequency += 1
					} else {
						preset.usageFrequency = 1
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
					saveSettings(currentSettings, !0);
					updateFavoritesButtonIcon(preset.favoritesTemplate);
					updatePresetsDropdown(settings);
					break
				}
			}
		}
	};
	btnModeSwitch.addEventListener("click", function () {
		var isAltPressed = ScriptUI.environment.keyboardState.altKey;
		var isCtrlPressed = ScriptUI.environment.keyboardState.ctrlKey;
		if (isAltPressed) {
			isActive = !isActive
		} else if (isCtrlPressed) {
			currentModeIndex = (currentModeIndex - 1 + modes.length) % modes.length;
			if (isActive) {
				isActive = !1
			}
		} else {
			currentModeIndex = (currentModeIndex + 1) % modes.length;
			if (isActive) {
				isActive = !1
			}
		}
		updateModeButtonIcon();
		updateModeSwitchTooltip();
		saveCurrentSettings();
		updatePresetsDropdown(loadSettings())
	});
	btnModeSwitch.addEventListener("mouseover", function () {
		isMouseOverButton = !0;
		updateModeButtonIcon();
		updateModeSwitchTooltip()
	});
	btnModeSwitch.addEventListener("mouseout", function () {
		isMouseOverButton = !1;
		updateModeButtonIcon();
		updateModeSwitchTooltip()
	});

	function updateModeButtonIcon() {
		var mode = modes[currentModeIndex];
		var iconFilename;
		if (isActive) {
			iconFilename = mode + "Hover.png"
		} else if (isMouseOverButton) {
			iconFilename = mode + "ModeHover.png"
		} else {
			iconFilename = mode + ".png"
		}
		btnModeSwitch.image = File(scriptFolderPath + "/NitroNamer/img/" + iconFilename);
		btnModeSwitch.imageSize = [24, 24]
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
		saveSettings(currentSettings, !0)
	}

	function handleRadioButtonClick() {
		if (this === rdoAllLayers) {
			rdoAllLayers.value = !0;
			rdoOnlySelected.value = !1
		} else if (this === rdoOnlySelected) {
			rdoAllLayers.value = !1;
			rdoOnlySelected.value = !0
		}
		updateLayerCounts();
		updatePreview();
		resetRenameButtonIcon();
		saveCurrentSettings();
		var isShiftPressed = ScriptUI.environment.keyboardState.shiftKey;
		if (isShiftPressed) {
			var scriptFolderPath = new File($.fileName).path;
			var nnNameApplyPath = File(scriptFolderPath + "/NitroNamer/settings/NNNameApply.jsx");
			if (nnNameApplyPath.exists) {
				$.evalFile(nnNameApplyPath)
			} else {
				alert("Script NNNameApply.jsx not found at " + nnNameApplyPath.fsName, scriptMessageHead_1)
			}
		}
	}
	rdoAllLayers.onClick = handleRadioButtonClick;
	rdoOnlySelected.onClick = handleRadioButtonClick;

	function trim(str) {
		return str.replace(/^\s+|\s+$/g, '')
	}

	function updateRenameButtonIcon() {
		var templateText = txtTemplate.text;
		if (trim(templateText) === "") {
			btnRename.image = warningIcon;
			btnRename.imageSize = [24, 24];
			btnRename.enabled = !1
		} else {
			resetRenameButtonIcon();
			btnRename.enabled = !0
		}
	}
	var grpTemplate = win.add("group", undefined);
	grpTemplate.orientation = "column";
	grpTemplate.margins = [0, -10, 0, 0];
	grpTemplate.spacing = globalSpacingElements;
	var txtTemplate = grpTemplate.add("edittext", undefined, defaultTemplatePreset1, {
		multiline: !1,
		scrolling: !1
	});
	txtTemplate.alignment = ["fill", "top"];
	txtTemplate.margins = [0, -10, 0, 0];
	txtTemplate.maximumSize.width = globalWidthSizeElements;
	txtTemplate.addEventListener("click", function () {
		checkAndUpdateSettings()
	});
	txtTemplate.onChanging = function () {
		checkAndUpdateSettings();
		updatePreview();
		updateLayerCounts();
		updateRenameButtonIcon();
		if (isActive && modes[currentModeIndex] === "search") {
			updatePresetsDropdown(loadSettings())
		}
	};
	txtTemplate.onChange = function () {
		checkAndUpdateSettings();
		var currentSettings = {
			allLayers: rdoAllLayers.value,
			template: txtTemplate.text,
			briefly: chkBriefly.value,
			brieflyType: ddBrieflyType.selection.index
		};
		saveSettings(currentSettings, !0);
		updatePreview();
		updateLayerCounts();
		resetRenameButtonIcon();
		updateRenameButtonIcon();
		if (isActive && modes[currentModeIndex] === "search") {
			updatePresetsDropdown(loadSettings())
		}
	};
	txtTemplate.addEventListener("keydown", function (event) {
		if (event.keyName === "Enter") {
			if (event.altKey) {
				if (!btnRename.enabled) return;
				var allLayers = rdoAllLayers.value;
				var template = txtTemplate.text;
				var briefly = chkBriefly.value;
				var brieflyType = ddBrieflyType.selection.text;
				var isCtrlPressed = ScriptUI.environment.keyboardState.ctrlKey;
				var isShiftPressed = ScriptUI.environment.keyboardState.shiftKey;
				var includeShyLayers = isCtrlPressed && isShiftPressed;
				var reverseOrder = false;
				renameLayersByTemplate(allLayers, template, briefly, brieflyType, includeShyLayers, reverseOrder, isCtrlPressed, isShiftPressed, false, false);
				updateLayerCounts();
				updatePreview();
				var scriptFile = new File($.fileName);
				var scriptFolderPath = scriptFile.path;
				btnRename.image = File(scriptFolderPath + "/NitroNamer/img/doneIcon.png");
				btnRename.imageSize = [24, 24];
			} else {
				var selectedPresetItem = ddLayerMode.selection;
				if (selectedPresetItem && selectedPresetItem.preset) {
					var preset = selectedPresetItem.preset;
					txtTemplate.text = preset.template;
					if (preset.hasOwnProperty('usageFrequency')) {
						preset.usageFrequency += 1;
					} else {
						preset.usageFrequency = 1;
					}
					var settings = loadSettings();
					var userPresets = settings.userPresets || {};
					for (var key in userPresets) {
						if (userPresets.hasOwnProperty(key) && userPresets[key].template === preset.template) {
							userPresets[key] = preset;
							break;
						}
					}
					settings.userPresets = userPresets;
					var scriptFile = new File($.fileName);
					var scriptFolderPath = scriptFile.path + "/NitroNamer/settings";
					var settingsFile = new File(scriptFolderPath + "/settings.json");
					writeJSONFile(settingsFile, settings);
					rdoAllLayers.value = preset.allLayers;
					rdoOnlySelected.value = !preset.allLayers;
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
				} else {
					alert("Нет выбранного пресета для применения.", scriptMessageHead_1);
				}
			}
		}
	});

	win.onShow = function () {
		ddLayerMode.size = [txtTemplate.size[0], ddLayerMode.size[1]]
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
	var txtOriginal = grpTextFields.add("edittext", undefined, "", {
		readonly: !0
	});
	txtOriginal.alignment = ["left", "top"];
	txtOriginal.margins = [0, -10, 0, 0];
	var txtRenamedLabel = grpTextFields.add("statictext", undefined, "Template result for layer(s): ");
	txtRenamedLabel.maximumSize.height = 14;
	txtRenamedLabel.margins = [0, -10, 0, 0];
	var txtRenamed = grpTextFields.add("edittext", undefined, "", {
		readonly: !0
	});
	txtRenamed.alignment = ["left", "top"];
	txtRenamed.margins = [0, -10, 0, 0];
	var txtRenamedCompact;
	var grpBriefly = win.add("group", undefined);
	grpBriefly.orientation = "row";
	grpBriefly.alignChildren = ["right", "center"];
	grpBriefly.spacing = grpTextFields;
	grpBriefly.margins = [0, 0, 0, 0];
	var btnRename = grpBriefly.add("image", undefined, File(scriptFolderPath + "/NitroNamer/img/renameIcon.png"));
	var warningIcon = File(scriptFolderPath + "/NitroNamer/img/warning.png");
	var warningIconHover = File(scriptFolderPath + "/NitroNamer/img/warningHover.png");
	btnRename.size = [24, 24];
	btnRename.alignment = ["left", "center"];
	var btnVariables = grpBriefly.add("image", undefined, File(scriptFolderPath + "/NitroNamer/img/variablesIcon.png"));
	btnVariables.size = [24, 24];
	btnVariables.alignment = ["left", "center"];
	var btnHelp = grpBriefly.add("image", undefined, File(scriptFolderPath + "/NitroNamer/img/helpIcon.png"));
	btnHelp.size = [24, 24];
	btnHelp.alignment = ["left", "center"];
	var btnReset = grpBriefly.add("image", undefined, File(scriptFolderPath + "/NitroNamer/img/resetIcon.png"));
	btnReset.size = [24, 24];
	btnReset.alignment = ["left", "center"];
	var btnSettings = grpBriefly.add("image", undefined, File(scriptFolderPath + "/NitroNamer/img/settings.png"));
	btnSettings.size = [24, 24];
	btnSettings.alignment = ["left", "center"];
	var chkBriefly = grpBriefly.add("checkbox", undefined);
	var ddBrieflyType = grpBriefly.add("dropdownlist", undefined, ["Camel Case", "Pascal Case", "Snake Case", "Kebab Case", "Screaming Snake Case"]);
	ddBrieflyType.maximumSize.width = 150;
	ddBrieflyType.selection = 0;
	chkBriefly.onClick = function () {
		saveSettings({ allLayers: rdoAllLayers.value, template: txtTemplate.text, briefly: chkBriefly.value, brieflyType: ddBrieflyType.selection.index }, !0);
		updatePreview();
		updateLayerCounts();
		updateRenameButtonIcon();
	}
	ddBrieflyType.onChange = function () {
		var currentSettings = {
			allLayers: rdoAllLayers.value,
			template: txtTemplate.text,
			briefly: chkBriefly.value,
			brieflyType: ddBrieflyType.selection.index
		};
		saveSettings(currentSettings, !0);
		updatePreview();
		updateLayerCounts();
		resetRenameButtonIcon()
	};
	grpBriefly.margins = [0, -10, 0, 0];

	function resetRenameButtonIcon() {
		btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIcon.png");
		btnRename.imageSize = [24, 24]
	}

	function addHoverEffect(button, iconPath) {
		button.addEventListener("mouseover", function () {
			button.image = File(iconPath + "Hover.png");
			button.imageSize = [24, 24]
		});
		button.addEventListener("mouseout", function () {
			button.image = File(iconPath + ".png");
			button.imageSize = [24, 24]
		})
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
	btnRename.addEventListener("mouseover", function () {
		checkAndUpdateSettings();
		updatePreview();
		updateLayerCounts();
		var isCtrlPressed = ScriptUI.environment.keyboardState.ctrlKey;
		var isShiftPressed = ScriptUI.environment.keyboardState.shiftKey;
		if (trim(txtTemplate.text) === "") {
			btnRename.image = warningIconHover
		} else if (isCtrlPressed) {
			btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIconHoverAfter.png")
		} else if (isShiftPressed) {
			btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIconHoverBefore.png")
		} else {
			btnRename.image = File(scriptFolderPath + "/NitroNamer/img/renameIconHover.png")
		}
		btnRename.imageSize = [24, 24]
	});
	btnRename.addEventListener("mouseout", function () {
		updateRenameButtonIcon()
	});
	btnVariables.addEventListener("click", function() {
		var commandID = app.findMenuCommandId("NitroNamer Library");
		if (commandID !== 0) {
			app.executeCommand(commandID);
		} else {
			alert("Extension panel not found.", scriptMessageHead_1);
		}
	});
	btnCopy.addEventListener("click", function () {
		var proj = app.project;
		if (proj && proj.activeItem instanceof CompItem) {
			var comp = proj.activeItem;
			var layer = null;
			if (comp.selectedLayers.length > 0) {
				layer = comp.selectedLayers[0]
			} else if (comp.numLayers > 0) {
				layer = comp.layer(1)
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
				saveSettings(currentSettings, !0)
			} else {
				alert("No layers in the composition.", scriptMessageHead_1)
			}
		} else {
			alert("Please select a valid composition.", scriptMessageHead_1)
		}
	});
	btnFavorites.addEventListener("click", function () {
		var selectedPreset = ddLayerMode.selection;
		if (selectedPreset && selectedPreset.preset) {
			var presetTemplate = selectedPreset.preset.template;
			var settings = loadSettings();
			var userPresets = settings.userPresets || {};
			for (var key in userPresets) {
				if (userPresets.hasOwnProperty(key) && userPresets[key].template === presetTemplate) {
					userPresets[key].favoritesTemplate = !userPresets[key].favoritesTemplate;
					btnFavorites.isFavorite = userPresets[key].favoritesTemplate;
					writeJSONFile(new File(scriptFolderPath + "/NitroNamer/settings/settings.json"), settings);
					updateFavoritesButtonIcon();
					break
				}
			}
		}
	});
	btnFavorites.addEventListener("mouseover", function () {
		btnFavorites.isMouseOver = !0;
		updateFavoritesButtonIcon()
	});
	btnFavorites.addEventListener("mouseout", function () {
		btnFavorites.isMouseOver = !1;
		updateFavoritesButtonIcon()
	});

	function updateFavoritesButtonIcon() {
		var iconPath = scriptFolderPath + "/NitroNamer/img/";
		if (btnFavorites.isMouseOver) {
			if (btnFavorites.isFavorite) {
				btnFavorites.image = File(iconPath + "favoritesHoverTemplateDelete.png")
			} else {
				btnFavorites.image = File(iconPath + "favoritesHoverTemplateAdd.png")
			}
		} else {
			if (btnFavorites.isFavorite) {
				btnFavorites.image = File(iconPath + "favoritesHoverTemplateAdd.png")
			} else {
				btnFavorites.image = File(iconPath + "favorites.png")
			}
		}
		btnFavorites.imageSize = [24, 24]
	}
	btnSave.addEventListener("click", function () {
		var settings = {
			allLayers: rdoAllLayers.value,
			template: txtTemplate.text,
			briefly: chkBriefly.value,
			brieflyType: ddBrieflyType.selection.index
		};
		if (!trim(settings.template)) {
			alert("Template cannot be empty.", scriptMessageHead_1);
			return
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
						break
					}
				}
			}
		} else {
			for (var key in userPresets) {
				if (userPresets.hasOwnProperty(key) && userPresets[key].template === settings.template) {
					alert("A preset with this template already exists.", scriptMessageHead_1);
					return
				}
			}
			var newPresetKey = saveSettings(settings, !1);
			var updatedSettings = loadSettings();
			updatePresetsDropdown(updatedSettings);
			var presetKeys = [];
			for (var key in updatedSettings.userPresets) {
				if (updatedSettings.userPresets.hasOwnProperty(key)) {
					presetKeys.push(key)
				}
			}
			var newPresetIndex = arrayIndexOf(presetKeys, newPresetKey);
			if (newPresetIndex !== -1) {
				ddLayerMode.selection = newPresetIndex
			}
			txtTemplate.text = settings.template;
			if (newPresetKey && updatedSettings.userPresets[newPresetKey]) {
				var newPreset = updatedSettings.userPresets[newPresetKey];
				updateFavoritesButtonIcon(newPreset.favoritesTemplate)
			}
		}
	});
	btnSave.addEventListener("mouseover", function () {
		if (ScriptUI.environment.keyboardState.shiftKey) {
			btnSave.image = File(scriptFolderPath + "/NitroNamer/img/refreshHover.png")
		} else {
			btnSave.image = File(scriptFolderPath + "/NitroNamer/img/saveHover.png")
		}
	});
	btnSave.addEventListener("mouseout", function () {
		btnSave.image = File(scriptFolderPath + "/NitroNamer/img/save.png")
	});
	btnCircleMinus.addEventListener("click", function () {
		var selectedItem = ddLayerMode.selection;
		var selectedPreset = ddLayerMode.selection;
		if (selectedItem && selectedPreset && selectedPreset.text !== "No presets saved or suitable presets.") {
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
						newUserPresets[newKey] = userPresets[key]
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
			saveSettings(currentSettings, !0);
			var selectedPreset = ddLayerMode.selection;
			if (selectedPreset) {
				var presetTemplate = selectedPreset.text;
				var settings = loadSettings();
				var userPresets = settings.userPresets || {};
				var isFavorite = !1;
				for (var key in userPresets) {
					if (userPresets.hasOwnProperty(key) && userPresets[key].template === presetTemplate) {
						var preset = userPresets[key];
						isFavorite = preset.favoritesTemplate || !1;
						break
					}
				}
				updateFavoritesButtonIcon(isFavorite)
			} else {
				updateFavoritesButtonIcon(!1)
			}
		} else {
			updatePresetsDropdown(loadSettings())
		}
	});
	btnMinimize.addEventListener("click", function () {
		var settings = loadSettings();
		var currentSettings = settings.currentSettings || {};
		var isCompact = !currentSettings.UICompact;
		currentSettings.UICompact = isCompact;
		settings.currentSettings = currentSettings;
		saveSettings(currentSettings, !0);
		setMinimizeButtonIcon(isCompact)
	});
	btnRename.addEventListener("click", function () {
		if (!btnRename.enabled) return;
		var allLayers = rdoAllLayers.value;
		var template = txtTemplate.text;
		var briefly = chkBriefly.value;
		var brieflyType = ddBrieflyType.selection.text;
		var isCtrlPressed = ScriptUI.environment.keyboardState.ctrlKey;
		var isShiftPressed = ScriptUI.environment.keyboardState.shiftKey;
		var isCtrlShiftPressed = isCtrlPressed && isShiftPressed;
		var includeShyLayers = isCtrlShiftPressed;
		var reverseOrder = !1;
		renameLayersByTemplate(allLayers, template, briefly, brieflyType, includeShyLayers, reverseOrder, isCtrlPressed, isShiftPressed, !1, !1);
		updateLayerCounts();
		updatePreview();
		btnRename.image = File(scriptFolderPath + "/NitroNamer/img/doneIcon.png");
		btnRename.imageSize = [24, 24]
	});
	btnHelp.addEventListener("click", function () {
		updateLayerCounts();
		var helpScriptPath = scriptFolderPath + "/NitroNamer/scripts/NNHelp.jsx";
		$.evalFile(helpScriptPath)
	});
	btnReset.addEventListener("click", function () {
		rdoAllLayers.value = !0;
		rdoOnlySelected.value = !1;
		txtTemplate.text = defaultTemplatePreset1;
		chkBriefly.value = !1;
		ddBrieflyType.selection = 0;
		updateLayerCounts();
		updatePreview();
		resetRenameButtonIcon()
	});
	btnSettings.addEventListener("click", function () {
		var settingsScriptPath = scriptFolderPath + "/NitroNamer/scripts/NNSettings.jsx";
		$.evalFile(settingsScriptPath)
	});

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
			txtOriginal.margins = [0, 0, 0, 0];
			txtRenamed.minimumSize.width = globalWidthSizeElements - 14;
			txtRenamed.margins = [0, 0, 0, 0];
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
			win.layout.layout(true);
			win.layout.resize();
		} else {
			btnMinimize.image = File(scriptFolderPath + "/NitroNamer/img/minimize.png");
			btnMinimize.addEventListener("mouseover", handleMouseOverMinimize);
			btnMinimize.addEventListener("mouseout", handleMouseOutMinimize);
			while (grpTextFields.children.length > 0) {
				grpTextFields.remove(grpTextFields.children[0])
			}
			txtOriginalLabel = grpTextFields.add("statictext", undefined, "The original name of the layer: ");
			txtOriginalLabel.maximumSize.height = 14;
			txtOriginalLabel.alignment = ["left", "top"];
			txtOriginalLabel.margins = [0, -100, 0, -100];
			txtOriginal = grpTextFields.add("edittext", undefined, "", {
				readonly: !0
			});
			txtOriginal.alignment = ["left", "top"];
			txtOriginal.minimumSize.width = globalWidthSizeElements - 14;
			txtOriginal.margins = [0, -100, 0, -100];
			txtRenamedLabel = grpTextFields.add("statictext", undefined, "Template result for layer(s): ");
			txtRenamedLabel.maximumSize.height = 14;
			txtRenamedLabel.alignment = ["left", "top"];
			txtRenamedLabel.margins = [0, -100, 0, -100];
			txtRenamed = grpTextFields.add("edittext", undefined, "", {
				readonly: !0
			});
			txtRenamed.alignment = ["left", "top"];
			txtRenamed.minimumSize.width = globalWidthSizeElements - 14;
			txtRenamed.margins = [0, -100, 0, -100];
			if (txtRenamedCompact) {
				txtRenamedCompact.visible = !1
			}
			updatePreview();
			win.minimumSize.height = globalHeightSizeElementsMin;
			win.maximumSize.height = globalHeightSizeElementsMax;
			win.minimumSize.width = globalWidthSizeElements - globalWidthSizeElementsCorrect;
			win.maximumSize.width = globalWidthSizeElements
		}
		win.layout.layout(!0);
		win.layout.resize()
	}

	function saveSettings(settings, isCurrent) {
		var scriptFile = new File($.fileName);
		var scriptFolderPath = scriptFile.path + "/NitroNamer/settings";
		var settingsFile = new File(scriptFolderPath + "/settings.json");
		if (!Folder(scriptFolderPath).exists) {
			Folder(scriptFolderPath).create()
		}
		var existingSettings = loadSettings() || {};
		var userPresets = existingSettings.userPresets || {};
		var currentSettings = existingSettings.currentSettings || {};
		var newPresetKey = null;
		if (isCurrent) {
			for (var key in settings) {
				if (settings.hasOwnProperty(key)) {
					currentSettings[key] = settings[key]
				}
			}
		} else {
			var presetSettings = settings;
			presetSettings.creationDate = new Date().getTime();
			presetSettings.usageFrequency = 0;
			presetSettings.favoritesTemplate = !1;
			var nextPresetNumber = 1;
			for (var key in userPresets) {
				if (userPresets.hasOwnProperty(key)) {
					nextPresetNumber++
				}
			}
			newPresetKey = "preset_" + nextPresetNumber;
			userPresets[newPresetKey] = presetSettings;
			var newUserPresets = {};
			newUserPresets[newPresetKey] = presetSettings;
			for (var key in userPresets) {
				if (key !== newPresetKey) {
					newUserPresets[key] = userPresets[key]
				}
			}
			userPresets = newUserPresets
		}
		existingSettings.userPresets = userPresets;
		existingSettings.currentSettings = currentSettings;
		writeJSONFile(settingsFile, existingSettings);
		return newPresetKey
	}

	function readJSONFile(filePath) {
		var file = new File(filePath);
		var data = {};
		if (file.exists) {
			file.open("r");
			try {
				data = eval("(" + file.read() + ")")
			} catch (e) {
				alert("Error parsing JSON file: " + filePath, scriptMessageHead_1)
			}
			file.close()
		}
		return data
	}

	function writeJSONFile(filePath, data) {
		var file = new File(filePath);
		file.encoding = "UTF-8";
		file.open("w");
		file.write(JSON.stringify(data, null, 4));
		file.close()
	}

	function checkNitroNamerLibraryFolder() {

		var baseExtensionsPath;
		if ($.os.toLowerCase().indexOf("mac") !== -1) {
			baseExtensionsPath = "/Library/Application Support/Adobe/CEP/extensions";
		} else {
			baseExtensionsPath = "C:\\Program Files (x86)\\Common Files\\Adobe\\CEP\\extensions";
		}

		var nnExtFolder = new Folder(baseExtensionsPath + "/nitronamer.library.ui");
		if (nnExtFolder.exists) {

			var nnClientSettingsFolder = new Folder(nnExtFolder.fsName + "/client/settings");
			if (!nnClientSettingsFolder.exists) {
				nnClientSettingsFolder.create();
			}

			var nnSettingsFile = new File(nnClientSettingsFolder.fsName + "/settings.json");
			var nnSettingsData = {};

			if (nnSettingsFile.exists) {
				nnSettingsFile.open("r");
				try {
					nnSettingsData = JSON.parse(nnSettingsFile.read());
				} catch (e) {
					nnSettingsData = {}; // Если JSON некорректен, начинаем с пустого объекта
				}
				nnSettingsFile.close();
			}

			var scriptFile = new File($.fileName);
			nnSettingsData.nnAeScriptUIPanelsPath = scriptFile.fsName;

			nnSettingsFile.open("w");
			nnSettingsFile.write(JSON.stringify(nnSettingsData, null, 4));
			nnSettingsFile.close();
			
			$.writeln("Папка nitronamer.library.ui обнаружена. Путь к NitroNamer.jsx записан в client/settings/settings.json");
		} else {
			$.writeln("Папка nitronamer.library.ui НЕ найдена по пути: " + nnExtFolder.fsName);
		}
	}

	function checkAndCreateSettingsFile() {
		var scriptFile = new File($.fileName);
		var scriptFolderPath = scriptFile.path + "/NitroNamer/settings";
		var settingsFile = new File(scriptFolderPath + "/settings.json");
		if (!settingsFile.exists) {
			var initialData = {
				"userPresets": {},
				"currentSettings": {
					"UICompact": !1
				}
			};
			settingsFile.encoding = "UTF-8";
			if (settingsFile.open("w")) {
				var jsonStr = JSON.stringify(initialData, null, 4);
				settingsFile.write(jsonStr);
				settingsFile.close()
			} else {
				alert("Error: Unable to create settings.json file.")
			}
		}
	}

	function checkAndCreateVariablesFile() {
		var scriptFile = new File($.fileName);
		var scriptFolderPath = scriptFile.path + "/NitroNamer/scripts";
		var variablesFile = new File(scriptFolderPath + "/variables.json");
		if (!variablesFile.exists) {
			var initialData = {
				"Np": {
					"defaultValue": "NoNestedPrecomps",
					"customValue": "Custom{Np}",
					"active": !1
				},
				"An": {
					"defaultValue": "NoAnimations",
					"customValue": "Custom{An}",
					"active": !1
				},
				"Ar": {
					"defaultValue": "NoAspectRatio",
					"customValue": "Custom{Ar}",
					"active": !1
				},
				"E": {
					"defaultValue": "No effects",
					"customValue": "Custom{E}",
					"active": !1
				},
				"F": {
					"defaultValue": "NoFrameRate",
					"customValue": "Custom{F}",
					"active": !1
				},
				"H": {
					"defaultValue": "NoHeight",
					"customValue": "Custom{H}",
					"active": !1
				},
				"Lexp": {
					"defaultValue": "NoExpressions",
					"customValue": "Custom{Lexp}",
					"active": !1
				},
				"Fext": {
					"defaultValue": "NoExtension",
					"customValue": "Custom{Fext}",
					"active": !1
				},
				"Lmc": {
					"defaultValue": "NoMasks",
					"customValue": "Custom{Lmc}",
					"active": !1
				},
				"Lmn": {
					"defaultValue": "NoMaskNames",
					"customValue": "Custom{Lmn}",
					"active": !1
				},
				"R": {
					"defaultValue": "NoResolution",
					"customValue": "Custom{R}",
					"active": !1
				},
				"Tm": {
					"defaultValue": "NoTrackMate",
					"customValue": "Custom{Tm}",
					"active": !1
				},
				"W": {
					"defaultValue": "NoWidth",
					"customValue": "Custom{W}",
					"active": !1
				}
			};
			variablesFile.encoding = "UTF-8";
			if (variablesFile.open("w")) {
				variablesFile.write(JSON.stringify(initialData, null, 4));
				variablesFile.close()
			} else {
				alert("Error: Unable to create variables.json file.", scriptMessageHead_1)
			}
		}
	}

	function loadSettings() {
		var scriptFile = new File($.fileName);
		var scriptFolderPath = scriptFile.path + "/NitroNamer/settings";
		var settingsFile = scriptFolderPath + "/settings.json";
		var settings = readJSONFile(settingsFile);
		if (!settings.currentSettings) {
			settings.currentSettings = {}
		}
		if (settings.currentSettings.UICompact === undefined) {
			settings.currentSettings.UICompact = !1
		}
		return settings
	}
	var variableSettings;
	var lastModifiedTime;

	function loadVariableSettings() {
		var scriptFile = new File($.fileName);
		var scriptFolderPath = scriptFile.path + "/NitroNamer/scripts";
		var variablesFile = scriptFolderPath + "/variables.json";
		return readJSONFile(variablesFile)
	}

	function getFileModifiedTime(filePath) {
		var file = new File(filePath);
		if (file.exists) {
			return file.modified
		}
		return null
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
			filterList = maskFilter.split(',').map(function (item) {
				return item.trim()
			})
		}
		if (layer.mask && layer.mask.numProperties > 0) {
			for (var i = 1; i <= layer.mask.numProperties; i++) {
				var mask = layer.mask.property(i);
				var includeMask = !1;
				if (filterList) {
					for (var j = 0; j < filterList.length; j++) {
						var filterItem = filterList[j];
						if (mask.name.trim().toLowerCase() === filterItem.trim().toLowerCase()) {
							includeMask = !0;
							break
						}
						var lowerFilterItem = filterItem.trim().toLowerCase();
						if (maskModes.hasOwnProperty(lowerFilterItem)) {
							if (mask.maskMode === maskModes[lowerFilterItem]) {
								includeMask = !0;
								break
							}
						}
					}
				} else {
					includeMask = !0
				}
				if (includeMask) {
					maskCount++
				}
			}
			return maskCount.toString()
		} else {
			if (settings && settings.Lmc) {
				return settings.Lmc.active ? settings.Lmc.customValue : settings.Lmc.defaultValue
			} else {
				return "NoMasks"
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
			filterList = maskFilter.split(',').map(function (item) {
				return item.trim()
			})
		}
		if (layer.mask && layer.mask.numProperties > 0) {
			for (var i = 1; i <= layer.mask.numProperties; i++) {
				var mask = layer.mask.property(i);
				var includeMask = !1;
				if (filterList) {
					for (var j = 0; j < filterList.length; j++) {
						var filterItem = filterList[j];
						if (mask.name.trim().toLowerCase() === filterItem.trim().toLowerCase()) {
							includeMask = !0;
							break
						}
						var lowerFilterItem = filterItem.trim().toLowerCase();
						if (maskModes.hasOwnProperty(lowerFilterItem)) {
							if (mask.maskMode === maskModes[lowerFilterItem]) {
								includeMask = !0;
								break
							}
						}
					}
				} else {
					includeMask = !0
				}
				if (includeMask) {
					maskNames.push(mask.name)
				}
			}
			if (maskNames.length > 0) {
				return maskNames.join(separator)
			}
		}
		if (settings && settings.Lmn) {
			return settings.Lmn.active ? settings.Lmn.customValue : settings.Lmn.defaultValue
		} else {
			return "NoMaskNames"
		}
	}

	function getTypeIndexInComp(layer) {
		var comp = layer.containingComp;
		var type = getLayerType(layer);
		var count = 0;
		for (var i = 1; i <= comp.numLayers; i++) {
			var l = comp.layer(i);
			if (getLayerType(l) === type) {
				count++;
				if (l === layer) {
					return count
				}
			}
		}
		return 1
	}
	variableSettings = loadVariableSettings();

	function applySettings(settings) {
		isInitializing = !0;
		ddLayerMode.onChange = null;
		if (settings && settings.currentSettings) {
			rdoAllLayers.value = settings.currentSettings.allLayers;
			rdoOnlySelected.value = !settings.currentSettings.allLayers;
			txtTemplate.text = settings.currentSettings.template || defaultTemplatePreset1;
			chkBriefly.value = settings.currentSettings.briefly;
			ddBrieflyType.selection = settings.currentSettings.brieflyType || 0;
			currentModeIndex = settings.currentSettings.modeIndex !== undefined ? settings.currentSettings.modeIndex : 0;
			isActive = settings.currentSettings.modeActive !== undefined ? settings.currentSettings.modeActive : !1;
			updateLayerCounts();
			updatePreview();
			resetRenameButtonIcon()
		} else if (settings && settings.userPresets && Object.keys(settings.userPresets).length > 0) {
			var lastPresetKey = Object.keys(settings.userPresets).pop();
			var lastPreset = settings.userPresets[lastPresetKey];
			rdoAllLayers.value = lastPreset.allLayers;
			rdoOnlySelected.value = !lastPreset.allLayers;
			txtTemplate.text = lastPreset.template || defaultTemplatePreset1;
			chkBriefly.value = lastPreset.briefly;
			ddBrieflyType.selection = lastPreset.brieflyType || 0;
			currentModeIndex = 0;
			isActive = !1;
			updateLayerCounts();
			updatePreview();
			resetRenameButtonIcon()
		}
		var isCompact = settings.currentSettings && settings.currentSettings.UICompact;
		setMinimizeButtonIcon(isCompact);
		updatePresetsDropdown(settings);
		var selectedPresetTemplate = settings.currentSettings.selectedPresetTemplate;
		if (selectedPresetTemplate) {
			for (var i = 0; i < ddLayerMode.items.length; i++) {
				if (ddLayerMode.items[i].text === selectedPresetTemplate) {
					ddLayerMode.selection = i;
					break
				}
			}
		} else {
			ddLayerMode.selection = 0
		}
		updateModeButtonIcon();
		if (settings.currentSettings && typeof settings.currentSettings.selectedPresetIndex !== 'undefined') {
			ddLayerMode.selection = settings.currentSettings.selectedPresetIndex
		} else {
			ddLayerMode.selection = 0
		}
		txtTemplate.text = settings.currentSettings.template || defaultTemplatePreset1;
		ddLayerMode.onChange = dropdownChangeHandler;
		if (settings && settings.userPresets && ddLayerMode.selection && ddLayerMode.selection.preset) {
			btnFavorites.isFavorite = ddLayerMode.selection.preset.favoritesTemplate;
			updateFavoritesButtonIcon()
		} else {
			btnFavorites.isFavorite = !1;
			updateFavoritesButtonIcon()
		}
		isInitializing = !1
	}

	function dropdownChangeHandler() {
		if (isInitializing) {
			return
		}
		var selectedItem = ddLayerMode.selection;
		if (selectedItem && selectedItem.preset) {
			var preset = selectedItem.preset;
			var selectedTemplate = preset.template;
			var settings = loadSettings();
			var userPresets = settings.userPresets || {};
			if (preset.hasOwnProperty('usageFrequency')) {
				preset.usageFrequency += 1
			} else {
				preset.usageFrequency = 1
			}
			for (var key in userPresets) {
				if (userPresets.hasOwnProperty(key) && userPresets[key].template === preset.template) {
					userPresets[key] = preset;
					break
				}
			}
			settings.userPresets = userPresets;
			writeJSONFile(scriptFolderPath + "/NitroNamer/settings/settings.json", settings);
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
			saveSettings(currentSettings, !0);
			btnFavorites.isFavorite = preset.favoritesTemplate;
			updateFavoritesButtonIcon();
			updatePresetsDropdown(settings);
			ddLayerMode.onChange = null;
			for (var i = 0; i < ddLayerMode.items.length; i++) {
				var item = ddLayerMode.items[i];
				if (item.preset && item.preset.template === selectedTemplate) {
					ddLayerMode.selection = i;
					break
				}
			}
			ddLayerMode.onChange = dropdownChangeHandler
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
				if (isActive && modes[currentModeIndex] === "favorites") {
					if (preset.favoritesTemplate) {
						presetsArray.push(preset)
					}
				} else if (isActive && modes[currentModeIndex] === "search") {
					if (searchTerm === "") {
						presetsArray.push(preset)
					} else {
						if (preset.template.toLowerCase().indexOf(searchTerm) !== -1) {
							presetsArray.push(preset)
						}
					}
				} else {
					presetsArray.push(preset)
				}
			}
		}
		if (isActive) {
			if (modes[currentModeIndex] === "chart") {
				presetsArray.sort(function (a, b) {
					return (b.usageFrequency || 0) - (a.usageFrequency || 0)
				})
			} else if (modes[currentModeIndex] === "date") {
				presetsArray.sort(function (a, b) {
					var dateA = new Date(a.creationDate);
					var dateB = new Date(b.creationDate);
					if (isNaN(dateA.getTime())) {
						dateA = new Date(0)
					}
					if (isNaN(dateB.getTime())) {
						dateB = new Date(0)
					}
					return dateA.getTime() - dateB.getTime()
				})
			} else if (modes[currentModeIndex] === "longArrowDown") {
				presetsArray.sort(function (a, b) {
					return b.template.length - a.template.length
				})
			} else if (modes[currentModeIndex] === "longArrowUp") {
				presetsArray.sort(function (a, b) {
					return a.template.length - b.template.length
				})
			}
		}
		if (presetsArray.length === 0) {
			ddLayerMode.add("item", "No presets saved or suitable presets.")
		} else {
			for (var i = 0; i < presetsArray.length; i++) {
				var displayText = presetsArray[i].template;
				if (isActive) {
					if (modes[currentModeIndex] === "chart") {
						displayText += " {" + (presetsArray[i].usageFrequency || 0) + "}"
					} else if (modes[currentModeIndex] === "date") {
						if (presetsArray[i].creationDate) {
							var creationDate = new Date(presetsArray[i].creationDate);
							if (!isNaN(creationDate.getTime())) {
								var formattedDate = creationDate.getFullYear() + "-" + ("0" + (creationDate.getMonth() + 1)).slice(-2) + "-" + ("0" + creationDate.getDate()).slice(-2);
								displayText += " {" + formattedDate + "}"
							} else {
								displayText += " {Unknown date}"
							}
						} else {
							displayText += " {Unknown date}"
						}
					} else if (modes[currentModeIndex] === "longArrowDown" || modes[currentModeIndex] === "longArrowUp") {
						displayText += " {" + presetsArray[i].template.length + "}"
					}
				}
				var item = ddLayerMode.add("item", displayText);
				item.preset = presetsArray[i]
			}
		}
		var selectedPresetTemplate = settings.currentSettings ? settings.currentSettings.selectedPresetTemplate : null;
		var selectedIndex = -1;
		for (var i = 0; i < ddLayerMode.items.length; i++) {
			var itemPresetTemplate = ddLayerMode.items[i].preset ? ddLayerMode.items[i].preset.template : null;
			if (itemPresetTemplate === selectedPresetTemplate) {
				selectedIndex = i;
				break
			}
		}
		if (selectedIndex !== -1) {
			ddLayerMode.selection = selectedIndex
		} else {
			ddLayerMode.selection = 0
		}
		ddLayerMode.onChange = dropdownChangeHandler
	}

	function updateLayerCounts() {
		var proj = app.project;
		if (proj) {
			var comp = (app.activeViewer && app.activeViewer.type === ViewerType.COMPOSITION)
				? app.activeViewer.comp
				: proj.activeItem;
			if (comp && comp instanceof CompItem) {
				var totalLayers = 0,
					selectedLayers = 0;
				for (var i = 1; i <= comp.numLayers; i++) {
					var layer = comp.layer(i);
					if (!layer.locked && !layer.shy) {
						totalLayers++;
						if (layer.selected) {
							selectedLayers++;
						}
					}
				}
				txtAllLayersCount.text = totalLayers.toString();
				txtSelectedLayersCount.text = selectedLayers.toString();
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
		checkAndUpdateSettings();
		var proj = app.project;
		if (proj) {
			var comp = (app.activeViewer && app.activeViewer.type === ViewerType.COMPOSITION)
				? app.activeViewer.comp
				: proj.activeItem;
			if (comp && comp instanceof CompItem && comp.numLayers > 0) {
				var selectedLayers = comp.selectedLayers;
				var targetLayer = null;
				if (selectedLayers.length > 0) {
					targetLayer = selectedLayers[selectedLayers.length - 1]
				} else {
					for (var i = 1; i <= comp.numLayers; i++) {
						var layer = comp.layer(i);
						if (!layer.locked && !layer.shy) {
							targetLayer = layer;
							break
						}
					}
				}
				if (targetLayer) {
					var originalName = targetLayer.name;
					var template = txtTemplate.text;
					var briefly = chkBriefly.value;
					var brieflyType = ddBrieflyType.selection.text;
					var newName = generateNewName(targetLayer, template, briefly, brieflyType, variableSettings, true);
					if (!isCompact) {
						if (txtOriginal) {
							txtOriginal.text = originalName;
						}
						if (txtRenamed) {
							txtRenamed.text = newName;
						}
					}
					if (txtRenamed) {
						txtRenamed.text = newName;
					}
				} else {
					if (!isCompact) {
						txtOriginal.text = "No available layers";
						txtRenamed.text = "No available layers"
					}
					if (txtRenamed) {
						txtRenamed.text = "No available layers"
					}
				}
			} else {
				if (!isCompact) {
					txtOriginal.text = "No composition selected (or empty).";
					txtRenamed.text = "No composition selected (or empty)."
				}
				if (txtRenamed) {
					txtRenamed.text = "No composition selected (or empty)."
				}
			}
		} else {
			if (!isCompact) {
				txtOriginal.text = "No project open.";
				txtRenamed.text = "No project open."
			}
			if (txtRenamed) {
				txtRenamed.text = "No project open."
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
			lastModifiedTime = currentModifiedTime
		}
	}

	function generateNewName(layer, template, briefly, brieflyType, settings, isPreview) {
		resetLocalIndex();
		checkAndUpdateSettings();
		var oldLocalIndex = localIndex;
		if (isPreview) {
			var comp = layer.containingComp;
			if (comp) {
				var renameableLayers = [];
				var allLayersMode = rdoAllLayers.value;
				for (var i = 1; i <= comp.numLayers; i++) {
					var l = comp.layer(i);
					if (!l.locked && !l.shy) {
						if (allLayersMode || l.selected) {
							renameableLayers.push(l)
						}
					}
				}
				var indexInRename = 1;
				for (var idx = 0; idx < renameableLayers.length; idx++) {
					if (renameableLayers[idx] === layer) {
						indexInRename = idx + 1;
						break
					}
				}
				localIndex = indexInRename
			}
		}
		var variables = {
			"T": getLayerType(layer),
			"i": layer.index,
			"totalLayers": comp ? comp.numLayers : 1,
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
			"Lmn": getMaskNames(layer, settings),
			"attr": getSelectedPropertyName(),
			"prop": getSelectedPropertyGroupNamesForLayer(layer, getSelectedPropertyPaths()).length > 0 ? getSelectedPropertyGroupNamesForLayer(layer, getSelectedPropertyPaths()).join(", ") : "Property not selected",
			"Np": getNestedPrecompNames(layer, settings)
		};
		if (briefly && !isNaN(parseFloat(variables.F))) {
			variables.F = parseFloat(variables.F).toFixed(2)
		}
		var newName = replaceVariables(template, variables, layer.name, layer, settings, isPreview);
		if (briefly) {
			newName = toBrieflyCase(newName, brieflyType)
		}
		localIndex = oldLocalIndex;
		return newName
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
				return str
		}
	}

	function getExpressionControlledProperties(layer, settings, propertiesFilter, customSeparator) {
		var expressionProps = [];
		var propertyNames = null;
		var separator = customSeparator || ", ";
		if (propertiesFilter) {
			propertyNames = propertiesFilter.split(',').map(function (name) {
				return name.trim().toLowerCase()
			})
		}

		function checkPropertyGroup(propertyGroup) {
			for (var i = 1; i <= propertyGroup.numProperties; i++) {
				var prop = propertyGroup.property(i);
				if (prop.expression && prop.expressionEnabled) {
					if (propertyNames) {
						if (propertyNames.indexOf(prop.name.toLowerCase()) !== -1) {
							expressionProps.push(prop.name)
						}
					} else {
						expressionProps.push(prop.name)
					}
				}
				if (prop instanceof PropertyGroup || prop instanceof MaskPropertyGroup) {
					checkPropertyGroup(prop)
				}
			}
		}
		checkPropertyGroup(layer);
		if (expressionProps.length > 0) {
			return expressionProps.join(separator)
		} else {
			if (settings && settings.Lexp) {
				return settings.Lexp.active ? settings.Lexp.customValue : settings.Lexp.defaultValue
			} else {
				return "NoExpressions"
			}
		}
	}

	function getTrackMatteType(layer, settings) {
		if (layer instanceof CameraLayer || layer instanceof LightLayer) {
			return settings && settings.Tm ? (settings.Tm.active ? settings.Tm.customValue : settings.Tm.defaultValue) : "NoTrackMate"
		} else if (layer.isTrackMatte) {
			return "TM:Source"
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
					matteType = "Unknown Track Matte"
			}
			return "TM:" + matteType
		} else {
			return settings && settings.Tm ? (settings.Tm.active ? settings.Tm.customValue : settings.Tm.defaultValue) : "NoTrackMate"
		}
	}

	function toCamelCase(str) {
		var result = "";
		var capitalizeNext = !1;
		for (var i = 0; i < str.length; i++) {
			var currentChar = str.charAt(i);
			var charCode = str.charCodeAt(i);
			if ((charCode >= 48 && charCode <= 57) || (charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
				if (capitalizeNext) {
					result += currentChar.toUpperCase();
					capitalizeNext = !1
				} else {
					result += currentChar.toLowerCase()
				}
			} else {
				result += currentChar;
				capitalizeNext = !0
			}
		}
		return result
	}

	function toPascalCase(str) {
		return str.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
		})
	}

	function toSnakeCase(str) {
		return str.replace(/\s+/g, '_').toLowerCase()
	}

	function toKebabCase(str) {
		return str.replace(/\s+/g, '-').toLowerCase()
	}

	function toScreamingSnakeCase(str) {
		return str.replace(/\s+/g, '_').toUpperCase()
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
		if (layer instanceof ShapeLayer) {
			return getShapeLayerType(layer);
		}
		if (layer instanceof TextLayer) return "Text";
		if (layer instanceof LightLayer) return "Light";
		if (layer instanceof CameraLayer) return "Camera";
		if (layer.hasAudio && !layer.hasVideo) return "Audio";
		return "Unknown";
	}

	function getShapeLayerType(layer) {
		var contents = layer.property("Contents");
		if (!contents) {
			return "Shape"
		}
		var keywords = ["rectangle", "ellipse", "polystar", "shape"];
		var groups = [];
		for (var i = 1; i <= contents.numProperties; i++) {
			var prop = contents.property(i);
			if (prop.matchName && prop.matchName === "ADBE Vector Group") {
				var groupName = prop.name;
				var groupNameLower = groupName.toLowerCase();
				var matchedKeyword = null;
				for (var j = 0; j < keywords.length; j++) {
					var key = keywords[j];
					if (groupNameLower.indexOf(key) !== -1) {
						matchedKeyword = key;
						break
					}
				}
				groups.push({
					index: i,
					name: groupName,
					keyword: matchedKeyword
				})
			}
		}
		if (groups.length === 0) {
			return "Shape"
		}
		var keywordCounts = {};
		for (var i = 0; i < groups.length; i++) {
			if (groups[i].keyword !== null) {
				keywordCounts[groups[i].keyword] = (keywordCounts[groups[i].keyword] || 0) + 1
			}
		}
		var results = [];
		for (var i = 0; i < groups.length; i++) {
			var group = groups[i];
			if (group.keyword !== null) {
				if (keywordCounts[group.keyword] === 1) {
					results.push(group.keyword.charAt(0).toUpperCase() + group.keyword.slice(1))
				} else {
					results.push(group.name)
				}
			} else {
				results.push(group.name)
			}
		}
		return results.join(", ")
	}


	function getFrameRate(layer, settings) {
		if (layer.nullLayer || layer.adjustmentLayer || layer instanceof LightLayer || layer instanceof CameraLayer || layer instanceof TextLayer || layer instanceof ShapeLayer || layer.hasAudio) {
			return settings && settings.F ? (settings.F.active ? settings.F.customValue : settings.F.defaultValue) : "NoFrameRate"
		}
		if (layer.source && layer.source.mainSource instanceof SolidSource) {
			return settings && settings.F ? (settings.F.active ? settings.F.customValue : settings.F.defaultValue) : "NoFrameRate"
		}
		if (layer.source && !isNaN(layer.source.frameRate)) {
			return layer.source.frameRate.toFixed(2)
		}
		return settings && settings.F ? (settings.F.active ? settings.F.customValue : settings.F.defaultValue) : "NoFrameRate"
	}

	function getResolution(layer, settings) {
		var layerType = getLayerType(layer);
		if (layerType === "Null" || layerType === "Camera" || layerType === "Light" || layerType === "Audio") {
			return settings && settings.R ? (settings.R.active ? settings.R.customValue : settings.R.defaultValue) : "NoResolution";
		}
		var width = null, height = null;
		if (layer.source && layer.source.width && layer.source.height) {
			width = layer.source.width;
			height = layer.source.height;
		} else if (typeof layer.sourceRectAtTime === "function") {
			var rect = layer.sourceRectAtTime(layer.inPoint, false);
			width = rect.width;
			height = rect.height;
		}
		if (width !== null && height !== null) {
			return width + "*" + height;
		}
		return settings && settings.R ? (settings.R.active ? settings.R.customValue : settings.R.defaultValue) : "NoResolution";
	}	

	function getDuration(layer) {
		var duration;
		if (layer.source && layer.source.duration) {
			duration = layer.source.duration
		} else {
			duration = layer.outPoint - layer.inPoint
		}
		var hours = Math.floor(duration / 3600);
		var minutes = Math.floor((duration % 3600) / 60);
		var seconds = Math.floor(duration % 60);
		var milliseconds = Math.floor((duration * 1000) % 1000);
		return function (format) {
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
					return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds)
			}
		}
	}

	function getSourceName(layer) {
		if (layer.source) {
			return layer.source.name
		}
		return layer.name
	}

	function getWidth(layer, settings) {
		var layerType = getLayerType(layer);
		if (layerType === "Null" || layerType === "Camera" || layerType === "Light" || layerType === "Audio") {
			return settings && settings.W ? (settings.W.active ? settings.W.customValue : settings.W.defaultValue) : "NoWidth";
		}
		if (layer.source && layer.source.width) {
			return layer.source.width;
		}
		if (typeof layer.sourceRectAtTime === "function") {
			var rect = layer.sourceRectAtTime(layer.inPoint, false);
			return rect.width;
		}
		return settings && settings.W ? (settings.W.active ? settings.W.customValue : settings.W.defaultValue) : "NoWidth";
	}	

	function getHeight(layer, settings) {
		var layerType = getLayerType(layer);
		if (layerType === "Null" || layerType === "Camera" || layerType === "Light" || layerType === "Audio") {
			return settings && settings.H ? (settings.H.active ? settings.H.customValue : settings.H.defaultValue) : "NoHeight";
		}
		if (layer.source && layer.source.height) {
			return layer.source.height;
		}
		if (typeof layer.sourceRectAtTime === "function") {
			var rect = layer.sourceRectAtTime(layer.inPoint, false);
			return rect.height;
		}
		return settings && settings.H ? (settings.H.active ? settings.H.customValue : settings.H.defaultValue) : "NoHeight";
	}	

	function getLayerPosition(layer) {
		if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
			return ""
		}
		if (layer.transform && layer.transform.position) {
			var pos = layer.transform.position.value;
			if (typeof pos === 'number') {
				pos = [pos]
			} else if (Object.prototype.toString.call(pos) !== '[object Array]') {
				pos = [].slice.call(pos)
			}
			if (layer instanceof CameraLayer || layer instanceof LightLayer || layer.threeDLayer) {
				var roundedPos = [0, 0, 0];
				for (var i = 0; i < 3; i++) {
					roundedPos[i] = pos[i] !== undefined ? Math.round(pos[i] * 10) / 10 : 0
				}
				return roundedPos.join(", ")
			} else {
				var roundedPos2D = [0, 0];
				for (var j = 0; j < 2; j++) {
					roundedPos2D[j] = pos[j] !== undefined ? Math.round(pos[j] * 10) / 10 : 0
				}
				return roundedPos2D.join(", ")
			}
		}
		return "NoPosition"
	}

	function getAspectRatio(layer, settings, inPixels) {
		if (layer.nullLayer || layer.adjustmentLayer) {
			return settings && settings.Ar ? (settings.Ar.active ? settings.Ar.customValue : settings.Ar.defaultValue) : "NoAspectRatio"
		}
		if (layer.source && layer.source.width && layer.source.height) {
			var width = layer.source.width;
			var height = layer.source.height;
			if (inPixels) {
				return width + "px:" + height + "px"
			}
			var gcd = function (a, b) {
				return b == 0 ? a : gcd(b, a % b)
			};
			var divisor = gcd(width, height);
			return (width / divisor) + ":" + (height / divisor)
		}
		return settings && settings.Ar ? (settings.Ar.active ? settings.Ar.customValue : settings.Ar.defaultValue) : "NoAspectRatio"
	}

	function getEffectsCount(layer, settings, effectsFilter) {
		var effectsCount = 0;
		var effectsNamesFilter = null;
		if (effectsFilter) {
			effectsNamesFilter = effectsFilter.split(',').map(function (name) {
				return name.trim().toLowerCase()
			})
		}
		if (layer.property("ADBE Effect Parade") && layer.property("ADBE Effect Parade").numProperties > 0) {
			for (var j = 1; j <= layer.property("ADBE Effect Parade").numProperties; j++) {
				var effect = layer.property("ADBE Effect Parade").property(j);
				if (effectsNamesFilter) {
					if (effectsNamesFilter.indexOf(effect.name.trim().toLowerCase()) !== -1) {
						effectsCount++
					}
				} else {
					effectsCount++
				}
			}
			return effectsCount.toString()
		} else {
			if (settings && settings.Ec) {
				return settings.Ec.active ? settings.Ec.customValue : settings.Ec.defaultValue
			} else {
				return "NoEffects"
			}
		}
	}

	function getProjectName() {
		var projectName = "Untitled Project";
		if (app.project.file) {
			var projectFileName = app.project.file.name;
			var lastDotIndex = projectFileName.lastIndexOf('.');
			if (lastDotIndex !== -1) {
				projectName = projectFileName.substring(0, lastDotIndex)
			} else {
				projectName = projectFileName
			}
		}
		return decodeURIComponent(projectName)
	}

	function getAnimatedProperties(layer, settings, propertiesFilter, customSeparator) {
		var animatedProps = [];
		var propertyNames = null;
		var separator = customSeparator || ", ";
		if (propertiesFilter) {
			propertyNames = propertiesFilter.split(',').map(function (name) {
				return name.trim().toLowerCase()
			})
		}
		var hasAnyAnimatedProperty = !1;

		function checkPropertyGroup(propertyGroup) {
			for (var i = 1; i <= propertyGroup.numProperties; i++) {
				var prop = propertyGroup.property(i);
				if (prop.numKeys > 0) {
					hasAnyAnimatedProperty = !0;
					if (propertyNames) {
						if (propertyNames.indexOf(prop.name.toLowerCase()) !== -1) {
							animatedProps.push(prop.name)
						}
					} else {
						animatedProps.push(prop.name)
					}
				}
				if (prop instanceof PropertyGroup || prop instanceof MaskPropertyGroup) {
					checkPropertyGroup(prop)
				}
			}
		}
		checkPropertyGroup(layer);
		if (animatedProps.length > 0) {
			return animatedProps.join(separator)
		} else {
			if (settings && settings.An) {
				return settings.An.active ? settings.An.customValue : settings.An.defaultValue
			} else {
				return "NoAnimations"
			}
		}
	}

	function getLayerScale(layer) {
		if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
			return ""
		}
		if (layer.transform && layer.transform.scale) {
			var sc = layer.transform.scale.value;
			if (typeof sc === 'number') {
				sc = [sc]
			} else if (Object.prototype.toString.call(sc) !== '[object Array]') {
				sc = [].slice.call(sc)
			}
			if (layer instanceof CameraLayer || layer instanceof LightLayer || layer.threeDLayer) {
				var roundedSc = [0, 0, 0];
				for (var i = 0; i < 3; i++) {
					roundedSc[i] = sc[i] !== undefined ? Math.round(sc[i] * 10) / 10 : 0
				}
				return roundedSc.join(", ")
			} else {
				var roundedSc2D = [0, 0];
				for (var j = 0; j < 2; j++) {
					roundedSc2D[j] = sc[j] !== undefined ? Math.round(sc[j] * 10) / 10 : 0
				}
				return roundedSc2D.join(", ")
			}
		}
		return "NoScale"
	}

	function getLayerRotation(layer) {
		if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
			return ""
		}
		if (layer.transform) {
			var rotation;
			if (layer.threeDLayer) {
				var rotationX = layer.transform.xRotation ? layer.transform.xRotation.value : 0;
				var rotationY = layer.transform.yRotation ? layer.transform.yRotation.value : 0;
				var rotationZ = layer.transform.zRotation ? layer.transform.zRotation.value : 0;
				rotation = [rotationX, rotationY, rotationZ]
			} else {
				rotation = layer.transform.rotation ? [layer.transform.rotation.value] : [0]
			}
			if (typeof rotation === 'number') {
				rotation = [rotation]
			} else if (Object.prototype.toString.call(rotation) !== '[object Array]') {
				rotation = [].slice.call(rotation)
			}
			if (layer instanceof CameraLayer || layer instanceof LightLayer || layer.threeDLayer) {
				var roundedRot = [0, 0, 0];
				for (var i = 0; i < 3; i++) {
					roundedRot[i] = rotation[i] !== undefined ? Math.round(rotation[i] * 10) / 10 : 0
				}
				return roundedRot.join(", ")
			} else {
				var roundedRot2D = [0];
				roundedRot2D[0] = rotation[0] !== undefined ? Math.round(rotation[0] * 10) / 10 : 0;
				return roundedRot2D.join(", ")
			}
		}
		return "NoRotation"
	}

	function getFileExtension(layer, settings, customExtension) {
		if (layer.source && layer.source.file && layer.source.file.name) {
			var fileName = layer.source.file.name;
			var ext = fileName.split('.').pop().toLowerCase();
			if (customExtension) {
				var allowed = customExtension.split(',').map(function(item) {
					return item.replace(/[\[\]\*]/g, "").trim().toLowerCase();
				}).filter(function(item) { return item !== ""; });
				if (customExtension.indexOf('*') !== -1) {
					return ext;
				}
				if (allowed.indexOf(ext) !== -1) {
					return ext;
				} else {
					return (settings && settings.Fext ? (settings.Fext.active ? settings.Fext.customValue : settings.Fext.defaultValue) : "NoExtension");
				}
			}
			return ext;
		}
		return (settings && settings.Fext ? (settings.Fext.active ? settings.Fext.customValue : settings.Fext.defaultValue) : "NoExtension");
	}	

	function getLayerOpacity(layer) {
		if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
			return ""
		}
		if (layer.transform && layer.transform.opacity) {
			var opacity = layer.transform.opacity.value;
			return Math.round(opacity * 10) / 10
		}
		return "NoOpacity"
	}

	function getDurationInFrames(layer) {
		if (layer && layer.containingComp) {
			var frameRate = layer.containingComp.frameRate;
			var duration = (layer.outPoint - layer.inPoint) * frameRate;
			return Math.round(duration)
		}
		return "NoDuration"
	}

	function getImmediateParentName(layer) {
		var currentLayer = layer;
		while (currentLayer.parent) {
			currentLayer = currentLayer.parent
		}
		return currentLayer.name
	}

	function isParentLayer(layer) {
		if (!layer || !layer.containingComp) {
			return !1
		}
		var comp = layer.containingComp;
		for (var i = 1; i <= comp.numLayers; i++) {
			if (comp.layer(i).parent === layer) {
				return !0
			}
		}
		return !1
	}

	function arrayIndexOf(arr, item) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === item) {
				return i
			}
		}
		return -1
	}

	function getLayerParentIndex(layer) {
		if (!layer.parent) {
			return "0";
		}
		var comp = layer.containingComp;
		var parentLayer = layer.parent;
		var childLayers = [];
		for (var i = 1; i <= comp.numLayers; i++) {
			var currentLayer = comp.layer(i);
			if (currentLayer.parent === parentLayer) {
				childLayers.push(currentLayer);
			}
		}
		childLayers.sort(function (a, b) {
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
		var layerIdx = arrayIndexOf(childLayers, layer);
		var relativeIndex;
		if (allAbove) {
			relativeIndex = childLayers.length - layerIdx;
		} else if (allBelow) {
			relativeIndex = layerIdx + 1;
		} else {
			relativeIndex = layerIdx + 1;
		}
		return relativeIndex.toString();
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
				return day + "." + month + "." + year
		}
	}

	function getLayerOrder(comp, allLayers, reverseOrder) {
		var layers = [];
		if (allLayers) {
			for (var i = 1; i <= comp.numLayers; i++) {
				layers.push(comp.layer(i))
			}
		} else {
			for (var j = 0; j < comp.selectedLayers.length; j++) {
				layers.push(comp.selectedLayers[j])
			}
		}
		if (reverseOrder) {
			layers.reverse()
		}
		return layers
	}

	function resetLocalIndex() {
		localIndex = 1
	}

	function resetIncrementValues() {
		incrementValues = {}
	}

	function getParentNameAtDepth(layer, depth) {
		var currentLayer = layer;
		var steps = 0;
		while (currentLayer.parent && steps < depth) {
			currentLayer = currentLayer.parent;
			steps++
		}
		return currentLayer.name
	}

	function getSelectedPropertyGroupNamesForLayer(layer, propertyPaths) {
		var propNames = [];
		if (!propertyPaths || propertyPaths.length === 0) {
			return propNames
		}
		for (var p = 0; p < propertyPaths.length; p++) {
			var propertyPath = propertyPaths[p];
			var propGroup = layer;
			var pathExists = !0;
			for (var i = 0; i < propertyPath.length; i++) {
				var propName = propertyPath[i];
				if (propGroup.property(propName)) {
					propGroup = propGroup.property(propName)
				} else {
					pathExists = !1;
					break
				}
			}
			if (pathExists) {
				if ((propGroup instanceof PropertyGroup || propGroup instanceof MaskPropertyGroup) && propGroup.numProperties > 0) {
					propNames.push(propGroup.name)
				} else if (propGroup instanceof Property && propGroup.parentProperty instanceof PropertyGroup && propGroup.parentProperty.numProperties > 0) {
					propNames.push(propGroup.parentProperty.name)
				}
			}
		}
		var uniquePropNames = [];
		for (var j = 0; j < propNames.length; j++) {
			if (uniquePropNames.indexOf(propNames[j]) < 0) {
				uniquePropNames.push(propNames[j])
			}
		}
		propNames = uniquePropNames;
		return propNames
	}

	function getSelectedPropertyName() {
		var proj = app.project;
		if (proj && proj.activeItem instanceof CompItem) {
			var comp = proj.activeItem;
			var selectedLayers = comp.selectedLayers;
			if (selectedLayers.length > 0) {
				var layer = selectedLayers[selectedLayers.length - 1];
				var selectedProperties = layer.selectedProperties;
				if (selectedProperties.length > 0) {
					var propertyNames = [];
					for (var i = 0; i < selectedProperties.length; i++) {
						var prop = selectedProperties[i];
						if (prop.propertyType === PropertyType.PROPERTY) {
							propertyNames.push(prop.name)
						}
					}
					if (propertyNames.length > 0) {
						return propertyNames.join(", ")
					} else {
						return "Attribute not selected"
					}
				} else {
					return "Attribute not selected"
				}
			} else {
				return "Attribute not selected"
			}
		} else {
			return "Attribute not selected"
		}
	}

	function getSelectedPropertyPaths() {
		var proj = app.project,
			paths = [];
		if (proj) {
			var comp = (app.activeViewer && app.activeViewer.type === ViewerType.COMPOSITION)
				? app.activeViewer.comp
				: proj.activeItem;
			if (comp instanceof CompItem) {
				var selectedLayers = comp.selectedLayers;
				if (selectedLayers.length > 0) {
					var lastLayer = selectedLayers[selectedLayers.length - 1],
						selectedProperties = lastLayer.selectedProperties;
					if (selectedProperties.length > 0) {
						for (var i = 0; i < selectedProperties.length; i++) {
							var prop = selectedProperties[i];
							if (prop instanceof Property || prop instanceof PropertyGroup || prop instanceof MaskPropertyGroup) {
								var path = [];
								for (var p = prop; p && p !== lastLayer; p = p.parentProperty) {
									path.unshift(p.name);
								}
								paths.push(path);
							}
						}
						if (paths.length > 0) {
							return paths;
						}
					}
				}
			}
		}
		return null;
	}

	function getAttributeNamesForLayer(layer, propertyPaths) {
		var attrNames = [];
		if (!propertyPaths || propertyPaths.length === 0) {
			return attrNames
		}
		for (var p = 0; p < propertyPaths.length; p++) {
			var propertyPath = propertyPaths[p];
			var propGroup = layer;
			var pathExists = !0;
			for (var i = 0; i < propertyPath.length; i++) {
				var propName = propertyPath[i];
				if (propGroup.property(propName)) {
					propGroup = propGroup.property(propName)
				} else {
					pathExists = !1;
					break
				}
			}
			if (pathExists && propGroup instanceof Property) {
				attrNames.push(propGroup.name)
			}
		}
		return attrNames
	}

	function getNthEffectName(layer, n, settings) {
		if (layer.property("ADBE Effect Parade") && layer.property("ADBE Effect Parade").numProperties >= n) {
			return layer.property("ADBE Effect Parade").property(n).name
		} else {
			if (settings && settings.E) {
				return settings.E.active ? settings.E.customValue : settings.E.defaultValue
			} else {
				return "NoEffects"
			}
		}
	}

	function getNthMaskName(layer, n, settings) {
		if (layer.mask && layer.mask.numProperties >= n) {
			return layer.mask.property(n).name
		} else {
			if (settings && settings.Lmn) {
				return settings.Lmn.active ? settings.Lmn.customValue : settings.Lmn.defaultValue
			} else {
				return "NoMaskNames"
			}
		}
	}

	function filterLayerType(layerType, filterSpec) {
		if (!layerType) return "";
		var separator = ", ";
		var filtersPart = filterSpec;
		var matchSep = filterSpec.match(/^(.*?)\[(.*)\]$/);
		if (matchSep) {
			filtersPart = matchSep[1].replace(/\s+$/, "");
			separator = matchSep[2];
		}
		var tokensTemp = filtersPart.split(",");
		var filterTokens = [];
		for (var i = 0; i < tokensTemp.length; i++) {
			var token = tokensTemp[i].replace(/^\s+|\s+$/g, "").toLowerCase();
			if (token !== "") {
				filterTokens.push(token);
			}
		}
		
		var items;
		if (layerType.indexOf(",") !== -1) {
			var itemsTemp = layerType.split(",");
			items = [];
			for (var i = 0; i < itemsTemp.length; i++) {
				items.push(itemsTemp[i].replace(/^\s+|\s+$/g, ""));
			}
		} else {
			items = [layerType.replace(/^\s+|\s+$/g, "")];
		}
		
		var matchedItems = [];
		for (var i = 0; i < items.length; i++) {
			var itemLower = items[i].toLowerCase();
			for (var j = 0; j < filterTokens.length; j++) {
				if (itemLower === filterTokens[j]) {
					var exists = false;
					for (var k = 0; k < matchedItems.length; k++) {
						if (matchedItems[k] === items[i]) {
							exists = true;
							break;
						}
					}
					if (!exists) {
						matchedItems.push(items[i]);
					}
					break;
				}
			}
		}
		
		return matchedItems.join(separator);
	}	

	function getIndexInSelection(layer) {
		var selectedLayers = layer.containingComp.selectedLayers;
		for (var s = 0; s < selectedLayers.length; s++) {
			if (selectedLayers[s] === layer) {
				return s + 1
			}
		}
		return 1
	}

	function getPreviewLocalIndex(layer) {
		var comp = layer.containingComp;
		if (!comp) {
			return 1
		}
		var renameableLayers = [];
		var allLayersMode = rdoAllLayers.value;
		for (var i = 1; i <= comp.numLayers; i++) {
			var l = comp.layer(i);
			if (!l.locked && !l.shy) {
				if (allLayersMode || l.selected) {
					renameableLayers.push(l)
				}
			}
		}
		for (var j = 0; j < renameableLayers.length; j++) {
			if (renameableLayers[j] === layer) {
				return j + 1
			}
		}
		return 1
	}

	function getChildLayerNames(layer, n, separator) {
		var comp = layer.containingComp;
		if (!comp) {
			return "";
		}
	
		var children = [];
		for (var i = 1; i <= comp.numLayers; i++) {
			var l = comp.layer(i);
			if (l.parent === layer) {
				children.push(l);
			}
		}
	
		if (children.length === 0) {
			return "";
		}
	
		if (typeof n === "number" && !isNaN(n)) {
			if (n >= 1 && n <= children.length) {
				return children[n - 1].name;
			} else {
				return "";
			}
		} else {
			var sep = separator || ", ";
			var childNames = [];
			for (var j = 0; j < children.length; j++) {
				childNames.push(children[j].name);
			}
			return childNames.join(sep);
		}
	}

	function getNestedPrecompNames(layer, settings, customSeparator) {
		if (layer.source && (layer.source instanceof CompItem)) {
			var nestedNames = [];
			var precomp = layer.source;
			for (var i = 1; i <= precomp.numLayers; i++) {
				var nestedLayer = precomp.layer(i);
				if (nestedLayer instanceof AVLayer && nestedLayer.source instanceof CompItem) {
					nestedNames.push(nestedLayer.name);
				}
			}
			if (nestedNames.length > 0) {
				var sep = customSeparator || ", ";
				return nestedNames.join(sep);
			}
		}
		if (settings && settings.Np) {
			return settings.Np.active ? settings.Np.customValue : settings.Np.defaultValue;
		}
		return "NoNestedPrecomps";
	}

	function replaceVariables(template, variables, originalName, layer, settings, isPreview) {
		var result = template;
		var nthEffectRegex = /e(\d+)/g;
		var nthMaskRegex = /m(\d+)/g;
		var regex = new RegExp(["\\[([^\\[\\]]+)\\]", "T\\(([^()]+)\\)", "it", "Df", "Ec\\(([^()\\[\\]]+?)\\)", "Ec", "E\\(\\[([^\\[\\]]+)\\]\\)", "E\\(([^()\\[\\]]+?)(?:\\[(.*?)\\])?\\)", "E", "An\\(\\[([^\\[\\]]+)\\]\\)", "An\\(([^()\\[\\]]+?)(?:\\[(.*?)\\])?\\)", "An", "Lexp\\(\\[([^\\[\\]]+)\\]\\)", "Lexp\\(([^()\\[\\]]+?)(?:\\[(.*?)\\])?\\)", "Lexp", "D\\(([^()\\[\\]]+)\\)", "D", "Fext\\(([^()\\[\\]]+)\\)", "Fext", "Ip", "Op", "Tm", "Ar\\(([^()\\[\\]]+)\\)", "Ar", "Pn", "Lpos", "Lsc", "Lrot", "Lops", "Lpnt\\(([^()\\[\\]]+)\\)", "Lpnt", "Cd\\(([^()\\[\\]]+)\\)", "Cd", "Lmc\\(\\[([^\\[\\]]+)\\]\\)", "Lmc\\(([^()\\[\\]]+?)(?:\\[(.*?)\\])?\\)", "Lmc", "Lmn\\(\\[([^\\[\\]]+)\\]\\)", "Lmn\\(([^()\\[\\]]+?)(?:\\[(.*?)\\])?\\)", "Lmn", "Np\\(\\[([^\\[\\]]+)\\]\\)", "Np\\(([^()\\[\\]]+?)(?:\\[(.*?)\\])?\\)", "Np", "Chld\\(\\[([^\\[\\]]+)\\]\\)", "Chld\\(([^()\\[\\]]+?)(?:\\[(.*?)\\])?\\)", "Chld", "I\\(([^()\\[\\]]+)\\)", "I", "attr", "prop", "e(\\d+)", "m(\\d+)", "W\\(([1-9])\\)", "W", "H\\(([1-9])\\)", "H", "R\\(([1-9])\\)", "R", "[A-Z]", "i", "S", "@cycle\\(\\s*(\\d+)\\s*,\\s*'([^']+)'\\s*,\\s*'([^']+)'\\s*\\)", "cycle", "@replace\\(\\s*'([^']+)'\\s*,\\s*'([^']+)'\\s*\\)"].join("|"), "g");
		var usedVariables = {};
		var currentLocalIndex = localIndex;
		result = result.replace(regex, function (match, group, tFilter, ecFilters, eSeparatorOnly, eEffects, eSeparator, anSeparatorOnly, anProps, anSeparator, lexpSeparatorOnly, lexpProps, lexpSeparator, durationFormat, customFext, customAr, parentIndex, dateFormat, lmcSeparatorOnly, lmcFilters, lmcSeparator, lmnSeparatorOnly, lmnFilters, lmnSeparator, chldSeparatorOnly, chldN, chldSeparator, customI, nthEffectIndex, nthMaskIndex, cycleCount, cycleA, cycleB, replaceFindStr, replaceWithStr) {
			var value;
			if (/^W\(([1-9])\)$/.test(match)) {
				var decimalsW = parseInt(match.match(/^W\(([1-9])\)$/)[1], 10);
				if (typeof variables.W === "number") {
					return variables.W.toFixed(decimalsW);
				} else {
					return variables.W;
				}
			}
			if (match === "W") {
				if (typeof variables.W === "number") {
					return Math.round(variables.W).toString();
				} else {
					return variables.W;
				}
			}
			if (/^H\(([1-9])\)$/.test(match)) {
				var decimalsH = parseInt(match.match(/^H\(([1-9])\)$/)[1], 10);
				if (typeof variables.H === "number") {
					return variables.H.toFixed(decimalsH);
				} else {
					return variables.H;
				}
			}
			if (match === "H") {
				if (typeof variables.H === "number") {
					return Math.round(variables.H).toString();
				} else {
					return variables.H;
				}
			}
			if (/^R\(([1-9])\)$/.test(match)) {
				var decimalsR = parseInt(match.match(/^R\(([1-9])\)$/)[1], 10);
				var wVal = getWidth(layer, settings);
				var hVal = getHeight(layer, settings);
				if (typeof wVal === "number" && typeof hVal === "number") {
					return wVal.toFixed(decimalsR) + "*" + hVal.toFixed(decimalsR);
				} else {
					return wVal + "*" + hVal;
				}
			}
			if (match === "R") {
				var wVal = getWidth(layer, settings);
				var hVal = getHeight(layer, settings);
				if (typeof wVal === "number" && typeof hVal === "number") {
					return Math.round(wVal).toString() + "*" + Math.round(hVal).toString();
				} else {
					return wVal + "*" + hVal;
				}
			}
			if (anSeparatorOnly !== undefined) {
				anSeparatorOnly = anSeparatorOnly.replace(/attr/g, variables.attr)
			}
			if (anProps !== undefined) {
				anProps = anProps.replace(/attr/g, variables.attr)
			}
			if (lexpSeparatorOnly !== undefined) {
				lexpSeparatorOnly = lexpSeparatorOnly.replace(/attr/g, variables.attr)
			}
			if (lexpProps !== undefined) {
				lexpProps = lexpProps.replace(/attr/g, variables.attr)
			}
			if (ecFilters !== undefined) {
				ecFilters = ecFilters.replace(nthEffectRegex, function (fullMatch, number) {
					var effectNumber = parseInt(number, 10);
					return getNthEffectName(layer, effectNumber, settings)
				}).replace(nthMaskRegex, function (fullMatch, number) {
					var maskNumber = parseInt(number, 10);
					return getNthMaskName(layer, maskNumber, settings)
				})
			}
			if (eEffects !== undefined) {
				eEffects = eEffects.replace(nthEffectRegex, function (fullMatch, number) {
					var effectNumber = parseInt(number, 10);
					return getNthEffectName(layer, effectNumber, settings)
				}).replace(nthMaskRegex, function (fullMatch, number) {
					var maskNumber = parseInt(number, 10);
					return getNthMaskName(layer, maskNumber, settings)
				});
				eEffects = eEffects.replace(/prop/g, variables.prop);
				value = getEffectNames(layer, settings, eEffects, eSeparator)
			}
			if (anProps !== undefined) {
				anProps = anProps.replace(nthEffectRegex, function (fullMatch, number) {
					var effectNumber = parseInt(number, 10);
					return getNthEffectName(layer, effectNumber, settings)
				}).replace(nthMaskRegex, function (fullMatch, number) {
					var maskNumber = parseInt(number, 10);
					return getNthMaskName(layer, maskNumber, settings)
				})
			}
			if (lmcFilters !== undefined) {
				lmcFilters = lmcFilters.replace(/m(\d+)/g, function (fullMatch, number) {
					var maskNumber = parseInt(number, 10);
					return getNthMaskName(layer, maskNumber, settings);
				});
				lmcFilters = lmcFilters.replace(/prop/g, variables.prop);
				value = getMaskCount(layer, settings, lmcFilters, lmcSeparator);
			}
			if (lmnFilters !== undefined) {
				lmnFilters = lmnFilters.replace(/m(\d+)/g, function (fullMatch, number) {
					var maskNumber = parseInt(number, 10);
					return getNthMaskName(layer, maskNumber, settings);
				});
				lmnFilters = lmnFilters.replace(/prop/g, variables.prop);
				value = getMaskNames(layer, settings, lmnFilters, lmnSeparator);
			}
			if (lmnSeparatorOnly !== undefined) {
				lmnSeparatorOnly = lmnSeparatorOnly.replace(nthMaskRegex, function (fullMatch, number) {
					var maskNumber = parseInt(number, 10);
					return getNthMaskName(layer, maskNumber, settings)
				})
			}
			if (lmcSeparatorOnly !== undefined) {
				lmcSeparatorOnly = lmcSeparatorOnly.replace(nthMaskRegex, function (fullMatch, number) {
					var maskNumber = parseInt(number, 10);
					return getNthMaskName(layer, maskNumber, settings)
				})
			}
			if (lexpProps !== undefined) {
				lexpProps = lexpProps.replace(nthEffectRegex, function (fullMatch, number) {
					var effectNumber = parseInt(number, 10);
					return getNthEffectName(layer, effectNumber, settings)
				}).replace(nthMaskRegex, function (fullMatch, number) {
					var maskNumber = parseInt(number, 10);
					return getNthMaskName(layer, maskNumber, settings)
				})
			}
			if (cycleCount !== undefined && cycleA !== undefined && cycleB !== undefined) {
				var iValue = parseInt(variables.i, 10);
				if (isNaN(iValue) || iValue < 1) iValue = 1;
				var cycleBlock = 2 * cycleCount;
				var indexInBlock = (iValue - 1) % cycleBlock;
				var cycleValue = (indexInBlock < cycleCount) ? cycleA : cycleB;
				var processedCycleValue = replaceVariables(cycleValue, variables, originalName, layer, settings, isPreview);
				return processedCycleValue
			}
			if (group !== undefined) {
				return group
			} else if (match === 'it') {
				if (variables.hasOwnProperty('it')) {
					value = variables.it
				} else {
					value = getTypeIndexInComp(layer)
				}
			} else if (tFilter !== undefined) {
				var layerType = variables.T;
				value = filterLayerType(layerType, tFilter);
				return value;
			} else if (ecFilters !== undefined) {
				ecFilters = ecFilters.replace(/prop/g, variables.prop);
				value = getEffectsCount(layer, settings, ecFilters);
			} else if (match === 'Ec') {
				value = getEffectsCount(layer, settings);
			} else if (eSeparatorOnly !== undefined) {
				value = getEffectNames(layer, settings, null, eSeparatorOnly)
			} else if (eEffects !== undefined) {
				value = getEffectNames(layer, settings, eEffects, eSeparator)
			} else if (match === 'E') {
				value = getEffectNames(layer, settings)
			} else if (anSeparatorOnly !== undefined) {
				value = getAnimatedProperties(layer, settings, null, anSeparatorOnly)
			} else if (anProps !== undefined) {
				value = getAnimatedProperties(layer, settings, anProps, anSeparator)
			} else if (match === 'An') {
				value = getAnimatedProperties(layer, settings)
			} else if (lexpSeparatorOnly !== undefined) {
				value = getExpressionControlledProperties(layer, settings, null, lexpSeparatorOnly)
			} else if (lexpProps !== undefined) {
				value = getExpressionControlledProperties(layer, settings, lexpProps, lexpSeparator)
			} else if (match === 'Lexp') {
				value = getExpressionControlledProperties(layer, settings)
			} else if (durationFormat !== undefined) {
				value = typeof variables.D === 'function' ? variables.D(durationFormat) : variables.D
			} else if (match === 'D') {
				value = typeof variables.D === 'function' ? variables.D() : variables.D
			} else if (customFext !== undefined) {
				value = getFileExtension(layer, settings, customFext)
			} else if (match === 'Fext') {
				value = variables.Fext
			} else if (match === 'Df') {
				value = variables.Df
			} else if (match === 'Ip') {
				value = variables.Ip
			} else if (match === 'Op') {
				value = variables.Op
			} else if (match === 'Tm') {
				value = variables.Tm
			} else if (customAr !== undefined) {
				value = getAspectRatio(layer, settings, !0)
			} else if (match === 'Ar') {
				value = variables.Ar
			} else if (match === 'Pn') {
				value = variables.Pn
			} else if (match === 'Lpos') {
				value = variables.Lpos
			} else if (match === 'Lsc') {
				value = variables.Lsc
			} else if (match === 'Lrot') {
				value = variables.Lrot
			} else if (match === 'Lops') {
				value = variables.Lops
			} else if (parentIndex !== undefined) {
				if (parentIndex === 'i') {
					value = variables.LpntIndex
				} else if (!isNaN(parseInt(parentIndex, 10))) {
					var depth = parseInt(parentIndex, 10);
					value = getParentNameAtDepth(layer, depth)
				} else {
					value = variables.Lpnt
				}
			} else if(match === "Np") {
				value = getNestedPrecompNames(layer, settings);
			} else if(match.indexOf("Np(") === 0) {
				var customSep = "";
				var m = match.match(/Np\(\[([^\[\]]+)\]\)/);
				if (m && m[1]) {
					customSep = m[1];
				}
				value = getNestedPrecompNames(layer, settings, customSep);
			} else if (match === 'Lpnt') {
				value = variables.Lpnt
			} else if (dateFormat !== undefined) {
				value = getCurrentDate(dateFormat)
			} else if (match === 'Cd') {
				value = getCurrentDate()
			} else if (lmcSeparatorOnly !== undefined) {
				value = getMaskCount(layer, settings, lmcSeparatorOnly, null)
			} else if (lmcFilters !== undefined) {
				value = getMaskCount(layer, settings, lmcFilters, lmcSeparator)
			} else if (match === 'Lmc') {
				value = getMaskCount(layer, settings)
			} else if (lmnSeparatorOnly !== undefined) {
				value = getMaskNames(layer, settings, lmnSeparatorOnly, null)
			} else if (lmnFilters !== undefined) {
				value = getMaskNames(layer, settings, lmnFilters, lmnSeparator)
			} else if (match === 'Lmn') {
				value = getMaskNames(layer, settings)
			} else if (chldSeparatorOnly !== undefined) {
				value = getChildLayerNames(layer, null, chldSeparatorOnly);
			} else if (chldN !== undefined) {
				var comp = layer.containingComp;
				var children = [];
				if (comp) {
					for (var i = 1; i <= comp.numLayers; i++) {
						var l = comp.layer(i);
						if (l.parent === layer) {
							children.push(l);
						}
					}
				}
				if (children.length === 0) {
					value = layer.name;
				} else {
					if (chldN.trim() === "") {
						value = getChildLayerNames(layer, null, chldSeparator || ", ");
					} else {
						var indicesStr = chldN.split(',').map(function(item) { return item.trim(); });
						var names = [];
						for (var k = 0; k < indicesStr.length; k++) {
							var index = parseInt(indicesStr[k], 10);
							if (!isNaN(index) && index >= 1 && index <= children.length) {
								names.push(children[index - 1].name);
							}
						}
						value = names.join(chldSeparator || ", ");
					}
				}
			} else if (match === "Chld") {
				value = getChildLayerNames(layer, null, null);
			} else if (customI !== undefined) {
				var uniqueKey = "I(" + customI + ")";
				var parts = customI.split(",");
				var offset = 0;
				var isReverse = !1;
				for (var p = 0; p < parts.length; p++) {
					var segment = parts[p].trim();
					if (segment === "r") {
						isReverse = !0
					} else {
						var parsedInt = parseInt(segment, 10);
						if (!isNaN(parsedInt)) {
							offset = parsedInt
						}
					}
				}
				if (usedVariables.hasOwnProperty(uniqueKey)) {
					return usedVariables[uniqueKey]
				}
				var currentI = variables.i;
				var totalLayers = variables.totalLayers || 1;
				var isSelectedMode = (typeof rdoOnlySelected !== "undefined") && rdoOnlySelected.value;
				var value;
				if (isReverse) {
					if (offset !== 0) {
						if (isSelectedMode) {
							var selIndex = getIndexInSelection(layer);
							var selCount = layer.containingComp.selectedLayers.length;
							var step = (selCount - selIndex);
							value = offset - step
						} else {
							var stepGlobal = (totalLayers - currentI);
							value = offset - stepGlobal
						}
					} else {
						if (isSelectedMode) {
							var selIndexZero = getIndexInSelection(layer);
							var selCountZero = layer.containingComp.selectedLayers.length;
							var stepZero = (selCountZero - selIndexZero);
							value = 1 + (stepZero * 0)
						} else {
							value = (totalLayers - currentI + 1)
						}
					}
				} else {
					if (!isPreview) {
						if (!incrementValues[uniqueKey]) {
							incrementValues[uniqueKey] = offset || 1
						}
						value = incrementValues[uniqueKey]++
					} else {
						var previewIndex = getPreviewLocalIndex(layer);
						value = (offset || 1) + (previewIndex - 1)
					}
				}
				usedVariables[uniqueKey] = value;
				return value
			} else if (match === 'I') {
				value = currentLocalIndex
			} else if (match === 'prop') {
				value = variables.prop
			} else if (match === 'attr') {
				value = variables.attr
			} else if (nthEffectIndex !== undefined) {
				var effectNumber = parseInt(nthEffectIndex, 10);
				value = getNthEffectName(layer, effectNumber, settings)
			} else if (nthMaskIndex !== undefined) {
				var maskNumber = parseInt(nthMaskIndex, 10);
				value = getNthMaskName(layer, maskNumber, settings)
			} else if (/[A-Z]/.test(match)) {
				value = variables[match]
			} else if (match === 'i') {
				value = variables.i
			} else if (match === 'S') {
				value = variables.S
			} else {
				value = ''
			}
			if (replaceFindStr !== undefined && replaceWithStr !== undefined) {
				function escapeRegExp(str) {
					return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
				}
				var safeFindStr = escapeRegExp(replaceFindStr);
				var replacedName = originalName.replace(new RegExp(safeFindStr, 'g'), replaceWithStr);
				return replacedName
			}
			return (value !== undefined && value !== "") ? value : ""
		});
		localIndex++;
		if (result === originalName || result === "") {
			return originalName
		}
		return result
	}

	function renameLayersByTemplate(allLayers, template, briefly, brieflyCase, showShyLocked, reverseOrder, ctrlKey, shiftKey, altKey, ctrlShift) {
		checkAndUpdateSettings();
		resetIncrementValues();
		var proj = app.project;
		var comp = (app.activeViewer && app.activeViewer.type === ViewerType.COMPOSITION) ? app.activeViewer.comp : proj.activeItem;
		if (comp && comp instanceof CompItem) {
			if (comp.numLayers > 0) {
				var settings = loadSettings();
				var nameApplySettings = settings.nameApply || {};
				var layerTypeMap = {
					"Shape": "shapeLayer",
					"Text": "textLayer",
					"Null": "nullObject",
					"Adjustment": "adjustmentLayer",
					"Footage": "footageLayer",
					"Solid": "solidLayer",
					"Pre-comp": "preComp",
					"Camera": "cameraLayer",
					"Light": "lightLayer",
					"Audio": "audioLayer"
				};
				app.beginUndoGroup("Rename Layers by Template");
				var orderedLayers = getLayerOrder(comp, allLayers, !1);
				var typeTotals = {};
				for (var i = 1; i <= comp.numLayers; i++) {
					var ly = comp.layer(i);
					var lt = getLayerType(ly);
					if (!typeTotals[lt]) { typeTotals[lt] = 0; }
					typeTotals[lt]++;
				}
				var typeCounter = {};
				var totalLayersInComp = comp.numLayers;
				var globalI = altKey ? totalLayersInComp : 1;
				var propertyPaths = getSelectedPropertyPaths();
				var layersToRename = [];
				localIndex = 1;
				for (var idx = 0; idx < orderedLayers.length; idx++) {
					var currentLayer = orderedLayers[idx];
					var layerType = getLayerType(currentLayer);
					var typeIndex = getTypeIndexInComp(currentLayer);
					var totalTypeLayers = typeTotals[layerType] || 1;
					var it = reverseOrder ? (totalTypeLayers - typeIndex + 1) : typeIndex;

					if ((!currentLayer.shy || showShyLocked) && !currentLayer.locked && (allLayers || currentLayer.selected)) {
						if (currentLayer instanceof ShapeLayer) {
							var applyKey = "shapeLayer";
						} else {
							var applyKey = layerTypeMap[layerType];
						}
						if (applyKey === undefined) { continue; }
						var shouldRename = nameApplySettings[applyKey];
						if (!shouldRename) { continue; }
						if (!typeCounter.hasOwnProperty(layerType)) {
							typeCounter[layerType] = altKey ? typeTotals[layerType] : 1;
						}
						if (altKey) {
							typeCounter[layerType]--;
						} else {
							typeCounter[layerType]++;
						}
						var attrNames = propertyPaths ? getAttributeNamesForLayer(currentLayer, propertyPaths) : [];
						var attrNameCombined = attrNames.length > 0 ? attrNames.join(", ") : "Attribute not selected";
						var propNames = propertyPaths ? getSelectedPropertyGroupNamesForLayer(currentLayer, propertyPaths) : [];
						var propNameCombined = propNames.length > 0 ? propNames.join(", ") : "Property not selected";
						var templateData = {
							totalLayers: totalLayersInComp,
							T: layerType,
							i: currentLayer.index,
							I: localIndex,
							it: it,
							O: currentLayer.name,
							E: getEffectNames(currentLayer, variableSettings),
							An: getAnimatedProperties(currentLayer, variableSettings),
							F: getFrameRate(currentLayer, variableSettings),
							R: getResolution(currentLayer, variableSettings),
							D: getDuration(currentLayer),
							Df: getDurationInFrames(currentLayer),
							C: comp.name,
							Ip: currentLayer.inPoint.toFixed(2),
							Op: currentLayer.outPoint.toFixed(2),
							S: getSourceName(currentLayer),
							W: getWidth(currentLayer, variableSettings),
							H: getHeight(currentLayer, variableSettings),
							Tm: getTrackMatteType(currentLayer, variableSettings),
							Ar: getAspectRatio(currentLayer, variableSettings),
							Ec: getEffectsCount(currentLayer, variableSettings),
							Pn: getProjectName(),
							Lpos: getLayerPosition(currentLayer),
							Lsc: getLayerScale(currentLayer),
							Lrot: getLayerRotation(currentLayer),
							Lops: getLayerOpacity(currentLayer),
							Lexp: getExpressionControlledProperties(currentLayer, variableSettings),
							Fext: getFileExtension(currentLayer, variableSettings),
							LpntIndex: getLayerParentIndex(currentLayer),
							Lpnt: getImmediateParentName(currentLayer),
							Lmc: getMaskCount(currentLayer, variableSettings),
							Lmn: getMaskNames(currentLayer, variableSettings),
							attr: attrNameCombined,
							prop: propNameCombined
						};
						var originalNameForReplace = currentLayer.name;
						var newName = replaceVariables(template, templateData, originalNameForReplace, currentLayer, variableSettings, !1);
						if (briefly) {
							switch (brieflyCase) {
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
						layersToRename.push({ layer: currentLayer, newName: newName });
					}
				}
				for (var j = 0; j < layersToRename.length; j++) {
					var renameItem = layersToRename[j];
					var layer = renameItem.layer;
					var newName = renameItem.newName;
					if (altKey) {
						layer.name = newName;
					} else if (ctrlKey) {
						layer.name = layer.name + newName;
					} else if (shiftKey) {
						layer.name = newName + layer.name;
					} else {
						layer.name = newName;
					}
					localIndex++;
				}
				app.endUndoGroup();
			} else {
				alert("В активной композиции нет слоёв.", scriptMessageHead_1);
			}
		} else {
			alert("В активной композиции нет слоёв.", scriptMessageHead_1);
		}
	}

	function getEffectNames(layer, settings, effectsFilter, customSeparator) {
		var effectNames = [];
		var effectNamesFilter = null;
		var separator = customSeparator || ", ";
		if (effectsFilter) {
			effectNamesFilter = effectsFilter.split(',').map(function (name) {
				return name.trim().toLowerCase()
			})
		}
		if (layer.property("ADBE Effect Parade") && layer.property("ADBE Effect Parade").numProperties > 0) {
			function checkEffects() {
				for (var j = 1; j <= layer.property("ADBE Effect Parade").numProperties; j++) {
					var effect = layer.property("ADBE Effect Parade").property(j);
					if (effectNamesFilter) {
						if (effectNamesFilter.indexOf(effect.name.toLowerCase()) !== -1) {
							effectNames.push(effect.name)
						}
					} else {
						effectNames.push(effect.name)
					}
				}
			}
			checkEffects();
			if (effectNames.length > 0) {
				return effectNames.join(separator)
			} else {
				if (settings && settings.E) {
					return settings.E.active ? settings.E.customValue : settings.E.defaultValue
				} else {
					return "NoEffects"
				}
			}
		} else {
			if (settings && settings.E) {
				return settings.E.active ? settings.E.customValue : settings.E.defaultValue
			} else {
				return "NoEffects"
			}
		}
	}
	checkAndCreateSettingsFile();
	checkAndCreateVariablesFile();
	checkNitroNamerLibraryFolder();
	var tooltipsFilePath = scriptFolderPath + "/NitroNamer/settings/tooltips.json";

	function checkAndCreateTooltipsFile() {
		var tooltipsFile = new File(tooltipsFilePath);
		if (!tooltipsFile.exists) {
			var initialSettingsScriptPath = scriptFolderPath + "/NitroNamer/settings/initialSettings.jsx";
			var initialSettingsScriptFile = new File(initialSettingsScriptPath);
			if (initialSettingsScriptFile.exists) {
				$.evalFile(initialSettingsScriptFile)
			} else {
				alert("Error: initialSettings.jsx not found at " + initialSettingsScriptPath, scriptMessageHead_1)
			}
			if (!tooltipsFile.exists) {
				var forceSettingsScriptPath = scriptFolderPath + "/NitroNamer/settings/forceSettings.jsx";
				var forceSettingsScriptFile = new File(forceSettingsScriptPath);
				if (forceSettingsScriptFile.exists) {
					$.evalFile(forceSettingsScriptFile)
				} else {
					alert("Error: forceSettings.jsx not found at " + forceSettingsScriptPath, scriptMessageHead_1)
				}
			}
		}
	}

	function loadTooltips() {
		var tooltipsFile = new File(tooltipsFilePath);
		if (tooltipsFile.exists) {
			var tooltipsData = readJSONFile(tooltipsFilePath);
			return tooltipsData
		} else {
			return null
		}
	}

	function getTooltip(buttonName, mode) {
		if (tooltipsData && tooltipsData.NitroNamer && tooltipsData.NitroNamer.tooltips && tooltipsData.NitroNamer.tooltips.buttons) {
			var key = mode ? buttonName + "_" + mode : buttonName;
			return tooltipsData.NitroNamer.tooltips.buttons[key] || tooltipsData.NitroNamer.tooltips.buttons[buttonName]
		}
		return ""
	}
	checkAndCreateTooltipsFile();
	var tooltipsData = loadTooltips();

	function applyTooltips(tooltipsData) {
		if (tooltipsData && tooltipsData.NitroNamer && tooltipsData.NitroNamer.tooltips) {
			var tooltips = tooltipsData.NitroNamer.tooltips;
			if (tooltips.buttons) {
				if (tooltips.buttons.btnCopy) {
					btnCopy.helpTip = tooltips.buttons.btnCopy
				}
				if (tooltips.buttons.btnFavorites) {
					btnFavorites.helpTip = tooltips.buttons.btnFavorites
				}
				if (tooltips.buttons.btnSave) {
					btnSave.helpTip = tooltips.buttons.btnSave
				}
				if (tooltips.buttons.btnCircleMinus) {
					btnCircleMinus.helpTip = tooltips.buttons.btnCircleMinus
				}
				if (tooltips.buttons.btnMinimize) {
					btnMinimize.helpTip = tooltips.buttons.btnMinimize
				}
				if (tooltips.buttons.btnRename) {
					btnRename.helpTip = tooltips.buttons.btnRename
				}
				if (tooltips.buttons.btnVariables) {
					btnVariables.helpTip = tooltips.buttons.btnVariables
				}
				if (tooltips.buttons.btnHelp) {
					btnHelp.helpTip = tooltips.buttons.btnHelp
				}
				if (tooltips.buttons.btnReset) {
					btnReset.helpTip = tooltips.buttons.btnReset
				}
				if (tooltips.buttons.btnSettings) {
					btnSettings.helpTip = tooltips.buttons.btnSettings
				}
			}
			if (tooltips.radioButtons) {
				if (tooltips.radioButtons.rdoAllLayers) {
					rdoAllLayers.helpTip = tooltips.radioButtons.rdoAllLayers
				}
				if (tooltips.radioButtons.rdoOnlySelected) {
					rdoOnlySelected.helpTip = tooltips.radioButtons.rdoOnlySelected
				}
			}
			if (tooltips.textFields) {
				if (tooltips.textFields.txtTemplate) {
					txtTemplate.helpTip = tooltips.textFields.txtTemplate
				}
			}
			if (tooltips.checkboxes) {
				if (tooltips.checkboxes.chkBriefly) {
					chkBriefly.helpTip = tooltips.checkboxes.chkBriefly
				}
			}
			if (tooltips.dropdowns) {
				if (tooltips.dropdowns.ddLayerMode) {
					ddLayerMode.helpTip = tooltips.dropdowns.ddLayerMode
				}
				if (tooltips.dropdowns.ddBrieflyType) {
					ddBrieflyType.helpTip = tooltips.dropdowns.ddBrieflyType
				}
			}
		}
	}


	win.addEventListener("mouseover", function () {
		var settingsData = loadSettings();
		if (settingsData.needGlobalUiReload === true) {
			settingsData.needGlobalUiReload = false;
			var settingsFilePath = new File($.fileName).path + "/NitroNamer/settings/settings.json";
			writeJSONFile(settingsFilePath, settingsData);

			applySettings(settingsData);
			updatePresetsDropdown(settingsData);
			updateLayerCounts();
			updatePreview();
			updateRenameButtonIcon();
		}
	});
	applyTooltips(tooltipsData);
	var settings = loadSettings();
	applySettings(settings);
	updateLayerCounts();
	updatePreview();
	updateRenameButtonIcon();
	if (win instanceof Window) {
		win.center();
		win.show()
	}
	return win
}
var myScriptPal = buildUI(this);
if (myScriptPal instanceof Panel) {
	myScriptPal.layout.layout(!0)
} else {
	myScriptPal.center();
	myScriptPal.show()
}