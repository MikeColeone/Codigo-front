# Codigo 系统设计文档（可维护版）

本目录沉淀当前仓库（monorepo）对应的系统架构与设计基线。所有图稿使用可版本化源码（Mermaid / PlantUML / Draw.io XML）存放在 `.docs/diagrams/`，正文为 Markdown，便于 diff、审阅与 CI 校验。

## 阅读顺序（建议）

1. [总体架构](./architecture/01-overview.md)
2. [部署与运行环境](./architecture/02-deployment.md)
3. [模块拆分与依赖](./modules/01-modules-and-deps.md)
4. [接口设计（REST）](./modules/02-api-rest.md)
5. [核心流程时序](./modules/03-sequences.md)
6. [用例与用例规约](./use-cases/01-use-case-model.md)
7. [数据流（DFD）与数据字典](./data/01-dfd.md)
8. [ER 图与数据模型（表结构）](./data/02-er-and-schema.md)
9. [非功能性设计](./nfr/01-nfr-index.md)
10. [架构决策记录（ADR）](./adr/README.md)
11. [评审与验收流程](./review/01-architecture-review.md)
12. [E2E 自动化测试计划](./qa/01-e2e-plan.md)

## 目录结构

- `architecture/`：总体架构、部署拓扑、运行环境与容灾/扩缩容策略
- `modules/`：模块边界、接口设计、关键业务流程时序图、依赖矩阵
- `use-cases/`：系统级用例图与用例规约
- `data/`：DFD、数据字典、ER 图、表字段与索引/分区/备份策略
- `nfr/`：性能、安全、可观测性、可维护性与发布回滚策略
- `adr/`：Architecture Decision Records（架构决策记录）
- `diagrams/`：所有图稿源码（`.mmd` / `.puml` / `.drawio` / `.xml`）
- `review/`：架构评审与验收流程与模板
- `qa/`：端到端测试计划与验收基线

## 文档与代码一致性原则

- 模块边界与依赖方向以仓库规则为准：`apps/*` 可依赖 `packages/*`，`packages/*` 禁止依赖 `apps/*`。
- 数据字段与表结构以 `apps/server` 的 TypeORM 实体定义为准；本目录会对“当前实现”与“目标建议”做显式区分，避免误把建议当现状。
- 接口定义以 `apps/server` 的 Controller 路由为准；如存在历史兼容接口（Legacy），会单独标注并给出淘汰策略。

## 维护与更新记录

- 责任人：`<owner>`（请在落地时填入团队/个人）
- 更新频率：接口/字段/模块边界发生变化时必须同步更新对应文档；新增重大决策需补 ADR。
- 变更检查：见根脚本 `pnpm docs:check`（链接/引用/代码块校验）与 `pnpm changes:gate`（变更门禁）。
  - 文档写作规范：见 [STYLE_GUIDE.md](./STYLE_GUIDE.md)
