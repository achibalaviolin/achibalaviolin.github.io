/* Achi Bala Violin — interactions */

(function () {
  "use strict";

  /* Nav shadow on scroll */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Mobile nav toggle */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Banner carousel */
  var slidesEl = document.getElementById("slides");
  if (slidesEl) {
    var slides = slidesEl.children;
    var dotsEl = document.getElementById("dots");
    var current = 0;
    var timer = null;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var dots = [];
    if (dotsEl) {
      for (var i = 0; i < slides.length; i++) {
        var dot = document.createElement("button");
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        (function (idx) {
          dot.addEventListener("click", function () { go(idx); restart(); });
        })(i);
        dotsEl.appendChild(dot);
        dots.push(dot);
      }
    }

    var go = function (idx) {
      current = (idx + slides.length) % slides.length;
      slidesEl.style.transform = "translateX(-" + current * 100 + "%)";
      for (var s = 0; s < slides.length; s++) {
        slides[s].classList.toggle("is-active", s === current);
      }
      dots.forEach(function (d, j) { d.classList.toggle("on", j === current); });
    };

    var restart = function () {
      if (timer) clearInterval(timer);
      if (!reduceMotion) timer = setInterval(function () { go(current + 1); }, 6500);
    };

    var prev = document.getElementById("prevSlide");
    var next = document.getElementById("nextSlide");
    if (prev) prev.addEventListener("click", function () { go(current - 1); restart(); });
    if (next) next.addEventListener("click", function () { go(current + 1); restart(); });

    var banner = slidesEl.closest(".hero") || slidesEl.parentElement;
    if (banner) {
      banner.addEventListener("mouseenter", function () { if (timer) clearInterval(timer); });
      banner.addEventListener("mouseleave", restart);
      banner.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft") { go(current - 1); restart(); }
        if (e.key === "ArrowRight") { go(current + 1); restart(); }
      });
    }

    /* swipe */
    var startX = null;
    if (banner) {
      banner.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
      banner.addEventListener("touchend", function (e) {
        if (startX === null) return;
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 50) { go(current + (dx < 0 ? 1 : -1)); restart(); }
        startX = null;
      }, { passive: true });
    }

    go(0);
    restart();
  }

  /* Reveal-on-scroll */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* Footer year */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
