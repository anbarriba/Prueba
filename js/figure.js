// Silhouette of a person (bust) in an arbitrary 100 x 120 box, drawn from scratch.
// About fills it with dots; the home snake uses its outline when "about" is selected.
(function () {
  "use strict";

  var BOX = { w: 100, h: 120 };
  var OUTLINE = "M8,118 L8,92 C8,78 22,70 38,64 L41,57 A22,22 0 1 1 59,57 L62,64 C78,70 92,78 92,92 L92,118 Z";
  var SPACING = 6;   // px between dot centres (same as the career routes)
  var DRAW_MS = 500; // the whole figure appears in this time, point by point
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Grid points that fall inside the silhouette, fitted to a w x h area; ordered top to bottom.
  function dots(w, h, pad) {
    var s = Math.min((w - 2 * pad) / BOX.w, (h - 2 * pad) / BOX.h), ox = (w - BOX.w * s) / 2, oy = (h - BOX.h * s) / 2;
    var c = document.createElement("canvas").getContext("2d"), path = new Path2D(OUTLINE), pts = [];
    c.setTransform(s, 0, 0, s, ox, oy);
    for (var y = oy; y <= oy + BOX.h * s; y += SPACING) {
      for (var x = ox; x <= ox + BOX.w * s; x += SPACING) if (c.isPointInPath(path, x, y)) pts.push([x, y]);
    }
    return pts;
  }

  // A canvas inside `container` that draws the dotted silhouette and fills it in point by point.
  function create(container) {
    var canvas = document.createElement("canvas");
    canvas.className = "figure";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);
    var ctx = canvas.getContext("2d"), pts = [], w = 0, h = 0, dpr = 1, t0 = 0, raf = 0, dead = false;
    var color = getComputedStyle(document.documentElement).getPropertyValue("--text").trim() || "#fff";

    function draw(progress) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      var count = Math.ceil(pts.length * progress);
      for (var i = 0; i < count; i++) { ctx.beginPath(); ctx.arc(pts[i][0], pts[i][1], 2, 0, Math.PI * 2); ctx.fill(); }
    }
    function frame(now) {
      if (dead) return;
      var p = Math.min(1, (now - t0) / DRAW_MS);
      draw(p);
      raf = p < 1 ? requestAnimationFrame(frame) : 0;
    }
    function layout() {
      var rect = container.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width)); h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      pts = dots(w, h, 4);
      draw(1);
    }

    var ro = window.ResizeObserver ? new ResizeObserver(layout) : null;
    if (ro) ro.observe(container); else window.addEventListener("resize", layout);
    layout();
    if (!reduce.matches) { draw(0); t0 = performance.now(); raf = requestAnimationFrame(frame); }

    return {
      destroy: function () {
        dead = true; cancelAnimationFrame(raf);
        if (ro) ro.disconnect(); else window.removeEventListener("resize", layout);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }

  window.Figure = { BOX: BOX, OUTLINE: OUTLINE, create: create };
})();
