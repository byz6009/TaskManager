<script setup>
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../domain/taskRules.js'

defineProps({ task: { type: Object, required: true } })
defineEmits(['edit', 'delete'])

const priorityClasses = {
  high: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
  low: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200',
}
</script>

<template>
  <article class="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-600 dark:bg-slate-900">
    <h3 class="text-lg font-semibold [overflow-wrap:anywhere]">{{ task.title }}</h3>
    <p class="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600 [overflow-wrap:anywhere] dark:text-slate-300">{{ task.description || '暂无描述' }}</p>
    <div class="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
      <span class="rounded-full bg-slate-100 px-3 py-1.5 text-slate-700 dark:bg-slate-800 dark:text-slate-200">{{ STATUS_OPTIONS.find(option => option.value === task.status)?.label }}</span>
      <span class="rounded-full px-3 py-1.5" :class="priorityClasses[task.priority]">优先级：{{ PRIORITY_OPTIONS.find(option => option.value === task.priority)?.label }}</span>
    </div>
    <div class="mt-4 flex gap-3 border-t border-slate-100 pt-3 dark:border-slate-700">
      <button type="button" draggable="false" class="rounded-md px-2 py-1 text-sm font-medium text-teal-800 hover:bg-teal-50 dark:text-teal-300 dark:hover:bg-teal-950" :aria-label="`编辑任务：${task.title}`" @dragstart.prevent.stop @click="$emit('edit', task.id)">编辑</button>
      <button type="button" draggable="false" class="rounded-md px-2 py-1 text-sm font-medium text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950" :aria-label="`删除任务：${task.title}`" @dragstart.prevent.stop @click="$emit('delete', task.id)">删除</button>
    </div>
  </article>
</template>
