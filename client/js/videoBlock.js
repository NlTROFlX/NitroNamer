document.addEventListener("DOMContentLoaded", function() {
	var videoblocks = document.querySelectorAll(".videoblock");
	videoblocks.forEach(function(videoblock) {
		var video = videoblock.querySelector("#video");
		var playIcon = videoblock.querySelector("#playIcon");
		var pauseIcon = videoblock.querySelector("#pauseIcon");
		var progressBarFill = videoblock.querySelector("#progressBarFill");
		var progressBarBackground = videoblock.querySelector("#progressBarBackground");
		var seekKnob = videoblock.querySelector("#seekKnob");
		var videoContainer = videoblock.querySelector("#videoContainer");
		var progressBarContainer = videoblock.querySelector("#progressBarContainer");
		var currentTimeElement = videoblock.querySelector("#currentTime");
		var timeTooltip = videoblock.querySelector("#timeTooltip");
		var hoverCircle = videoblock.querySelector("#hoverCircle");
		var scaleIcon = videoblock.querySelector(".scale-up-icon");
        var shadowOverlay = document.getElementById("shadow-overlay");
		var isDragging = false;
		var lastTime = 0;
		var isHovering = false;
		var animationFrameId;

		function updateIconsOnStateChange() {
			if (video.paused) {
				playIcon.classList.add("visible");
				pauseIcon.classList.remove("visible");
				videoblock.classList.add("paused");
			} else {
				playIcon.classList.remove("visible");
				pauseIcon.classList.remove("visible");
				videoblock.classList.remove("paused");
			}
		}

		function showHoverIcon() {
			if (!video.paused) {
				pauseIcon.classList.add("visible");
			}
		}

		function hideHoverIcons() {
			if (!video.paused) {
				pauseIcon.classList.remove("visible");
			}
		}

		function flashIcon(icon) {
			icon.classList.add("visible");
			setTimeout(function() {
				if (video.paused && icon === playIcon) {
					icon.classList.add("visible");
				} else {
					icon.classList.remove("visible");
				}
			}, 125);
		}

		function formatTime(seconds) {
			var hrs = Math.floor(seconds / 3600);
			var mins = Math.floor((seconds % 3600) / 60);
			var secs = Math.floor(seconds % 60);
			return [hrs, mins, secs].map(function(v) {
				return v.toString().padStart(2, "0");
			}).join(":");
		}

		function updateProgress() {
			if (!isDragging) {
				var percent = video.duration > 0 ? (video.currentTime / video.duration) * 100 : 0;
				progressBarFill.style.width = percent + "%";
				var knobPosition = (percent / 100) * progressBarBackground.getBoundingClientRect().width;
				if (video.currentTime < lastTime) {
					seekKnob.classList.add("no-transition");
					progressBarFill.classList.add("no-transition");
					seekKnob.style.left = knobPosition + "px";
					setTimeout(function() {
						seekKnob.classList.remove("no-transition");
						progressBarFill.classList.remove("no-transition");
					}, 50);
				} else {
					seekKnob.style.left = knobPosition + "px";
				}
				currentTimeElement.textContent = formatTime(video.currentTime);
				lastTime = video.currentTime;
				if (isHovering) {
					var hoverPosition = parseFloat(hoverCircle.style.left) || 0;
					var delta = Math.abs(hoverPosition - knobPosition);
					hoverCircle.style.opacity = delta <= 12 ? "0" : "1";
				}
			}
			animationFrameId = requestAnimationFrame(updateProgress);
		}

		function updateSeekKnob(clientX) {
			var rect = progressBarBackground.getBoundingClientRect();
			var x = Math.max(0, Math.min(clientX - rect.left, rect.width));
			var newTime = (x / rect.width) * video.duration;
			video.currentTime = newTime;
			var percent = (video.currentTime / video.duration) * 100;
			progressBarFill.style.width = percent + "%";
			seekKnob.style.left = x + "px";
			currentTimeElement.textContent = formatTime(video.currentTime);
		}

		function updateTooltip(e) {
			if (video.duration <= 0)
				return;
			var rect = progressBarBackground.getBoundingClientRect();
			var x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
			var hoverTime = (x / rect.width) * video.duration;
			timeTooltip.textContent = formatTime(hoverTime);
			var tooltipOffset = 10;
			var circleOffset = 8;
			var tooltipWidth = timeTooltip.offsetWidth;
			var tooltipX = x;
			var tooltipY = -timeTooltip.offsetHeight - tooltipOffset;
			if (tooltipX < tooltipWidth / 2) {
				tooltipX = tooltipWidth / 2;
			} else if (tooltipX > rect.width - tooltipWidth / 2) {
				tooltipX = rect.width - tooltipWidth / 2;
			}
			timeTooltip.style.left = tooltipX + "px";
			timeTooltip.style.top = tooltipY + "px";
			timeTooltip.style.opacity = "1";
			hoverCircle.style.left = x + "px";
			hoverCircle.style.top = -circleOffset + "px";
		}
		videoContainer.addEventListener("click", function() {
			if (video.paused) {
				video.play();
				flashIcon(pauseIcon);
			} else {
				video.pause();
				flashIcon(playIcon);
			}
			updateIconsOnStateChange();
		});
		video.addEventListener("play", updateIconsOnStateChange);
		video.addEventListener("pause", updateIconsOnStateChange);
		video.addEventListener("ended", function() {
			seekKnob.classList.add("no-transition");
			progressBarFill.classList.add("no-transition");
			progressBarFill.style.width = "0%";
			seekKnob.style.left = "0px";
			currentTimeElement.textContent = formatTime(0);
			setTimeout(function() {
				seekKnob.classList.remove("no-transition");
				progressBarFill.classList.remove("no-transition");
			}, 50);
			updateIconsOnStateChange();
		});
		seekKnob.addEventListener("mousedown", function(e) {
			isDragging = true;
			progressBarBackground.classList.add("no-transition");
			progressBarFill.classList.add("no-transition");
			seekKnob.classList.add("no-transition");
			cancelAnimationFrame(animationFrameId);
			e.preventDefault();
		});
		document.addEventListener("mousemove", function(e) {
			if (isDragging) {
				updateSeekKnob(e.clientX);
			}
		});
		document.addEventListener("mouseup", function(e) {
			if (isDragging) {
				isDragging = false;
				progressBarBackground.classList.remove("no-transition");
				progressBarFill.classList.remove("no-transition");
				seekKnob.classList.remove("no-transition");
				animationFrameId = requestAnimationFrame(updateProgress);
			}
		});
		progressBarContainer.addEventListener("click", function(e) {
			var rect = progressBarBackground.getBoundingClientRect();
			var x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
			var newTime = (x / rect.width) * video.duration;
			video.currentTime = newTime;
			var percent = (video.currentTime / video.duration) * 100;
			progressBarFill.style.width = percent + "%";
			seekKnob.style.left = x + "px";
			currentTimeElement.textContent = formatTime(video.currentTime);
		});
		videoContainer.addEventListener("mouseenter", showHoverIcon);
		videoContainer.addEventListener("mouseleave", hideHoverIcons);
		window.addEventListener("resize", function() {
			if (!isDragging) {
				var percent = (video.currentTime / video.duration) * 100;
				var knobPosition = (percent / 100) * progressBarBackground.getBoundingClientRect().width;
				seekKnob.style.left = knobPosition + "px";
			}
		});
		progressBarBackground.addEventListener("mousemove", updateTooltip);
		progressBarBackground.addEventListener("mouseenter", function() {
			isHovering = true;
			timeTooltip.style.opacity = "1";
			hoverCircle.style.opacity = "1";
		});
		progressBarBackground.addEventListener("mouseleave", function() {
			isHovering = false;
			timeTooltip.style.opacity = "0";
			hoverCircle.style.opacity = "0";
		});
		function handleScaleIconClick() {
            if (!videoblock.classList.contains("enlarged")) {
                // Увеличиваем плеер
                videoblock.classList.add("enlarged");
                shadowOverlay.style.display = "block";
                scaleIcon.src = "icons/scale-down.svg"; // Заменяем иконку
            } else {
                // Уменьшаем плеер
                videoblock.classList.remove("enlarged");
                shadowOverlay.style.display = "none";
                scaleIcon.src = "icons/scale-up.svg"; // Возвращаем иконку
            }
        }

        // Обработчик клика по иконке увеличения
        scaleIcon.addEventListener("click", function(event) {
            event.stopPropagation(); // Предотвращаем всплытие события
            handleScaleIconClick();
        });
		// Обработчик клика по затеняющему фону для уменьшения плеера
		var shadowOverlay = document.getElementById("shadow-overlay");
		shadowOverlay.addEventListener("click", function() {
			document.querySelectorAll(".videoblock.enlarged").forEach(function(videoblock) {
				videoblock.classList.remove("enlarged");
				var scaleIcon = videoblock.querySelector(".scale-up-icon");
				if (scaleIcon) {
					scaleIcon.src = "icons/scale-up.svg";
				}
			});
			shadowOverlay.style.display = "none";
		});
		updateIconsOnStateChange();
		currentTimeElement.textContent = formatTime(0);
		animationFrameId = requestAnimationFrame(updateProgress);
	});
});