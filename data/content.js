// All editable content lives here. Loaded as a plain script (no build step).
(function () {
// Small helpers to keep the data below short. Everything shown on the site is in the objects they build.
function sec(label, x, y, bigLabel, fidelity, text) {
  return {
    id: label.replace(/\s+/g, "-"), label: label, point: { x: x, y: y },
    detail: { src: null, alt: label + " detail (image pending)" },
    big: { label: bigLabel, value: "--" }, // TODO: real key figure
    fidelity: fidelity, text: text
  };
}
function project(id, info, sections) {
  return {
    id: id, name: id, role: info.role, years: info.years, team: info.team, platforms: info.platforms,
    image: { src: null, alt: id + " key screen (image pending)" }, sections: sections
  };
}
function pending(id) {
  return project(id, { role: "pending", years: "pending", team: "pending", platforms: "pending" }, [
    sec("context", 18, 20, "pending", 0.1, "pending"), sec("research", 82, 18, "pending", 0.0, "pending"),
    sec("flows", 50, 50, "pending", 0.3, "pending"), sec("ui", 30, 70, "pending", 0.9, "pending"),
    sec("design qa", 72, 78, "pending", 1.0, "pending"), sec("results", 88, 45, "pending", 1.0, "pending")
  ]);
}

window.CONTENT = {
  build: "ab portfolio build 1 (nov 2026)",
  site: { name: "angel barreiro", role: "product designer" },
  home: { options: ["career", "contact"] },
  career: {
    // Companies in reverse chronological order. Each project is one tab of the case-study screen.
    // Images are placeholders until Ángel provides them: set `image.src` (and keep `alt`) to show one.
    // Section fields: point = where the guide line ends on the main image (% x, y);
    // big = label + value of the big number; fidelity = 0 (low-fi) .. 1 (hi-fi) for the scale marker.
    companies: [
      {
        id: "idrica", name: "idrica", years: "2024 – now", role: "Product Designer", surfaces: "pending",
        projects: [pending("pending")]
      },
      {
        id: "leemons", name: "leemons", years: "2023 – 2024", role: "Product Designer", surfaces: "pending",
        projects: [pending("pending")]
      },
      {
        id: "pccomponentes", name: "pccomponentes", years: "2021 – 2023", role: "Product Designer",
        surfaces: "research, flows, ui",
        projects: [
          project("logistics", { role: "Product Designer", years: "2021 – 2023", team: "pending", platforms: "mobile, desktop" }, [
            sec("context", 18, 20, "pending", 0.1, "Visual and flow redesign of the logistics apps, on mobile and desktop."),
            sec("research", 82, 18, "interviews", 0.0, "Interviews and shadowing of employees to see how they work day to day."),
            sec("flows", 50, 50, "pending", 0.3, "pending"),
            sec("ui", 30, 70, "pending", 0.9, "pending"),
            sec("design qa", 72, 78, "pending", 1.0, "pending"),
            sec("results", 88, 45, "pending", 1.0, "pending")
          ]),
          project("checkout", { role: "Product Designer", years: "2021 – 2023", team: "pending", platforms: "pending" }, [
            sec("context", 18, 20, "pending", 0.1, "Support on the checkout experience."),
            sec("research", 82, 18, "pending", 0.0, "pending"),
            sec("flows", 50, 50, "pending", 0.3, "pending"),
            sec("ui", 30, 70, "pending", 0.9, "pending"),
            sec("design qa", 72, 78, "pending", 1.0, "pending"),
            sec("results", 88, 45, "pending", 1.0, "pending")
          ])
        ]
      },
      {
        id: "inditex", name: "inditex", years: "2019 – 2021", role: "Junior Product Designer",
        surfaces: "mapping, ia, wireframes, ui",
        projects: [
          project("wms", { role: "Junior Product Designer", years: "2019 – 2021", team: "pending", platforms: "mobile, desktop" }, [
            sec("context", 18, 20, "pending", 0.1, "Design of a WMS (warehouse management software), for mobile and desktop."),
            sec("research", 82, 18, "pending", 0.0, "Mapping of the processes the software had to support."),
            sec("flows", 50, 50, "pending", 0.3, "Information architecture of the software."),
            sec("ui", 30, 70, "pending", 0.9, "Wireframes, prototypes and the interface, on mobile and desktop."),
            sec("design qa", 72, 78, "pending", 1.0, "pending"),
            sec("results", 88, 45, "pending", 1.0, "Collaboration on a design system.")
          ])
        ]
      }
    ]
  },
  contact: {
    options: [
      { id: "email", label: "email", href: "mailto:angelbarreiroribadulla@gmail.com" },
      { id: "linkedin", label: "linkedin", href: "https://www.linkedin.com/in/angel-barreiro/", newTab: true }
    ]
  },
  help: {
    keys: "use the arrow keys to choose, press enter to confirm.",
    touch: "swipe to choose, tap to confirm.",
    sheet: { keys: "↑ ↓ choose a section, ← → switch project, esc to go back.", touch: "tap a section to open it." }
  }
};
})();
