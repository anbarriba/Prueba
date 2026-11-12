// Career route: a path made of dots, different for each company but always the same
// (generated from a fixed seed). Drawn point by point when the company changes.
(function () {
  "use strict";

  var SPACING = 6;      // px between dot centres
  var DRAW_MS = 500;    // whole route appears in this time
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function hash(str) { // xmur3-like string hash -> 32-bit int
    var h = 1779033703 ^ str.length;
    for (var i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
    return h >>> 0;
  }
  function rng(seed) { // mulberry32
    return function () {
      seed = (seed + 0x6D2B79F5) >>> 0;
      var t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // A winding line whose heading is a sum of a few seeded sine waves, in arbitrary units.
  function trace(id) {
    var r = rng(hash(id)), tau = Math.PI * 2;
    var a1 = 0.8 + r() * 0.9, f1 = 1 + r() * 1.5, p1 = r() * tau,
        a2 = 0.3 + r() * 0.6, f2 = 2.5 + r() * 2.5, p2 = r() * tau,
        drift = (r() - 0.5) * 4, h0 = r() * tau, n = 600, x = 0, y = 0, pts = [];
    for (var i = 0; i <= n; i++) {
      var s = i / n, h = h0 + a1 * Math.sin(tau * f1 * s + p1) + a2 * Math.sin(tau * f2 * s + p2) + drift * s;
      pts.push([x, y]);
      x += Math.cos(h) / n; y += Math.sin(h) / n;
    }
    return pts;
  }

  // Scale to fit the box, then pick points SPACING px apart along the line.
  function dots(pts, w, h, pad) {
    var x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    pts.forEach(function (p) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
    var s = Math.min((w - 2 * pad) / ((x1 - x0) || 1), (h - 2 * pad) / ((y1 - y0) || 1));
    var ox = (w - (x1 - x0) * s) / 2 - x0 * s, oy = (h - (y1 - y0) * s) / 2 - y0 * s;
    var out = [], carry = 0, px = pts[0][0] * s + ox, py = pts[0][1] * s + oy;
    out.push([px, py]);
    for (var i = 1; i < pts.length; i++) {
      var qx = pts[i][0] * s + ox, qy = pts[i][1] * s + oy, d = Math.hypot(qx - px, qy - py);
      while (carry + d >= SPACING) {
        var t = (SPACING - carry) / d;
        px += (qx - px) * t; py += (qy - py) * t;
        out.push([px, py]);
        d = Math.hypot(qx - px, qy - py); carry = 0;
      }
      carry += d; px = qx; py = qy;
    }
    return out;
  }

  function create(container) {
    var canvas = document.createElement("canvas");
    canvas.className = "route";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var css = getComputedStyle(document.documentElement);
    var colors = { dot: css.getPropertyValue("--text").trim() || "#fff", start: css.getPropertyValue("--start").trim() || "#3FBF5F", finish: css.getPropertyValue("--finish").trim() || "#D9433A" };
    var id = null, shown = null, w = 0, h = 0, dpr = 1, t0 = 0, raf = 0, dead = false;

    function layout() {
      var rect = container.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width)); h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      shown = id ? dots(trace(id), w, h, 8) : null;
      draw(1);
    }

    function dot(p, r, color) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, Math.PI * 2); ctx.fill(); }

    function draw(progress) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!shown) return;
      var count = Math.max(1, Math.ceil(shown.length * progress)), i;
      for (i = 1; i < count - 1; i++) dot(shown[i], 2, colors.dot);
      dot(shown[0], 3, colors.start);
      if (count === shown.length) dot(shown[count - 1], 3, colors.finish);
      else if (count > 1) dot(shown[count - 1], 2, colors.dot);
    }

    function frame(now) {
      if (dead) return;
      var p = Math.min(1, (now - t0) / DRAW_MS);
      draw(p);
      raf = p < 1 ? requestAnimationFrame(frame) : 0;
    }

    var ro = window.ResizeObserver ? new ResizeObserver(layout) : null;
    if (ro) ro.observe(container); else window.addEventListener("resize", layout);
    layout();

    return {
      show: function (companyId) {
        id = companyId;
        cancelAnimationFrame(raf);
        shown = dots(trace(id), w, h, 8);
        if (reduce.matches) { draw(1); return; }
        t0 = performance.now();
        draw(0);
        raf = requestAnimationFrame(frame);
      },
      destroy: function () {
        dead = true; cancelAnimationFrame(raf);
        if (ro) ro.disconnect(); else window.removeEventListener("resize", layout);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }

  window.Stages = { create: create };
})();
