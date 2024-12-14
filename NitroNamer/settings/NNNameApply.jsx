// ===================
// ====== NNNameApply.jsx >>>

function buildApplyUI(a) {
    var e = a instanceof Panel ? a : new Window("palette", "NitroNamer - Type filter", undefined, { resizeable: true });
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
    o.orientation = "row"; // Родительская группа для двух колонок
    o.alignChildren = ["left", "top"];
    o.spacing = 10;

    // Создаём две дочерние группы для колонок
    var col1 = o.add("group");
    col1.orientation = "column";
    col1.alignChildren = ["left", "top"];
    col1.spacing = 5;

    var col2 = o.add("group");
    col2.orientation = "column";
    col2.alignChildren = ["left", "top"];
    col2.spacing = 5;

    // Добавляем "Audio Layer" в массив типов слоёв
    var layerTypes = ["Shape Layer", "Text Layer", "Null Object", "Adjustment Layer", "Footage Layer", "Solid Layer", "Pre-Comp", "Camera Layer", "Light Layer", "Audio Layer"];
    var checkboxKeys = ["shapeLayer", "textLayer", "nullObject", "adjustmentLayer", "footageLayer", "solidLayer", "preComp", "cameraLayer", "lightLayer", "audioLayer"];
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
                    "lightLayer": false,
                    "audioLayer": false  // Добавляем Audio Layer
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
                    "lightLayer": false,
                    "audioLayer": false  // Добавляем Audio Layer
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
                    "lightLayer": false,
                    "audioLayer": false  // Добавляем Audio Layer
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

    // Создание чекбоксов и распределение их по колонкам
    for (var p = 0; p < layerTypes.length; p++) {
        var d;
        if (p < Math.ceil(layerTypes.length / 2)) {
            d = col1.add("checkbox", undefined, layerTypes[p]);
        } else {
            d = col2.add("checkbox", undefined, layerTypes[p]);
        }
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
