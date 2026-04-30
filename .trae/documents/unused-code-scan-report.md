# 无用代码扫描报告

> 扫描时间: 2026-04-30
> 扫描范围: `/Users/bytedance/Desktop/workspace/demos/Codigo` 项目中的 `apps/*` 和 `packages/*` 目录

## 1. 执行摘要

本次扫描发现了以下潜在的无用代码：

| 类别 | 数量 | 说明 |
|------|------|------|
| 未使用文件 | 2 | 历史扫描结果中标记为未使用且仍存在 |
| 潜在未使用导出函数 | 3 | 导出但可能未被调用的函数 |
| 未使用变量/常量 | 若干 | 定义但未被引用的变量 |

---

## 2. 未使用文件（已确认）

根据历史扫描结果 `.trae/context/unused-files.final.json`，以下文件被标记为未使用：

| 文件路径 | 状态 | 建议操作 |
|----------|------|----------|
| `apps/client/src/test/setup.ts` | 未引用 | 检查是否为测试配置文件，如不再需要可删除 |
| `apps/ide/src/app.tsx` | 未引用 | 检查是否为 IDE 应用入口，确认是否已迁移 |

**注意**：历史扫描结果中的其他未使用文件（如 `excel.ts`, `theme.ts` 等）已被删除。

---

## 3. 潜在未使用导出函数

### 3.1 `packages/release/src/hooks/use-fit-scale.ts`

```typescript
export function useFitScale({...})
```

- **位置**: `packages/release/src/hooks/use-fit-scale.ts:15`
- **状态**: ⚠️ 导出但未被引用
- **分析**: 
  - `apps/client` 中有同名函数 `useFitScale` 在 `apps/client/src/shared/hooks/use-fit-scale.ts`
  - `packages/release` 中的版本未被任何模块引用
  - 检查 `packages/release/package.json` 确认该包是否被使用
- **建议**: 如果 `packages/release` 未被使用，考虑删除整个包或仅删除此文件

### 3.2 `apps/client/src/modules/editor/utils/layout-blocks.ts`

以下函数仅被测试文件引用，生产代码中未使用：

```typescript
export function splitLayoutBlocksEvenly(...)
export function exportLayoutBlocks(...)
export function exportLayoutBlocksJson(...)
```

- **位置**: 
  - `splitLayoutBlocksEvenly`: line 105
  - `exportLayoutBlocks`: line 170
  - `exportLayoutBlocksJson`: line 180
- **状态**: ⚠️ 仅被测试文件引用
- **引用情况**:
  - 仅在 `apps/client/src/modules/editor/utils/__tests__/layout-blocks.test.ts` 中被导入测试
- **建议**: 
  - 如果这些功能是预留的调试/开发功能，保留但添加注释说明
  - 如果确认不再需要，删除函数及对应测试

---

## 4. 已使用但需关注的导出

以下导出在当前被使用，但使用范围有限，建议定期复查：

### 4.1 `apps/client/src/modules/editor/hooks/use-editor-component-key-press.ts`

```typescript
export const EDITOR_COMPONENT_SHORTCUTS
export function useEditorComponentKeyPress()
```

- **使用情况**: 
  - `EDITOR_COMPONENT_SHORTCUTS` 被 `editor-status-bar-actions.tsx` 引用
  - `useEditorComponentKeyPress` 通过 `hooks/index.ts` 导出，但搜索未发现直接调用
- **建议**: 确认 `useEditorComponentKeyPress` 是否在组件中被实际调用

### 4.2 `apps/client/src/modules/editor/hooks/use-editor-component-structure.ts`

```typescript
export function createEditorComponentStructure()
```

- **使用情况**: 被 `use-editor-components.ts` 引用
- **状态**: ✅ 正常使用

---

## 5. Server 端代码分析

### 5.1 正常使用的服务

| 服务/类 | 位置 | 状态 |
|---------|------|------|
| `PageAnalyticsService` | `apps/server/src/modules/flow/service/page-analytics.service.ts` | ✅ 被 Controller 注入使用 |
| `normalizeSuccessResponse` | `apps/server/src/shared/types/rest-vo.ts` | ✅ 被 ResponseInterceptor 使用 |
| `RestFailure`, `RestErrorMeta` | `apps/server/src/shared/types/rest-vo.ts` | ✅ 被异常过滤器使用 |

### 5.2 测试文件

| 文件 | 说明 |
|------|------|
| `apps/server/src/modules/user/user.service.spec.ts` | 用户服务测试 |
| `apps/server/src/modules/user/captcha.controller.spec.ts` | 验证码控制器测试 |
| `apps/server/src/modules/admin/admin.service.spec.ts` | 管理员服务测试 |
| `apps/server/src/core/response-format.spec.ts` | 响应格式测试 |

**建议**: 测试文件如长期未更新，可能需要同步更新或删除

---

## 6. 建议操作清单

### 高优先级

1. **删除或确认未使用文件**
   - [ ] 确认 `apps/client/src/test/setup.ts` 是否可删除
   - [ ] 确认 `apps/ide/src/app.tsx` 是否可删除

2. **清理 packages/release**
   - [ ] 检查 `packages/release` 是否被任何应用依赖
   - [ ] 如未使用，考虑删除整个包

### 中优先级

3. **评估 layout-blocks 工具函数**
   - [ ] 确认 `splitLayoutBlocksEvenly`, `exportLayoutBlocks`, `exportLayoutBlocksJson` 是否需要保留
   - [ ] 如不需要，删除函数及对应测试文件

4. **检查 hooks 实际使用情况**
   - [ ] 确认 `useEditorComponentKeyPress` 是否在组件中被调用
   - [ ] 确认 `use-layout-manager-ui` 的实际使用情况

### 低优先级

5. **定期复查**
   - [ ] 建立定期无用代码扫描机制
   - [ ] 考虑引入 ESLint 规则检测未使用导出

---

## 7. 扫描方法说明

本次扫描采用以下方法：

1. **历史结果复用**: 读取 `.trae/context/unused-files*.json` 历史扫描结果
2. **导出分析**: 使用 `grep` 搜索所有 `export` 语句
3. **引用检查**: 使用 `grep` 搜索 `from '...'` 和 `import '...'` 语句
4. **交叉验证**: 对比导出和引用，识别未被引用的导出

**局限性**:
- 动态导入 (`import()`) 可能无法被静态分析捕获
- 反射/元编程用法可能产生误报
- 某些导出可能是公共 API，供外部消费者使用

---

## 8. 附录：相关文件路径

### 配置文件
- `.trae/context/unused-files.json` - 历史扫描结果（完整）
- `.trae/context/unused-files.final.json` - 历史扫描结果（最终）

### 潜在未使用文件
- `apps/client/src/test/setup.ts`
- `apps/ide/src/app.tsx`
- `packages/release/src/hooks/use-fit-scale.ts`

### 相关代码文件
- `apps/client/src/modules/editor/utils/layout-blocks.ts`
- `apps/client/src/modules/editor/utils/__tests__/layout-blocks.test.ts`
- `apps/client/src/shared/hooks/use-fit-scale.ts`
- `apps/client/src/shared/hooks/use-send-code.tsx`
- `apps/client/src/shared/hooks/use-store-auth.ts`
- `apps/client/src/shared/hooks/use-store-page.ts`
