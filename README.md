# NexcoreWork 官网

零依赖静态官网，展示 NexcoreWork 的本地优先架构、可核验执行过程、免费模型Auto、工具与知识能力。

当前视觉围绕 NexcoreWork Logo 的嫩绿、薄荷青与湖蓝展开：浅色产品层、浅色执行面板、真实 Windows 与 Android 截图，以及可切换的执行、记忆、存储、视觉、上下文、权限和电脑控制七组架构图。

## 本地预览

```powershell
python -m http.server 8096
```

打开 `http://127.0.0.1:8096`。

## 下载

Windows 与 Android 官网按钮分别指向 GitHub Release `v2.5.9` 的安装资产，下载后可用 `downloads/SHA256SUMS.txt` 核对。

## Android 页面

`android.html` 是独立的 Android 下载与使用说明页，包含 APK 下载二维码、三步连接流程、
手机端真实截图、Noise 端到端加密与权限边界说明。安装包统一发布到
GitHub Release `v2.5.9`，站内 `downloads/` 只保留版本清单与校验文件。

## 素材

- 产品界面为 NexcoreWork 真实截图。
- 产品截图均带固定宽高，首屏图片优先加载，首屏以下图片懒加载。
- 首屏抽象配图由本地 ComfyUI Qwen-Image-2.1 生成，记录在 `assets/manifest.json`。
- 七组核心架构图是可编辑 SVG，产品语义以当前实现为准；电脑控制章节对应 NexcoreCtrlComputer 0.6.0。
- 页面无外部字体和前端依赖，适合直接部署到 GitHub Pages。

## 验收

```powershell
python C:\Users\34274\.agents\skills\ui-alchemy\scripts\preflight_check.py . --platform h5
```

保持 `0 hard / 0 soft`，并在 375、414、768、1440 宽度检查横向溢出、移动导航和图片加载。
