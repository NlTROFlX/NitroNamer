function loadSettingsFromFile() {
    var scriptFile = new File($.fileName);
    var scriptFolderPath = scriptFile.path + "/../settings";
    var settingsFile = new File(scriptFolderPath + "/settings.json");

    var settings = {};
    if (settingsFile.exists) {
        settingsFile.open("r");
        var fileContent = settingsFile.read();
        settings = JSON.parse(fileContent);
        settingsFile.close();
        $.writeln("[DEBUG]: Settings loaded successfully from: " + settingsFile.fsName);
    } else {
        alert("Settings file not found at: " + settingsFile.fsName);
        $.writeln("[DEBUG]: Settings file not found at: " + settingsFile.fsName);
    }

    return settings;
}

// Function to get key values from currentSettings
function getKeyValues() {
    try {
        var settings = loadSettingsFromFile();
        var currentSettings = settings.currentSettings || {};

        var allLayers = currentSettings.allLayers;
        var template = currentSettings.template;
        var briefly = currentSettings.briefly;
        var brieflyType = currentSettings.brieflyType;

        return {
            allLayers: allLayers,
            template: template,
            briefly: briefly,
            brieflyType: brieflyType
        };
    } catch (error) {
        alert("Error: " + error.message);
        $.writeln("[DEBUG]: Error loading key values: " + error.message);
        return null;
    }
}

function getBrieflyTypeString(index) {
    var brieflyTypes = [
        "Camel Case",
        "Pascal Case",
        "Snake Case",
        "Kebab Case",
        "Screaming Snake Case",
        "This Comp"
    ];
    return brieflyTypes[index] || "Camel Case"; // default to "Camel Case" if index is out of range
}

// Convert string to camel case
function toCamelCase(str) {
    return str.split(/(\d+|\W+)/).map(function(part, index) {
        if (index === 0) {
            return part.toLowerCase();
        }
        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    }).join('');
}

// Convert string to pascal case
function toPascalCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Convert string to snake case
function toSnakeCase(str) {
    return str.replace(/\s+/g, '_').toLowerCase();
}

// Convert string to kebab case
function toKebabCase(str) {
    return str.replace(/\s+/g, '-').toLowerCase();
}

// Convert string to screaming snake case
function toScreamingSnakeCase(str) {
    return str.replace(/\s+/g, '_').toUpperCase();
}

// Add comp name to the string
function toThisComp(str) {
    var compName = app.project.activeItem.name;
    return "[" + compName + "] " + str;
}

// Function to get the effect names applied to a layer
function getEffectNames(layer) {
    var effectNames = [];
    if (layer.property("ADBE Effect Parade") && layer.property("ADBE Effect Parade").numProperties > 0) {
        for (var j = 1; j <= layer.property("ADBE Effect Parade").numProperties; j++) {
            var effect = layer.property("ADBE Effect Parade").property(j);
            effectNames.push(effect.name);
        }
    }
    return effectNames;
}

