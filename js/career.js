// Career screens: stage select (all-stages table or dotted route + card) and the company sheet ("ficha").
(function () {
  "use strict";
  var el = window.Ui.el;

  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  // Stage select. Option 0 of the carousel is "all stages" (a times-table of every company);
  // options 1.. show the company's route and a summary card.
  function createStageSelect(stage, companies) {
    stage.classList.add("stage--career");
    var index = 0, active = 0;

    var table = el("ul", { "class": "vlist tt", "aria-label": "all stages" }), rows = [];
    function paintRows() {
      rows.forEach(function (a, i) { if (i === active) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
    }
    companies.forEach(function (c, i) {
      var li = el("li"), a = el("a", { "class": "vrow", href: "#career/" + c.id });
      a.appendChild(window.Ui.arrowIcon());
      a.appendChild(el("span", { "class": "tt-n" }, pad2(i + 1)));
      a.appendChild(el("span", { "class": "tt-co" }, c.name));
      a.appendChild(el("span", { "class": "tt-role" }, c.role));
      a.appendChild(el("span", { "class": "tt-years" }, c.years));
      a.addEventListener("focus", function () { active = i; paintRows(); });
      a.addEventListener("mouseenter", function () { active = i; paintRows(); });
      li.appendChild(a); table.appendChild(li); rows.push(a);
    });

    var routeBox = el("div", { "class": "route-box" });
    var card = el("div", { "class": "card", "aria-live": "polite" });
    var thumb = el("div", { "class": "card-thumb", role: "img", "aria-label": "image coming soon" });
    var name = el("p", { "class": "card-name" });
    var dl = el("dl", { "class": "card-rows" });
    card.appendChild(thumb); card.appendChild(name); card.appendChild(dl);
    stage.appendChild(table); stage.appendChild(routeBox); stage.appendChild(card);
    var route = window.Stages.create(routeBox);

    paintRows();
    return {
      show: function (i) {
        index = i;
        var isTable = i === 0;
        table.hidden = !isTable; routeBox.hidden = card.hidden = isTable;
        stage.classList.toggle("is-table", isTable);
        if (isTable) return;
        var c = companies[i - 1];
        name.textContent = c.name;
        dl.textContent = "";
        [["years", c.years], ["role", c.role], ["surfaces", c.surfaces]].forEach(function (r) {
          var row = el("div", { "class": "card-row" });
          row.appendChild(el("dt", {}, r[0] + ":")); row.appendChild(el("dd", {}, r[1]));
          dl.appendChild(row);
        });
        route.relayout(); // the box was hidden, so measure it again before drawing
        route.show(c.id);
      },
      // opens the highlighted company of the table (Enter / tapping the active "all stages" word)
      open: function () { rows[active].click(); },
      // ↑ ↓ choose a row of the table, Enter opens it; the carousel keeps ← →
      onKey: function (e) {
        if (index !== 0) return false;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          active = (active + (e.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length;
          paintRows(); rows[active].focus();
          return true;
        }
        if (e.key === "Enter") { rows[active].click(); return true; }
        return false;
      },
      destroy: function () { route.destroy(); [table, routeBox, card].forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); }); }
    };
  }

  // Company sheet: role evolution, short description, highlight and the way in to each case study.
  function createFicha(container, company) {
    var root = el("div", { "class": "ficha" });
    var left = el("div", { "class": "ficha-left" });
    left.appendChild(el("p", { "class": "card-name" }, company.name));
    left.appendChild(el("p", { "class": "label" }, "roles"));
    var ul = el("ul", { "class": "edu" });
    company.titles.forEach(function (t) {
      var li = el("li");
      li.appendChild(el("span", { "class": "edu-what" }, t.role));
      li.appendChild(el("span", { "class": "edu-years" }, t.years));
      ul.appendChild(li);
    });
    left.appendChild(ul);
    left.appendChild(el("p", { "class": "para" }, company.summary));
    left.appendChild(el("p", { "class": "label" }, "highlight"));
    left.appendChild(el("p", { "class": "para" }, company.highlight));

    var right = el("div", { "class": "ficha-right" });
    right.appendChild(el("p", { "class": "label" }, company.projects.length ? "case studies" : "case study: coming soon"));
    var links = company.projects.map(function (p) { return { label: p.name, href: "#career/" + company.id + "/" + p.id }; });
    links.push({ label: "back", href: "#career" });
    var list = window.Ui.createList(right, links, "case studies");

    root.appendChild(left); root.appendChild(right);
    container.appendChild(root);
    return { onKey: list.onKey, destroy: function () { list.destroy(); if (root.parentNode) root.parentNode.removeChild(root); } };
  }

  window.Career = { createStageSelect: createStageSelect, createFicha: createFicha };
})();
