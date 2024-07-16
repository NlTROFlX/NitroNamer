function buildNewUI(thisObj) {
    // Create a window or panel for the UI
    var win = (thisObj instanceof Panel) ? thisObj : new Window("palette", "Variable Input Panel", undefined, {resizeable: true});
    win.orientation = "column";
    win.alignChildren = ["fill", "top"];
    win.preferredSize.height = 150;
    win.margins = [4,4,4,4];

    // Create a group for the drop-down list and input field
    var grpDropdownAndInput = win.add("group", undefined);
    grpDropdownAndInput.orientation = "row"; // Set orientation to horizontal
    grpDropdownAndInput.alignChildren = ["fill", "center"];

    // Add drop-down list with variable names
    var variableNames = ["An", "Ar", "D", "Ec", "E", "F", "Fext", "H", "Lexp", "R", "S", "Tm", "W"];
    var ddVariableNames = grpDropdownAndInput.add("dropdownlist", undefined, variableNames);
    ddVariableNames.selection = 0; // Select the first item by default
    ddVariableNames.size = [50, 25]; // Set the size of the drop-down list

    // Add input field
    var inputField = grpDropdownAndInput.add("edittext", undefined, "");
    inputField.characters = 10; // Set width of the input field
    inputField.size = [100, 25]; // Set the size of the input field

    // Display the window or panel
    if (win instanceof Window) {
        win.center();
        win.show();
    }

    return win;
}

var myNewScriptPal = buildNewUI(this);
if (myNewScriptPal instanceof Panel) {
    myNewScriptPal.layout.layout(true);
} else {
    myNewScriptPal.center();
    myNewScriptPal.show();
}
