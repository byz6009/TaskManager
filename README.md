# TaskManager

软件工程课堂实践：使用 Vue 3、Vite、Tailwind CSS 4 和 JavaScript 分轮开发的纯前端任务管理应用。

## 功能

- 创建、查看、编辑、取消编辑、删除任务；标题去除首尾空格后必填，描述可空。
- 待办、进行中、完成三列看板，显示每列数量；桌面原生拖拽或表单选择器改变状态。
- 高/中/低优先级，分别显示红/黄/绿及中文标签。
- 深浅主题一键切换；任务和主题选择使用浏览器 localStorage 保存。
- 长标题自动折行；窄窗口下表单纵向排列，看板可横向滚动。

## 技术栈

| 项目 | 当前版本/方式 |
| --- | --- |
| Vue | 3.5.43，自带响应式状态 |
| Vite | 8.3.0 |
| @vitejs/plugin-vue | 6.0.9 |
| Tailwind CSS / @tailwindcss/vite | 4.3.3 / 4.3.3 |
| JavaScript | ES modules |
| 测试 | Node 内置 node:test、node:assert/strict |

本机课程环境报告 Node v24.19.0、npm 12.0.2。依赖使用精确版本并保存 package-lock.json，无后端、状态管理库、拖拽库或额外测试框架。

## 安装与运行

以下命令适用于当前 Windows 课程环境。每个 PowerShell 命令块必须先点加载课程脚本，使用 npm.cmd；不要假设普通终端已有 Node/npm。

首次安装（已有依赖时无需重复安装）：

```powershell
. 'C:\Users\Administrator\Documents\Codex\2026-09-22\agent-x20\outputs\environment\Enter-CourseEnv.ps1'
Set-Location 'C:\Users\Administrator\Documents\Codex\course-task-board'
npm.cmd install --offline --no-audit --no-fund
```

若报告 ENOTCACHED，先记录缺失项，再执行课程约定回退：

```powershell
. 'C:\Users\Administrator\Documents\Codex\2026-09-22\agent-x20\outputs\environment\Enter-CourseEnv.ps1'
Set-Location 'C:\Users\Administrator\Documents\Codex\course-task-board'
npm.cmd install --prefer-offline --no-audit --no-fund
```

启动开发服务：

```powershell
. 'C:\Users\Administrator\Documents\Codex\2026-09-22\agent-x20\outputs\environment\Enter-CourseEnv.ps1'
Set-Location 'C:\Users\Administrator\Documents\Codex\course-task-board'
npm.cmd run dev -- --host localhost --port 5173 --strictPort
```

访问 http://localhost:5173。命令持续运行属于正常情况，Ctrl+C 停止。端口占用会报错，不会静默换端口；若已有本项目服务可直接使用。

测试与构建：

```powershell
. 'C:\Users\Administrator\Documents\Codex\2026-09-22\agent-x20\outputs\environment\Enter-CourseEnv.ps1'
Set-Location 'C:\Users\Administrator\Documents\Codex\course-task-board'
npm.cmd test
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
npm.cmd run build
```

构建输出在 dist/，本项目未发布。lint/typecheck 未配置，不应报告为通过。更换电脑或移动课程工具目录后，需调整上述环境路径并检查工具可用性。

## 数据与结构

Task 字段为 id、title、description、status、priority。枚举、Result 返回值及边界行为见 [数据契约](docs/contract.md)。

| 存储键 | 值 |
| --- | --- |
| course-task-board.tasks.v1 | Task 数组的 JSON，空集合保存为 [] |
| course-task-board.theme.v1 | light 或 dark |

启动先解析并恢复任务，再注册保存监听；所有成功的任务修改走同一保存路径。数据损坏或读取失败时保留原值、暂停自动写入并提示，避免用空数组覆盖。此时新操作仅暂存内存；修复存储或权限后刷新。写入失败会提示，后续有效修改重试；不要在未保存时刷新。

名称 TaskManager 不改变课程约定存储键。主题优先恢复有效选择，无选择默认浅色；使用 html 的 dark 类及 Tailwind 4 自定义变体。

```text
src/
  App.vue                   页面接线与操作反馈
  components/               TaskForm、TaskCard、TaskBoard
  composables/useTasks.js    唯一任务集合与存储接入
  composables/useTheme.js    主题恢复与保存
  domain/taskRules.js       输入校验、纯状态转换
  storage/taskStorage.js    纯解析和序列化
tests/                      Node 行为测试
docs/                       任务单、契约、迭代证据、审查与汇报
```

## 验证与课堂资料

2026-09-22 最终检查：实际执行 36 项测试，36 通过、0 失败、0 跳过；生产构建成功。Agent 在内置浏览器执行了 CRUD、刷新、真实跨列拖拽及主题恢复检查。它们不等同于用户人工签收，逐项范围与缺口见 [审查及验收表](docs/review.md)。

- [任务单与 R1–R6](docs/task-brief.md)
- [接口契约](docs/contract.md)
- [逐轮记录、真实提交与命令](docs/iteration-log.md)
- [最终审查、T01–T18、回滚和 8 分钟汇报提纲](docs/review.md)

## 已知限制

- 数据只在当前浏览器来源中保存，没有账号、服务器备份或跨设备同步。localhost、127.0.0.1、不同端口使用不同存储空间；验收应固定同一地址。
- 清除站点数据或浏览器限制存储会影响保存；应用没有任务回收站，删除后不能通过应用撤销。重要任务可先备份该键的原始值。
- 没有多标签页实时同步/冲突合并；请使用一个标签页编辑，避免旧页面覆盖新修改。
- 拖拽面向桌面浏览器；不保证手机触摸拖拽。表单状态选择器提供替代操作，不提供列内手动排序。
- 真实浏览器的损坏数据、权限/容量异常尚未完整人工验收；Node 模拟存储测试覆盖了相关任务逻辑。主题异常分支无独立自动化测试。
- 当前没有应用弹窗。仅验证了记录中的浏览器与布局范围，不声称全浏览器兼容。
