function createUI(thisObj) {
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Выбранные свойства", undefined, {resizeable: true});
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];

    var propertyList = win.add("listbox", undefined, [], {multiselect: false});
    propertyList.preferredSize = [400, 300];

    var refreshButton = win.add("button", undefined, "Обновить");
    refreshButton.onClick = function () {
        updatePropertyList(propertyList);
    };

    win.onResizing = win.onResize = function () {
        win.layout.resize();
    };

    return win;
}


function getLastElementName(property) {
    return property.name; 
}

function updatePropertyList(propertyList) {
    propertyList.removeAll();

    if (app.project.activeItem instanceof CompItem) {
        var comp = app.project.activeItem;
        var selectedLayers = comp.selectedLayers;

        if (selectedLayers.length > 0) {
            var layer = selectedLayers[selectedLayers.length - 1]; 
            var selectedProperties = layer.selectedProperties;

            if (selectedProperties.length === 0) {
                propertyList.add("item", "Слой: " + layer.name + " - Нет выбранных атрибутов");
            } else {
                
                var lastSelectedProperty = selectedProperties[selectedProperties.length - 1];
                var lastElementName = getLastElementName(lastSelectedProperty); 

                
                propertyList.add("item", "Слой: " + layer.name + ", Атрибут: " + lastElementName);
            }
        } else {
            propertyList.add("item", "Нет выбранных слоёв.");
        }
    } else {
        propertyList.add("item", "Активный элемент не является композицией.");
    }
}

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
