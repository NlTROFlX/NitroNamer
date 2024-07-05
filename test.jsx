{
    // Create UI Panel
    var win = new Window("palette", "Custom UI", undefined);
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];

    // Create Text Fields
    var textField1 = win.add("edittext", undefined, "Text Field 1");
    var textField2 = win.add("edittext", undefined, "Text Field 2");
    var textField3 = win.add("edittext", undefined, "Text Field 3");

    // Create Buttons
    var button1 = win.add("button", undefined, "Button 1");
    var button2 = win.add("button", undefined, "Button 2");
    var button3 = win.add("button", undefined, "Button 3");

    // Create Compact Mode Button
    var compactButton = win.add("button", undefined, "Compact mode");

    // Function to Toggle Compact Mode
    compactButton.onClick = function() {
        var isCompact = textField1.visible;
        textField1.visible = !isCompact;
        textField2.visible = !isCompact;
        textField3.visible = !isCompact;
        button1.visible = !isCompact;
        button2.visible = !isCompact;
        button3.visible = !isCompact;
    };

    // Show the UI Panel
    win.center();
    win.show();
}
