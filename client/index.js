// Объект для хранения переводов
var translations = {};
var defaultTranslations = {};
var currentContentSection = null;

// Функция для загрузки перевода выбранного языка
function loadTranslations(e) {
    var t = new CSInterface(),
        a = t.getSystemPath(SystemPath.EXTENSION);
    t.evalScript(
        'readTranslationFile("' + e + '", "' + a + '")',
        function (t) {
            if (t)
                try {
                    (translations = JSON.parse(t)), applyTranslations();
                } catch (a) {
                    console.error("Ошибка парсинга файла перевода:", a),
                        "EN" !== e && loadTranslations("EN");
                }
            else
                console.error("Файл перевода не найден или пустой."),
                "EN" !== e && loadTranslations("EN");
        }
    );
}


// Функция для применения переводов к элементам интерфейса
function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach(function (e) {
        var t = e.getAttribute("data-i18n"),
            a = translations[t];
        a || (a = defaultTranslations[t] || e.textContent), (e.innerHTML = a);
    });
}

// Объект с английскими переводами по умолчанию
var defaultTranslations = {};

// Функция для загрузки английских переводов по умолчанию
function loadDefaultTranslations(e) {
    var t = new CSInterface(),
        a = t.getSystemPath(SystemPath.EXTENSION);
    t.evalScript('readTranslationFile("EN", "' + a + '")', function (t) {
        if (t)
            try {
                (defaultTranslations = JSON.parse(t)), e && e();
            } catch (a) {
                console.error("Ошибка парсинга файла английского перевода:", a);
            }
        else
            console.error("Файл английского перевода не найден или пустой.");
    });
}

// Функция для инициализации обработчиков событий для иконок
function initializeIconClickHandlers() {
    var e = new CSInterface();
    document.querySelectorAll(".clickable-icon").forEach(function (t) {
        var a = t.getAttribute("data-url");
        a
            ?
            ((t.style.cursor = "pointer"),
                t.addEventListener("click", function () {
                    try {
                        e.openURLInDefaultBrowser(a);
                    } catch (t) {
                        console.error("Не удалось открыть URL:", t);
                    }
                })) :
            console.error("Для иконки отсутствует атрибут 'data-url'.");
    });
}


// Функция для переключения спойлеров
function toggleSpoiler(e){
    if(e.classList.contains("inactive")){
        // Закрываем другие спойлеры
        document.querySelectorAll(".spoiler").forEach(function(t){
            if(t !== e){
                t.classList.remove("active");
                t.classList.add("inactive");
            }
        });
        // Открываем текущий спойлер
        e.classList.remove("inactive");
        e.classList.add("active");

        // Показываем круговой индикатор с переходом
        var indicator = document.getElementById("active-indicator");
        if(indicator){
            indicator.style.opacity = "1";
        }

        // Показываем линию индикатора с переходом
        var indicatorLine = document.getElementById("indicator-line");
        if(indicatorLine){
            indicatorLine.style.opacity = "1";
        }
    }

    updateActiveIndicator(e);
}

function selectSubItem(e) {
    document.querySelectorAll(".spoiler-content p").forEach(function (e) {
            e.classList.remove("selected");
        }),
        e.classList.add("selected");
}

// Функция для отображения контента
function showContent(e) {
    var defaultMessage = document.getElementById("default-message");
    if (defaultMessage) {
        defaultMessage.style.display = "none";
    }

    // Пауза видео в текущем контентном разделе перед его скрытием
    if (currentContentSection) {
        var currentSectionElement = document.getElementById(currentContentSection);
        if (currentSectionElement) {
            var videos = currentSectionElement.getElementsByTagName("video");
            for (var i = 0; i < videos.length; i++) {
                videos[i].pause();
            }
        }
    }

    // Скрытие всех контентных разделов
    var contentSections = document.querySelectorAll("#content-sections .content-section");
    contentSections.forEach(function (section) {
        section.style.display = "none";
    });

    // Отображение выбранного контентного раздела
    var newSection = document.getElementById(e);
    if (newSection) {
        newSection.style.display = "block";
        currentContentSection = e; // Обновление текущего контентного раздела
    } else {
        console.error("Контент с ID " + e + " не найден.");
    }
}

// Функция для обновления положения индикатора
function updateActiveIndicator(e) {
    var t = document.getElementById("active-indicator"),
        a = document.getElementById("indicator-line"),
        n = e.querySelector(".spoiler-title-container"),
        o = e.querySelectorAll(".spoiler-content p");
    if (n) {
        var l =
            e.offsetTop + n.offsetTop + n.offsetHeight / 2 - t.offsetHeight / 2,
            i =
            t.getBoundingClientRect().left -
            t.parentElement.getBoundingClientRect().left;
        (t.style.top = l + "px"),
        (a.style.height = l + "px"),
        (a.style.left = i + t.offsetWidth / 2 + "px"),
        (t.textContent = o.length);
    }
}

