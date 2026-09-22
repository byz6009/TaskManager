<script setup>
import { reactive, watch } from 'vue'
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../domain/taskRules.js'

const props = defineProps({
  task: { type: Object, default: null },
  error: { type: String, default: '' },
})
const emit = defineEmits(['save', 'cancel'])
const draft = reactive({})

watch(() => props.task?.id, () => {
  const task = props.task
  // 只复制字段，输入框始终编辑草稿，取消时原任务不受影响。
  Object.assign(draft, {
    title: task?.title ?? '',
    description: task?.description ?? '',
    status: task?.status ?? 'todo',
    priority: task?.priority ?? 'medium',
  })
}, { immediate: true })

// 拖拽正在编辑的任务时同步状态，但保留其他尚未保存的草稿字段。
watch(() => props.task?.status, (status) => {
  if (status) draft.status = status
})
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="form-heading">
    <h2 id="form-heading" class="text-xl font-semibold">{{ task ? '编辑任务' : '新建任务' }}</h2>
    <p class="mt-2 text-sm text-slate-500">{{ task ? '保存后更新原任务，取消则保留原内容。' : '写下下一步要完成的事。' }}</p>
    <form class="mt-6 space-y-5" novalidate @submit.prevent="emit('save', { ...draft })">
      <div>
        <label for="task-title" class="mb-2 block text-sm font-medium">标题 <span class="text-red-700">*</span></label>
        <input id="task-title" v-model="draft.title" class="field" required aria-required="true" :aria-describedby="error ? 'form-error' : undefined" placeholder="例如：整理课程需求" />
      </div>
      <div>
        <label for="task-description" class="mb-2 block text-sm font-medium">描述 <span class="font-normal text-slate-500">（选填）</span></label>
        <textarea id="task-description" v-model="draft.description" class="field resize-y" rows="4" placeholder="补充任务的具体内容" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="task-status" class="mb-2 block text-sm font-medium">状态</label>
          <select id="task-status" v-model="draft.status" class="field">
            <option v-for="option in STATUS_OPTIONS" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </div>
        <div>
          <label for="task-priority" class="mb-2 block text-sm font-medium">优先级</label>
          <select id="task-priority" v-model="draft.priority" class="field">
            <option v-for="option in PRIORITY_OPTIONS" :key="option.value" :value="option.value">{{ option.label }}</option>
          </select>
        </div>
      </div>
      <p v-if="error" id="form-error" role="alert" class="rounded-lg bg-red-50 p-3 text-sm text-red-800">{{ error }}</p>
      <div class="flex flex-wrap gap-3">
        <button type="submit" class="rounded-lg bg-teal-700 px-5 py-2.5 font-medium text-white hover:bg-teal-800">{{ task ? '保存修改' : '创建任务' }}</button>
        <button type="button" class="rounded-lg border border-slate-300 px-4 py-2.5 text-slate-700 hover:bg-slate-50" @click="emit('cancel')">{{ task ? '取消编辑' : '清空表单' }}</button>
      </div>
    </form>
  </section>
</template>
