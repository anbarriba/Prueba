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
window.CONTENT = {
  build: "ab portfolio build 1 (nov 2026)",
  site: { name: "angel barreiro", role: "product designer" },
  home: {
    options: ["about", "career", "contact"],
    intro: "" // short intro phrase above the carousel (one line). Empty = not shown; write it here when ready
  },
  // About: all text is a visible placeholder until Ángel writes it. No skills or tools here.
  about: {
    statement: "pending: your presentation sentence",
    bio: "pending: a short bio in two or three lines about who you are and how you work.",
    education: [
      { title: "pending degree", school: "pending school", years: "pending" },
      { title: "pending course", school: "pending school", years: "pending" }
    ],
    credit: {
      text: "design inspired by the menus of colin mcrae rally 2.0, a rally game from 2000.",
      linkLabel: "about the game",
      href: "" // TODO: link to a public reference for the game
    }
  },
  career: {
    // Companies in reverse chronological order. Each project is one tab of the case-study screen.
    // Images are placeholders until Ángel provides them: set `image.src` (and keep `alt`) to show one.
    // Section fields: point = where the guide line ends on the main image (% x, y);
    // big = label + value of the big number; fidelity = 0 (low-fi) .. 1 (hi-fi) for the scale marker.
    companies: [
      {
        id: "idrica", name: "idrica", years: "2024 – now", role: "Product Designer", surfaces: "pending",
        titles: [{ role: "Product Designer", years: "2024 – now" }],
        summary: "pending: a short description of the role and the product.", highlight: "pending: a standout result.",
        projects: [] // pending: Ángel will prepare the case studies
      },
      {
        id: "leemons", name: "leemons", years: "2023 – 2024", role: "Product Designer", surfaces: "pending",
        titles: [{ role: "Product Designer", years: "2023 – 2024" }],
        summary: "From wireframes to high-fidelity prototypes, user flows and stories, working with back, front and UI, and design QA after implementation.", highlight: "pending: a standout result.",
        projects: [] // pending: Ángel will prepare the case studies
      },
      {
        id: "pccomponentes", name: "pccomponentes", years: "2021 – 2023", role: "Product Designer",
        surfaces: "research, flows, ui",
        titles: [{ role: "Product Designer", years: "2021 – 2023" }],
        summary: "Visual and flow redesign of the logistics apps (mobile and desktop), research with interviews and shadowing of employees, and support on the checkout experience.", highlight: "pending: a standout result.",
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
        titles: [{ role: "Junior Product Designer", years: "2019 – 2021" }],
        summary: "Design of a WMS (warehouse management software): mapping, information architecture, wireframes, prototypes and interface on mobile and desktop, and collaboration on a design system.", highlight: "pending: a standout result.",
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
    intro: "got a project in mind? let's talk.", // provisional text: Ángel will rewrite it
    options: [
      { id: "email", label: "email", href: "mailto:angelbarreiroribadulla@gmail.com" },
      { id: "linkedin", label: "linkedin", href: "https://www.linkedin.com/in/angelbarreiro", newTab: true }
    ]
  },
  help: {
    keys: "use the arrow keys to choose, press enter to confirm.",
    touch: "swipe to choose, tap to confirm.",
    sheet: { keys: "↑ ↓ choose a section, ← → switch project, esc to go back.", touch: "tap a section to open it." },
    list: { keys: "↑ ↓ choose, enter to open, esc to go back.", touch: "tap an option to open it." }
  }
};
})();
