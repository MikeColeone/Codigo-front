# ADR（Architecture Decision Records）

本目录用于记录“重要架构决策”的背景、方案对比、结论与后续影响，确保可追溯、可复用、可审计。

## 使用规范

- 命名：`NNNN-<slug>.md`（NNNN 从 0001 递增）
- 写法：使用模板 [`template.md`](./template.md)
- 状态：Proposed / Accepted / Deprecated / Superseded
- 触发：当出现以下情况必须写 ADR
  - 架构风格调整（拆服务/改通信协议/引入新中间件）
  - 关键数据模型调整（表结构、索引、分区、归档）
  - 安全/合规策略变更（鉴权、密钥、审计）
  - 发布/回滚策略变更

## 索引

- [0001 - 后端采用模块化单体（NestJS）](./0001-modular-monolith-backend.md)
- [0002 - 页面发布数据模型与版本快照](./0002-page-release-and-versioning.md)
- [0003 - WebIDE 工作区：文件与数据库一致性策略](./0003-workspace-file-db-consistency.md)

