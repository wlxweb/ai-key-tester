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
  Globe, Key, Cpu, Loader2, Clipboard, Check, ExternalLink,
  Info, AlertCircle, Clock, Trash2, Shield, Search, ChevronsUpDown,
  Sparkles, Zap, Layers, Rocket, BarChart3,
} from 'lucide-vue-next'

// State
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

// Computed
const currentProvider = computed(() => allProviders.find((p) => p.id === selectedProviderId.value))
const isCustom = computed(() => selectedProviderId.value === 'custom')
const effectiveBaseUrl = computed(() => {
  if (isCustom.value) return inputBaseUrl.value
  return inputBaseUrl.value || currentProvider.value?.baseUrl || ''
})

const availableModels = computed(() => {
  if (discoveredModels.value.length > 0) {
    return discoveredModels.value.map((m) => ({ id: m.id, name: m.id, owned_by: m.owned_by }))
  }
  if (isCustom.value) return []
  return currentProvider.value?.models || []
})

const filteredProviders = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return allProviders
  return allProviders.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
})

const filteredGroups = computed(() => {
  const i18n = ['openai', 'anthropic', 'google']
  const domestic = ['deepseek', 'zhipu', 'qwen', 'moonshot', 'baichuan', 'stepfun', 'minimax', 'yi']
  const proxy = ['siliconflow', 'groq', 'together', 'openrouter']
  const local = ['ollama']
  const f = (ids: string[]) => filteredProviders.value.filter((p) => ids.includes(p.id))
  return [
    { name: '国际厂商', items: f(i18n) },
    { name: '国内厂商', items: f(domestic) },
    { name: '中转/聚合', items: f(proxy) },
    { name: '本地部署', items: f(local) },
    { name: '自定义', items: filteredProviders.value.filter((p) => p.id === 'custom') },
  ].filter((g) => g.items.length > 0)
})

// Stats
const totalTests = computed(() => testResults.value.length)
const successCount = computed(() => testResults.value.filter((r) => r.success).length)
const avgLatency = computed(() => {
  if (!testResults.value.length) return 0
  return Math.round(testResults.value.reduce((a, r) => a + r.latencyMs, 0) / testResults.value.length)
})

// Watchers
watch(selectedProviderId, (newId) => {
  const p = allProviders.find((x) => x.id === newId)
  if (p && !isCustom.value) {
    inputBaseUrl.value = p.baseUrl
    if (p.models.length > 0) selectedModelId.value = p.models[0].id
  } else if (isCustom.value) {
    inputBaseUrl.value = ''
    selectedModelId.value = ''
  }
  testResults.value = []
  discoveredModels.value = []
  modelFetchError.value = ''
})

