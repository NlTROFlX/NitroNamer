{
    // Проверяем, что панель UI не существует
    var myScriptUI = this;
    function createUI(thisObj) {
        var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "My Panel", undefined, {resizeable: true});

        // Загрузка иконки
        var scriptFile = new File($.fileName);
        $.writeln(scriptFile);
        var scriptPath = scriptFile.path;
        $.writeln(scriptPath);
        var iconFile = new File(scriptPath + "/1/2/icon.png");
        $.writeln(iconFile);
        if (iconFile.exists) {
            iconFile.open("r");
            var iconBlob = iconFile.read();
            iconFile.close();

            // Создаем кнопку с иконкой
            var myButton = myPanel.add("iconbutton", undefined, File(scriptPath + "/1/2/icon.png"), {style: "toolbutton"});

            // Добавляем обработчик события для кнопки
            myButton.onClick = function() {
                alert("Button Clicked!");
            };
        } else {
            alert("Icon file not found!");
        }

        // Настраиваем отображение панели
        if (myPanel instanceof Window) {
            myPanel.center();
            myPanel.show();
        } else {
            myPanel.layout.layout(true);
        }

        return myPanel;
    }

    var myUI = createUI(myScriptUI);
}
