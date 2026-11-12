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

  // ---------- routing ----------
  function findCompany(id) {
    return C.career.companies.filter(function (c) { return c.id === id; })[0];
  }

  // "#career/pccomponentes/checkout" -> { name, crumbs, up, links } or null
  function resolve(hash) {
    var parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    var name = parts[0] || "home";
    if (name === "home" && parts.length <= 1) {
      return { name: "home", crumbs: [{ label: "main menu" }], up: null,
        links: C.home.options.map(function (o) { return { label: o, href: "#" + o }; }) };
    }
    if (name === "contact" && parts.length === 1) {
      return { name: "contact", crumbs: [{ label: "main menu", href: "#home" }, { label: "contact" }], up: "#home",
        links: C.contact.options.map(function (o) { return { label: o.label, href: o.href, newTab: o.newTab }; }) };
    }
    if (name === "career") {
      if (parts.length === 1) {
        return { name: "career", crumbs: [{ label: "career", href: "#home" }, { label: "stage select" }], up: "#home",
          links: C.career.companies.map(function (c) { return { label: c.name, href: "#career/" + c.id }; }) };
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

  // Placeholder body; replaced by carousel / lists / case study in later steps.
  function renderScreen(route) {
    screenEl.textContent = "";
    screenEl.setAttribute("data-screen", route.name);
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
    if (e.key === "Escape" && current && current.up) location.hash = current.up;
  });

  window.addEventListener("hashchange", onRoute);
  if (coarse.addEventListener) coarse.addEventListener("change", renderHelp);
  renderHelp();
  onRoute();
  requestAnimationFrame(tick);
})();
