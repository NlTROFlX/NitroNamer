{
    // Проверяем, что панель UI не существует
    var myScriptUI = this;
    function createUI(thisObj) {
        var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "My Panel", undefined, {resizeable: true});
        
        // Создаем кнопку
        var myButton = myPanel.add("button", undefined, "Click Me");
        
        // Добавляем обработчик события для кнопки
        myButton.onClick = function() {
            alert("Button Clicked!");
        };
        
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
