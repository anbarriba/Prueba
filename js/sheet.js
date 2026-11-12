// Case-study screen ("setup sheet"): tabs, project data, section list and the detail of the active section.
(function () {
  "use strict";
  var el = window.Ui.el, svg = window.Ui.svg;
  var STORE = "ab-visited";
  var narrow = window.matchMedia("(max-width: 767px)");

  function loadVisited() { try { return JSON.parse(sessionStorage.getItem(STORE)) || {}; } catch (e) { return {}; } }
  function saveVisited(v) { try { sessionStorage.setItem(STORE, JSON.stringify(v)); } catch (e) { /* storage unavailable: ignore */ } }

  function create(container, company, project, tabs) {
    var sections = project.sections, key = company.id + "/" + project.id;
    var visited = loadVisited(), seen = visited[key] || [];
    var active = narrow.matches ? -1 : 0;
    var rows = [], regions = [];

    var root = el("div", { "class": "sheet" });

    // tabs: one per project, then back
    var nav = el("nav", { "class": "tabs", "aria-label": "projects" });
    tabs.forEach(function (t, i) {
      if (i) nav.appendChild(el("span", { "class": "sep", "aria-hidden": "true" }));
      var a = el("a", { "class": "tab", href: t.href }, t.label);
      if (t.current) a.setAttribute("aria-current", "page");
      nav.appendChild(a);
    });
    root.appendChild(nav);

    var left = el("div", { "class": "sheet-left" });
    var right = el("div", { "class": "sheet-right" });
    root.appendChild(left); root.appendChild(right);

    // project data
    var info = el("div", { "class": "info" });
    info.appendChild(el("p", { "class": "card-name" }, company.name + " / " + project.name));
    var dl = el("dl", { "class": "card-rows" });
    [["role", project.role], ["years", project.years], ["team", project.team], ["platforms", project.platforms]].forEach(function (r) {
      var row = el("div", { "class": "card-row" });
      row.appendChild(el("dt", {}, r[0] + ":")); row.appendChild(el("dd", {}, r[1]));
      dl.appendChild(row);
    });
    info.appendChild(dl);
    right.appendChild(info);

    // section list
    var ul = el("ul", { "class": "vlist", "aria-label": "sections" });
    sections.forEach(function (s, i) {
      var li = el("li");
      var b = el("button", { "class": "vrow", type: "button" });
      b.appendChild(window.Ui.arrowIcon());
      b.appendChild(el("span", { "class": "vlabel" }, s.label));
      b.appendChild(el("span", { "class": "vcheck" }));
      b.addEventListener("click", function () { select(narrow.matches && active === i ? -1 : i); });
      li.appendChild(b);
      var region = el("div", { "class": "detail-slot" });
      li.appendChild(region);
      ul.appendChild(li);
      rows.push(b); regions.push(region);
    });
    right.appendChild(ul);
    container.appendChild(root);

    // ----- detail of one section -----
    function guide(index, point) {
      var x0 = (sections.length > 1 ? 8 + index * (84 / (sections.length - 1)) : 50) + "%";
      var s = svg("svg", { "class": "guide", "aria-hidden": "true" });
      var line = function (x1, y1, x2, y2) { return svg("line", { x1: x1, y1: y1, x2: x2, y2: y2, stroke: "var(--line)", "stroke-width": "1" }); };
      s.appendChild(line(x0, "100%", x0, point.y + "%"));          // up from the bottom edge...
      s.appendChild(line(x0, point.y + "%", point.x + "%", point.y + "%")); // ...then across to the point
      s.appendChild(svg("circle", { cx: point.x + "%", cy: point.y + "%", r: "2.5", fill: "var(--text)" }));
      return s;
    }

    function detail(index) {
      var s = sections[index], d = el("div", { "class": "detail", id: "detail-" + s.id });

      var shot = el("div", { "class": "shot" });
      if (project.image.src) shot.appendChild(el("img", { src: project.image.src, alt: project.image.alt }));
      else shot.appendChild(el("div", { "class": "shot-ph", role: "img", "aria-label": project.image.alt }, "main screen: image pending"));
      shot.appendChild(guide(index, s.point));
      d.appendChild(shot);

      var pair = el("div", { "class": "pair" });
      var panel = el("div", { "class": "panel" });
      if (s.detail.src) panel.appendChild(el("img", { src: s.detail.src, alt: s.detail.alt }));
      else panel.appendChild(el("span", { "class": "panel-ph", role: "img", "aria-label": s.detail.alt }, "detail: image pending"));
      var box = el("div", { "class": "box" });
      box.appendChild(el("span", { "class": "box-label" }, s.big.label));
      box.appendChild(el("span", { "class": "box-value", "aria-hidden": "true" }, s.big.value));
      box.appendChild(el("span", { "class": "sr-only" }, s.big.label + ": " + s.big.value));
      pair.appendChild(panel); pair.appendChild(box);
      d.appendChild(pair);

      var scale = el("div", { "class": "scale" });
      var bar = el("div", { "class": "scale-bar", role: "img", "aria-label": "fidelity scale, from low-fi to hi-fi: " + Math.round(s.fidelity * 100) + "%" });
      var mark = el("span", { "class": "scale-mark" });
      mark.style.left = "calc((100% - 24px) * " + s.fidelity + ")";
      bar.appendChild(mark);
      var ends = el("div", { "class": "scale-ends", "aria-hidden": "true" });
      ends.appendChild(el("span", {}, "low-fi")); ends.appendChild(el("span", {}, "hi-fi"));
      scale.appendChild(bar); scale.appendChild(ends);
      d.appendChild(scale);

      d.appendChild(el("p", { "class": "para" }, s.text));
      return d;
    }

    function markVisited(i) {
      var id = sections[i].id;
      if (seen.indexOf(id) < 0) { seen.push(id); visited[key] = seen; saveVisited(visited); }
    }

    // ----- state -> DOM -----
    function paint() {
      var isNarrow = narrow.matches;
      left.textContent = "";
      regions.forEach(function (r) { r.textContent = ""; });
      rows.forEach(function (b, i) {
        var on = i === active;
        if (on) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current");
        if (isNarrow) { b.setAttribute("aria-expanded", String(on)); b.setAttribute("aria-controls", "detail-" + sections[i].id); }
        else { b.removeAttribute("aria-expanded"); b.removeAttribute("aria-controls"); }
        var slot = b.querySelector(".vcheck");
        slot.textContent = "";
        slot.appendChild(window.Ui.checkbox(seen.indexOf(sections[i].id) >= 0));
      });
      if (active >= 0) (isNarrow ? regions[active] : left).appendChild(detail(active));
    }

    function select(i) {
      active = i;
      if (i >= 0) markVisited(i);
      paint();
    }

    narrow.addEventListener && narrow.addEventListener("change", function () {
      if (!narrow.matches && active < 0) active = 0;
      if (active >= 0) markVisited(active);
      paint();
    });

    if (active >= 0) markVisited(active);
    paint();

    return {
      // ↑ ↓ move through sections, ← → switch project tab. Returns true when the key was used.
      onKey: function (e) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          var d = e.key === "ArrowDown" ? 1 : -1, n = sections.length;
          var next = active < 0 ? (d > 0 ? 0 : n - 1) : (active + d + n) % n;
          select(next);
          rows[next].focus({ preventScroll: false });
          return true;
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          var projectTabs = tabs.filter(function (t) { return !t.back; });
          var cur = projectTabs.findIndex(function (t) { return t.current; });
          var to = projectTabs[cur + (e.key === "ArrowRight" ? 1 : -1)];
          if (to) location.hash = to.href;
          return true;
        }
        return false;
      },
      destroy: function () { if (root.parentNode) root.parentNode.removeChild(root); }
    };
  }

  window.Sheet = { create: create };
})();
