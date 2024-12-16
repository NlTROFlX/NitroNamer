// Функция для создания графического интерфейса
function createUI(thisObj) {
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Выбранные свойства", undefined, {resizeable: true});
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];

    // Список для отображения выбранных свойств
    var propertyList = win.add("listbox", undefined, [], {multiselect: false});
    propertyList.preferredSize = [400, 300];

    // Кнопка для обновления списка свойств
    var refreshButton = win.add("button", undefined, "Обновить");

    // Обработчик нажатия кнопки
    refreshButton.onClick = function() {
        updatePropertyList(propertyList);
    };

    win.onResizing = win.onResize = function() {
        win.layout.resize();
    };

    return win;
}

// Функция для обновления списка свойств
function updatePropertyList(propertyList) {
    propertyList.removeAll();

    // Проверяем, является ли активный элемент композицией
    if (app.project.activeItem instanceof CompItem) {
        var comp = app.project.activeItem;
        var selectedLayers = comp.selectedLayers;

        // Проходим по каждому выбранному слою
        for (var i = 0; i < selectedLayers.length; i++) {
            var layer = selectedLayers[i];
            var selectedProperties = layer.selectedProperties;

            // Если нет выбранных свойств, отображаем сообщение
            if (selectedProperties.length === 0) {
                propertyList.add("item", "Слой: " + layer.name + " - Нет выбранных свойств");
            } else {
                // Проходим по каждому выбранному свойству
                for (var j = 0; j < selectedProperties.length; j++) {
                    var property = selectedProperties[j];
                    var propertyValue = (property.value !== undefined) ? property.value.toString() : "N/A";
                    propertyList.add("item", "Слой: " + layer.name + ", Свойство: " + property.name + ", Значение: " + propertyValue);
                }
            }
        }
    } else {
        propertyList.add("item", "Активный элемент не является композицией.");
    }
}

// Основная функция
function main(thisObj) {
    var ui = createUI(thisObj);
    if (ui instanceof Window) {
        ui.center();
        ui.show();
    } else {
        ui.layout.layout(true);
        ui.layout.resize();
    }
}

main(this);
