// initialSettings.jsx

(function() {
    var scriptFile = new File($.fileName);
    var scriptFolderPath = scriptFile.parent; // settings folder

    var win = new Window("palette", "Выберите язык всплывающих подсказок", undefined, {resizeable: false});
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];

    var rdoGroup = win.add("panel", undefined, "Выберите язык всплывающих подсказок");
    rdoGroup.orientation = "column";
    rdoGroup.alignChildren = ["left", "top"];
    rdoGroup.margins = [10,10,10,10];

    var rdoEnglish = rdoGroup.add("radiobutton", undefined, "English");
    var rdoRussian = rdoGroup.add("radiobutton", undefined, "Russian");
    rdoEnglish.value = true; // default selection

    var btnConfirm = win.add("button", undefined, "Подтвердить");

    btnConfirm.onClick = function() {
        var selectedLanguage = rdoEnglish.value ? "English" : "Russian";

        var tooltipsFileName = selectedLanguage === "English" ? "tooltipsEU.json" : "tooltipsRU.json";
        var tooltipsFile = new File(scriptFolderPath.fullName + "/" + tooltipsFileName);

        // Create the JSON structure
        var tooltipsData;

        if (selectedLanguage === "Russian") {
            tooltipsData = {
                "NitroNamer": {
                    "tooltips": {
                        "buttons": {
                            "btnCopy": "Копирование имени выбранного слоя, если слой не выбран, то\n будет скопирован первый доступный.",
                            "btnSave": "Сохранение значения из поля для ввода шаблона имени в пресеты.\nShift + Click - Обновление выбранного пресета на текущее значение из поля шаблона имени.",
                            "btnCircleMinus": "Удаление текущего выбранного шаблона в списке пресетов.",
                            "btnMinimize": "Переключение режимов работы UI.",
                            "btnRename": "Click - Применить шаблон.\nShift + Click - добавление значения шаблона к началу имени слоя.\n Ctrl + Click - добавление значения к концу имени слоя\nAlt+Click - режим инвертирования всех переменных `I`",
                            "btnVariables": "Открыть панель значений переменных для слоя.",
                            "btnHelp": "Открыть библиотеку всех переменных и их режимов.",
                            "btnReset": "Сбросить установленные/введенные значения.",
                            "btnSettings": "Открыть панель настроек переменных."
                        },
                        "radioButtons": {
                            "rdoAllLayers": "При переименовании будут задействованы все доступные слои в этой композиции",
                            "rdoOnlySelected": "При переименовании будут задействованы только выбранные вами слои"
                        },
                        "textFields": {
                            "txtTemplate": "Поле для ввода шаблона имени",
                            "txtOriginal": "Оригинальное имя слоя до применения шаблона.\n Выберите слой для предпросмотра или будет выбран первый доступный.",
                            "txtRenamed": "Имя, которое получит слой после применения шаблона."
                        },
                        "checkboxes": {
                            "chkBriefly": "Включить/Выключить режим форматирования текста."
                        },
                        "dropdowns": {
                            "ddLayerMode": "Выбор шаблона имени из сохраненных пресетов."
                        }
                    }
                }
            };
        } else {
            tooltipsData = {
                "NitroNamer": {
                    "tooltips": {
                        "buttons": {
                            "btnCopy": "Copy the name of the selected layer, if no layer is selected,\n the first available layer will be copied.",
                            "btnSave": "Save the value from the name template input field to presets.\nShift + Click - Update the selected preset with the current value from the name template field.",
                            "btnCircleMinus": "Delete the currently selected template in the preset list.",
                            "btnMinimize": "Switch UI modes.",
                            "btnRename": "Click - Apply the template.\nShift + Click - Add the template value to the beginning of the layer name.\nCtrl + Click - Add the value to the end of the layer name\nAlt+Click - Reverse all `I` variables",
                            "btnVariables": "Open the variable values panel for the layer.",
                            "btnHelp": "Open the library of all variables and their modes.",
                            "btnReset": "Reset set/entered values.",
                            "btnSettings": "Open the variable settings panel."
                        },
                        "radioButtons": {
                            "rdoAllLayers": "When renaming, all available layers in this composition will be involved",
                            "rdoOnlySelected": "When renaming, only the layers you have selected will be involved"
                        },
                        "textFields": {
                            "txtTemplate": "Field for entering the name template",
                            "txtOriginal": "The original name of the layer before applying the template.\n Select a layer for preview or the first available will be selected.",
                            "txtRenamed": "The name that the layer will receive after applying the template."
                        },
                        "checkboxes": {
                            "chkBriefly": "Enable/Disable text formatting mode."
                        },
                        "dropdowns": {
                            "ddLayerMode": "Select a name template from saved presets."
                        }
                    }
                }
            };
        }

        // Write the tooltips data to the JSON file
        tooltipsFile.encoding = "UTF-8";
        if (tooltipsFile.open("w")) {
            tooltipsFile.write(JSON.stringify(tooltipsData, null, 4));
            tooltipsFile.close();

            // Open the main script
            var mainScriptPath = scriptFolderPath.parent.parent.fullName + "/NitroNamer.jsx";
            var mainScriptFile = new File(mainScriptPath);
            if (mainScriptFile.exists) {
                $.evalFile(mainScriptFile);
            } else {
                alert("Error: NitroNamer.jsx not found.", "Error");
            }

            // Close the current window
            win.close();
        } else {
            alert("Error: Unable to create tooltips file.", "Error");
        }
    };

    win.center();
    win.show();
})();