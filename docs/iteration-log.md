# TaskManager 迭代记录

## 最终核对索引（第 6 轮）

以下提交由最终审查时 git log --stat 核实。后文每轮“未提交/待验收”是当轮结束时的历史快照；这里补充后续已存在的提交，不代表这些提交由本轮创建，也不代表用户人工验收已确认。

| 轮次 | 用户提示词摘要 | 实际改动摘要 | 当轮验证摘要 | 对应实际提交 |
| --- | --- | --- | --- | --- |
| 0 | 只读规划，任务单、契约、分轮计划 | 无文件变更，空目录基线 | 尚无代码和测试 | 无；确认文档在第 1 轮落盘 |
| 1 | 最小 Vue/Vite/Tailwind 骨架，固定版本，等待浏览器反馈 | 工程入口、规则与文档，12 文件 | 构建通过；无测试用例；HTTP 200 | f9a3e17 chore: 初始化 Vue 项目与开发配置 |
| 2 | TaskManager 命名、内存 CRUD、统一输入校验 | 组件、集合、纯校验和测试，15 文件 | 最终 13 项通过，构建通过 | 020c846 feat: 实现任务增删改查及输入校验 |
| 3 | localStorage，先恢复后保存，坏数据保护 | 解析/编码、接入和测试，7 文件 | 定向 15、全量 28 通过，构建通过 | fca9b19 feat: 使用 localStorage 保存和恢复任务数据 |
| 4 | 三列看板、原生拖拽、移动不变量 | 看板、moveTask、接入与测试，11 文件 | 定向 31、全量 36 通过，构建通过 | 9f7daf6 feat: 添加三列看板与拖拽状态切换 |
| 5 | 主题记忆、可读性及必要界面收尾 | 主题模块、样式和文档，9 文件 | 全量 36 通过、构建通过；Agent 浏览器双向主题/刷新和 360px 检查 | b2b694c feat: 支持深浅主题切换并保存用户选择 |
| 6 | 最终验收、只读审查、README/审查/汇报材料 | 仅整理 README、review、iteration-log | 本轮命令及浏览器证据见末尾，用户人工确认待补 | 尚未提交，等待最终确认 |

所有轮次均未获得本对话内逐项用户人工验收反馈。Agent 的浏览器验证单独记录，不能回填为“用户人工已验证”。

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

## 第 3 轮：localStorage 任务持久化（2026-09-22）

### 基线、计划与范围

- 读取 AGENTS.md、当前源文件、契约和测试后再开发。起始工作区干净，已有第 2 轮提交 020c846（feat: 实现任务增删改查及输入校验），上一条为 f9a3e17；这些提交均非本轮创建。不据提交存在推断人工浏览器验收结果。
- 按原契约实现纯解析/序列化，使用 course-task-board.tasks.v1。启动先恢复，成功后才监听保存；加载失败保留原值并暂停写入。保留第 2 轮所有 CRUD 行为，不新增依赖、后端、拖拽或主题。

### 实际修改文件与 diff 摘要

新增 2 个文件：

- src/storage/taskStorage.js：固定存储键，parseTaskData 纯解析与字段/枚举/id 唯一性校验，encodeTaskData 直接返回 JSON 字符串；无 window 依赖。
- tests/taskStorage.test.js：15 个存储相关用例，包含纯函数和注入模拟存储的接入测试。

修改 5 个文件：

- src/composables/useTasks.js：可注入存储访问函数，先读取再监听；所有成功修改统一同步保存；读取、解析、编码和写入错误处理；只读错误提示状态。
- src/App.vue：传入浏览器 localStorage 访问函数，显示持久化说明和存储错误提示。
- docs/contract.md：记录第 3 轮实现进度与接入细节，纯函数契约和存储键不变。
- docs/task-brief.md：更新目录和轮次进度。
- docs/iteration-log.md：补充本轮实际证据。

### 实际命令与结果

所有涉及 Node/npm 的命令块先执行：

```powershell
. 'C:\Users\Administrator\Documents\Codex\2026-09-22\agent-x20\outputs\environment\Enter-CourseEnv.ps1'
```

