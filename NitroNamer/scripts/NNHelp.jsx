function showHelp() {
    var helpWin = new Window("dialog", "NitroNamer - Help Panel", undefined, {resizeable: true});
    helpWin.orientation = "column";
    helpWin.alignChildren = ["fill", "top"];
    
    var addGroupHeader = function(parent, title) {
        var group = parent.add("group", undefined);
        group.orientation = "row";
        group.alignment = ["fill", "top"];
        group.add("statictext", undefined, title);
        var divider = group.add("panel", undefined, undefined, {borderStyle: "sunken"});
        divider.alignment = "fill";
    };

    var addVariableGroup = function(parent, title, variables) {
        var group = parent.add("group", undefined);
        group.orientation = "column";
        group.alignment = ["fill", "top"];
        group.margins = 10;
        
        var header = group.add("statictext", undefined, title);
        header.graphics.font = ScriptUI.newFont("Arial", "Bold", 12);
        
        for (var i = 0; i < variables.length; i++) {
            var variableGroup = group.add("group", undefined);
            variableGroup.orientation = "row";
            variableGroup.alignChildren = ["left", "center"];
            variableGroup.spacing = 10;
            
            var variableText = variableGroup.add("statictext", undefined, variables[i].variable);
            variableText.preferredSize.width = 60;
            variableText.graphics.font = ScriptUI.newFont("Arial", "Bold", 12);
            
            var descriptionText = variableGroup.add("statictext", undefined, variables[i].description);
            descriptionText.graphics.font = ScriptUI.newFont("Arial", "Regular", 12);
        }
        
        var separator = parent.add("panel", undefined, undefined, {borderStyle: "etched"});
        separator.alignment = "fill";
        separator.minimumSize.height = 2;
        separator.maximumSize.height = 2;
    };

    var variables = [
        {
            title: "Composition Information:",
            vars: [
                {variable: "C", description: "Current composition name"}
            ]
        },
        {
            title: "Time and Duration:",
            vars: [
                {variable: "D", description: "Duration (HH:MM:SS)"},
                {variable: "Dd", description: "By seconds duration (0Sec)"},
                {variable: "Ddd", description: "By minute duration (0Min.0Sec)"},
                {variable: "Ip", description: "In point of the layer"},
                {variable: "Op", description: "Out point of the layer"}
            ]
        },
        {
            title: "Effects:",
            vars: [
                {variable: "E", description: "Name of effects"},
                {variable: "E{#}", description: "Effects with custom delimiter"}
            ]
        },
        {
            title: "Frame Rate and Resolution:",
            vars: [
                {variable: "F", description: "Frame Rate"},
                {variable: "R", description: "Resolution (Width*Height)"}
            ]
        },
        {
            title: "Indexes and Identifiers:",
            vars: [
                {variable: "I", description: "Local index of selected layers"},
                {variable: "i", description: "Layer index"}
            ]
        },
        {
            title: "Source:",
            vars: [
                {variable: "M", description: "Source name (file or pre-comp)"},
                {variable: "W", description: "Width of the layer"},
                {variable: "H", description: "Height of the layer"}
            ]
        },
        {
            title: "Layer Type:",
            vars: [
                {variable: "T", description: "Layer type (Pre-comp, Footage, Shape, Solid, Null, Adjustment, Audio, Text, Light, Camera)"}
            ]
        },
        {
            title: "Other:",
            vars: [
                {variable: "O", description: "Original name of the layer"}
            ]
        }
    ];

    helpWin.add("statictext", undefined, "Available Variables:").graphics.font = ScriptUI.newFont("Arial", "Bold", 14);

    var mainGroup = helpWin.add("group", undefined);
    mainGroup.orientation = "row";
    mainGroup.alignChildren = ["fill", "top"];

    for (var i = 0; i < variables.length; i++) {
        var subGroup = mainGroup.add("group", undefined);
        subGroup.orientation = "column";
        subGroup.alignChildren = ["fill", "top"];
        subGroup.spacing = 10;
        subGroup.margins = 10;

        addVariableGroup(subGroup, variables[i].title, variables[i].vars);
    }

    var btnClose = helpWin.add("button", undefined, "Close");
    btnClose.onClick = function() {
        helpWin.close();
    };

    // Add the new button to open the URL
    var btnNitrofix = helpWin.add("button", undefined, "NitroNamer 2024.2 | Say thanks or buy a coffee for NITROFIX");
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