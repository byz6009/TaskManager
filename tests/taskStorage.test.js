import test from 'node:test'
import assert from 'node:assert/strict'
import { effectScope } from 'vue'
import { encodeTaskData, parseTaskData, TASK_STORAGE_KEY } from '../src/storage/taskStorage.js'
import { useTasks } from '../src/composables/useTasks.js'

const task = { id: 'task-a', title: '整理需求', description: '', status: 'todo', priority: 'medium' }
const invalid = { ok: false, errorCode: 'INVALID_STORAGE' }

function memoryStorage(raw = null) {
  const values = new Map([['other-app', 'keep-me']])
  if (raw !== null) values.set(TASK_STORAGE_KEY, raw)
  const calls = []
  return {
    values,
    calls,
    getItem(key) {
      calls.push(['get', key])
      return values.get(key) ?? null
    },
    setItem(key, value) {
      calls.push(['set', key, value])
      values.set(key, value)
    },
  }
}

function openStore(t, getStorage) {
  const scope = effectScope()
  t.after(() => scope.stop())
  return scope.run(() => useTasks(getStorage))
}

test('无存储与合法空数组都解析为空数组，编码空数组得到字符串 []', () => {
  assert.deepEqual(parseTaskData(null), { ok: true, value: [] })
  assert.deepEqual(parseTaskData('[]'), { ok: true, value: [] })
  assert.equal(encodeTaskData([]), '[]')
})

test('合法任务往返保留中文、换行、id、状态和优先级', () => {
  const tasks = [task, { ...task, id: 'task-b', title: '准备汇报', description: '第一行\n"第二行"', status: 'done', priority: 'high' }]
  const before = structuredClone(tasks)
  const raw = encodeTaskData(tasks)
  assert.equal(typeof raw, 'string')
  assert.deepEqual(parseTaskData(raw), { ok: true, value: before })
  assert.deepEqual(tasks, before)
})

test('解析复用规范化规则：标题 trim，缺失描述转为空串', () => {
  const { description, ...withoutDescription } = task
  assert.deepEqual(parseTaskData(JSON.stringify([{ ...withoutDescription, title: ' 整理需求 ' }])), { ok: true, value: [task] })
})

test('损坏 JSON、非数组结构和非字符串参数返回 INVALID_STORAGE', () => {
  for (const raw of ['', '{broken', 'null', '{}', '42', 'true', '"text"', undefined, [], 42]) {
    assert.deepEqual(parseTaskData(raw), invalid)
  }
})

test('非法任务类型、字段或枚举使整个数组解析失败', () => {
  const badTasks = [null, [], 'task', {},
    ...['', '   ', null, 42].map(id => ({ ...task, id })),
    ...['', '  ', 42].map(title => ({ ...task, title })),
    { ...task, description: null }, { ...task, description: 1 },
    { ...task, status: 'pending' }, { ...task, priority: 'urgent' },
    { ...task, status: undefined }, { ...task, priority: undefined }]
  for (const bad of badTasks) {
    assert.deepEqual(parseTaskData(JSON.stringify([{ ...task, id: 'valid-other' }, bad])), invalid)
  }
})

test('重复 id 被拒绝，不静默丢弃任何任务', () => {
  assert.deepEqual(parseTaskData(JSON.stringify([task, { ...task, title: '另一个任务' }])), invalid)
})

test('编码异常交给调用方，不包装成 Result', () => {
  const circular = []
  circular.push(circular)
  assert.throws(() => encodeTaskData(circular), TypeError)
})

test('启动先恢复已有任务且不写入，第一次修改才保存完整集合', (t) => {
  const storage = memoryStorage(encodeTaskData([task]))
  const store = openStore(t, () => storage)
  assert.deepEqual(JSON.parse(JSON.stringify(store.tasks.value)), [task])
  assert.deepEqual(storage.calls, [['get', TASK_STORAGE_KEY]])
  const created = store.createTask({ ...task, title: '新任务' })
  assert.equal(created.ok, true)
  assert.deepEqual(JSON.parse(storage.values.get(TASK_STORAGE_KEY)), [task, created.value])
  assert.equal(storage.values.get('other-app'), 'keep-me')
  assert.equal(store.storageError.value, '')
})

