<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { getAllProviders } from '@/lib/providers'
import { testApiKey, fetchAvailableModels, type TestResult, type DiscoveredModel } from '@/lib/api-test'
import {
  Combobox,
  ComboboxAnchor,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from '@/components/ui/combobox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Globe,
  Key,
  Cpu,
  Loader2,
  Clipboard,
  Check,
  ExternalLink,
  Info,
  AlertCircle,
  Clock,
  Trash2,
  Shield,
  Search,
  ChevronsUpDown,
  Sparkles,
  Zap,
  Wand2,
} from 'lucide-vue-next'

// ===== 状态 =====
const allProviders = getAllProviders()
const selectedProviderId = ref('deepseek')
const apiKey = ref('')
const selectedModelId = ref('')
const isTesting = ref(false)
const testResults = ref<TestResult[]>([])
const showApiKey = ref(false)
const copied = ref(false)
const inputBaseUrl = ref('')
const searchQuery = ref('')
const comboboxOpen = ref(false)
const discoveredModels = ref<DiscoveredModel[]>([])
const isFetchingModels = ref(false)
const modelFetchError = ref('')

// ===== 计算属性 =====
const currentProvider = computed(() =>
  allProviders.find((p) => p.id === selectedProviderId.value),
)

const isCustom = computed(() => selectedProviderId.value === 'custom')

const effectiveBaseUrl = computed(() => {
  if (isCustom.value) return inputBaseUrl.value
  return inputBaseUrl.value || currentProvider.value?.baseUrl || ''
})

const availableModels = computed(() => {
  if (discoveredModels.value.length > 0) {
    return discoveredModels.value.map((m) => ({
      id: m.id,
      name: m.id,
      owned_by: m.owned_by,
    }))
  }
  if (isCustom.value) return []
  return currentProvider.value?.models || []
})

const filteredProviders = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return allProviders
  return allProviders.filter(
    (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q),
  )
})

const filteredGroups = computed(() => {
  const international = ['openai', 'anthropic', 'google']
  const domestic = ['deepseek', 'zhipu', 'qwen', 'moonshot', 'baichuan', 'stepfun', 'minimax', 'yi']
  const proxy = ['siliconflow', 'groq', 'together', 'openrouter']
  const local = ['ollama']

  const filter = (ids: string[]) =>
    filteredProviders.value.filter((p) => ids.includes(p.id))

  return [
    { name: '国际厂商', items: filter(international) },
    { name: '国内厂商', items: filter(domestic) },
    { name: '中转/聚合', items: filter(proxy) },
    { name: '本地部署', items: filter(local) },
    { name: '自定义', items: filteredProviders.value.filter((p) => p.id === 'custom') },
  ].filter((g) => g.items.length > 0)
})

// ===== Watchers =====
watch(selectedProviderId, (newId) => {
  const p = allProviders.find((x) => x.id === newId)
  if (p && !isCustom.value) {
    inputBaseUrl.value = p.baseUrl
    if (p.models.length > 0) {
      selectedModelId.value = p.models[0].id
    }
  } else if (isCustom.value) {
    inputBaseUrl.value = ''
    selectedModelId.value = ''
  }
  testResults.value = []
  discoveredModels.value = []
  modelFetchError.value = ''
})

// ===== 方法 =====
function pasteFromClipboard() {
  navigator.clipboard.readText().then((text) => {
    apiKey.value = text.trim()
  })
}

function copyResult(text: string) {
  navigator.clipboard.writeText(text)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}

async function runTest() {
  if (!apiKey.value.trim()) return
  if (!selectedModelId.value.trim()) return

  isTesting.value = true
  await nextTick()

  const result = await testApiKey(
    selectedProviderId.value,
    effectiveBaseUrl.value,
    apiKey.value.trim(),
    selectedModelId.value.trim(),
  )

  testResults.value.unshift(result)
  isTesting.value = false
}

function clearResults() {
  testResults.value = []
}

function clearAll() {
  apiKey.value = ''
  testResults.value = []
  discoveredModels.value = []
  modelFetchError.value = ''
}

async function detectModels() {
  if (!apiKey.value.trim() || !effectiveBaseUrl.value.trim()) return
  isFetchingModels.value = true
  modelFetchError.value = ''
  discoveredModels.value = []

  const result = await fetchAvailableModels(effectiveBaseUrl.value, apiKey.value.trim())

  if (result.success) {
    discoveredModels.value = result.models
    if (result.models.length > 0 && !selectedModelId.value) {
      selectedModelId.value = result.models[0].id
    }
  } else {
    modelFetchError.value = result.error || '获取失败'
  }
  isFetchingModels.value = false
}
</script>

