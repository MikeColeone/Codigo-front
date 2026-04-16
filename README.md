# Codigo

Codigo 是一个基于 `pnpm workspace + turbo` 的低代码平台 Monorepo。

当前仓库按“协议层 -> 核心能力层 -> 运行时与应用层”组织，目标是把页面 Schema、组件物料、编辑器、发布端、服务端和嵌入式 IDE 明确拆开，避免双源定义和包边界漂移。

## 仓库目标

- 提供可视化页面编辑能力，由 `apps/client` 承担主编辑器。
- 提供独立后台管理入口，由 `apps/admin` 承担管理端。
- 提供 NestJS 服务端能力，由 `apps/server` 承担认证、页面持久化、协作、发布等能力。
- 提供嵌入式 OpenSumi IDE，由 `apps/ide` 承担代码工作区与文件编辑能力。
- 提供正式发布页运行时，由 `packages/release` 负责消费页面 Schema 并渲染最终页面。
- 保持协议、运行时物料、编辑器展示元信息三者职责分离。

## 架构原则

### 1. 先稳边界，再写功能

- `packages/*` 提供跨应用复用能力。
- `apps/*` 提供独立运行时应用。
- `packages/*` 禁止反向依赖 `apps/*`。
- `apps/client`、`apps/server`、`apps/ide` 之间禁止直接源码依赖。

### 2. 单一事实源

- 组件协议与跨端模型：`packages/schema`
- 组件运行时注册与渲染：`packages/materials`
- 编辑器展示元信息与属性面板映射：`apps/client/src/modules/editor/registry`
- 文件服务上下文协议：`packages/file-service`
- 后端实体定义：`apps/server/src/modules/*/entity`

### 3. shared 只放基础设施

- `apps/client/src/shared` 只放跨业务通用能力。
- 编辑器复杂逻辑必须留在 `apps/client/src/modules/editor` 域内。
- `apps/server/src/shared` 只承接 Redis、OSS、工具函数等基础设施。

### 4. IDE 与 Client 技术栈隔离

- `apps/ide` 是独立运行时，当前使用 React 16 / MobX 5 / Antd 4。
- `apps/client` 是主前端，当前使用 React 19 / MobX 6 / Antd 6 / Tailwind CSS。
- 两者不能共享 React UI 实现，只能通过纯 TypeScript 包或 API 协议协作。

## 仓库结构

```text
codigo/
├─ apps/
│  ├─ admin/            # 独立后台管理前端
│  ├─ client/           # 低代码平台主前端与编辑器
│  ├─ ide/              # OpenSumi 嵌入式 IDE
│  └─ server/           # NestJS 后端
├─ packages/
│  ├─ editor-sandbox/   # 编辑器沙箱代码生成与最小预览输出
│  ├─ file-service/     # IDE/浏览器文件服务上下文适配
│  ├─ materials/        # React 运行时物料库
│  ├─ plugin-system/    # 组件插件注册协议
│  ├─ release/          # 最终发布页运行时
│  ├─ render/           # 渲染与代码生成桥接层
│  ├─ runtime-core/     # 与框架无关的运行时算法
│  ├─ schema/           # 全仓库唯一跨端协议层
│  └─ template/         # 模板与脚手架试验区
└─ .trae/rules/         # 本地协作规则与架构约束
```

## 应用层说明

### `apps/client`

低代码平台主前端，负责页面编辑、应用管理、预览入口和用户侧业务页面。

核心模块：

- `src/app`：应用初始化、布局与路由装配。
- `src/modules/editor`：编辑器核心域，包括画布、左侧物料面板、右侧属性面板、页面管理、权限与发布流程。
- `src/modules/appManagement`：应用管理工作台。
- `src/modules/auth`：登录注册与认证体验。
- `src/modules/flow`：流程编排域。
- `src/shared`：跨业务基础设施，不承接编辑器私有工作流。

### `apps/admin`

独立后台管理前端，负责管理员登录、权限控制、用户管理、页面管理、组件统计等后台能力。

### `apps/server`

NestJS 服务端，负责：

- 用户认证与账号能力
- 页面设计数据持久化
- 页面版本与发布流程
- 协作与实时消息
- 资源上传与资源管理
- 后台管理 API

当前重点模块：

- `src/modules/user`
- `src/modules/resources`
- `src/modules/admin`
- `src/modules/flow`

其中 `flow` 仍是聚合度最高的模块，新需求优先按页面设计、协作、发布、分析等子域拆分，避免继续平铺膨胀。

### `apps/ide`

OpenSumi 嵌入式 IDE 外壳，负责提供 Web IDE 工作区、文件编辑和 WebView 宿主桥接能力。它只应依赖纯协议或适配器能力，例如 `@codigo/file-service`。

## 包层说明

### `@codigo/schema`

跨端协议层，是全仓库唯一共享的数据结构来源，承载：

- 页面 Schema
- 组件树结构
- 请求与响应 DTO
- 协作消息模型
- 跨端领域模型

禁止放入运行时逻辑、UI 配置、接口调用函数和平台特有实现。

### `@codigo/plugin-system`

组件插件注册中心，只负责组件注册协议与默认配置映射，依赖 `@codigo/schema`。

### `@codigo/materials`

React 运行时物料库，提供：

- 低代码组件运行时实现
- 组件注册入口
- 运行时物料查询

这里是组件运行时渲染关系的唯一事实源。编辑器只能补充展示元信息，不能复制运行时注册关系。

### `@codigo/runtime-core`

框架无关的最小运行时算法层，负责 Schema 解析、校验、转换等纯函数逻辑。

### `@codigo/render`

