{
    var win = new Window("palette", "Set Audio Layer Duration", undefined);
    win.orientation = "column";

    var setDurationBtn = win.add("button", undefined, "Set Duration");

    function setAudioLayerDuration() {
        var comp = app.project.activeItem;
        if (comp == null || !(comp instanceof CompItem)) {
            alert("Please select a composition.");
            return;
        }

        if (comp.selectedLayers.length == 0) {
            alert("Please select an audio layer.");
            return;
        }

        var selectedLayer = comp.selectedLayers[0];

        if (selectedLayer.hasAudio === false) {
            alert("Please select a valid audio layer.");
            return;
        }

        var audioFile = selectedLayer.source;
        if (audioFile == null || !(audioFile instanceof FootageItem)) {
            alert("The selected layer does not have a valid audio source.");
            return;
        }

        var duration = audioFile.duration;

        if (isNaN(duration) || duration <= 0) {
            alert("The audio duration is invalid.");
            return;
        }

        app.beginUndoGroup("Set Audio Layer Duration");
        selectedLayer.name = duration.toFixed(2) + "s";
        app.endUndoGroup();
    }

    setDurationBtn.onClick = setAudioLayerDuration;

    win.center();
    win.show();
}
