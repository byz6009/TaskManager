<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import TaskCard from './TaskCard.vue'
import { STATUS_OPTIONS } from '../domain/taskRules.js'

const props = defineProps({ tasks: { type: Array, required: true } })
const emit = defineEmits(['move', 'edit', 'delete'])
const dragType = 'application/x-taskmanager-task-id'
const draggingId = ref(null)
const activeStatus = ref(null)
const draggingTask = computed(() => props.tasks.find(task => task.id === draggingId.value))
const columns = computed(() => STATUS_OPTIONS.map(option => ({
  ...option,
  tasks: props.tasks.filter(task => task.status === option.value),
})))

function clearDrag() {
  draggingId.value = null
  activeStatus.value = null
}

function startDrag(event, id) {
  if (!event.dataTransfer || event.target.closest('button, input, textarea, select, a')) {
    event.preventDefault()
    return
  }
  event.dataTransfer.setData(dragType, id)
  event.dataTransfer.effectAllowed = 'move'
  draggingId.value = id
}

function acceptsDrag(event) {
  return draggingTask.value && event.dataTransfer?.types.includes(dragType)
}

function dragOver(event, status) {
  if (!acceptsDrag(event)) return
  event.preventDefault()
  event.dataTransfer.dropEffect = 'move'
  activeStatus.value = status
}

function dragLeave(event, status) {
  // 跨过列内子元素时不清除高亮，避免卡片间移动导致闪烁。
  if (event.relatedTarget && event.currentTarget.contains(event.relatedTarget)) return
  if (activeStatus.value === status) activeStatus.value = null
}

function dropTask(event, status) {
  event.preventDefault()
  try {
    if (!acceptsDrag(event)) return
    const id = event.dataTransfer.getData(dragType)
    if (id !== draggingId.value) return
    emit('move', { id, status })
  } finally {
    clearDrag()
  }
}

function cancelWithEscape(event) {
  if (event.key === 'Escape') clearDrag()
}

// 在看板外放下、按 Esc 或窗口失焦也要收回提示。
onMounted(() => {
  window.addEventListener('dragend', clearDrag)
  window.addEventListener('drop', clearDrag)
  window.addEventListener('blur', clearDrag)
  window.addEventListener('keydown', cancelWithEscape)
})
onUnmounted(() => {
  window.removeEventListener('dragend', clearDrag)
  window.removeEventListener('drop', clearDrag)
  window.removeEventListener('blur', clearDrag)
  window.removeEventListener('keydown', cancelWithEscape)
})
</script>

<template>
  <div class="overflow-x-auto pb-3">
    <div class="grid min-w-[750px] grid-cols-3 items-start gap-4">
      <section
        v-for="column in columns"
        :key="column.value"
        :aria-labelledby="`column-${column.value}`"
        class="min-h-80 rounded-2xl border-2 p-3 transition-colors"
        :class="activeStatus === column.value ? 'border-teal-600 bg-teal-50' : 'border-slate-200 bg-slate-100/70'"
        @dragover="dragOver($event, column.value)"
        @dragleave="dragLeave($event, column.value)"
        @drop="dropTask($event, column.value)"
      >
        <header class="flex items-center justify-between gap-2 px-1">
          <h3 :id="`column-${column.value}`" class="font-semibold">{{ column.label }}</h3>
          <span class="rounded-full bg-white px-2.5 py-1 text-xs text-slate-600" :aria-label="`${column.label}：${column.tasks.length} 项任务`">{{ column.tasks.length }}</span>
        </header>
        <p class="my-3 min-h-5 text-center text-xs text-teal-800">
          <template v-if="activeStatus === column.value">{{ draggingTask?.status === column.value ? '松开保持当前状态' : `松开移至「${column.label}」` }}</template>
          <template v-else-if="draggingId">将卡片拖到此列</template>
        </p>
        <ul v-if="column.tasks.length" class="space-y-3">
          <li
            v-for="task in column.tasks"
            :key="task.id"
            draggable="true"
            class="cursor-grab rounded-2xl active:cursor-grabbing"
            :class="draggingId === task.id ? 'opacity-50' : ''"
            @dragstart="startDrag($event, task.id)"
            @dragend="clearDrag"
          >
            <TaskCard :task="task" @edit="emit('edit', $event)" @delete="emit('delete', $event)" />
          </li>
        </ul>
        <p v-else class="rounded-xl border border-dashed border-slate-300 px-3 py-12 text-center text-sm leading-6 text-slate-500">暂无{{ column.label }}任务<br />可将任务拖到这里</p>
      </section>
    </div>
  </div>
</template>