<template>
  <div class="space-y-6">
    <!-- 免责声明 -->
    <div class="clay-card p-4 flex items-start gap-3 border-[#FDBCB4]/30">
      <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FDBCB4] to-[#F472B6] text-white">
        <Shield class="size-4" />
      </div>
      <div>
        <p class="font-bold text-sm text-[#332F3A]">隐私声明</p>
        <p class="text-xs text-[#635F69] mt-0.5">
          本工具仅用于本地测试 API Key 连通性，<strong>不会收集、保存、上传您的任何密钥或测试数据</strong>。所有请求直接从浏览器发出。
        </p>
      </div>
    </div>

    <!-- 标题 -->
    <div class="text-center space-y-2">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full clay-card border-[#A78BFA]/30">
        <Wand2 class="size-4 text-[#7C3AED]" />
        <span class="text-sm font-semibold text-[#7C3AED]">AI Key Tester</span>
      </div>
      <h1 class="text-3xl font-black tracking-tight text-[#332F3A]" style="font-family: var(--font-clay-heading)">
        API Key
        <span class="bg-gradient-to-r from-[#7C3AED] to-[#DB2777] bg-clip-text text-transparent">
          连通性测试
        </span>
      </h1>
      <p class="text-[#635F69] text-sm max-w-md mx-auto">
        支持 17+ 厂商，OpenAI / Anthropic / Gemini 三协议，秒级检测可用模型
      </p>
    </div>

    <!-- 主布局 -->
    <div class="grid gap-6 lg:grid-cols-5">
      <!-- 左侧：配置面板 -->
      <div class="lg:col-span-3 space-y-4">
        <!-- 厂商与模型卡片 -->
        <div class="clay-card p-5 space-y-4">
          <div class="flex items-center gap-2">
            <div class="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white">
              <Cpu class="size-3.5" />
            </div>
            <h3 class="font-extrabold text-lg text-[#332F3A]" style="font-family: var(--font-clay-heading)">厂商与模型</h3>
          </div>

          <!-- 厂商选择 -->
          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-[#332F3A]">选择 AI 厂商</label>
            <Combobox v-model="selectedProviderId" v-model:open="comboboxOpen">
              <ComboboxAnchor class="relative">
                <ComboboxTrigger
                  class="clay-trigger w-full flex items-center justify-between gap-2 px-4 h-11"
                  @click="searchQuery = ''"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <span
                      v-if="currentProvider"
                      class="flex size-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                      :style="{ background: `linear-gradient(135deg, ${currentProvider.color}, ${currentProvider.color}dd)` }"
                    >{{ currentProvider.icon }}</span>
                    <span class="truncate font-semibold text-sm">{{ currentProvider?.name || '选择厂商...' }}</span>
                  </div>
                  <ChevronsUpDown class="size-4 shrink-0 opacity-40" />
                </ComboboxTrigger>
                <ComboboxList class="clay-dropdown">
                  <ComboboxInput
                    placeholder="搜索厂商..."
                    @update:model-value="(v: string) => searchQuery = v"
                  />
                  <div class="overflow-y-auto overflow-x-hidden max-h-60">
                    <ComboboxEmpty class="py-6 text-center text-sm text-[#635F69]">
                      未找到匹配的厂商
                    </ComboboxEmpty>
                    <template v-for="(group, gi) in filteredGroups" :key="gi">
                      <div class="px-3 py-1.5 text-xs font-extrabold text-[#7C3AED]">
                        {{ group.name }}
                      </div>
                      <ComboboxItem
                        v-for="p in group.items"
                        :key="p.id"
                        :value="p.id"
                        class="py-2.5"
                        @select="comboboxOpen = false"
                      >
                        <span
                          class="flex size-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white"
                          :style="{ background: `linear-gradient(135deg, ${p.color}, ${p.color}dd)` }"
                        >{{ p.icon }}</span>
                        <span class="flex-1 truncate font-semibold text-sm">{{ p.name }}</span>
                        <span
                          class="text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0"
                          :class="{
                            'bg-[#10A37F]/10 text-[#10A37F]': p.protocol === 'openai',
                            'bg-[#D97757]/10 text-[#D97757]': p.protocol === 'anthropic',
                            'bg-[#4285F4]/10 text-[#4285F4]': p.protocol === 'gemini',
                          }"
                        >
                          {{ p.protocol === 'anthropic' ? 'Anthropic' : p.protocol === 'gemini' ? 'Gemini' : 'OpenAI' }}
                        </span>
                      </ComboboxItem>
                      <ComboboxSeparator v-if="gi < filteredGroups.length - 1" />
                    </template>
                  </div>
                </ComboboxList>
              </ComboboxAnchor>
            </Combobox>
          </div>

          <div class="h-px bg-gradient-to-r from-transparent via-[#D8D0E8] to-transparent" />

          <!-- Base URL -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-sm font-semibold text-[#332F3A]">Base URL</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Info class="size-3.5 text-[#635F69] cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>选择厂商后自动填充，也可手动修改</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#635F69]">
                <Globe class="size-4" />
              </span>
              <input
                v-model="inputBaseUrl"
                class="clay-input w-full pl-10 pr-4 h-11 text-sm font-mono"
                :placeholder="isCustom ? 'https://your-api.com/v1' : '选择厂商后自动填充...'"
              />
            </div>
          </div>

          <!-- API Key -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-sm font-semibold text-[#332F3A]">API Key</label>
              <a
                v-if="currentProvider?.docUrl"
                :href="currentProvider.docUrl"
                target="_blank"
                class="inline-flex items-center gap-1 text-xs font-semibold text-[#7C3AED] hover:text-[#DB2777] transition-colors"
              >
                <ExternalLink class="size-3" />
                获取 Key
              </a>
            </div>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#635F69]">
                  <Key class="size-4" />
                </span>
                <input
                  v-model="apiKey"
                  :type="showApiKey ? 'text' : 'password'"
                  class="clay-input w-full pl-10 pr-14 h-11 text-sm font-mono"
                  placeholder="sk-xxxxxxxxxxxxxxxx"
                />
                <button
                  class="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-[#7C3AED] hover:text-[#DB2777] transition-colors"
                  @click="showApiKey = !showApiKey"
                >
                  {{ showApiKey ? '隐藏' : '显示' }}
                </button>
              </div>
              <button
                class="clay-btn-outline h-11 w-11 flex items-center justify-center shrink-0"
                @click="pasteFromClipboard"
                title="从剪贴板粘贴"
              >
                <Clipboard class="size-4" />
              </button>
            </div>
            <p v-if="currentProvider?.apiKeyHelp" class="text-xs text-[#F59E0B] flex items-center gap-1">
              <AlertCircle class="size-3" />
              {{ currentProvider.apiKeyHelp }}
            </p>
          </div>

          <div class="h-px bg-gradient-to-r from-transparent via-[#D8D0E8] to-transparent" />

          <!-- 模型选择 -->
          <div class="space-y-1.5">
            <label class="text-sm font-semibold text-[#332F3A]">测试模型</label>
            <div class="flex gap-2">
              <Select
                v-if="availableModels.length > 0"
                v-model="selectedModelId"
                class="flex-1"
              >
                <SelectTrigger class="clay-trigger !h-11 w-full">
                  <SelectValue placeholder="选择模型..." />
                </SelectTrigger>
                <SelectContent class="clay-dropdown max-h-60">
                  <SelectItem
                    v-for="m in availableModels"
                    :key="m.id"
                    :value="m.id"
                  >
                    <span class="font-mono text-sm truncate">{{ m.name }}</span>
                  </SelectItem>
                </SelectContent>
              </Select>
              <input
                v-else
                v-model="selectedModelId"
                class="clay-input flex-1 h-11 text-sm font-mono px-4"
                placeholder="输入模型 ID，如 gpt-4o"
              />
              <button
                class="clay-btn-outline h-11 px-3 gap-1.5 flex items-center shrink-0 font-semibold text-sm"
                :disabled="!apiKey.trim() || !effectiveBaseUrl.trim() || isFetchingModels"
                @click="detectModels"
              >
                <Loader2 v-if="isFetchingModels" class="size-4 animate-spin" />
                <Search v-else class="size-4" />
                <span class="hidden sm:inline">检测模型</span>
              </button>
            </div>
            <p v-if="isFetchingModels" class="text-xs text-[#635F69] flex items-center gap-1">
              <Loader2 class="size-3 animate-spin" />
              正在请求 /models 接口...
            </p>
            <p v-else-if="discoveredModels.length > 0" class="text-xs text-[#10B981] flex items-center gap-1 font-semibold">
              <Check class="size-3" />
              检测到 {{ discoveredModels.length }} 个可用模型
            </p>
            <p v-else-if="modelFetchError" class="text-xs text-[#DB2777] flex items-center gap-1 font-semibold">
              <AlertCircle class="size-3" />
              {{ modelFetchError }}
            </p>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-3">
          <button
            class="clay-btn flex-1 h-12 text-base flex items-center justify-center gap-2"
            :disabled="!apiKey.trim() || !selectedModelId.trim() || isTesting"
            :class="{ 'opacity-60 pointer-events-none': !apiKey.trim() || !selectedModelId.trim() }"
            @click="runTest"
          >
            <Loader2 v-if="isTesting" class="size-5 animate-spin" />
            <Zap v-else class="size-5" />
            {{ isTesting ? '测试中...' : '开始测试' }}
          </button>
          <button
            class="clay-btn-outline h-12 px-6 flex items-center gap-2 shrink-0 font-semibold"
            :disabled="isTesting"
            @click="clearAll"
          >
            <Trash2 class="size-5" />
            <span class="hidden sm:inline">清空</span>
          </button>
        </div>

        <!-- 结果 -->
        <div v-if="testResults.length > 0" class="clay-card p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-extrabold text-lg text-[#332F3A]" style="font-family: var(--font-clay-heading)">
              测试记录 ({{ testResults.length }})
            </h3>
            <button class="text-xs font-semibold text-[#635F69] hover:text-[#DB2777] transition-colors" @click="clearResults">
              清除记录
            </button>
          </div>
          <div
            v-for="(r, i) in testResults"
            :key="i"
            class="flex items-start gap-3 rounded-2xl p-3 border-2 animate-in fade-in slide-in-from-top-2"
            :class="{
              'bg-[#10B981]/5 border-[#10B981]/20': r.success,
              'bg-[#DB2777]/5 border-[#DB2777]/20': !r.success,
            }"
          >
            <div
              :class="[
                'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white',
                r.success ? 'bg-gradient-to-br from-[#10B981] to-[#34D399]' : 'bg-gradient-to-br from-[#DB2777] to-[#F472B6]',
              ]"
            >
              {{ r.success ? '✓' : '✗' }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold">{{ r.message }}</p>
              <div class="mt-1 flex flex-wrap gap-2 text-xs text-[#635F69]">
                <span class="inline-flex items-center gap-1">
                  <Cpu class="size-3" />
                  {{ r.model }}
                </span>
                <span class="inline-flex items-center gap-1">
                  <Clock class="size-3" />
                  {{ r.latencyMs }}ms
                </span>
              </div>
              <p v-if="r.details" class="mt-1 text-xs text-[#635F69] truncate">
                {{ r.details }}
              </p>
            </div>
            <button
              class="h-7 w-7 shrink-0 flex items-center justify-center rounded-lg text-[#635F69] hover:text-[#7C3AED] transition-colors"
              @click="copyResult(r.message)"
            >
              <Check v-if="copied" class="size-3.5" />
              <Clipboard v-else class="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：信息面板 -->
      <div class="lg:col-span-2 space-y-4">
        <div class="clay-card p-5 space-y-3">
          <div class="flex items-center gap-2">
            <div class="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-[#ADD8E6] to-[#7C3AED] text-white">
              <Sparkles class="size-3.5" />
            </div>
            <h3 class="font-extrabold text-lg text-[#332F3A]" style="font-family: var(--font-clay-heading)">使用说明</h3>
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex gap-3">
              <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-xs font-bold text-white">1</span>
              <span class="text-[#635F69]">选择 AI 厂商，Base URL 自动填充</span>
            </div>
            <div class="flex gap-3">
              <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#DB2777] to-[#F472B6] text-xs font-bold text-white">2</span>
              <span class="text-[#635F69]">输入 API Key（支持从剪贴板粘贴）</span>
            </div>
            <div class="flex gap-3">
              <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ADD8E6] to-[#7C3AED] text-xs font-bold text-white">3</span>
              <span class="text-[#635F69]">选择模型或点击「检测模型」自动发现</span>
            </div>
            <div class="flex gap-3">
              <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#10B981] to-[#34D399] text-xs font-bold text-white">4</span>
              <span class="text-[#635F69]">点击「开始测试」，查看连通性结果</span>
            </div>
          </div>
        </div>

        <div class="clay-card p-5 space-y-3">
          <h3 class="font-extrabold text-lg text-[#332F3A]" style="font-family: var(--font-clay-heading)">支持协议</h3>
          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-[#10A37F]/10 text-[#10A37F] border border-[#10A37F]/20">
                OpenAI
              </span>
              <span class="text-[#635F69]">/v1/models + /v1/chat</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-[#D97757]/10 text-[#D97757] border border-[#D97757]/20">
                Anthropic
              </span>
              <span class="text-[#635F69]">/v1/messages</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <span class="px-2.5 py-1 rounded-full text-xs font-bold bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/20">
                Gemini
              </span>
              <span class="text-[#635F69]">generateContent</span>
            </div>
          </div>
        </div>

        <div class="clay-card p-5 space-y-2 border-[#FDBCB4]/30">
          <div class="flex items-center gap-2">
            <AlertCircle class="size-4 text-[#F59E0B]" />
            <h3 class="font-extrabold text-sm text-[#332F3A]">安全提示</h3>
          </div>
          <p class="text-xs text-[#635F69]">
            测试仅发送极短消息（"hi"，max_tokens=5），<strong class="text-[#10B981]">几乎零费用</strong>。
            API Key 仅在浏览器本地使用，绝不离开您的设备。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
