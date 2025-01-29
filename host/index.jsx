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

function checkExportPaths(rootPath) {

    var mainSettingsFile = new File(rootPath + "/client/settings/settings.json");
    if (!mainSettingsFile.exists) {
        alert("Не найден settings.json расширения:\n" + mainSettingsFile.fsName);
        return ""; 
    }
    if (!mainSettingsFile.open("r")) {
        alert("Не удалось открыть для чтения:\n" + mainSettingsFile.fsName);
        return "";
    }

    var mainSettingsData;
    try {
        var raw = mainSettingsFile.read();
        mainSettingsData = JSON.parse(raw);
    } catch (e) {
        alert("Не удалось распарсить JSON:\n" + mainSettingsFile.fsName + "\n" + e);
        mainSettingsFile.close();
        return "";
    }
    mainSettingsFile.close();

    var nnPath = mainSettingsData["nnAeScriptUIPanelsPath"];
    if (!nnPath || nnPath === "") {
        alert("Ключ 'nnAeScriptUIPanelsPath' отсутствует или пуст.");
        return "";
    }

    var settingsPath = nnPath.replace(/NitroNamer\.jsx$/i, "NitroNamer\\settings\\settings.json");
    var variablesPath = nnPath.replace(/NitroNamer\.jsx$/i, "NitroNamer\\scripts\\variables.json");

    var settingsFile = new File(settingsPath);
    var variablesFile = new File(variablesPath);

    if (!settingsFile.exists) {
        alert("Этап 2: Не найден settings.json для NitroNamer:\n" + settingsFile.fsName + "\nПрерываем проверку.");
        return "";
    }

    var haveVariablesFile = true;
    if (!variablesFile.exists) {
        haveVariablesFile = false;
    }

    if (!settingsFile.open("r")) {
        alert("Не удалось открыть для чтения:\n" + settingsFile.fsName);
        return "";
    }

    var userSettingsData;
    try {
        var raw2 = settingsFile.read();
        userSettingsData = JSON.parse(raw2);
    } catch (e) {
        alert("Не удалось распарсить JSON:\n" + settingsFile.fsName + "\n" + e);
        settingsFile.close();
        return "";
    }
    settingsFile.close();

    var hasUserPresets      = userSettingsData.hasOwnProperty("userPresets");
    var hasNameApply        = userSettingsData.hasOwnProperty("nameApply");
    var hasSelectedLanguage = userSettingsData.hasOwnProperty("selectedLanguage");

    var variablesExists = haveVariablesFile; 

    var result = {
        spanPresets:         hasUserPresets       ? "[OK]" : "[Undefined]",
        spanRenamingOptions: hasNameApply         ? "[OK]" : "[Undefined]",
        spanTooltipLanguage: hasSelectedLanguage  ? "[OK]" : "[Undefined]",
        spanVariableSettings: variablesExists     ? "[OK]" : "[Undefined]"
    };

    return JSON.stringify(result);
}