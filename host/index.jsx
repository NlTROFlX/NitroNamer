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

    var result = {
        spanPresets: "[Undefined]",
        spanRenamingOptions: "[Undefined]",
        spanTooltipLanguage: "[Undefined]",
        spanVariableSettings: "[Undefined]"
    };

    var extensionSettingsFile = new File(rootPath + "/client/settings/settings.json");
    if (extensionSettingsFile.exists) {
        if (!extensionSettingsFile.open("r")) {
            alert(
                "Не удалось открыть файл настроек расширения:\n" + extensionSettingsFile.fsName
            );

        } else {
            var extensionSettingsContent;
            var extensionSettingsJson;

            try {
                extensionSettingsContent = extensionSettingsFile.read();
                extensionSettingsJson = JSON.parse(extensionSettingsContent);
            } catch (err) {
                alert(
                    "Не удалось прочитать/распарсить JSON настроек расширения:\n" +
                        extensionSettingsFile.fsName + "\n" +
                        err
                );
                extensionSettingsFile.close();
            }
            extensionSettingsFile.close();

            if (extensionSettingsJson && extensionSettingsJson.nnAeScriptUIPanelsPath) {
                var nnAeScriptUIPanelsPath = extensionSettingsJson.nnAeScriptUIPanelsPath;

                var nitroNamerSettingsPath = nnAeScriptUIPanelsPath.replace(
                    /NitroNamer\.jsx$/i,
                    "NitroNamer\\settings\\settings.json"
                );
                var nitroNamerVariablesPath = nnAeScriptUIPanelsPath.replace(
                    /NitroNamer\.jsx$/i,
                    "NitroNamer\\scripts\\variables.json"
                );

                var nitroNamerSettingsFile = new File(nitroNamerSettingsPath);
                var nitroNamerVariablesFile = new File(nitroNamerVariablesPath);

                var variablesJsonExists = nitroNamerVariablesFile.exists;

                if (nitroNamerSettingsFile.exists) {
                    if (nitroNamerSettingsFile.open("r")) {
                        try {
                            var nitroNamerSettingsContent = nitroNamerSettingsFile.read();
                            var nitroNamerSettingsJson = JSON.parse(nitroNamerSettingsContent);

                            result.spanPresets = nitroNamerSettingsJson.hasOwnProperty("userPresets")
                                ? "[OK]"
                                : "[Undefined]";
                            result.spanRenamingOptions = nitroNamerSettingsJson.hasOwnProperty("nameApply")
                                ? "[OK]"
                                : "[Undefined]";
                            result.spanTooltipLanguage = nitroNamerSettingsJson.hasOwnProperty("selectedLanguage")
                                ? "[OK]"
                                : "[Undefined]";

                            result.spanVariableSettings = variablesJsonExists ? "[OK]" : "[Undefined]";
                        } catch (err) {
                            alert(
                                "Не удалось распарсить JSON из NitroNamer settings:\n" +
                                    nitroNamerSettingsFile.fsName + "\n" +
                                    err
                            );
                        }
                        nitroNamerSettingsFile.close();
                    } else {
                        alert(
                            "Не удалось открыть NitroNamer settings.json:\n" + nitroNamerSettingsFile.fsName
                        );
                    }
                } else {

                    alert(
                        "Этап 2: Не найден файл NitroNamer settings.json:\n" +
                            nitroNamerSettingsFile.fsName + "\n" +
                            "Продолжаем проверку без него."
                    );
                }
            } else {
                alert("Ключ 'nnAeScriptUIPanelsPath' отсутствует или пуст.");
            }
        }
    } else {

        alert(
            "Не найден файл настроек расширения:\n" +
            extensionSettingsFile.fsName + "\n" +
            "Продолжаем проверку без него."
        );
    }

    return JSON.stringify(result);
}