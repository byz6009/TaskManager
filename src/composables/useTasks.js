import { readonly, ref, watch } from 'vue'
import { moveTask, validateTaskInput } from '../domain/taskRules.js'
import { encodeTaskData, parseTaskData, TASK_STORAGE_KEY } from '../storage/taskStorage.js'

// 注入访问函数，连读取 localStorage 属性本身失败也能捕获；无参数时用于内存测试。
export function useTasks(getStorage = null) {
  const tasks = ref([])
  const storageError = ref('')

  if (getStorage) {
    let storage
    let restored = false
    try {
      storage = getStorage()
      const result = parseTaskData(storage.getItem(TASK_STORAGE_KEY))
      if (result.ok) {
        tasks.value = result.value
        restored = true
      } else {
        storageError.value = '本地任务数据损坏或格式不正确，已保留原数据并暂停自动保存。当前修改仅临时保留，请修复存储数据后刷新。'
      }
    } catch {
      storageError.value = '无法读取本地任务，已暂停自动保存。当前修改仅临时保留，请检查浏览器存储权限后刷新。'
    }

    // 恢复成功后才监听；无 immediate，启动不会写入或用空数组覆盖原值。
    if (restored) {
      watch(tasks, (value) => {
        try {
          storage.setItem(TASK_STORAGE_KEY, encodeTaskData(value))
          storageError.value = ''
        } catch {
          storageError.value = '无法保存到浏览器，本次修改仅临时保留，刷新可能丢失。请检查存储空间或权限，下次修改会重试保存。'
        }
      }, { flush: 'sync' })
    }
  }

  function createTask(input) {
    const result = validateTaskInput(input)
    if (!result.ok) return result
    const task = { id: crypto.randomUUID(), ...result.value }
    tasks.value = [...tasks.value, task]
    return { ok: true, value: task }
  }

  function updateTask(id, input) {
    const result = validateTaskInput(input)
    if (!result.ok) return result
    if (!tasks.value.some((task) => task.id === id)) {
      return { ok: false, errorCode: 'TASK_NOT_FOUND' }
    }
    const updated = { id, ...result.value }
    tasks.value = tasks.value.map((task) => task.id === id ? updated : task)
    return { ok: true, value: updated }
  }

  function deleteTask(id) {
    if (!tasks.value.some((task) => task.id === id)) {
      return { ok: false, errorCode: 'TASK_NOT_FOUND' }
    }
    tasks.value = tasks.value.filter((task) => task.id !== id)
    return { ok: true, value: id }
  }

  function changeTaskStatus(id, status) {
    const result = moveTask(tasks.value, id, status)
    if (result.ok && result.value !== tasks.value) tasks.value = result.value
    return result
  }

  return { tasks: readonly(tasks), storageError: readonly(storageError), createTask, updateTask, deleteTask, changeTaskStatus }
}
