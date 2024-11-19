// host/index.jsx

function openURL(url) {
    // Для Windows
    if ($.os.indexOf("Windows") !== -1) {
        app.system("start " + url);
    }
    // Для macOS
    else if ($.os.indexOf("Macintosh") !== -1) {
        app.system("open " + url);
    }
}

function showMessage(msg) {
    alert(msg);
}