桥接层，组合 `runtime-core` 能力，为客户端与其他消费方提供渲染或代码生成入口，不重复实现完整运行时。

### `@codigo/editor-sandbox`

编辑器沙箱代码生成层，负责最小预览文件生成、沙箱产物输出以及与 OpenSumi 工作区相关的桥接逻辑。

### `@codigo/file-service`

文件服务 API 适配器，负责 `pageId`、`token`、`apiBaseUrl` 等运行上下文的组织与传递。

### `@codigo/release`

最终发布页运行时，基于 `@codigo/materials` 和 `@codigo/schema` 渲染用户可访问页面。

### `@codigo/template`

模板与试验区，不应成为正式业务依赖。如果模板能力稳定，需要迁移到明确职责的正式包中。

## 依赖方向

推荐依赖图如下：

```text
schema <- plugin-system <- materials
schema <- runtime-core <- render
schema <- editor-sandbox
schema <- server
schema + materials <- release
file-service <- ide
schema + materials + render + editor-sandbox <- client
schema <- admin
```

明确禁止的方向：

- `packages/* -> apps/*`
- `materials -> client`
- `schema -> materials`
- `server -> client`
- `ide -> client`

## 编辑器职责边界

`apps/client/src/modules/editor` 是当前前端最重的业务域，职责需要固定在以下范围：

- `api`：编辑器接口封装
- `components/canvas`：画布渲染与交互载体
- `components/header`：顶部工具区
- `components/leftPanel`：物料面板
- `components/rightPanel`：属性、权限与 AI 面板
- `components/pageManager`：页面结构与页面列表
- `components/shell`：编辑器外层布局装配
- `components/LowCodeComponents`：属性面板编辑器
- `registry`：组件分组、图标、属性面板映射等展示元信息

运行时组件实现必须来自 `@codigo/materials`，不能在编辑器侧复制一份运行时注册表。

## 开发环境

### 基础要求

- Node.js 18+
- `pnpm@10`
- MySQL
- Redis

### 工作区安装

```bash
pnpm install
```

## 启动方式

### 1. 启动全部开发任务

```bash
pnpm run dev
```

该命令会通过 Turbo 并行启动工作区内定义了 `dev`、`start:dev`、`start` 的应用，适合联调整体验证。

### 2. 按应用分别启动

```bash
pnpm run run:client
pnpm run run:admin
pnpm run run:server
pnpm run run:ide
pnpm run run:release
```

常见本地端口约定：

- `apps/client`：默认 `http://localhost:5173`
- `apps/admin`：默认 `http://localhost:5174`
- `apps/server`：默认 `http://localhost:3000`
- `apps/ide`：默认 `http://localhost:8081`
- `packages/release`：Next.js 默认开发端口 `http://localhost:3001`

### 3. 构建

```bash
pnpm run build
```

按包或按应用单独构建：

```bash
pnpm run build:schema
pnpm run build:plugin-system
pnpm run build:materials
pnpm run build:render
pnpm run build:editor-sandbox

pnpm run build:client
pnpm run build:admin
pnpm run build:server
pnpm run build:opensumi-app
pnpm run build:release
```

Turbo 已配置 `dependsOn: ["^build"]`，单包构建时会自动先构建其上游依赖。

## 常用质量命令

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
```

只检查应用层：

```bash
pnpm run lint:apps
pnpm run typecheck:apps
```

## 本地联调变量

当前代码中可确认的联调变量如下：

### Client

- `VITE_BASE_URL`：客户端 API 基础地址
- `VITE_ADMIN_URL`：从主前端跳转后台时使用的后台地址
- `VITE_OPENSUMI_IDE_URL`：嵌入式 IDE 地址

### Server

- `PORT`：服务端端口
- `JWT_SECRET`：JWT 密钥
- `SERVER_URL`：服务端对外地址
- `OPENSUMI_IDE_URL`：服务端拼接 IDE 工作区链接时使用
- `APP_KEY`
- `APP_SECRET`
- `APPCODE`
- `ACCESS_KEY_SECRET`
- `SUPER_ADMIN_PHONE`
- `SUPER_ADMIN_USERNAME`
- `SUPER_ADMIN_PASSWORD`

### Release

- `SERVER_URL`：发布端读取页面与提交表单时使用

> 说明：当前服务端数据库和 Redis 仍存在本地默认配置，实际部署前请先检查 `apps/server/src/database/typeorm.config.ts` 与 `apps/server/src/config/index.ts`。

## 协作约束

在这个仓库中开发功能时，默认遵守以下约束：

- 新增跨端类型前，优先检索 `packages/schema/src` 是否已有可复用定义。
- 新增低代码组件时，运行时实现落在 `packages/materials`，编辑器展示元信息补充到 `apps/client/src/modules/editor/registry`。
- `apps/client/src/shared` 不承接单一业务域逻辑，尤其不能继续吞入编辑器重逻辑。
- `apps/server/src/modules/flow` 新能力优先按子域拆 service，而不是继续把职责堆在同一层。
- `apps/ide` 不直接依赖 `apps/client` 的 React UI 组件。

## 推荐阅读顺序

如果你是第一次进入仓库，建议按下面顺序理解代码：

1. `packages/schema`
2. `packages/materials`
3. `apps/client/src/modules/editor`
4. `apps/server/src/modules/flow`
5. `packages/release`
6. `apps/ide`

## 说明

根 `README.md` 以当前仓库真实目录、`package.json` 和工作区脚本为准。如果后续发生架构调整，请同步更新：

- 本文件
- `.trae/rules/project-structure.md`
- `.trae/rules/project_rules.md`
