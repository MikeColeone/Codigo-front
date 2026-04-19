# 9.3 可观测性设计（Metrics / Tracing / Logging）

目标：让“性能退化、错误激增、越权尝试、协作异常”可被快速定位与回溯。

## 9.3.1 Logging 规范

### 日志格式（建议）

- 结构化 JSON（单行）
- 统一字段：
  - `timestamp`、`level`、`service`、`env`
  - `request_id`（HTTP）/ `socket_id`（WS）
  - `user_id`（可选，脱敏策略下可 hash）
  - `path`、`method`、`status`、`latency_ms`
  - `error_code`（业务 code）、`error_name`、`stack`（仅非生产或采样）

### 脱敏规则

- 严禁输出：JWT、密码、短信验证码、密钥、DB 连接串、表单提交的敏感字段。
- 手机号脱敏：`138****1234`；token 只保留前后 3-4 位。

## 9.3.2 Metrics 指标体系（建议）

### HTTP 指标

- `http_requests_total{method,path,status}`：请求数
- `http_request_duration_ms_bucket{method,path}`：延迟直方图
- `http_errors_total{code,status}`：错误数（业务 code 与 HTTP status）

### DB 指标

- `db_query_duration_ms_bucket{entity,operation}`：查询耗时
- `db_connections{state}`：连接池状态
- 慢查询：开启 MySQL slow log，集中收集并告警

### WebSocket 指标

- `ws_connections{namespace}`：当前连接数
- `ws_messages_total{event}`：消息数
- `ws_broadcast_fanout`：广播扇出（用于发现广播风暴）

## 9.3.3 Tracing（链路追踪）

建议引入 OpenTelemetry（OTel）：

- HTTP：为每个请求生成 trace/span，并串联 DB 查询 span；
- WebSocket：为关键事件（join_room/component_update/toggle_lock）生成 span；
- 传播：`traceparent` header（HTTP）/ connect query（WS 可选）。

## 9.3.4 Grafana Dashboard 示例（字段与面板建议）

建议按 4 类 Dashboard：

1. **API 概览**：RPS、P95/P99、错误率、Top N 慢接口
2. **发布读取**：`GET /pages/:id` 的命中率（缓存）、DB 查询耗时、组件数量分布
3. **发布写入**：`PUT /pages/me` 的耗时分解（page/component/version）
4. **协同**：在线连接数、事件吞吐、广播扇出、异常断连

告警规则示例（PromQL 伪例）：

- API 错误率：
  - 5m 错误率 > 1%：`sum(rate(http_errors_total[5m])) / sum(rate(http_requests_total[5m])) > 0.01`
- 延迟退化：
  - P95 > 500ms 持续 10m：基于直方图计算 quantile
- 协同异常：
  - `ws_connections` 突降或 `ws_messages_total` 突增（广播风暴）

## 9.3.5 运行手册（Runbook 摘要）

- 接口 5xx 激增：
  1. 先看 Top N path 与错误码分布；
  2. 检查 DB 慢查询与连接池；
  3. 回滚最近发布或降级非关键功能。
- 发布耗时变长：
  1. 看 `PUT /pages/me` 事务耗时分解；
  2. 检查 component 写入是否无效重复写；
  3. 检查 page_version 快照体积与序列化耗时。

