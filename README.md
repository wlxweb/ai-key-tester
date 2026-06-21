<p align="center">
  <h1 align="center">🔑 AI Key Tester</h1>
  <p align="center">17+ AI 厂商 API Key 秒级连通性测试工具</p>
  <p align="center">
    <strong>纯浏览器端运行 · 零数据上传 · 零成本测试</strong>
  </p>
  <p align="center">
    <a href="https://wlxweb.github.io/ai-key-tester/">🌐 在线预览</a>
    ·
    <a href="#快速开始">🚀 快速开始</a>
    ·
    <a href="#支持的厂商">📋 支持厂商</a>
  </p>
</p>

---

## 这是什么

一个浏览器端运行的 AI API Key 连通性测试工具。支持 17+ 国内外主流 AI 厂商，覆盖 OpenAI / Anthropic / Gemini 三种 API 协议。选择厂商 → 填入 Key → 一键测试，秒出结果。

## 核心特性

- **17+ 厂商内置** — OpenAI、Anthropic、Gemini、DeepSeek、智谱、通义千问、月之暗面、百川、阶跃星辰、MiniMax、零一万物、硅基流动、Groq、Together、OpenRouter、Ollama，外加自定义兼容模式
- **三种 API 协议** — OpenAI 兼容 (`/v1/chat/completions`)、Anthropic (`/v1/messages`)、Gemini (`generateContent`)，可手动切换
- **完全本地运行** — 不收集、不保存、不上传任何 Key 或测试数据，所有请求从浏览器直接发出
- **零成本测试** — 仅发送 `"hi" (max_tokens=5)`，几乎零费用
- **自动检测模型** — 对于 OpenAI 兼容接口，自动请求 `/models` 获取可用模型列表
- **实时统计** — 测试次数、成功率、平均延迟一目了然
- **自定义 Base URL** — 适配各类代理、中转、私有部署

## 支持的厂商

| 分类 | 厂商 | 协议 | 默认 Base URL |
|------|------|------|--------------|
| 国际 | OpenAI | OpenAI | `api.openai.com/v1` |
| 国际 | Anthropic | Anthropic | `api.anthropic.com/v1` |
| 国际 | Google Gemini | Gemini | `generativelanguage.googleapis.com` |
| 国内 | DeepSeek | OpenAI | `api.deepseek.com/v1` |
| 国内 | 智谱 AI | OpenAI | `open.bigmodel.cn/api/paas/v4` |
| 国内 | 通义千问 | OpenAI | `dashscope.aliyuncs.com/compatible-mode/v1` |
| 国内 | 月之暗面 | OpenAI | `api.moonshot.cn/v1` |
| 国内 | 百川智能 | OpenAI | `api.baichuan-ai.com/v1` |
| 国内 | 阶跃星辰 | OpenAI | `api.stepfun.com/v1` |
| 国内 | MiniMax | OpenAI | `api.minimax.chat/v1` |
| 国内 | 零一万物 | OpenAI | `api.lingyiwanwu.com/v1` |
| 中转 | 硅基流动 | OpenAI | `api.siliconflow.cn/v1` |
| 中转 | Groq | OpenAI | `api.groq.com/openai/v1` |
| 中转 | Together AI | OpenAI | `api.together.xyz/v1` |
| 中转 | OpenRouter | OpenAI | `openrouter.ai/api/v1` |
| 本地 | Ollama | OpenAI | `localhost:11434/v1` |
| — | 自定义 | 可选 | 自由输入 |

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/ai-key-web.git
cd ai-key-web

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Vue 3 + TypeScript |
| 构建 | Vite 8 |
| 样式 | Tailwind CSS 4 |
| 图标 | Lucide Vue |
| 状态 | Pinia |
| 组件 | Radix Vue / Reka UI |

## 隐私说明

**本工具 100% 在浏览器本地运行：**

- ❌ 不收集任何 API Key
- ❌ 不上传任何测试数据
- ❌ 不使用任何后端服务器
- ❌ 不记录任何使用日志

所有 API 请求直接从你的浏览器发往对应厂商的服务器，完全绕过任何第三方。

## 使用方式

### 1. 选择厂商
在下拉菜单中选择 AI 厂商，Base URL 会自动填充。

### 2. 填入 API Key
输入你的 API Key（支持剪贴板一键粘贴）。Key 仅存储在浏览器内存中，关闭页面即清除。

### 3. 选择模型
从内置模型列表中选择，或点击「检测模型」自动拉取 `/models` 接口获取可用模型。

### 4. 开始测试
点击绿色按钮，工具会发送一条极短的测试请求（`"hi"`, `max_tokens=5`）验证连通性。

### 切换协议
默认使用厂商原生协议。你也可以手动切换为其他协议进行测试——比如用 OpenAI 协议测试 Anthropic 厂商的中转接口。

## 自定义模式

选择「自定义 (OpenAI 兼容)」厂商，可自由填入任意 Base URL，适配：
- 第三方代理 / 中转服务
- 私有化部署的 API 网关
- 任何 OpenAI 兼容接口

## 目录结构

```
src/
├── App.vue              # 主页面，全部 UI 逻辑
├── style.css            # 全局样式 & CSS 变量
├── lib/
│   ├── api-test.ts      # API 测试核心逻辑（三协议支持）
│   └── providers.ts     # 17+ 厂商配置数据
├── assets/              # 静态资源
└── main.ts              # 应用入口
```

## License

MIT