1. Get-Content 读取项目规则、useTasks、taskRules、App、contract、useTasks 测试与日志；rg --files -g AGENTS.md -g '!node_modules' -g '!dist' 只发现根目录 AGENTS.md。
2. 使用单命令 git -c safe.directory=C:/Users/Administrator/Documents/Codex/course-task-board 前缀执行 status --short --untracked-files=all、log -2 --oneline：状态为空，提交结果见基线；未修改全局配置。
3. 使用 apply_patch 创建和修改上述文件。
4. node --test tests/taskStorage.test.js：15 项通过，0 失败、0 取消、0 跳过，退出码 0。
5. npm.cmd test：28 项通过（原 13 项全部保留），0 失败、0 取消、0 跳过，退出码 0。
6. npm.cmd run build：成功，退出码 0；Vite 8.3.0 转换 16 个模块，108ms；HTML 0.41 kB、CSS 14.50 kB、JS 74.71 kB。
7. rg -n '第 2 轮|第 3 轮|规划|内存|刷新' docs/task-brief.md docs/contract.md：定位需要更新的进度说明。git -c safe.directory=... -c core.autocrlf=false diff -- src/composables/useTasks.js src/App.vue：审查恢复顺序、写入路径与页面接线。
8. Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 10：HTTP 200，复用现有开发服务，没有启动新服务或改端口。这不证明浏览器交互或持久化已验收。
9. git diff --check（单命令 core.autocrlf=false）及针对未跟踪文件的逐个 git diff --no-index --check -- /dev/null <文件>：5 个修改文件和 2 个新增文件无空白错误，命令块退出码 0。git status --short --untracked-files=all、git diff --stat 确认本轮范围；git diff --cached --stat 为空，未暂存。

### 已验证与尚未验证

- Node 测试覆盖 null、合法空数组、正常往返、中文/换行、损坏 JSON、非法结构/字段/枚举、重复 id、编码异常；缺失描述仍按既有契约转为空串。
- 注入存储测试确认：初始化仅读取不写入；CRUD、单独状态与优先级修改会保存；删除最后一项保存 []；重新初始化能恢复保存结果；损坏数据后的临时 CRUD 不覆盖原值；其他存储键不变；访问存储对象/getItem/setItem 抛错会捕获；写失败保留内存修改，下次成功修改清除错误；被校验拒绝的操作不写入。
- Node 模拟异常验证的是接入逻辑和错误状态，并非真实浏览器白屏、权限、容量或提示显示的验收。
- 尚未验证：真实浏览器分别增改删后刷新、取消编辑回归、存储错误提示显示、控制台；等待用户人工操作。
- lint/typecheck 未配置。加载失败后暂停当前会话自动写入；修复存储或权限后刷新重新加载。写失败期间刷新可能丢失尚未保存的内存修改，页面会提示。
- 本轮未安装依赖，未暂存、未提交、未推送。

### 浏览器验收步骤

请始终在同一浏览器使用 http://localhost:5173：

1. 新建“持久化任务 A”，描述留空，优先级高；再新建“持久化任务 B”。按 F5，预期两项仍在且字段正确。
2. 修改 A 的标题、描述，保存后 F5，预期新内容保留，任务数量不变。再分别修改状态为进行中、优先级为低，每次保存后刷新，确认对应中文状态和绿色“低”保留。
3. 编辑 A，改动内容后取消，再 F5，预期仍为上次已保存内容；纯空格标题保存被拒绝，刷新后原任务不变。
4. 删除 A 后 F5，预期 A 不再出现，B 保持不变。
5. 删除最后的 B 后 F5，再刷新一次，预期仍为空列表，无示例任务复活。若原来还有其他测试任务，逐项删除后再验证最后一项。
6. 在开发者工具 Application → Local Storage 中查看 course-task-board.tasks.v1：应为任务 JSON 数组，全部删除后值为 []。检查 Console 无应用错误。
7. 可选异常验收：只对测试数据进行，先备份该键的原始值，再将其临时改为无效 JSON 并刷新。预期显示错误提示；临时新建任务后，原无效值仍保持不变。随后恢复备份的准确值（原先无键则仅移除这个测试键）并刷新，恢复正常。不要清空整个 localStorage。

