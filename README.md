# NexcoreWork 官网

零依赖静态官网，展示 NexcoreWork 的本地优先架构、可核验执行过程、免费模型Auto、工具与知识能力。

当前视觉为产品优先的大厂风格：浅色信息层、深色执行证据区、真实 Windows 与 Android 截图，以及和桌面软件一致的青蓝配色。

## 本地预览

```powershell
python -m http.server 8096
```

打开 `http://127.0.0.1:8096`。

## 下载

官网按钮指向 GitHub Releases 中的 Windows 安装包与 Android APK。当前版本为 `2.0.0`。

## Android 页面

`android.html` 是独立的 Android 下载与使用说明页，包含 APK 下载二维码、三步连接流程、
手机端真实截图、Noise 端到端加密与权限边界说明。所有安装包统一发布到
`yan-stone-computer/nexcorework-site` 的 `v2.0.0` Release。

## 素材

- 产品界面为 NexcoreWork 真实截图。
- 产品截图均带固定宽高，首屏图片优先加载，首屏以下图片懒加载。
- 页面无外部字体和前端依赖，适合直接部署到 GitHub Pages。

## 验收

```powershell
python C:\Users\34274\.agents\skills\ui-alchemy\scripts\preflight_check.py . --platform h5
```

保持 `0 hard / 0 soft`，并在 375、414、768、1440 宽度检查横向溢出、移动导航和图片加载。
