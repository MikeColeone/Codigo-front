# 0002. 页面发布数据模型与版本快照

- 状态：Accepted
- 日期：2026-04-19
- 相关模块：apps/server（Flow 域）、apps/client、packages/release

## 背景与问题

系统需要支持：

- 编辑器生成页面 schema（组件树 + 页面设置）
- 发布后可通过链接访问（public/private + 过期）
- 版本历史可回滚/对比（至少支持“应用历史版本覆盖当前画布”）

挑战点：
- 发布数据需要高效读取（发布端/匿名访问）
- 发布过程需要强一致性（page/component/version 在同一发布事务内）

## 备选方案

### 方案 A：page 表存 rootIds，component 表存扁平化节点，发布时生成 page_version 快照

- 描述：
  - `page.components` 存根节点列表（simple-array）
  - `component` 表存扁平化节点（node_id/parent_node_id/slot/options/styles/meta）
  - 发布时写入 `page_version.schema_data` 作为快照
- 优点：
  - 读取可按 page_id 拉取组件并在服务端拼装；
  - 版本快照可直接用于回滚；
  - 与编辑器的组件树结构匹配。
- 缺点：
  - component 写入频繁，需要索引与批量写优化；
  - page_version 快照体积可能膨胀，需要归档策略。

### 方案 B：发布数据以单 JSON 文档存储（仅 page 表一个 JSON 字段）

- 优点：写入简单、读取一次 IO。
- 缺点：难以做细粒度查询/治理；版本管理与差异分析成本高；对后台统计不友好。

## 决策

选择方案 A（当前实现）。

并补充约束：
- `page_version(page_id, version)` 应建立唯一约束；
- `component(page_id, node_id)` 应建立索引/唯一约束；
- public 页面读取可以引入缓存与失效机制。

## 影响与后果

- 数据模型：
  - 多表写入与事务一致性成为发布链路的核心要求；
  - 需要治理 `page_version` 的增长（归档/分区/保留周期）。
- 后台治理：
  - 可基于 component 表统计组件使用情况与治理（删除、统计）。