下一步：等待用户反馈，记录实际人工验收；有问题先修复，确认通过后再提交 feat: persist tasks in localStorage。

## 第 4 轮：三列看板与原生拖拽（2026-09-22）

### 基线与范围

- 先读取 AGENTS.md、源码、契约及测试。起始工作区干净，已有提交 fca9b19（feat: 使用 localStorage 保存和恢复任务数据），前一条为 020c846。这些提交不是本轮创建，不据此补记未经反馈的浏览器验收结果。
- 用三列看板替换原列表，仍只有 useTasks 一份任务集合。原生 HTML Drag and Drop，不安装依赖，不改字段、枚举、Result 或存储键，不提前添加主题。
- 同列放下不更新数组也不写存储；正常移动只改目标 status，既有存储错误保护继续生效。

### 实际修改文件与 diff 摘要

新增 1 个文件：src/components/TaskBoard.vue。展示待办/进行中/完成、列计数和空列区域，处理拖拽 id、放置提示与清理，按契约发出 move/edit/delete。

修改 10 个文件：

- src/domain/taskRules.js：增加 moveTask，先检查状态再找 id；同列返回原数组，跨列仅替换目标任务对象。
- src/composables/useTasks.js：增加 changeTaskStatus 接入纯函数和现有保存路径。
- src/App.vue：以 TaskBoard 替换列表，接收 move 并处理结果，保留表单与总计数，调整看板布局宽度。
- src/components/TaskCard.vue：编辑/删除按钮保留点击事件并阻止自身拖动。
- src/components/TaskForm.vue：按任务 id 切换草稿；正在编辑的任务被拖动时只同步状态，不覆盖其他草稿字段。
- tests/taskRules.test.js：新增 5 项状态转换规则测试。
- tests/taskStorage.test.js：新增 3 项移动接入测试，已有损坏存储保护测试增加移动操作。
- docs/contract.md、docs/task-brief.md、docs/iteration-log.md：实现进度、接入说明和实际证据。

### 实际命令与结果

每个 Node/npm 命令块先点加载：

```powershell
. 'C:\Users\Administrator\Documents\Codex\2026-09-22\agent-x20\outputs\environment\Enter-CourseEnv.ps1'
```

1. Get-Content 读取 AGENTS.md、taskRules、useTasks、TaskCard、App、taskRules/taskStorage 测试、contract 与 iteration-log；rg --files -g AGENTS.md -g '!node_modules' -g '!dist' 只发现根目录规则。
2. git -c safe.directory=C:/Users/Administrator/Documents/Codex/course-task-board status --short --untracked-files=all：无输出。相同前缀 log -2 --oneline 返回上述基线。未修改全局 Git 配置。
3. apply_patch 完成上述实现与测试。
4. node --test tests/taskRules.test.js tests/taskStorage.test.js：31 项通过，0 失败、0 取消、0 跳过，退出码 0。
5. npm.cmd test：36 项通过，0 失败、0 取消、0 跳过，退出码 0；原有校验、CRUD 和存储用例均保留。
6. npm.cmd run build：成功，退出码 0；Vite 8.3.0 转换 17 个模块，112ms；HTML 0.41 kB、CSS 16.96 kB、JS 78.39 kB。
7. rg -n '第 3 轮|第 4 轮|目录规划|拖拽|moveTask' docs/task-brief.md docs/contract.md：定位进度说明。git diff（单命令 safe.directory 与 core.autocrlf=false）审查 App、TaskForm、TaskCard、taskRules、useTasks 改动，核对真实 drop → 事件 → changeTaskStatus → moveTask → 已有保存的接线。
8. Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 10：HTTP 200，复用现有服务，未更改端口。未执行浏览器鼠标操作或截图。
9. git diff --check 及新增文件的 git diff --no-index --check -- /dev/null <文件>（单命令 safe.directory 与 core.autocrlf=false）：无空白诊断，命令块退出码 0。status --short --untracked-files=all 与 diff --stat 确认 10 个修改文件、1 个新增文件；diff --cached --stat 无输出，未暂存。

