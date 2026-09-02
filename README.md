# Whisper Web

Whisper Web 是一个在浏览器中本地运行 Whisper 的开源语音转文字工具。媒体解码、模型推理、结果编辑、转录历史和 MP3 转换均在用户设备中完成。

官方网站：[whisperwebfree.com](https://whisperwebfree.com)

维护组织：[Whisper Web on GitHub](https://github.com/whisper-web-online)

## 功能

- 导入本地音频或视频、麦克风录音以及支持 CORS 的媒体直链
- 使用 Whisper Tiny、Base 或 Small 模型进行本地转录
- 支持 WebAssembly 与 WebGPU 推理
- 支持英语、西班牙语和阿拉伯语界面
- 在浏览器 IndexedDB 中保存、搜索和编辑本地历史
- 导出 TXT、JSON、SRT 和 VTT
- 在浏览器中把 MP4、MOV 或 WebM 的主音轨转换为 MP3
- 提供独立的大文件分段转录流程

## 隐私边界

- 本地文件、麦克风录音、转录文本和转换后的 MP3 不会上传到 Whisper Web 应用服务器。
- 浏览器仍需联网下载站点资源、Whisper 模型和 MP3 编码组件。
- 使用媒体直链时，浏览器会直接请求第三方媒体主机。
- 开源版本不内置任何统计平台 ID；未配置环境变量时不会加载统计脚本。
- 如果部署者启用 Microsoft Clarity，根文档会显式屏蔽页面内容，避免文件名和转录文本进入会话回放。

## 本地运行

需要 Node.js 22+ 和 pnpm 10。

```bash
pnpm install
pnpm dev
```

访问 `http://localhost:3000`。

## 验证与构建

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

也可以一次运行完整验证：

```bash
pnpm verify
```

项目使用 Next.js 静态导出，构建结果位于 `out/`。构建固定使用 Webpack，因为当前 Transformers.js Worker 的动态加载路径与默认 Turbopack 不兼容。

## 可选统计配置

所有统计服务默认关闭。复制示例配置后，只填写你自己拥有的项目标识：

```bash
cp .env.example .env.local
```

支持的变量：

```dotenv
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
NEXT_PUBLIC_PLAUSIBLE_SCRIPT_URL=
NEXT_PUBLIC_CLARITY_PROJECT_ID=
```

这些变量会进入浏览器构建，因此只能存放公开项目标识，不能存放 API Token、密码或私钥。

## 模型与第三方软件

仓库不包含 Whisper 模型权重。浏览器会在用户选择模型后从 Hugging Face 下载对应的 ONNX 文件。完整依赖许可与来源见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。

## 安全问题

请不要在公开 Issue 中提交密钥、私人录音或转录内容。安全问题请按照 [SECURITY.md](./SECURITY.md) 私下报告。

## 许可证

Whisper Web 自有源码采用 [MIT License](./LICENSE)。第三方组件和模型继续适用各自的许可证。
