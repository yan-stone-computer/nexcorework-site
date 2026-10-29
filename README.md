# NexcoreWork 官网

零依赖静态官网，展示 NexcoreWork 的本地优先架构、可核验执行过程、免费模型Auto、工具与知识能力。

当前视觉围绕 NexcoreWork Logo 的嫩绿、薄荷青与湖蓝展开：浅色产品层、深色执行舱、真实 Windows 与 Android 截图，以及可切换的执行、记忆、存储、视觉、上下文和权限六组架构图。

## 本地预览

```powershell
python -m http.server 8096
```

打开 `http://127.0.0.1:8096`。

## 下载

Windows 官网按钮指向 `v2.1.0` Release 中的 `NexcoreWork-Setup-2.1.0.exe`。
本轮未重建 Android APK，Android 下载继续使用已验证的 `2.0.0` 包。

## Android 页面

`android.html` 是独立的 Android 下载与使用说明页，包含 APK 下载二维码、三步连接流程、
手机端真实截图、Noise 端到端加密与权限边界说明。所有安装包统一发布到
`yan-stone-computer/nexcorework-site` 的 `v2.0.0` Release。

## 素材

- 产品界面为 NexcoreWork 真实截图。
- 产品截图均带固定宽高，首屏图片优先加载，首屏以下图片懒加载。
- 首屏抽象配图由本地 ComfyUI Qwen-Image-2.1 生成，记录在 `assets/manifest.json`。
- 六组核心架构图是可编辑 SVG，产品语义以当前实现为准。
- 页面无外部字体和前端依赖，适合直接部署到 GitHub Pages。

## 验收

```powershell
python C:\Users\34274\.agents\skills\ui-alchemy\scripts\preflight_check.py . --platform h5
```

保持 `0 hard / 0 soft`，并在 375、414、768、1440 宽度检查横向溢出、移动导航和图片加载。
