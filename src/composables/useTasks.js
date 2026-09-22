import { readonly, ref } from 'vue'
import { validateTaskInput } from '../domain/taskRules.js'

export function useTasks() {
  const tasks = ref([])

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

  return { tasks: readonly(tasks), createTask, updateTask, deleteTask }
}
