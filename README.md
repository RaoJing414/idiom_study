# 成语学习助手 (Idiom Study Assistant) `v0.0.2`

一个基于 React 19 + TypeScript 构建的高颜值、功能完备的成语学习应用。本项目采用现代化的前端架构，通过 PWA、IndexedDB 等技术，完美模拟了一个具备完整“后端+数据库”逻辑的离线 Web 应用。

---

## 📖 项目功能说明书

### 1. 核心定位

本项目旨在利用纯前端技术栈，为用户提供一个无需联网、响应极速、且具备完整数据库持久化能力的成语学习工具。它通过 PWA 技术实现了真正的“全离线”运行，适合碎片化学习与知识巩固。

### 2. 功能模块详解

#### 🏠 智能统计首页 (Dashboard)

- **多维数据洞察**：实时显示“已掌握”、“学习中”及“错题集”的数量。
- **动态学习计划**：支持按成语使用频率（重点、常见、一般）进行分类学习，并按“组”自动分配每日任务。
- **高颜值交互**：基于毛玻璃特效 (Glassmorphism) 打造的现代化卡片式布局。

#### 📖 浸入式学习系统 (Learning System)

- **沉浸式卡片**：采用细腻的流畅动画，支持“思考-查看”交互逻辑，默认隐藏释义以强化记忆。
- **进度标记**：支持手动标记“掌握/未掌握”，系统会实时同步至底层数据库。
- **自动播放**：内置自动显示模式，方便用户进行快速闪视复习。

#### 📝 闭环自测系统 (Quiz Engine)

- **双向考查逻辑**：提供“看成语选释义”与“看释义选成语”两种模式。
- **智能干扰项生成**：基于算法从词库中动态抽取相似干扰项，确保测试具备挑战性。
- **即时反馈**：答题过程伴有明显的对错视觉反馈，并实时更新错题数据库。

#### ❌ 动态错题集 (Smart Error Collection)

- **自动归档**：系统精准抓取测试中的错题并自动进入“待巩固”名单。
- **动态消项**：用户在针对性复习并重新答对后，系统会自动将其移出，实现学习闭环。

---

## 🏗️ 项目技术架构

### 1. 技术栈清单 (Tech Stack)

