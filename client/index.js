// Функция для инициализации обработчиков событий для иконок
function initializeIconClickHandlers() {
    var csInterface = new CSInterface();

    // Получаем все иконки с классом 'clickable-icon'
    var clickableIcons = document.querySelectorAll('.clickable-icon');

    clickableIcons.forEach(function(icon) {
        var url = icon.getAttribute('data-url');
        if (url) {
            icon.style.cursor = 'pointer'; // Изменяем курсор при наведении
            icon.addEventListener('click', function() {
                try {
                    csInterface.openURLInDefaultBrowser(url);
                } catch (error) {
                    console.error("Не удалось открыть URL:", error);
                }
            });
        } else {
            console.error("Для иконки отсутствует атрибут 'data-url'.");
        }
    });
}


// Функция для переключения спойлеров
function toggleSpoiler(spoiler) {
    if (spoiler.classList.contains('inactive')) {
        var allSpoilers = document.querySelectorAll('.spoiler');
        allSpoilers.forEach(function (s) {
            if (s !== spoiler) {
                s.classList.remove('active');
                s.classList.add('inactive');
            }
        });

        spoiler.classList.remove('inactive');
        spoiler.classList.add('active');
        updateActiveIndicator(spoiler);
    } else {
        updateActiveIndicator(spoiler);
    }
}

// Функция для выбора подпункта
function selectSubItem(subItem) {
    var allSubItems = document.querySelectorAll('.spoiler-content p');
    allSubItems.forEach(function (item) {
        item.classList.remove('selected');
    });
    subItem.classList.add('selected');
}

// Функция для отображения контента
function showContent(contentId) {
    var defaultMessage = document.getElementById('default-message');
    if (defaultMessage) {
        defaultMessage.style.display = 'none';
    }

    var contentSections = document.querySelectorAll('#content-sections .content-section');
    contentSections.forEach(function(section) {
        section.style.display = 'none';
    });

    var contentToShow = document.getElementById(contentId);
    if (contentToShow) {
        contentToShow.style.display = 'block';
    } else {
        console.error('Контент с ID ' + contentId + ' не найден.');
    }
}


// Функция для обновления положения индикатора
function updateActiveIndicator(activeSpoiler) {
    var indicator = document.getElementById('active-indicator');
    var indicatorLine = document.getElementById('indicator-line');
    var spoilerTitle = activeSpoiler.querySelector('.spoiler-title-container');
    var subItems = activeSpoiler.querySelectorAll('.spoiler-content p');
    if (spoilerTitle) {
        var offsetTop = activeSpoiler.offsetTop + spoilerTitle.offsetTop + (spoilerTitle.offsetHeight / 2) - (indicator.offsetHeight / 2);
        var indicatorLeft = indicator.getBoundingClientRect().left - indicator.parentElement.getBoundingClientRect().left;
        indicator.style.top = offsetTop + 'px';
        indicatorLine.style.height = offsetTop + 'px';
        indicatorLine.style.left = indicatorLeft + (indicator.offsetWidth / 2) + 'px';
        indicator.textContent = subItems.length; // Обновляем число подпунктов в кружке
    }
}

// Инициализация после загрузки страницы
document.addEventListener('DOMContentLoaded', function () {
    var csInterface = new CSInterface();

    // Инициализация активного спойлера
    var activeSpoiler = document.querySelector('.spoiler.active');
    if (activeSpoiler) {
        updateActiveIndicator(activeSpoiler);
    }

    // Обработчики кликов для иконок
    var clickableIcons = document.querySelectorAll('.clickable-icon');

    clickableIcons.forEach(function(icon) {
        var url = icon.getAttribute('data-url');
        if (url) {
            icon.style.cursor = 'pointer'; // Изменяем курсор при наведении
            icon.addEventListener('click', function() {
                try {
                    csInterface.openURLInDefaultBrowser(url);
                } catch (error) {
                    console.error("Не удалось открыть URL:", error);
                }
            });
        } else {
            console.error("Для иконки отсутствует атрибут 'data-url'.");
        }
    });
});
