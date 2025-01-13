// Определяем функцию для загрузки изображения по имени файла из папки img,
// которая расположена на уровень выше папки со скриптом.
function loadImage(fileName) {
    // Определяем местоположение скрипта
    var scriptFile = new File($.fileName);
    // Поднимаемся на уровень выше
    var scriptFolder = scriptFile.parent;
    var parentFolder = scriptFolder.parent;
    // Папка с изображениями
    var imgFolder = new Folder(parentFolder.fsName + "/img");
    var imgFile = new File(imgFolder.fsName + "/" + fileName);
    if(imgFile.exists){
        return ScriptUI.newImage(imgFile);
    } else {
        alert("Файл изображения не найден:\n" + imgFile.fsName);
        return null;
    }
}

// Создаём палитру (панель)
var win = new Window("palette", "My Panel", undefined, {resizeable:false});
win.preferredSize = [238, 68];

// Создаём основную группу, которая будет содержать все элементы
var mainGroup = win.add("group", undefined);
mainGroup.orientation = "row";
mainGroup.alignChildren = ["left","center"];

// --- Левая часть: первая кнопка ---
// Контейнер для первой кнопки (фиксированный размер)
var leftGroup = mainGroup.add("group", undefined);
leftGroup.orientation = "column";
leftGroup.alignChildren = ["left","center"];
leftGroup.minimumSize = [132, 68];
leftGroup.maximumSize = [132, 68];

// Загружаем изображение для первой кнопки
var img1 = loadImage("aboutIcon_1.png"); // замените "btn1.png" на нужное имя файла
var btn1 = leftGroup.add("iconbutton", undefined, img1, {style:"toolbutton"});
// Фиксируем размер кнопки
btn1.size = [132, 17];


// --- Правый блок: 4 иконки ---
// Создаём группу, которая будет заполнять оставшееся пространство
var rightGroup = mainGroup.add("group", undefined);
rightGroup.orientation = "row";
// Чтобы гарантировать выравнивание по правому краю, добавим пустое пространство слева.
rightGroup.alignment = "fill";

// Добавляем фиксированный отступ слева от группы иконок (минимум 12px)
rightGroup.add("panel", [0,0,12,1]);  // невидимый элемент для отступа

// Группа для иконок
var iconsGroup = rightGroup.add("group");
iconsGroup.orientation = "row";

// Для выравнивания по правому краю всей панели можно использовать следующий подход.
// Определяем количество иконок и их ширину
var iconCount = 4;
var iconWidth = 24;
var totalIconsWidth = iconCount * iconWidth;
// Рассчитываем свободное пространство, оставшееся справа от отступа после первой кнопки:
var availableWidth = 238 - 132 - 12; // 94px
// Если availableWidth > totalIconsWidth, то можно вычислить отступ между иконками:
// Но в нашем случае 94 < 96, поэтому расставим иконки так, чтобы правая иконка прилегала к правому краю.
var gapBetween = (availableWidth - totalIconsWidth) / (iconCount - 1); 
// gapBetween может получиться отрицательным (около -0.67px), что означает небольшое переполнение.
// Можно задать gap = 0 для избежания переполнения, или оставить как есть.
if(gapBetween < 0) gapBetween = 0;

// Добавляем 4 кнопки с иконками
// Для примера предполагается, что имена файлов кнопок: btn2.png, btn3.png, btn4.png, btn5.png.
var iconFiles = ["boosty.png", "github.png", "reddit.png", "telegram.png"];
for(var i = 0; i < iconCount; i++){
    var iconImage = loadImage(iconFiles[i]);
    var btn = iconsGroup.add("iconbutton", undefined, iconImage, {style:"toolbutton"});
    btn.size = [iconWidth, iconWidth];
    // Добавляем промежуток справа, кроме последней кнопки
    if(i < iconCount - 1){
        // Промежуток между иконками
        iconsGroup.add("statictext", undefined, "").preferredSize = [gapBetween, 1];
    }
}

// Отображаем окно
win.center();
win.show();
