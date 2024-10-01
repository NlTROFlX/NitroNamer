(function() {
    // Get the script's file and folder path
    var scriptFile = new File($.fileName);
    var scriptFolderPath = scriptFile.path;

    // Your existing tooltipsRU and tooltipsEU objects
    var tooltipsRU = {
        "NitroNamer": {
            "tooltips": {
                "buttons": {
                    "btnCopy": "Копирует имя выбранного слоя, если слой не выбран,\nкопируется значение первого доступного",
                    "btnSave": "Сохранение значения из поля для ввода шаблона имени в пресеты.\nShift + Click - Обновляет значения выбранного пресета",
                    "btnCircleMinus": "Удаление текущего выбранного шаблона в списке пресетов.",
                    "btnMinimize": "Переключение режимов работы UI.",
                    "btnRename": "Click - Применить шаблон.\nShift + Click - добавление значения шаблона к началу имени слоя.\nCtrl + Click - добавление значения к концу имени слоя\nAlt+Click - режим инвертирования всех переменных `I`",
                    "btnVariables": "Открыть панель значений переменных для слоя.",
                    "btnHelp": "Открыть библиотеку всех переменных и их режимов.",
                    "btnReset": "Сбросить все значения.\n(Не удаляет пресеты и настройки переменных)",
                    "btnSettings": "Открыть панель настроек переменных."
                },
                "radioButtons": {
                    "rdoAllLayers": "Будут задействованы все доступные слои в этой композиции.",
                    "rdoOnlySelected": "Будут задействованы только выбранные вами слои."
                },
                "textFields": {
                    "txtTemplate": "Поле для ввода шаблона.",
                },
                "checkboxes": {
                    "chkBriefly": "Включить/Выключить режим форматирования текста."
                },
                "dropdowns": {
                    "ddLayerMode": "Выбор шаблона имени из сохраненных пресетов.",
                    "ddBrieflyType": "Режимы форматирования текста."
                }
            }
        }
    };

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
                    "btnSettings": "Open the variable settings panel."
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

    // Create the UI
    var dialog = new Window("dialog", "NitroNamer");
    dialog.orientation = "column";
    dialog.alignChildren = ["fill", "top"];
    dialog.spacing = 5; // Minimize spacing
    dialog.margins = 10; // Minimize margins

    // Add the text label for the prompt
    var lblPrompt = dialog.add("statictext", undefined, "Choose Tooltip Language");
    lblPrompt.alignment = ["fill", "center"];

    var languageGroup = dialog.add("group");
    languageGroup.orientation = "row"; // Radio buttons on one line
    languageGroup.alignChildren = ["fill", "center"];
    languageGroup.spacing = 10;
    languageGroup.margins = 0;

    var rdoEnglish = languageGroup.add("radiobutton", undefined, "English");
    var rdoRussian = languageGroup.add("radiobutton", undefined, "Russian");

    // Set default selection
    rdoEnglish.value = true;

    // Define the Confirm button before using it in the function
    var btnConfirm = dialog.add("button", undefined, "Confirm");
    btnConfirm.alignment = ["fill", "center"]; // Button full width

    // Now that all UI elements are defined, define the updateInterfaceText function
    function updateInterfaceText() {
        if (rdoEnglish.value) {
            lblPrompt.text = "Choose Tooltip Language";
            btnConfirm.text = "Confirm";
        } else {
            lblPrompt.text = "Выберите язык подсказок";
            btnConfirm.text = "Подтвердить";
        }
    }

    // Event listeners to update interface text when language changes
    rdoEnglish.onClick = updateInterfaceText;
    rdoRussian.onClick = updateInterfaceText;

    updateInterfaceText(); // Initialize the text

    btnConfirm.onClick = function() {
        var selectedLanguage = rdoEnglish.value ? "English" : "Russian";
        var tooltipsData = rdoEnglish.value ? tooltipsEU : tooltipsRU;
        var fileName = "tooltips.json"; // We'll use a common file name

        // Define the path to the tooltips file
        var tooltipsFilePath = scriptFolderPath + "/tooltips.json";
        var tooltipsFile = new File(tooltipsFilePath);

        // Write the JSON data to the file
        tooltipsFile.encoding = "UTF-8";
        tooltipsFile.open("w");
        tooltipsFile.write(JSON.stringify(tooltipsData, null, 4));
        tooltipsFile.close();

        // Save the selected language in settings.json
        var settingsFolderPath = scriptFolderPath;
        var settingsFilePath = settingsFolderPath + "/settings.json";
        var settingsFile = new File(settingsFilePath);
        var settingsData = {};

        if (settingsFile.exists) {
            settingsData = readJSONFile(settingsFilePath);
        }

        settingsData.selectedLanguage = selectedLanguage;

        writeJSONFile(settingsFilePath, settingsData);

        // Close the dialog
        dialog.close();
    };

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

    // Show the dialog
    dialog.center();
    dialog.show();
})();
