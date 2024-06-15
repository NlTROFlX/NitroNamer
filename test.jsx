(function () {
    // Создание UI окна
    var myWindow = new Window("palette", "Сохранение текста в JSON", undefined);
    myWindow.orientation = "column";
    
    // Текстовое поле
    var textField = myWindow.add("edittext", undefined, "Введите текст здесь");
    textField.size = [300, 25];
    
    // Кнопка "Сохранить"
    var saveButton = myWindow.add("button", undefined, "Сохранить");

    // Функция для сохранения текста в JSON файл
    function saveTextToJson(text) {
        var scriptFile = new File($.fileName);
        var scriptFolder = scriptFile.path;
        var jsonFile = new File(scriptFolder + "/savedText.json");
        
        var jsonData = {
            text: text
        };
        
        jsonFile.open("w");
        jsonFile.write(JSON.stringify(jsonData, null, 4));
        jsonFile.close();
    }

    // Обработчик события нажатия на кнопку "Сохранить"
    saveButton.onClick = function () {
        var text = textField.text;
        saveTextToJson(text);
        alert("Текст сохранен в JSON файл!");
    };
    
    myWindow.center();
    myWindow.show();
})();
