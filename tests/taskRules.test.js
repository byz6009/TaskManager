import test from 'node:test'
import assert from 'node:assert/strict'
import { moveTask, validateTaskInput } from '../src/domain/taskRules.js'

const valid = { title: '整理需求', description: '', status: 'todo', priority: 'medium' }

test('规范化中文标题，保留描述，仅返回四个字段且不修改输入', () => {
  const input = Object.freeze({ ...valid, id: 'ignored', title: '  整理需求  ', description: ' 第一行\n第二行 ' })
  assert.deepEqual(validateTaskInput(input), {
    ok: true,
    value: { ...valid, title: '整理需求', description: ' 第一行\n第二行 ' },
  })
  assert.equal(input.title, '  整理需求  ')
})

test('拒绝空、纯空格、非字符串标题和缺失输入', () => {
  for (const title of ['', '   ', '\t\n', '　', null, 42, undefined]) {
    assert.deepEqual(validateTaskInput({ ...valid, title }), { ok: false, errorCode: 'INVALID_TITLE' })
  }
  for (const input of [null, undefined, {}]) {
    assert.deepEqual(validateTaskInput(input), { ok: false, errorCode: 'INVALID_TITLE' })
  }
})

test('描述可为空或缺失，缺失规范为空串', () => {
  const { description, ...withoutDescription } = valid
  assert.deepEqual(validateTaskInput(valid), { ok: true, value: valid })
  assert.deepEqual(validateTaskInput(withoutDescription), { ok: true, value: valid })
})

test('拒绝非字符串描述', () => {
  for (const description of [null, 12, false, [], {}]) {
    assert.deepEqual(validateTaskInput({ ...valid, description }), { ok: false, errorCode: 'INVALID_DESCRIPTION' })
  }
})

test('三种状态和三档优先级的所有组合有效', () => {
  for (const status of ['todo', 'doing', 'done']) {
    for (const priority of ['high', 'medium', 'low']) {
      const input = { ...valid, status, priority }
      assert.deepEqual(validateTaskInput(input), { ok: true, value: input })
    }
  }
})

test('非法或缺失状态被拒绝，不在规则函数中补默认值', () => {
  for (const status of ['pending', '', null, undefined, 0]) {
    assert.deepEqual(validateTaskInput({ ...valid, status }), { ok: false, errorCode: 'INVALID_STATUS' })
  }
})

test('非法或缺失优先级被拒绝', () => {
  for (const priority of ['urgent', '', null, undefined, 0]) {
    assert.deepEqual(validateTaskInput({ ...valid, priority }), { ok: false, errorCode: 'INVALID_PRIORITY' })
  }
})

test('多个错误按标题、描述、状态、优先级顺序返回', () => {
  const input = { title: '', description: null, status: 'bad', priority: 'bad' }
  assert.equal(validateTaskInput(input).errorCode, 'INVALID_TITLE')
  input.title = '有效标题'
  assert.equal(validateTaskInput(input).errorCode, 'INVALID_DESCRIPTION')
  input.description = ''
  assert.equal(validateTaskInput(input).errorCode, 'INVALID_STATUS')
  input.status = 'todo'
  assert.equal(validateTaskInput(input).errorCode, 'INVALID_PRIORITY')
})

const moveFixture = () => [
  { id: 'a', title: '整理需求', description: '保留描述', status: 'todo', priority: 'high' },
  { id: 'b', title: '准备汇报', description: '', status: 'done', priority: 'low' },
]

test('跨列移动仅改变目标状态，数量、id、其他字段和输入保持不变', () => {
  const tasks = Object.freeze(moveFixture().map(task => Object.freeze(task)))
  const before = structuredClone(tasks)
  const result = moveTask(tasks, 'a', 'doing')
  assert.equal(result.ok, true)
  assert.equal(result.value.length, before.length)
  assert.deepEqual(result.value.map(task => task.id).sort(), before.map(task => task.id).sort())
  assert.deepEqual(result.value, [{ ...before[0], status: 'doing' }, before[1]])
  assert.deepEqual(tasks, before)
  assert.notEqual(result.value, tasks)
})

test('三种状态之间反复移动不丢任务、不重复，其他任务不变', () => {
  const before = moveFixture()
  let tasks = before
  for (const status of ['doing', 'done', 'todo', 'done', 'doing', 'todo']) {
    const result = moveTask(tasks, 'a', status)
    assert.equal(result.ok, true)
    assert.deepEqual(result.value, [{ ...before[0], status }, before[1]])
    assert.equal(new Set(result.value.map(task => task.id)).size, 2)
    tasks = result.value
  }
  assert.deepEqual(before, moveFixture())
})

test('同列放下返回原数组，不修改数据', () => {
  const tasks = moveFixture()
  const result = moveTask(tasks, 'a', 'todo')
  assert.equal(result.ok, true)
  assert.equal(result.value, tasks)
  assert.deepEqual(tasks, moveFixture())
})

test('无效状态先于 id 校验被拒绝，输入不变', () => {
  const tasks = moveFixture()
  for (const status of ['pending', '', null, undefined, 0]) {
    for (const id of ['a', 'missing']) {
      assert.deepEqual(moveTask(tasks, id, status), { ok: false, errorCode: 'INVALID_STATUS' })
      assert.deepEqual(tasks, moveFixture())
    }
  }
})

test('无效 id 或空集合返回 TASK_NOT_FOUND，不修改输入', () => {
  const tasks = moveFixture()
  for (const id of ['missing', '', null, undefined]) {
    assert.deepEqual(moveTask(tasks, id, 'done'), { ok: false, errorCode: 'TASK_NOT_FOUND' })
    assert.deepEqual(tasks, moveFixture())
  }
  assert.deepEqual(moveTask([], 'a', 'todo'), { ok: false, errorCode: 'TASK_NOT_FOUND' })
})