// Replace variables in the template with actual values
function replaceVariables(template, variables) {
    return template.replace(/\(([^()]+)\)|E\(([^)]+)\)|E\{([^}]+)\}|An\(([^)]+)\)|An\{([^}]+)\}|D\(([^)]+)\)|Df|D|Ec|Fext\(([^)]+)\)|Fext|Lexp|Ip|Op|Tm|An|Ar|Pn|Lpos|Lsc|Lrot|Lops|[A-Z]|i|I|S|W|H/g, function(match, group, customEffectDelimiterParentheses, customEffectDelimiterBraces, customAnimDelimiterParentheses, customAnimDelimiterBraces, durationFormat, customFext) {
        if (group) {
            return group;  // Handle text inside parentheses
        } else if (customEffectDelimiterParentheses !== undefined) {
            var effectsString = variables['E'].split(', ').join(customEffectDelimiterParentheses);
            return effectsString;
        } else if (customEffectDelimiterBraces !== undefined) {
            var effectsString = variables['E'].split(', ').join(customEffectDelimiterBraces);
            return effectsString;
        } else if (customAnimDelimiterParentheses !== undefined) {
            var animatedPropsString = variables['An'].split(', ').join(customAnimDelimiterParentheses);
            return animatedPropsString;
        } else if (customAnimDelimiterBraces !== undefined) {
            var animatedPropsString = variables['An'].split(', ').join(customAnimDelimiterBraces);
            return animatedPropsString;
        } else if (durationFormat !== undefined) {
            return typeof variables['D'] === 'function' ? variables['D'](durationFormat) : variables['D'];
        } else if (match === 'D') {
            return typeof variables['D'] === 'function' ? variables['D']() : variables['D'];
        } else if (match === 'Df') {
            return variables['Df'];
        } else if (match === 'Ec') {
            return variables['Ec'];
        } else if (match === 'Fext') {
            return variables['Fext'];
        } else if (customFext !== undefined) {
            return variables['Fext'] === customFext ? customFext : "";
        } else if (match === 'Lexp') {
            return variables['Lexp'];
        } else if (match === 'Ip') {
            return variables['Ip'];
        } else if (match === 'Op') {
            return variables['Op'];
        } else if (match === 'Tm') {
            return variables['Tm'];
        } else if (match === 'Ar') {
            return variables['Ar'];
        } else if (match === 'Pn') {
            return variables['Pn'];
        } else if (match === 'Lpos') {
            return variables['Lpos'];
        } else if (match === 'Lsc') {
            return variables['Lsc'];
        } else if (match === 'Lrot') {
            return variables['Lrot'];
        } else if (match === 'Lops') {
            return variables['Lops'];
        } else {
            return variables[match] !== undefined ? variables[match] : match;
        }
    });
}

// Function to generate new name based on the template and variables
function generateNewName(layer, template, briefly, brieflyType) {
    var effectNames = getEffectNames(layer);

    var effectsString = effectNames.length > 0 ? effectNames.join(", ") : "ClearLayer";
    var compName = app.project.activeItem.name;
    var frameRate = getFrameRate(layer);
    var duration = getDuration(layer);
    var durationInFrames = getDurationInFrames(layer);
    var projectName = getProjectName();
    var expressionProps = getExpressionControlledProperties(layer);
    var fileExtension = getFileExtension(layer);

    var animatedProps = getAnimatedProperties(layer);
    var animatedPropsString = animatedProps.length > 0 ? animatedProps.join(", ") : "NoAnimations";

    var variables = {
        "T": getLayerType(layer),
        "i": layer.index,
        "I": localIndex,
        "O": layer.name,
        "E": effectsString,
        "An": animatedPropsString,
        "F": frameRate,
        "R": getResolution(layer),
        "D": duration,
        "Df": durationInFrames,
        "C": compName,
        "Ip": layer.inPoint.toFixed(2),
        "Op": layer.outPoint.toFixed(2),
        "S": getSourceName(layer),
        "W": getWidth(layer),
        "H": getHeight(layer),
        "Tm": getTrackMatteType(layer),
        "Ar": getAspectRatio(layer),
        "Ec": getEffectsCount(layer),
        "Pn": projectName,
        "Lpos": getLayerPosition(layer),
        "Lsc": getLayerScale(layer),
        "Lrot": getLayerRotation(layer),
        "Lops": getLayerOpacity(layer),
        "Lexp": expressionProps,
        "Fext": fileExtension
    };

    var newName = replaceVariables(template, variables);

    if (briefly) {
        switch (brieflyType) {
            case "Camel Case":
                newName = toCamelCase(newName);
                break;
            case "Pascal Case":
                newName = toPascalCase(newName);
                break;
            case "Snake Case":
                newName = toSnakeCase(newName);
                break;
            case "Kebab Case":
                newName = toKebabCase(newName);
                break;
            case "Screaming Snake Case":
                newName = toScreamingSnakeCase(newName);
                break;
            case "This Comp":
                newName = toThisComp(newName);
                break;
        }
    }

    return newName;
}

