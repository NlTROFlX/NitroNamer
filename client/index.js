var translations = {},
	defaultTranslations = {},
	currentContentSection = null;

function loadTranslations(e) {
	var t = new CSInterface,
		n = t.getSystemPath(SystemPath.EXTENSION);
	t.evalScript('readTranslationFile("' + e + '", "' + n + '")', (function(t) {
		if (t) try {
			translations = JSON.parse(t), applyTranslations()
		} catch (t) {
			console.error("Ошибка парсинга файла перевода:", t), "EN" !== e && loadTranslations("EN")
		} else console.error("Файл перевода не найден или пустой."), "EN" !== e && loadTranslations("EN")
	}))
}

function applyTranslations() {
	document.querySelectorAll("[data-i18n]").forEach((function(e) {
		var t = e.getAttribute("data-i18n"),
			n = translations[t];
		n || (n = defaultTranslations[t] || e.textContent), e.innerHTML = n
	}))
}
defaultTranslations = {};

function loadDefaultTranslations(e) {
	var t = new CSInterface,
		n = t.getSystemPath(SystemPath.EXTENSION);
	t.evalScript('readTranslationFile("EN", "' + n + '")', (function(t) {
		if (t) try {
			defaultTranslations = JSON.parse(t), e && e()
		} catch (e) {
			console.error("Ошибка парсинга файла английского перевода:", e)
		} else console.error("Файл английского перевода не найден или пустой.")
	}))
}

function initializeIconClickHandlers() {
	var e = new CSInterface;
	document.querySelectorAll(".clickable-icon").forEach((function(t) {
		var n = t.getAttribute("data-url");
		n ? (t.style.cursor = "pointer", t.addEventListener("click", (function() {
			try {
				e.openURLInDefaultBrowser(n)
			} catch (e) {
				console.error("Не удалось открыть URL:", e)
			}
		}))) : console.error("Для иконки отсутствует атрибут 'data-url'.")
	}))
}

function toggleSpoiler(e) {
	if (e.classList.contains("inactive")) {
		document.querySelectorAll(".spoiler").forEach((function(t) {
			t !== e && (t.classList.remove("active"), t.classList.add("inactive"))
		})), e.classList.remove("inactive"), e.classList.add("active");
		var t = document.getElementById("active-indicator");
		t && (t.style.opacity = "1");
		var n = document.getElementById("indicator-line");
		n && (n.style.opacity = "1")
	}
	updateActiveIndicator(e)
}

function selectSubItem(e) {
	document.querySelectorAll(".spoiler-content p").forEach((function(e) {
		e.classList.remove("selected")
	})), e.classList.add("selected")
}

function showContent(contentId) {
    const defaultMessage = document.getElementById("default-message");
    if (defaultMessage) {
        defaultMessage.style.display = "none";
    }

    if (currentContentSection) {
        const previousSection = document.getElementById(currentContentSection);
        if (previousSection) {
            const videos = previousSection.getElementsByTagName("video");
            for (let i = 0; i < videos.length; i++) {
                videos[i].pause();
            }
        }
    }

    document.querySelectorAll("#content-sections .content-section").forEach(section => {
        section.style.display = "none";
    });

    const newSection = document.getElementById(contentId);
    if (newSection) {
        newSection.style.display = "block";
        currentContentSection = contentId;

        if (contentId === "content-export") {
            checkExportRequirements();
        }
    }
}

function updateExportButtonState() {
    const spanPresets = document.getElementById("spanPresets").textContent.trim();
    const spanRenamingOptions = document.getElementById("spanRenamingOptions").textContent.trim();
    const spanVariableSettings = document.getElementById("spanVariableSettings").textContent.trim();
    const spanTooltipLanguage = document.getElementById("spanTooltipLanguage").textContent.trim();

    const exportButton = document.querySelector('.export-button');

    if (
        spanPresets === '[Undefined]' &&
        spanRenamingOptions === '[Undefined]' &&
        spanVariableSettings === '[Undefined]' &&
        spanTooltipLanguage === '[Undefined]'
    ) {
        exportButton.classList.add('disabled-export-button');
        exportButton.dataset.disabled = "true"; 
    } else {
        exportButton.classList.remove('disabled-export-button');
        exportButton.dataset.disabled = "false"; 
    }
}

