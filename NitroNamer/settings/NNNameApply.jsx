// ===================
// ====== NNNameApply.jsx >>>

function buildApplyUI(a) {
    var e = a instanceof Panel ? a : new Window("palette", "NNNameApply", undefined, { resizeable: true });
    e.orientation = "column";
    e.alignChildren = ["fill", "top"];
    e.spacing = 10;
    e.margins = 10;

    var l = e.add("group");
    l.orientation = "row";
    l.alignChildren = ["fill", "center"];
    l.spacing = 10;

    var n = l.add("button", undefined, "Select All");
    n.size = [100, 25];
    var i = l.add("button", undefined, "Deselect All");
    i.size = [100, 25];

    var o = e.add("group");
    o.orientation = "column";
    o.alignChildren = ["left", "top"];
    o.spacing = 5;

    var layerTypes = ["Shape Layer", "Text Layer", "Null Object", "Adjustment Layer", "Footage Layer", "Solid Layer", "Pre-Comp", "Camera Layer", "Light Layer"];
    var checkboxKeys = ["shapeLayer", "textLayer", "nullObject", "adjustmentLayer", "footageLayer", "solidLayer", "preComp", "cameraLayer", "lightLayer"];
    var t = [];

    // Определение пути к settings.json
    var scriptFile = new File($.fileName);
    var scriptFolderPath = scriptFile.path;
    var settingsFilePath = scriptFolderPath + "/settings.json";
    var settingsFile = new File(settingsFilePath);

    // Функции для чтения и записи JSON
    function readJSONFile(filePath) {
        var file = new File(filePath);
        var data = {};
        if (file.exists) {
            file.open("r");
            try {
                data = eval("(" + file.read() + ")");
            } catch (e) {
                alert("Ошибка при разборе JSON-файла: " + filePath, "Ошибка");
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

    // Функция для инициализации settings.json, если он не существует
    function initializeSettings() {
        if (!settingsFile.exists) {
            var defaultSettings = {
                "userPresets": {},
                "currentSettings": {},
                "selectedLanguage": "Russian",
                "nameApply": {
                    "shapeLayer": false,
                    "textLayer": false,
                    "nullObject": false,
                    "adjustmentLayer": false,
                    "footageLayer": false,
                    "solidLayer": false,
                    "preComp": false,
                    "cameraLayer": false,
                    "lightLayer": false
                }
            };
            writeJSONFile(settingsFilePath, defaultSettings);
        } else {
            // Проверка наличия раздела "nameApply" и его ключей
            var existingSettings = readJSONFile(settingsFilePath);
            if (!existingSettings.nameApply) {
                existingSettings.nameApply = {
                    "shapeLayer": false,
                    "textLayer": false,
                    "nullObject": false,
                    "adjustmentLayer": false,
                    "footageLayer": false,
                    "solidLayer": false,
                    "preComp": false,
                    "cameraLayer": false,
                    "lightLayer": false
                };
                writeJSONFile(settingsFilePath, existingSettings);
            } else {
                // Убедиться, что все ключи присутствуют
                var defaultNameApply = {
                    "shapeLayer": false,
                    "textLayer": false,
                    "nullObject": false,
                    "adjustmentLayer": false,
                    "footageLayer": false,
                    "solidLayer": false,
                    "preComp": false,
                    "cameraLayer": false,
                    "lightLayer": false
                };
                for (var key in defaultNameApply) {
                    if (defaultNameApply.hasOwnProperty(key) && existingSettings.nameApply[key] === undefined) {
                        existingSettings.nameApply[key] = defaultNameApply[key];
                    }
                }
                writeJSONFile(settingsFilePath, existingSettings);
            }
        }
    }

    // Инициализация настроек при запуске
    initializeSettings();

    // Чтение текущих настроек
    var currentSettings = readJSONFile(settingsFilePath);

    // Создание чекбоксов
    for (var p = 0; p < layerTypes.length; p++) {
        var d = o.add("checkbox", undefined, layerTypes[p]);
        d.value = currentSettings.nameApply[checkboxKeys[p]];
        t.push(d);
    }

    // Функция для обновления settings.json при изменении состояния чекбокса
    function updateSettings(key, value) {
        var settings = readJSONFile(settingsFilePath);
        if (!settings.nameApply) {
            settings.nameApply = {};
        }
        settings.nameApply[key] = value;
        writeJSONFile(settingsFilePath, settings);
    }

    // Добавление обработчиков событий для чекбоксов
    for (var p = 0; p < t.length; p++) {
        (function(index) {
            t[index].onClick = function() {
                updateSettings(checkboxKeys[index], this.value);
            }
        })(p);
    }

    // Обработчики кнопок "Select All" и "Deselect All"
    n.onClick = function() {
        for (var a = 0; a < t.length; a++) {
            t[a].value = true;
            updateSettings(checkboxKeys[a], true);
        }
    }

    i.onClick = function() {
        for (var a = 0; a < t.length; a++) {
            t[a].value = false;
            updateSettings(checkboxKeys[a], false);
        }
    }

    e.layout.layout(true);
    e.layout.resize();

    return e;
}

// Создание и отображение панели
var applyPanel = buildApplyUI(this);
if (applyPanel instanceof Window) {
    applyPanel.center();
    applyPanel.show();
} else {
    applyPanel.layout.layout(true);
}

// ===================
