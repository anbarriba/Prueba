// Silhouette of a person (bust) in an arbitrary 100 x 120 box, drawn from scratch.
// About fills it with dots; the home snake uses its outline when "about" is selected.
(function () {
  "use strict";
  window.Figure = {
    BOX: { w: 100, h: 120 },
    OUTLINE: "M8,118 L8,92 C8,78 22,70 38,64 L41,57 A22,22 0 1 1 59,57 L62,64 C78,70 92,78 92,92 L92,118 Z"
  };
})();
