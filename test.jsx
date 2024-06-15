(function () {
    // Создание UI окна
    var myWindow = new Window("palette", "Сохранение текста в JSON", undefined);
    myWindow.orientation = "column";

    // Текстовое поле
    var textField = myWindow.add("edittext", undefined, "Введите текст");
    textField.size = [300, 25];

    // Кнопка "Сохранить"
    var saveButton = myWindow.add("button", undefined, "Сохранить");

    // Выпадающий список
    var dropdown = myWindow.add("dropdownlist", undefined, []);
    dropdown.size = [300, 25];
    dropdown.selection = null;

    // Функция для загрузки данных из JSON файла
    function loadJsonData() {
        var scriptFile = new File($.fileName);
        var scriptFolder = scriptFile.path;
        var jsonFilePath = scriptFolder + "/NitroNamer/user/UserTemplatePresets.json";
        var jsonFile = new File(jsonFilePath);

        var jsonData = [];
        if (jsonFile.exists) {
            jsonFile.encoding = "UTF-8"; // Устанавливаем кодировку на UTF-8
            jsonFile.open("r");
            var fileContent = jsonFile.read();
            jsonFile.close();

            if (fileContent) {
                try {
                    jsonData = JSON.parse(fileContent);
                    if (!Array.isArray(jsonData)) {
                        jsonData = [];
                    }
                } catch (parseError) {
                    alert("Ошибка парсинга JSON: " + parseError.message);
                    jsonData = [];
                }
            }
        }
        return jsonData;
    }

    // Функция для создания папок, если их нет
    function createFoldersIfNotExist() {
        var scriptFile = new File($.fileName);
        var scriptFolder = scriptFile.path;
        var userFolder = new Folder(scriptFolder + "/NitroNamer/user");

        if (!userFolder.exists) {
            userFolder.create();
        }
    }

    // Функция для проверки уникальности текста
    function isTextUnique(jsonData, text) {
        for (var i = 0; i < jsonData.length; i++) {
            if (jsonData[i].textbox1 === text) {
                return false;
            }
        }
        return true;
    }

    // Функция для сортировки данных
    function sortJsonData(jsonData) {
        jsonData.sort(function(a, b) {
            return a.textbox1.localeCompare(b.textbox1);
        });
    }

    // Функция для сохранения текста в JSON файл
    function saveTextToJson(text) {
        try {
            var scriptFile = new File($.fileName);
            var scriptFolder = scriptFile.path;
            createFoldersIfNotExist();
            var jsonFilePath = scriptFolder + "/NitroNamer/user/UserTemplatePresets.json";
            var jsonFile = new File(jsonFilePath);

            var jsonData = loadJsonData();

            // Проверка уникальности текста
            if (!isTextUnique(jsonData, text)) {
                alert("Текст уже существует в файле JSON.");
                return;
            }

            // Добавление нового текста в массив
            jsonData.push({ textbox1: text });

            // Сортировка данных
            sortJsonData(jsonData);

            // Запись обновленного массива в файл
            jsonFile.encoding = "UTF-8"; // Устанавливаем кодировку на UTF-8
            jsonFile.open("w");
            jsonFile.write(JSON.stringify(jsonData, null, 4)); // Форматирование JSON с отступами
            jsonFile.close();
        } catch (error) {
            alert("Ошибка: " + error.message);
        }
    }

    // Обновление выпадающего списка
    function updateDropdown() {
        dropdown.removeAll();
        var jsonData = loadJsonData();
        for (var i = 0; i < jsonData.length; i++) {
            var itemText = jsonData[i].textbox1;
            dropdown.add("item", itemText);
        }
        if (jsonData.length > 0) {
            dropdown.selection = 0;
        }
    }

    // Обработчик события нажатия на кнопку "Сохранить"
    saveButton.onClick = function () {
        try {
            var text = textField.text;
            if (text.trim() === "") {
                alert("Пожалуйста, введите текст.");
                return;
            }
            saveTextToJson(text);
            alert("Текст добавлен в JSON файл!");
            updateDropdown();
        } catch (error) {
            alert("Ошибка при сохранении: " + error.message);
        }
    };

    // Инициализация выпадающего списка при запуске скрипта
    updateDropdown();

    myWindow.center();
    myWindow.show();
})();
