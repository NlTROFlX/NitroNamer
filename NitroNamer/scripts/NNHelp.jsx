function showHelp() {
    var helpWin = new Window("dialog", "NitroNamer - Variable Library", undefined, {resizeable: true});
    helpWin.orientation = "column";
    helpWin.alignChildren = ["fill", "top"];
    helpWin.spacing = 10;

    var totalVariables = 0;

    var addGroupPanel = function(parent, title, variables) {
        var panel = parent.add("panel", undefined, title);
        panel.orientation = "column";
        panel.alignChildren = ["fill", "top"];
        panel.spacing = 10;

        var listBox = panel.add("listbox", undefined, variables, {multiselect: false});
        listBox.preferredSize = [200, 100];

        totalVariables += variables.length;

        return panel;
    };

    // First row of groups
    var firstRow = helpWin.add("group", undefined);
    firstRow.orientation = "row";
    firstRow.alignChildren = ["fill", "top"];
    firstRow.spacing = 10;

    // Composition Information Variables
    var compVariables = [
        "C - Current composition name",
        "Pn - Project name"
    ];
    addGroupPanel(firstRow, "Composition Information", compVariables);

    // Time and Duration Variables
    var timeVariables = [
        "Ip - In point of the layer",
        "Op - Out point of the layer",
        "D - Duration (HH:MM:SS)",
        "D(format) - Duration with custom format (1=hours, 2=minutes, 3=seconds, 4=milliseconds)",
        "Df - Duration in frames",
        "Cd - Current date (DD.MM.YYYY)",
        "Cd(format) - Current date with custom format (1=day, 2=month, 3=year)"
    ];
    addGroupPanel(firstRow, "Time and Duration", timeVariables);

    // Effects Variables
    var effectsVariables = [
        "E - Name of effects",
        "E{delimiter} - Effects with custom delimiter",
        "Ec - Effects count"
    ];
    addGroupPanel(firstRow, "Effects", effectsVariables);

    // Frame Rate and Resolution Variables
    var frameResVariables = [
        "F - Frame Rate",
        "R - Resolution (Width*Height)",
        "Ar - Aspect ratio"
    ];
    addGroupPanel(firstRow, "Frame Rate and Resolution", frameResVariables);

    // Second row of groups
    var secondRow = helpWin.add("group", undefined);
    secondRow.orientation = "row";
    secondRow.alignChildren = ["fill", "top"];
    secondRow.spacing = 10;

    // Indexes and Identifiers Variables
    var indexVariables = [
        "I - Local index of selected layers",
        "i - Layer index"
    ];
    addGroupPanel(secondRow, "Indexes and Identifiers", indexVariables);

    // Layer Properties Variables
    var layerPropertiesVariables = [
        "T - Layer type (Pre-comp, Footage, Shape, Solid, Null, Adjustment, Audio, Text, Light, Camera)",
        "S - Source name (file or pre-comp)",
        "W - Width of the layer",
        "H - Height of the layer",
        "Lpos - Layer position",
        "Lsc - Layer scale",
        "Lrot - Layer rotation",
        "Lops - Layer opacity",
        "Tm - Track matte type",
        "An - Animated properties",
        "An{delimiter} - Animated properties with custom delimiter",
        "Lexp - List of properties controlled by expressions",
        "Fext - File extension of the layer",
        "Fext(extension) - Custom extension check"
    ];
    addGroupPanel(secondRow, "Layer Properties", layerPropertiesVariables);

    // Other Variables
    var otherVariables = [
        "O - Original name of the layer",
        "Lpnt - Parent name",
        "Lpnt(parentIndex) - Parent index relative to siblings"
    ];
    addGroupPanel(secondRow, "Other", otherVariables);

    var buttonGroup = helpWin.add("group", undefined);
    buttonGroup.orientation = "row";
    buttonGroup.alignChildren = ["left", "top"];
    buttonGroup.spacing = 10;

    var totalVariablesText = buttonGroup.add("statictext", undefined, "Total " + totalVariables + " variables available");
    totalVariablesText.alignment = ["left", "top"];

    var buttonsSubGroup = buttonGroup.add("group", undefined);
    buttonsSubGroup.orientation = "row";
    buttonsSubGroup.alignChildren = ["center", "top"];
    buttonsSubGroup.spacing = 10;

    var btnClose = buttonsSubGroup.add("button", undefined, "Close");
    btnClose.onClick = function() {
        helpWin.close();
    };

    // Add the new button to open the URL for donations
    var btnNitrofix = buttonsSubGroup.add("button", undefined, "NitroNamer 2024.3 | Say thanks or buy a coffee for NITROFIX");
    btnNitrofix.onClick = function() {
        var url = "https://boosty.to/nitrofix";
        if ($.os.indexOf("Windows") !== -1) {
            system.callSystem("cmd.exe /c start " + url);
        } else {
            system.callSystem("open " + url);
        }
    };

    // Add the new button to open the GitHub project page
    var btnGitHub = buttonsSubGroup.add("button", undefined, "Project page on GitHub");
    btnGitHub.onClick = function() {
        var url = "https://github.com/NlTROFlX/NitroNamer";
        if ($.os.indexOf("Windows") !== -1) {
            system.callSystem("cmd.exe /c start " + url);
        } else {
            system.callSystem("open " + url);
        }
    };

    helpWin.center();
    helpWin.show();
}

// Call the help window function
showHelp();
