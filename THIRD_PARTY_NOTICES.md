# 第三方软件与模型说明

Whisper Web 自有源码采用 MIT License。以下项目仍适用各自的许可证；本文件不替代上游许可证正文。

| 组件 | 当前版本或来源 | 许可证 | 用途 |
| --- | --- | --- | --- |
| Transformers.js | `@huggingface/transformers@3.8.1` | Apache-2.0 | 浏览器中的 Whisper 模型加载与推理 |
| Mediabunny | `mediabunny@1.55.2` | MPL-2.0 | 浏览器媒体容器分析、解码与输出 |
| Mediabunny MP3 Encoder | `@mediabunny/mp3-encoder@1.55.2` | MPL-2.0 | 连接浏览器媒体管线与 LAME WASM 编码器 |
| LAME MP3 Encoder | 3.100，由 MP3 encoder 包提供 WASM 构建 | LGPL | MP3 编码 |
| Phosphor Icons | `@phosphor-icons/react@2.1.10` | MIT | 用户界面图标 |
| Next.js | `next@16.3.2` | MIT | 应用框架与静态导出 |
| React | `react@19.2.8`、`react-dom@19.2.8` | MIT | 用户界面运行时 |

## Whisper 模型

仓库不分发模型权重。运行时使用以下 Hugging Face 模型仓库：

- `onnx-community/whisper-tiny`
- `onnx-community/whisper-base`
- `onnx-community/whisper-small`

这些 ONNX 仓库源自对应的 OpenAI Whisper 模型。部署者和使用者应以下载时的 Hugging Face 模型卡、仓库文件及许可证为准。

## 完整依赖清单

安装依赖后可运行：

```bash
pnpm licenses list
```

依赖升级时应同步复核本文件、上游许可证和浏览器构建中实际分发的组件。
