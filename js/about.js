// About screen: presentation sentence, short bio, education and the dotted figure, with a credit line at the end.
(function () {
  "use strict";
  var el = window.Ui.el;

  function create(container, about) {
    var root = el("div", { "class": "about" });

    var text = el("div", { "class": "about-text" });
    text.appendChild(el("p", { "class": "about-statement" }, about.statement));
    text.appendChild(el("p", { "class": "para" }, about.bio));
    text.appendChild(el("p", { "class": "label" }, "education"));
    var ul = el("ul", { "class": "edu" });
    about.education.forEach(function (row) {
      var li = el("li");
      li.appendChild(el("span", { "class": "edu-what" }, row.title + " · " + row.school));
      li.appendChild(el("span", { "class": "edu-years" }, row.years));
      ul.appendChild(li);
    });
    text.appendChild(ul);

    var figureBox = el("div", { "class": "figure-box" });
    root.appendChild(text); root.appendChild(figureBox);

    // credit line: the link is shown only once it exists
    var credit = el("p", { "class": "credit" }, about.credit.text + " ");
    if (about.credit.href) {
      var a = el("a", { href: about.credit.href, target: "_blank", rel: "noopener" }, about.credit.linkLabel);
      credit.appendChild(a);
    } else {
      credit.appendChild(el("span", {}, about.credit.linkLabel + " (link pending)"));
    }
    root.appendChild(credit);
    container.appendChild(root);

    var figure = window.Figure.create(figureBox);
    return { destroy: function () { figure.destroy(); if (root.parentNode) root.parentNode.removeChild(root); } };
  }

  window.About = { create: create };
})();
