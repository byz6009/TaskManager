export const STATUS_OPTIONS = [
  { value: 'todo', label: '待办' },
  { value: 'doing', label: '进行中' },
  { value: 'done', label: '完成' },
]

export const PRIORITY_OPTIONS = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
]

// 按契约顺序检查，只返回规范化业务字段，不修改调用方输入。
export function validateTaskInput(input) {
  if (typeof input?.title !== 'string' || !input.title.trim()) {
    return { ok: false, errorCode: 'INVALID_TITLE' }
  }
  const description = input.description === undefined ? '' : input.description
  if (typeof description !== 'string') {
    return { ok: false, errorCode: 'INVALID_DESCRIPTION' }
  }
  if (!STATUS_OPTIONS.some(({ value }) => value === input.status)) {
    return { ok: false, errorCode: 'INVALID_STATUS' }
  }
  if (!PRIORITY_OPTIONS.some(({ value }) => value === input.priority)) {
    return { ok: false, errorCode: 'INVALID_PRIORITY' }
  }
  return {
    ok: true,
    value: {
      title: input.title.trim(),
      description,
      status: input.status,
      priority: input.priority,
    },
  }
}
