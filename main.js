function runScript() {
    var csInterface = new CSInterface();
    csInterface.evalScript('$.evalFile("' + csInterface.getSystemPath(SystemPath.EXTENSION) + '/host.js");');
  }
  