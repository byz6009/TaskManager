import test from 'node:test'
import assert from 'node:assert/strict'
import { useTasks } from '../src/composables/useTasks.js'

const input = { title: '整理需求', description: '', status: 'todo', priority: 'medium' }
const snapshot = (store) => JSON.parse(JSON.stringify(store.tasks.value))

test('从空列表创建同名任务，仍有非空且不同的稳定 id', () => {
  const store = useTasks()
  assert.deepEqual(snapshot(store), [])
  const first = store.createTask(input)
  const second = store.createTask(input)
  assert.equal(first.ok, true)
  assert.equal(second.ok, true)
  assert.equal(typeof first.value.id, 'string')
  assert.ok(first.value.id.length > 0)
  assert.notEqual(first.value.id, second.value.id)
  assert.equal(store.tasks.value.length, 2)
  assert.deepEqual(snapshot(store)[0], { id: first.value.id, ...input })
})

test('新建和编辑都复用校验，非法输入不改变集合', () => {
  const store = useTasks()
  const { value: task } = store.createTask(input)
  const before = snapshot(store)
  for (const invalid of [{ title: '  ' }, { description: null }, { status: 'invalid' }, { priority: 'invalid' }]) {
    assert.equal(store.createTask({ ...input, ...invalid }).ok, false)
    assert.equal(store.updateTask(task.id, { ...input, ...invalid }).ok, false)
    assert.deepEqual(snapshot(store), before)
  }
})

test('编辑只更新目标任务，数量和 id 保持不变，其他任务不变', () => {
  const store = useTasks()
  const { value: first } = store.createTask(input)
  store.createTask({ ...input, title: '准备汇报' })
  const before = snapshot(store)
  const changed = { title: ' 完成需求 ', description: '已核对', status: 'done', priority: 'high', id: 'cannot-replace-id' }
  const result = store.updateTask(first.id, changed)
  assert.equal(result.ok, true)
  assert.deepEqual(snapshot(store), [
    { id: first.id, title: '完成需求', description: '已核对', status: 'done', priority: 'high' },
    before[1],
  ])
  assert.deepEqual(first, before[0])
})

test('删除只移除指定 id，删除最后一个任务后为空', () => {
  const store = useTasks()
  const { value: first } = store.createTask(input)
  const { value: second } = store.createTask(input)
  assert.equal(store.deleteTask(first.id).ok, true)
  assert.deepEqual(snapshot(store), [second])
  assert.equal(store.deleteTask(second.id).ok, true)
  assert.deepEqual(snapshot(store), [])
})

test('编辑和删除不存在的 id 返回错误，现有任务不变', () => {
  const store = useTasks()
  store.createTask(input)
  const before = snapshot(store)
  assert.deepEqual(store.updateTask('missing', input), { ok: false, errorCode: 'TASK_NOT_FOUND' })
  assert.deepEqual(store.deleteTask('missing'), { ok: false, errorCode: 'TASK_NOT_FOUND' })
  assert.deepEqual(snapshot(store), before)
})
