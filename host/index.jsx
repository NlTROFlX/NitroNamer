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
				//alert("Ошибка чтения настроек. Будут использованы настройки по умолчанию.");
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
				//alert("Ошибка чтения настроек.");
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
    // 1) Читаем главный settings.json внутри нашего расширения
    var mainSettingsFile = new File(rootPath + "/client/settings/settings.json");
    if (!mainSettingsFile.exists) {
        alert("Не найден файл настроек расширения:\n" + mainSettingsFile.fsName);
        return ""; // пустая строка вернется в колбэк, обработаем это на стороне JS
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
    
    // Проверяем ключ nnAeScriptUIPanelsPath
    var nnPath = mainSettingsData["nnAeScriptUIPanelsPath"];
    if (!nnPath || nnPath === "") {
        alert("Этап 1: Ключ 'nnAeScriptUIPanelsPath' отсутствует или пуст.");
        return "";
    } else {
        alert("Этап 1 пройден: найден nnAeScriptUIPanelsPath = " + nnPath);
    }
    
    // 2) Строим пути на основе nnAeScriptUIPanelsPath
    // Предположим, там в конце "NitroNamer.jsx" — заменим её на нужный путь
    var settingsPath = nnPath.replace(/NitroNamer\.jsx$/i, "NitroNamer\\settings\\settings.json");
    var variablesPath = nnPath.replace(/NitroNamer\.jsx$/i, "NitroNamer\\scripts\\variables.json");
    
    var settingsFile = new File(settingsPath);
    var variablesFile = new File(variablesPath);
    
    if (!settingsFile.exists || !variablesFile.exists) {
        alert(
            "Этап 2: Не найден один или оба из файлов:\n" +
            settingsFile.fsName + "\n" +
            variablesFile.fsName
        );
        return "";
    } else {
        alert("Этап 2 пройден: оба файла существуют.");
    }
    
    // 3) Считываем "settings.json" из NitroNamer\settings\ и ищем нужные ключи
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
    
    // Проверка нужных ключей
    var hasUserPresets       = userSettingsData.hasOwnProperty("userPresets");
    var hasNameApply         = userSettingsData.hasOwnProperty("nameApply");
    var hasSelectedLanguage  = userSettingsData.hasOwnProperty("selectedLanguage");
    
    // Проверка существования variables.json
    var variablesExists      = variablesFile.exists; // если существует, то [OK], иначе [Undefined]
    
    // Сформируем объект с итоговыми статусами для каждого <span>
    // [OK] – если ключ есть (или файл существует), [Undefined] – если нет
    var result = {
        spanPresets:         hasUserPresets      ? "[OK]" : "[Undefined]",
        spanRenamingOptions: hasNameApply        ? "[OK]" : "[Undefined]",
        spanTooltipLanguage: hasSelectedLanguage ? "[OK]" : "[Undefined]",
        spanVariableSettings: variablesExists    ? "[OK]" : "[Undefined]"
    };
    
    alert("Этап 3 пройден: проверка ключей и variables.json завершена.");
    
    // Возвращаем JSON-строку, чтобы JS смог в колбэке разобрать
    return JSON.stringify(result);
}
