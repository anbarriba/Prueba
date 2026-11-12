// Letter snake for the home screen. On "career" the letters sit along an open rally stage and a dot
// runs the stage from the bottom (near) to the top (far), lighting the letters it passes (a career progress bar).
// The letters circulate along the stage in reading direction (like around the envelope), while the dot runs up it. On "contact" they form an envelope. Touching the dot (career only) shows a phrase instead of the name for a few seconds.
(function () {
  "use strict";

  var WORD = "angelbarreiro ";                          // trailing space = gap between repeats
  var PHRASE = "if in doubt, flat out (colin mcrae) ";
  var SAMPLES = 900;         // points per shape
  var MORPH_SECONDS = 0.6;   // shape and text transitions
  var STAGE_SECONDS = 14;    // the dot runs the whole stage (bottom to top) in this time...
  var HOLD_SECONDS = 1.5;    // ...waits at the finish...
  var RESET_SECONDS = 0.6;   // ...and the lit letters fade out before it starts again
  var UNLIT = 0.4;           // brightness of letters the dot has not reached
  var FADE = 0.05;           // fraction of the stage over which letters fade in/out at its ends
  var FLOW = 5;              // letters per second the text (name or phrase) moves, on the stage and around the envelope
  var EGG_MS = 3500;         // the easter egg shows the phrase this long, whatever the pointer does (less if the dot reaches the finish)
  var TOUCH_PX = 18;         // pointer distance to the dot that counts as touching it

  // Outlines in an arbitrary box. The stage is open; the second path is the same stage turned for tall screens.
  var STAGE_WIDE = { d: "M445,42 C439,42 422,41 410,41 C398,41 376,42 375,43 C374,44 396,42 405,44 C414,46 423,50 426,54 C429,58 430,63 425,66 C420,69 414,71 398,73 C382,75 346,75 330,76 C314,77 305,78 300,80 C295,82 291,87 298,90 C305,93 320,94 340,97 C360,100 404,102 420,105 C436,108 436,110 438,113 C440,116 440,120 430,122 C420,124 402,127 380,128 C358,129 330,130 300,130 C270,130 230,127 200,127 C170,127 143,127 120,128 C97,129 73,130 62,132 C51,134 49,135 52,137 C55,139 70,142 80,146 C90,150 107,155 112,160 C117,165 110,170 112,176 C114,182 118,190 126,196 C134,202 148,210 160,215 C172,220 183,224 200,225 C217,226 238,224 260,222 C282,220 310,213 330,210 C350,207 359,205 380,204 C401,203 442,205 455,205", open: true, depth: 1 };
  var STAGE_TALL = { d: "M-42,445 C-42,439 -41,422 -41,410 C-41,398 -42,376 -43,375 C-44,374 -42,396 -44,405 C-46,414 -50,423 -54,426 C-58,429 -63,430 -66,425 C-69,420 -71,414 -73,398 C-75,382 -75,346 -76,330 C-77,314 -78,305 -80,300 C-82,295 -87,291 -90,298 C-93,305 -94,320 -97,340 C-100,360 -102,404 -105,420 C-108,436 -110,436 -113,438 C-116,440 -120,440 -122,430 C-124,420 -127,402 -128,380 C-129,358 -130,330 -130,300 C-130,270 -127,230 -127,200 C-127,170 -127,143 -128,120 C-129,97 -130,73 -132,62 C-134,51 -135,49 -137,52 C-139,55 -142,70 -146,80 C-150,90 -155,107 -160,112 C-165,117 -170,110 -176,112 C-182,114 -190,118 -196,126 C-202,134 -210,148 -215,160 C-220,172 -224,183 -225,200 C-226,217 -224,238 -222,260 C-220,282 -213,310 -210,330 C-207,350 -205,359 -204,380 C-203,401 -205,442 -205,455", open: true, depth: 1 };
  var ENVELOPE = { d: "M10,10 L50,35 L90,10 L90,50 L10,50 Z", open: false, depth: 0.35 };

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function smooth(x) { return x * x * (3 - 2 * x); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function mod(a, n) { return ((a % n) + n) % n; }

  // Sample a path into points and a 0..1 depth (1 = near the viewer; higher on the screen = farther).
  function sampleShape(def) {
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("style", "position:absolute;width:0;height:0;visibility:hidden");
    var path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", def.d);
    svg.appendChild(path);
    document.body.appendChild(svg);
    var len = path.getTotalLength(), x = [], y = [], i, p;
    for (i = 0; i < SAMPLES; i++) {
      p = path.getPointAtLength(len * i / (def.open ? SAMPLES - 1 : SAMPLES));
      x.push(p.x); y.push(p.y);
    }
    document.body.removeChild(svg);
    var minY = Math.min.apply(null, y), maxY = Math.max.apply(null, y);
    var depth = y.map(function (v) { return 1 - (1 - (v - minY) / (maxY - minY || 1)) * def.depth; });
    return { x: x, y: y, depth: depth, open: def.open };
  }

  // Fit raw points into the canvas and precompute what is needed to place a letter at fraction v of the shape.
  function bake(raw, w, h, fracW, fracH, minPx, maxPx) {
    var n = SAMPLES, x0 = Math.min.apply(null, raw.x), x1 = Math.max.apply(null, raw.x),
        y0 = Math.min.apply(null, raw.y), y1 = Math.max.apply(null, raw.y);
    var s = Math.min(w * fracW / (x1 - x0 || 1), h * fracH / (y1 - y0 || 1));
    var ox = (w - (x1 - x0) * s) / 2 - x0 * s, oy = (h - (y1 - y0) * s) / 2 - y0 * s;
    var px = [], py = [], size = [], alpha = [], u = [0], k, a, b, seg;
    for (k = 0; k < n; k++) {
      px.push(raw.x[k] * s + ox); py.push(raw.y[k] * s + oy);
      size.push(lerp(minPx, maxPx, raw.depth[k])); alpha.push(lerp(0.6, 1, raw.depth[k]));
    }
    // Letters are evenly spaced in "size units", so distant (small) stretches hold more letters per pixel.
    for (k = 0; k < n; k++) {
      a = k; b = (k + 1) % n;
      seg = raw.open && k === n - 1 ? 0 : Math.hypot(px[b] - px[a], py[b] - py[a]); // an open stage has no closing segment
      u.push(u[k] + seg / ((size[a] + size[b]) / 2));
    }
    return { px: px, py: py, size: size, alpha: alpha, u: u, total: u[n], n: n, open: raw.open };
  }

  function at(t, v, out) {
    var n = t.n, q = mod(v, 1), target = q * t.total, lo = 0, hi = n;
    while (hi - lo > 1) { var mid = (lo + hi) >> 1; if (t.u[mid] <= target) lo = mid; else hi = mid; }
    var a = lo, b = (lo + 1) % n, f = (target - t.u[a]) / ((t.u[a + 1] - t.u[a]) || 1);
    out.x = lerp(t.px[a], t.px[b], f); out.y = lerp(t.py[a], t.py[b], f);
    out.size = lerp(t.size[a], t.size[b], f); out.alpha = lerp(t.alpha[a], t.alpha[b], f);
    if (t.open) out.alpha *= Math.min(1, q / FADE, (1 - q) / FADE); // letters appear/disappear softly at the stage ends
    // tangent from a few samples either side, so corners are rounded rather than snapped
    var p = t.open ? Math.max(0, a - 3) : (a + n - 3) % n, r = t.open ? Math.min(n - 1, a + 4) : (a + 4) % n;
    out.dx = t.px[r] - t.px[p]; out.dy = t.py[r] - t.py[p];
  }

  function create(stage, opts) {
    var canvas = document.createElement("canvas");
    canvas.className = "snake";
    canvas.setAttribute("aria-hidden", "true");
    stage.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var wide = sampleShape(STAGE_WIDE), tall = sampleShape(STAGE_TALL), envelope = sampleShape(ENVELOPE);
    var tables = [], zones = [], letters = 0, w = 0, h = 0, dpr = 1;
    var still = !!opts.still;                                   // contact: no movement, no easter egg
    var shapeTarget = opts.shape || 0, shapeW = shapeTarget;    // 0 = stage, 1 = envelope
    var eggTarget = 0, eggW = 0, eggUntil = 0;
    var lap = 0;                                                // envelope flow (0..1)
    var flow = 0;                                               // how far the letters have slid along the stage (in letters)
    var prog = 0, hold = 0, lit = 1;                            // the dot: position 0..1 along the stage, wait, lit-letters level
    var raf = 0, last = 0, dirty = true, dead = false;
    var head = { x: -99, y: -99 }, A = {}, B = {};

    function layout() {
      var rect = stage.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width)); h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      var mobile = window.matchMedia("(max-width: 767px)").matches;
      var minPx = mobile ? 9 : 10, maxPx = mobile ? 12 : 14;
      tables = [bake(h > w ? tall : wide, w, h, 0.96, 0.98, minPx, maxPx), bake(envelope, w, h, mobile ? 0.9 : 0.8, 0.9, minPx, maxPx)];
      var total = (tables[0].total + tables[1].total) / 2;
      letters = Math.max(1, Math.round(total / 0.85 / WORD.length)) * WORD.length; // whole words, so the loop has no seam
      zones = computeZones(tables[0], tables[0].total / letters);
      dirty = true;
    }

    // Zones of the stage where the text runs rightwards (+1) or leftwards (-1). Leftwards stretches are drawn upright
    // and read in the opposite order along the path, so the name reads correctly everywhere; at each turn the text
    // is mirrored (letters appear or vanish there). Short stretches are merged into their neighbours.
    function computeZones(t, sp) {
      var n = t.n, runs = [], k, s, cur = null;
      for (k = 0; k < n; k++) {
        var dx = t.px[Math.min(n - 1, k + 4)] - t.px[Math.max(0, k - 3)];
        s = dx < 0 ? -1 : 1;
        if (cur && cur.s === s) cur.u1 = t.u[k]; else { cur = { s: s, u0: t.u[k], u1: t.u[k] }; runs.push(cur); }
      }
      runs[runs.length - 1].u1 = t.u[n - 1];
      for (k = 1; k < runs.length; k++) runs[k].u0 = runs[k - 1].u1;
      var MIN = 10 * sp, changed = true;
      while (changed && runs.length > 1) {
        changed = false;
        for (k = 0; k < runs.length; k++) {
          if (runs[k].u1 - runs[k].u0 >= MIN) continue;
          var prev = runs[k - 1], next = runs[k + 1], into = !next || (prev && prev.u1 - prev.u0 >= next.u1 - next.u0) ? prev : next;
          into.u0 = Math.min(into.u0, runs[k].u0); into.u1 = Math.max(into.u1, runs[k].u1);
          runs.splice(k, 1);
          for (var q = 1; q < runs.length; q++) if (runs[q].s === runs[q - 1].s) { runs[q - 1].u1 = runs[q].u1; runs.splice(q, 1); q--; }
          changed = true; break;
        }
      }
      var tt = 0;
      runs.forEach(function (z) { z.t0 = tt; tt += z.s * (z.u1 - z.u0) / sp; z.t1 = tt; });
      return runs;
    }

    function draw() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (!tables.length) return;
      var m = smooth(shapeW), e = smooth(eggW), reachedFrom = 1 - prog;
      var total = tables[0].total, sp = total / letters, list = [];
      zones.forEach(function (z) {
        var lo = Math.min(z.t0, z.t1), hi = Math.max(z.t0, z.t1);
        for (var n = Math.ceil(lo - flow); n <= Math.floor(hi - flow); n++) {
          var u = z.u0 + z.s * (n + flow - z.t0) * sp, v = Math.min(Math.max(u / total, 0), 0.99999);
          at(tables[0], v, A);
          var edge = Math.max(0, Math.min(1, Math.min(u - z.u0, z.u1 - u) / (2.5 * sp))); // fade near the turns
          var reached = Math.max(v >= reachedFrom ? lit : 0, e);
          list.push({ x: A.x, y: A.y, size: A.size, alpha: A.alpha * edge * (UNLIT + (1 - UNLIT) * reached),
                      ang: Math.atan2(A.dy, A.dx) + (z.s < 0 ? Math.PI : 0), dx: A.dx, dy: A.dy, n: n, v: v });
        }
      });
      list.sort(function (p, q) { return p.v - q.v; }); // along the stage, so the morph to the envelope keeps neighbours together
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillStyle = "#fff";
      function put(x, y, size, alpha, ang, n) {
        ctx.save();
        ctx.translate(x, y); ctx.rotate(ang);
        ctx.font = "400 " + size.toFixed(1) + "px Inter, 'Helvetica Neue', Arial, sans-serif";
        if (e < 1) { ctx.globalAlpha = alpha * (1 - e); ctx.fillText(WORD.charAt(mod(n, WORD.length)), 0, 0); }
        if (e > 0) { ctx.globalAlpha = alpha * e; ctx.fillText(PHRASE.charAt(mod(n, PHRASE.length)), 0, 0); }
        ctx.restore();
      }
      var count = Math.max(list.length, letters);
      for (var i = 0; i < count; i++) {
        at(tables[1], (i % letters) / letters + lap, B);
        var a = list[i];
        if (!a) { if (m > 0) put(B.x, B.y, B.size, B.alpha * m, Math.atan2(B.dy, B.dx), i); continue; }
        if (i >= letters) { if (m < 1) put(a.x, a.y, a.size, a.alpha * (1 - m), a.ang, a.n); continue; }
        var ang = m > 0 ? Math.atan2(lerp(a.dy, B.dy, m), lerp(a.dx, B.dx, m)) + (m < 1 ? a.ang - Math.atan2(a.dy, a.dx) : 0) : a.ang;
        var x = lerp(a.x, B.x, m), y = lerp(a.y, B.y, m), size = lerp(a.size, B.size, m), alpha = lerp(a.alpha, B.alpha, m);
        // the characters follow the stage's text order until the envelope takes over, then its own order
        if (m < 1) put(x, y, size, alpha * (1 - m), ang, a.n);
        if (m > 0) put(x, y, size, alpha * m, ang, i);
      }
      // the dot: runs the stage; on the envelope it sits at the seam of the letters
      at(tables[0], Math.min(Math.max(reachedFrom, 0.0001), 0.9999), A); at(tables[1], lap - 0.5 / letters, B);
      head.x = lerp(A.x, B.x, m); head.y = lerp(A.y, B.y, m);
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    function canEgg() { return !still && shapeTarget === 0; } // the easter egg only lives on the career stage

    function setEgg(on) {
      if (eggTarget === (on ? 1 : 0)) return;
      eggTarget = on ? 1 : 0;
      canvas.setAttribute("data-egg", on ? "on" : "off");
      if (on) eggUntil = performance.now() + EGG_MS;
      if (reduce.matches) eggW = eggTarget;
      dirty = true;
    }

    function touchesDot(e) {
      var rect = canvas.getBoundingClientRect();
      return Math.hypot(e.clientX - rect.left - head.x, e.clientY - rect.top - head.y) <= TOUCH_PX;
    }

    function onPointer(e) {
      if (canEgg() && !eggTarget && touchesDot(e)) setEgg(true);
    }

    function frame(now) {
      if (dead) return;
      var dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      last = now;
      var moving = false, step = dt / MORPH_SECONDS;
      if (reduce.matches || still) { shapeW = shapeTarget; eggW = eggTarget; prog = 1; lit = 1; }
      else {
        moving = true;
        if (shapeW !== shapeTarget) shapeW = shapeW < shapeTarget ? Math.min(shapeTarget, shapeW + step) : Math.max(shapeTarget, shapeW - step);
        if (eggW !== eggTarget) eggW = eggW < eggTarget ? Math.min(eggTarget, eggW + step) : Math.max(eggTarget, eggW - step);
        lap = (lap + dt * FLOW / letters) % 1; // envelope: same speed in letters per second as the stage
        // the dot runs the stage, waits at the finish, then the lit letters fade and it starts again
        if (prog < 1) { prog = Math.min(1, prog + dt / STAGE_SECONDS); if (prog === 1) { hold = HOLD_SECONDS + RESET_SECONDS; setEgg(false); } } // the dot reached the finish: the name comes back
        else { hold -= dt; if (hold < RESET_SECONDS) lit = Math.max(0, hold / RESET_SECONDS); if (hold <= 0) { prog = 0; lit = 1; } }
      }
      if (!reduce.matches && !still) flow += FLOW * dt;
      if (eggTarget && now >= eggUntil) setEgg(false);
      if (moving || dirty) { draw(); dirty = false; }
      raf = requestAnimationFrame(frame);
    }

    var ro = window.ResizeObserver ? new ResizeObserver(layout) : null;
    if (ro) ro.observe(stage); else window.addEventListener("resize", layout);
    ["pointermove", "pointerdown"].forEach(function (t) { window.addEventListener(t, onPointer, { passive: true }); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { dirty = true; });

    layout();
    raf = requestAnimationFrame(frame);

    return {
      setShape: function (i) { shapeTarget = i ? 1 : 0; if (shapeTarget) setEgg(false); if (reduce.matches) shapeW = shapeTarget; dirty = true; },
      destroy: function () {
        dead = true; cancelAnimationFrame(raf);
        if (ro) ro.disconnect(); else window.removeEventListener("resize", layout);
        ["pointermove", "pointerdown"].forEach(function (t) { window.removeEventListener(t, onPointer); });
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }

  window.Snake = { create: create };
})();
