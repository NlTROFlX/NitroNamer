(function() {
    // Get the script's file and folder path
    var scriptFile = new File($.fileName);
    var scriptFolderPath = scriptFile.path;

    var tooltipsEU = {
        "NitroNamer": {
            "tooltips": {
                "buttons": {
                    "btnCopy": "Copies the name of the selected layer, if no layer is selected,\nthe value of the first available one is copied",
                    "btnSave": "Saves the value from the name template input field to the presets.\nShift + Click - Updates the values of the selected preset",
                    "btnCircleMinus": "Delete the currently selected template in the preset list.",
                    "btnMinimize": "Switching UI operating modes.",
                    "btnRename": "Click - Apply template.\nShift + Click - Add template value to the beginning of layer name.\nCtrl + Click - Add value to the end of layer name.\nAlt+Click - Invert all variables mode \"I\"",
                    "btnVariables": "Open the variable values panel for the layer.",
                    "btnHelp": "Open the library of all variables and their modes.",
                    "btnReset": "Reset all values.\n(Does not delete presets and variable settings)",
                    "btnSettings": "Open the variable settings panel.\nClick - forward.\nCtrl + Click - back.\nAlt + Click - activate.",
                    "btnModeSwitch_chart": "By frequency of use (descending).\nClick - forward.\nCtrl + Click - back.\nAlt + Click - activate.",
                    "btnModeSwitch_date": "By date of addition (ascending).\nClick - forward.\nCtrl + Click - back.\nAlt + Click - activate.",
                    "btnModeSwitch_longArrowDown": "By number of characters (descending).\nClick - forward.\nCtrl + Click - back.\nAlt + Click - activate.",
                    "btnModeSwitch_longArrowUp": "By number of characters (ascending).\nClick - forward.\nCtrl + Click - back.\nAlt + Click - activate.",
                    "btnModeSwitch_favorites": "Favorites only.\nClick - forward.\nCtrl + Click - back.\nAlt + Click - activate.",
                    "btnModeSwitch_search": "Finding the right value.\nClick - forward.\nCtrl + Click - back.\nAlt + Click - activate."
                },
                "radioButtons": {
                    "rdoAllLayers": "All available layers in this composition will be used.",
                    "rdoOnlySelected": "Only the layers you select will be affected."
                },
                "textFields": {
                    "txtTemplate": "Template input field.",
                },
                "checkboxes": {
                    "chkBriefly": "Enable/Disable text formatting mode."
                },
                "dropdowns": {
                    "ddLayerMode": "Select a name template from saved presets.",
                    "ddBrieflyType": "Text formatting modes."
                }
            }
        }
    };

    // Define the path to the tooltips file
    var tooltipsFilePath = scriptFolderPath + "/tooltips.json";
    var tooltipsFile = new File(tooltipsFilePath);

    // Write the English tooltips JSON data to the file
    tooltipsFile.encoding = "UTF-8";
    tooltipsFile.open("w");
    tooltipsFile.write(JSON.stringify(tooltipsEU, null, 4));
    tooltipsFile.close();

    // Save the selected language in settings.json
    var settingsFolderPath = scriptFolderPath;
    var settingsFilePath = settingsFolderPath + "/settings.json";
    var settingsFile = new File(settingsFilePath);
    var settingsData = {};

    if (settingsFile.exists) {
        settingsData = readJSONFile(settingsFilePath);
    }

    settingsData.selectedLanguage = "English";

    writeJSONFile(settingsFilePath, settingsData);

    // Utility functions to read and write JSON files
    function readJSONFile(filePath) {
        var file = new File(filePath);
        var data = {};
        if (file.exists) {
            file.open("r");
            try {
                data = eval("(" + file.read() + ")");
            } catch (e) {
                alert("Error parsing JSON file: " + filePath, "NitroNamer");
            }
            file.close();
        }
        return data;
    }

    function writeJSONFile(filePath, data) {
        var file = new File(filePath);
        file.encoding = "UTF-8";
        file.open("w");
        file.write(JSON.stringify(data, null, 4));
        file.close();
    }
})();