// Get the type of a layer
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

// Get the frame rate of a layer
function getFrameRate(layer) {
    if (layer.nullLayer || layer.adjustmentLayer || layer instanceof LightLayer || layer instanceof CameraLayer || layer instanceof TextLayer || layer instanceof ShapeLayer || layer.hasAudio) {
        return "NoFrameRate";
    }
    if (layer.source && layer.source.mainSource instanceof SolidSource) {
        return "NoFrameRate";
    }
    if (layer.source) {
        return layer.source.frameRate.toFixed(2);
    }
    return "NoFrameRate";
}

// Get the resolution of a layer
function getResolution(layer) {
    if (layer.nullLayer || layer.adjustmentLayer) {
        return "NoResolution";
    }
    if (layer.source && layer.source.width && layer.source.height) {
        return layer.source.width + "*" + layer.source.height;
    }
    return "NoResolution";
}

// Get the duration of a layer
function getDuration(layer) {
    var duration;
    if (layer.source && layer.source.duration) {
        duration = layer.source.duration;
    } else if (layer.hasAudio || layer.hasVideo) {
        duration = layer.outPoint - layer.inPoint;
    } else {
        return function() {
            return "NoLimit";
        };
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

// Get the source name of a layer
function getSourceName(layer) {
    if (layer.source) {
        return layer.source.name;
    }
    return "NoSource";
}

// Get the width of a layer
function getWidth(layer) {
    if (layer.nullLayer || layer.adjustmentLayer) {
        return "NoWidth";
    }
    if (layer.source && layer.source.width) {
        return layer.source.width.toString();
    }
    return "NoWidth";
}

// Get the height of a layer
function getHeight(layer) {
    if (layer.nullLayer || layer.adjustmentLayer) {
        return "NoHeight";
    }
    if (layer.source && layer.source.height) {
        return layer.source.height.toString();
    }
    return "NoHeight";
}

// Get the position of a layer
function getLayerPosition(layer) {
    if (layer.transform && layer.transform.position) {
        var pos = layer.transform.position.value;
        var roundedPos = pos.map(function(coord) {
            return Math.round(coord * 10) / 10;
        });
        return layer.threeDLayer ? roundedPos.join(", ") : roundedPos.slice(0, 2).join(", ");
    }
    return "NoPosition";
}

// Get the aspect ratio of a layer
function getAspectRatio(layer) {
    if (layer.nullLayer || layer.adjustmentLayer) {
        return "NoAspectRatio";
    }
    if (layer.source && layer.source.width && layer.source.height) {
        var width = layer.source.width;
        var height = layer.source.height;
        var gcd = function(a, b) {
            return b == 0 ? a : gcd(b, a % b);
        };
        var divisor = gcd(width, height);
        return (width / divisor) + ":" + (height / divisor);
    }
    return "NoAspectRatio";
}

// Get the number of effects applied to a layer
function getEffectsCount(layer) {
    if (layer.property("ADBE Effect Parade")) {
        return layer.property("ADBE Effect Parade").numProperties;
    }
    return 0;
}

// Get the project name
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
    return projectName;
}

// Get the animated properties of a layer
function getAnimatedProperties(layer) {
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
    return animatedProps;
}

// Get the scale of a layer
function getLayerScale(layer) {
    if (layer.transform && layer.transform.scale) {
        var scale = layer.transform.scale.value;
        var roundedScale = scale.map(function(coord) {
            return Math.round(coord * 10) / 10;
        });
        return layer.threeDLayer ? roundedScale.join(", ") : roundedScale.slice(0, 2).join(", ");
    }
    return "NoScale";
}

// Get the rotation of a layer
function getLayerRotation(layer) {
    if (layer.threeDLayer) {
        // For 3D layers, concatenate the X, Y, and Z rotations
        var rotationX = layer.transform.xRotation ? layer.transform.xRotation.value : 0;
        var rotationY = layer.transform.yRotation ? layer.transform.yRotation.value : 0;
        var rotationZ = layer.transform.zRotation ? layer.transform.zRotation.value : 0;
        return [rotationX, rotationY, rotationZ].map(function(value) {
            return Math.round(value * 10) / 10;
        }).join(", ");
    } else {
        // For 2D layers, use the regular rotation property
        if (layer.transform && layer.transform.rotation) {
            var rotation = layer.transform.rotation.value;
            return Math.round(rotation * 10) / 10;
        }
        return "NoRotation";
    }
}

// Get the file extension of a layer's source file
function getFileExtension(layer) {
    if (layer.source && layer.source.file && layer.source.file.name) {
        var fileName = layer.source.file.name;
        var extension = fileName.split('.').pop();
        return extension;
    }
    return "NoExtension";
}

// Get the opacity of a layer
function getLayerOpacity(layer) {
    if (layer.transform && layer.transform.opacity) {
        var opacity = layer.transform.opacity.value;
        return Math.round(opacity * 10) / 10;
    }
    return "NoOpacity";
}

// Get the duration of a layer in frames based on the in and out points
function getDurationInFrames(layer) {
    if (layer && layer.containingComp) {
        var frameRate = layer.containingComp.frameRate;
        var duration = (layer.outPoint - layer.inPoint) * frameRate;
        return Math.round(duration);
    }
    return "NoDuration";
}

// Get the list of properties controlled by expressions
function getExpressionControlledProperties(layer) {
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
    return expressionProps.length > 0 ? expressionProps.join(", ") : "NoExpressions";
}

// Get the track matte type of a layer
function getTrackMatteType(layer) {
    if (layer instanceof CameraLayer || layer instanceof LightLayer) {
        return "NoTrackMate";
    } else if (layer.isTrackMatte) {
        return "TM:Source";
    } else if (layer.trackMatteType !== undefined && layer.trackMatteType !== TrackMatteType.NO_TRACK_MATTE && (
            layer.trackMatteType === TrackMatteType.ALPHA ||
            layer.trackMatteType === TrackMatteType.ALPHA_INVERTED ||
            layer.trackMatteType === TrackMatteType.LUMA ||
            layer.trackMatteType === TrackMatteType.LUMA_INVERTED)) {
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
        return "NoTrackMate";
    }
}

var localIndex = 1; // Global local index

// Function to rename layers based on the template
function renameLayersByTemplate(allLayers, template, briefly, brieflyType) {
    var proj = app.project;

    if (proj) {
        var comp = proj.activeItem;

        if (comp && comp instanceof CompItem) {
            app.beginUndoGroup("Rename Layers by Template");

            // Reset local index before renaming
            localIndex = 1;

            for (var i = 1; i <= comp.numLayers; i++) {
                var layer = comp.layer(i);

                if (allLayers || layer.selected) {
                    var newName = generateNewName(layer, template, briefly, brieflyType);
                    layer.name = newName;

                    // Increment local index after renaming the layer
                    localIndex++;
                }
            }

            app.endUndoGroup();
        } else {
            alert("Please select a composition or layer.", "NitroNamer");
        }
    } else {
        alert("Project not found.");
    }
}

// Main execution
var keyValues = getKeyValues();
if (keyValues && keyValues.template) {
    $.writeln("[DEBUG]: Starting layer renaming process");

    // Convert brieflyType index to string
    keyValues.brieflyType = getBrieflyTypeString(keyValues.brieflyType);

    renameLayersByTemplate(keyValues.allLayers, keyValues.template, keyValues.briefly, keyValues.brieflyType);
    $.writeln("[DEBUG]: Renaming complete");
} else {
    alert("Failed to load key values or template is undefined.");
    $.writeln("[DEBUG]: Failed to load key values or template is undefined.");
}