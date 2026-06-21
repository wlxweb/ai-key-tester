<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { getAllProviders } from '@/lib/providers'
import { testApiKey, fetchAvailableModels, type TestResult, type DiscoveredModel } from '@/lib/api-test'
import {
  Globe, Key, Cpu, Loader2, Clipboard, Check, ExternalLink,
  AlertCircle, Clock, Trash2, Shield, Search,
  Zap, Wrench, ChevronDown, Info,
} from 'lucide-vue-next'

const allProviders = getAllProviders()
const selectedProviderId = ref('deepseek')
const selectedProtocol = ref<'openai' | 'anthropic' | 'gemini'>('openai')
const protocolOptions = [
  { id: 'openai' as const, name: 'OpenAI 协议', desc: '/v1/models' },
  { id: 'anthropic' as const, name: 'Anthropic', desc: '/v1/messages' },
  { id: 'gemini' as const, name: 'Gemini', desc: 'generateContent' },
]
const apiKey = ref('')
const selectedModelId = ref('')
const isTesting = ref(false)
const testResults = ref<TestResult[]>([])
const showApiKey = ref(false)
const copied = ref(false)
const inputBaseUrl = ref('')
const discoveredModels = ref<DiscoveredModel[]>([])
const isFetchingModels = ref(false)
const modelFetchError = ref('')
const providerOpen = ref(false)
const protocolOpen = ref(false)

const currentProvider = computed(() => allProviders.find((p) => p.id === selectedProviderId.value))
const isCustom = computed(() => selectedProviderId.value === 'custom')
const effectiveBaseUrl = computed(() => {
  if (isCustom.value) return inputBaseUrl.value
  return inputBaseUrl.value || currentProvider.value?.baseUrl || ''
})
const availableModels = computed(() => {
  if (discoveredModels.value.length > 0) return discoveredModels.value.map((m) => ({ id: m.id, name: m.id }))
  if (isCustom.value) return []
  return currentProvider.value?.models || []
})
const totalTests = computed(() => testResults.value.length)
const successCount = computed(() => testResults.value.filter((r) => r.success).length)
const avgLatency = computed(() => {
  if (!testResults.value.length) return 0
  return Math.round(testResults.value.reduce((a, r) => a + r.latencyMs, 0) / testResults.value.length)
})

watch(selectedProviderId, (newId) => {
  const p = allProviders.find((x) => x.id === newId)
  if (p && !isCustom.value) {
    inputBaseUrl.value = p.baseUrl
    if (p.models.length > 0) selectedModelId.value = p.models[0].id
    selectedProtocol.value = p.protocol
  } else if (isCustom.value) {
    inputBaseUrl.value = ''
    selectedModelId.value = ''
    selectedProtocol.value = 'openai'
  }
  testResults.value = []
  discoveredModels.value = []
  modelFetchError.value = ''
})

const providerGroups = computed(() => {
  const i18n = ['openai', 'anthropic', 'google']
  const domestic = ['deepseek', 'zhipu', 'qwen', 'moonshot', 'baichuan', 'stepfun', 'minimax', 'yi']
  const proxy = ['siliconflow', 'groq', 'together', 'openrouter']
  const local = ['ollama']
  const f = (ids: string[]) => allProviders.filter((p) => ids.includes(p.id))
  return [
    { name: '国际厂商', items: f(i18n) },
    { name: '国内厂商', items: f(domestic) },
    { name: '中转/聚合', items: f(proxy) },
    { name: '本地部署', items: f(local) },
    { name: '自定义', items: allProviders.filter((p) => p.id === 'custom') },
  ].filter((g) => g.items.length > 0)
})

function pasteFromClipboard() { navigator.clipboard.readText().then((t) => { apiKey.value = t.trim() }) }
function copyResult(t: string) { navigator.clipboard.writeText(t); copied.value = true; setTimeout(() => (copied.value = false), 2000) }
async function runTest() {
  if (!apiKey.value.trim() || !selectedModelId.value.trim()) return
  isTesting.value = true; await nextTick()
  testResults.value.unshift(await testApiKey(selectedProviderId.value, effectiveBaseUrl.value, apiKey.value.trim(), selectedModelId.value.trim(), selectedProtocol.value))
  isTesting.value = false
}
function clearResults() { testResults.value = [] }
function clearAll() { apiKey.value = ''; testResults.value = []; discoveredModels.value = []; modelFetchError.value = '' }
async function detectModels() {
  if (!apiKey.value.trim() || !effectiveBaseUrl.value.trim()) return
  isFetchingModels.value = true; modelFetchError.value = ''; discoveredModels.value = []
  const r = await fetchAvailableModels(effectiveBaseUrl.value, apiKey.value.trim())
  if (r.success) { discoveredModels.value = r.models; if (r.models.length > 0) selectedModelId.value = r.models[0].id }
  else modelFetchError.value = r.error || '获取失败'
  isFetchingModels.value = false
}

