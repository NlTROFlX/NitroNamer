var translations = {};
var defaultTranslations = {};
var currentContentSection = null;

function loadTranslations(e) {
	var t = new CSInterface(),
		a = t.getSystemPath(SystemPath.EXTENSION);
	t.evalScript('readTranslationFile("' + e + '", "' + a + '")', function(t) {
		if (t)
			try {
				(translations = JSON.parse(t)), applyTranslations();
			}
		catch (a) {
			console.error("Ошибка парсинга файла перевода:", a), "EN" !== e && loadTranslations("EN");
		} else console.error("Файл перевода не найден или пустой."), "EN" !== e && loadTranslations("EN");
	});
}

function applyTranslations() {
	document.querySelectorAll("[data-i18n]").forEach(function(e) {
		var t = e.getAttribute("data-i18n"),
			a = translations[t];
		a || (a = defaultTranslations[t] || e.textContent), (e.innerHTML = a);
	});
}
var defaultTranslations = {};

function loadDefaultTranslations(e) {
	var t = new CSInterface(),
		a = t.getSystemPath(SystemPath.EXTENSION);
	t.evalScript('readTranslationFile("EN", "' + a + '")', function(t) {
		if (t)
			try {
				(defaultTranslations = JSON.parse(t)), e && e();
			}
		catch (a) {
			console.error("Ошибка парсинга файла английского перевода:", a);
		} else console.error("Файл английского перевода не найден или пустой.");
	});
}

function initializeIconClickHandlers() {
	var e = new CSInterface();
	document.querySelectorAll(".clickable-icon").forEach(function(t) {
		var a = t.getAttribute("data-url");
		a ? ((t.style.cursor = "pointer"), t.addEventListener("click", function() {
			try {
				e.openURLInDefaultBrowser(a);
			} catch (t) {
				console.error("Не удалось открыть URL:", t);
			}
		})) : console.error("Для иконки отсутствует атрибут 'data-url'.");
	});
}

function toggleSpoiler(e) {
	if (e.classList.contains("inactive")) {
		document.querySelectorAll(".spoiler").forEach(function(t) {
			if (t !== e) {
				t.classList.remove("active");
				t.classList.add("inactive");
			}
		});
		e.classList.remove("inactive");
		e.classList.add("active");
		var indicator = document.getElementById("active-indicator");
		if (indicator) {
			indicator.style.opacity = "1";
		}
		var indicatorLine = document.getElementById("indicator-line");
		if (indicatorLine) {
			indicatorLine.style.opacity = "1";
		}
	}
	updateActiveIndicator(e);
}

function selectSubItem(e) {
	document.querySelectorAll(".spoiler-content p").forEach(function(e) {
		e.classList.remove("selected");
	}), e.classList.add("selected");
}

function showContent(e) {
	var defaultMessage = document.getElementById("default-message");
	if (defaultMessage) {
		defaultMessage.style.display = "none";
	}
	if (currentContentSection) {
		var currentSectionElement = document.getElementById(currentContentSection);
		if (currentSectionElement) {
			var videos = currentSectionElement.getElementsByTagName("video");
			for (var i = 0; i < videos.length; i++) {
				videos[i].pause();
			}
		}
	}
	var contentSections = document.querySelectorAll("#content-sections .content-section");
	contentSections.forEach(function(section) {
		section.style.display = "none";
	});
	var newSection = document.getElementById(e);
	if (newSection) {
		newSection.style.display = "block";
		currentContentSection = e;
	} else {
		console.error("Контент с ID " + e + " не найден.");
	}
}

function updateActiveIndicator(e) {
	var t = document.getElementById("active-indicator"),
		a = document.getElementById("indicator-line"),
		n = e.querySelector(".spoiler-title-container"),
		o = e.querySelectorAll(".spoiler-content p");
	if (n) {
		var l = e.offsetTop + n.offsetTop + n.offsetHeight / 2 - t.offsetHeight / 2,
			i = t.getBoundingClientRect().left - t.parentElement.getBoundingClientRect().left;
		(t.style.top = l + "px"), (a.style.height = l + "px"), (a.style.left = i + t.offsetWidth / 2 + "px"), (t.textContent = o.length);
	}
}

