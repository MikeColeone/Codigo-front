# 文档规范（Markdown）

## 写作风格

- 遵循《中文技术文档写作风格指南》：术语统一、标点统一、句子短、少口语化。
- 首次出现的缩写必须给出全称（例如：SLA/SLO、DFD、ER）。
- “现状（As-Is）”与“建议（To-Be）”必须显式标注，避免把建议当成已实现。

## 术语与命名（建议统一）

- 应用：client（编辑器）、admin（后台管理）、server（后端 API）、ide（WebIDE 外壳）、release（发布端）
- 模块：User/Flow/Template/Resources/Admin
- 数据库：MySQL（主库/只读副本）
- 缓存：Redis
- 协同：Socket.io（namespace `/collaboration`）

## Markdown 约定

- 统一使用 ATX 标题（`#` / `##` / `###`）
- 表格字段名使用代码中的实际命名（如 `page_id`、`expire_at`）
- 代码块必须注明语言：`ts`/`json`/`bash`/`mermaid`/`plantuml`
- 链接使用相对路径；禁止 `file:///` 本地链接

## 图稿约定

- 图稿源码必须落在 `.docs/diagrams/`
- 正文嵌入图时：
  - 先给出“图稿源码链接”
  - 再粘贴源码（便于在 Git 平台自动渲染）