function selectProvider(id: string) {
  selectedProviderId.value = id
  providerOpen.value = false
}

function selectProtocol(id: 'openai' | 'anthropic' | 'gemini') {
  selectedProtocol.value = id
  protocolOpen.value = false
}

function onProviderBlur(e: FocusEvent) {
  setTimeout(() => {
    if (!(e.relatedTarget as HTMLElement)?.closest('.provider-dropdown')) providerOpen.value = false
  }, 120)
}

function onProtocolBlur(e: FocusEvent) {
  setTimeout(() => {
    if (!(e.relatedTarget as HTMLElement)?.closest('.protocol-dropdown')) protocolOpen.value = false
  }, 120)
}
</script>

<template>
  <div class="saas-analytics min-h-screen flex flex-col">
    <!-- ===== Hero ===== -->
    <section class="hero-gradient pt-16 sm:pt-24 pb-10 sm:pb-16 px-4 overflow-hidden">
      <div class="max-w-6xl mx-auto text-center space-y-3">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border" style="background: rgba(255,255,255,0.7); border-color: rgba(0,128,255,0.15)">
          <Wrench class="w-4 h-4" style="color: var(--primary)" />
          <span style="color: var(--text-muted)">AI Key Tester</span>
        </div>
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold" style="color: var(--text)">
          17+ 厂商 <span class="gradient-text">秒级连通性测试</span>
        </h1>
        <p class="text-sm" style="color: var(--text-muted)">OpenAI · Anthropic · Gemini · 零费用 · 纯本地</p>

        <!-- Stats Row -->
        <div v-if="totalTests > 0" class="flex flex-wrap justify-center gap-3 pt-2">
          <div class="glass-card px-5 py-2.5 text-center min-w-[80px]">
            <div class="text-xl font-bold" style="color: var(--text)">{{ totalTests }}</div>
            <div class="text-xs" style="color: var(--text-muted)">测试次数</div>
          </div>
          <div class="glass-card px-5 py-2.5 text-center min-w-[80px]">
            <div class="text-xl font-bold" style="color: #22c55e">{{ successCount }}</div>
            <div class="text-xs" style="color: var(--text-muted)">成功</div>
          </div>
          <div class="glass-card px-5 py-2.5 text-center min-w-[80px]">
            <div class="text-xl font-bold" style="color: #f59e0b">{{ avgLatency }}<span class="text-sm">ms</span></div>
            <div class="text-xs" style="color: var(--text-muted)">平均延迟</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== Main Content ===== -->
    <section class="flex-1 py-8 sm:py-12 px-4 relative" style="overflow: hidden;">
      <div style="position: absolute; top: 0; left: 50%; width: 100vw; height: 100%; margin-left: -50vw; background: var(--bg-subtle);"></div>
      <div class="max-w-6xl mx-auto relative" style="z-index: 1;">
        <div class="grid gap-5 lg:grid-cols-5">
          <!-- LEFT -->
          <div class="lg:col-span-3 space-y-4">

            <!-- Config Card -->
            <div class="glass-card p-5 space-y-4 relative z-20">
              <h3 class="font-semibold text-base" style="color: var(--text)">厂商与模型</h3>

              <!-- Provider -->
              <div class="space-y-1.5">
                <label class="text-sm font-semibold" style="color: var(--text)">选择 AI 厂商</label>
                <div class="relative provider-dropdown">
                  <button
                    class="glass-input h-11 flex items-center justify-between gap-2 px-4 text-sm text-left cursor-pointer"
                    @click="providerOpen = !providerOpen"
                    @blur="onProviderBlur"
                    type="button"
                  >
                    <span class="flex items-center gap-2 min-w-0">
                      <span v-if="currentProvider" class="flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white" :style="{ background: currentProvider.color }">{{ currentProvider.icon }}</span>
                      <span class="truncate font-semibold" style="color: var(--text)">{{ currentProvider?.name || '选择厂商...' }}</span>
                    </span>
                    <ChevronDown class="size-4 shrink-0" style="color: var(--text-muted)" />
                  </button>
                  <div v-if="providerOpen" class="glass-dropdown absolute top-full left-0 right-0 mt-1 py-1 z-50">
                    <template v-for="(group, gi) in providerGroups" :key="gi">
                      <div class="px-3 py-1 text-xs font-semibold uppercase tracking-wider" style="color: var(--text-muted)">{{ group.name }}</div>
                      <button
                        v-for="p in group.items"
                        :key="p.id"
                        class="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors cursor-pointer"
                        :style="{ background: selectedProviderId === p.id ? 'rgba(0,128,255,0.06)' : 'transparent' }"
                        @mousedown.prevent="selectProvider(p.id)"
                      >
                        <span class="flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white" :style="{ background: p.color }">{{ p.icon }}</span>
                        <span class="text-sm font-semibold" style="color: var(--text)">{{ p.name }}</span>
                      </button>
                      <div v-if="gi < providerGroups.length - 1" class="mx-3 my-1" style="border-top: 1px solid var(--border)" />
                    </template>
                  </div>
                </div>
              </div>

              <!-- Protocol -->
              <div class="space-y-1.5">
                <label class="text-sm font-semibold" style="color: var(--text)">测试协议</label>
                <div class="relative protocol-dropdown">
                  <button
                    class="glass-input h-11 flex items-center justify-between gap-2 px-4 text-sm text-left cursor-pointer"
                    @click="protocolOpen = !protocolOpen"
                    @blur="onProtocolBlur"
                    type="button"
                  >
                    <span class="flex items-center gap-2 min-w-0">
                      <span class="flex size-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white" :style="{ background: selectedProtocol === 'openai' ? '#22c55e' : selectedProtocol === 'anthropic' ? '#8b00ff' : '#f59e0b' }">{{ selectedProtocol === 'openai' ? 'O' : selectedProtocol === 'anthropic' ? 'A' : 'G' }}</span>
                      <span class="truncate font-semibold text-sm" style="color: var(--text)">{{ protocolOptions.find(p => p.id === selectedProtocol)?.name }}</span>
                    </span>
                    <ChevronDown class="size-4 shrink-0" style="color: var(--text-muted)" />
                  </button>
                  <div v-if="protocolOpen" class="glass-dropdown absolute top-full left-0 right-0 mt-1 py-1 z-50">
                    <button
                      v-for="p in protocolOptions"
                      :key="p.id"
                      class="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors cursor-pointer"
                      :style="{ background: selectedProtocol === p.id ? 'rgba(0,128,255,0.06)' : 'transparent' }"
                      @mousedown.prevent="selectProtocol(p.id)"
                    >
                      <span class="text-sm font-semibold" style="color: var(--text)">{{ p.name }}</span>
                      <span class="text-xs ml-auto" style="color: var(--text-muted)">{{ p.desc }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div style="border-top: 1px solid var(--border)" />

              <!-- Base URL -->
              <div class="space-y-1.5">
                <div class="flex items-center gap-1.5">
                  <label class="text-sm font-semibold" style="color: var(--text)">Base URL</label>
                  <span v-if="!isCustom" class="text-xs" style="color: var(--text-muted)">自动填充</span>
                </div>
                <div class="relative">
                  <span class="absolute left-4 top-1/2 -translate-y-1/2" style="color: var(--text-muted)"><Globe class="size-3.5" /></span>
                  <input v-model="inputBaseUrl" class="glass-input pl-10 pr-4 h-11 text-sm" style="font-family: monospace" :placeholder="isCustom ? 'https://your-api.com/v1' : '自动填充...'" />
                </div>
                <p v-if="isCustom" class="text-xs font-semibold flex items-center gap-1" style="color: #f59e0b"><AlertCircle class="size-3" />建议在 Base URL 末尾添加 <code class="px-1 py-0.5 rounded text-xs" style="background: rgba(245,158,11,0.1); font-family: monospace">/v1</code>（OpenAI 兼容接口）</p>
              </div>

              <!-- API Key -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-semibold" style="color: var(--text)">API Key</label>
                  <a v-if="currentProvider?.docUrl" :href="currentProvider.docUrl" target="_blank" class="inline-flex items-center gap-1 text-xs font-semibold hover:underline" style="color: var(--primary)"><ExternalLink class="size-3" />获取 Key</a>
                </div>
                <div class="flex gap-2">
                  <div class="relative flex-1">
                    <span class="absolute left-4 top-1/2 -translate-y-1/2" style="color: var(--text-muted)"><Key class="size-3.5" /></span>
                    <input v-model="apiKey" :type="showApiKey ? 'text' : 'password'" class="glass-input pl-10 pr-14 h-11 text-sm" style="font-family: monospace" placeholder="sk-xxx…xxxx" />
                    <button class="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold rounded hover:bg-black/5" style="color: var(--primary)" @click="showApiKey = !showApiKey" type="button">{{ showApiKey ? '隐藏' : '显示' }}</button>
                  </div>
                  <button class="btn-secondary h-11 w-11 flex items-center justify-center shrink-0" style="padding:0" @click="pasteFromClipboard" title="从剪贴板粘贴" type="button"><Clipboard class="size-4" /></button>
                </div>
                <p v-if="currentProvider?.apiKeyHelp" class="text-xs font-semibold flex items-center gap-1" style="color: #f59e0b"><AlertCircle class="size-3" />{{ currentProvider.apiKeyHelp }}</p>
              </div>

              <div style="border-top: 1px solid var(--border)" />

              <!-- Model -->
              <div class="space-y-1.5">
                <label class="text-sm font-semibold" style="color: var(--text)">测试模型</label>
                <div class="flex gap-2">
                  <select
                    v-if="availableModels.length > 0"
                    v-model="selectedModelId"
                    class="glass-select flex-1 h-11 text-sm"
                  >
                    <option v-for="m in availableModels" :key="m.id" :value="m.id">{{ m.name }}</option>
                  </select>
                  <input v-else v-model="selectedModelId" class="glass-input flex-1 h-11 text-sm" style="font-family: monospace" placeholder="输入模型 ID" />
                  <button class="btn-secondary h-11 px-3 gap-1.5 flex items-center shrink-0 font-semibold text-sm" :disabled="!apiKey.trim() || !effectiveBaseUrl.trim() || isFetchingModels" @click="detectModels" type="button">
                    <Loader2 v-if="isFetchingModels" class="size-4 animate-spin" />
                    <Search v-else class="size-4" />
                    <span class="hidden sm:inline">检测模型</span>
                  </button>
                </div>
                <p v-if="isFetchingModels" class="text-xs flex items-center gap-1" style="color: var(--text-muted)"><Loader2 class="size-3 animate-spin" />正在请求 /models...</p>
                <p v-else-if="discoveredModels.length > 0" class="text-xs font-semibold flex items-center gap-1" style="color: #22c55e"><Check class="size-3" />检测到 {{ discoveredModels.length }} 个可用模型</p>
                <p v-else-if="modelFetchError" class="text-xs font-semibold flex items-center gap-1" style="color: #ef4444"><AlertCircle class="size-3" />{{ modelFetchError }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex gap-3">
              <button class="btn-primary flex-1 h-12 text-base gap-2" :disabled="!apiKey.trim() || !selectedModelId.trim() || isTesting" :style="{ opacity: !apiKey.trim() || !selectedModelId.trim() ? 0.5 : 1 }" @click="runTest" type="button">
                <Loader2 v-if="isTesting" class="size-5 animate-spin" />
                <Zap v-else class="size-5" />
                {{ isTesting ? '测试中...' : '开始测试' }}
              </button>
              <button class="btn-secondary h-12 px-5 gap-2 font-semibold" :disabled="isTesting" @click="clearAll" type="button"><Trash2 class="size-5" />清空</button>
            </div>

            <!-- Results -->
            <div v-if="testResults.length > 0" class="space-y-3">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-base" style="color: var(--text)">测试记录</h3>
                <button class="text-xs font-semibold hover:underline" style="color: var(--text-muted)" @click="clearResults" type="button">清除记录</button>
              </div>
              <div v-for="(r, i) in testResults" :key="i" class="glass-card p-4 flex items-start gap-3 glass-card-hover animate-in">
                <div class="mt-0.5 size-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold text-white" :style="{ background: r.success ? '#22c55e' : '#ef4444' }">{{ r.success ? '✓' : '✗' }}</div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold" style="color: var(--text)">{{ r.message }}</p>
                  <div class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs" style="color: var(--text-muted)">
                    <span class="flex items-center gap-1"><Cpu class="size-3" />{{ r.model }}</span>
                    <span class="flex items-center gap-1"><Clock class="size-3" />{{ r.latencyMs }}ms</span>
                  </div>
                  <p v-if="r.details" class="mt-1 text-xs truncate" style="color: var(--text-muted)">{{ r.details }}</p>
                </div>
                <button class="size-7 rounded-lg flex items-center justify-center shrink-0 hover:bg-black/5 transition-colors" style="color: var(--text-muted)" @click="copyResult(r.message)" type="button"><Check v-if="copied" class="size-3.5" /><Clipboard v-else class="size-3.5" /></button>
              </div>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="lg:col-span-2 space-y-4">
            <!-- Privacy -->
            <div class="glass-card p-4">
              <div class="flex items-start gap-3">
                <Shield class="size-5 shrink-0 mt-0.5" style="color: var(--primary)" />
                <div>
                  <p class="font-semibold text-sm" style="color: var(--text)">隐私安全</p>
                  <p class="text-xs mt-0.5 leading-relaxed" style="color: var(--text-muted)">不收集、不保存、不上传任何密钥和测试数据。所有请求直接从浏览器发出。</p>
                </div>
              </div>
            </div>

            <!-- How to use -->
            <div class="glass-card p-5 space-y-3">
              <h3 class="font-semibold text-sm" style="color: var(--text)">使用说明</h3>
              <div class="space-y-2.5 text-sm">
                <div class="flex gap-3">
                  <span class="flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style="background: var(--primary)">1</span>
                  <span style="color: var(--text-muted)">选择 AI 厂商，Base URL 自动填充</span>
                </div>
                <div class="flex gap-3">
                  <span class="flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style="background: var(--secondary)">2</span>
                  <span style="color: var(--text-muted)">输入 API Key（支持剪贴板粘贴）</span>
                </div>
                <div class="flex gap-3">
                  <span class="flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style="background: var(--cta)">3</span>
                  <span style="color: var(--text-muted)">选择模型或点击「检测模型」自动发现</span>
                </div>
                <div class="flex gap-3">
                  <span class="flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style="background: var(--primary-dark)">4</span>
                  <span style="color: var(--text-muted)">点击「开始测试」，查看连通性结果</span>
                </div>
              </div>
            </div>

            <!-- Protocols -->
            <div class="glass-card p-5 space-y-3">
              <h3 class="font-semibold text-sm" style="color: var(--text)">支持协议</h3>
              <div class="grid grid-cols-3 gap-2">
                <div class="glass-card p-3 text-center">
                  <p class="font-semibold text-sm" style="color: var(--primary)">OpenAI</p>
                  <p class="text-xs mt-0.5" style="color: var(--text-muted)">/v1/models</p>
                </div>
                <div class="glass-card p-3 text-center">
                  <p class="font-semibold text-sm" style="color: var(--secondary)">Anthropic</p>
                  <p class="text-xs mt-0.5" style="color: var(--text-muted)">/v1/messages</p>
                </div>
                <div class="glass-card p-3 text-center">
                  <p class="font-semibold text-sm" style="color: var(--cta)">Gemini</p>
                  <p class="text-xs mt-0.5" style="color: var(--text-muted)">generate</p>
                </div>
              </div>
            </div>

            <!-- Cost -->
            <div class="glass-card p-4">
              <div class="flex items-center gap-2 mb-2">
                <Info class="size-4" style="color: var(--primary)" />
                <h3 class="font-semibold text-sm" style="color: var(--text)">零成本测试</h3>
              </div>
              <p class="text-sm leading-relaxed" style="color: var(--text-muted)">
                仅发送 <strong style="color: var(--text);font-weight:600">"hi" (max_tokens=5)</strong>，几乎零费用。Key 仅在浏览器本地使用。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative py-6 text-center text-xs" style="color: var(--text-muted); background: var(--bg-subtle); border-top: 1px solid var(--border); z-index: 1;">
      AI Key Tester · 纯本地测试，无任何数据上传
    </footer>
  </div>
</template>
