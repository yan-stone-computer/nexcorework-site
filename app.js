const root = document.documentElement;
const themeButton = document.getElementById("themeToggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const workbenchLink = document.querySelector('.site-header nav a[href="#about"]');
if (workbenchLink) {
  workbenchLink.href = "#nexcorework";
  workbenchLink.textContent = "\u5de5\u4f5c\u53f0";
}
document.querySelectorAll('a[href*="NexcoreWork-Setup-2.1.0.exe"]').forEach((link) => {
  link.href = "https://github.com/yan-stone-computer/nexcorework-site/releases/download/v2.3.0/NexcoreWork-Setup-2.3.0.exe";
  if (link.textContent.includes("2.1")) link.textContent = "\u5148\u5b89\u88c5 Windows 2.3 \u7535\u8111\u7aef \u2192";
});
document.querySelectorAll('a[href="index.html#windows"]').forEach((link) => {
  link.href = "index.html#nexcorework";
  if (link.textContent.includes("2.1")) link.textContent = "\u4e0b\u8f7d Windows 2.3 \u7aef \u2192";
});

function syncThemeControl() {
  if (!themeButton) return;
  const dark = root.dataset.theme === "dark";
  themeButton.setAttribute("aria-pressed", String(dark));
  themeButton.setAttribute("aria-label", dark ? "切换到浅色模式" : "切换到深色模式");
}

syncThemeControl();

themeButton?.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  root.style.colorScheme = next;
  if (themeMeta) themeMeta.content = next === "dark" ? "#101012" : "#f5f5f7";
  try {
    localStorage.setItem("chromatic-theme", next);
  } catch {}
  syncThemeControl();
});

const works = [
  {
    title: "日潮",
    english: "Solar Drift · 2026",
    artist: "林曜 · 综合材料",
    src: "assets/artworks/chromatic-01.webp",
    alt: "橙色、朱红与明黄交叠的抽象作品《日潮》"
  },
  {
    title: "潮间",
    english: "Intertidal · 2025",
    artist: "林曜 · 综合材料",
    src: "assets/artworks/chromatic-02.webp",
    alt: "钴蓝、湖绿与海沫白交叠的抽象作品《潮间》"
  },
  {
    title: "静野",
    english: "Quiet Field · 2024",
    artist: "林曜 · 综合材料",
    src: "assets/artworks/chromatic-03.webp",
    alt: "橄榄绿、黄绿与矿物灰构成的抽象作品《静野》"
  },
  {
    title: "紫色时刻",
    english: "Violet Hour · 2025",
    artist: "林曜 · 综合材料",
    src: "assets/artworks/chromatic-04.webp",
    alt: "梅紫、丁香与钴蓝构成的抽象作品《紫色时刻》"
  },
  {
    title: "脉冲",
    english: "Pulse · 2023",
    artist: "林曜 · 综合材料",
    src: "assets/artworks/chromatic-05.webp",
    alt: "猩红、群青与暖白构成的抽象作品《脉冲》"
  }
];

const cards = [...document.querySelectorAll(".art-card")];
const activeNumber = document.getElementById("activeNumber");
const activeTitle = document.getElementById("activeTitle");
const activeEnglish = document.getElementById("activeEnglish");
const activeArtist = document.getElementById("activeArtist");
const prevButton = document.getElementById("prevWork");
const nextButton = document.getElementById("nextWork");

let activeIndex = 0;
let queuedSteps = 0;
let cycling = false;

function paintDeck(index) {
  if (!activeNumber || !activeTitle || !activeEnglish || !activeArtist || !cards.length) return;
  const work = works[index];
  activeNumber.textContent = String(index + 1).padStart(2, "0");
  activeTitle.textContent = work.title;
  activeEnglish.textContent = work.english;
  activeArtist.textContent = work.artist;

  cards.forEach((card, position) => {
    const item = works[(position + index) % works.length];
    const image = card.querySelector("img");
    image.src = item.src;
    image.alt = item.alt;
    card.classList.toggle("is-active", position === 0);
  });
}

function playCycle() {
  if (cycling || !queuedSteps) return;
  cycling = true;
  const direction = Math.sign(queuedSteps);
  queuedSteps -= direction;
  activeIndex = (activeIndex + direction + works.length) % works.length;

  cards.forEach((card) => {
    card.classList.remove("is-cycling");
    void card.offsetWidth;
    card.classList.add("is-cycling");
  });

  setTimeout(() => paintDeck(activeIndex), 185);
  setTimeout(() => {
    cards.forEach((card) => card.classList.remove("is-cycling"));
    cycling = false;
    playCycle();
  }, 760);
}

function requestCycle(direction) {
  queuedSteps += direction;
  playCycle();
}

prevButton?.addEventListener("click", () => requestCycle(-1));
nextButton?.addEventListener("click", () => requestCycle(1));

paintDeck(activeIndex);

const experience = document.querySelector(".experience");
const stage = document.getElementById("experienceStage");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (experience && stage && !reduceMotion) {
  let target = 0;
  let current = 0;
  let visible = false;
  let frameId = 0;
  const clamp = (value) => Math.min(1, Math.max(0, value));

  function frame() {
    const distance = experience.offsetHeight - innerHeight;
    const raw = distance > 0 ? -experience.getBoundingClientRect().top / distance : 0;
    target = clamp(raw);
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.0004) current = target;
    stage.style.setProperty("--p", current.toFixed(4));
    stage.classList.toggle("is-reading", current > 0.35);
    frameId = visible ? requestAnimationFrame(frame) : 0;
  }

  new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (visible && !frameId) frameId = requestAnimationFrame(frame);
  }, { threshold: 0 }).observe(experience);
} else if (stage) {
  stage.style.setProperty("--p", "0");
}
