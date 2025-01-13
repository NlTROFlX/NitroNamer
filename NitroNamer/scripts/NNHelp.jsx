(function (thisObj) {
    // Функция для построения пользовательского интерфейса
    function buildUI(thisObj) {
        // Определяем, панель это или окно
        // Задаём немного большую высоту панели, чтобы вместить вертикальное расположение элементов
        var panel = (thisObj instanceof Panel) 
            ? thisObj 
            : new Window("palette", "Custom Panel", undefined, { resizeable: true });
        panel.margins = [4, 4, 4, 4];
        panel.spacing = 4;
        
        // Задаём предпочтительную высоту панели – можно настроить по необходимости
        panel.preferredSize.height = 120;

        // Определяем путь к папке img (на уровень выше от текущего скрипта)
        var scriptFile = new File($.fileName);
        var scriptFolder = scriptFile.parent;
        var parentFolder = scriptFolder.parent;
        var imgFolder = new Folder(parentFolder.fsName + "/img");

        if (!imgFolder.exists) {
            alert("Папка 'img' не найдена по пути:\n" + imgFolder.fsName);
            return panel;
        }

        // Функция для загрузки изображения
        function loadImage(filename) {
            var filePath = imgFolder.fsName + "/" + filename;
            var imgFile = new File(filePath);
            if (!imgFile.exists) {
                alert("Изображение не найдено:\n" + filePath);
                return null;
            }
            return imgFile;
        }

        // ********************************************************************
        // Создадим основную группу, которая делит панель на две части (левая и правая)
        // Основная группа располагается горизонтально
        var mainGroup = panel.add("group");
        mainGroup.orientation = "row";
        mainGroup.alignChildren = ["top", "top"];
        mainGroup.spacing = 10;
        mainGroup.margins = 0;

        // =========================
        // Левая часть: вертикальная группа для aboutPanel
        var leftGroup = mainGroup.add("group");
        leftGroup.orientation = "column";
        leftGroup.alignChildren = ["left", "top"];
        leftGroup.spacing = 2;
        leftGroup.margins = 0;

        // 1. Первая картинка (aboutPanel_logo.png) – 205x27px
        var logoFile = loadImage("aboutPanel_logo.png");
        if (logoFile) {
            var aboutLogo = leftGroup.add("image", undefined, logoFile);
            aboutLogo.size = [205, 27];
        }

        // 2. Вторая картинка (aboutPanel_getNitroNamerLibrary.png) – 205x27px
        var getLibraryFile = loadImage("aboutPanel_getNitroNamerLibrary.png");
        if (getLibraryFile) {
            var aboutGetLibrary = leftGroup.add("image", undefined, getLibraryFile);
            aboutGetLibrary.size = [205, 27];
        }

        // 3. Третья картинка (aboutPanel_checkUpdate.png) – 205x27px
        var checkUpdateFile = loadImage("aboutPanel_checkUpdate.png");
        if (checkUpdateFile) {
            var aboutCheckUpdate = leftGroup.add("image", undefined, checkUpdateFile);
            aboutCheckUpdate.size = [205, 27];
        }

        // =========================
        // Правая часть: вертикальная группа, содержащая сверху 4 кнопки и снизу иконку лицензии
        var rightGroup = mainGroup.add("group");
        rightGroup.orientation = "column";
        rightGroup.alignChildren = "center"; // Для выравнивания по центру горизонтально
        rightGroup.spacing = 4;
        rightGroup.margins = 0;

        // 2.1. Верхняя часть rightGroup: горизонтальная группа для 4 иконок-кнопок
        var iconsGroup = rightGroup.add("group");
        iconsGroup.orientation = "row";
        iconsGroup.alignChildren = ["center", "center"];
        iconsGroup.spacing = 6;
        iconsGroup.margins = 0;

        // Список файлов для иконок и соответствующих им URL
        var iconNames = ["boosty.png", "github.png", "reddit.png", "telegram.png"];
        var urls = {
            "boosty.png": "https://boosty.to/nitrofix",
            "github.png": "https://github.com/NlTROFlX",
            "reddit.png": "https://www.reddit.com/user/nitrofix/",
            "telegram.png": "https://t.me/FixYourVFX"
        };

        // Загружаем файл openWeb.png (иконка для состояния наведения)
        var openWebFile = loadImage("openWeb.png");

        // Создаём кнопки с обработчиками событий для наведения и клика
        for (var i = 0; i < iconNames.length; i++) {
            (function(originalFileName) {
                var originalIconFile = loadImage(originalFileName);
                if (originalIconFile) {
                    var icon = iconsGroup.add("image", undefined, originalIconFile);
                    icon.size = [24, 24];
                    // Сохраняем исходное изображение, чтобы затем вернуть его
                    icon.originalFile = originalIconFile;

                    // При наведении курсора – смена изображения на openWeb.png (если найден)
                    if (openWebFile) {
                        icon.addEventListener("mouseover", function () {
                            this.image = openWebFile;
                            panel.layout.layout(true);
                        });

                        icon.addEventListener("mouseout", function () {
                            this.image = this.originalFile;
                            panel.layout.layout(true);
                        });
                    }

                    // Обработка клика – открытие соответствующего URL
                    icon.addEventListener("click", function () {
                        var url = urls[originalFileName];
                        if (url) {
                            openURL(url);
                        }
                    });
                }
            })(iconNames[i]);
        }

        // 2.2. Нижняя часть rightGroup: иконка лицензии (aboutPanel_License.png) размером 50x50px
        var licenseFile = loadImage("aboutPanel_License.png");
        if (licenseFile) {
            var licenseIcon = rightGroup.add("image", undefined, licenseFile);
            licenseIcon.size = [50, 50];
        }

        return panel;
    }

    // Создаём интерфейс
    var myPanel = buildUI(thisObj);

    // Отображаем панель или окно
    if (myPanel instanceof Window) {
        myPanel.center();
        myPanel.show();
    } else {
        myPanel.layout.layout(true);
    }
})(this);

// Функция для открытия URL в системном браузере
function openURL(url) {
    try {
        if ($.os.indexOf("Mac") !== -1) {
            system.callSystem('open "' + url + '"'); 
        } else if ($.os.indexOf("Windows") !== -1) {
            system.callSystem('cmd.exe /c start "" "' + url + '"');
        } else {
            alert("Unsupported operating system.");
        }
    } catch (e) {
        alert("Error opening URL: " + e.message);
    }
}
