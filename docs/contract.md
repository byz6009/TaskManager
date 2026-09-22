# 数据与接口契约

第 0 轮计划已确认。完整采用本机《软件工程作业-Agent完整教程.md》第 19 节建议契约，无简化差异。本文是后续实现约定，不表示函数已经实现。

## Task 数据

| 字段 | 类型与规则 |
| --- | --- |
| id | 非空、唯一字符串；编辑和拖拽不变 |
| title | 字符串；保存前 trim，结果不能为空 |
| description | 字符串，可为空；缺失规范为空串；非字符串报错 |
| status | todo / doing / done，UI 对应待办 / 进行中 / 完成 |
| priority | high / medium / low，UI 对应高红 / 中黄 / 低绿，颜色旁保留文字 |

默认状态和优先级由表单提供 todo / medium，规则函数仍检查输入枚举。
编辑使用独立草稿，取消丢弃草稿，保存成功后才更新任务集合。

## 业务纯函数

统一 Result：成功为 { ok: true, value: ... }，失败为 { ok: false, errorCode: ... }。encodeTaskData 是明确的例外，直接返回字符串。

| 函数 | 输入 | 成功 | 失败 |
| --- | --- | --- | --- |
| validateTaskInput(input) | title、description、status、priority | value 为规范化四字段，不含 id | INVALID_TITLE / INVALID_DESCRIPTION / INVALID_STATUS / INVALID_PRIORITY |
| moveTask(tasks, id, nextStatus) | 有效 Task 数组、任务 id、目标状态 | value 为更新后数组；不修改输入数组和输入任务对象 | INVALID_STATUS / TASK_NOT_FOUND |
| parseTaskData(raw) | getItem 返回的字符串或 null | value 为校验后的 Task 数组；null 对应 [] | INVALID_STORAGE |
| encodeTaskData(tasks) | 已验证 Task 数组 | 直接返回 JSON 字符串，无 Result 包装 | 调用方捕获编码异常并提示 |

- validateTaskInput 多个错误按 title、description、status、priority 顺序返回首个错误。
- description 缺失时变为空串；提供非字符串值返回 INVALID_DESCRIPTION。
- moveTask 先验证目标状态再查 id。同列移动可返回原数组或等值数组，任何业务字段不变。
- parseTaskData 验证数组结构、字段类型、状态、优先级和 id 唯一性；[] 是合法数据。
- 损坏 JSON、错误结构、非法字段或重复 id 返回 INVALID_STORAGE。
- 纯函数不依赖 Vue、DOM、window 或实际 localStorage，Node 内置测试可直接导入。

## 组件事件与唯一数据来源

useTasks 管理唯一的响应式任务集合，列表与看板由它派生。

| 看板输入或事件 | 约定 |
| --- | --- |
| tasks 属性 | 只读显示 Task 数组，不维护第二份业务集合 |
| move | payload 为 { id, status }；App 接收后进入统一状态转换和保存路径 |
| edit | payload 为任务 id |
| delete | payload 为任务 id |

浏览器 drop 只识别任务 id 和目标列，moveTask 负责状态转换，存储接入负责保存。

## 存储接入约定

- 任务键 course-task-board.tasks.v1，保存 Task 数组的 JSON；主题键 course-task-board.theme.v1，保存 light 或 dark。
- 启动先读取并恢复任务，再启用自动保存，不能先用空数组覆盖原数据。
- 新建、编辑、删除、状态与优先级变化均走统一保存路径；空数组必须保存。
- 加载失败后提示错误、保留原存储值并暂停自动写入；实际读取、写入与编码异常均捕获并提示。
- 不调用 localStorage.clear()；不在刷新时重新插入示例任务。
- 主题优先恢复已有选择，首次可默认浅色；采用根元素 dark 类控制主题。
- 浏览器验收统一使用 http://localhost:5173，避免更换来源影响存储观察。

## 关键不变量

- 拖拽前后任务数量和 id 集合相同，无重复 id。
- 拖拽仅改变目标任务的 status；其他任务内容不变。
- 删除已存在任务后数量恰好减一，其他任务不变。
- 编辑后数量和 id 不变；取消编辑不改变原数据。
- 合法任务序列化再解析，业务字段保持一致。
