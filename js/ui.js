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

  window.Ui = { el: el, svg: svg, arrowIcon: arrowIcon, checkbox: checkbox };
})();
