// About screen: presentation sentence, short bio and the dotted figure, with a credit line at the end.
(function () {
  "use strict";
  var el = window.Ui.el;

  function create(container, about) {
    var root = el("div", { "class": "about" });

    var text = el("div", { "class": "about-text" });
    text.appendChild(el("p", { "class": "about-statement" }, about.statement));
    text.appendChild(el("p", { "class": "para" }, about.bio));

    var figureBox = el("div", { "class": "figure-box" });
    root.appendChild(text); root.appendChild(figureBox);

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

    var figure = window.Figure.create(figureBox);
    return { destroy: function () { figure.destroy(); if (root.parentNode) root.parentNode.removeChild(root); } };
  }

  window.About = { create: create };
})();