// Methods
function pasteFromClipboard() {
  navigator.clipboard.readText().then((t) => { apiKey.value = t.trim() })
}
function copyResult(t: string) {
  navigator.clipboard.writeText(t)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
async function runTest() {
  if (!apiKey.value.trim() || !selectedModelId.value.trim()) return
  isTesting.value = true; await nextTick()
  testResults.value.unshift(await testApiKey(selectedProviderId.value, effectiveBaseUrl.value, apiKey.value.trim(), selectedModelId.value.trim()))
  isTesting.value = false
}
function clearResults() { testResults.value = [] }
function clearAll() {
  apiKey.value = ''; testResults.value = []; discoveredModels.value = []; modelFetchError.value = ''
}
async function detectModels() {
  if (!apiKey.value.trim() || !effectiveBaseUrl.value.trim()) return
  isFetchingModels.value = true; modelFetchError.value = ''; discoveredModels.value = []
  const r = await fetchAvailableModels(effectiveBaseUrl.value, apiKey.value.trim())
  if (r.success) { discoveredModels.value = r.models; if (r.models.length > 0 && !selectedModelId.value) selectedModelId.value = r.models[0].id }
  else modelFetchError.value = r.error || '获取失败'
  isFetchingModels.value = false
}
</script>

<template>
  <div class="space-y-[--block-gap-mobile] md:space-y-[--block-gap]">
    <!-- ===== Hero Block ===== -->
    <div class="block-section block-purple text-center space-y-4">
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-[#7C3AED]/15 shadow-sm">
        <Sparkles class="size-4 text-[#7C3AED]" />
        <span class="text-sm font-bold text-[#7C3AED]">AI Key Tester</span>
      </div>
      <h1 class="text-4xl md:text-5xl font-black tracking-tight leading-tight" style="font-family: var(--font-clay-heading)">
        <span class="bg-gradient-to-r from-[#7C3AED] via-[#DB2777] to-[#FF6B6B] bg-clip-text text-transparent">
          API Key 连通性测试
        </span>
      </h1>
      <p class="text-[#6E6A78] text-base md:text-lg max-w-lg mx-auto font-medium">
        17+ 厂商 · 3 协议 · 秒级检测 · 零费用
      </p>

      <!-- Quick Stats -->
      <div v-if="totalTests > 0" class="flex flex-wrap justify-center gap-3">
        <div class="stat-card px-5 py-3">
          <div class="stat-value text-2xl">{{ totalTests }}</div>
          <div class="text-xs text-[#6E6A78] font-semibold mt-1">测试次数</div>
        </div>
        <div class="stat-card px-5 py-3">
          <div class="stat-value text-2xl" style="background: linear-gradient(135deg, #10B981, #34D399); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            {{ successCount }}
          </div>
          <div class="text-xs text-[#6E6A78] font-semibold mt-1">成功</div>
        </div>
        <div class="stat-card px-5 py-3">
          <div class="stat-value text-2xl" style="background: linear-gradient(135deg, #F59E0B, #FFAA00); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            {{ avgLatency }}<span class="text-sm">ms</span>
          </div>
          <div class="text-xs text-[#6E6A78] font-semibold mt-1">平均延迟</div>
        </div>
      </div>
    </div>

    <!-- ===== Main Content: Configuration ===== -->
    <div class="grid gap-[--block-gap-mobile] md:gap-[--block-gap] lg:grid-cols-5">
      <!-- LEFT: 配置表单 -->
      <div class="lg:col-span-3 space-y-5">
        <!-- Card: 厂商 & 模型 -->
        <div class="clay-card p-5 md:p-6 space-y-5">
          <div class="flex items-center gap-2.5">
            <div class="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-white shadow-lg shadow-purple-500/20">
              <Cpu class="size-4" />
            </div>
            <h3 class="font-extrabold text-lg" style="font-family: var(--font-clay-heading)">厂商与模型</h3>
          </div>

          <!-- Provider Select -->
          <div class="space-y-1.5">
            <label class="text-sm font-bold">选择 AI 厂商</label>
            <Combobox v-model="selectedProviderId" v-model:open="comboboxOpen">
              <ComboboxAnchor class="relative">
                <ComboboxTrigger class="clay-trigger w-full flex items-center justify-between gap-2 px-4 h-11" @click="searchQuery = ''">
                  <div class="flex items-center gap-2 min-w-0">
                    <span v-if="currentProvider" class="flex size-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white" :style="{ background: `linear-gradient(135deg, ${currentProvider.color}, ${currentProvider.color}dd)` }">{{ currentProvider.icon }}</span>
                    <span class="truncate font-bold text-sm">{{ currentProvider?.name || '选择厂商...' }}</span>
                  </div>
                  <ChevronsUpDown class="size-4 shrink-0 opacity-40" />
                </ComboboxTrigger>
                <ComboboxList class="clay-dropdown">
                  <ComboboxInput placeholder="搜索厂商..." @update:model-value="(v: string) => searchQuery = v" />
                  <div class="overflow-y-auto overflow-x-hidden max-h-60">
                    <ComboboxEmpty class="py-6 text-center text-sm text-[#6E6A78]">未找到匹配的厂商</ComboboxEmpty>
                    <template v-for="(group, gi) in filteredGroups" :key="gi">
                      <div class="px-3 py-1.5 text-xs font-extrabold text-[#7C3AED]">{{ group.name }}</div>
                      <ComboboxItem v-for="p in group.items" :key="p.id" :value="p.id" class="py-2.5" @select="comboboxOpen = false">
                        <span class="flex size-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white" :style="{ background: `linear-gradient(135deg, ${p.color}, ${p.color}dd)` }">{{ p.icon }}</span>
                        <span class="flex-1 truncate font-bold text-sm">{{ p.name }}</span>
                      </ComboboxItem>
                      <ComboboxSeparator v-if="gi < filteredGroups.length - 1" />
                    </template>
                  </div>
                </ComboboxList>
              </ComboboxAnchor>
            </Combobox>
          </div>

          <div class="h-px bg-gradient-to-r from-transparent via-[#E4DEF0] to-transparent" />

          <!-- Base URL -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-sm font-bold">Base URL</label>
              <TooltipProvider><Tooltip><TooltipTrigger as-child><Info class="size-3.5 text-[#6E6A78] cursor-help" /></TooltipTrigger><TooltipContent>选择厂商后自动填充</TooltipContent></Tooltip></TooltipProvider>
            </div>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6A78]"><Globe class="size-4" /></span>
              <input v-model="inputBaseUrl" class="clay-input w-full pl-10 pr-4 h-11 text-sm font-mono" :placeholder="isCustom ? 'https://your-api.com/v1' : '选择厂商后自动填充...'" />
            </div>
          </div>

          <!-- API Key -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-sm font-bold">API Key</label>
              <a v-if="currentProvider?.docUrl" :href="currentProvider.docUrl" target="_blank" class="inline-flex items-center gap-1 text-xs font-bold text-[#7C3AED] hover:text-[#FF6B6B] transition-colors"><ExternalLink class="size-3" />获取 Key</a>
            </div>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-[#6E6A78]"><Key class="size-4" /></span>
                <input v-model="apiKey" :type="showApiKey ? 'text' : 'password'" class="clay-input w-full pl-10 pr-14 h-11 text-sm font-mono" placeholder="sk-xxxxxxxxxxxxxxxx" />
                <button class="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-bold text-[#7C3AED] hover:text-[#FF6B6B] transition-colors" @click="showApiKey = !showApiKey">{{ showApiKey ? '隐藏' : '显示' }}</button>
              </div>
              <button class="clay-btn-outline h-11 w-11 flex items-center justify-center shrink-0" @click="pasteFromClipboard" title="从剪贴板粘贴"><Clipboard class="size-4" /></button>
            </div>
            <p v-if="currentProvider?.apiKeyHelp" class="text-xs text-[#F59E0B] flex items-center gap-1 font-semibold"><AlertCircle class="size-3" />{{ currentProvider.apiKeyHelp }}</p>
          </div>

          <div class="h-px bg-gradient-to-r from-transparent via-[#E4DEF0] to-transparent" />

          <!-- Model -->
          <div class="space-y-1.5">
            <label class="text-sm font-bold">测试模型</label>
            <div class="flex gap-2">
              <Select v-if="availableModels.length > 0" v-model="selectedModelId" class="flex-1">
                <SelectTrigger class="clay-trigger !h-11 w-full"><SelectValue placeholder="选择模型..." /></SelectTrigger>
                <SelectContent class="clay-dropdown max-h-60">
                  <SelectItem v-for="m in availableModels" :key="m.id" :value="m.id"><span class="font-mono text-sm truncate">{{ m.name }}</span></SelectItem>
                </SelectContent>
              </Select>
              <input v-else v-model="selectedModelId" class="clay-input flex-1 h-11 text-sm font-mono px-4" placeholder="输入模型 ID，如 gpt-4o" />
              <button class="clay-btn-outline h-11 px-3 gap-1.5 flex items-center shrink-0 font-bold text-sm" :disabled="!apiKey.trim() || !effectiveBaseUrl.trim() || isFetchingModels" @click="detectModels">
                <Loader2 v-if="isFetchingModels" class="size-4 animate-spin" />
                <Search v-else class="size-4" />
                <span class="hidden sm:inline">检测模型</span>
              </button>
            </div>
            <p v-if="isFetchingModels" class="text-xs text-[#6E6A78] flex items-center gap-1"><Loader2 class="size-3 animate-spin" />正在请求 /models...</p>
            <p v-else-if="discoveredModels.length > 0" class="text-xs text-[#10B981] flex items-center gap-1 font-bold"><Check class="size-3" />检测到 {{ discoveredModels.length }} 个可用模型</p>
            <p v-else-if="modelFetchError" class="text-xs text-[#FF6B6B] flex items-center gap-1 font-bold"><AlertCircle class="size-3" />{{ modelFetchError }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3">
          <button class="clay-btn flex-1 h-12 text-base flex items-center justify-center gap-2" :disabled="!apiKey.trim() || !selectedModelId.trim() || isTesting" :class="{ 'opacity-50 pointer-events-none': !apiKey.trim() || !selectedModelId.trim() }" @click="runTest">
            <Loader2 v-if="isTesting" class="size-5 animate-spin" />
            <Zap v-else class="size-5" />
            {{ isTesting ? '测试中...' : '开始测试' }}
          </button>
          <button class="clay-btn-outline h-12 px-6 flex items-center gap-2 shrink-0 font-bold" :disabled="isTesting" @click="clearAll"><Trash2 class="size-5" /><span class="hidden sm:inline">清空</span></button>
        </div>

        <!-- Test Results Block -->
        <div v-if="testResults.length > 0" class="block-section block-green space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#00D4AA] to-[#34D399] text-white shadow-lg shadow-green-500/20"><BarChart3 class="size-4" /></div>
              <h3 class="font-extrabold text-lg" style="font-family: var(--font-clay-heading)">测试记录</h3>
            </div>
            <button class="text-xs font-bold text-[#6E6A78] hover:text-[#FF6B6B] transition-colors" @click="clearResults">清除记录</button>
          </div>
          <div v-for="(r, i) in testResults" :key="i" class="clay-card p-3 flex items-start gap-3 animate-in fade-in slide-in-from-top-2" :class="{ 'border-[#10B981]/20': r.success, 'border-[#FF6B6B]/20': !r.success }">
            <div :class="['mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white', r.success ? 'bg-gradient-to-br from-[#10B981] to-[#34D399]' : 'bg-gradient-to-br from-[#FF6B6B] to-[#F472B6]']">{{ r.success ? '✓' : '✗' }}</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold">{{ r.message }}</p>
              <div class="mt-1 flex flex-wrap gap-2 text-xs text-[#6E6A78] font-semibold">
                <span class="inline-flex items-center gap-1"><Cpu class="size-3" />{{ r.model }}</span>
                <span class="inline-flex items-center gap-1"><Clock class="size-3" />{{ r.latencyMs }}ms</span>
              </div>
              <p v-if="r.details" class="mt-1 text-xs text-[#6E6A78] truncate">{{ r.details }}</p>
            </div>
            <button class="h-7 w-7 shrink-0 flex items-center justify-center rounded-lg text-[#6E6A78] hover:text-[#7C3AED] transition-colors" @click="copyResult(r.message)"><Check v-if="copied" class="size-3.5" /><Clipboard v-else class="size-3.5" /></button>
          </div>
        </div>
      </div>

      <!-- RIGHT: Info panels -->
      <div class="lg:col-span-2 space-y-5">
        <!-- Privacy Banner -->
        <div class="clay-card p-4 flex items-start gap-3 border-[#FF6B6B]/15">
          <div class="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFAA00] to-[#FF6B6B] text-white shadow-lg shadow-orange-500/20"><Shield class="size-4" /></div>
          <div>
            <p class="font-extrabold text-sm">隐私声明</p>
            <p class="text-xs text-[#6E6A78] mt-0.5">不收集、不保存、不上传任何密钥和测试数据。所有请求直接从浏览器发出。</p>
          </div>
        </div>

        <!-- How to Use -->
        <div class="block-section block-purple rounded-2xl space-y-3">
          <div class="flex items-center gap-2">
            <div class="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#DB2777] text-white shadow-lg shadow-purple-500/20"><Rocket class="size-4" /></div>
            <h3 class="font-extrabold text-lg" style="font-family: var(--font-clay-heading)">使用说明</h3>
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex gap-3"><span class="flex size-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] text-xs font-black text-white">1</span><span class="text-[#6E6A78] font-medium">选择 AI 厂商，Base URL 自动填充</span></div>
            <div class="flex gap-3"><span class="flex size-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#DB2777] to-[#F472B6] text-xs font-black text-white">2</span><span class="text-[#6E6A78] font-medium">输入 API Key（支持剪贴板粘贴）</span></div>
            <div class="flex gap-3"><span class="flex size-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#0099FF] to-[#00FFFF] text-xs font-black text-white">3</span><span class="text-[#6E6A78] font-medium">选择模型或点击「检测模型」自动发现</span></div>
            <div class="flex gap-3"><span class="flex size-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#10B981] to-[#34D399] text-xs font-black text-white">4</span><span class="text-[#6E6A78] font-medium">点击「开始测试」，查看连通性结果</span></div>
          </div>
        </div>

        <!-- Protocols -->
        <div class="block-section block-cyan rounded-2xl space-y-3">
          <div class="flex items-center gap-2">
            <div class="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#0099FF] to-[#00FFFF] text-white shadow-lg shadow-cyan-500/20"><Layers class="size-4" /></div>
            <h3 class="font-extrabold text-lg" style="font-family: var(--font-clay-heading)">支持协议</h3>
          </div>
          <div class="grid grid-cols-3 gap-2">
            <div class="clay-card p-3 text-center">
              <p class="font-black text-sm text-[#10A37F]">OpenAI</p>
              <p class="text-[10px] text-[#6E6A78] font-semibold mt-0.5">/v1/models</p>
            </div>
            <div class="clay-card p-3 text-center">
              <p class="font-black text-sm text-[#D97757]">Anthropic</p>
              <p class="text-[10px] text-[#6E6A78] font-semibold mt-0.5">/v1/messages</p>
            </div>
            <div class="clay-card p-3 text-center">
              <p class="font-black text-sm text-[#4285F4]">Gemini</p>
              <p class="text-[10px] text-[#6E6A78] font-semibold mt-0.5">generate</p>
            </div>
          </div>
        </div>

        <!-- Security -->
        <div class="block-section block-orange rounded-2xl space-y-3">
          <div class="flex items-center gap-2">
            <AlertCircle class="size-4 text-[#F59E0B]" />
            <h3 class="font-extrabold text-sm">安全 & 成本</h3>
          </div>
          <p class="text-sm text-[#6E6A78] font-medium">
            测试仅发送 <strong class="text-[#332F3A]">"hi" (max_tokens=5)</strong>，
            <span class="text-[#10B981] font-bold">几乎零费用</span>。
            Key 仅在浏览器本地使用。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