### 验证范围与限制

- 纯函数验证：跨列后数量/id 集合不变、仅目标 status 改变、其他任务和输入不变；连续移动不丢不重；同列返回原数组；无效 id/状态不修改输入；错误优先顺序符合契约。
- 存储接入验证：多次移动被保存，重新初始化恢复新状态，移动后仍能编辑/删除；同列和非法操作不写存储；写入失败沿用错误提示；加载损坏数据后移动仍不会覆盖原值。
- 未验证：真实桌面鼠标拖拽、空列命中、放置高亮与取消清理、拖拽时编辑草稿保留、真实浏览器刷新、按钮点击及控制台。Node 测试不等于上述浏览器验收。
- 窄窗口保留三列并允许看板区域横向滚动；手机触摸拖拽不在本轮验收范围，表单状态选择器仍可用。lint/typecheck 未配置。
- 本轮未安装依赖，未暂存、未提交、未推送。

### 浏览器验收步骤

在桌面 Edge 使用 http://localhost:5173，沿用现有数据，不清空 localStorage：

1. 检查待办、进行中、完成三列和各列数量，合计与总任务数一致。新建两项待办任务，确保至少一个目标列为空（可用表单移动现有任务）。
2. 从卡片标题或内容区域拖动：待办 → 进行中 → 完成。目标列应高亮并显示放置提示；松开后卡片仅出现一次，状态和计数更新，总数不变。
3. 拖到没有卡片的空列，确认也能放置。连续来回移动同一任务，确认不丢失、不复制，其他任务内容不变。
4. 原列放下，内容与计数不变；拖出看板松开或按 Esc 取消，状态不变且卡片透明效果/列高亮消失。
5. 跨列移动后 F5，确认卡片留在新列，字段与总数正确。
6. 拖动后点编辑，修改标题/描述/优先级并保存；用表单状态选择器改列，确认仍有效。取消编辑不改变任务内容。删除一个任务，只减少该任务。
7. 打开某任务编辑，先改标题和描述但不保存，再拖动该任务：表单保留这些草稿，状态同步新列。取消编辑时草稿丢弃，但已完成的拖拽状态保留。
8. 检查高/中/低颜色标签和 Console；拖拽结束后无残留高亮，页面无应用错误。

下一步：等待用户反馈；有问题先复现和最小修复，用户确认后再记录人工验收并提交 feat: add draggable kanban board。

## 第 5 轮：深浅主题记忆与界面收尾（2026-09-22）

### 基线、目标和范围

- 开始时读取 AGENTS.md 与当前界面、契约、文档；工作区干净，已有第 4 轮提交 9f7daf6（feat: 添加三列看板与拖拽状态切换），前一条为 fca9b19。这些提交不是本轮创建，不推断用户人工验收结果。
- 提供一键切换，使用 course-task-board.theme.v1 保存 light/dark，优先恢复合法选择，默认浅色。Tailwind 4 class 驱动 dark 变体，切换 html 根元素 dark 类。
- 补齐现有界面的深色样式，保持红/黄/绿优先级语义和文字；改善窄窗口、长标题与焦点显示。当前应用没有弹窗，因此弹窗验收不适用，不额外新增弹窗。

### 实际文件与 diff 摘要

新增 1 个文件：src/composables/useTheme.js，负责主题恢复、根元素类更新、选择保存和异常提示。主题状态独立，不改变任务业务逻辑。

修改 8 个文件：

- src/App.vue：接入主题切换按钮与错误提示，补充页面深色颜色，页头可换行。
- src/style.css：Tailwind 4 自定义 dark 变体、根元素 color-scheme、表单控件与焦点样式。
- src/components/TaskForm.vue：表单、标签、错误提示和按钮的深色样式与窄窗口宽度约束。
- src/components/TaskCard.vue：卡片、状态、优先级、操作按钮的深色样式；保留长标题自动折行。
- src/components/TaskBoard.vue：列背景、计数、拖拽提示和空列的深色样式；滚动区域可通过键盘聚焦，保留横向滚动。
- docs/contract.md、docs/task-brief.md、docs/iteration-log.md：主题接入说明、进度和真实验证记录。

