# 数学气球游戏 (Math Balloon Game)

通过这款有趣且互动性强的数学气球游戏来测试您的数学技能！在这款简单的数学游戏中，您需要戳破显示正确算术问题答案的气球。本项目已重构为使用 TypeScript 进行游戏逻辑的开发。

## 技术栈

- HTML5
- CSS3
- TypeScript (JavaScript的超集，提供静态类型检查)
- Node.js (用于构建过程和依赖管理)

## 项目结构详解

项目的文件结构组织清晰，核心逻辑和资源分离：

- `index.html`: 游戏的主HTML文件，位于项目根目录。它是用户在浏览器中打开以启动游戏的入口点。
- `style.css`: 包含游戏的所有样式和布局规则，同样位于项目根目录。
- `src/`: 存放所有TypeScript源代码的目录。
  - `core/`: 核心游戏机制与数据结构。
    - `questions.ts`: 负责生成数学问题（例如 `a + b = ?`），包含问题文本和答案。
    - `player.ts`: 定义玩家（小星星）的属性（位置、大小、速度）和绘制逻辑。
    - `audio.ts`: 管理游戏的音效，如背景音乐、答对/答错音效。
  - `components/`: 游戏中的可复用组件。
    - `balloon.ts`: 定义气球的属性（位置、携带的数值、速度、颜色、图片等）以及生成和绘制气球的逻辑。
  - `utils/`: 辅助工具和通用功能。
    - `domElements.ts`: 集中管理对HTML中DOM元素（如画布、得分板、按钮等）的引用。
    - `helpers.ts`: 包含一些通用辅助函数（例如，数组乱序功能）。
  - `gameController.ts`: 游戏的主控制器，是游戏逻辑的核心。它负责管理游戏状态（得分、生命值、当前问题）、游戏循环（更新画面、处理输入、检测碰撞）、以及协调其他模块（如问题生成、气球生成与更新、玩家更新等）。
  - `__tests__/`: 包含使用 Jest 框架编写的单元测试文件，用于确保代码质量和功能正确性。
- `dist/`: 存放编译后的JavaScript输出文件。
  - `gameController.js` (以及其他编译后的 .js 文件): 由TypeScript编译器 (`tsc`) 生成的JavaScript文件，这些文件最终被 `index.html` 引用。
- `assets/`: 存放游戏所需的静态资源。
  - `images/`: 包含游戏图片，如玩家角色、不同类型的气球等。
- `package.json`: Node.js项目的配置文件，定义了项目依赖（如TypeScript、Jest）、以及可执行的脚本（如构建命令 `npm run build`、测试命令 `npm test`）。
- `tsconfig.json`: TypeScript编译器的配置文件，指定了编译选项（如目标JavaScript版本、模块系统、是否启用严格类型检查等）。
- `jest.config.js`: Jest测试框架的配置文件。
- `README.md`: 项目的说明文件（即本文档）。

## 安装与运行指南

请按照以下步骤在您的本地环境中设置并运行游戏：

1.  **克隆代码仓库 (如果您尚未克隆):**
    打开您的终端或命令提示符，执行以下命令：

    ```bash
    git clone <repository-url> # 请将 <repository-url> 替换为实际的仓库地址
    cd <repository-directory>  # 进入克隆下来的项目目录
    ```

2.  **安装项目依赖:**
    这将根据 `package.json` 文件中的定义，下载并安装TypeScript、Jest以及其他开发时所需的工具。

    ```bash
    npm install
    ```

3.  **编译TypeScript代码:**
    此命令会调用TypeScript编译器 (`tsc`)，它会读取 `tsconfig.json` 的配置，将 `src/` 目录下的 `.ts` 文件编译成JavaScript (`.js`) 文件，并输出到 `dist/` 目录。

    ```bash
    npm run build
    ```

4.  **运行游戏:**
    编译成功后，在您的网页浏览器中打开项目根目录下的 `index.html` 文件即可开始游戏。
    您可以通过以下方式打开：

    ```bash
    # 在 macOS 上
    open index.html

    # 在 Windows 上
    start index.html

    # 在 Linux 上
    xdg-open index.html
    ```

    或者，您通常也可以直接在文件浏览器中双击 `index.html` 文件来打开它。

