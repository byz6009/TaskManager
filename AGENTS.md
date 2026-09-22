# 项目约定

## 范围与技术栈

- 这是软件工程课堂的纯前端任务管理应用，项目根目录为 course-task-board。
- 使用 JavaScript ES modules、Vue 3.5.43、Vite 8.3.0、@vitejs/plugin-vue 6.0.9、Tailwind CSS 4.3.3、@tailwindcss/vite 4.3.3；依赖必须使用精确版本。
- 使用 Vue 自带响应式状态、桌面原生拖拽、localStorage 和 Node 内置测试，不新增后端，不发布，不推送远端。
- 业务纯函数与 Vue、DOM、浏览器存储读写分离；数据和接口遵循 docs/contract.md。
- 改变契约、引入额外依赖或修改项目范围外文件前，先说明必要性与影响，统一后再执行。

## 分轮工作方式

- 每轮先简述计划，仅完成当轮范围；执行相关测试、已有回归测试和构建，审查 diff。
- 返回实际修改文件、真实命令和结果、diff 摘要、浏览器验收步骤、尚未验证项及下一步。
- 完成实现和构建后停止，等待用户反馈浏览器结果。只有用户确认后才记录人工验收并进行 Git 提交，不提前进入下一轮。
- 相同问题连续两次没有新证据时停止重试，整理失败命令、日志、已尝试方案和需要的信息。
- 不覆盖用户无关改动；每轮只暂存本轮范围文件。

## 课程环境与命令

每个需要运行 Node/npm 的 PowerShell 命令块，先执行：

```powershell
. 'C:\Users\Administrator\Documents\Codex\2026-09-22\agent-x20\outputs\environment\Enter-CourseEnv.ps1'
```

- 使用 npm.cmd，不假设普通终端已配置 npm。
- 安装：npm.cmd install --offline --no-audit --no-fund。
- 只有缺少缓存时，记录具体缺失项，再用 npm.cmd install --prefer-offline --no-audit --no-fund 补齐。
- 构建：npm.cmd run build。
- 测试：npm.cmd test（node --test）；有真实用例后再执行并记录用例数、失败数与跳过项。
- 启动：npm.cmd run dev -- --host localhost --port 5173 --strictPort。
- 验收地址固定为 http://localhost:5173；端口被占用时报告，不静默改用其他端口。

## 真实记录

- docs/iteration-log.md 记录每轮目标、实际改动、命令和结果、人工验收及提交证据。
- 尚无用例时明确记录“测试尚未建立”，不能把零用例视为测试覆盖通过。
- 构建成功不等于浏览器交互正确；未执行的浏览器验收不得标为通过。
- 区分命令验证、用户人工验收和未验证；不编造截图、提交、测试数量或失败经历。
- 未配置 lint/typecheck 时记录“未配置”，不声称通过。
