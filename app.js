const menuButton = document.getElementById("menuToggle");
const nav = document.getElementById("siteNav");

function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
}

menuButton?.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

const revealItems = [...document.querySelectorAll(".reveal")];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
    observer.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const navLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
if ("IntersectionObserver" in window && navLinks.length) {
  const sections = navLinks
    .map(link => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter(item => item.section);
  const activeSection = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const { link, section } of sections) {
        if (section === entry.target) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    }
  }, { rootMargin: "-35% 0px -55%", threshold: 0 });
  sections.forEach(({ section }) => activeSection.observe(section));
}
