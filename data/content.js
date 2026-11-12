// All editable content lives here. Loaded as a plain script (no build step).
window.CONTENT = {
  build: "ab portfolio build 1 (nov 2026)",
  home: { options: ["career", "contact"] },
  career: {
    // reverse chronological order
    companies: [
      { id: "idrica", name: "idrica", years: "2024 – now", role: "Product Designer", surfaces: "pending", projects: [] },
      { id: "leemons", name: "leemons", years: "2023 – 2024", role: "Product Designer", surfaces: "pending", projects: [] },
      {
        id: "pccomponentes", name: "pccomponentes", years: "2021 – 2023", role: "Product Designer",
        surfaces: "research, flows, ui",
        projects: [{ id: "logistics", name: "logistics" }, { id: "checkout", name: "checkout" }]
      },
      {
        id: "inditex", name: "inditex", years: "2019 – 2021", role: "Junior Product Designer",
        surfaces: "mapping, ia, wireframes, ui",
        projects: [{ id: "wms", name: "wms" }]
      }
    ]
  },
  contact: {
    options: [
      { id: "email", label: "email", href: "mailto:pending@example.com" }, // TODO: real address pending
      { id: "linkedin", label: "linkedin", href: "https://www.linkedin.com/in/angel-barreiro/", newTab: true }
    ]
  },
  help: {
    keys: "use the arrow keys to choose, press enter to confirm.",
    touch: "swipe to choose, tap to confirm."
  }
};