test('没有存储时不主动写空数组，新建任务在重新初始化后恢复', (t) => {
  const storage = memoryStorage()
  const store = openStore(t, () => storage)
  assert.deepEqual(storage.calls, [['get', TASK_STORAGE_KEY]])
  assert.deepEqual(store.tasks.value, [])
  const created = store.createTask(task)
  const reloaded = openStore(t, () => storage)
  assert.deepEqual(JSON.parse(JSON.stringify(reloaded.tasks.value)), [created.value])
  assert.equal(storage.calls.filter(([action]) => action === 'set').length, 1)
})

test('编辑标题描述、单独改状态、单独改优先级均保存，并保持 id', (t) => {
  const storage = memoryStorage(encodeTaskData([task]))
  const store = openStore(t, () => storage)
  let expected = { ...task }
  for (const patch of [{ title: ' 修改标题 ', description: '补充说明' }, { status: 'doing' }, { priority: 'low' }]) {
    const result = store.updateTask(task.id, { ...expected, ...patch })
    assert.equal(result.ok, true)
    expected = result.value
    assert.equal(expected.id, task.id)
    assert.deepEqual(JSON.parse(storage.values.get(TASK_STORAGE_KEY)), [expected])
  }
  assert.equal(storage.calls.filter(([action]) => action === 'set').length, 3)
  assert.deepEqual(JSON.parse(JSON.stringify(openStore(t, () => storage).tasks.value)), [expected])
})

test('删除只影响指定任务，删除最后一个保存 []，重新初始化仍为空', (t) => {
  const second = { ...task, id: 'task-b', title: '其他任务' }
  const storage = memoryStorage(encodeTaskData([task, second]))
  const store = openStore(t, () => storage)
  store.deleteTask(task.id)
  assert.deepEqual(JSON.parse(storage.values.get(TASK_STORAGE_KEY)), [second])
  store.deleteTask(second.id)
  assert.equal(storage.values.get(TASK_STORAGE_KEY), '[]')
  assert.deepEqual(openStore(t, () => storage).tasks.value, [])
  assert.equal(storage.calls.filter(([action]) => action === 'set').length, 2)
})

test('损坏数据加载后可临时 CRUD，但始终不覆盖原值或其他键', (t) => {
  for (const raw of ['{broken', '{}', JSON.stringify([task, task])]) {
    const storage = memoryStorage(raw)
    const store = openStore(t, () => storage)
    assert.deepEqual(store.tasks.value, [])
    assert.match(store.storageError.value, /暂停自动保存/)
    const created = store.createTask(task)
    store.changeTaskStatus(created.value.id, 'doing')
    store.updateTask(created.value.id, { ...task, status: 'done' })
    store.deleteTask(created.value.id)
    assert.equal(storage.values.get(TASK_STORAGE_KEY), raw)
    assert.equal(storage.values.get('other-app'), 'keep-me')
    assert.deepEqual(storage.calls, [['get', TASK_STORAGE_KEY]])
  }
})

test('获取存储对象或 getItem 抛错时不白屏且暂停写入', (t) => {
  const unavailable = openStore(t, () => { throw new Error('SecurityError') })
  assert.match(unavailable.storageError.value, /无法读取/)
  assert.equal(unavailable.createTask(task).ok, true)
  let writes = 0
  const unreadable = openStore(t, () => ({
    getItem() { throw new Error('SecurityError') },
    setItem() { writes += 1 },
  }))
  assert.equal(unreadable.createTask(task).ok, true)
  assert.match(unreadable.storageError.value, /暂停自动保存/)
  assert.equal(writes, 0)
})

