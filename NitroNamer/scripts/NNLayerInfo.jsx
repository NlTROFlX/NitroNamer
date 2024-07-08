function showLayerInfo() {
    var win = new Window("palette", "Nitro Namer - Layer Info", undefined, {resizeable: true});
    win.preferredSize = [284, 254];

    var txtField = win.add("edittext", undefined, "", {multiline: true, readonly: true});
    txtField.size = [284, 254];

    var proj = app.project;
    var comp = proj ? proj.activeItem : null;

    if (comp && comp instanceof CompItem && comp.numLayers > 0) {
        var layer = comp.selectedLayers.length > 0 ? comp.selectedLayers[0] : comp.layer(1);

        var effectNames = getEffectNames(layer);
        var effectsString = effectNames.length > 0 ? effectNames.join(", ") : "ClearLayer";
        var compName = comp.name;
        var projectName = getProjectName();
        var expressionProps = getExpressionControlledProperties(layer);
        var fileExtension = getFileExtension(layer);
        var durationInFrames = getDurationInFrames(layer);

        var animatedProps = getAnimatedProperties(layer);
        var animatedPropsString = animatedProps.length > 0 ? animatedProps.join(", ") : "NoAnimations";

        var variables = {
            "T": getLayerType(layer),
            "i": layer.index,
            "I": 1, // Assuming localIndex is 1 for a single layer
            "O": layer.name,
            "E": effectsString,
            "An": animatedPropsString,
            "F": getFrameRate(layer),
            "R": getResolution(layer),
            "D": getDuration(layer)(),
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

        var infoText = "";
        for (var key in variables) {
            if (variables.hasOwnProperty(key)) {
                infoText += key + ": " + variables[key] + "\n";
            }
        }

        txtField.text = infoText;
    } else {
        txtField.text = "No composition or layers found.";
    }

    win.center();
    win.show();

    return win; // Ensure the window stays open
}

var layerInfoWin = showLayerInfo();

// Utility functions
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

function getFileExtension(layer) {
    if (layer.source && layer.source.file && layer.source.file.name) {
        var fileName = layer.source.file.name;
        var extension = fileName.split('.').pop();
        return extension;
    }
    return "NoExtension";
}

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

function getResolution(layer) {
    if (layer.nullLayer || layer.adjustmentLayer) {
        return "NoResolution";
    }
    if (layer.source && layer.source.width && layer.source.height) {
        return layer.source.width + "*" + layer.source.height;
    }
    return "NoResolution";
}

function getSourceName(layer) {
    if (layer.source) {
        return layer.source.name;
    }
    return "NoSource";
}

function getWidth(layer) {
    if (layer.nullLayer || layer.adjustmentLayer) {
        return "NoWidth";
    }
    if (layer.source && layer.source.width) {
        return layer.source.width.toString();
    }
    return "NoWidth";
}

function getHeight(layer) {
    if (layer.nullLayer || layer.adjustmentLayer) {
        return "NoHeight";
    }
    if (layer.source && layer.source.height) {
        return layer.source.height.toString();
    }
    return "NoHeight";
}

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
    return projectName;
}

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

function getLayerOpacity(layer) {
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

function getTrackMatteType(layer) {
    if (layer instanceof CameraLayer || layer instanceof LightLayer) {
        return "NoTrackMate";
    } else if (layer.isTrackMatte) {
        return "TM:Source";
    } else if (layer.trackMatteType !== undefined && layer.trackMatteType !== TrackMatteType.NO_TRACK_MATTE && (
            layer.trackMatteType === TrackMatteType.ALPHA ||
            layer.trackMatteType === TrackMatteType.ALPHA_INVERTED ||
            layer.trackMatteType === TrackMatteType.LUMA ||
            layer.trackMatteType.LUMA_INVERTED)) {
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
