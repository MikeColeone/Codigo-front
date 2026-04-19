# 7. 数据流图（DFD）

本章采用可版本化的 PlantUML 源码描述 DFD（Yourdon/Gane-Sarson 风格的“外部实体 / 处理过程 / 数据存储 / 数据流”要素）。字段级数据字典见：[`03-data-dictionary.md`](./03-data-dictionary.md)。

## 7.1 Level-0（上下文图）

图稿源码：[`dfd-level0-context.puml`](../diagrams/dfd-level0-context.puml)

```plantuml
@startuml
title DFD Level-0（上下文图）- Codigo System
left to right direction
skinparam shadowing false

rectangle "访问者/用户" as E_User <<external_entity>>
rectangle "管理员" as E_Admin <<external_entity>>
rectangle "短信/验证码服务" as E_SMS <<external_entity>>
rectangle "对象存储 OSS" as E_OSS <<external_entity>>

rectangle "Codigo System\n(前端 + 后端)" as SYS <<process>>

database "MySQL\n(codigo_lowcode)" as D_MySQL <<data_store>>
database "Redis" as D_Redis <<data_store>>

E_User --> SYS : 注册/登录/编辑/发布/访问/协作
E_Admin --> SYS : 后台治理请求
SYS --> E_SMS : 发送验证码（短信）
SYS --> E_OSS : 上传/获取资源对象

SYS --> D_MySQL : 业务数据读写
SYS --> D_Redis : 缓存/验证码/会话状态

@enduml
```

## 7.2 Level-1（系统级）

图稿源码：[`dfd-level1-system.puml`](../diagrams/dfd-level1-system.puml)

```plantuml
@startuml
title DFD Level-1（系统级）- 处理过程分解
left to right direction
skinparam shadowing false

rectangle "访问者/用户" as E_User <<external_entity>>
rectangle "管理员" as E_Admin <<external_entity>>
rectangle "短信/验证码服务" as E_SMS <<external_entity>>
rectangle "对象存储 OSS" as E_OSS <<external_entity>>

database "D1: MySQL\n(user/page/component/...)" as D1 <<data_store>>
database "D2: Redis\n(captcha/cache/...)" as D2 <<data_store>>

rectangle "P1: 认证与用户\n(Auth/User)" as P1 <<process>>
rectangle "P2: 页面发布与访问\n(Pages/Release)" as P2 <<process>>
rectangle "P3: 页面版本\n(PageVersion)" as P3 <<process>>
rectangle "P4: 工作区文件系统\n(Workspace)" as P4 <<process>>
rectangle "P5: 协作者与实时协同\n(Collaboration)" as P5 <<process>>
rectangle "P6: 模板\n(Templates)" as P6 <<process>>
rectangle "P7: 资源\n(Resources)" as P7 <<process>>
rectangle "P8: 后台治理\n(Admin)" as P8 <<process>>

E_User --> P1 : 注册/登录/获取验证码
P1 --> D1 : user 读写
P1 --> D2 : captcha/session 缓存
P1 --> E_SMS : 发送短信验证码

E_User --> P2 : 发布/访问页面
P2 --> D1 : page/component 读写

P2 --> P3 : 生成版本快照
P3 --> D1 : page_version 写入/读取

E_User --> P4 : 同步工作区/读写文件
P4 --> D1 : schema 读写（回写）

E_User --> P5 : 协作成员管理/实时协同
P5 --> D1 : page_collaborator 读写
P5 --> D2 : （可选）协同状态/锁缓存

E_User --> P6 : 浏览模板
E_Admin --> P6 : 管理模板（CRUD）
P6 --> D1 : template 读写

E_User --> P7 : 上传/管理资源
P7 --> E_OSS : 上传对象/获取 URL
P7 --> D1 : resources 记录

E_Admin --> P8 : 用户/页面/组件治理
P8 --> D1 : user/page/component/page_version 读写

@enduml
```

## 7.3 Level-2（模块级示例：Flow 发布页面）

图稿源码：[`dfd-level2-flow-release.puml`](../diagrams/dfd-level2-flow-release.puml)

```plantuml
@startuml
title DFD Level-2（模块级）- Flow: 发布页面（PUT /pages/me）
left to right direction
skinparam shadowing false

rectangle "用户(Owner)" as E_User <<external_entity>>
database "D1: page" as D_page <<data_store>>
database "D2: component" as D_component <<data_store>>
database "D3: page_version" as D_version <<data_store>>
database "D4: operation_log" as D_oplog <<data_store>>

rectangle "P2.1: JWT 校验" as P21 <<process>>
rectangle "P2.2: Schema 规范化/校验" as P22 <<process>>
rectangle "P2.3: Upsert Page" as P23 <<process>>
rectangle "P2.4: 扁平化写入 Components" as P24 <<process>>
rectangle "P2.5: 生成版本快照" as P25 <<process>>
rectangle "P2.6: 输出发布结果" as P26 <<process>>

E_User --> P21 : Authorization + schema payload
P21 --> P22 : userId + schema

P22 --> P23 : page meta + rootIds
P23 --> D_page : INSERT/UPDATE

P23 --> P24 : pageId + components tree
P24 --> D_component : INSERT/UPDATE/DELETE

P24 --> P25 : schema snapshot
P25 --> D_version : INSERT（version + schema_data）

P25 --> D_oplog : （建议）记录发布事件

P25 --> P26 : pageId
P26 --> E_User : {pageId}

@enduml
```

## 7.4 数据敏感性、加密与脱敏（摘要）

详细策略见：[`../nfr/03-security.md`](../nfr/03-security.md)

- **敏感数据识别**：
  - 认证类：JWT、密码哈希、验证码、短信服务密钥、OSS 密钥。
  - 用户类：手机号、头像、昵称等个人信息。
  - 业务类：页面 schema（可能包含文本/表单提交数据）。
- **存储与传输**：
  - 传输层强制 HTTPS；token 仅通过 Authorization 头传递。
  - 密码使用 bcrypt 哈希存储，禁止明文。
  - 对日志/审计输出做脱敏（手机号、token、密钥）。

