function saveSelectedLanguage(selectedLanguage, extensionPath) {
    // Заменяем обратные слэши на прямые для кроссплатформенной совместимости
    extensionPath = extensionPath.replace(/\\/g, '/');

    // Строим путь к папке settings
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

    // Если файл существует, читаем его
    if (settingsFile.exists) {
        if (settingsFile.open('r')) {
            var content = settingsFile.read();
            settingsFile.close();
            try {
                settings = JSON.parse(content);
            } catch (e) {
                alert("Ошибка чтения настроек. Будут использованы настройки по умолчанию.");
                settings = {};
            }
        } else {
            alert("Не удалось открыть файл настроек для чтения.");
            return;
        }
    }

    // Обновляем настройку языка
    settings.language = selectedLanguage;

    // Записываем настройки в файл
    if (settingsFile.open('w')) {
        settingsFile.write(JSON.stringify(settings, null, 4));
        settingsFile.close();
    } else {
        alert("Не удалось открыть файл настроек для записи.");
    }
}

function loadSettings(extensionPath) {
    // Заменяем обратные слэши на прямые для кроссплатформенной совместимости
    extensionPath = extensionPath.replace(/\\/g, '/');

    // Строим путь к файлу настроек
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
                alert("Ошибка чтения настроек.");
                settings = {};
            }
        } else {
            alert("Не удалось открыть файл настроек для чтения.");
        }
    }

    return JSON.stringify(settings);
}

function readTranslationFile(language, extensionPath) {
    // Заменяем обратные слэши на прямые для кроссплатформенной совместимости
    extensionPath = extensionPath.replace(/\\/g, '/');

    // Строим путь к файлу перевода
    var translationFilePath = extensionPath + '/client/translations/' + language.toLowerCase() + '.json';
    var translationFile = new File(translationFilePath);

    var content = '';

    if (translationFile.exists) {
        if (translationFile.open('r')) {
            content = translationFile.read();
            translationFile.close();
        } else {
            // Не удалось открыть файл для чтения
            content = '';
        }
    } else {
        // Файл перевода не найден
        content = '';
    }

    // Возвращаем содержимое файла
    return content;
}