- **核心框架**: [React 19](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) (确保代码健壮性与类型安全)
- **构建工具**: [Vite 7](https://vitejs.dev/) (极致的构建速度与 HMR 体验)
- **状态及路由**: [React Router 7](https://reactrouter.com/) (现代化的多页面导航)
- **动画引擎**: [Framer Motion](https://www.framer.com/motion/) (构建丝滑的 UI 动效)
- **持久化方案**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (使用 `idb` 库封装，替代传统移动端 API)
- **样式方案**: Vanilla CSS (CSS Variables) + [Lucide React](https://lucide.dev/) (矢量图标库)
- **PWA 支持**: `vite-plugin-pwa` (Service Worker 策略、离线缓存、 manifest 配置)

### 2. 核心架构设计

- **API 模拟层 (`/src/api`)**: 封装了所有业务逻辑。虽然运行在前端，但其设计模式遵循后端 Controller/Service 结构，方便未来无缝迁移到真实的服务器 API。
- **数据持久化层 (`/src/db`)**: 基于 IndexedDB 构建。相比 LocalStorage，它具备更大的存储空间和异步读写特性，能够支承起本项目复杂的自测数据存储。
- **响应式布局**: 全面适配 iOS/Android 移动端屏幕，提供接近原生应用 (Native App) 的手感。

---

## 📂 项目结构指南

```text
idiom-study-react/
├── src/
│   ├── api/            # 业务接口逻辑：模拟后端 API，包含进度管理与学习统计
│   ├── db/             # 数据存储层：IndexedDB 的初始化、版本升级及 CRUD 原子操作
│   ├── data/           # 静态词库：内置 100+ 核心成语 JSON 数据
│   ├── pages/          # 视图层：Home, Study, Quiz, WrongCollection 等功能页面
│   ├── components/     # UI 组件：全局布局 (MainLayout)、通用原子组件等
│   ├── router/         # 路由系统：配置项目导航与环境路径 (basename)
│   ├── types/          # 类型系统：定义 Idiom, Progress 等核心领域模型
│   ├── assets/         # 静态资源：样式表与图片资源
│   └── main.tsx        # 入口文件：注册 Service Worker 与初始化 React 渲染
├── public/             # 静态发布资源：Icon, Favicon 及 Web Manifest
├── vite.config.ts      # 构建配置：PWA 策略、Base 路径及打包参数
└── package.json        # 依赖管理及工程化脚本
```

---

## 🚀 部署与开发指南

### 方式一：线上部署 (Production)

```bash
pnpm install
pnpm run build   # 执行 TypeScript 类型检查与 Vite 打包
pnpm run deploy  # 自动部署至 GitHub Pages (通过 gh-pages 脚本)
```

#### 🌐 GitHub Pages 部署详解

为了确保项目能顺利在 GitHub Pages 上运行，我们需要注意以下配置：

1. **Vite 基础路径 (Base Path)**:
   在 `vite.config.ts` 中，`base` 必须设置为你的仓库名称。例如：

   ```ts
   base: "/idiom_study/";
   ```

   这确保了打包后的 JS/CSS 资源路径能正确指向子目录。

2. **路由模式兼容性 (HashRouter)**:
   由于 GitHub Pages 不支持传统的内置后端重定向（SPA 路径在刷新页面时会报 404），本项目已切换为 **`createHashRouter`**。

   - **优势**: URL 会变为 `.../#/study` 形式，这种路径完全由前端控制，在 GitHub Pages 刷新也不会丢失。

3. **自动化部署流程**:
   项目使用了 `gh-pages` 依赖项。运行 `pnpm run deploy` 时：

   - 自动执行 `predeploy` (即 `pnpm run build`)。
   - 将 `dist` 目录内容强行推送到远程仓库的 `gh-pages` 分支。

4. **GitHub 仓库后台设置**:
   - 打开 GitHub 仓库 -> **Settings** -> **Pages**。
   - 在 **Build and deployment** -> **Branch** 下，选择 `gh-pages` 分支，目录选择 `/ (root)`。
   - 保存后，稍等几分钟即可通过 GitHub 生成的链接访问。

### 方式二：局域网/本地运行 (Development & LAN)

如果你想在同一 Wi-Fi 环境下用手机访问：

```bash
pnpm run dev --host
```

- **Local**: `http://localhost:5173/`
- **Network**: `http://[你的内网IP]:5173/` (在手机浏览器打开该地址，并选择“添加到主屏幕”)

_提示：保持手机与电脑在同一 Wi-Fi，通过扫描终端输出的 IP 即可在手机上像使用原生 App 一样复习成语。_

---

## 🔧 PWA 版本更新说明

项目配置了自动更新检测逻辑。当你在 GitHub 发送新版本时：

1. 本地应用会每小时自动检查更新。
2. 发现新代码时，会提示用户“点击刷新”。
3. 自动执行 `cleanupOutdatedCaches`，确保新旧版本资源不冲突。

---

---

## �️ 下一步开发计划 (Roadmap)

- [ ] **🔊 语音朗读功能 (TTS)**：集成浏览器语音合成接口，支持成语真人口语朗读。
- [ ] **🏆 勋章与成就系统**：增加连续学习天数统计，激励用户养成学习习惯。
- [ ] **☁️ 数据云同步**：虽然是全离线应用，但计划新增“导出/导入”或 WebDAV 同步，防止跨设备数据丢失。
- [ ] **🌗 深色模式/主题定制**：支持跟随系统自动调节主题色。
- [ ] **🔍 搜索扩展**：在词库页增加实时搜索，快速查询特定成语。

---

_本项目展示了如何在 100% 离线和免费托管的情况下，构建出具备完整交互逻辑与高性能标准的高质量 Web 应用。_
