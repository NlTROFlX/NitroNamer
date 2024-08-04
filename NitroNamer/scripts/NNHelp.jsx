function showHelp() {
    var helpWin = new Window("dialog", "NitroNamer - Variable Library", undefined, {resizeable: true});
    helpWin.orientation = "column";
    helpWin.alignChildren = ["fill", "top"];
    helpWin.spacing = 0;

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
        "D(Format) - Duration with custom format (1=hours, 2=minutes, 3=seconds, 4=milliseconds)",
        "Df - Duration in frames",
        "Cd - Current date (DD.MM.YYYY)",
        "Cd(Format) - Current date with custom format (1=day, 2=month, 3=year)"
    ];
    addGroupPanel(firstRow, "Time and Duration", timeVariables);

    // Effects Variables
    var effectsVariables = [
        "E - Name of effects",
        "E(Delimiter) - Effects with custom delimiter",
        "E(Effect name filter)",
        "Ec - Effects count"
    ];
    addGroupPanel(firstRow, "Effects", effectsVariables);

    // Frame Rate and Resolution Variables
    var frameResVariables = [
        "F - Frame Rate",
        "R - Resolution (Width*Height)",
        "Ar - Aspect ratio",
        "Ar(px) - Pixel aspect ratio"
    ];
    addGroupPanel(firstRow, "Frame Rate and Resolution", frameResVariables);

    // Second row of groups
    var secondRow = helpWin.add("group", undefined);
    secondRow.orientation = "row";
    secondRow.alignChildren = ["fill", "top"];
    secondRow.spacing = 10;

    // Indexes and Identifiers Variables
    var indexVariables = [
        "I - Index of available layers",
        "I(0) - index with initial number",
        "i - Global layer index",
        "Lpnt(i) - Depth index relative to the parent layer"
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
        "An(Delimiter) - Animated properties with custom delimiter",
        "Lexp - List of properties controlled by expressions",
        "Lexp(Property name filter)",
        "Lmn - List of mask names on a layer",
        "Lmn(Mode filter)",
        "Lmn(Mask name filter)",
        "Lmc - Number of masks on a layer",
        "Lmc(Mode filter)"
    ];
    addGroupPanel(secondRow, "Layer Properties", layerPropertiesVariables);

    // Other Variables
    var otherVariables = [
        "O - Original name of the layer",
        "Lpnt - Name of the final parent layer",
        "Fext - File extension of the layer",
        "Fext(format) - Custom extension check (mp3, mp4, mov and any other)"
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

    // Add the new button to show LICENSE
    var btnLicense = buttonsSubGroup.add("button", undefined, "LICENSE");
    btnLicense.onClick = function() {
        var licenseWin = new Window("dialog", "NitroNamer 2024.3 - LICENSE", undefined, {resizeable: true});
        licenseWin.orientation = "column";
        licenseWin.alignChildren = ["fill", "top"];

        var licenseText = 
            "MIT License\n\n" +
            "Copyright (c) 2024 NITROFIX\n\n" +
            "Permission is hereby granted, free of charge, to any person obtaining a copy\n" +
            "of this software and associated documentation files (the \"Software\"), to deal\n" +
            "in the Software without restriction, including without limitation the rights\n" +
            "to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n" +
            "copies of the Software, and to permit persons to whom the Software is\n" +
            "furnished to do so, subject to the following conditions:\n\n" +
            "The above copyright notice and this permission notice shall be included in all\n" +
            "copies or substantial portions of the Software.\n\n" +
            "THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n" +
            "IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n" +
            "FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n" +
            "AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n" +
            "LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n" +
            "OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n" +
            "SOFTWARE.";

        var licenseField = licenseWin.add("edittext", undefined, licenseText, {multiline: true, readonly: true});
        licenseField.preferredSize = [500, 200];

        var btnCloseLicense = licenseWin.add("button", undefined, "Close");
        btnCloseLicense.onClick = function() {
            licenseWin.close();
        };

        licenseWin.center();
        licenseWin.show();
    };

    helpWin.center();
    helpWin.show();
}

// Call the help window function
showHelp();