# 迭代记录

## 第 0 轮：规划（2026-09-22）

- 用户确认前仅执行只读检查，目录包含隐藏项共 0 项，无项目 .git。
- 基线：尚无代码和测试。
- 已读取课程教程第 19 节，完整采用建议契约，无简化差异。
- 用户已确认计划并授权第 1 轮。

## 第 1 轮：工程骨架（2026-09-22）

### 目标与范围

创建最小 Vue + JavaScript + Vite + Tailwind CSS 工程，固定约定依赖；显示中文标题及可辨认的 Tailwind 样式。建立项目规则与确认过的任务单、契约；初始化本地独立 Git 仓库。
本轮不实现 CRUD、localStorage、拖拽或主题。

### 实际改动

- package.json：type 为 module，配置 dev/build/test 脚本，固定五个约定依赖版本。
- index.html、vite.config.js、src/main.js、src/App.vue、src/style.css：Vue 入口、两个 Vite 插件、Tailwind 导入、中文标题与样式展示；端口固定 5173 且 strictPort 开启。
- .gitignore：忽略 node_modules/、dist/ 和 *.local。
- AGENTS.md：项目边界、课程环境、逐轮门禁和真实记录规则。
- docs/task-brief.md、docs/contract.md：保存第 0 轮确认内容；domain/storage/tests 仅规划，按功能轮次添加实际文件。
- docs/iteration-log.md：记录本轮工作，命令结果在执行后补充。
- package-lock.json：安装生成锁文件；node_modules/ 与 dist/ 为安装和构建产物，已被 Git 忽略。

### 实际命令与结果

1. 初始只读检查：执行 Get-Location、Get-ChildItem -Force，确认工作目录为 C:\Users\Administrator\Documents\Codex\course-task-board，列表为空；逐级 Test-Path / Get-Content 检查 AGENTS.md，未找到适用规则文件。
2. 执行 Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue，未返回监听项；该初始命令块退出码为 1，不能单独据此宣称端口可用，启动时由 strictPort 校验。
3. 使用 apply_patch 创建上述源文件和文档。
4. Get-Content -LiteralPath '.\AGENTS.md' -Encoding UTF8：读取新建项目规则。随后在同一命令块先点加载课程环境，再执行 npm.cmd install --offline --no-audit --no-fund。环境报告 Node v24.19.0、npm 12.0.2；安装退出码 1，ENOTCACHED：@tailwindcss/vite 的 registry 缓存响应不可用；同时 npm 无法写入课程缓存目录的 _logs。按用户约定下一步使用 --prefer-offline，并申请课程缓存访问权限。
5. 课程缓存访问获准后，先点加载课程环境，再运行 npm.cmd install --prefer-offline --no-audit --no-fund：退出码 0，输出 added 50 packages in 3s。没有更换依赖版本或新增约定外依赖；无法仅凭输出判断是否实际发生下载。
6. 先点加载课程环境，运行 npm.cmd run build：Vite 8.3.0 构建成功，退出码 0，转换 12 个模块，输出 HTML、CSS、JS 到 dist/，用时 229ms。
7. 同一命令块执行 git init：成功创建项目根目录的独立 .git。随后 git rev-parse --show-toplevel、git status --short、git check-ignore node_modules/ dist/、git diff --check 因沙箱账户与目录所有者不同，出现 dubious ownership 或非仓库诊断，整个命令块退出码 1；这不改变第 6 项构建成功的结果。
8. 使用仅对单次命令生效的 git -c safe.directory=C:/Users/Administrator/Documents/Codex/course-task-board 前缀，重新执行 rev-parse --show-toplevel、status --short --untracked-files=all、check-ignore node_modules/ dist/、diff --check：仓库根目录正确，12 个项目文件未跟踪，node_modules/ 和 dist/ 已忽略。没有修改全局 Git 配置。普通 git diff --check 不覆盖未跟踪文件，另做第 11 项检查。
9. 先点加载课程环境，执行 npm.cmd ls --depth=0：退出码 0，五个顶层依赖均为约定的精确版本。
10. 先点加载课程环境，执行 npm.cmd run dev -- --host localhost --port 5173 --strictPort：Vite 8.3.0 在 327ms 后 ready，地址为 http://localhost:5173/，端口未切换。Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing 返回 HTTP 200，HTML 包含标题“任务管理”。这是 HTTP 检查，不是浏览器渲染或 Console 验收。
11. 用 git ls-files --others --exclude-standard 获取新增文件，再逐个执行 git diff --no-index --check -- /dev/null <文件>。首次脚本把表示差异的退出码 1 误判为检查失败，停在 .gitignore，同时收到 LF/CRLF 提示；未据此修改文件。纠正判断，使用同一 safe.directory 前缀和单命令 -c core.autocrlf=false，按诊断内容与退出码大于 1 判断异常：12 个新增文件均无空白错误诊断，脚本退出码 0。随后 Get-Content 复读 package.json、vite.config.js、index.html、三个 src 文件与 .gitignore，核对范围与配置。

所有涉及 Node/npm 的命令块均先执行以下原始环境加载命令：

```powershell
. 'C:\Users\Administrator\Documents\Codex\2026-09-22\agent-x20\outputs\environment\Enter-CourseEnv.ps1'
```

### diff 摘要

从空目录新增 12 个项目文件：6 个必需工程文件、package-lock.json、.gitignore、AGENTS.md 和 3 个 docs 文档；没有修改既有业务代码。仓库尚无首个提交且文件未暂存，因此普通 git diff 为空，不代表没有新增文件；审查依据为未跟踪文件清单和文件内容。

### 验证状态

- 测试尚未建立；未运行零用例测试，不声称业务测试通过。
- lint/typecheck：未配置。
- 安装：回退到 prefer-offline 后成功；顶层依赖版本核对通过。
- 构建：通过；开发服务已启动于固定地址，HTTP 检查为 200。
- 浏览器：待用户人工验收；没有执行或声称浏览器验收通过。
- Git：独立仓库已初始化，根目录核对完成，忽略规则有效；未暂存、未提交、未推送。

### 待用户人工验收

1. 打开 http://localhost:5173，浏览器标签为“任务管理”，页面有中文标题“任务管理”。
2. 标题较大且加粗；浅灰页面上有白色圆角区域；“从这里开始安排任务”为浅蓝背景、蓝色文字的圆角标签，证明 Tailwind 样式生效。
3. 打开开发者工具 Console，检查是否存在应用报错；刷新后页面正常。
4. 本轮只有静态展示，没有任务操作控件。

等待用户反馈；通过后记录为“用户人工验收”，再根据用户确认进行本轮提交并记录真实哈希。
