var scriptVersion = "2025.1";

(function (thisObj) {

    function buildUI(thisObj) {

        var panel = (thisObj instanceof Panel) 
            ? thisObj 
            : new Window("palette", "About NitroNamer", undefined, { resizeable: true });
        panel.margins = [4, 4, 4, 4];
        panel.spacing = 4;

        panel.preferredSize.height = 120;

        var scriptFile = new File($.fileName);
        var scriptFolder = scriptFile.parent;
        var parentFolder = scriptFolder.parent;
        var imgFolder = new Folder(parentFolder.fsName + "/img");

        if (!imgFolder.exists) {
            alert("Папка 'img' не найдена по пути:\n" + imgFolder.fsName);
            return panel;
        }

        function loadImage(filename) {
            var filePath = imgFolder.fsName + "/" + filename;
            var imgFile = new File(filePath);
            if (!imgFile.exists) {
                alert("Изображение не найдено:\n" + filePath);
                return null;
            }
            return imgFile;
        }

        var mainGroup = panel.add("group");
        mainGroup.orientation = "row";
        mainGroup.alignChildren = ["top", "top"];
        mainGroup.spacing = 10;
        mainGroup.margins = 0;

        var leftGroup = mainGroup.add("group");
        leftGroup.orientation = "column";
        leftGroup.alignChildren = ["left", "top"];
        leftGroup.spacing = 2;
        leftGroup.margins = 0;

var logoFile = loadImage("aboutPanel_logo.png");
if (logoFile) {
    var aboutLogo = leftGroup.add("image", undefined, logoFile);
    aboutLogo.size = [205, 27];

    var logoCycleNames = [
        "aboutPanel_logo1.png",
        "aboutPanel_logo2.png",
        "aboutPanel_logo3.png"
    ];

    aboutLogo.cycleImages = [];
    for (var i = 0; i < logoCycleNames.length; i++) {
        var cycleImg = loadImage(logoCycleNames[i]);
        if (cycleImg) {
            aboutLogo.cycleImages.push(cycleImg);
        }
    }

    aboutLogo.currentIndex = 0;

    aboutLogo.addEventListener("mouseover", function () {
        if (this.cycleImages.length > 0) {
            if (this.currentIndex < this.cycleImages.length) {
                this.image = this.cycleImages[this.currentIndex];
                this.currentIndex++;
            } else {

                this.image = logoFile;
                this.currentIndex = 0;
            }
            panel.layout.layout(true);
        }
    });

}

        var getLibraryFile = loadImage("aboutPanel_getNitroNamerLibrary.png");
        if (getLibraryFile) {
            var aboutGetLibrary = leftGroup.add("image", undefined, getLibraryFile);
            aboutGetLibrary.size = [205, 27];

            var getLibraryHoverFile = loadImage("aboutPanel_getNitroNamerLibrary_Hover.png");
            if (getLibraryHoverFile) {

                aboutGetLibrary.originalFile = getLibraryFile;
                aboutGetLibrary.hoverFile = getLibraryHoverFile;

                aboutGetLibrary.addEventListener("mouseover", function() {
                    this.image = this.hoverFile;
                    panel.layout.layout(true);
                });

                aboutGetLibrary.addEventListener("mouseout", function() {
                    this.image = this.originalFile;
                    panel.layout.layout(true);
                });
            }

            aboutGetLibrary.addEventListener("click", function() {
                openURL("https://example.com/getLibrary");
            });
        }

        var checkUpdateNotFoundFile = loadImage("aboutPanel_checkUpdateNotFound.png");   
        var checkUpdateWasFoundFile = loadImage("aboutPanel_checkUpdateWasFound.png");   

        var checkUpdateFile = loadImage("aboutPanel_checkUpdate.png");
if (checkUpdateFile) {
    var aboutCheckUpdate = leftGroup.add("image", undefined, checkUpdateFile);
    aboutCheckUpdate.size = [205, 27];

    var checkUpdateHoverFile = loadImage("aboutPanel_checkUpdate_Hover.png");
    if (checkUpdateHoverFile) {
        aboutCheckUpdate.originalFile = checkUpdateFile;
        aboutCheckUpdate.hoverFile = checkUpdateHoverFile;

        aboutCheckUpdate.hasUpdate = false;

        aboutCheckUpdate.addEventListener("mouseover", function() {

            if (!this.hasUpdate) {
                this.image = this.hoverFile;
                panel.layout.layout(true);
            }
        });

        aboutCheckUpdate.addEventListener("mouseout", function() {

            if (!this.hasUpdate) {
                this.image = this.originalFile;
                panel.layout.layout(true);
            }
        });
    }
}

aboutCheckUpdate.addEventListener("click", function() {
    if (!this.hasUpdate) {

        var result = checkForUpdatesQuietly(); 

        if (result.newer) {

            this.hasUpdate = true; 
            if (checkUpdateWasFoundFile) {
                this.image = checkUpdateWasFoundFile;  
                panel.layout.layout(true);
            }
        } else {

            this.hasUpdate = false;
            if (checkUpdateNotFoundFile) {
                this.image = checkUpdateNotFoundFile;  
                panel.layout.layout(true);
            }
        }
    } else {

        openURL("https://github.com/NlTROFlX/NitroNamer/releases");

    }
});

        var rightGroup = mainGroup.add("group");
        rightGroup.orientation = "column";
        rightGroup.alignChildren = "center"; 
        rightGroup.spacing = 4;
        rightGroup.margins = 0;

        var iconsGroup = rightGroup.add("group");
        iconsGroup.orientation = "row";
        iconsGroup.alignChildren = ["center", "center"];
        iconsGroup.spacing = 6;
        iconsGroup.margins = 0;

        var iconNames = ["boosty.png", "patreon.png", "github.png", "reddit.png", "telegram.png"];
        var urls = {
            "boosty.png": "https://boosty.to/nitrofix",
            "github.png": "https://github.com/NlTROFlX",
            "reddit.png": "https://www.reddit.com/user/nitrofix/",
            "telegram.png": "https://t.me/FixYourVFX",
            "patreon.png": "https://www.patreon.com/c/NITROFIX"
        };
        

        var openWebFile = loadImage("openWeb.png");

        for (var i = 0; i < iconNames.length; i++) {
            (function(originalFileName) {
                var originalIconFile = loadImage(originalFileName);
                if (originalIconFile) {
                    var icon = iconsGroup.add("image", undefined, originalIconFile);
                    icon.size = [24, 24];

                    icon.originalFile = originalIconFile;

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

                    icon.addEventListener("click", function () {
                        var url = urls[originalFileName];
                        if (url) {
                            openURL(url);
                        }
                    });
                }
            })(iconNames[i]);
        }

        var licenseFile = loadImage("aboutPanel_License.png");
        if (licenseFile) {
            var licenseIcon = rightGroup.add("image", undefined, licenseFile);
            licenseIcon.preferredSize = [100,50];

            var licenseHoverFile = loadImage("aboutPanel_LicenseHover.png");
            if (licenseHoverFile) {
                licenseIcon.originalFile = licenseFile;
                licenseIcon.hoverFile = licenseHoverFile;
                licenseIcon.addEventListener("mouseover", function() {
                    this.image = this.hoverFile;
                    panel.layout.layout(true);
                });
                licenseIcon.addEventListener("mouseout", function() {
                    this.image = this.originalFile;
                    panel.layout.layout(true);
                });
            }

            licenseIcon.addEventListener("click", function () {
                openURL("https://github.com/NlTROFlX/NitroNamer?tab=MIT-1-ov-file#readme");
            });
        }

        panel.layout.layout(true);
        return panel;
    }

    var myPanel = buildUI(thisObj);

    if (myPanel instanceof Window) {
        myPanel.center();
        myPanel.show();
    } else {
        myPanel.layout.layout(true);
    }
})(this);

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

function checkForUpdatesQuietly() {
    var result = { newer: false, latestVersion: null };
    var githubApiUrl = "https://api.github.com/repos/NlTROFlX/NitroNamer/releases/latest";

    try {
        var curlCmd = 'curl -s -H "User-Agent: NitroNamer" "' + githubApiUrl + '"';
        var response = system.callSystem(curlCmd);

        if (response) {
            var tagNameMatch = response.match(/"tag_name":\s*"v?([0-9.]+)"/);
            if (tagNameMatch) {
                var latestVersion = tagNameMatch[1];
                result.latestVersion = latestVersion;

                if (compareVersions(latestVersion, scriptVersion) > 0) {
                    result.newer = true;
                }
            }
        }
    } catch (e) {

    }

    return result;
}

function compareVersions(a, b) {
    var aParts = a.split(".");
    var bParts = b.split(".");
    var maxLen = Math.max(aParts.length, bParts.length);

    for (var i = 0; i < maxLen; i++) {
        var aNum = parseInt(aParts[i]) || 0;
        var bNum = parseInt(bParts[i]) || 0;
        if (aNum > bNum) return 1;
        if (aNum < bNum) return -1;
    }
    return 0;
}