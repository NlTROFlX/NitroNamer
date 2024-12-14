function buildApplyUI(thisObj) {
    var win = thisObj instanceof Panel ? thisObj : new Window("palette", "NNNameApply", undefined, {resizeable: true});
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.spacing = 10;
    win.margins = 10;

    // Группа для кнопок
    var btnGroup = win.add("group");
    btnGroup.orientation = "row";
    btnGroup.alignChildren = ["fill", "center"];
    btnGroup.spacing = 10;

    // Кнопка "Select All"
    var btnSelectAll = btnGroup.add("button", undefined, "Select All");
    btnSelectAll.size = [100, 25];

    // Кнопка "Deselect All"
    var btnDeselectAll = btnGroup.add("button", undefined, "Deselect All");
    btnDeselectAll.size = [100, 25];

    // Группа для чекбоксов
    var chkGroup = win.add("group");
    chkGroup.orientation = "column";
    chkGroup.alignChildren = ["left", "top"];
    chkGroup.spacing = 5;

    // Список типов слоев
    var layerTypes = [
        "Shape Layer",
        "Text Layer",
        "Null Object",
        "Adjustment Layer",
        "Footage Layer",
        "Solid Layer",
        "Pre-Comp",
        "Camera Layer",
        "Light Layer"
    ];

    var checkboxes = [];

    // Создание чекбоксов
    for (var i = 0; i < layerTypes.length; i++) {
        var cb = chkGroup.add("checkbox", undefined, layerTypes[i]);
        checkboxes.push(cb);
    }

    // Функции для кнопок
    btnSelectAll.onClick = function() {
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].value = true;
        }
    };

    btnDeselectAll.onClick = function() {
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].value = false;
        }
    };

    win.layout.layout(true);
    win.layout.resize();

    return win;
}

var applyPanel = buildApplyUI(this);
if (applyPanel instanceof Window) {
    applyPanel.center();
    applyPanel.show();
}