// AI 模型厂商配置，支持多协议
export interface ModelInfo {
  id: string
  name: string
  contextWindow?: number
}

export interface Provider {
  id: string
  name: string
  baseUrl: string
  protocol: 'openai' | 'anthropic' | 'gemini'
  models: ModelInfo[]
  docUrl?: string
  apiKeyEnv?: string
  apiKeyHelp?: string
  color: string
  icon: string
}

export const providers: Provider[] = [
  // ===== 国际厂商 =====
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    protocol: 'openai',
    apiKeyEnv: 'OPENAI_API_KEY',
    docUrl: 'https://platform.openai.com/api-keys',
    color: '#10A37F',
    icon: 'O',
    models: [
      { id: 'gpt-4.1', name: 'GPT-4.1', contextWindow: 1000000 },
      { id: 'gpt-4o', name: 'GPT-4o', contextWindow: 128000 },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', contextWindow: 128000 },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', contextWindow: 128000 },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    protocol: 'anthropic',
    apiKeyEnv: 'ANTHROPIC_API_KEY',
    docUrl: 'https://console.anthropic.com/keys',
    apiKeyHelp: 'API Key 格式: sk-ant-api03-...',
    color: '#D97757',
    icon: 'A',
    models: [
      { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', contextWindow: 200000 },
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', contextWindow: 200000 },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', contextWindow: 200000 },
    ],
  },
  {
    id: 'google',
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    protocol: 'gemini',
    apiKeyEnv: 'GOOGLE_API_KEY',
    docUrl: 'https://aistudio.google.com/apikey',
    color: '#4285F4',
    icon: 'G',
    models: [
      { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
    ],
  },

  // ===== 国内厂商 =====
  {
    id: 'deepseek',
    name: 'DeepSeek',
    baseUrl: 'https://api.deepseek.com/v1',
    protocol: 'openai',
    apiKeyEnv: 'DEEPSEEK_API_KEY',
    docUrl: 'https://platform.deepseek.com/api_keys',
    color: '#4D6BFE',
    icon: 'D',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek V3', contextWindow: 65536 },
      { id: 'deepseek-reasoner', name: 'DeepSeek R1', contextWindow: 65536 },
    ],
  },
  {
    id: 'zhipu',
    name: '智谱 AI (GLM)',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    protocol: 'openai',
    apiKeyEnv: 'ZHIPU_API_KEY',
    docUrl: 'https://open.bigmodel.cn/usercenter/apikeys',
    apiKeyHelp: 'API Key 包含 "." 分隔符, 格式: xxx.yyy',
    color: '#4A6CF7',
    icon: '智',
    models: [
      { id: 'glm-4-plus', name: 'GLM-4 Plus', contextWindow: 128000 },
      { id: 'glm-4-flash', name: 'GLM-4 Flash', contextWindow: 128000 },
      { id: 'glm-4-air', name: 'GLM-4 Air', contextWindow: 128000 },
    ],
  },
  {
    id: 'qwen',
    name: '通义千问 (Qwen)',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    protocol: 'openai',
    apiKeyEnv: 'DASHSCOPE_API_KEY',
    docUrl: 'https://bailian.console.aliyun.com/?apiKey=1',
    color: '#FF6A00',
    icon: '千',
    models: [
      { id: 'qwen3-235b-a22b', name: 'Qwen3-235B' },
      { id: 'qwen-max', name: 'Qwen Max' },
      { id: 'qwen-plus', name: 'Qwen Plus' },
      { id: 'qwen-turbo', name: 'Qwen Turbo' },
    ],
  },
  {
    id: 'moonshot',
    name: 'Moonshot (月之暗面)',
    baseUrl: 'https://api.moonshot.cn/v1',
    protocol: 'openai',
    apiKeyEnv: 'MOONSHOT_API_KEY',
    docUrl: 'https://platform.moonshot.cn/console/api-keys',
    color: '#1C1C1E',
    icon: 'M',
    models: [
      { id: 'moonshot-v1-8k', name: 'Moonshot v1 8K' },
      { id: 'moonshot-v1-32k', name: 'Moonshot v1 32K' },
      { id: 'moonshot-v1-128k', name: 'Moonshot v1 128K' },
    ],
  },
  {
    id: 'baichuan',
    name: '百川智能',
    baseUrl: 'https://api.baichuan-ai.com/v1',
    protocol: 'openai',
    apiKeyEnv: 'BAICHUAN_API_KEY',
    docUrl: 'https://platform.baichuan-ai.com/console/apikey',
    color: '#00B578',
    icon: '百',
    models: [
      { id: 'Baichuan4', name: 'Baichuan 4' },
      { id: 'Baichuan3-Turbo', name: 'Baichuan 3 Turbo' },
    ],
  },
  {
    id: 'stepfun',
    name: '阶跃星辰 (StepFun)',
    baseUrl: 'https://api.stepfun.com/v1',
    protocol: 'openai',
    apiKeyEnv: 'STEPFUN_API_KEY',
    docUrl: 'https://platform.stepfun.com/interface-key',
    color: '#6C5CE7',
    icon: '阶',
    models: [
      { id: 'step-2-16k', name: 'Step-2 16K' },
      { id: 'step-1-8k', name: 'Step-1 8K' },
    ],
  },
  {
    id: 'minimax',
    name: 'MiniMax',
    baseUrl: 'https://api.minimax.chat/v1',
    protocol: 'openai',
    apiKeyEnv: 'MINIMAX_API_KEY',
    docUrl: 'https://platform.minimaxi.com/user-center/basic-information/interface-key',
    color: '#FFB020',
    icon: 'Mi',
    models: [
      { id: 'abab7-chat', name: 'ABAB 7' },
      { id: 'abab6.5s-chat', name: 'ABAB 6.5s' },
    ],
  },
  {
    id: 'yi',
    name: '零一万物 (Yi)',
    baseUrl: 'https://api.lingyiwanwu.com/v1',
    protocol: 'openai',
    apiKeyEnv: 'YI_API_KEY',
    docUrl: 'https://platform.lingyiwanwu.com/apikeys',
    color: '#00D2FF',
    icon: 'Yi',
    models: [
      { id: 'yi-large', name: 'Yi Large' },
      { id: 'yi-medium', name: 'Yi Medium' },
    ],
  },
  {
    id: 'siliconflow',
    name: '硅基流动 (SiliconFlow)',
    baseUrl: 'https://api.siliconflow.cn/v1',
    protocol: 'openai',
    apiKeyEnv: 'SILICONFLOW_API_KEY',
    docUrl: 'https://cloud.siliconflow.cn/account/ak',
    color: '#7C3AED',
    icon: 'SF',
    models: [
      { id: 'Qwen/Qwen2.5-72B-Instruct', name: 'Qwen 2.5 72B' },
      { id: 'deepseek-ai/DeepSeek-V3', name: 'DeepSeek V3' },
    ],
  },
  {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    protocol: 'openai',
    apiKeyEnv: 'GROQ_API_KEY',
    docUrl: 'https://console.groq.com/keys',
    color: '#F55036',
    icon: 'GQ',
    models: [
      { id: 'llama-4-scout-17b-16e-instruct', name: 'Llama 4 Scout' },
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B' },
      { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
    ],
  },
  {
    id: 'together',
    name: 'Together AI',
    baseUrl: 'https://api.together.xyz/v1',
    protocol: 'openai',
    apiKeyEnv: 'TOGETHER_API_KEY',
    docUrl: 'https://api.together.xyz/settings/api-keys',
    color: '#0F77F0',
    icon: 'TG',
    models: [
      { id: 'meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8', name: 'Llama 4 Maverick' },
      { id: 'deepseek-ai/DeepSeek-V3', name: 'DeepSeek V3' },
    ],
  },
  {
    id: 'ollama',
    name: 'Ollama (本地)',
    baseUrl: 'http://localhost:11434/v1',
    protocol: 'openai',
    apiKeyHelp: '本地部署通常不需要 API Key，留空即可',
    color: '#000000',
    icon: 'O',
    models: [
      { id: 'llama3.2', name: 'Llama 3.2' },
      { id: 'qwen2.5:latest', name: 'Qwen 2.5' },
    ],
  },
  {
    id: 'openrouter',
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    protocol: 'openai',
    apiKeyEnv: 'OPENROUTER_API_KEY',
    docUrl: 'https://openrouter.ai/keys',
    color: '#6D28D9',
    icon: 'OR',
    models: [
      { id: 'openai/gpt-4o', name: 'GPT-4o (via OpenRouter)' },
      { id: 'anthropic/claude-sonnet-4', name: 'Claude Sonnet 4 (via OpenRouter)' },
    ],
  },
]

// ===== 自定义 =====
export const customProvider: Provider = {
  id: 'custom',
  name: '自定义 (OpenAI 兼容)',
  baseUrl: '',
  protocol: 'openai' as const,
  models: [],
  color: '#6B7280',
  icon: '自',
}

export function findProvider(id: string): Provider | undefined {
  if (id === 'custom') return customProvider
  return providers.find((p) => p.id === id)
}

export function getAllProviders(): Provider[] {
  return [...providers, customProvider]
}