### 实际命令与结果

Node/npm 命令块均先执行：

```powershell
. 'C:\Users\Administrator\Documents\Codex\2026-09-22\agent-x20\outputs\environment\Enter-CourseEnv.ps1'
```

1. Get-Content 读取 AGENTS.md、main.js、style.css、App、TaskForm、TaskCard、TaskBoard、contract、task-brief、iteration-log；rg --files -g AGENTS.md -g '!node_modules' -g '!dist' 只发现根目录规则。
2. Git 使用单命令前缀 git -c safe.directory=C:/Users/Administrator/Documents/Codex/course-task-board；status --short --untracked-files=all 无输出，log -2 --oneline 返回上述提交。未修改全局 Git 配置。
3. 使用 apply_patch 完成主题逻辑和样式修改。
4. npm.cmd test：36 项通过，0 失败、0 取消、0 跳过，退出码 0。未修改既有测试预期。
5. npm.cmd run build：成功，退出码 0；Vite 8.3.0 转换 18 个模块，115ms；HTML 0.41 kB、CSS 21.35 kB、JS 80.92 kB。
6. git diff --stat 及 git diff -- src/style.css src/App.vue src/components/TaskBoard.vue src/components/TaskCard.vue src/components/TaskForm.vue（单命令 core.autocrlf=false）：核对主题和布局改动。
7. git diff --exit-code -- src/domain/taskRules.js src/composables/useTasks.js src/storage/taskStorage.js tests package.json package-lock.json：无输出、退出码 0，确认任务规则、存储逻辑、已有测试和依赖没有改动。
8. 最终 git diff --check 和新增文件逐项 git diff --no-index --check -- /dev/null <文件>（单命令 safe.directory 与 core.autocrlf=false）：无空白诊断，退出码 0。status --short --untracked-files=all 和 diff --stat 确认 8 个修改文件、1 个新增文件；diff --cached --stat 为空，未暂存。

### Agent 浏览器预览：实际执行

通过 cua_repl 在后台新建 Codex 内置浏览器标签，访问 http://localhost:5173，读取本地开发和 viewport 文档。以下是 Agent 的预览检查，不标为用户人工验收：

- 初始显示浅色与空看板；点击深色按钮、reload，按钮仍为启用状态，截图显示深色背景、表单与空列。
- 经页面表单创建 3 个“主题验收”临时任务，覆盖高/中/低和三种状态；高优先级任务标题为“主题验收-”加 5 次连续 LongTitleWithoutSpaces。截图检查深色卡片、红/黄/绿中文标签、长标题折行及按钮，未见标题撑宽卡片。
- 切回浅色、reload，按钮恢复未启用状态，截图显示浅色并保留测试任务；核对同样的优先级和长标题。
- viewport.set({ width: 360, height: 800 }) 后观察表单和页头。聚焦看板并按 ArrowRight，DOM 只读测量：页面 scrollWidth 与 clientWidth 均 345px（360px 视口扣除滚动条），看板可见宽 313px、内容宽 750px，scrollLeft 大于 0；页面无整体横向溢出，看板内部可滚动。
- 窄窗口切深色、空标题提交，截图确认错误提示和按钮可读；任务数保持 3。恢复 viewport 默认值；打开中优先级任务编辑、填写描述草稿后取消，卡片仍为“暂无描述”。
- 经页面删除本次创建的 3 个临时任务，恢复空看板；切回浅色并 reload，仍为空且保持浅色。未操作用户其他浏览器标签，未使用 localStorage.clear()。
- themePage.dev.logs({ levels: ['error', 'warn'], limit: 20 }) 返回 []，本次捕获的错误/警告为 0。
- 临时 viewport 已 reset，临时预览标签已关闭。截图仅用于本次工具内观察，未另存截图文件。

