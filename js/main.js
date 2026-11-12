// Step 1: fixed frame (crumbs, timer, help line), hash router, content access.
(function () {
  "use strict";
  var C = window.CONTENT;
  var crumbsEl = document.getElementById("crumbs");
  var screenEl = document.getElementById("screen");
  var helpEl = document.getElementById("help");
  var timerEl = document.getElementById("timer");
  var coarse = window.matchMedia("(max-width: 767px), (pointer: coarse)");

  document.getElementById("build").textContent = C.build;

  // ---------- infinite carousel ----------
  // Words are rendered in an odd number of identical copies; `pos` is an absolute
  // index into that sequence. The track is only ever moved by CSS transform and,
  // before each move, re-centred on the middle copy without any visible jump.
  function createCarousel(labels, opts) {
    var n = labels.length;
    var root = el("div", { "class": "carousel", role: "group", "aria-label": opts.label || "menu" });
    var track = el("div", { "class": "c-track" });
    root.appendChild(track);
    var words = [], copies = 3, cycle = 0, pos = opts.initial || 0, startX = null, startY = null, swiped = false;

    function build(count) {
      track.textContent = "";
      words = [];
      copies = count;
      for (var c = 0; c < count; c++) {
        for (var i = 0; i < n; i++) {
          var item = el("span", { "class": "c-item" });
          var b = el("button", { "class": "c-word", type: "button" }, labels[i]);
          b.setAttribute("data-pos", String(words.length));
          item.appendChild(b);
          item.appendChild(el("span", { "class": "c-sep", "aria-hidden": "true" }));
          track.appendChild(item);
          words.push(b);
        }
      }
    }

    function anchor() { return root.clientWidth / 3; }
    function targetX(p) { return anchor() - words[p].parentNode.offsetLeft; }
    function currentX() {
      var m = getComputedStyle(track).transform;
      return m && m !== "none" ? new DOMMatrix(m).m41 : 0;
    }
    function setX(x, animate) {
      track.style.transition = animate ? "" : "none";
      track.style.transform = "translateX(" + x + "px)";
      if (!animate) track.getBoundingClientRect(); // flush so the jump is not animated
    }

    // Move `pos` back into the middle copy, compensating the transform so nothing shifts.
    function recentre() {
      var mid = Math.floor(copies / 2), shift = mid - Math.floor(pos / n);
      if (!shift) return;
      pos += shift * n;
      setX(currentX() - shift * cycle, false);
    }

    function markActive() {
      words.forEach(function (w, i) {
        var live = i === pos;
        if (live) w.setAttribute("aria-current", "true"); else w.removeAttribute("aria-current");
        w.tabIndex = live ? 0 : -1;
        w.setAttribute("aria-hidden", live ? "false" : String(i % n !== pos % n));
      });
    }

    function layout() {
      build(3);
      cycle = words[n].parentNode.offsetLeft - words[0].parentNode.offsetLeft;
      var side = Math.ceil(root.clientWidth / Math.max(cycle, 1)) + 1;
      var count = side * 2 + 1;
      if (count !== 3) { build(count); cycle = words[n].parentNode.offsetLeft - words[0].parentNode.offsetLeft; }
      pos = Math.floor(copies / 2) * n + (pos % n + n) % n;
      markActive();
      setX(targetX(pos), false);
    }

    // Move by `d` options (negative = left), re-centring first so the target copy exists.
    function step(d) {
      var prevOpt = pos % n;
      recentre();
      var hadFocus = track.contains(document.activeElement);
      pos += d;
      markActive();
      setX(targetX(pos), true);
      if (hadFocus) words[pos].focus({ preventScroll: true });
      if (pos % n !== prevOpt && opts.onChange) opts.onChange(pos % n);
    }

    var api = {
      el: root,
      move: step,
      confirm: function () { if (opts.onConfirm) opts.onConfirm(pos % n); },
      index: function () { return pos % n; },
      layout: layout
    };

    root.addEventListener("click", function (e) {
      if (swiped) { swiped = false; return; }
      var b = e.target.closest && e.target.closest(".c-word");
      if (!b) return;
      var p = Number(b.getAttribute("data-pos"));
      if (p === pos) api.confirm(); else step(p - pos);
    });

    // swipe: one option per gesture; the click that follows a swipe is ignored
    root.addEventListener("pointerdown", function (e) {
      if (e.pointerType === "mouse") return;
      startX = e.clientX; startY = e.clientY; swiped = false;
    });
    root.addEventListener("pointerup", function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      startX = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { swiped = true; api.move(dx < 0 ? 1 : -1); }
    });
    root.addEventListener("pointercancel", function () { startX = null; });

    return api;
  }

  // ---------- routing ----------
  function findCompany(id) {
    return C.career.companies.filter(function (c) { return c.id === id; })[0];
  }

  // "#career/pccomponentes/checkout" -> { name, crumbs, up, links } or null
  function resolve(hash) {
    var parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    var name = parts[0] || "home";
    if (name === "home" && parts.length <= 1) {
      return { name: "home", crumbs: [{ label: "main menu" }], up: null, links: [],
        carousel: { label: "main menu", labels: C.home.options, go: function (i) { return "#" + C.home.options[i]; } } };
    }
    if (name === "contact" && parts.length === 1) {
      return { name: "contact", crumbs: [{ label: "main menu", href: "#home" }, { label: "contact" }], up: "#home",
        links: C.contact.options.map(function (o) { return { label: o.label, href: o.href, newTab: o.newTab }; }) };
    }
    if (name === "career") {
      if (parts.length === 1) {
        return { name: "career", crumbs: [{ label: "career", href: "#home" }, { label: "stage select" }], up: "#home", links: [],
          carousel: { label: "stage select", labels: C.career.companies.map(function (c) { return c.name; }),
            go: function (i) { return "#career/" + C.career.companies[i].id; } } };
      }
      var company = findCompany(parts[1]);
      if (company && parts.length <= 3) {
        var base = "#career/" + company.id;
        var project = company.projects.filter(function (p) { return p.id === parts[2]; })[0];
        if (parts[2] && !project) return null;
        var crumbs = [{ label: "career", href: "#career" }, { label: company.name, href: project ? base : undefined }];
        if (project) crumbs.push({ label: project.name });
        return { name: "stage", company: company, project: project, crumbs: crumbs, up: project ? base : "#career",
          links: company.projects.map(function (p) { return { label: p.name, href: base + "/" + p.id }; }) };
      }
    }
    return null;
  }

  // ---------- rendering ----------
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) n.setAttribute(k, attrs[k]);
    if (text) n.textContent = text;
    return n;
  }

  function renderCrumbs(list) {
    crumbsEl.textContent = "";
    list.forEach(function (c, i) {
      var last = i === list.length - 1;
      if (i) crumbsEl.appendChild(el("span", { "class": "sep", "aria-hidden": "true" }));
      var n = c.href && !last ? el("a", { "class": "crumb", href: c.href }, c.label) : el("span", { "class": "crumb" }, c.label);
      if (last) n.setAttribute("aria-current", "page");
      crumbsEl.appendChild(n);
    });
  }

  var carousel = null, snake = null, lastIndex = {};

  // Carousel screens get a central stage (graphics come in later steps) and the carousel below it.
  // Other screens still use the temporary link list until their own steps.
  function renderScreen(route) {
    carousel = null;
    if (snake) { snake.destroy(); snake = null; }
    screenEl.textContent = "";
    screenEl.setAttribute("data-screen", route.name);
    screenEl.classList.toggle("has-carousel", !!route.carousel);
    if (route.carousel) {
      var cfg = route.carousel;
      var stage = el("div", { "class": "stage", "aria-hidden": "true" });
      screenEl.appendChild(stage);
      var initial = lastIndex[route.name] || 0;
      if (route.name === "home") snake = window.Snake.create(stage, { shape: initial });
      carousel = createCarousel(cfg.labels, {
        label: cfg.label,
        initial: initial,
        onChange: function (i) { lastIndex[route.name] = i; if (snake) snake.setShape(i); },
        onConfirm: function (i) { lastIndex[route.name] = i; location.hash = cfg.go(i); }
      });
      screenEl.appendChild(carousel.el);
      carousel.layout();
      return;
    }
    if (!route.links.length) return;
    var ul = el("ul", { "class": "stub-list" });
    route.links.forEach(function (l) {
      var a = el("a", { href: l.href }, l.label);
      if (l.newTab) { a.target = "_blank"; a.rel = "noopener"; }
      var li = el("li");
      li.appendChild(a);
      ul.appendChild(li);
    });
    screenEl.appendChild(ul);
  }

  function renderHelp() {
    helpEl.textContent = coarse.matches ? C.help.touch : C.help.keys;
  }

  var current = null;
  function onRoute() {
    var route = resolve(location.hash);
    if (!route) { location.replace("#home"); return; }
    current = route;
    renderCrumbs(route.crumbs);
    renderScreen(route);
    resetTimer();
    document.title = route.crumbs[route.crumbs.length - 1].label + " – angel barreiro";
  }

  // ---------- timer (restarts on every screen, always running) ----------
  var t0 = performance.now();
  function resetTimer() { t0 = performance.now(); }
  function pad(n, w) { return String(n).padStart(w, "0"); }
  function tick(now) {
    var cs = Math.max(0, Math.floor((now - t0) / 10));
    timerEl.textContent = pad(Math.floor(cs / 6000) % 100, 2) + ":" + pad(Math.floor(cs / 100) % 60, 2) + "." + pad(cs % 100, 2);
    requestAnimationFrame(tick);
  }

  // ---------- global keys: Esc goes up one level ----------
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === "Escape" && current && current.up) { location.hash = current.up; return; }
    if (!carousel) return;
    if (e.key === "ArrowRight") { e.preventDefault(); carousel.move(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); carousel.move(-1); }
    else if (e.key === "Enter") { e.preventDefault(); carousel.confirm(); }
  });

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { if (carousel) carousel.layout(); }, 100);
  });
  // web fonts change word widths, so lay out again once they are ready
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { if (carousel) carousel.layout(); });

  window.addEventListener("hashchange", onRoute);
  if (coarse.addEventListener) coarse.addEventListener("change", renderHelp);
  renderHelp();
  onRoute();
  requestAnimationFrame(tick);
})();
