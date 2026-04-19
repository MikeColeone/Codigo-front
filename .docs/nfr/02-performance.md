# 9.1 性能设计

## 9.1.1 性能目标（建议基线）

说明：以下为“推荐目标”，需要在真实硬件与真实数据规模上通过压测校准，并在 ADR 中固化最终 SLA/SLO。

- API（读）：P95 ≤ 200ms（不含网络），P99 ≤ 500ms
- API（写：发布/更新）：P95 ≤ 800ms，P99 ≤ 1500ms（受事务与数据量影响）
- 发布访问（public 页面）：P95 ≤ 300ms（服务端），前端首屏渲染 ≤ 2s（典型网络）
- 并发建议目标（初版）：
  - `GET /api/pages/:id`：≥ 200 RPS（单实例）可用
  - `PUT /api/pages/me`：≥ 20 RPS（单实例）可用
  - WebSocket：单实例同时在线连接数 ≥ 2k（视机器配置与消息频率）

## 9.1.2 性能瓶颈分析（按链路）

- **发布读取链路**（`GET /pages/:id`）：
  - 主要成本：按 page_id 拉取 component 全量 + JSON 解析/组装。
  - 优化方向：组件表按 `page_id` 索引；引入发布数据缓存（Redis）与失效策略。
- **发布写入链路**（`PUT /pages/me`）：
  - 主要成本：事务内 upsert page + 扁平化批量写 component + 写 page_version 快照。
  - 优化方向：批量写入（bulk insert/update）、减少无效 diff 写入、版本快照压缩或分离存储。
- **实时协同链路**（Socket.io）：
  - 主要成本：广播风暴（频繁 diff）、跨房间用户列表维护、单实例内存状态。
  - 优化方向：diff 合并/节流；多实例时使用 Redis adapter；必要时对大 payload 做压缩与采样。

## 9.1.3 压测方案（可执行）

### 场景覆盖

1. 读多：匿名访问 public 页面（发布端/前端）
2. 写多：发布页面（含版本快照）
3. 混合：页面列表 + 发布读取 + 协作成员查询
4. WebSocket：并发连接 + 周期性 component_update 广播

### 工具建议

- HTTP：k6 / wrk / autocannon（二选一即可）
- WebSocket：k6 websocket / 自研脚本（Node.js + socket.io-client）
- DB：慢查询日志 + explain + performance_schema

### 基准数据与记录模板

建议在 `.docs/nfr/benchmarks/` 下建立记录表（本仓库先提供模板，实际压测数据由 CI/测试环境产出后回填）。

- 测试环境规格：
  - CPU / 内存 / 磁盘类型
  - Node/DB/Redis 版本
  - 网络带宽与延迟
- 数据规模：
  - page 数量、平均 component 数量、page_version 数量
- 指标：
  - 吞吐（RPS）、延迟（P50/P95/P99）、错误率
  - CPU/内存/GC、DB 连接数、慢查询

## 9.1.4 数据库性能优化策略（建议）

- 必备索引：见 [ER 与数据模型](../data/02-er-and-schema.md) 的索引建议。
- 读写分离：发布读取走只读副本；写入走主库。
- 大表治理：
  - `page_version`：按 page_id 分片或按时间归档/分区；
  - `operation_log`：按时间分区与归档，保留周期纳入合规要求。

## 9.1.5 缓存与一致性（建议）

- 缓存对象：
  - public 页面发布数据（page + components 拼装结果）
  - 模板列表与模板详情（按版本失效）
- 失效策略：
  - 发布页面成功后，主动删除对应缓存 key；
  - 保底 TTL（短 TTL，防止冷门页面缓存长期占用）。

