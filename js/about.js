// About screen: presentation sentence, short bio and the dotted figure, with a credit line at the end.
(function () {
  "use strict";
  var el = window.Ui.el;

  function create(container, about) {
    var page = window.Ui.textPage(container, about.statement);
    var text = page.col, root = page.root;
    about.bio.forEach(function (paragraph) { text.appendChild(el("p", { "class": "para" }, paragraph)); });

    // text on the left, figure on the right
    var figureBox = el("div", { "class": "figure-box" });
    page.slot.classList.add("page-slot--figure");
    page.slot.appendChild(figureBox);

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
    page.foot.appendChild(credit);

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
