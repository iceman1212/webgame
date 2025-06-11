# 📝 Git 最佳实践指南

## 🎯 Commit Message 最佳实践

### Conventional Commits 规范

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范，确保提交信息的一致性和可读性。

#### 基本格式

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### 提交类型 (Type)

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式化（不影响功能）
- `refactor`: 重构代码
- `perf`: 性能优化
- `test`: 添加或修改测试
- `chore`: 构建过程或辅助工具的变动
- `ci`: CI/CD 配置文件和脚本的变动
- `build`: 影响构建系统或外部依赖的更改

#### 示例提交信息

**简单提交**:

```
feat: add user authentication system
fix: resolve memory leak in game loop
docs: update installation instructions
```

**带作用域的提交**:

```
feat(auth): implement OAuth2 login
fix(ui): correct button alignment on mobile
test(api): add integration tests for user endpoints
```

**带详细描述的提交**:

```
feat: implement comprehensive code optimization workflow

🔴 High Priority Optimizations:
- Refactor state management with unified GameState class
- Eliminate code duplication with GameInitializer utility

🟡 Medium Priority Optimizations:
- Add centralized configuration management
- Replace hardcoded constants with configurable values

🟢 Low Priority Optimizations:
- Implement comprehensive error handling
- Add graceful degradation for failures

BREAKING CHANGE: Refactored global state variables into GameState class.
Migration: Replace direct state access with gameState instance methods.

Closes #123
```

## 🔄 Git 工作流程

### 1. 功能开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/user-authentication

# 2. 进行开发工作
# ... 编写代码 ...

# 3. 添加文件到暂存区
git add .

# 4. 提交更改（触发 pre-commit hooks）
git commit -m "feat(auth): implement user login system"

# 5. 推送到远程分支
git push origin feature/user-authentication

# 6. 创建 Pull Request
```

### 2. Bug 修复流程

```bash
# 1. 创建修复分支
git checkout -b fix/memory-leak-issue

# 2. 修复问题
# ... 修复代码 ...

# 3. 添加测试验证修复
# ... 编写测试 ...

# 4. 提交修复
git commit -m "fix: resolve memory leak in game loop

- Properly dispose of event listeners
- Clear intervals on game end
- Add memory cleanup tests

Fixes #456"

# 5. 推送并创建 PR
git push origin fix/memory-leak-issue
```

## 🛡️ Pre-commit Hooks

### 自动化检查

我们的 pre-commit hooks 会自动执行：

1. **ESLint 检查和修复**

   ```bash
   eslint --fix src/**/*.{ts,tsx,js,jsx}
   ```

2. **Prettier 格式化**

   ```bash
   prettier --write src/**/*.{ts,tsx,js,jsx,json,css,md}
   ```

3. **类型检查**（在 CI 中）
   ```bash
   tsc --noEmit
   ```

### 绕过 Hooks（谨慎使用）

```bash
# 仅在紧急情况下使用
git commit --no-verify -m "emergency fix"
```

## 🌿 分支策略

### 分支命名规范

- `feature/feature-name` - 新功能
- `fix/bug-description` - Bug 修复
- `hotfix/critical-issue` - 紧急修复
- `refactor/component-name` - 重构
- `docs/update-readme` - 文档更新

### 分支保护规则

- `main` 分支受保护
- 需要 PR 审查才能合并
- 必须通过所有 CI 检查
- 需要最新的 main 分支

## 🔍 代码审查最佳实践

### PR 创建清单

- [ ] 提交信息遵循 Conventional Commits
- [ ] 代码通过所有自动化检查
- [ ] 添加了适当的测试
- [ ] 更新了相关文档
- [ ] PR 描述清晰，包含变更原因

### PR 模板

```markdown
## 变更类型

- [ ] 新功能
- [ ] Bug 修复
- [ ] 重构
- [ ] 文档更新

## 变更描述

简要描述此 PR 的变更内容...

## 测试

- [ ] 添加了新的测试
- [ ] 所有现有测试通过
- [ ] 手动测试完成

## 截图（如适用）

...

## 检查清单

- [ ] 代码遵循项目规范
- [ ] 自我审查完成
- [ ] 添加了必要的注释
- [ ] 更新了文档
```

## 📊 Git 统计和分析

### 查看提交统计

```bash
# 查看提交历史
git log --oneline --graph

# 查看作者统计
git shortlog -sn

# 查看文件变更统计
git log --stat

# 查看代码行数变化
git log --pretty=format:"%h %an %s" --numstat
```

### 代码质量指标

```bash
# 查看最近的提交
git log --oneline -10

# 查看分支差异
git diff main..feature-branch

# 查看文件历史
git log -p filename
```

## 🚀 CI/CD 集成

### GitHub Actions 触发条件

- **Push 到 main**: 完整的 CI/CD 流程
- **Pull Request**: 代码质量检查和测试
- **Tag 创建**: 自动发布流程

### 状态检查

所有 PR 必须通过：

- ✅ TypeScript 编译
- ✅ ESLint 检查
- ✅ Prettier 格式检查
- ✅ 单元测试
- ✅ 安全审计
- ✅ 构建验证

## 📚 相关资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Semantic Versioning](https://semver.org/)

---

遵循这些最佳实践，确保我们的代码库保持高质量和一致性！ 🎉
