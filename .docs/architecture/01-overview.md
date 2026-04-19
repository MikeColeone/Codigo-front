# 1. 总体架构设计

## 1.1 架构图（系统交互与组件拓扑）

图稿源码：[`architecture-system.mmd`](../diagrams/architecture-system.mmd)

```mermaid
flowchart LR
  subgraph U[外部参与者]
    endUser[终端用户<br/>（浏览器）]
    adminUser[管理员<br/>（浏览器）]
    collaborator[协作者<br/>（浏览器）]
  end

  subgraph FE[前端应用（Vite / Next）]
    clientApp[apps/client<br/>编辑器 & 工作台]
    adminApp[apps/admin<br/>后台管理前端]
    releaseApp[packages/release<br/>发布端（Next.js）]
    ideApp[apps/ide<br/>WebIDE 外壳（OpenSumi）]
  end

  subgraph BE[后端（NestJS）]
    api[apps/server<br/>REST API / WebSocket]
    ws[/Socket.io Namespace<br/>/collaboration/]
  end

  subgraph DATA[数据与中间件]
    mysql[(MySQL<br/>codigo_lowcode)]
    redis[(Redis)]
  end

  subgraph EXT[第三方服务]
    oss[(Ali OSS)]
    sms[(短信/验证码服务)]
  end

  endUser -->|HTTP(S)| releaseApp
  adminUser -->|HTTP(S)| adminApp
  collaborator -->|HTTP(S)| clientApp
  endUser -->|HTTP(S)| clientApp
  collaborator -->|WebSocket| ws

  clientApp -->|REST /api/*| api
  adminApp -->|REST /api/admin/*| api
  releaseApp -->|REST /api/pages/:id| api
  ideApp -->|REST /api/pages/:id/workspace/*| api

  api --> ws
  api -->|TypeORM| mysql
  api -->|ioredis| redis
  api -->|SDK| oss
  api --> sms
```

## 1.2 架构风格与选型理由

### 后端：模块化单体（Modular Monolith）

- 架构形态：单 NestJS 应用内按业务域划分模块（User / Flow / Template / Resources / Admin），由统一网关进程承载 REST + WebSocket。
- 选型理由：
  - 对当前业务阶段更易落地：跨域一致的鉴权、异常处理、响应规范统一收口。
  - 与 TypeORM 的单库事务能力结合，能覆盖页面发布/版本快照等强一致性写入场景。
  - 未来可按模块拆分为服务：边界在代码层已分离，具备演进空间（详见 ADR）。

### 前端：多应用并存（Multi-SPA + 发布端）

- `apps/client`：面向编辑器/工作台的核心交互（Vite + React）。
- `apps/admin`：面向系统管理（RBAC、审计、数据治理）的后台前端（Vite + React）。
- `packages/release`：发布端消费层（Next.js），面向访问者读取发布数据进行渲染。
- `apps/ide`：WebIDE 外壳（OpenSumi），通过后端 workspace API 操作“页面源码工作区”。
- 选型理由：将“编辑体验”和“系统管理”解耦，避免后台能力侵入编辑器域；发布端独立以利于 SEO/SSR/性能优化。

### Monorepo：分层包复用

- `apps/*`：可运行应用（Runtime）。
- `packages/*`：跨应用复用的协议/运行时/工具（Libraries）。
- 单一事实源：跨端协议与类型收口到 `packages/schema`。

## 1.3 关键技术栈与运行环境

以 `package.json` 为准（版本可能随依赖升级变化，此处记录设计基线）。

- 语言与构建：
  - Node.js：建议 LTS（≥ 20）；包管理：pnpm（根指定 `pnpm@10.28.2`）
  - TypeScript：`^5.9.3`（仓库根）
  - Turborepo：`^2.9.3`
- 前端：
  - React：`^19.2.4`
  - Vite：各 app 内部配置（见各自 `package.json`）
  - Next.js：`packages/release`（Next 14）
- 后端：
  - NestJS：`^11.x`
  - TypeORM：`^0.3.28`
  - MySQL 驱动：`mysql2`
  - Redis：`ioredis`
  - WebSocket：`socket.io`（命名空间 `/collaboration`）
  - 对象存储：`ali-oss`

## 1.4 扩缩容与容灾策略（现状 vs 建议）

### 当前实现现状（以代码为准）

- 后端是单进程服务：REST + WebSocket 合并部署在 `apps/server`。
- 数据库采用 MySQL；通过 TypeORM 直接写库。
- Redis 已接入，用于验证码/缓存等能力（以业务使用为准）。

### 建议的生产化策略（To-Be）

- 扩缩容：
  - `apps/server` 做无状态化（会话/验证码等状态放 Redis），水平扩容多个副本。
  - `packages/release` 作为 SSR 应用，可单独扩容（结合 CDN 缓存静态资源）。
- 容灾：
  - MySQL 主从复制 + 定期备份；关键表开启 binlog 并保留一定周期，支持 point-in-time recovery。
  - Redis 主从/哨兵或集群（依据容量与 SLA 决定）。
  - OSS 作为外部持久化存储（附件/图片），开启生命周期策略与跨区域灾备（按成本评估）。

