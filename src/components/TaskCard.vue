<script setup>
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../domain/taskRules.js'

defineProps({ task: { type: Object, required: true } })
defineEmits(['edit', 'delete'])

const priorityClasses = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
}
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 class="text-lg font-semibold [overflow-wrap:anywhere]">{{ task.title }}</h3>
    <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600 [overflow-wrap:anywhere]">{{ task.description || '暂无描述' }}</p>
    <div class="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
      <span class="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700">{{ STATUS_OPTIONS.find(option => option.value === task.status)?.label }}</span>
      <span class="rounded-full px-3 py-1.5" :class="priorityClasses[task.priority]">优先级：{{ PRIORITY_OPTIONS.find(option => option.value === task.priority)?.label }}</span>
    </div>
    <div class="mt-4 flex gap-3 border-t border-slate-100 pt-3">
      <button type="button" draggable="false" class="rounded-md px-2 py-1 text-sm font-medium text-teal-800 hover:bg-teal-50" :aria-label="`编辑任务：${task.title}`" @dragstart.prevent.stop @click="$emit('edit', task.id)">编辑</button>
      <button type="button" draggable="false" class="rounded-md px-2 py-1 text-sm font-medium text-red-700 hover:bg-red-50" :aria-label="`删除任务：${task.title}`" @dragstart.prevent.stop @click="$emit('delete', task.id)">删除</button>
    </div>
  </article>
</template>
