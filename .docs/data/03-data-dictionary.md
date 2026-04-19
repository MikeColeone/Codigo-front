# 7.x 数据元素字典（字段级）

本字典用于支撑 DFD：为每条数据流标注其数据元素，且字段命名与代码保持一致（以 `apps/server` 实体/DTO 为准）。

## 1) 认证与用户

### User（`user` 表）

| 字段 | 含义 | 类型（TS） | 敏感性 | 来源 |
|---|---|---|---|---|
| id | 用户 ID | number | 低 | TypeORM: User.id |
| username | 用户名 | string | 中 | User.username |
| head_img | 头像 | string \| null | 低 | User.head_img |
| phone | 手机号 | string | 高 | User.phone |
| password | 密码哈希 | string | 高（密） | User.password |
| open_id | 第三方 openId | string | 中 | User.open_id |
| global_role | 全局角色 | GlobalRole | 中 | User.global_role |
| admin_permissions | 权限点数组 | AdminPermission[] \| null | 中 | User.admin_permissions |
| status | 账号状态 | 'active' \| 'frozen' | 中 | User.status |

### JWT（Authorization Bearer Token）

| 字段 | 含义 | 类型 | 敏感性 | 备注 |
|---|---|---|---|---|
| sub / userId | 用户标识 | string/number | 高 | 以实际 sign payload 为准 |
| exp | 过期时间 | number | 中 | 7d |

## 2) 页面与发布

### Page（`page` 表）

| 字段 | 含义 | 类型（TS） | 敏感性 | 来源 |
|---|---|---|---|---|
| id | 页面 ID | number | 低 | Page.id |
| account_id | 所属用户 | number | 中 | Page.account_id |
| page_name | 页面名称 | string | 低 | Page.page_name |
| components | 根节点列表 | string[] | 低 | Page.components（simple-array） |
| schema_version | schema 版本 | number | 低 | Page.schema_version |
| pageCategory | 页面分类 | PageCategory | 低 | Page.pageCategory |
| layoutMode | 布局模式 | PageLayoutMode | 低 | Page.layoutMode |
| grid | 栅格配置 | PageGridConfig \| null | 低 | Page.grid |
| shellLayout | 壳布局 | string | 低 | Page.shellLayout |
| deviceType | 设备类型 | 'pc' \| 'mobile' | 低 | Page.deviceType |
| canvasWidth | 画布宽 | number | 低 | Page.canvasWidth |
| canvasHeight | 画布高 | number | 低 | Page.canvasHeight |
| lockEditing | 锁定编辑 | boolean | 低 | Page.lockEditing |
| visibility | 可见性 | 'public' \| 'private' | 中 | Page.visibility |
| expire_at | 过期时间 | string \| null | 中 | Page.expire_at |

### Component（`component` 表）

| 字段 | 含义 | 类型（TS） | 敏感性 | 来源 |
|---|---|---|---|---|
| id | 自增 ID | number | 低 | Component.id |
| page_id | 所属页面 | number | 中 | Component.page_id |
| account_id | 所属用户 | number | 中 | Component.account_id |
| type | 组件类型 | TComponentTypes | 低 | Component.type |
| node_id | 节点 ID | string | 低 | Component.node_id |
| parent_node_id | 父节点 ID | string \| null | 低 | Component.parent_node_id |
| slot | 插槽 | string \| null | 低 | Component.slot |
| name | 展示名 | string \| null | 低 | Component.name |
| options | 配置 | unknown | 中 | Component.options（simple-json） |
| styles | 样式 | unknown \| null | 低 | Component.styles |
| meta | 元信息 | unknown \| null | 低 | Component.meta |

### PageVersion（`page_version` 表）

| 字段 | 含义 | 类型（TS） | 敏感性 | 来源 |
|---|---|---|---|---|
| id | uuid | string | 低 | PageVersion.id |
| page_id | 页面 | number | 低 | PageVersion.page_id |
| account_id | 发布者 | number | 中 | PageVersion.account_id |
| version | 版本号 | number | 低 | PageVersion.version |
| desc | 描述 | string | 低 | PageVersion.desc |
| schema_data | 快照 | Record<string, any> | 中 | PageVersion.schema_data |
| created_at | 创建时间 | string | 低 | PageVersion.created_at |

## 3) 协作

### PageCollaborator（`page_collaborator` 表）

| 字段 | 含义 | 类型（TS） | 敏感性 | 来源 |
|---|---|---|---|---|
| id | uuid | string | 低 | PageCollaborator.id |
| page_id | 页面 | number | 低 | PageCollaborator.page_id |
| user_id | 用户 | number | 中 | PageCollaborator.user_id |
| role | 协作角色 | PermissionRole | 中 | PageCollaborator.role |
| created_at | 创建时间 | string | 低 | PageCollaborator.created_at |
| updated_at | 更新时间 | string | 低 | PageCollaborator.updated_at |

### WebSocket 事件（`/collaboration`）

| 事件 | 方向 | 数据元素（摘要） | 敏感性 |
|---|---|---|---|
| join_room | client → server | pageId, user | 中 |
| leave_room | client → server | pageId, user | 中 |
| component_update | client → server | diff / component payload | 中 |
| toggle_lock | client → server | isLocked | 低 |
| sync_component | server → clients | diff / component payload | 中 |
| sync_lock_status | server → clients | isLocked | 低 |
| room_users_update | server → clients | user list | 中 |

## 4) 资源与对象存储

### Resources（`resources` 表）

| 字段 | 含义 | 类型（TS） | 敏感性 |
|---|---|---|---|
| id | 自增 ID | number | 低 |
| url | OSS URL | string | 中 |
| account_id | 上传者 | number | 中 |
| type | 资源类型 | UploadType | 低 |
| name | 文件名 | string | 低 |

## 5) 模板

### Template（`template` 表）

| 字段 | 含义 | 类型（TS） | 敏感性 |
|---|---|---|---|
| key | 唯一 key | string | 低 |
| version | 版本 | number | 低 |
| preset | 模板预设 | TemplatePreset | 中 |

## 6) 提交数据（Legacy/问卷）

### ComponentData（`component_data` 表）

| 字段 | 含义 | 类型（TS） | 敏感性 |
|---|---|---|---|
| page_id | 页面 | number | 中 |
| user | 提交者标识 | string | 中 |
| props | 表单提交项 | {id:number;value:string\|string[]}[] | 高（可能含个人信息） |

建议：
- 明确提交数据的合规策略（字段白名单、脱敏与保留周期）。
- 对提交数据引入加密/分表/归档（视业务与合规要求）。

