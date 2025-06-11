# 🎨 代码格式化和质量保证指南

## 📋 概述

本项目采用了完整的代码格式化和质量保证流程，确保代码的一致性、可读性和可维护性。

## 🛠️ 工具配置

### Prettier - 代码格式化

- **配置文件**: `.prettierrc`
- **忽略文件**: `.prettierignore`
- **主要设置**:
  - 单引号 (`singleQuote: true`)
  - 分号 (`semi: true`)
  - 行宽 100 字符 (`printWidth: 100`)
  - 2 空格缩进 (`tabWidth: 2`)
  - 尾随逗号 ES5 (`trailingComma: "es5"`)

### ESLint - 代码质量检查

- **配置文件**: `eslint.config.js`
- **主要规则**:
  - TypeScript 严格检查
  - 禁用 `console.log`（允许 `console.warn` 和 `console.error`）
  - 强制使用 `const` 和 `let`
  - 严格相等检查 (`===`)
  - 函数返回类型注解

### TypeScript - 类型检查

- **配置文件**: `tsconfig.json`
- **严格模式**: 启用所有严格检查
- **目标**: ES2020
- **模块**: ESNext

## 📝 可用脚本

### 基础命令

```bash
# 代码格式化
npm run format              # 格式化所有文件
npm run format:check        # 检查格式是否正确

# 代码质量检查
npm run lint                # 运行 ESLint 检查
npm run lint:fix            # 自动修复 ESLint 问题

# 类型检查
npm run type-check          # 运行 TypeScript 类型检查

# 测试
npm run test                # 运行所有测试
npm run test:watch          # 监视模式运行测试
npm run test:coverage       # 运行测试并生成覆盖率报告
```

### 组合命令

```bash
# 完整质量检查
npm run quality             # 类型检查 + Lint + 格式检查

# 完整质量修复
npm run quality:fix         # 类型检查 + Lint修复 + 格式化
```

## 🔄 Git Hooks

### Pre-commit Hook

使用 Husky 和 lint-staged 在提交前自动运行：

- ESLint 自动修复
- Prettier 格式化
- 只处理暂存的文件

**配置位置**: `.husky/pre-commit` 和 `package.json` 中的 `lint-staged`

## 🏗️ CI/CD 集成

### GitHub Actions

**工作流文件**: `.github/workflows/ci.yml`

**包含的检查**:

- ✅ 类型检查
- ✅ 代码质量检查 (ESLint)
- ✅ 格式检查 (Prettier)
- ✅ 单元测试
- ✅ 测试覆盖率
- ✅ 安全审计
- ✅ 构建验证

**多 Node.js 版本支持**: 18.x, 20.x

## 🎯 VS Code 集成

### 推荐设置

**文件**: `.vscode/settings.json`

**功能**:

- 保存时自动格式化
- 保存时自动修复 ESLint 问题
- 自动导入组织
- TypeScript 智能提示

### 推荐扩展

**文件**: `.vscode/extensions.json`

**包含扩展**:

- Prettier - Code formatter
- ESLint
- TypeScript and JavaScript Language Features
- 其他开发辅助工具

## 📊 代码质量指标

### 当前状态

- ✅ **ESLint**: 0 错误，0 警告
- ✅ **Prettier**: 所有文件格式正确
- ✅ **TypeScript**: 无类型错误
- ✅ **测试**: 67/67 通过 (100%)
- ✅ **构建**: 成功

### 质量门禁

所有以下检查必须通过才能合并代码：

1. TypeScript 编译无错误
2. ESLint 检查通过
3. Prettier 格式检查通过
4. 所有单元测试通过
5. 代码覆盖率达标
6. 安全审计通过
7. 构建成功

## 🚀 最佳实践

### 开发流程

1. **开发前**: 确保 VS Code 扩展已安装
2. **开发中**: 依赖自动格式化和实时检查
3. **提交前**: Git hooks 自动运行检查
4. **推送后**: CI/CD 自动验证

### 代码风格

- 使用 TypeScript 严格模式
- 优先使用 `const`，必要时使用 `let`
- 避免 `any` 类型，使用具体类型
- 函数必须有返回类型注解
- 使用有意义的变量和函数名
- 添加适当的注释

### 错误处理

- 使用统一的错误处理机制
- 避免使用 `console.log`，使用 `console.warn` 或 `console.error`
- 为异步操作添加错误处理

## 🔧 故障排除

### 常见问题

**1. ESLint 配置警告**

```bash
# 解决方案：添加 "type": "module" 到 package.json
```

**2. Prettier 格式冲突**

```bash
# 运行格式化修复
npm run format
```

**3. TypeScript 类型错误**

```bash
# 运行类型检查查看详细错误
npm run type-check
```

**4. 测试失败**

```bash
# 运行测试查看详细信息
npm run test
```

## 📈 持续改进

### 定期维护

- 每月更新依赖包
- 定期审查和更新 ESLint 规则
- 监控代码质量指标
- 收集团队反馈并优化配置

### 指标监控

- 代码覆盖率趋势
- ESLint 规则违反统计
- 构建时间监控
- 安全漏洞跟踪

---

通过遵循这些指南，我们确保了代码库的高质量、一致性和可维护性！ 🎉