function initializeExportButton(){
    const exportButton = document.querySelector('.export-button');
    if(exportButton){
        exportButton.addEventListener('click', function(){
            if(exportButton.dataset.disabled === "true"){

                alert("Экспорт недоступен, так как некоторые параметры не определены.");
                return;
            }

            performExport();
        });
    } else {
        console.error("Кнопка экспорта не найдена.");
    }
}

function performExport(){

    console.log("Экспорт выполнен");

}

function createOrUpdateBlock(parent, id, text) {
    let block = document.getElementById(id);
    if (!block) {
      block = document.createElement("div");
      block.id = id;
      parent.appendChild(block);
    }
    block.textContent = text;
  }

  function checkExportRequirements() {
    const csInterface = new CSInterface();
    const extensionPath = csInterface.getSystemPath(SystemPath.EXTENSION);

    csInterface.evalScript(`checkExportPaths("${extensionPath}")`, (result) => {
      if (!result) {
        console.log("Проверка прервана/неудачна или не вернулся результат");
        return;
      }
      let data;
      try {
        data = JSON.parse(result);
      } catch (e) {
        return console.error("Ошибка парсинга JSON:", e);
      }

      document.getElementById("spanPresets").textContent = data.spanPresets;
      document.getElementById("spanRenamingOptions").textContent = data.spanRenamingOptions;
      document.getElementById("spanVariableSettings").textContent = data.spanVariableSettings;
      document.getElementById("spanTooltipLanguage").textContent = data.spanTooltipLanguage;

      const mapping = {
        presets: "spanPresets",
        renamingOptions: "spanRenamingOptions",
        variableSettings: "spanVariableSettings",
        tooltipLanguage: "spanTooltipLanguage"
      };

      Object.keys(mapping).forEach((key) => {
        const spanEl = document.getElementById(mapping[key]);
        const checkbox = document.querySelector(`input[name="exportOptions"][value="${key}"]`);
        if (spanEl && checkbox) {
          const text = spanEl.textContent.trim();
          if (text === "[OK]") {
            checkbox.checked = false; 
            checkbox.disabled = false;
            checkbox.parentElement.classList.remove("disabled-checkbox");
          } else if (text === "[Undefined]") {
            checkbox.checked = false;
            checkbox.disabled = true;
            checkbox.parentElement.classList.add("disabled-checkbox");
          }
        }
      });

      const contentExport = document.getElementById("content-export");
      if (contentExport) {
        createOrUpdateBlock(contentExport, "exportPath1", data.exportPath1);
        createOrUpdateBlock(contentExport, "exportPath2", data.exportPath2);
        createOrUpdateBlock(contentExport, "exportPath3", data.exportPath3);
        createOrUpdateBlock(contentExport, "exportUserPresets", data.exportUserPresets);
        createOrUpdateBlock(contentExport, "exportNameApply", data.exportNameApply);
        createOrUpdateBlock(contentExport, "exportSelectedLanguage", data.exportSelectedLanguage);
        createOrUpdateBlock(contentExport, "exportVariables", data.exportVariables);
      }

      updateExportButtonState();
    });
  }

function updateActiveIndicator(e) {
	var t = document.getElementById("active-indicator"),
		n = document.getElementById("indicator-line"),
		o = e.querySelector(".spoiler-title-container"),
		a = e.querySelectorAll(".spoiler-content p");
	if (o) {
		var l = e.offsetTop + o.offsetTop + o.offsetHeight / 2 - t.offsetHeight / 2,
			c = t.getBoundingClientRect().left - t.parentElement.getBoundingClientRect().left;
		t.style.top = l + "px", n.style.height = l + "px", n.style.left = c + t.offsetWidth / 2 + "px", t.textContent = a.length
	}
}

