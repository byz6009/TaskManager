<script setup>
import { computed, ref } from 'vue'
import TaskForm from './components/TaskForm.vue'
import TaskBoard from './components/TaskBoard.vue'
import { STATUS_OPTIONS } from './domain/taskRules.js'
import { useTasks } from './composables/useTasks.js'

const { tasks, storageError, createTask, updateTask, deleteTask, changeTaskStatus } = useTasks(() => window.localStorage)
const editingId = ref(null)
const editingTask = computed(() => tasks.value.find(task => task.id === editingId.value) ?? null)
const formVersion = ref(0)
const error = ref('')
const notice = ref('')
const errorMessages = {
  INVALID_TITLE: '请填写标题，标题不能只有空格。',
  INVALID_DESCRIPTION: '描述必须是文字，可以留空。',
  INVALID_STATUS: '请选择有效的任务状态。',
  INVALID_PRIORITY: '请选择有效的优先级。',
  TASK_NOT_FOUND: '任务不存在，请重新选择。',
}

function resetForm() {
  editingId.value = null
  error.value = ''
  formVersion.value += 1
}

function saveTask(input) {
  const isEditing = editingId.value !== null
  const result = isEditing ? updateTask(editingId.value, input) : createTask(input)
  if (!result.ok) {
    error.value = errorMessages[result.errorCode]
    notice.value = ''
    return
  }
  resetForm()
  notice.value = isEditing ? '任务已更新。' : '任务已创建。'
}

function editTask(id) {
  editingId.value = id
  error.value = ''
  notice.value = ''
}

function removeTask(id) {
  const result = deleteTask(id)
  if (!result.ok) {
    notice.value = errorMessages[result.errorCode]
    return
  }
  if (editingId.value === id) resetForm()
  notice.value = '任务已删除。'
}

function cancelEdit() {
  notice.value = editingId.value === null ? '表单已清空。' : '已取消编辑，原任务未改变。'
  resetForm()
}

function moveTaskOnBoard({ id, status }) {
  const previousStatus = tasks.value.find(task => task.id === id)?.status
  const result = changeTaskStatus(id, status)
  if (!result.ok) {
    notice.value = errorMessages[result.errorCode]
  } else if (previousStatus !== status) {
    notice.value = `任务已移至「${STATUS_OPTIONS.find(option => option.value === status).label}」。`
  }
}
</script>

<template>
  <main class="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8">
    <div class="mx-auto max-w-7xl">
      <header class="mb-8 border-b border-slate-200 pb-6">
        <p class="text-sm font-semibold tracking-widest text-teal-700">任务管理</p>
        <h1 class="mt-2 text-4xl font-bold tracking-tight">TaskManager</h1>
        <p class="mt-3 text-slate-600">把要做的事整理清楚，让每一步都有方向。</p>
        <p class="mt-3 text-sm text-slate-500">任务自动保存在当前浏览器，刷新后可继续查看。</p>
      </header>
      <p v-if="storageError" role="alert" class="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-900">{{ storageError }}</p>
      <div class="grid items-start gap-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
        <TaskForm :key="formVersion" :task="editingTask" :error="error" @save="saveTask" @cancel="cancelEdit" />
        <section class="min-w-0" aria-labelledby="list-heading">
          <div class="flex items-center justify-between gap-3">
            <h2 id="list-heading" class="text-xl font-semibold">任务看板</h2>
            <span class="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700">{{ tasks.length }} 项任务</span>
          </div>
          <p class="mt-2 text-sm text-slate-500">拖动卡片切换状态，也可以通过编辑表单修改。</p>
          <p role="status" class="my-3 min-h-6 text-sm text-teal-800">{{ notice }}</p>
          <p v-if="tasks.length === 0" class="mb-4 text-sm text-slate-500">还没有任务，填写新建任务表单开始记录。</p>
          <TaskBoard :tasks="tasks" @move="moveTaskOnBoard" @edit="editTask" @delete="removeTask" />
        </section>
      </div>
    </div>
  </main>
</template>
