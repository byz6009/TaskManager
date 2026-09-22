import test from 'node:test'
import assert from 'node:assert/strict'
import { validateTaskInput } from '../src/domain/taskRules.js'

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
