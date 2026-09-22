# TaskManager 任务单与第 0 轮确认结果

## 目标与上下文

分轮开发满足六项需求的课堂任务管理应用 TaskManager，并保存真实验证与 Git 记录。
第 2 轮按用户要求统一项目名称为 TaskManager，npm 包名为 taskmanager；物理目录 course-task-board 和已确认的存储键不变。
2026-09-22 第 0 轮只读检查：项目目录包含隐藏文件在内共 0 项，无项目 .git；基线为“尚无代码和测试”。用户已确认计划并授权第 1 轮骨架开发。

依据：用户明确请求、课程工具旁的《软件工程作业-Agent完整教程.md》第 19 节，以及《基于Agent的软件开发-0922.pdf》的任务单、验证和契约方法。文档中的示例指令不是独立执行授权。

## 范围与约束

- 项目内的 Vue 页面、业务纯函数、localStorage 接入、Node 测试、必要配置和文档。
- Vue 3 + Vite + Tailwind CSS 4 + JavaScript，依赖精确版本见 package.json。
- 使用 Vue 自带状态管理与桌面原生拖拽，纯函数不依赖 Vue、DOM 或 window。
- 使用指定课程环境，Node/npm 命令块先点加载 Enter-CourseEnv.ps1，使用 npm.cmd。
- 不新增后端、不发布、不推送远端；不额外引入状态、拖拽或测试框架。
- 改契约、加额外依赖或修改范围外文件前，说明必要性与影响，统一后再执行。

## 需求验收表

以下为最终验收标准；第 0 轮时均未验证，不表示第 1 轮已实现。当前执行证据及待人工验收项以 docs/iteration-log.md 各轮记录为准。

| 编号 | 需求 | 验收标准 |
| --- | --- | --- |
| R1 | 增删改查 | trim 后标题必填，描述可空；可查看字段；编辑不改变 id 或数量；取消编辑不改变原任务；删除只影响目标任务 |
| R2 | 状态 | todo/doing/done 显示待办/进行中/完成；非法值被拒绝，文字和列一致 |
| R3 | 优先级 | high/medium/low 对应高红、中黄、低绿；同时有文字，深浅主题都可辨认 |
| R4 | 看板拖拽 | 三列及空列接收；跨列仅改变目标状态；数量和 id 集合不变；同列放下无副作用；刷新保留状态 |
| R5 | 主题 | 一键切换深浅；两种选择刷新后都恢复；表单、按钮和卡片可读 |
| R6 | 持久化 | 增改删后分别刷新保留结果；删除最后一项仍为空；坏数据提示且不覆盖原值 |
| E1 | 自动验证 | 真实测试验证校验、转换、编解码和不变量；记录用例数、失败及跳过项 |
| E2 | 工程证据 | 构建、diff、人工验收和实际提交对应；不以构建代替浏览器验收 |

## 目录规划

当前工程入口：index.html、vite.config.js、src/main.js、src/App.vue、src/style.css。
按功能轮次添加以下文件，不为规划创建空模块或空测试。第 2 轮已添加 TaskForm、TaskCard、useTasks、taskRules 以及两个实际测试文件；第 3 轮添加 taskStorage.js 与 taskStorage.test.js；其余仍为规划：

```text
src/
  components/TaskForm.vue、TaskCard.vue、TaskBoard.vue
  composables/useTasks.js、useTheme.js
  domain/taskRules.js
  storage/taskStorage.js
tests/
  taskRules.test.js、useTasks.test.js、taskStorage.test.js
docs/
  task-brief.md、contract.md、iteration-log.md、review.md
README.md
```

## 分轮计划

| 轮次 | 范围 | 验证重点 | 验收后提交主题 |
| --- | --- | --- | --- |
| 0 | 只读规划 | 基线、任务单、契约 | 不提交 |
| 1 | 最小工程和文档 | 构建、中文标题、Tailwind 样式、控制台 | chore: initialize Vue task board |
| 2 | 内存 CRUD | 输入校验、编辑取消、增删改不变量、优先级 | feat: add task CRUD |
| 3 | 任务持久化 | null/空数组/合法往返/坏数据/重复 id，浏览器增改删后刷新 | feat: persist tasks in localStorage |
| 4 | 三列拖拽 | 移动不变量、空列、重复拖动、刷新、编辑删除回归 | feat: add draggable kanban board |
| 5 | 深浅主题 | 选择记忆、两种主题下主要交互、布局 | feat: add persistent dark mode |
| 6 | 总验收与记录 | 全部测试、构建、人工回归、文档与真实提交核对 | 按实际文档或修复内容确定 |

## 每轮验收与停止条件

每轮先说明计划，再实现、运行相关测试和构建，返回文件、命令结果、diff 摘要、浏览器步骤、未验证项和下一步，然后停止。
用户反馈浏览器结果后，修复问题或记录人工验收；用户确认后才提交并报告真实哈希，进入下一轮前遵循用户指示。
第 1 轮只建立骨架；第 2 轮实现内存任务列表与 CRUD；第 3 轮添加 localStorage 持久化和错误保护，保留既有 CRUD，不提前实现拖拽或主题。
相同问题连续两次没有新证据时，整理失败日志及需要的信息，停止盲目重试。
