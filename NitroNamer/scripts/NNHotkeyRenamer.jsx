(function renameLayersByShortcut() {
    var scriptFile = new File($.fileName);
    var scriptFolderPath = scriptFile.path;
    var settingsFilePath = scriptFolderPath + "/ScriptUI Panels/NitroNamer/settings/settings.json";
    var settingsFile = new File(settingsFilePath);

    function logDebug(message) {
        $.writeln("[DEBUG]: " + message);
    }

    function loadSettings() {
        logDebug("Loading settings from JSON file at: " + settingsFilePath);
        if (settingsFile.exists) {
            settingsFile.open("r");
            var settings = JSON.parse(settingsFile.read());
            settingsFile.close();
            logDebug("Settings loaded: " + JSON.stringify(settings.currentSettings));
            return settings.currentSettings || {};
        }
        logDebug("Settings file not found");
        return {};
    }

    function getLayerType(layer) {
        logDebug("Getting layer type for layer: " + layer.name);
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
        logDebug("Getting frame rate for layer: " + layer.name);
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
        logDebug("Getting resolution for layer: " + layer.name);
        if (layer.nullLayer || layer.adjustmentLayer) {
            return "NoResolution";
        }
        if (layer.source && layer.source.width && layer.source.height) {
            return layer.source.width + "*" + layer.source.height;
        }
        return "NoResolution";
    }

    function getDuration(layer) {
        logDebug("Getting duration for layer: " + layer.name);
        if (layer.source && layer.source.duration) {
            var duration = layer.source.duration;
            var hours = Math.floor(duration / 3600);
            var minutes = Math.floor((duration % 3600) / 60);
            var seconds = Math.floor(duration % 60);
            return (hours < 10 ? "0" + hours : hours) + ":" +
                   (minutes < 10 ? "0" + minutes : minutes) + ":" +
                   (seconds < 10 ? "0" + seconds : seconds);
        }
        return "NoLimit";
    }

    function getShortDuration(layer) {
        logDebug("Getting short duration for layer: " + layer.name);
        if (layer.source && layer.source.duration) {
            var seconds = Math.floor(layer.source.duration);
            return seconds + "Sec";
        }
        return "NoLimit";
    }

    function getMediumDuration(layer) {
        logDebug("Getting medium duration for layer: " + layer.name);
        if (layer.source && layer.source.duration) {
            var duration = layer.source.duration;
            var minutes = Math.floor(duration / 60);
            var seconds = Math.floor(duration % 60);
            return minutes + "min." + (seconds < 10 ? "0" + seconds : seconds) + "sec";
        }
        return "NoLimit";
    }

    function getSourceName(layer) {
        logDebug("Getting source name for layer: " + layer.name);
        if (layer.source) {
            return layer.source.name;
        }
        return "NoSource";
    }

    function getWidth(layer) {
        logDebug("Getting width for layer: " + layer.name);
        if (layer.nullLayer || layer.adjustmentLayer) {
            return "NoWidth";
        }
        if (layer.source && layer.source.width) {
            return layer.source.width.toString();
        }
        return "NoWidth";
    }

    function getHeight(layer) {
        logDebug("Getting height for layer: " + layer.name);
        if (layer.nullLayer || layer.adjustmentLayer) {
            return "NoHeight";
        }
        if (layer.source && layer.source.height) {
            return layer.source.height.toString();
        }
        return "NoHeight";
    }

    function getLayerPosition(layer) {
        logDebug("Getting position for layer: " + layer.name);
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
        logDebug("Getting aspect ratio for layer: " + layer.name);
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
        logDebug("Getting effects count for layer: " + layer.name);
        if (layer.property("ADBE Effect Parade")) {
            return layer.property("ADBE Effect Parade").numProperties;
        }
        return 0;
    }

    function getProjectName() {
        logDebug("Getting project name");
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
        logDebug("Getting animated properties for layer: " + layer.name);
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
        logDebug("Getting scale for layer: " + layer.name);
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
        logDebug("Getting rotation for layer: " + layer.name);
        if (layer.threeDLayer) {
            var rotationX = layer.transform.xRotation ? layer.transform.xRotation.value : 0;
            var rotationY = layer.transform.yRotation ? layer.transform.yRotation.value : 0;
            var rotationZ = layer.transform.zRotation ? layer.transform.zRotation.value : 0;
            return [rotationX, rotationY, rotationZ].map(function(value) {
                return Math.round(value * 10) / 10;
            }).join(", ");
        } else {
            if (layer.transform && layer.transform.rotation) {
                var rotation = layer.transform.rotation.value;
                return Math.round(rotation * 10) / 10;
            }
            return "NoRotation";
        }
    }

    function getLayerOpacity(layer) {
        logDebug("Getting opacity for layer: " + layer.name);
        if (layer.transform && layer.transform.opacity) {
            var opacity = layer.transform.opacity.value;
            return Math.round(opacity * 10) / 10;
        }
        return "NoOpacity";
    }

    function getTrackMatteType(layer) {
        logDebug("Getting track matte type for layer: " + layer.name);
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

    function replaceVariables(template, variables) {
        logDebug("Replacing variables in template: " + template);
        return template.replace(/\(([^()]+)\)|E\(([^)]+)\)|E\{([^}]+)\}|An\(([^)]+)\)|An\{([^}]+)\}|E|An|Ip|Op|Dd{0,2}|Tm|Ar|Pn|Lpos|Lsc|Lrot|Lops|[A-Z]|i|I|S|W|H/g, function(match, group, customEffectDelimiterParentheses, customEffectDelimiterBraces, customAnimDelimiterParentheses, customAnimDelimiterBraces) {
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
            } else if (match === 'E') {
                return variables['E'];
            } else if (match === 'An') {
                return variables['An'];
            } else if (match === 'Ip') {
                return variables['Ip'];
            } else if (match === 'Op') {
                return variables['Op'];
            } else if (match === 'Dd') {
                return variables['Dd'];
            } else if (match === 'Ddd') {
                return variables['Ddd'];
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

    function renameLayersByTemplate(allLayers, template, briefly, brieflyType) {
        logDebug("Renaming layers with template: " + template);
        var proj = app.project;
    
        if (proj) {
            var comp = proj.activeItem;
    
            if (comp && comp instanceof CompItem) {
                app.beginUndoGroup("Rename Layers by Template");
    
                var localIndex = 1;
    
                for (var i = 1; i <= comp.numLayers; i++) {
                    var layer = comp.layer(i);
    
                    if (allLayers || layer.selected) {
                        logDebug("Renaming layer: " + layer.name);
                        var effectNames = [];
                        if (layer.property("ADBE Effect Parade") && layer.property("ADBE Effect Parade").numProperties > 0) {
                            for (var j = 1; j <= layer.property("ADBE Effect Parade").numProperties; j++) {
                                var effect = layer.property("ADBE Effect Parade").property(j);
                                effectNames.push(effect.name);
                            }
                        }
    
                        var effectsString = effectNames.length > 0 ? effectNames.join(", ") : "ClearLayer";
                        var compName = app.project.activeItem.name;
                        var projectName = getProjectName();
    
                        var animatedProps = getAnimatedProperties(layer);
                        var animatedPropsString = animatedProps.length > 0 ? animatedProps.join(", ") : "NoAnimations";
    
                        var variables = {
                            "T": getLayerType(layer),
                            "i": i,
                            "I": localIndex,
                            "O": layer.name,
                            "E": effectsString,
                            "An": animatedPropsString,
                            "F": getFrameRate(layer),
                            "R": getResolution(layer),
                            "D": getDuration(layer),
                            "Dd": getShortDuration(layer),
                            "Ddd": getMediumDuration(layer),
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
                            "Lops": getLayerOpacity(layer)
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
    
                        logDebug("New name for layer: " + newName);
                        layer.name = newName;
                        localIndex++;
                    }
                }
    
                app.endUndoGroup();
                logDebug("Renaming complete");
            } else {
                logDebug("No composition or layer selected");
                alert("Please select a composition or layer.", "NitroNamer");
            }
        } else {
            logDebug("No project found");
            alert("Project not found.");
        }
    }

    var settings = loadSettings();
    var allLayers = settings.allLayers;
    var template = settings.template;
    var briefly = settings.briefly;
    var brieflyType = settings.brieflyType;

    logDebug("Starting layer renaming process");
    renameLayersByTemplate(allLayers, template, briefly, brieflyType);
})();