function initializeLanguageSelector() {
	var e = document.querySelector(".language-selector"),
		t = e.querySelector(".selected-language"),
		a = e.querySelector(".language-dropdown").querySelectorAll(".language-option");
	e.addEventListener("click", function(t) {
		t.stopPropagation();
		var a = e.classList.toggle("active");
		e.setAttribute("aria-expanded", a);
	}), a.forEach(function(a) {
		a.addEventListener("click", function(a) {
			a.stopPropagation();
			var n = this.textContent;
			(t.textContent = n), e.classList.remove("active"), e.setAttribute("aria-expanded", "false");
			var o = new CSInterface(),
				l = o.getSystemPath(SystemPath.EXTENSION);
			o.evalScript('saveSelectedLanguage("' + n + '", "' + l + '")'), loadTranslations(n);
		});
	}), document.addEventListener("click", function() {
		e.classList.remove("active"), e.setAttribute("aria-expanded", "false");
	});
}
document.querySelector('.top-bar').addEventListener('click', showHomePage);

function showHomePage() {
	showContent('default-message');
	var indicator = document.getElementById("active-indicator");
	if (indicator) {
		indicator.style.opacity = "0";
	}
	var indicatorLine = document.getElementById("indicator-line");
	if (indicatorLine) {
		indicatorLine.style.opacity = "0";
	}
	document.querySelectorAll(".spoiler-content p").forEach(function(p) {
		p.classList.remove("selected");
	});
	document.querySelectorAll(".spoiler.active").forEach(function(spoiler) {
		spoiler.classList.remove("active");
		spoiler.classList.add("inactive");
	});
}
var activeSpoiler = document.querySelector('.spoiler.active');
if (activeSpoiler) {
	updateActiveIndicator(activeSpoiler);
}

function copyToClipboard(e) {
	var t = document.createElement("textarea");
	(t.value = e), (t.style.position = "fixed"), (t.style.opacity = "0"), document.body.appendChild(t), t.focus(), t.select();
	try {
		if (document.execCommand("copy")) {
			console.log("Текст скопирован в буфер обмена:", e);
			let a = currentHoveredElement;
			a && (a.copyTimeout && clearTimeout(a.copyTimeout), a.classList.add("show-copied"), (a.copyTimeout = setTimeout(function() {
				a.classList.remove("show-copied"), delete a.copyTimeout;
			}, 1125)));
		} else console.error("Не удалось скопировать текст");
	} catch (n) {
		console.error("Ошибка при попытке скопировать текст:", n);
	}
	document.body.removeChild(t);
}
activeSpoiler && updateActiveIndicator(activeSpoiler);
let currentHoveredElement = null;
document.addEventListener('mousemove', function(event) {
	let element = document.elementFromPoint(event.clientX, event.clientY);
	if (element) {
		if (element.classList.contains('variable-name-block') || element.classList.contains('variable-example-block')) {
			currentHoveredElement = element;
		} else {
			let parent = element.closest('.variable-name-block, .variable-example-block');
			if (parent) {
				currentHoveredElement = parent;
			} else {
				currentHoveredElement = null;
			}
		}
	}
});
document.addEventListener('keydown', function(event) {
	if (event.ctrlKey && (event.key === 'c' || event.key === 'C')) {
		if (currentHoveredElement) {
			let valueToCopy = currentHoveredElement.getAttribute('data-value');
			if (valueToCopy) {
				copyToClipboard(valueToCopy);
				event.preventDefault();
			}
		}
	}
});

function loadSettings() {
	var e = new CSInterface(),
		t = e.getSystemPath(SystemPath.EXTENSION);
	e.evalScript('loadSettings("' + t + '")', function(e) {
		var t = JSON.parse(e),
			a = "EN";
		t && t.language && (a = t.language.toUpperCase()), (document.querySelector(".selected-language").textContent = a), loadDefaultTranslations(function() {
			loadTranslations(a);
		});
	});
}
document.addEventListener("mousemove", function(e) {
	let t = document.elementFromPoint(e.clientX, e.clientY);
	if (t) {
		if (t.classList.contains("variable-name-block") || t.classList.contains("variable-example-block"))
			currentHoveredElement = t;
		else {
			let a = t.closest(".variable-name-block, .variable-example-block");
			currentHoveredElement = a || null;
		}
	}
}), document.addEventListener("keydown", function(e) {
	if (e.ctrlKey && ("c" === e.key || "C" === e.key) && currentHoveredElement) {
		let t = currentHoveredElement.getAttribute("data-value");
		t && (copyToClipboard(t), e.preventDefault());
	}
}), document.addEventListener("DOMContentLoaded", function() {
	initializeLanguageSelector();
	initializeIconClickHandlers();
	loadDefaultTranslations();
	loadSettings();
	document.querySelector('.top-bar').addEventListener('click', showHomePage);
});