if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

function saveSelectedLanguage(selectedLanguage, extensionPath) {
	extensionPath = extensionPath.replace(/\\/g, '/');
	var settingsFolderPath = extensionPath + '/client/settings';
	var settingsFolder = new Folder(settingsFolderPath);
	if (!settingsFolder.exists) {
		var created = settingsFolder.create();
		if (!created) {
			alert("Не удалось создать папку настроек.");
			return;
		}
	}
	var settingsFilePath = settingsFolderPath + '/settings.json';
	var settingsFile = new File(settingsFilePath);
	var settings = {};
	if (settingsFile.exists) {
		if (settingsFile.open('r')) {
			var content = settingsFile.read();
			settingsFile.close();
			try {
				settings = JSON.parse(content);
			} catch (e) {

				settings = {};
			}
		} else {
			alert("Не удалось открыть файл настроек для чтения.");
			return;
		}
	}
	settings.language = selectedLanguage;
	if (settingsFile.open('w')) {
		settingsFile.write(JSON.stringify(settings, null, 4));
		settingsFile.close();
	} else {
		alert("Не удалось открыть файл настроек для записи.");
	}
}

function loadSettings(extensionPath) {
	extensionPath = extensionPath.replace(/\\/g, '/');
	var settingsFilePath = extensionPath + '/client/settings/settings.json';
	var settingsFile = new File(settingsFilePath);
	var settings = {};
	if (settingsFile.exists) {
		if (settingsFile.open('r')) {
			var content = settingsFile.read();
			settingsFile.close();
			try {
				settings = JSON.parse(content);
			} catch (e) {

				settings = {};
			}
		} else {
			alert("Не удалось открыть файл настроек для чтения.");
		}
	}
	return JSON.stringify(settings);
}

function readTranslationFile(language, extensionPath) {
	extensionPath = extensionPath.replace(/\\/g, '/');
	var translationFilePath = extensionPath + '/client/translations/' + language.toLowerCase() + '.json';
	var translationFile = new File(translationFilePath);
	var content = '';
	if (translationFile.exists) {
		if (translationFile.open('r')) {
			translationFile.encoding = 'UTF-8';
			content = translationFile.read();
			translationFile.close();
		} else {
			content = '';
		}
	} else {
		content = '';
	}
	return content;
}

function checkExportPaths(extensionPath) {
    extensionPath = extensionPath.replace(/\\/g, "/");

    var resultData = {
        spanPresets: "[Undefined]",
        spanRenamingOptions: "[Undefined]",
        spanTooltipLanguage: "[Undefined]",
        spanVariableSettings: "[Undefined]",
        exportPath1: "Undefined",  
        exportPath2: "Undefined",  
        exportPath3: "Undefined"   
    };

    var extensionSettingsFile = new File(extensionPath + "/client/settings/settings.json");
    if (!extensionSettingsFile.exists) {
        alert("Не найден файл настроек расширения:\n" + extensionSettingsFile.fsName + "\nПродолжаем проверку без него.");
        return JSON.stringify(resultData);
    }

    if (!extensionSettingsFile.open("r")) {
        alert("Не удалось открыть файл настроек расширения:\n" + extensionSettingsFile.fsName);
        return JSON.stringify(resultData);
    }

    var extensionSettingsContent = extensionSettingsFile.read();
    extensionSettingsFile.close();

    var extensionSettings;
    try {
        extensionSettings = JSON.parse(extensionSettingsContent);
    } catch (errParse) {
        alert("Не удалось прочитать/распарсить JSON настроек расширения:\n" + extensionSettingsFile.fsName + "\n" + errParse);
        return JSON.stringify(resultData);
    }

    if (extensionSettingsFile.exists) {
        resultData.exportPath1 = extensionSettingsFile.fsName;
    }

    if (!extensionSettings || !extensionSettings.nnAeScriptUIPanelsPath) {
        alert("Ключ 'nnAeScriptUIPanelsPath' отсутствует или пуст.");
        return JSON.stringify(resultData);
    }
    var nnAeScriptPath = extensionSettings.nnAeScriptUIPanelsPath;

    var nitroSettingsPath  = nnAeScriptPath.replace(/NitroNamer\.jsx$/i, "NitroNamer/settings/settings.json");
    var nitroVariablesPath = nnAeScriptPath.replace(/NitroNamer\.jsx$/i, "NitroNamer/scripts/variables.json");

    var nitroSettingsFile  = new File(nitroSettingsPath);
    var nitroVariablesFile = new File(nitroVariablesPath);

    var nitroSettingsExists  = nitroSettingsFile.exists;
    var nitroVariablesExists = nitroVariablesFile.exists;

    if (nitroSettingsExists) {
        resultData.exportPath2 = nitroSettingsFile.fsName;
    }
    if (nitroVariablesExists) {
        resultData.exportPath3 = nitroVariablesFile.fsName;
    }

    if (nitroSettingsExists) {
        if (nitroSettingsFile.open("r")) {
            var nitroSettingsContent = nitroSettingsFile.read();
            nitroSettingsFile.close();
            try {
                var nitroJson = JSON.parse(nitroSettingsContent);

                resultData.spanPresets          = nitroJson.hasOwnProperty("userPresets")      ? "[OK]" : "[Undefined]";
                resultData.spanRenamingOptions  = nitroJson.hasOwnProperty("nameApply")        ? "[OK]" : "[Undefined]";
                resultData.spanTooltipLanguage  = nitroJson.hasOwnProperty("selectedLanguage") ? "[OK]" : "[Undefined]";
                resultData.spanVariableSettings = nitroVariablesExists                         ? "[OK]" : "[Undefined]";
            } catch (e) {
                alert("Не удалось распарсить JSON из NitroNamer settings:\n" + nitroSettingsFile.fsName + "\n" + e);
            }
        } else {
            alert("Не удалось открыть NitroNamer settings.json:\n" + nitroSettingsFile.fsName);
        }
    } else {
        alert("Этап 2: Не найден файл NitroNamer settings.json:\n" + nitroSettingsFile.fsName + "\nПродолжаем проверку без него.");
    }

    return JSON.stringify(resultData);
}

function exportToJson() {
    var saveFile = File.saveDialog("Сохранить JSON файл", "*.json");
    if (saveFile) {

        if (saveFile.name.slice(-5).toLowerCase() !== ".json") {
            saveFile = new File(saveFile.fsName + ".json");
        }
        if (saveFile.open("w")) {
            saveFile.encoding = "UTF8";
            saveFile.write("{}"); 
            saveFile.close();

            return "Файл успешно сохранён: " + saveFile.fsName;
        } else {
            return "Не удалось открыть файл для записи.";
        }
    } else {
        return "Сохранение отменено пользователем.";
    }
}