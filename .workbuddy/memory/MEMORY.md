# 项目记忆

## 技术栈
- **ai-key-web**: Vue 3.5 + Vite 8 + TypeScript 6 + Tailwind CSS v4 + shadcn-vue (Reka UI)
- 状态管理: Pinia
- 路由: Vue Router 4
- 图标: Lucide

## 关键配置
- TS 6.0 废弃 `baseUrl`, 路径别名只用 `paths: { "@/*": ["./src/*"] }`
- Tailwind CSS v4 用 `@import "tailwindcss"` 在 CSS 中引入, vite 插件 `@tailwindcss/vite`
- shadcn-vue 初始化: `npx shadcn-vue@latest init -d -b neutral`
- 添加组件: `npx shadcn-vue@latest add <name> -y`

## 项目结构
- `src/components/ui/` — shadcn-vue 组件
- `src/pages/` — 页面: HomePage, AboutPage, ApiTester
- `src/layouts/` — 布局: DefaultLayout
- `src/router/` — 路由配置
- `src/stores/` — Pinia stores
- `src/lib/` — 工具库: utils.ts, providers.ts, api-test.ts

## 已知问题修复
- Sonner.vue: toast-options 与 v-bind="props" 冲突，已删除手动 toast-options
