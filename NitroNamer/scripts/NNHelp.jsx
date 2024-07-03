function showHelp() {
    var helpWin = new Window("dialog", "NitroNamer - Help Panel", undefined, {resizeable: true});
    helpWin.orientation = "column";
    helpWin.alignChildren = ["fill", "top"];
    helpWin.spacing = 10;

    var addGroupPanel = function(parent, title, variables) {
        var panel = parent.add("panel", undefined, title);
        panel.orientation = "column";
        panel.alignChildren = ["fill", "top"];
        panel.spacing = 10;

        var listBox = panel.add("listbox", undefined, variables, {multiselect: false});
        listBox.preferredSize = [200, 100];

        return panel;
    };

    // Первая строка групп
    var firstRow = helpWin.add("group", undefined);
    firstRow.orientation = "row";
    firstRow.alignChildren = ["fill", "top"];
    firstRow.spacing = 10;

    // Переменные информации о композиции
    var compVariables = [
        "C - Current composition name"
    ];
    addGroupPanel(firstRow, "Composition Information", compVariables);

    // Переменные времени и длительности
    var timeVariables = [
        "D - Duration (HH:MM:SS)",
        "Dd - By seconds duration (0Sec)",
        "Ddd - By minute duration (0Min.0Sec)",
        "Ip - In point of the layer",
        "Op - Out point of the layer"
    ];
    addGroupPanel(firstRow, "Time and Duration", timeVariables);

    // Переменные эффектов
    var effectsVariables = [
        "E - Name of effects",
        "E{#} - Effects with custom delimiter"
    ];
    addGroupPanel(firstRow, "Effects", effectsVariables);

    // Переменные частоты кадров и разрешения
    var frameResVariables = [
        "F - Frame Rate",
        "R - Resolution (Width*Height)"
    ];
    addGroupPanel(firstRow, "Frame Rate and Resolution", frameResVariables);

    // Вторая строка групп
    var secondRow = helpWin.add("group", undefined);
    secondRow.orientation = "row";
    secondRow.alignChildren = ["fill", "top"];
    secondRow.spacing = 10;

    // Переменные индексов и идентификаторов
    var indexVariables = [
        "I - Local index of selected layers",
        "i - Layer index"
    ];
    addGroupPanel(secondRow, "Indexes and Identifiers", indexVariables);

    // Переменные источника
    var sourceVariables = [
        "S - Source name (file or pre-comp)",
        "W - Width of the layer",
        "H - Height of the layer"
    ];
    addGroupPanel(secondRow, "Source", sourceVariables);

    // Переменные типа слоя
    var layerTypeVariables = [
        "T - Layer type (Pre-comp, Footage, Shape, Solid, Null, Adjustment, Audio, Text, Light, Camera)"
    ];
    addGroupPanel(secondRow, "Layer Type", layerTypeVariables);

    // Прочие переменные
    var otherVariables = [
        "O - Original name of the layer"
    ];
    addGroupPanel(secondRow, "Other", otherVariables);

    var buttonGroup = helpWin.add("group", undefined);
    buttonGroup.orientation = "row";
    buttonGroup.alignChildren = ["center", "top"];
    buttonGroup.spacing = 10;

    var btnClose = buttonGroup.add("button", undefined, "Close");
    btnClose.onClick = function() {
        helpWin.close();
    };

    // Add the new button to open the URL
    var btnNitrofix = buttonGroup.add("button", undefined, "NitroNamer 2024.2 | Say thanks or buy a coffee for NITROFIX");
    btnNitrofix.onClick = function() {
        var url = "https://boosty.to/nitrofix";
        if ($.os.indexOf("Windows") !== -1) {
            system.callSystem("cmd.exe /c start " + url);
        } else {
            system.callSystem("open " + url);
        }
    };

    helpWin.center();
    helpWin.show();
}

// Вызов функции отображения окна помощи
showHelp();