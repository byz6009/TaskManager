import { validateTaskInput } from '../domain/taskRules.js'

export const TASK_STORAGE_KEY = 'course-task-board.tasks.v1'

export function parseTaskData(raw) {
  if (raw === null) return { ok: true, value: [] }
  if (typeof raw !== 'string') return { ok: false, errorCode: 'INVALID_STORAGE' }

  try {
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return { ok: false, errorCode: 'INVALID_STORAGE' }

    const ids = new Set()
    const tasks = []
    for (const task of data) {
      if (!task || typeof task !== 'object' || Array.isArray(task)
        || typeof task.id !== 'string' || !task.id.trim() || ids.has(task.id)) {
        return { ok: false, errorCode: 'INVALID_STORAGE' }
      }
      const result = validateTaskInput(task)
      if (!result.ok) return { ok: false, errorCode: 'INVALID_STORAGE' }
      ids.add(task.id)
      tasks.push({ id: task.id, ...result.value })
    }
    return { ok: true, value: tasks }
  } catch {
    return { ok: false, errorCode: 'INVALID_STORAGE' }
  }
}

// 输入为已验证的任务数组；编码异常按契约交给调用方处理。
export function encodeTaskData(tasks) {
  return JSON.stringify(tasks)
}
