const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("motion-ready");

function canUseShader() {
  const connection = navigator.connection;
  if (reduceMotion || connection?.saveData || (navigator.deviceMemory || 8) <= 2 || (navigator.hardwareConcurrency || 8) <= 2) return false;
  const probe = document.createElement("canvas");
  const gl = probe.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
  return Boolean(gl);
}

function mountHeroShader() {
  const host = document.querySelector(".hero-atmosphere");
  const library = window.PaperShaders;
  if (!host || !library || !canUseShader()) {
    document.documentElement.dataset.heroShader = "off";
    return;
  }
  const surface = document.createElement("div");
  surface.className = "hero-shader";
  surface.setAttribute("aria-hidden", "true");
  host.prepend(surface);
  try {
    const colors = ["#f8fdfb", "#dff7ee", "#c6f0ef", "#daf0fb", "#f8fbfa"];
    const mount = new library.ShaderMount(
      surface,
      library.meshGradientFragmentShader,
      {
        u_colors: colors.map(library.getShaderColorFromString),
        u_colorsCount: colors.length,
        u_distortion: 0.78,
        u_swirl: 0.2,
        u_grainMixer: 0.015,
        u_grainOverlay: 0.02,
        u_fit: library.ShaderFitOptions.cover,
        u_scale: 1.05,
        u_rotation: 0,
        u_offsetX: 0,
        u_offsetY: 0,
        u_originX: 0.5,
        u_originY: 0.5,
        u_worldWidth: 0,
        u_worldHeight: 0
      },
      { alpha: true, antialias: false, depth: false, stencil: false, powerPreference: "low-power" },
      0.07,
      0,
      1,
      1_500_000
    );
    surface.classList.add("is-live");
    host.classList.add("has-shader");
    document.documentElement.dataset.heroShader = "on";
    addEventListener("pagehide", () => mount.dispose(), { once: true });
  } catch {
    surface.remove();
    document.documentElement.dataset.heroShader = "off";
  }
}

mountHeroShader();

const menuButton = document.getElementById("menuToggle");
const nav = document.getElementById("siteNav");

function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  menuButton?.setAttribute("aria-expanded", String(open));
  menuButton?.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
}

menuButton?.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

