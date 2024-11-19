document.addEventListener('DOMContentLoaded', function () {
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
});