### 尚未验证与限制

- 用户日常浏览器中的双向切换/刷新、深浅主题下完整 CRUD 与真实拖拽回归，仍待用户验收。
- 本轮没有实际模拟浏览器禁用存储或容量不足；主题异常分支已实现，但浏览器异常提示尚未执行验证。未把原有任务测试算作主题测试。
- 当前无应用弹窗；原生下拉选择器使用 color-scheme 随主题变化，不另加弹窗功能。
- lint/typecheck 未配置。未新增依赖、未发布、未推送；本轮未暂存或提交。

### 用户浏览器验收步骤

1. 在同一浏览器打开 http://localhost:5173。处于浅色时点击“切换深色”，按 F5；预期仍深色，按钮显示“切换浅色”。
2. 点击“切换浅色”，再 F5；预期仍浅色，按钮显示“切换深色”。可在 Local Storage 核对 course-task-board.theme.v1 对应 dark/light。
3. 两种主题分别查看背景、文字、卡片、表单、下拉框、操作按钮、空标题错误提示及高红/中黄/低绿标签。
4. 切换主题后尝试新建、编辑保存、取消、删除和跨列拖拽，再刷新；任务内容和状态仍正确。主题切换不应清空编辑中的草稿。
5. 用长中文或连续英文标题查看卡片；缩窄窗口至约 360px，表单按钮可操作，看板可横向滚动。使用已有空列查看提示，不必删除自己的任务。
6. 检查 Console，确认无应用错误。当前没有弹窗，无须额外寻找弹窗入口。

下一步：等待用户反馈；确认通过后记录用户人工验收并提交 feat: add persistent dark mode。

## 第 6 轮：最终验收与交付文档（2026-09-22）

### 提示词摘要、基线与只读审查

- 用户要求：对照 R1–R6 审查现有实现，执行测试和构建，核查 Git 与实际测试数量；整理 README、每轮记录、review 和 5–10 分钟汇报提纲。只修具体失败，等待最终确认后提交。
- 开始时工作区干净，分支 main，HEAD 为 b2b694c；最近五条提交为 b2b694c、9f7daf6、fca9b19、020c846、f9a3e17，完整对应关系见本文开头。没有将已有提交等同于用户人工验收。
- 先读取 AGENTS.md、全部业务/存储/组件实现、配置、测试和已有文档，再检查 Git 历史与 diff。审查标题校验复用、id 稳定性、移动不变性、先恢复后监听、损坏数据保护、主题恢复及样式。
- 未发现需要修复的具体功能失败。发现的交付缺项为 README、独立审查记录及最终提交索引，因此本轮仅补齐文档，不改变代码、测试或依赖。

### 实际改动

- 新增 README.md：项目用途、精确技术栈、课程环境安装/启动/测试/构建命令、存储方式、目录和已知限制。
- 新增 docs/review.md：R1–R6 与 T01–T18 证据表、审查发现及修改原因、未覆盖范围、审查重点、回滚方法和约 8 分钟汇报提纲。
- 更新 docs/iteration-log.md：每轮提示词摘要/实际改动/验证/真实提交索引，以及本轮实际记录。保留历史轮次当时的状态，不追写不存在的验收或提交。

### 实际命令与结果

所有 Node/npm 命令块先点加载课程环境：

```powershell
. 'C:\Users\Administrator\Documents\Codex\2026-09-22\agent-x20\outputs\environment\Enter-CourseEnv.ps1'
```

Git 命令使用单命令配置 `-c safe.directory=C:/Users/Administrator/Documents/Codex/course-task-board`；diff 检查另使用 `-c core.autocrlf=false`，未修改全局配置。

