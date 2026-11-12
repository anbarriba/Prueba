// Letter snake for the home screen: letters travel along a closed shape (canvas, decorative),
// morph between shapes when the carousel option changes, and spell a phrase as an easter egg.
(function () {
  "use strict";

  var WORD = "angelbarreiro";
  var PHRASE = "if in doubt, flat out ";
  var SAMPLES = 900;       // points per shape
  var MORPH_SECONDS = 0.6; // shape and text transitions
  var LAP_SECONDS = 40;    // time for a letter to go round the shape
  var IDLE_MS = 10000;
  var CLICKS = 4, CLICK_WINDOW_MS = 2000;

  // Closed outlines in an arbitrary box; the first is a winding road (drawn in perspective), the second an envelope.
  var SHAPES = [
    { d: "M8,48 C4,38 20,34 30,38 C42,43 50,52 62,47 C74,42 70,30 58,27 C46,24 38,18 46,11 C54,4 80,6 90,14 C98,22 96,36 90,44 C86,52 70,57 50,57 C28,57 12,56 8,48 Z",
      road: true, depth: 1 },
    { d: "M10,10 L50,35 L90,10 L90,50 L10,50 Z", road: false, depth: 0.35 }
  ];

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function smooth(x) { return x * x * (3 - 2 * x); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  // Sample a path into points, tangents and a 0..1 depth (1 = near the viewer).
  function sampleShape(def) {
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("style", "position:absolute;width:0;height:0;visibility:hidden");
    var path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", def.d);
    svg.appendChild(path);
    document.body.appendChild(svg);
    var len = path.getTotalLength(), x = [], y = [], i, p;
    for (i = 0; i < SAMPLES; i++) { p = path.getPointAtLength(len * i / SAMPLES); x.push(p.x); y.push(p.y); }
    document.body.removeChild(svg);
    var minY = Math.min.apply(null, y), maxY = Math.max.apply(null, y), cx = (Math.min.apply(null, x) + Math.max.apply(null, x)) / 2;
    var depth = y.map(function (v) { return (v - minY) / (maxY - minY || 1); });
    if (def.road) x = x.map(function (v, k) { return cx + (v - cx) * lerp(0.5, 1, depth[k]); }); // narrower towards the horizon
    depth = depth.map(function (d) { return 1 - (1 - d) * def.depth; });
    return { x: x, y: y, depth: depth };
  }

  // Fit raw points into the canvas and precompute everything needed to place a letter at fraction v of the lap.
  function bake(raw, w, h, fracW, minPx, maxPx) {
    var n = SAMPLES, x0 = Math.min.apply(null, raw.x), x1 = Math.max.apply(null, raw.x),
        y0 = Math.min.apply(null, raw.y), y1 = Math.max.apply(null, raw.y);
    var s = Math.min(w * fracW / (x1 - x0 || 1), h * 0.9 / (y1 - y0 || 1));
    var ox = (w - (x1 - x0) * s) / 2 - x0 * s, oy = (h - (y1 - y0) * s) / 2 - y0 * s;
    var px = [], py = [], size = [], alpha = [], u = [0], k, a, b, seg;
    for (k = 0; k < n; k++) {
      px.push(raw.x[k] * s + ox); py.push(raw.y[k] * s + oy);
      size.push(lerp(minPx, maxPx, raw.depth[k])); alpha.push(lerp(0.6, 1, raw.depth[k]));
    }
    // Letters are evenly spaced in "size units", so distant (small) stretches hold more letters per pixel.
    for (k = 0; k < n; k++) {
      a = k; b = (k + 1) % n;
      seg = Math.hypot(px[b] - px[a], py[b] - py[a]);
      u.push(u[k] + seg / ((size[a] + size[b]) / 2));
    }
    return { px: px, py: py, size: size, alpha: alpha, u: u, total: u[n], n: n };
  }

  function at(t, v, out) {
    var n = t.n, target = (((v % 1) + 1) % 1) * t.total, lo = 0, hi = n;
    while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (t.u[mid] <= target) lo = mid; else hi = mid; }
    var a = lo, b = (lo + 1) % n, f = (target - t.u[a]) / ((t.u[a + 1] - t.u[a]) || 1);
    out.x = lerp(t.px[a], t.px[b], f); out.y = lerp(t.py[a], t.py[b], f);
    out.size = lerp(t.size[a], t.size[b], f); out.alpha = lerp(t.alpha[a], t.alpha[b], f);
    // tangent from a few samples either side, so corners are rounded rather than snapped
    var p = (a + n - 3) % n, q = (a + 4) % n;
    out.dx = t.px[q] - t.px[p]; out.dy = t.py[q] - t.py[p];
  }

  function create(stage, opts) {
    var canvas = document.createElement("canvas");
    canvas.className = "snake";
    canvas.setAttribute("aria-hidden", "true");
    stage.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var raws = SHAPES.map(sampleShape);
    var tables = [], letters = 0, w = 0, h = 0, dpr = 1;
    var shapeTarget = opts.shape || 0, shapeW = shapeTarget;   // 0 = first shape, 1 = second
    var eggTarget = 0, eggW = 0, tLap = 0;
    var lastActivity = performance.now(), ignoreUntil = 0, clicks = [];
    var raf = 0, last = 0, dirty = true, dead = false;
    var A = {}, B = {};

    function layout() {
      var rect = stage.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width)); h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      var mobile = window.matchMedia("(max-width: 767px)").matches;
      var frac = mobile ? 0.9 : 0.8, minPx = mobile ? 9 : 10, maxPx = mobile ? 12 : 14;
      tables = raws.map(function (r) { return bake(r, w, h, frac, minPx, maxPx); });
      var total = tables.reduce(function (s, t) { return s + t.total; }, 0) / tables.length;
      letters = Math.max(1, Math.round(total / 0.85 / WORD.length)) * WORD.length; // whole words, so the loop has no seam
      dirty = true;
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!tables.length) return;
      var m = smooth(shapeW), e = smooth(eggW);
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#fff";
      for (var i = 0; i < letters; i++) {
        var v = tLap + i / letters;
        at(tables[0], v, A); at(tables[1], v, B);
        var x = lerp(A.x, B.x, m), y = lerp(A.y, B.y, m), size = lerp(A.size, B.size, m), alpha = lerp(A.alpha, B.alpha, m);
        var ang = Math.atan2(lerp(A.dy, B.dy, m), lerp(A.dx, B.dx, m));
        ctx.save();
        ctx.translate(x, y); ctx.rotate(ang);
        ctx.font = "400 " + size.toFixed(1) + "px Inter, 'Helvetica Neue', Arial, sans-serif";
        if (e < 1) { ctx.globalAlpha = alpha * (1 - e); ctx.fillText(WORD.charAt(i % WORD.length), 0, 0); }
        if (e > 0) { ctx.globalAlpha = alpha * e; ctx.fillText(PHRASE.charAt(i % PHRASE.length), 0, 0); }
        ctx.restore();
      }
      // head: a brighter dot in the seam just ahead of the last letter
      var hv = tLap - 0.5 / letters;
      at(tables[0], hv, A); at(tables[1], hv, B);
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(lerp(A.x, B.x, m), lerp(A.y, B.y, m), 3, 0, Math.PI * 2);
      ctx.fill();
    }

    function setEgg(on) {
      if (eggTarget === (on ? 1 : 0)) return;
      eggTarget = on ? 1 : 0;
      if (on) ignoreUntil = performance.now() + 400; // the gesture that triggered it must not undo it
      if (reduce.matches) eggW = eggTarget;
      dirty = true;
    }

    function activity() {
      var now = performance.now();
      if (now < ignoreUntil) return;
      lastActivity = now;
      setEgg(false);
    }

    function frame(now) {
      if (dead) return;
      var dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      var moving = false, step = dt / MORPH_SECONDS;
      if (!reduce.matches) {
        tLap = (tLap + dt / LAP_SECONDS) % 1; moving = true;
        if (shapeW !== shapeTarget) shapeW = shapeW < shapeTarget ? Math.min(shapeTarget, shapeW + step) : Math.max(shapeTarget, shapeW - step);
        if (eggW !== eggTarget) eggW = eggW < eggTarget ? Math.min(eggTarget, eggW + step) : Math.max(eggTarget, eggW - step);
      } else { shapeW = shapeTarget; eggW = eggTarget; }
      if (!eggTarget && now - lastActivity > IDLE_MS) setEgg(true);
      if (moving || dirty) { draw(); dirty = false; }
      raf = requestAnimationFrame(frame);
    }

    function onClick() {
      var now = performance.now();
      clicks = clicks.filter(function (c) { return now - c < CLICK_WINDOW_MS; });
      clicks.push(now);
      if (clicks.length >= CLICKS) { clicks = []; setEgg(true); }
    }

    var ro = window.ResizeObserver ? new ResizeObserver(layout) : null;
    if (ro) ro.observe(stage); else window.addEventListener("resize", layout);
    canvas.addEventListener("click", onClick);
    ["pointermove", "pointerdown", "keydown", "touchstart", "wheel"].forEach(function (t) {
      window.addEventListener(t, activity, { passive: true });
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { dirty = true; });

    layout();
    if (reduce.matches) { shapeW = shapeTarget; }
    raf = requestAnimationFrame(frame);

    return {
      setShape: function (i) { shapeTarget = i ? 1 : 0; if (reduce.matches) shapeW = shapeTarget; dirty = true; },
      destroy: function () {
        dead = true; cancelAnimationFrame(raf);
        if (ro) ro.disconnect(); else window.removeEventListener("resize", layout);
        ["pointermove", "pointerdown", "keydown", "touchstart", "wheel"].forEach(function (t) { window.removeEventListener(t, activity); });
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }

  window.Snake = { create: create };
})();
