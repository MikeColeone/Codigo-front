# Codigo

Codigo 是一个基于 pnpm workspace + turbo 的低代码平台 Monorepo。仓库将协议层、运行时物料、编辑器、发布端、服务端与嵌入式 IDE 拆分为清晰边界，避免双源定义与包边界漂移。

## 目录结构

```text
codigo/
├─ apps/
│  ├─ client/   # 主前端（编辑器/应用管理/预览入口）
│  ├─ admin/    # 后台管理前端
│  ├─ server/   # NestJS 后端
│  └─ ide/      # OpenSumi IDE 外壳
├─ packages/
│  ├─ schema/         # 跨端协议与类型（唯一事实源）
│  ├─ materials/      # 运行时物料渲染与注册（唯一事实源）
│  ├─ runtime-core/   # 框架无关运行时算法（纯函数）
│  ├─ render/         # 代码生成与 runtime-core 桥接
│  ├─ editor-sandbox/ # 编辑器沙箱输出与最小预览生成
│  ├─ file-service/   # IDE/浏览器文件服务上下文适配
│  ├─ plugin-system/  # 组件插件注册协议
│  └─ release/        # 最终发布页运行时（消费层）
└─ .trae/rules/  # 本地协作规则（不参与生产构建）
```

## 环境要求

- **Node.js**: 20.19+ 或 22.12+（Vite 7 需要）
- **pnpm**: 10.28.2+
- **数据库**: MySQL 8.0+
- **缓存**: Redis 6.0+

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置数据库

#### 方式一：本地 Docker 启动（推荐）

```bash
# 启动 MySQL
docker run -d --name codigo-mysql \
  -p 13306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=codigo_lowcode \
  mysql:8

# 启动 Redis
docker run -d --name codigo-redis \
  -p 6379:6379 \
  redis:alpine
```

然后修改数据库配置：

**apps/server/src/config/index.ts**
```typescript
export const redisConfig: RedisOptions = {
  host: 'localhost',
  port: 6379,
};
```

**apps/server/src/database/typeorm.config.ts**
```typescript
export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 13306,
  username: 'root',
  password: '123456',
  database: 'codigo_lowcode',
  // ...
};
```

#### 方式二：远程数据库（虚拟机/NAS）

如果数据库运行在虚拟机或另一台电脑上：

1. **虚拟机使用桥接网络**：虚拟机将获得和主机同一网段的 IP，直接修改配置中的 host 为虚拟机 IP

2. **虚拟机使用 NAT + 端口转发**：
   - VMware: 虚拟机设置 → 网络适配器 → NAT 模式 → 高级 → 端口转发
   - VirtualBox: 设置 → 网络 → 高级 → 端口转发
   
   添加规则：
   | 主机端口 | 类型 | 虚拟机端口 |
   |---------|------|-----------|
   | 13306   | TCP  | 13306     |
   | 6379    | TCP  | 6379      |
   
   配置中使用 `host: 'localhost'` 通过端口转发访问

### 3. 启动开发服务器

#### 全部启动（需要数据库）

```bash
pnpm run dev
```

#### 单独启动应用

```bash
# 只启动前端（不需要数据库）
pnpm run run:client

# 启动其他应用
pnpm run run:admin      # 后台管理
pnpm run run:server     # 后端服务（需要数据库）
pnpm run run:ide        # OpenSumi IDE
pnpm run run:release    # 发布端
```

### 4. 访问应用

| 应用 | 地址 |
|------|------|
| Client | http://localhost:5173/ |
| Admin | http://localhost:5174/ |
| Server API | http://localhost:3000/ |
| OpenSumi IDE | http://localhost:8080/ |
| Release | http://localhost:3001/ |

## 常见问题

### 1. Vite 报错 `crypto.hash is not a function`

**原因**: Node.js 版本过低（需要 20.19+）

**解决**:
```bash
# 使用 nvm 切换版本
nvm use 20
# 或
nvm use 22
```

### 2. 浏览器报错 `SyntaxError: Unexpected token '-'`

**原因**: Vite 预构建缓存损坏

**解决**:
```bash
rm -rf node_modules/.vite
rm -rf apps/client/node_modules/.vite
pnpm run run:client
```

### 3. 后端报错 `Unable to connect to the database`

**原因**: 数据库连接失败

**解决**:
1. 检查 MySQL 和 Redis 是否运行
2. 检查配置中的 host、port、密码是否正确
3. 检查网络连接（虚拟机需要配置端口转发或桥接）

### 4. 端口被占用

Vite 会自动尝试下一个可用端口（5173 → 5174 → 5175...），查看控制台输出确认实际端口。

## 构建与质量

```bash
# 构建所有包
pnpm run build

# 代码检查
pnpm run lint

# 类型检查
pnpm run typecheck

# 运行测试
pnpm run test

# 构建特定应用
pnpm run build:client
pnpm run build:server
pnpm run build:admin
```

## 协作规则

- 架构边界与依赖方向：见 `.trae/rules/BASIC_RULES.md`
- 协作与风格约束：见 `.trae/rules/USER_GUIDE.md`
- 项目包与目录职责：见 `.trae/rules/ARTCH.md`

## 研发工作日志

仓库内置任务日志系统，任务结束前需要生成一份工作日志：

```bash
pnpm run task:log -- --title "任务标题" --goal "任务目标" --summary "交付结果" --repro "复现步骤 1"
```

日志归档目录：`.trae/task-logs/`
