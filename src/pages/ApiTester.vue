<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
import { getAllProviders } from '@/lib/providers'
import { testApiKey, fetchAvailableModels, type TestResult, type DiscoveredModel } from '@/lib/api-test'
import {
  Globe,
  Key,
  Cpu,
  Play,
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
const inputBaseUrl = ref('') // 用户手动输入的 baseUrl
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

// 搜索过滤后的厂商列表
const filteredProviders = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return allProviders
  return allProviders.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.id.toLowerCase().includes(q),
  )
})

// 分组搜索过滤后的厂商
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

// 实际使用的 baseUrl
const effectiveBaseUrl = computed(() => {
  if (isCustom.value) return inputBaseUrl.value
  return inputBaseUrl.value || currentProvider.value?.baseUrl || ''
})

// 可用模型列表（静态预设 + 动态检测）
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
  // 滚动到结果区
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
    <Alert class="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <Shield class="size-4" />
      <AlertTitle>隐私声明</AlertTitle>
      <AlertDescription>
        本工具仅用于本地测试 API Key 连通性，<strong>不会收集、保存、上传您的任何密钥或测试数据</strong>。所有请求直接从您的浏览器发出，不经过任何中间服务器。
      </AlertDescription>
    </Alert>

    <!-- 标题 -->
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <h2 class="text-2xl font-bold tracking-tight">API Key 测试工具</h2>
        <p class="text-sm text-muted-foreground">
          测试各大 AI 模型 API Key 的可用性，支持 OpenAI / Anthropic / Gemini 协议
        </p>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <a
              href="https://platform.openai.com/docs/api-reference"
              target="_blank"
              class="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink class="size-4" />
              API 文档参考
            </a>
          </TooltipTrigger>
          <TooltipContent>查看 OpenAI API 参考文档</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- ===== 左侧：配置面板 ===== -->
      <div class="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader class="pb-4">
            <CardTitle class="text-base flex items-center gap-2">
              <Cpu class="size-4" />
              厂商与模型
            </CardTitle>
          </CardHeader>
          <CardContent class="space-y-4">
            <!-- 厂商选择 -->
            <div class="space-y-2">
              <label class="text-sm font-medium">选择 AI 厂商</label>
              <Combobox v-model="selectedProviderId" v-model:open="comboboxOpen">
                <ComboboxAnchor class="relative">
                  <ComboboxTrigger class="w-full flex items-center justify-between gap-2 px-3 h-11" @click="searchQuery = ''">
                    <div class="flex items-center gap-2 min-w-0">
                      <span
                        v-if="currentProvider"
                        class="flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
                        :style="{ backgroundColor: currentProvider.color }"
                      >{{ currentProvider.icon }}</span>
                      <span class="truncate">{{ currentProvider?.name || '选择厂商...' }}</span>
                    </div>
                    <ChevronsUpDown class="size-4 shrink-0 opacity-50" />
                  </ComboboxTrigger>
                  <ComboboxList>
                    <ComboboxInput
                      placeholder="搜索厂商..."
                      @update:model-value="(v: string) => searchQuery = v"
                    />
                    <div class="overflow-y-auto overflow-x-hidden max-h-60">
                      <ComboboxEmpty class="py-6 text-center text-sm text-muted-foreground">
                        未找到匹配的厂商
                      </ComboboxEmpty>
                      <template v-for="(group, gi) in filteredGroups" :key="gi">
                        <div class="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
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
                          class="flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
                          :style="{ backgroundColor: p.color }"
                        >{{ p.icon }}</span>
                        <span class="flex-1 truncate">{{ p.name }}</span>
                        <Badge variant="outline" class="text-[10px] px-1 py-0 h-4 shrink-0">
                          {{ p.protocol === 'anthropic' ? 'Anthropic' : p.protocol === 'gemini' ? 'Gemini' : 'OpenAI' }}
                        </Badge>
                      </ComboboxItem>
                      <ComboboxSeparator v-if="gi < filteredGroups.length - 1" />
                    </template>
                    </div>
                  </ComboboxList>
                </ComboboxAnchor>
              </Combobox>
              <!-- 协议提示 -->
              <p v-if="currentProvider?.protocol" class="text-xs text-muted-foreground">
                协议: 
                <Badge variant="secondary" class="ml-1 text-[10px]">
                  {{ currentProvider.protocol === 'openai' ? 'OpenAI 兼容' : currentProvider.protocol === 'anthropic' ? 'Anthropic Messages' : 'Google Gemini' }}
                </Badge>
              </p>
            </div>

            <Separator />

            <!-- Base URL -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium">Base URL</label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger as-child>
                      <Info class="size-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      选择厂商后自动填充，也可手动修改
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Globe class="size-4" />
                </span>
                <Input
                  v-model="inputBaseUrl"
                  class="pl-9 font-mono text-sm h-11"
                  :placeholder="isCustom ? 'https://your-api.com/v1' : '选择厂商后自动填充...'"
                />
              </div>
            </div>

            <!-- API Key -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium">API Key</label>
                <div class="flex items-center gap-2">
                  <TooltipProvider v-if="currentProvider?.docUrl">
                    <Tooltip>
                      <TooltipTrigger as-child>
                        <a
                          :href="currentProvider.docUrl"
                          target="_blank"
                          class="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink class="size-3" />
                          获取 Key
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>前往 {{ currentProvider.name }} 获取 API Key</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div class="relative flex gap-2">
                <div class="relative flex-1">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Key class="size-4" />
                  </span>
                  <Input
                    v-model="apiKey"
                    :type="showApiKey ? 'text' : 'password'"
                    class="pl-9 pr-16 font-mono text-sm h-11"
                    placeholder="sk-xxxxxxxxxxxxxxxx"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    class="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                    @click="showApiKey = !showApiKey"
                  >
                    <span class="text-xs">{{ showApiKey ? '隐藏' : '显示' }}</span>
                  </Button>
                </div>
                <Button variant="outline" size="icon" class="h-11 w-11" @click="pasteFromClipboard" title="从剪贴板粘贴">
                  <Clipboard class="size-5" />
                </Button>
              </div>
              <p v-if="currentProvider?.apiKeyHelp" class="text-xs text-muted-foreground">
                <AlertCircle class="size-3 inline mr-1" />
                {{ currentProvider.apiKeyHelp }}
              </p>
            </div>

            <!-- 模型选择 -->
            <div class="space-y-2">
              <label class="text-sm font-medium">测试模型</label>
              <div class="flex gap-2">
                <Select
                  v-if="availableModels.length > 0"
                  v-model="selectedModelId"
                  class="flex-1"
                >
                  <SelectTrigger class="!h-11 w-full">
                    <SelectValue placeholder="选择模型..." />
                  </SelectTrigger>
                  <SelectContent class="max-h-60">
                    <SelectItem
                      v-for="m in availableModels"
                      :key="m.id"
                      :value="m.id"
                    >
                      <span class="font-mono text-sm truncate">{{ m.name }}</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  v-else
                  v-model="selectedModelId"
                  class="font-mono text-sm h-11 flex-1"
                  placeholder="输入模型 ID，如 gpt-4o"
                />
                <Button
                  variant="outline"
                  class="h-11 px-3 gap-1.5 shrink-0"
                  :disabled="!apiKey.trim() || !effectiveBaseUrl.trim() || isFetchingModels"
                  @click="detectModels"
                >
                  <Loader2 v-if="isFetchingModels" class="size-4 animate-spin" />
                  <Search v-else class="size-4" />
                  <span class="hidden sm:inline">检测模型</span>
                </Button>
              </div>
              <p v-if="isFetchingModels" class="text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 class="size-3 animate-spin" />
                正在请求 /models 接口...
              </p>
              <p v-else-if="discoveredModels.length > 0" class="text-xs text-green-600 flex items-center gap-1">
                <Check class="size-3" />
                检测到 {{ discoveredModels.length }} 个可用模型
              </p>
              <p v-else-if="modelFetchError" class="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle class="size-3" />
                {{ modelFetchError }}
              </p>
            </div>
          </CardContent>
        </Card>

        <!-- 操作区 -->
        <div class="flex gap-3">
          <Button
            class="flex-1 h-12 text-base"
            size="lg"
            :disabled="!apiKey.trim() || !selectedModelId.trim() || isTesting"
            @click="runTest"
          >
            <Loader2 v-if="isTesting" class="size-5 mr-2 animate-spin" />
            <Play v-else class="size-5 mr-2" />
            {{ isTesting ? '测试中...' : '开始测试' }}
          </Button>
          <Button variant="outline" size="lg" class="h-12" @click="clearAll" :disabled="isTesting">
            <Trash2 class="size-5 mr-2" />
            清空
          </Button>
        </div>

        <!-- 结果区域 -->
        <Card v-if="testResults.length > 0">
          <CardHeader class="pb-2">
            <div class="flex items-center justify-between">
              <CardTitle class="text-base">
                测试记录 ({{ testResults.length }})
              </CardTitle>
              <Button variant="ghost" size="sm" @click="clearResults">
                清除记录
              </Button>
            </div>
          </CardHeader>
          <CardContent class="space-y-2">
            <div
              v-for="(r, i) in testResults"
              :key="i"
              :class="[
                'flex items-start gap-3 rounded-lg border p-3',
                r.success
                  ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950'
                  : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950',
              ]"
            >
              <div
                :class="[
                  'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  r.success
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white',
                ]"
              >
                {{ r.success ? '✓' : '✗' }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium">{{ r.message }}</p>
                <div class="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span class="inline-flex items-center gap-1">
                    <Cpu class="size-3" />
                    {{ r.model }}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <Clock class="size-3" />
                    {{ r.latencyMs }}ms
                  </span>
                </div>
                <p v-if="r.details" class="mt-1 text-xs text-muted-foreground truncate">
                  {{ r.details }}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                class="h-7 w-7 shrink-0"
                @click="copyResult(r.message)"
              >
                <Check v-if="copied" class="size-3.5" />
                <Clipboard v-else class="size-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- ===== 右侧：说明面板 ===== -->
      <div class="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle class="text-base">使用说明</CardTitle>
          </CardHeader>
          <CardContent class="text-sm space-y-3">
            <div class="flex gap-2">
              <span class="text-primary font-bold">1</span>
              <span>选择 AI 厂商，Base URL 自动填充</span>
            </div>
            <div class="flex gap-2">
              <span class="text-primary font-bold">2</span>
              <span>输入 API Key（支持从剪贴板粘贴）</span>
            </div>
            <div class="flex gap-2">
              <span class="text-primary font-bold">3</span>
              <span>选择或输入要测试的模型 ID</span>
            </div>
            <div class="flex gap-2">
              <span class="text-primary font-bold">4</span>
              <span>点击「开始测试」，查看结果</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle class="text-base">支持协议</CardTitle>
            <CardDescription>自动根据厂商匹配</CardDescription>
          </CardHeader>
          <CardContent class="space-y-2">
            <div class="flex items-center gap-2 text-sm">
              <Badge>OpenAI 兼容</Badge>
              <span class="text-muted-foreground">/v1/models + /v1/chat</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <Badge variant="secondary">Anthropic</Badge>
              <span class="text-muted-foreground">/v1/messages</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
              <Badge variant="outline">Gemini</Badge>
              <span class="text-muted-foreground">generateContent</span>
            </div>
          </CardContent>
        </Card>

        <!-- 安全提示 -->
        <Alert>
          <AlertCircle class="size-4" />
          <AlertTitle>安全提示</AlertTitle>
          <AlertDescription class="text-xs">
            测试仅发送极短消息（"hi"，max_tokens=5），不会产生大量费用。API Key 仅在浏览器本地使用，不会上传到任何服务器。
          </AlertDescription>
        </Alert>
      </div>
    </div>
  </div>
</template>
