import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createReadStream, existsSync, mkdirSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { chromium } from "playwright-core";

const site = normalize(new URL(".", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const outputs = normalize(join(site, "..", "outputs"));
mkdirSync(outputs, { recursive: true });

const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

const server = createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const relative = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const file = normalize(join(site, relative));
  if (!file.startsWith(site) || !existsSync(file)) {
    res.writeHead(404).end("Not found");
    return;
  }
  res.writeHead(200, { "Content-Type": mime[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  headless: true
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await page.locator(".hero-copy h1").waitFor();
  await page.locator(".art-card img").first().evaluate((image) => image.decode());
  await page.waitForTimeout(1200);
  await page.screenshot({ path: join(outputs, "chromatic-desktop.png") });

  const initialTitle = await page.locator("#activeTitle").innerText();
  await page.getByRole("button", { name: "下一件作品" }).click();
  await page.waitForTimeout(850);
  assert.notEqual(await page.locator("#activeTitle").innerText(), initialTitle, "作品轮换后名称要同步");
  assert.match(await page.locator(".art-card img").first().getAttribute("src"), /chromatic-02\.webp$/);

  const scrollTarget = await page.evaluate(() => {
    const section = document.querySelector(".experience");
    window.scrollTo(0, (section.offsetHeight - innerHeight) * 0.84);
    return (section.offsetHeight - innerHeight) * 0.84;
  });
  assert.ok(scrollTarget > 0);
  await page.waitForTimeout(800);
  assert.ok(Number(await page.locator("#experienceStage").evaluate((node) => getComputedStyle(node).getPropertyValue("--p"))) > 0.72);
  await page.screenshot({ path: join(outputs, "chromatic-expanded.png") });

  await page.locator("#themeToggle").focus();
  await page.keyboard.press("Enter");
  assert.equal(await page.locator("html").getAttribute("data-theme"), "dark");
  assert.equal(await page.locator("#themeToggle").getAttribute("aria-pressed"), "true");
  await page.waitForTimeout(520);
  await page.evaluate(() => document.activeElement.blur());
  await page.screenshot({ path: join(outputs, "chromatic-dark.png") });

  await page.locator("#themeToggle").click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(350);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: join(outputs, "chromatic-mobile.png") });
  await page.locator("#nexcorework").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(outputs, "chromatic-workbench-mobile.png") });

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator("#collection").scrollIntoViewIfNeeded();
  await page.waitForTimeout(350);
  await page.screenshot({ path: join(outputs, "chromatic-collection.png") });

  const workbench = page.locator("#nexcorework");
  await workbench.scrollIntoViewIfNeeded();
  await workbench.locator("img").first().evaluate((image) => image.decode());
  assert.match(await page.locator(".workbench-version").innerText(), /2\.3\.0/);
  assert.match(await page.locator(".workbench-download").getAttribute("href"), /Setup-2\.3\.0\.exe$/);
  await page.waitForTimeout(350);
  await page.screenshot({ path: join(outputs, "chromatic-workbench.png") });

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator("#experienceStage").evaluate((node) => getComputedStyle(node).getPropertyValue("--p").trim()), "0");
  assert.ok(await page.locator(".hero-copy h1").isVisible());

  await page.goto(`http://127.0.0.1:${port}/android.html`, { waitUntil: "networkidle" });
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.locator('a[href*="2.3.0"]').count() > 0);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.screenshot({ path: join(outputs, "chromatic-android.png") });
  assert.deepEqual(errors, [], `控制台或页面出现错误：${errors.join(" | ")}`);

  console.log(JSON.stringify({
    passed: true,
    checks: [
      "首屏图片解码完成",
      "整套作品轮换并同步名称",
      "滚动进度驱动卡片展开",
      "键盘可切换明暗主题",
      "390px 无横向溢出",
      "减少动态偏好回落为静态首屏"
    ],
    screenshots: [
      join(outputs, "chromatic-desktop.png"),
      join(outputs, "chromatic-expanded.png"),
      join(outputs, "chromatic-dark.png"),
      join(outputs, "chromatic-mobile.png"),
      join(outputs, "chromatic-collection.png"),
      join(outputs, "chromatic-android.png"),
      join(outputs, "chromatic-workbench-mobile.png"),
      join(outputs, "chromatic-workbench.png")
    ]
  }, null, 2));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
