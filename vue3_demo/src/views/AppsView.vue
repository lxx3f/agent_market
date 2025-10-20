<script setup>
import { ref, onMounted, computed } from 'vue'
import AppCard from '@/components/AppCard.vue'
import { getApps } from '@/data/getApps'

const list = ref([])
const loading = ref(false)
const error = ref('')

// 排序相关状态
const sortKey = ref('none') // 'none' | 'rating' | 'downloads' 
const sortOrder = ref('desc') // 'desc' 或 'asc'


onMounted(async () => {
  loading.value = true
  try {
    list.value = await getApps()
  } catch (e) {
    error.value = e?.message || '加载失败'
  } finally {
    loading.value = false
  }
})

// 计算展示的列表（不修改原始 list）
const displayList = computed(() => {
  if (!list.value || sortKey.value === 'none') return list.value
  const key = sortKey.value
  return [...list.value].sort((a, b) => {
    const va = Number(a?.[key] ?? 0)
    const vb = Number(b?.[key] ?? 0)
    const diff = vb - va // 默认降序
    return sortOrder.value === 'desc' ? diff : -diff
  })
})
</script>

<template>
  <section class="min-h-dvh bg-slate-50 text-slate-800 antialiased">
    <div class="mx-auto max-w-screen-xl px-4 py-6 space-y-5">
      <header class="space-y-1">
        <h2 class="text-lg font-medium text-slate-900">智能体应用列表</h2>
        <p class="text-sm text-slate-500">轻量卡片栅格，移动优先，自适应多端。</p>
      </header>

      <!-- 排序控件 -->
      <div class="flex items-center gap-3">
        <el-select v-model="sortKey" placeholder="排序" size="small" style="width:200px">
          <el-option label="默认" value="none" />
          <el-option label="评分" value="rating" />
          <el-option label="下载量" value="downloads" />
        </el-select>
        <el-button size="small" @click="sortOrder = sortOrder === 'desc' ? 'asc' : 'desc'">
          {{ sortOrder === 'desc' ? '降序' : '升序' }}
        </el-button>
      </div>
      <!-- 加载态 -->
      <el-skeleton v-if="loading" animated :count="6">
        <template #template>
          <div class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <div class="rounded-2xl border border-slate-200 bg-white p-5">
              <el-skeleton-item variant="image" style="width:56px;height:56px;border-radius:12px" />
              <el-skeleton-item variant="h1" style="width:60%;margin-top:12px" />
              <el-skeleton-item variant="text" />
              <el-skeleton-item variant="text" style="width:80%" />
            </div>
          </div>
        </template>
      </el-skeleton>

      <!-- 错误态 -->
      <el-alert v-else-if="error" type="error" :title="error" show-icon />

      <!-- 空态 -->
      <el-empty v-else-if="!list.length" description="暂无应用" />

      <!-- 数据态 -->
      <div v-else class="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <AppCard v-for="item in displayList" :key="item.id" :item="item" />
      </div>
    </div>
  </section>
</template>
