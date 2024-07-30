var scriptMessageHead_1 = "NitroNamer - Layer info";

function showLayerInfoPanel(thisObj) {
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", scriptMessageHead_1, undefined, {resizeable: true});
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.preferredSize.height = 400;
    win.preferredSize.width = 300;
    win.margins = [4,4,4,4];

    var txtLayerInfo = win.add("edittext", undefined, "", {multiline: true, readonly: true});
    txtLayerInfo.alignment = ["fill", "fill"];
    txtLayerInfo.preferredSize.height = 350;

    // Add buttons group
    var grpButtons = win.add("group", undefined);
    grpButtons.orientation = "row";
    grpButtons.alignChildren = ["fill", "center"];
    var scriptFile = new File($.fileName);
    var scriptFolderPath = scriptFile.path.replace("/scripts", "/img");
    grpButtons.margins = [0, -10, 0, 0];

    // Add refresh button with icon and hover effect
    var btnRefresh = grpButtons.add("iconbutton", undefined, File(scriptFolderPath + "/refresh.png"), {style: "toolbutton"});
    btnRefresh.size = [24, 24];
    btnRefresh.imageSize = [24, 24];
    btnRefresh.alignment = ["center", "center"];

    btnRefresh.addEventListener("mouseover", function () {
        btnRefresh.image = File(scriptFolderPath + "/refreshHover.png");
        btnRefresh.imageSize = [24, 24];
    });

    btnRefresh.addEventListener("mouseout", function () {
        btnRefresh.image = File(scriptFolderPath + "/refresh.png");
        btnRefresh.imageSize = [24, 24];
    });

    btnRefresh.onClick = function () {
        updateLayerInfo();
    };

    // Add arrow down button with icon and hover effect
    var btnArrowDown = grpButtons.add("iconbutton", undefined, File(scriptFolderPath + "/arrowDown.png"), {style: "toolbutton"});
    btnArrowDown.size = [24, 24];
    btnArrowDown.imageSize = [24, 24];
    btnArrowDown.alignment = ["center", "center"];

    btnArrowDown.addEventListener("mouseover", function () {
        btnArrowDown.image = File(scriptFolderPath + "/arrowDownHover.png");
        btnArrowDown.imageSize = [24, 24];
    });

    btnArrowDown.addEventListener("mouseout", function () {
        btnArrowDown.image = File(scriptFolderPath + "/arrowDown.png");
        btnArrowDown.imageSize = [24, 24];
    });

    btnArrowDown.onClick = function () {
        switchToNextLayer();
    };

    // Add arrow up button with icon and hover effect
    var btnArrowUp = grpButtons.add("iconbutton", undefined, File(scriptFolderPath + "/arrowUp.png"), {style: "toolbutton"});
    btnArrowUp.size = [24, 24];
    btnArrowUp.imageSize = [24, 24];
    btnArrowUp.alignment = ["center", "center"];

    btnArrowUp.addEventListener("mouseover", function () {
        btnArrowUp.image = File(scriptFolderPath + "/arrowUpHover.png");
        btnArrowUp.imageSize = [24, 24];
    });

    btnArrowUp.addEventListener("mouseout", function () {
        btnArrowUp.image = File(scriptFolderPath + "/arrowUp.png");
        btnArrowUp.imageSize = [24, 24];
    });

    btnArrowUp.onClick = function () {
        switchToPreviousLayer();
    };

    // Add close button
    var btnClose = grpButtons.add("button", undefined, "Close layer info panel");
    btnClose.alignment = ["left", "center"];
    btnClose.size = [260, 24];

    btnClose.onClick = function () {
        win.close();
    };

    function readJSONFile(filePath) {
        var file = new File(filePath);
        var data = {};
        if (file.exists) {
            file.open("r");
            try {
                data = eval("(" + file.read() + ")");
            } catch (e) {
                alert("Error parsing JSON file: " + filePath);
            }
            file.close();
        }
        return data;
    }
    
    function loadVariableSettings() {
        var scriptFile = new File($.fileName);
        var variablesFilePath = scriptFile.path.replace("/scripts", "/scripts/variables.json");
        var variablesFile = new File(variablesFilePath);
        
        return readJSONFile(variablesFile);
    }

    function getEffectNames(layer, settings) {
        var effectNames = [];
        if (layer.property("ADBE Effect Parade") && layer.property("ADBE Effect Parade").numProperties > 0) {
            for (var j = 1; j <= layer.property("ADBE Effect Parade").numProperties; j++) {
                var effect = layer.property("ADBE Effect Parade").property(j);
                effectNames.push(effect.name);
            }
        }
    
        if (effectNames.length > 0) {
            return effectNames.join(", ");
        } else {
            if (settings && settings.E) {
                return settings.E.active ? settings.E.customValue : settings.E.defaultValue;
            } else {
                return "No effects";
            }
        }
    }

    function getFrameRate(layer, settings) {
        if (layer.nullLayer || layer.adjustmentLayer || layer instanceof LightLayer || layer instanceof CameraLayer || layer instanceof TextLayer || layer instanceof ShapeLayer || layer.hasAudio) {
            return settings && settings.F ? (settings.F.active ? settings.F.customValue : settings.F.defaultValue) : "NoFrameRate";
        }
        if (layer.source && layer.source.mainSource instanceof SolidSource) {
            return settings && settings.F ? (settings.F.active ? settings.F.customValue : settings.F.defaultValue) : "NoFrameRate";
        }
        if (layer.source) {
            return layer.source.frameRate.toFixed(2);
        }
        return settings && settings.F ? (settings.F.active ? settings.F.customValue : settings.F.defaultValue) : "NoFrameRate";
    }

    function getResolution(layer, settings) {
        if (layer.nullLayer || layer.adjustmentLayer) {
            return settings && settings.R ? (settings.R.active ? settings.R.customValue : settings.R.defaultValue) : "NoResolution";
        }
        if (layer.source && layer.source.width && layer.source.height) {
            return layer.source.width + "*" + layer.source.height;
        }
        return settings && settings.R ? (settings.R.active ? settings.R.customValue : settings.R.defaultValue) : "NoResolution";
    }

    function getDuration(layer) {
        var duration;
        if (layer.source && layer.source.duration) {
            duration = layer.source.duration;
        } else {
            duration = layer.outPoint - layer.inPoint;
        }

        var hours = Math.floor(duration / 3600);
        var minutes = Math.floor((duration % 3600) / 60);
        var seconds = Math.floor(duration % 60);
        var milliseconds = Math.floor((duration * 1000) % 1000);

        return function(format) {
            switch (format) {
                case '1':
                    return (hours < 10 ? "0" + hours : hours);
                case '2':
                    return (minutes < 10 ? "0" + minutes : minutes);
                case '3':
                    return (seconds < 10 ? "0" + seconds : seconds);
                case '4':
                    return (milliseconds < 100 ? (milliseconds < 10 ? "00" + milliseconds : "0" + milliseconds) : milliseconds);
                default:
                    return (hours < 10 ? "0" + hours : hours) + ":" +
                        (minutes < 10 ? "0" + minutes : minutes) + ":" +
                        (seconds < 10 ? "0" + seconds : seconds);
            }
        };
    }

    function getSourceName(layer) {
        if (layer.source) {
            return layer.source.name;
        }
        return layer.name;
    }

    function getWidth(layer, settings) {
        if (layer.nullLayer || layer.adjustmentLayer) {
            return settings && settings.W ? (settings.W.active ? settings.W.customValue : settings.W.defaultValue) : "NoWidth";
        }
        if (layer.source && layer.source.width) {
            return layer.source.width.toString();
        }
        return settings && settings.W ? (settings.W.active ? settings.W.customValue : settings.W.defaultValue) : "NoWidth";
    }

    function getHeight(layer, settings) {
        if (layer.nullLayer || layer.adjustmentLayer) {
            return settings && settings.H ? (settings.H.active ? settings.H.customValue : settings.H.defaultValue) : "NoHeight";
        }
        if (layer.source && layer.source.height) {
            return layer.source.height.toString();
        }
        return settings && settings.H ? (settings.H.active ? settings.H.customValue : settings.H.defaultValue) : "NoHeight";
    }

    function getLayerPosition(layer) {
        if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
            return ""; // Return an empty string for Audio type layers
        }

        if (layer.transform && layer.transform.position) {
            var pos = layer.transform.position.value;

            // Ensure pos is an array
            if (typeof pos === 'number') {
                pos = [pos];
            } else if (Object.prototype.toString.call(pos) !== '[object Array]') {
                pos = [].slice.call(pos);
            }

            if (layer instanceof CameraLayer || layer instanceof LightLayer || layer.threeDLayer) {
                // Ensure position is returned as X, Y, Z for Camera, Light, and 3D layers
                var roundedPos = [0, 0, 0]; // Default to [0, 0, 0] for safety
                for (var i = 0; i < 3; i++) {
                    roundedPos[i] = pos[i] !== undefined ? Math.round(pos[i] * 10) / 10 : 0;
                }
                return roundedPos.join(", ");
            } else {
                // Return X, Y for 2D layers
                var roundedPos2D = [0, 0]; // Default to [0, 0] for safety
                for (var j = 0; j < 2; j++) {
                    roundedPos2D[j] = pos[j] !== undefined ? Math.round(pos[j] * 10) / 10 : 0;
                }
                return roundedPos2D.join(", ");
            }
        }
        return "NoPosition";
    }

    function getAspectRatio(layer, settings, inPixels) {
        if (layer.nullLayer || layer.adjustmentLayer) {
            return settings && settings.Ar ? (settings.Ar.active ? settings.Ar.customValue : settings.Ar.defaultValue) : "NoAspectRatio";
        }
        if (layer.source && layer.source.width && layer.source.height) {
            var width = layer.source.width;
            var height = layer.source.height;

            if (inPixels) {
                return width + "px:" + height + "px";
            }

            var gcd = function(a, b) {
                return b == 0 ? a : gcd(b, a % b);
            };
            var divisor = gcd(width, height);
            return (width / divisor) + ":" + (height / divisor);
        }
        return settings && settings.Ar ? (settings.Ar.active ? settings.Ar.customValue : settings.Ar.defaultValue) : "NoAspectRatio";
    }

    function getEffectsCount(layer) {
        if (layer.property("ADBE Effect Parade")) {
            return layer.property("ADBE Effect Parade").numProperties;
        }
        return 0;
    }

    function getProjectName() {
        var projectName = "Untitled Project";
        if (app.project.file) {
            var projectFileName = app.project.file.name;
            var lastDotIndex = projectFileName.lastIndexOf('.');
            if (lastDotIndex !== -1) {
                projectName = projectFileName.substring(0, lastDotIndex);
            } else {
                projectName = projectFileName;
            }
        }
        return decodeURIComponent(projectName); // Decode any URL-encoded characters
    }

    function getAnimatedProperties(layer, settings) {
        var animatedProps = [];
    
        function checkPropertyGroup(propertyGroup) {
            for (var i = 1; i <= propertyGroup.numProperties; i++) {
                var prop = propertyGroup.property(i);
    
                if (prop.numKeys > 0) {
                    animatedProps.push(prop.name);
                }
    
                if (prop instanceof PropertyGroup || prop instanceof MaskPropertyGroup) {
                    checkPropertyGroup(prop);
                }
            }
        }
    
        checkPropertyGroup(layer);
    
        if (animatedProps.length > 0) {
            return animatedProps;
        } else {
            if (settings && settings.An) {
                return settings.An.active ? [settings.An.customValue] : [settings.An.defaultValue];
            } else {
                return ["NoAnimations"];
            }
        }
    }

    function getLayerScale(layer) {
        if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
            return ""; // Return an empty string for Audio type layers
        }

        if (layer.transform && layer.transform.scale) {
            var sc = layer.transform.scale.value;

            // Ensure sc is an array
            if (typeof sc === 'number') {
                sc = [sc];
            } else if (Object.prototype.toString.call(sc) !== '[object Array]') {
                sc = [].slice.call(sc);
            }

            if (layer instanceof CameraLayer || layer instanceof LightLayer || layer.threeDLayer) {
                // Ensure scale is returned as X, Y, Z for Camera, Light, and 3D layers
                var roundedSc = [0, 0, 0]; // Default to [0, 0, 0] for safety
                for (var i = 0; i < 3; i++) {
                    roundedSc[i] = sc[i] !== undefined ? Math.round(sc[i] * 10) / 10 : 0;
                }
                return roundedSc.join(", ");
            } else {
                // Return X, Y for 2D layers
                var roundedSc2D = [0, 0]; // Default to [0, 0] for safety
                for (var j = 0; j < 2; j++) {
                    roundedSc2D[j] = sc[j] !== undefined ? Math.round(sc[j] * 10) / 10 : 0;
                }
                return roundedSc2D.join(", ");
            }
        }
        return "NoScale";
    }

    function getLayerRotation(layer) {
        if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
            return ""; // Return an empty string for Audio type layers
        }

        if (layer.transform) {
            var rotation;

            // Handle 3D layers
            if (layer.threeDLayer) {
                var rotationX = layer.transform.xRotation ? layer.transform.xRotation.value : 0;
                var rotationY = layer.transform.yRotation ? layer.transform.yRotation.value : 0;
                var rotationZ = layer.transform.zRotation ? layer.transform.zRotation.value : 0;
                rotation = [rotationX, rotationY, rotationZ];
            } else {
                // Handle 2D layers and layers without xRotation, yRotation, zRotation properties
                rotation = layer.transform.rotation ? [layer.transform.rotation.value] : [0];
            }

            // Ensure rotation is an array
            if (typeof rotation === 'number') {
                rotation = [rotation];
            } else if (Object.prototype.toString.call(rotation) !== '[object Array]') {
                rotation = [].slice.call(rotation);
            }

            // Ensure position is returned as X, Y, Z for Camera, Light, and 3D layers
            if (layer instanceof CameraLayer || layer instanceof LightLayer || layer.threeDLayer) {
                var roundedRot = [0, 0, 0]; // Default to [0, 0, 0] for safety
                for (var i = 0; i < 3; i++) {
                    roundedRot[i] = rotation[i] !== undefined ? Math.round(rotation[i] * 10) / 10 : 0;
                }
                return roundedRot.join(", ");
            } else {
                // Return X for 2D layers
                var roundedRot2D = [0]; // Default to [0] for safety
                roundedRot2D[0] = rotation[0] !== undefined ? Math.round(rotation[0] * 10) / 10 : 0;
                return roundedRot2D.join(", ");
            }
        }
        return "NoRotation";
    }

    function getFileExtension(layer, settings, customExtension) {
        if (layer.source && layer.source.file && layer.source.file.name) {
            var fileName = layer.source.file.name;
            var extension = fileName.split('.').pop();
            if (customExtension) {
                return extension.toLowerCase() === customExtension.toLowerCase() ? customExtension : (settings && settings.Fext ? (settings.Fext.active ? settings.Fext.customValue : settings.Fext.defaultValue) : "NoExtension");
            }
            return extension;
        }
        return settings && settings.Fext ? (settings.Fext.active ? settings.Fext.customValue : settings.Fext.defaultValue) : "NoExtension";
    }

    function getLayerOpacity(layer) {
        if (layer instanceof AVLayer && layer.hasAudio && !layer.hasVideo) {
            return ""; // Return an empty string for Audio type layers
        }

        if (layer.transform && layer.transform.opacity) {
            var opacity = layer.transform.opacity.value;
            return Math.round(opacity * 10) / 10;
        }
        return "NoOpacity";
    }

    function getDurationInFrames(layer) {
        if (layer && layer.containingComp) {
            var frameRate = layer.containingComp.frameRate;
            var duration = (layer.outPoint - layer.inPoint) * frameRate;
            return Math.round(duration);
        }
        return "NoDuration";
    }

    function getExpressionControlledProperties(layer, settings) {
        var expressionProps = [];
    
        function checkPropertyGroup(propertyGroup) {
            for (var i = 1; i <= propertyGroup.numProperties; i++) {
                var prop = propertyGroup.property(i);
                if (prop.expression && prop.expressionEnabled) {
                    expressionProps.push(prop.name);
                }
    
                if (prop instanceof PropertyGroup || prop instanceof MaskPropertyGroup) {
                    checkPropertyGroup(prop);
                }
            }
        }
    
        checkPropertyGroup(layer);
    
        if (expressionProps.length > 0) {
            return expressionProps.join(", ");
        } else {
            if (settings && settings.Lexp) {
                return settings.Lexp.active ? settings.Lexp.customValue : settings.Lexp.defaultValue;
            } else {
                return "NoExpressions";
            }
        }
    }

    function getTrackMatteType(layer, settings) {
        if (layer instanceof CameraLayer || layer instanceof LightLayer) {
            return settings && settings.Tm ? (settings.Tm.active ? settings.Tm.customValue : settings.Tm.defaultValue) : "NoTrackMate";
        } else if (layer.isTrackMatte) {
            return "TM:Source";
        } else if (layer.trackMatteType !== undefined && layer.trackMatteType !== TrackMatteType.NO_TRACK_MATTE) {
            var matteType;
            switch (layer.trackMatteType) {
                case TrackMatteType.ALPHA:
                    matteType = "Alpha";
                    break;
                case TrackMatteType.ALPHA_INVERTED:
                    matteType = "Alpha Inverted";
                    break;
                case TrackMatteType.LUMA:
                    matteType = "Luma";
                    break;
                case TrackMatteType.LUMA_INVERTED:
                    matteType = "Luma Inverted";
                    break;
                default:
                    matteType = "Unknown Track Matte";
            }
            return "TM:" + matteType;
        } else {
            return settings && settings.Tm ? (settings.Tm.active ? settings.Tm.customValue : settings.Tm.defaultValue) : "NoTrackMate";
        }
    }

    function getLayerType(layer) {
        if (layer.nullLayer) return "Null";
        if (layer.adjustmentLayer) return "Adjustment";
        if (layer instanceof AVLayer && layer.hasVideo) {
            if (layer.source instanceof CompItem) return "Pre-comp";
            if (layer.source instanceof FootageItem) {
                if (layer.source.mainSource instanceof SolidSource) return "Solid";
                if (layer.source.mainSource instanceof FileSource) return "Footage";
                if (layer.source.mainSource instanceof AudioSource) return "Audio";
            }
        }
        if (layer instanceof ShapeLayer) return "Shape";
        if (layer instanceof TextLayer) return "Text";
        if (layer instanceof LightLayer) return "Light";
        if (layer instanceof CameraLayer) return "Camera";
        if (layer.hasAudio && !layer.hasVideo) return "Audio";
        return "Unknown";
    }

    function getLayerParentName(layer) {
        if (!layer || !layer.containingComp) {
            return "NoParent";
        }
        if (layer.parent) {
            return layer.parent.name;
        }
        if (isParentLayer(layer)) {
            return layer.name;
        }
        return "NoParent";
    }

    function isParentLayer(layer) {
        if (!layer || !layer.containingComp) {
            return false;
        }
        var comp = layer.containingComp;
        for (var i = 1; i <= comp.numLayers; i++) {
            if (comp.layer(i).parent === layer) {
                return true;
            }
        }
        return false;
    }

    function getLayerParentIndex(layer) {
        if (!layer.parent) {
            return "";
        }

        var parentLayer = layer.parent;
        var comp = layer.containingComp;
        var sameParentLayers = [];
        
        for (var i = 1; i <= comp.numLayers; i++) {
            var currentLayer = comp.layer(i);
            if (currentLayer.parent === parentLayer) {
                sameParentLayers.push(currentLayer);
            }
        }
        
        var relativeIndex = sameParentLayers.indexOf(layer) + 1;
        return relativeIndex;
    }

    function getCurrentDate(format) {
        var date = new Date();
        var day = ("0" + date.getDate()).slice(-2);
        var month = ("0" + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear().toString();
        
        switch (format) {
            case '1':
                return day;
            case '2':
                return month;
            case '3':
                return year;
            default:
                return day + "." + month + "." + year;
        }
    }

    function getMaskCount(layer, settings) {
        if (layer.mask && layer.mask.numProperties > 0) {
            return layer.mask.numProperties;
        } else {
            if (settings && settings.Lmc) {
                return settings.Lmc.active ? settings.Lmc.customValue : settings.Lmc.defaultValue;
            } else {
                return "NoMasks";
            }
        }
    }

    function getMaskNames(layer, settings) {
        if (layer.mask && layer.mask.numProperties > 0) {
            var maskNames = [];
            for (var i = 1; i <= layer.mask.numProperties; i++) {
                maskNames.push(layer.mask.property(i).name);
            }
            return maskNames.join(", ");
        } else {
            if (settings && settings.Lmn) {
                return settings.Lmn.active ? settings.Lmn.customValue : settings.Lmn.defaultValue;
            } else {
                return "NoMaskNames";
            }
        }
    }

    function updateLayerInfo() {
        var proj = app.project;
        if (proj && proj.activeItem instanceof CompItem) {
            var comp = proj.activeItem;
            var layer = comp.selectedLayers.length > 0 ? comp.selectedLayers[0] : comp.layer(1);
    
            if (layer) {
                var settings = loadVariableSettings();
                var durationFunction = getDuration(layer);
    
                var validLayerCount = 0; // Initialize valid layer count
    
                // First pass to count valid layers
                for (var i = 1; i <= comp.numLayers; i++) {
                    var currentLayer = comp.layer(i);
                    if (!currentLayer.locked) {
                        validLayerCount++;
                    }
                }
    
                var validIndex = 0; // Initialize valid layer index
    
                // Second pass to find the index for the selected layer
                for (var j = 1; j <= comp.numLayers; j++) {
                    var currentLayer = comp.layer(j);
                    if (!currentLayer.locked) {
                        validIndex++;
                    }
                    if (currentLayer === layer) {
                        break;
                    }
                }
    
                var info = [
                    "C: " + comp.name,
                    "Pn: " + getProjectName(),
                    "T: " + getLayerType(layer),
                    "i: " + layer.index,
                    "I: " + validIndex,  // Set I to the valid layer index
                    "Lpnt: " + getLayerParentName(layer),
                    "LpntIndex: " + getLayerParentIndex(layer),
                    "O: " + layer.name,
                    "S: " + getSourceName(layer),
                    "D: " + durationFunction(),
                    "D(1): " + durationFunction('1'),
                    "D(2): " + durationFunction('2'),
                    "D(3): " + durationFunction('3'),
                    "D(4): " + durationFunction('4'),
                    "Df: " + getDurationInFrames(layer),
                    "Ip: " + layer.inPoint.toFixed(2),
                    "Op: " + layer.outPoint.toFixed(2),
                    "F: " + getFrameRate(layer, settings),
                    "W: " + getWidth(layer, settings),
                    "H: " + getHeight(layer, settings),
                    "R: " + getResolution(layer, settings),
                    "Ar: " + getAspectRatio(layer, settings),
                    "Lpos: " + getLayerPosition(layer),
                    "Lsc: " + getLayerScale(layer),
                    "Lrot: " + getLayerRotation(layer),
                    "Lops: " + getLayerOpacity(layer),
                    "Lmn: " + getMaskCount(layer, settings),
                    "Lmc: " + getMaskNames(layer, settings),
                    "E: " + getEffectNames(layer, settings),
                    "Ec: " + getEffectsCount(layer),
                    "An: " + getAnimatedProperties(layer, settings).join(", "),
                    "Lexp: " + getExpressionControlledProperties(layer, settings),
                    "Tm: " + getTrackMatteType(layer, settings),
                    "Fext: " + getFileExtension(layer, settings),
                    "Cd: " + getCurrentDate()
                ];
    
                txtLayerInfo.text = info.join("\n");
            } else {
                txtLayerInfo.text = "No layers in composition.";
            }
        } else {
            txtLayerInfo.text = "Please select a valid composition.";
        }
    }

    function switchToNextLayer() {
        var proj = app.project;
        if (proj && proj.activeItem instanceof CompItem) {
            var comp = proj.activeItem;
            var selectedLayer = comp.selectedLayers.length > 0 ? comp.selectedLayers[0] : null;
            
            if (selectedLayer) {
                var nextLayerIndex = selectedLayer.index + 1;
                while (nextLayerIndex <= comp.numLayers && (comp.layer(nextLayerIndex).locked || comp.layer(nextLayerIndex).shy)) {
                    nextLayerIndex++;
                }
                
                if (nextLayerIndex <= comp.numLayers) {
                    comp.layer(nextLayerIndex).selected = true;
                    selectedLayer.selected = false;
                }
            } else {
                // Если ни один слой не выбран, выбрать первый доступный слой
                for (var i = 1; i <= comp.numLayers; i++) {
                    var layer = comp.layer(i);
                    if (!layer.locked && !layer.shy) {
                        layer.selected = true;
                        break;
                    }
                }
            }
            
            updateLayerInfo();
        }
    }
    
    function switchToPreviousLayer() {
        var proj = app.project;
        if (proj && proj.activeItem instanceof CompItem) {
            var comp = proj.activeItem;
            var selectedLayer = comp.selectedLayers.length > 0 ? comp.selectedLayers[0] : null;
            
            if (selectedLayer) {
                var prevLayerIndex = selectedLayer.index - 1;
                while (prevLayerIndex >= 1 && (comp.layer(prevLayerIndex).locked || comp.layer(prevLayerIndex).shy)) {
                    prevLayerIndex--;
                }
                
                if (prevLayerIndex >= 1) {
                    comp.layer(prevLayerIndex).selected = true;
                    selectedLayer.selected = false;
                }
            } else {
                // Если ни один слой не выбран, выбрать первый доступный слой
                for (var i = 1; i <= comp.numLayers; i++) {
                    var layer = comp.layer(i);
                    if (!layer.locked && !layer.shy) {
                        layer.selected = true;
                        break;
                    }
                }
            }
            
            updateLayerInfo();
        }
    }    

    updateLayerInfo();

    if (win instanceof Window) {
        win.center();
        win.show();
    } else {
        win.layout.layout(true);
    }

    return win;
}

var layerInfoPanel = showLayerInfoPanel(this);
if (layerInfoPanel instanceof Panel) {
    layerInfoPanel.layout.layout(true);
} else {
    layerInfoPanel.center();
    layerInfoPanel.show();
}