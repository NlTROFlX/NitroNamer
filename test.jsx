// Создаем панель
{
    function createUI(thisObj) {
        var myPanel = (thisObj instanceof Panel) ? thisObj : new Window("palette", "My Panel", undefined, { resizeable: true });

        // Добавляем кнопку на панель
        var myButton = myPanel.add("button", undefined, "Нажми меня");

        // Обработчик нажатия на кнопку
        myButton.onClick = function() {
            alert("Кнопка нажата!");
        };

        // Обработчик нажатия клавиш
        myPanel.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.altKey && event.keyName === 'Multiply') {
                alert("Горячая клавиша Ctrl+Alt+* нажата!");
            }
        });

        // Возвращаем панель
        return myPanel;
    }

    // Проверяем, что скрипт запускается в After Effects
    var myScriptPal = createUI(this);
    if (myScriptPal != null && myScriptPal instanceof Window) {
        myScriptPal.center();
        myScriptPal.show();
    } else {
        myScriptPal.layout.layout(true);
        myScriptPal.layout.resize();
    }
}