1. Get-Content / rg --files：读取规则、实现、配置、全部已有测试和文档，确认实际目录与功能接线。
2. git status --short --untracked-files=all、git log、git log --stat、git diff --stat、git branch --show-current：开始时无未提交改动，main 分支，最近提交如基线所述。
3. npm.cmd test：实际发现并执行 36 项，pass 36、fail 0、cancelled 0、skipped 0，退出码 0。taskRules 13 项、useTasks 5 项、taskStorage 18 项；不是零用例或全部跳过。
4. npm.cmd run build：退出码 0，Vite 8.3.0 转换 18 个模块，118ms；HTML 0.41 kB、CSS 21.35 kB、JS 80.92 kB。
5. npm.cmd run：仅列出 dev、build、test；lint 与 typecheck 均未配置，不标记为通过。
6. git diff --check：初次审查无空白问题。通过 apply_patch 写入以上三份文档后，再核对最终差异和新增文件。
7. 最终 git diff --check、新增文件逐项 git diff --no-index --check -- /dev/null <文件> 均无空白诊断；git diff --exit-code -- src tests package.json package-lock.json vite.config.js 无输出、退出码 0。status 显示仅修改 docs/iteration-log.md，新增 README.md、docs/review.md；diff --cached --stat 为空。git log -5 --oneline 再次确认原有五条提交；命令块退出码 0。Get-Content 复核三份文档，并用 rg 核对 R1–R6、首轮 ENOTCACHED 和课程环境版本的历史依据。

### Agent 浏览器检查：实际执行

使用 cua_repl 新建后台 Codex 内置浏览器标签，访问现有 http://localhost:5173 服务。本轮开始时该浏览器为空列表、浅色；只创建和清理本轮自己的临时任务，未清空存储或操作其他用户标签。

- 空标题和纯空格标题提交均显示校验错误，任务数保持 0。
- 新建标题带首尾空格的 A，描述留空、优先级高；显示 trim 后的标题、“暂无描述”和高标签；刷新仍为 1 项。
- 新建 B，默认待办/中；编辑 A 的标题、描述、状态为进行中、优先级为低，保存并刷新，仍为 2 项且字段正确。编辑草稿后取消，原任务保持保存后的值。
- 实际鼠标将 A 从进行中拖到空的完成列，再来回跨列拖动；同列放下无数量或内容变化，总数始终为 2，B 保持原值；刷新恢复 A 的完成状态。
- 切换深色后刷新，主题保持；深色下实际拖动 A 回进行中，再编辑描述并保存。删除 B 后刷新，仅保留 A 及新描述。
- 删除最后一个 A 并刷新，仍为空列表；切回浅色并刷新，仍为空且保持浅色。
- 本次浏览器捕获的 error/warn 日志为 []；截图在工具中观察，未保存截图文件；临时标签已关闭。
- 长标题、三种优先级配色、360×800 窄窗口与看板横向滚动沿用第 5 轮实际浏览器记录；本轮没有修改相应代码，不把此前操作冒充本轮重测。

### 证据状态、待人工验收与停止条件

- 命令已验证：36 项实际断言测试、构建；lint/typecheck 为“未配置”。Agent 浏览器检查与用户人工验收分栏，详细见 docs/review.md。
- 用户人工已验证：当前对话尚未收到明确的最终通过反馈；不能用已有提交或下一轮指令替代该证据。
- 尚未验证：用户日常桌面浏览器最终回归、真实浏览器存储损坏/权限/容量异常、主题异常分支独立测试、Esc/失焦取消拖拽、编辑草稿与拖拽并行的组合行为。截图没有另存归档。
- 人工步骤：新建两个任务并刷新；编辑一项后刷新并核对另一项；取消编辑并检查未保存草稿不生效；跨列拖动到空列、反复拖动、同列放下并刷新；删除一项后刷新，删除本次最后一项后再刷新；分别执行浅→深→刷新、深→浅→刷新；检查三种优先级文字/颜色、长标题和窄窗口操作。保留自己的原有任务，勿为验收清空 localStorage。
- 约 8 分钟汇报提纲见 docs/review.md；其中时间是建议发言分配，不是开发耗时。
- 本轮未安装依赖、未改应用代码、未暂存、未提交、未发布或推送。停止于等待用户最终确认；确认后再提交本轮三份文档，如有具体失败先复现和最小修复。
