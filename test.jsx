(function () {
    // Создание UI окна
    var myWindow = new Window("palette", "Сохранение текста в JSON", undefined);
    myWindow.orientation = "column";

    // Текстовое поле
    var textField = myWindow.add("edittext", undefined, "Введите текст");
    textField.size = [300, 25];

    // Кнопка "Сохранить"
    var saveButton = myWindow.add("button", undefined, "Сохранить");

    // Группа для выпадающего списка и кнопки удаления
    var dropdownGroup = myWindow.add("group", undefined);
    dropdownGroup.orientation = "row";

    // Выпадающий список
    var dropdown = dropdownGroup.add("dropdownlist", undefined, []);
    dropdown.size = [270, 25];
    dropdown.selection = null;

    // Кнопка "Удалить"
    var deleteButton = dropdownGroup.add("button", undefined, "Удалить");
    deleteButton.size = [30, 25];

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
                return false; // Прекращаем выполнение функции, если текст не уникален
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
            return true; // Успешное выполнение функции
        } catch (error) {
            alert("Ошибка: " + error.message);
            return false; // Ошибка выполнения функции
        }
    }

    // Функция для удаления текста из JSON файла
    function deleteTextFromJson(text) {
        try {
            var scriptFile = new File($.fileName);
            var scriptFolder = scriptFile.path;
            var jsonFilePath = scriptFolder + "/NitroNamer/user/UserTemplatePresets.json";
            var jsonFile = new File(jsonFilePath);

            var jsonData = loadJsonData();

            // Удаление текста из массива
            jsonData = jsonData.filter(function (item) {
                return item.textbox1 !== text;
            });

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

        if (jsonData.length === 0) {
            var noTemplatesItem = dropdown.add("item", "Нету сохраненных шаблонов");
            dropdown.selection = noTemplatesItem;
        } else {
            for (var i = 0; i < jsonData.length; i++) {
                var itemText = jsonData[i].textbox1;
                dropdown.add("item", itemText);
            }
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
            var success = saveTextToJson(text);
            if (success) {
                alert("Текст добавлен в JSON файл!");
                updateDropdown();
            }
        } catch (error) {
            alert("Ошибка при сохранении: " + error.message);
        }
    };

    // Обработчик события нажатия на кнопку "Удалить"
    deleteButton.onClick = function () {
        try {
            var selectedItem = dropdown.selection;
            if (selectedItem === null || selectedItem.text === "Нету сохраненных шаблонов") {
                alert("Пожалуйста, выберите элемент для удаления.");
                return;
            }
            var text = selectedItem.text;
            deleteTextFromJson(text);
            alert("Текст удален из JSON файла!");
            updateDropdown();
        } catch (error) {
            alert("Ошибка при удалении: " + error.message);
        }
    };

    // Инициализация выпадающего списка при запуске скрипта
    updateDropdown();

    myWindow.center();
    myWindow.show();
})();