// Функция для инициализации выпадающего списка языка
function initializeLanguageSelector() {
    var e = document.querySelector(".language-selector"),
        t = e.querySelector(".selected-language"),
        a = e.querySelector(".language-dropdown").querySelectorAll(".language-option");
    e.addEventListener("click", function (t) {
            t.stopPropagation();
            var a = e.classList.toggle("active");
            e.setAttribute("aria-expanded", a);
        }),
        a.forEach(function (a) {
            a.addEventListener("click", function (a) {
                a.stopPropagation();
                var n = this.textContent;
                (t.textContent = n),
                e.classList.remove("active"),
                    e.setAttribute("aria-expanded", "false");
                var o = new CSInterface(),
                    l = o.getSystemPath(SystemPath.EXTENSION);
                o.evalScript('saveSelectedLanguage("' + n + '", "' + l + '")'),
                    loadTranslations(n);
            });
        }),
        document.addEventListener("click", function () {
            e.classList.remove("active"), e.setAttribute("aria-expanded", "false");
        });
}

document.querySelector('.top-bar').addEventListener('click', showHomePage);

function showHomePage(){
    // Показываем домашнюю страницу
    showContent('default-message');

    // Скрываем круговой индикатор с переходом
    var indicator = document.getElementById("active-indicator");
    if(indicator){
        indicator.style.opacity = "0";
    }

    // Скрываем линию индикатора с переходом
    var indicatorLine = document.getElementById("indicator-line");
    if(indicatorLine){
        indicatorLine.style.opacity = "0";
    }

    // Сбрасываем выделенные элементы (если необходимо)
    document.querySelectorAll(".spoiler-content p").forEach(function(p){
        p.classList.remove("selected");
    });

    // Деактивируем все активные спойлеры
    document.querySelectorAll(".spoiler.active").forEach(function(spoiler){
        spoiler.classList.remove("active");
        spoiler.classList.add("inactive");
    });
}


// Инициализация активного спойлера
var activeSpoiler = document.querySelector('.spoiler.active');
if (activeSpoiler) {
    updateActiveIndicator(activeSpoiler);
}

// Функция для копирования текста в буфер обмена с использованием document.execCommand('copy')
function copyToClipboard(e) {
    var t = document.createElement("textarea");
    (t.value = e),
    (t.style.position = "fixed"),
    (t.style.opacity = "0"),
    document.body.appendChild(t),
        t.focus(),
        t.select();
    try {
        if (document.execCommand("copy")) {
            console.log("Текст скопирован в буфер обмена:", e);
            let a = currentHoveredElement;
            a &&
                (a.copyTimeout && clearTimeout(a.copyTimeout),
                    a.classList.add("show-copied"),
                    (a.copyTimeout = setTimeout(function () {
                        a.classList.remove("show-copied"), delete a.copyTimeout;
                    }, 1125)));
        } else console.error("Не удалось скопировать текст");
    } catch (n) {
        console.error("Ошибка при попытке скопировать текст:", n);
    }
    document.body.removeChild(t);
}

// Переменная для хранения текущего элемента под курсором
activeSpoiler && updateActiveIndicator(activeSpoiler);
let currentHoveredElement = null;

// Отслеживаем перемещение мыши и обновляем текущий элемент
document.addEventListener('mousemove', function (event) {
    let element = document.elementFromPoint(event.clientX, event.clientY);

    if (element) {
        if (element.classList.contains('variable-name-block') || element.classList.contains('variable-example-block')) {
            currentHoveredElement = element;
        } else {
            let parent = element.closest('.variable-name-block, .variable-example-block');
            if (parent) {
                currentHoveredElement = parent;
            } else {
                currentHoveredElement = null;
            }
        }
    }
});

// Отслеживаем нажатие клавиш
document.addEventListener('keydown', function (event) {
    if (event.ctrlKey && (event.key === 'c' || event.key === 'C')) {
        if (currentHoveredElement) {
            let valueToCopy = currentHoveredElement.getAttribute('data-value');
            if (valueToCopy) {
                copyToClipboard(valueToCopy);
                event.preventDefault();
            }
        }
    }
});

// Обновляем функцию загрузки настроек при запуске панели
function loadSettings() {
    var e = new CSInterface(),
        t = e.getSystemPath(SystemPath.EXTENSION);
    e.evalScript('loadSettings("' + t + '")', function (e) {
        var t = JSON.parse(e),
            a = "EN";
        t && t.language && (a = t.language.toUpperCase()),
            (document.querySelector(".selected-language").textContent = a),
            loadDefaultTranslations(function () {
                loadTranslations(a);
            });
    });
}

document.addEventListener("mousemove", function (e) {
        let t = document.elementFromPoint(e.clientX, e.clientY);
        if (t) {
            if (
                t.classList.contains("variable-name-block") ||
                t.classList.contains("variable-example-block")
            )
                currentHoveredElement = t;
            else {
                let a = t.closest(".variable-name-block, .variable-example-block");
                currentHoveredElement = a || null;
            }
        }
    }),
    document.addEventListener("keydown", function (e) {
        if (e.ctrlKey && ("c" === e.key || "C" === e.key) && currentHoveredElement) {
            let t = currentHoveredElement.getAttribute("data-value");
            t && (copyToClipboard(t), e.preventDefault());
        }
    }),
    document.addEventListener("DOMContentLoaded", function(){
        initializeLanguageSelector();
        initializeIconClickHandlers();
        loadDefaultTranslations();
        loadSettings();
    
        // Добавляем обработчик клика на .top-bar
        document.querySelector('.top-bar').addEventListener('click', showHomePage);
    });