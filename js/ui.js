// Small DOM helpers shared by the screens.
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";

  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) n.setAttribute(k, attrs[k]);
    if (text) n.textContent = text;
    return n;
  }
  function svg(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs || {}) n.setAttribute(k, attrs[k]);
    return n;
  }

  // Square with a right-pointing triangle, drawn inline (list option marker).
  function arrowIcon() {
    var s = svg("svg", { "class": "icon", viewBox: "0 0 12 12", "aria-hidden": "true" });
    s.appendChild(svg("rect", { x: "0.5", y: "0.5", width: "11", height: "11", fill: "none", stroke: "currentColor", "stroke-width": "1" }));
    s.appendChild(svg("path", { d: "M4.5 3 L8.5 6 L4.5 9 Z", fill: "currentColor" }));
    return s;
  }

  // Square box; with a check mark once `checked`.
  function checkbox(checked) {
    var s = svg("svg", { "class": "check", viewBox: "0 0 12 12", "aria-hidden": "true" });
    s.appendChild(svg("rect", { x: "0.5", y: "0.5", width: "11", height: "11", fill: "none", stroke: "currentColor", "stroke-width": "1" }));
    if (checked) s.appendChild(svg("path", { d: "M2.8 6.3 L5 8.5 L9.2 3.5", fill: "none", stroke: "currentColor", "stroke-width": "1.5" }));
    return s;
  }

  // Vertical list of links: arrow icon on the left, ↑ ↓ moves the highlight, Enter follows the link.
  function createList(container, links, label) {
    var ul = el("ul", { "class": "vlist", "aria-label": label }), rows = [], active = 0;
    function paint() {
      rows.forEach(function (a, i) { if (i === active) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
    }
    links.forEach(function (l, i) {
      var li = el("li"), a = el("a", { "class": "vrow", href: l.href });
      if (l.newTab) { a.target = "_blank"; a.rel = "noopener"; }
      a.appendChild(arrowIcon());
      a.appendChild(el("span", { "class": "vlabel" }, l.label));
      a.addEventListener("focus", function () { active = i; paint(); });
      a.addEventListener("mouseenter", function () { active = i; paint(); });
      li.appendChild(a); ul.appendChild(li); rows.push(a);
    });
    container.appendChild(ul);
    paint();
    return {
      onKey: function (e) {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          active = (active + (e.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length;
          paint(); rows[active].focus();
          return true;
        }
        if (e.key === "Enter" && document.activeElement !== rows[active]) { rows[active].click(); return true; }
        return false;
      },
      destroy: function () { if (ul.parentNode) ul.parentNode.removeChild(ul); }
    };
  }

  window.Ui = { el: el, svg: svg, arrowIcon: arrowIcon, checkbox: checkbox, createList: createList };
})();