test('写入失败保留内存操作和旧存储，提示错误；下一次修改成功后清除提示', (t) => {
  const storage = memoryStorage(encodeTaskData([task]))
  const setItem = storage.setItem.bind(storage)
  let unavailable = true
  storage.setItem = (key, value) => {
    if (unavailable) throw new Error('QuotaExceededError')
    setItem(key, value)
  }
  const store = openStore(t, () => storage)
  const created = store.createTask({ ...task, title: '新任务' })
  assert.equal(created.ok, true)
  assert.equal(store.tasks.value.length, 2)
  assert.deepEqual(JSON.parse(storage.values.get(TASK_STORAGE_KEY)), [task])
  assert.match(store.storageError.value, /无法保存/)
  unavailable = false
  store.updateTask(created.value.id, { ...created.value, status: 'done' })
  assert.equal(store.storageError.value, '')
  assert.deepEqual(JSON.parse(storage.values.get(TASK_STORAGE_KEY)), JSON.parse(JSON.stringify(store.tasks.value)))
})

test('被拒绝的新建编辑与无效删除不触发存储写入', (t) => {
  const raw = encodeTaskData([task])
  const storage = memoryStorage(raw)
  const store = openStore(t, () => storage)
  assert.equal(store.createTask({ ...task, title: '  ' }).ok, false)
  assert.equal(store.updateTask(task.id, { ...task, status: 'bad' }).ok, false)
  assert.equal(store.deleteTask('missing').ok, false)
  assert.equal(storage.values.get(TASK_STORAGE_KEY), raw)
  assert.deepEqual(storage.calls, [['get', TASK_STORAGE_KEY]])
})

test('看板状态转换通过现有路径保存，恢复后仍可编辑和删除', (t) => {
  const other = { ...task, id: 'task-b', title: '另一个任务', status: 'done' }
  const storage = memoryStorage(encodeTaskData([task, other]))
  const store = openStore(t, () => storage)
  for (const status of ['doing', 'done', 'todo', 'doing']) {
    const result = store.changeTaskStatus(task.id, status)
    assert.equal(result.ok, true)
    assert.deepEqual(JSON.parse(storage.values.get(TASK_STORAGE_KEY)), [{ ...task, status }, other])
  }
  assert.equal(storage.calls.filter(([action]) => action === 'set').length, 4)
  const restored = openStore(t, () => storage)
  assert.deepEqual(JSON.parse(JSON.stringify(restored.tasks.value)), [{ ...task, status: 'doing' }, other])
  assert.equal(restored.updateTask(task.id, { ...task, title: '拖动后编辑', status: 'doing' }).ok, true)
  assert.equal(JSON.parse(storage.values.get(TASK_STORAGE_KEY))[0].title, '拖动后编辑')
  assert.equal(restored.deleteTask(task.id).ok, true)
  assert.deepEqual(JSON.parse(storage.values.get(TASK_STORAGE_KEY)), [other])
})

test('同列放下、无效 id 和无效状态不会修改集合或写存储', (t) => {
  const raw = encodeTaskData([task])
  const storage = memoryStorage(raw)
  const store = openStore(t, () => storage)
  assert.equal(store.changeTaskStatus(task.id, 'todo').ok, true)
  assert.deepEqual(store.changeTaskStatus('missing', 'done'), { ok: false, errorCode: 'TASK_NOT_FOUND' })
  assert.deepEqual(store.changeTaskStatus(task.id, 'bad'), { ok: false, errorCode: 'INVALID_STATUS' })
  assert.deepEqual(JSON.parse(JSON.stringify(store.tasks.value)), [task])
  assert.deepEqual(storage.calls, [['get', TASK_STORAGE_KEY]])
  assert.equal(storage.values.get(TASK_STORAGE_KEY), raw)
})

test('拖动状态写入失败沿用错误提示，旧存储不被破坏', (t) => {
  const raw = encodeTaskData([task])
  const storage = memoryStorage(raw)
  storage.setItem = () => { throw new Error('QuotaExceededError') }
  const store = openStore(t, () => storage)
  assert.equal(store.changeTaskStatus(task.id, 'done').ok, true)
  assert.equal(store.tasks.value[0].status, 'done')
  assert.equal(storage.values.get(TASK_STORAGE_KEY), raw)
  assert.match(store.storageError.value, /无法保存/)
})
