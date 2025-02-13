if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
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

    var exportResult = {
        spanPresets: "[Undefined]",
        spanRenamingOptions: "[Undefined]",
        spanTooltipLanguage: "[Undefined]",
        spanVariableSettings: "[Undefined]",
        exportPath1: "Undefined",
        exportPath2: "Undefined",
        exportPath3: "Undefined",
        exportUserPresets: "",
        exportNameApply: "",
        exportSelectedLanguage: "",
        exportVariables: ""
    };

    var extensionSettingsFile = new File(extensionPath + "/client/settings/settings.json");
    if (!extensionSettingsFile.exists) {
        alert("Не найден файл настроек расширения:\n" + extensionSettingsFile.fsName + "\nПродолжаем проверку без него.");
        return JSON.stringify(exportResult);
    }
    if (!extensionSettingsFile.open("r")) {
        alert("Не удалось открыть файл настроек расширения:\n" + extensionSettingsFile.fsName);
        return JSON.stringify(exportResult);
    }
    var extensionSettingsContent = extensionSettingsFile.read();
    extensionSettingsFile.close();
    var extensionSettingsData;
    try {
        extensionSettingsData = JSON.parse(extensionSettingsContent);
    } catch (error) {
        alert("Не удалось прочитать/распарсить JSON настроек расширения:\n" + extensionSettingsFile.fsName + "\n" + error);
        return JSON.stringify(exportResult);
    }

    exportResult.exportPath1 = extensionSettingsFile.fsName;
    if (!extensionSettingsData || !extensionSettingsData.nnAeScriptUIPanelsPath) {
        alert("Ключ 'nnAeScriptUIPanelsPath' отсутствует или пуст.");
        return JSON.stringify(exportResult);
    }

    var panelsPath = extensionSettingsData.nnAeScriptUIPanelsPath;
    var nitroSettingsPath = panelsPath.replace(/NitroNamer\.jsx$/i, "NitroNamer/settings/settings.json");
    var variablesPath = panelsPath.replace(/NitroNamer\.jsx$/i, "NitroNamer/scripts/variables.json");

    var nitroSettingsFile = new File(nitroSettingsPath);
    var variablesFile = new File(variablesPath);
    var nitroSettingsExists = nitroSettingsFile.exists;
    var variablesFileExists = variablesFile.exists;

    if (nitroSettingsExists) {
        exportResult.exportPath2 = nitroSettingsFile.fsName;
    }
    if (variablesFileExists) {
        exportResult.exportPath3 = variablesFile.fsName;
    }

    if (nitroSettingsExists) {
        if (nitroSettingsFile.open("r")) {
            var nitroSettingsContent = nitroSettingsFile.read();
            nitroSettingsFile.close();
            try {
                var nitroSettingsData = JSON.parse(nitroSettingsContent);

                if (nitroSettingsData.hasOwnProperty("userPresets")) {
                    exportResult.spanPresets = "[OK]";
                    exportResult.exportUserPresets = JSON.stringify({ "userPresets": nitroSettingsData.userPresets }, null, 4);
                } else {
                    exportResult.spanPresets = "[Undefined]";
                }

                if (nitroSettingsData.hasOwnProperty("nameApply")) {
                    exportResult.spanRenamingOptions = "[OK]";
                    exportResult.exportNameApply = JSON.stringify({ "nameApply": nitroSettingsData.nameApply }, null, 4);
                } else {
                    exportResult.spanRenamingOptions = "[Undefined]";
                }

                if (nitroSettingsData.hasOwnProperty("selectedLanguage")) {
                    exportResult.spanTooltipLanguage = "[OK]";
                    exportResult.exportSelectedLanguage = JSON.stringify({ "selectedLanguage": nitroSettingsData.selectedLanguage }, null, 4);
                } else {
                    exportResult.spanTooltipLanguage = "[Undefined]";
                }
                exportResult.spanVariableSettings = variablesFileExists ? "[OK]" : "[Undefined]";
            } catch (error) {
                alert("Не удалось распарсить JSON из NitroNamer settings:\n" + nitroSettingsFile.fsName + "\n" + error);
            }
        } else {
            alert("Не удалось открыть NitroNamer settings.json:\n" + nitroSettingsFile.fsName);
        }
    } else {
        alert("Этап 2: Не найден файл NitroNamer settings.json:\n" + nitroSettingsFile.fsName + "\nПродолжаем проверку без него.");
    }

    if (variablesFileExists) {
        if (variablesFile.open("r")) {
            var variablesContent = variablesFile.read();
            variablesFile.close();
            try {
                var variablesData = JSON.parse(variablesContent);
                exportResult.exportVariables = JSON.stringify(variablesData, null, 4);
            } catch (error) {
                exportResult.exportVariables = "";
                alert("Не удалось распарсить JSON из файла variables.json:\n" + variablesFile.fsName + "\n" + error);
            }
        } else {
            alert("Не удалось открыть файл variables.json:\n" + variablesFile.fsName);
        }
    }
    return JSON.stringify(exportResult);
}

function checkImportPaths(e) {
    e = e.replace(/\\/g, "/");
    var t = {
        exportPath1: "Undefined",
        exportPath2: "Undefined",
    };
    var n = new File(e + "/client/settings/settings.json");
    if (!n.exists)
        return alert("Не найден файл настроек расширения:\n" + n.fsName + "\nПродолжаем проверку без него."), JSON.stringify(t);
    if (!n.open("r"))
        return alert("Не удалось открыть файл настроек расширения:\n" + n.fsName), JSON.stringify(t);
    var r, s = n.read();
    n.close();
    try {
        r = JSON.parse(s);
    } catch (e) {
        return alert("Не удалось прочитать/распарсить JSON настроек расширения:\n" + n.fsName + "\n" + e), JSON.stringify(t);
    }

    if (!r || !r.nnAeScriptUIPanelsPath) {
        return alert("Ключ 'nnAeScriptUIPanelsPath' отсутствует или пуст."), JSON.stringify(t);
    }

    var originalPath = r.nnAeScriptUIPanelsPath;
    originalPath = originalPath.replace(/\//g, '\\');
    var lowerPath = originalPath.toLowerCase();
    var idx = lowerPath.indexOf("\\nitronamer");
    var parentPath = originalPath;
    if (idx !== -1) {
        parentPath = originalPath.substring(0, idx);
    }
    t.exportPath2 = parentPath + "\\NitroNamer.jsx";
    return JSON.stringify(t);
}


function exportToJson(e, t) {
    var n = Folder.selectDialog("Select the location where the exported settings will be created\nSelect the location where the exported settings will be created.");
    if (n == null) {

        return "export_cancel";
    }
    if (e && e.length > 0) {
        var r = new File(n.fsName + "/settings.json");
        r.open("w") ? (r.encoding = "UTF8", r.write(e), r.close()) : alert("Не удалось открыть файл для записи: " + r.fsName);
    }
    if (t && t.length > 0) {
        var s = new File(n.fsName + "/variables.json");
        s.open("w") ? (s.encoding = "UTF8", s.write(t), s.close()) : alert("Не удалось открыть файл для записи: " + s.fsName);
    }

    return "export_success|" + n.fsName;
}

function replaceSettingsFile(selectedFilePath, newFilePath) {
    var file = new File(selectedFilePath);
    var newPath = new File(newFilePath);

    if (file.exists) {
        if (newPath.exists) {
            newPath.remove();
        }

        file.copy(newPath.fsName);

        return "success";
    } else {
        return "failure";
    }
}