## 游戏玩法详解

- **问题呈现:** 游戏开始后，屏幕顶部会显示一个算术问题 (例如 `5 + 3 = ?`)。
- **气球生成:** 多个带有数字的气球会从屏幕底部向上漂浮。这些气球中，有一个携带的是当前问题的正确答案，其余的则是随机生成的干扰项。
- **玩家操作:** 您可以使用键盘的左右箭头键（或 'A' 和 'D' 键）或鼠标来控制屏幕底部的玩家角色（小星星）左右移动。
- **答题与得分:** 移动玩家，使其触碰（“戳破”）您认为是正确答案的气球。
  - 如果答案正确，气球会消失，您将获得10分，并会播放一个成功的音效。屏幕上的所有气球会消失，然后生成新一轮的问题和气球。
  - 如果答案错误，或者携带正确答案的气球漂浮出屏幕顶部而未被戳破，您将失去一条生命，并播放一个失败的音效。
- **游戏结束:** 当您的生命值耗尽（通常初始为3条命）时，游戏结束。此时会显示您的最终得分。您可以点击“重新开始”按钮来开始一局新游戏。

## 开发与调试

如果您对 `src/` 目录下的TypeScript代码进行了修改（例如添加新功能或修复bug），您需要重新执行构建命令：

```bash
npm run build
```

这样才能将您的更改编译到 `dist/` 目录下的JavaScript文件中，从而在浏览器中看到更新后的游戏效果。

运行单元测试：

```bash
npm test
```

这将执行 `src/__tests__/` 目录下的所有测试用例。

## 🎨 代码质量保证

本项目采用了完整的代码格式化和质量保证流程，确保代码的一致性、可读性和可维护性。

### 快速开始

```bash
# 运行完整的代码质量检查
npm run quality

# 自动修复代码格式和质量问题
npm run quality:fix
```

### 可用脚本

- `npm run lint` - ESLint 代码质量检查
- `npm run lint:fix` - 自动修复 ESLint 问题
- `npm run format` - Prettier 代码格式化
- `npm run format:check` - 检查代码格式
- `npm run type-check` - TypeScript 类型检查
- `npm run test:coverage` - 测试覆盖率报告

### 工具配置

- **Prettier**: 代码格式化 (`.prettierrc`)
- **ESLint**: 代码质量检查 (`eslint.config.js`)
- **Husky**: Git hooks 自动化 (`.husky/`)
- **lint-staged**: 提交前检查
- **GitHub Actions**: CI/CD 自动化 (`.github/workflows/`)

详细信息请参阅 [代码格式化指南](CODE_FORMATTING.md)。

## 如何贡献

我们非常欢迎各种形式的贡献，无论是新功能建议、Bug修复，还是代码改进！如果您有兴趣参与：

1.  **Fork 本仓库:** 点击仓库页面右上角的 "Fork" 按钮，将本仓库复制到您自己的GitHub账户下。
2.  **创建新分支:** 在您Fork的仓库中，为您的新功能或修复创建一个新的分支。建议分支名能清晰描述其用途，例如 `feature/add-powerups` 或 `fix/balloon-speed-issue`。
    ```bash
    git checkout -b your-branch-name
    ```
3.  **进行修改:** 在您的新分支上进行代码修改和开发。
4.  **提交更改:**
    ```bash
    git add .
    git commit -m "详细描述您的更改内容"
    ```
5.  **推送至您的Fork仓库:**
    ```bash
    git push origin your-branch-name
    ```
6.  **提交 Pull Request (PR):** 回到本项目的原始仓库页面，选择 "Pull requests" 标签页，然后点击 "New pull request"。选择您的Fork仓库和修改过的分支，与原始仓库的 `main` (或 `master`) 分支进行比较，然后提交PR。请在PR中详细描述您的更改内容、目的以及任何相关的背景信息。

我们将会审查您的PR，并可能提出一些修改建议。一旦通过，您的贡献就会被合并到主项目中！

## 开源许可证

本项目基于 MIT 许可证授权。详细信息请查阅项目根目录下的 `LICENSE` 文件。
