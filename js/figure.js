// The person on the About screen, in the style of a dot-matrix figure: a coarse grid of big dots, drawn from scratch.
// The home snake uses a smooth outline of a bust (OUTLINE, in an arbitrary 100 x 120 box) when "about" is selected.
(function () {
  "use strict";

  var OUTLINE = "M8,118 L8,92 C8,78 22,70 38,64 L41,57 A22,22 0 1 1 59,57 L62,64 C78,70 92,78 92,92 L92,118 Z";
  // 9 columns x 15 rows: a full-body figure with head, arms, body and two separate legs. "#" = a dot.
  var GRID = [
    "...###...",
    "..#####..",
    "..#####..",
    "...###...",
    ".........",
    ".#######.",
    "#.#####.#",
    "#.#####.#",
    "#.#####.#",
    "#.#####.#",
    "..#####..",
    "..##.##..",
    "..##.##..",
    "..##.##..",
    "..##.##.."
  ];
  var DOT_RATIO = 0.44; // dot diameter as a fraction of the distance between dot centres (so the dots stay big, with a visible gap)
  var DRAW_MS = 500;  // the whole figure appears in this time, point by point (top to bottom)
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  // A canvas inside `container` that draws the dotted figure and fills it in point by point.
  // The figure is as tall as `heightOf()` says (in px) and the container takes its size; call relayout() when that changes.
  function create(container, heightOf) {
    var canvas = document.createElement("canvas");
    canvas.className = "figure";
    canvas.setAttribute("aria-hidden", "true");
    container.appendChild(canvas);
    var ctx = canvas.getContext("2d"), pts = [], w = 0, h = 0, dot = 0, current = 1, dpr = 1, t0 = 0, raf = 0, dead = false; // current: how much of the figure is drawn (0..1)
    var color = getComputedStyle(document.documentElement).getPropertyValue("--text").trim() || "#fff";

    function draw(progress) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      var count = Math.ceil(pts.length * progress);
      for (var i = 0; i < count; i++) { ctx.beginPath(); ctx.arc(pts[i][0], pts[i][1], dot / 2, 0, Math.PI * 2); ctx.fill(); }
    }
    function frame(now) {
      if (dead) return;
      var p = current = Math.min(1, (now - t0) / DRAW_MS);
      draw(p);
      raf = p < 1 ? requestAnimationFrame(frame) : 0;
    }
    function layout() {
      var pitch = heightOf() / (GRID.length - 1 + DOT_RATIO);
      dot = pitch * DOT_RATIO;
      w = (GRID[0].length - 1) * pitch + dot; h = (GRID.length - 1) * pitch + dot;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      container.style.width = w + "px"; container.style.height = h + "px";
      canvas.width = w * dpr; canvas.height = h * dpr;
      pts = [];
      GRID.forEach(function (row, r) {
        for (var c = 0; c < row.length; c++) if (row.charAt(c) === "#") pts.push([dot / 2 + c * pitch, dot / 2 + r * pitch]);
      });
      draw(current);
    }

    if (!reduce.matches) current = 0;
    layout();
    if (!reduce.matches) { t0 = performance.now(); raf = requestAnimationFrame(frame); }

    return {
      relayout: layout,
      destroy: function () {
        dead = true; cancelAnimationFrame(raf);
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }

  window.Figure = { OUTLINE: OUTLINE, create: create };
})();