function initializeLanguageSelector() {
	var e = document.querySelector(".language-selector"),
		t = e.querySelector(".selected-language"),
		n = e.querySelector(".language-dropdown").querySelectorAll(".language-option");
	e.addEventListener("click", (function(t) {
		t.stopPropagation();
		var n = e.classList.toggle("active");
		e.setAttribute("aria-expanded", n)
	})), n.forEach((function(n) {
		n.addEventListener("click", (function(n) {
			n.stopPropagation();
			var o = this.textContent;
			t.textContent = o, e.classList.remove("active"), e.setAttribute("aria-expanded", "false");
			var a = new CSInterface,
				l = a.getSystemPath(SystemPath.EXTENSION);
			a.evalScript('saveSelectedLanguage("' + o + '", "' + l + '")'), loadTranslations(o)
		}))
	})), document.addEventListener("click", (function() {
		e.classList.remove("active"), e.setAttribute("aria-expanded", "false")
	}))
}

function showHomePage() {
	showContent("default-message");
	var e = document.getElementById("active-indicator");
	e && (e.style.opacity = "0");
	var t = document.getElementById("indicator-line");
	t && (t.style.opacity = "0"), document.querySelectorAll(".spoiler-content p").forEach((function(e) {
		e.classList.remove("selected")
	})), document.querySelectorAll(".spoiler.active").forEach((function(e) {
		e.classList.remove("active"), e.classList.add("inactive")
	}))
}
document.querySelector(".top-bar").addEventListener("click", showHomePage);
var activeSpoiler = document.querySelector(".spoiler.active");

function copyToClipboard(e) {
	var t = document.createElement("textarea");
	t.value = e, t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.focus(), t.select();
	try {
		if (document.execCommand("copy")) {
			console.log("Текст скопирован в буфер обмена:", e);
			let t = currentHoveredElement;
			t && (t.copyTimeout && clearTimeout(t.copyTimeout), t.classList.add("show-copied"), t.copyTimeout = setTimeout((function() {
				t.classList.remove("show-copied"), delete t.copyTimeout
			}), 1125))
		} else console.error("Не удалось скопировать текст")
	} catch (e) {
		console.error("Ошибка при попытке скопировать текст:", e)
	}
	document.body.removeChild(t)
}
activeSpoiler && updateActiveIndicator(activeSpoiler), activeSpoiler && updateActiveIndicator(activeSpoiler);
let currentHoveredElement = null;

function loadSettings(){
    var e = new CSInterface,
        t = e.getSystemPath(SystemPath.EXTENSION);
    e.evalScript('loadSettings("' + t + '")', (function(e){
        var t = JSON.parse(e),
            n = "EN";
        if(t && t.language){
            n = t.language.toUpperCase();
        }
        document.querySelector(".selected-language").textContent = n;
        loadDefaultTranslations(function(){
            loadTranslations(n);

            checkExportRequirements();
        });
    }));
}

function initializeExportIconClickHandler() {
    const exportIcon = document.getElementById("icon-export-down");
    if (exportIcon) {
        exportIcon.addEventListener("click", (event) => {
            event.stopPropagation(); 
            showContent("content-export");
        });
    } else {
        console.error("Иконка с id 'icon-export-down' не найдена.");
    }
}

function performExport(){
    var cs = new CSInterface();
    cs.evalScript('exportToJson()', function(result){
        if(result){
            console.log("Export Result:", result);
            alert(result); 
        } else {
            console.log("Export was canceled or failed.");
            alert("Экспорт отменён или не выполнен.");
        }
    });
}