const revealItems = [...document.querySelectorAll("[data-reveal]")];
if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  revealItems.forEach((item, index) => {
    item.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 65}ms`);
    revealObserver.observe(item);
  });
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const navLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
if ("IntersectionObserver" in window && navLinks.length) {
  const sections = navLinks
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter((item) => item.section);
  const activeSection = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const { link, section } of sections) {
        if (section === entry.target) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      }
    }
  }, { rootMargin: "-32% 0px -58%", threshold: 0 });
  sections.forEach(({ section }) => activeSection.observe(section));
}

const runData = {
  understand: {
    title: "理解与规划",
    meta: "STEP 01 / 04",
    image: "assets/screens/01-首屏.webp",
    alt: "NexcoreWork 任务规划界面",
    action: "工作区已锁定",
    trace: "目标 · 约束 · 验收项",
    state: "可继续执行",
    status: "正在分析任务"
  },
  memory: {
    title: "读取项目记忆",
    meta: "STEP 02 / 04",
    image: "assets/screens/06-长期记忆.webp",
    alt: "NexcoreWork 长期记忆管理",
    action: "召回 7 条项目记忆",
    trace: "历史决策 · 命名 · 约束",
    state: "上下文已就绪",
    status: "正在读取 .NexcoreWork"
  },
  tools: {
    title: "调用工具",
    meta: "STEP 03 / 04",
    image: "assets/screens/11-工具与本地处理.webp",
    alt: "NexcoreWork 工具调用与本地处理",
    action: "write_file · 38 ms",
    trace: "+186 / -0 · 退出码 0",
    state: "工具调用成功",
    status: "正在调用本地工具"
  },
  verify: {
    title: "复核与交付",
    meta: "STEP 04 / 04",
    image: "assets/screens/03-执行过程与自检.webp",
    alt: "NexcoreWork 执行过程与自检",
    action: "57 项验收已通过",
    trace: "文件 · 页面 · 运行时",
    state: "结果可交付",
    status: "正在复核执行结果"
  }
};

const runButtons = [...document.querySelectorAll("[data-run-step]")];
const runImage = document.getElementById("runImage");
const runImageWrap = runImage?.closest(".run-image-wrap");
const runTitle = document.getElementById("runTitle");
const runMeta = document.getElementById("runMeta");
const runAction = document.getElementById("runAction");
const runTrace = document.getElementById("runTrace");
const runState = document.getElementById("runState");
const runStatus = document.getElementById("runStatus");

function updateRun(key) {
  const data = runData[key];
  if (!data || !runImage) return;
  runButtons.forEach((button) => {
    const active = button.dataset.runStep === key;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  runTitle.textContent = data.title;
  runMeta.textContent = data.meta;
  runAction.textContent = data.action;
  runTrace.textContent = data.trace;
  runState.textContent = data.state;
  runStatus.textContent = data.status;
  runImageWrap?.classList.add("is-changing");
  const nextImage = new Image();
  nextImage.onload = nextImage.onerror = () => {
    runImage.src = data.image;
    runImage.alt = data.alt;
    requestAnimationFrame(() => runImageWrap?.classList.remove("is-changing"));
  };
  nextImage.src = data.image;
}

runButtons.forEach((button) => {
  button.addEventListener("click", () => updateRun(button.dataset.runStep));
});

const architectureButtons = [...document.querySelectorAll("[data-architecture]")];
const architecturePanels = [...document.querySelectorAll(".architecture-panel")];

function activateArchitecture(key, focus = false) {
  const activeButton = architectureButtons.find((button) => button.dataset.architecture === key);
  if (!activeButton) return;
  architectureButtons.forEach((button) => {
    const active = button === activeButton;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });
  architecturePanels.forEach((panel) => {
    const active = panel.id === `panel-${key}`;
    panel.hidden = !active;
    panel.classList.remove("is-entering");
    if (active) requestAnimationFrame(() => panel.classList.add("is-entering"));
  });
  if (focus) activeButton.focus();
}

architectureButtons.forEach((button, index) => {
  button.addEventListener("click", () => activateArchitecture(button.dataset.architecture));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + architectureButtons.length) % architectureButtons.length;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % architectureButtons.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = architectureButtons.length - 1;
    activateArchitecture(architectureButtons[nextIndex].dataset.architecture, true);
  });
});

const windowButtons = [...document.querySelectorAll("[data-window-shot]")];
const windowImage = document.getElementById("windowImage");
const windowTitle = document.getElementById("windowTitle");
const windowMeta = document.getElementById("windowMeta");
const windowLink = document.getElementById("windowLink");

windowButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    windowButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    const path = `assets/screens/${button.dataset.windowShot}`;
    windowImage.src = path;
    windowImage.alt = button.dataset.windowAlt;
    windowTitle.textContent = button.dataset.windowTitle;
    windowMeta.textContent = `${String(index + 1).padStart(2, "0")} / ${String(windowButtons.length).padStart(2, "0")}`;
    windowLink.href = path;
  });
});

const routeData = {
  vision: {
    tier: "视觉模型",
    model: "免费视觉端点",
    reason: "优先选择支持图片输入、低延迟且当前可用的免费模型。"
  },
  coding: {
    tier: "工具型模型",
    model: "代码与工具调用",
    reason: "优先选择工具调用稳定、长输出能力足够且失败率较低的端点。"
  },
  research: {
    tier: "搜索型模型",
    model: "检索与归纳",
    reason: "优先选择擅长搜索整理、来源引用和长文本归纳的免费端点。"
  },
  long: {
    tier: "长上下文模型",
    model: "大窗口与续接",
    reason: "优先选择上下文窗口更大、长任务续接稳定的免费端点。"
  }
};

const routeButtons = [...document.querySelectorAll("[data-route]")];
const routeTier = document.getElementById("routeTier");
const routeModel = document.getElementById("routeModel");
const routeReason = document.getElementById("routeReason");
const routeResult = document.querySelector(".route-result");

routeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const data = routeData[button.dataset.route];
    if (!data) return;
    routeButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    routeTier.textContent = data.tier;
    routeModel.textContent = data.model;
    routeReason.textContent = data.reason;
    routeResult?.classList.remove("is-changing");
    requestAnimationFrame(() => routeResult?.classList.add("is-changing"));
  });
});

const metricNumbers = [...document.querySelectorAll("[data-count]")];
if ("IntersectionObserver" in window && !reduceMotion) {
  const metricObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const element = entry.target;
      const target = Number(element.dataset.count);
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / 650, 1);
        element.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      metricObserver.unobserve(element);
    }
  }, { threshold: 0.75 });
  metricNumbers.forEach((metric) => metricObserver.observe(metric));
}

if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll("[data-tilt]").forEach((stage) => {
    const target = stage.querySelector(".product-window") || stage;
    stage.addEventListener("pointermove", (event) => {
      const rect = stage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      stage.style.setProperty("--ry", `${x * 4.5}deg`);
      stage.style.setProperty("--rx", `${y * -4.5}deg`);
    });
    stage.addEventListener("pointerleave", () => {
      stage.style.setProperty("--ry", "0deg");
      stage.style.setProperty("--rx", "0deg");
    });
  });
}
