document.addEventListener("DOMContentLoaded", (function() {
	document.querySelectorAll(".videoblock").forEach((function(e) {
		var t, n = e.querySelector("#video"),
			i = e.querySelector("#playIcon"),
			s = e.querySelector("#pauseIcon"),
			o = e.querySelector("#progressBarFill"),
			a = e.querySelector("#progressBarBackground"),
			r = e.querySelector("#seekKnob"),
			l = e.querySelector("#videoContainer"),
			c = e.querySelector("#progressBarContainer"),
			d = e.querySelector("#currentTime"),
			u = e.querySelector("#timeTooltip"),
			v = e.querySelector("#hoverCircle"),
			m = e.querySelector(".scale-up-icon"),
			y = document.getElementById("shadow-overlay"),
			f = !1,
			p = 0,
			L = !1;

		function h() {
			n.paused ? (i.classList.add("visible"), s.classList.remove("visible"), e.classList.add("paused")) : (i.classList.remove("visible"), s.classList.remove("visible"), e.classList.remove("paused"))
		}

		function g(e) {
			e.classList.add("visible"), setTimeout((function() {
				n.paused && e === i ? e.classList.add("visible") : e.classList.remove("visible")
			}), 125)
		}

		function E(e) {
			return [Math.floor(e / 3600), Math.floor(e % 3600 / 60), Math.floor(e % 60)].map((function(e) {
				return e.toString().padStart(2, "0")
			})).join(":")
		}

		function w() {
			if (!f) {
				var e = n.duration > 0 ? n.currentTime / n.duration * 100 : 0;
				o.style.width = e + "%";
				var i = e / 100 * a.getBoundingClientRect().width;
				if (n.currentTime < p ? (r.classList.add("no-transition"), o.classList.add("no-transition"), r.style.left = i + "px", setTimeout((function() {
						r.classList.remove("no-transition"), o.classList.remove("no-transition")
					}), 50)) : r.style.left = i + "px", d.textContent = E(n.currentTime), p = n.currentTime, L) {
					var s = parseFloat(v.style.left) || 0,
						l = Math.abs(s - i);
					v.style.opacity = l <= 12 ? "0" : "1"
				}
			}
			t = requestAnimationFrame(w)
		}
		l.addEventListener("click", (function() {
			n.paused ? (n.play(), g(s)) : (n.pause(), g(i)), h()
		})), n.addEventListener("play", h), n.addEventListener("pause", h), n.addEventListener("ended", (function() {
			r.classList.add("no-transition"), o.classList.add("no-transition"), o.style.width = "0%", r.style.left = "0px", d.textContent = E(0), setTimeout((function() {
				r.classList.remove("no-transition"), o.classList.remove("no-transition")
			}), 50), h()
		})), r.addEventListener("mousedown", (function(e) {
			f = !0, a.classList.add("no-transition"), o.classList.add("no-transition"), r.classList.add("no-transition"), cancelAnimationFrame(t), e.preventDefault()
		})), document.addEventListener("mousemove", (function(e) {
			f && function(e) {
				var t = a.getBoundingClientRect(),
					i = Math.max(0, Math.min(e - t.left, t.width)),
					s = i / t.width * n.duration;
				n.currentTime = s;
				var l = n.currentTime / n.duration * 100;
				o.style.width = l + "%", r.style.left = i + "px", d.textContent = E(n.currentTime)
			}(e.clientX)
		})), document.addEventListener("mouseup", (function(e) {
			f && (f = !1, a.classList.remove("no-transition"), o.classList.remove("no-transition"), r.classList.remove("no-transition"), t = requestAnimationFrame(w))
		})), c.addEventListener("click", (function(e) {
			var t = a.getBoundingClientRect(),
				i = Math.max(0, Math.min(e.clientX - t.left, t.width)),
				s = i / t.width * n.duration;
			n.currentTime = s;
			var l = n.currentTime / n.duration * 100;
			o.style.width = l + "%", r.style.left = i + "px", d.textContent = E(n.currentTime)
		})), l.addEventListener("mouseenter", (function() {
			n.paused || s.classList.add("visible")
		})), l.addEventListener("mouseleave", (function() {
			n.paused || s.classList.remove("visible")
		})), window.addEventListener("resize", (function() {
			if (!f) {
				var e = n.currentTime / n.duration * 100 / 100 * a.getBoundingClientRect().width;
				r.style.left = e + "px"
			}
		})), a.addEventListener("mousemove", (function(e) {
			if (!(n.duration <= 0)) {
				var t = a.getBoundingClientRect(),
					i = Math.max(0, Math.min(e.clientX - t.left, t.width)),
					s = i / t.width * n.duration;
				u.textContent = E(s);
				var o = u.offsetWidth,
					r = i,
					l = -u.offsetHeight - 10;
				r < o / 2 ? r = o / 2 : r > t.width - o / 2 && (r = t.width - o / 2), u.style.left = r + "px", u.style.top = l + "px", u.style.opacity = "1", v.style.left = i + "px", v.style.top = "-8px"
			}
		})), a.addEventListener("mouseenter", (function() {
			L = !0, u.style.opacity = "1", v.style.opacity = "1"
		})), a.addEventListener("mouseleave", (function() {
			L = !1, u.style.opacity = "0", v.style.opacity = "0"
		})), m.addEventListener("click", (function(t) {
			t.stopPropagation(), e.classList.contains("enlarged") ? (e.classList.remove("enlarged"), y.style.display = "none", m.src = "icons/scale-up.svg") : (e.classList.add("enlarged"), y.style.display = "block", m.src = "icons/scale-down.svg")
		})), (y = document.getElementById("shadow-overlay")).addEventListener("click", (function() {
			document.querySelectorAll(".videoblock.enlarged").forEach((function(e) {
				e.classList.remove("enlarged");
				var t = e.querySelector(".scale-up-icon");
				t && (t.src = "icons/scale-up.svg")
			})), y.style.display = "none"
		})), h(), d.textContent = E(0), t = requestAnimationFrame(w)
	}))
}));