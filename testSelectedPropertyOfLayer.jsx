// Проверяем, находится ли скрипт в панели (панель или окно)
(function (thisObj) {
    function createUI(thisObj) {
        // Создаем панель (в панели After Effects или отдельное окно)
        var panel = thisObj instanceof Panel ? thisObj : new Window("palette", "Simple Panel", undefined, {resizeable: true});

        // Путь к иконкам (иконки должны находиться в той же папке, что и скрипт)
        var scriptFilePath = File($.fileName).path; // Получаем путь к текущему скрипту
        var iconPath1 = scriptFilePath + "/icon.png"; // Основная иконка
        var iconPath2 = scriptFilePath + "/icon2.png"; // Иконка при наведении

        // Проверяем наличие файлов иконок
        var iconFile1 = File(iconPath1);
        var iconFile2 = File(iconPath2);

        if (!iconFile1.exists || !iconFile2.exists) {
            alert("Одна или обе иконки не найдены:\n" + iconPath1 + "\n" + iconPath2);
            return panel;
        }

        // Добавляем изображение как кнопку
        var buttonImage = panel.add("image", undefined, File(iconPath1)); // Устанавливаем основную иконку

        // Устанавливаем всплывающую подсказку
        buttonImage.helpTip = "Нажмите, чтобы добавить текстовый слой"; // Текст подсказки

        // Устанавливаем размер изображения (опционально, если нужно изменить размер)
        buttonImage.size = [32, 32]; // Задайте размер, соответствующий вашей иконке

        // Обработчик наведения мыши (меняем иконку)
        buttonImage.addEventListener("mouseover", function () {
            buttonImage.image = File(iconPath2); // Устанавливаем иконку при наведении
        });

        // Обработчик ухода мыши (возвращаем основную иконку)
        buttonImage.addEventListener("mouseout", function () {
            buttonImage.image = File(iconPath1); // Возвращаем основную иконку
        });

        // Добавляем обработчик клика
        buttonImage.addEventListener("mousedown", function () {
            // Получаем активную композицию
            var activeComp = app.project.activeItem;

            if (activeComp && activeComp instanceof CompItem) {
                // Начинаем изменять проект
                app.beginUndoGroup("Добавить текст");

                // Добавляем текстовый слой в композицию
                activeComp.layers.addText("Привет, мир!");

                // Завершаем изменение проекта
                app.endUndoGroup();
            } else {
                alert("Откройте композицию, чтобы добавить текст.");
            }
        });

        // Адаптируем панель под содержимое
        panel.layout.layout(true);

        return panel;
    }

    // Создаем интерфейс
    var myPanel = createUI(thisObj);

    // Если не в панели, показываем окно
    if (!(myPanel instanceof Panel)) {
        myPanel.center();
        myPanel.show();
    }
})(this);
