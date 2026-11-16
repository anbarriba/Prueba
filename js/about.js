// About screen: presentation sentence, short bio and the dotted figure, with a credit line at the end.
(function () {
  "use strict";
  var el = window.Ui.el;

  function create(container, about) {
    var root = el("div", { "class": "about" });

    var text = el("div", { "class": "about-text" });
    text.appendChild(el("p", { "class": "about-statement" }, about.statement));
    about.bio.forEach(function (paragraph) { text.appendChild(el("p", { "class": "para" }, paragraph)); });

    var figureBox = el("div", { "class": "figure-box" });
    var main = el("div", { "class": "about-main" }); // text on the left, figure on the right
    main.appendChild(text); main.appendChild(figureBox);
    root.appendChild(main);

    // credit line: the whole line is the link, with the external arrow; plain text while there is no link
    var credit = el("p", { "class": "credit" });
    if (about.credit.href) {
      var a = el("a", { href: about.credit.href, target: "_blank", rel: "noopener" }, about.credit.text);
      a.appendChild(window.Ui.externalArrow());
      a.appendChild(el("span", { "class": "sr-only" }, " (opens in a new tab)"));
      credit.appendChild(a);
    } else {
      credit.textContent = about.credit.text;
    }
    root.appendChild(credit);
    container.appendChild(root);

    // the figure is as tall as the text block (title to end of bio); on small screens it is a fixed, smaller size above the text
    var narrow = window.matchMedia("(max-width: 767px)");
    var figure = window.Figure.create(figureBox, function () { return narrow.matches ? 170 : text.getBoundingClientRect().height; });
    var ro = window.ResizeObserver ? new ResizeObserver(figure.relayout) : null;
    if (ro) ro.observe(text);
    if (narrow.addEventListener) narrow.addEventListener("change", figure.relayout);
    return {
      destroy: function () {
        if (ro) ro.disconnect();
        if (narrow.removeEventListener) narrow.removeEventListener("change", figure.relayout);
        figure.destroy(); if (root.parentNode) root.parentNode.removeChild(root);
      }
    };
  }

  window.About = { create: create };
})();