document.querySelector(".export-button").addEventListener("click", function() {
    if (this.classList.contains("disabled-export-button") || this.dataset.disabled === "true") {
        alert("Экспорт недоступен, так как некоторые параметры не определены.");
        return; 
    }

    var checkboxes = document.querySelectorAll("input[name='exportOptions']");

    var settingsObj = {};

    var variablesContent = "";

    checkboxes.forEach(function(cb) {
        if (cb.checked) {
            switch (cb.value) {
                case "presets":
                    var elemPresets = document.getElementById("exportUserPresets");
                    if (elemPresets) {
                        try {
                            var jsonPresets = JSON.parse(elemPresets.textContent);

                            settingsObj.userPresets = jsonPresets.userPresets;
                        } catch (e) {
                            settingsObj.userPresets = elemPresets.textContent;
                        }
                    }
                    break;
                case "renamingOptions":
                    var elemNameApply = document.getElementById("exportNameApply");
                    if (elemNameApply) {
                        try {
                            var jsonNameApply = JSON.parse(elemNameApply.textContent);

                            settingsObj.nameApply = jsonNameApply.nameApply;
                        } catch (e) {
                            settingsObj.nameApply = elemNameApply.textContent;
                        }
                    }
                    break;
                case "tooltipLanguage":
                    var elemSelectedLanguage = document.getElementById("exportSelectedLanguage");
                    if (elemSelectedLanguage) {
                        try {
                            var jsonSelectedLanguage = JSON.parse(elemSelectedLanguage.textContent);

                            settingsObj.selectedLanguage = jsonSelectedLanguage.selectedLanguage;
                        } catch (e) {
                            settingsObj.selectedLanguage = elemSelectedLanguage.textContent;
                        }
                    }
                    break;
                case "variableSettings":
                    var elemVariables = document.getElementById("exportVariables");
                    if (elemVariables) {
                        variablesContent = elemVariables.textContent;
                    }
                    break;
            }
        }
    });

    var settingsData = "";
    if (Object.keys(settingsObj).length > 0) {
        settingsData = JSON.stringify(settingsObj, null, 4);
    }

    function escapeForExtendScript(str) {
        return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\r?\n/g, "\\n");
    }

    var settingsDataEscaped = escapeForExtendScript(settingsData);
    var variablesDataEscaped = escapeForExtendScript(variablesContent);

    var csInterface = new CSInterface();
    var script = 'exportToJson("' + settingsDataEscaped + '", "' + variablesDataEscaped + '")';
    csInterface.evalScript(script, function(result) {
        alert(result);
    });
});

document.querySelector(".export-button").addEventListener("mouseenter", function () {
    checkExportRequirements();
  });  

const exportOptionsState = {
    presets: false,
    renamingOptions: false,
    variableSettings: false,
    tooltipLanguage: false
  };

  document.querySelectorAll("#content-export input[type='checkbox']").forEach(checkbox => {
    checkbox.addEventListener("change", function() {

      const isActive = this.checked;

      this.dataset.active = isActive; 

      exportOptionsState[this.value] = isActive;

      console.log(`Чекбокс "${this.value}" активирован: ${isActive}`);

      updateExportButtonState();
    });
  });  
document.addEventListener("mousemove", (function(e) {
	let t = document.elementFromPoint(e.clientX, e.clientY);
	if (t)
		if (t.classList.contains("variable-name-block") || t.classList.contains("variable-example-block")) currentHoveredElement = t;
		else {
			let e = t.closest(".variable-name-block, .variable-example-block");
			currentHoveredElement = e || null
		}
})), document.addEventListener("keydown", (function(e) {
	if (e.ctrlKey && ("c" === e.key || "C" === e.key) && currentHoveredElement) {
		let t = currentHoveredElement.getAttribute("data-value");
		t && (copyToClipboard(t), e.preventDefault())
	}
})), document.addEventListener("mousemove", (function(e) {
	let t = document.elementFromPoint(e.clientX, e.clientY);
	if (t)
		if (t.classList.contains("variable-name-block") || t.classList.contains("variable-example-block")) currentHoveredElement = t;
		else {
			let e = t.closest(".variable-name-block, .variable-example-block");
			currentHoveredElement = e || null
		}
})), document.addEventListener("keydown", (function(e) {
	if (e.ctrlKey && ("c" === e.key || "C" === e.key) && currentHoveredElement) {
		let t = currentHoveredElement.getAttribute("data-value");
		t && (copyToClipboard(t), e.preventDefault())
	}
})), document.addEventListener("DOMContentLoaded", function(){
    initializeLanguageSelector();
    initializeIconClickHandlers();
    initializeExportIconClickHandler();

    loadDefaultTranslations();
    loadSettings();
    document.querySelector(".top-bar").addEventListener("click", showHomePage);
});