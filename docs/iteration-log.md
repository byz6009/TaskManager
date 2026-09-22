# TaskManager 迭代记录

项目于第 2 轮按用户要求命名为 TaskManager（npm 包名 taskmanager）。下方第 0、1 轮的命令、路径与结果保留当时事实。

第 2 轮开始时只读核对：工作区干净，已有提交 f9a3e17（chore: 初始化 Vue 项目与开发配置）。这补充了第 1 轮结束时“未提交”的历史记录；该提交不是本轮创建的，未据此推断浏览器人工验收已通过。

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

## 第 2 轮：TaskManager 任务列表与 CRUD（2026-09-22）

### 基线、目标与边界

- 先读取 AGENTS.md，检查目录、现有源文件与契约。当前目录仍为 C:\Users\Administrator\Documents\Codex\course-task-board。
- git status --short --untracked-files=all 无输出，git log -1 --oneline 返回 f9a3e17 chore: 初始化 Vue 项目与开发配置。这是本轮开始前已存在的提交；本轮没有补做上一轮提交或推断其浏览器验收结果。
- 用户要求项目名称统一为 TaskManager。界面、HTML 标题和文档同步命名；npm 元数据采用小写 taskmanager。物理目录和已确认存储键不变，数据契约无变更。
- 本轮仅实现内存 CRUD、中文状态、优先级标签、独立编辑草稿、空列表提示和真实测试，不实现存储、看板拖拽或主题，不安装依赖。

### 实际修改文件与 diff 摘要

修改 9 个已跟踪文件：

- AGENTS.md、docs/task-brief.md、docs/contract.md、docs/iteration-log.md：TaskManager 命名、当前轮次状态、接入说明和真实证据。
- package.json、package-lock.json：仅改项目名称；五个依赖及其版本未变，锁文件依赖内容未变。
- index.html：浏览器标题为 TaskManager · 任务管理。
- src/App.vue：接入唯一任务集合、创建/保存/取消/删除事件，显示任务计数、空列表和操作反馈，列表 key 为 task.id。
- src/style.css：表单控件与键盘焦点样式。

新增 6 个文件：

- src/domain/taskRules.js：纯函数 validateTaskInput，中文枚举选项；标题 trim、描述缺失为空串、枚举检查及错误顺序遵循契约。
- src/composables/useTasks.js：Vue 响应式内存集合；新建与编辑复用校验；UUID 标识；编辑保持 id；按 id 删除。
- src/components/TaskForm.vue：新建/编辑共用表单，默认 todo/medium，复制字段为独立草稿。
- src/components/TaskCard.vue：显示所有任务字段、中文状态、高红/中黄/低绿标签，发出编辑/删除 id。
- tests/taskRules.test.js：8 个校验行为用例。
- tests/useTasks.test.js：5 个内存集合行为用例。

### 实际命令与结果

所有下列 Node/npm 命令均在同一个 PowerShell 命令块先点加载：

```powershell
. 'C:\Users\Administrator\Documents\Codex\2026-09-22\agent-x20\outputs\environment\Enter-CourseEnv.ps1'
```

1. Get-Location、Get-Content、rg --files：读取规则、现有源码、契约和日志，确认目录与基线。
2. Git 命令使用单命令前缀 git -c safe.directory=C:/Users/Administrator/Documents/Codex/course-task-board；执行 status --short --untracked-files=all 和 log -1 --oneline，结果见基线。未修改全局 Git 配置。
3. 使用 apply_patch 新增/修改上述文件。rg -n 'course-task-board|TaskManager|taskmanager' package-lock.json AGENTS.md docs index.html package.json 与 Get-Content package-lock.json：核对项目名，发现锁文件两处旧名称并同步修正。保留的 course-task-board 均为真实路径、历史记录或已确认存储键。
4. 第一遍 node --test tests/taskRules.test.js tests/useTasks.test.js：14 个用例通过、0 失败、0 跳过；npm.cmd test 同为 14 个通过；npm.cmd run build 成功，转换 15 个模块，221ms。
5. 自审移除一个只验证普通对象副本的低价值测试，因为它不能证明 Vue 取消按钮接线正确。取消编辑明确留待浏览器人工验收；没有因业务测试失败而删改预期。
6. 最终 node --test tests/taskRules.test.js tests/useTasks.test.js：13 个用例，13 通过、0 失败、0 取消、0 跳过，退出码 0。
7. 最终 npm.cmd test：13 个用例，13 通过、0 失败、0 取消、0 跳过，退出码 0。
8. 最终 npm.cmd run build：退出码 0，Vite 8.3.0 转换 15 个模块，105ms；dist/index.html 0.41 kB、CSS 14.08 kB、JS 73.25 kB。
9. Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 10：复用仍在运行的服务，HTTP 200，HTML 包含 TaskManager。没有新启服务或更换端口。这不是浏览器交互验证。
10. git diff --stat、git diff --check、git diff -- <本轮已跟踪文件>：检查名称、源码和文档变更。check 无空白错误，Git 提示 LF 将转为 CRLF，不属于测试失败。新增文件另按未跟踪清单与内容检查，普通 diff 不包含它们。
11. 最终使用单命令 -c core.autocrlf=false 进行 git diff --check，并用 ls-files --others --exclude-standard 配合逐文件 diff --no-index --check -- /dev/null <文件> 检查 6 个新增文件：均无空白诊断，脚本退出码 0。status --short --untracked-files=all 显示 9 个修改文件、6 个新增文件；diff --cached --stat 无输出，确认没有暂存内容。

### 验证范围与尚未验证项

- 已验证：校验规则与错误顺序；合法状态/优先级；两条写入路径拒绝非法数据且不改变集合；创建唯一 id；编辑 id 和数量不变且其他任务不变；删除仅影响目标；不存在 id 的错误处理；生产构建。
- 尚未验证：浏览器真实输入、显示颜色、保存/取消按钮接线、删除按钮与控制台。HTTP 200 和 Node 测试不替代这些操作。
- lint/typecheck 未配置。本轮仅内存数据，刷新清空是明确的阶段限制。
- 未暂存、未提交、未推送；等待用户人工验收后再提交本轮。

### 浏览器人工验收步骤

1. 打开 http://localhost:5173，看到 TaskManager 标题、0 项任务和“还没有任务”。新建表单默认待办/中。
2. 标题填写带首尾空格的“  整理需求  ”，描述留空，直接创建：标题去掉两端空格，状态待办，优先级黄色“中”，显示“暂无描述”。
3. 新建“实现功能”，优先级高；新建“准备汇报”，优先级低。检查红色“高”、黄色“中”、绿色“低”均有文字。
4. 新建时仅输入空格标题：显示错误提示，任务数量不增加。
5. 编辑“整理需求”，修改标题、描述、状态为进行中、优先级为高并保存：同一张任务更新，总数量不变，其他两项不变。再编辑为完成，核对中文状态。
6. 编辑任意任务，改动四个字段后点击取消：卡片仍显示修改前内容；重新打开编辑，仍是原内容。
7. 编辑任务时将标题改为纯空格并保存：拒绝保存，原任务不变；取消后能继续新建。
8. 删除其中一项：只减少一项，其他任务内容不变；删除正在编辑的任务时表单回到新建；全部删除后恢复空列表提示。
9. 再创建一项后刷新：本轮应清空。检查浏览器 Console 无应用错误。

下一步：等待用户反馈。通过后标记“用户人工验收”，按用户确认提交 feat: add task CRUD；出现问题则先复现和最小修复，不提前进入持久化轮次。
