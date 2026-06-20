import { findProvider } from './providers'

export interface TestResult {
  success: boolean
  message: string
  latencyMs: number
  model: string
  details?: string
}

/**
 * 测试 API Key 是否可用
 */
export async function testApiKey(
  providerId: string,
  baseUrl: string,
  apiKey: string,
  modelId: string,
): Promise<TestResult> {
  const startTime = Date.now()
  const provider = findProvider(providerId)

  if (!provider && providerId !== 'custom') {
    return fail('未知厂商', startTime, modelId)
  }

  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '')

  try {
    switch (provider?.protocol || 'openai') {
      case 'openai':
        return await testOpenAICompatible(normalizedBaseUrl, apiKey, modelId, startTime)
      case 'anthropic':
        return await testAnthropic(normalizedBaseUrl, apiKey, modelId, startTime)
      case 'gemini':
        return await testGemini(normalizedBaseUrl, apiKey, modelId, startTime)
      default:
        return await testOpenAICompatible(normalizedBaseUrl, apiKey, modelId, startTime)
    }
  } catch (e: any) {
    const elapsed = Date.now() - startTime
    return {
      success: false,
      message: e.message || '网络请求失败',
      latencyMs: elapsed,
      model: modelId,
      details: e.toString(),
    }
  }
}

async function testOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  modelId: string,
  startTime: number,
): Promise<TestResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    // 先用 /models 测试连通性
    const resp = await fetch(`${baseUrl}/models`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })

    const elapsed = Date.now() - startTime

    if (resp.status === 200) {
      const data = await resp.json()
      const models = data.data || []
      const found = models.find(
        (m: any) => m.id === modelId || m.id?.toLowerCase() === modelId?.toLowerCase(),
      )
      if (found) {
        return {
          success: true,
          message: `✓ 连接成功，模型 ${modelId} 可用`,
          latencyMs: elapsed,
          model: modelId,
          details: `找到匹配模型: ${found.id}，共 ${models.length} 个可用模型`,
        }
      }
      return {
        success: true,
        message: `✓ 连接成功，但未找到模型 ${modelId}`,
        latencyMs: elapsed,
        model: modelId,
        details: `API 可用，共 ${models.length} 个模型，但未包含 ${modelId}`,
      }
    }

    if (resp.status === 404) {
      // /models 不可用，尝试 /chat/completions 发一条简单消息
      return await testWithChatCompletion(baseUrl, apiKey, modelId, startTime)
    }

    if (resp.status === 401) {
      return {
        success: false,
        message: '✗ API Key 无效 (401 Unauthorized)',
        latencyMs: elapsed,
        model: modelId,
        details: '请检查 Key 是否正确/已过期',
      }
    }

    if (resp.status === 429) {
      return {
        success: false,
        message: '✗ 请求频率超限 (429 Rate Limited)',
        latencyMs: elapsed,
        model: modelId,
        details: '请稍后重试或检查配额',
      }
    }

    return {
      success: false,
      message: `✗ 接口返回异常状态码: ${resp.status}`,
      latencyMs: elapsed,
      model: modelId,
      details: `状态码 ${resp.status}`,
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function testWithChatCompletion(
  baseUrl: string,
  apiKey: string,
  modelId: string,
  startTime: number,
): Promise<TestResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const resp = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        messages: [{ role: 'user', content: 'hi' }],
        max_tokens: 5,
      }),
      signal: controller.signal,
    })

    const elapsed = Date.now() - startTime

    if (resp.ok) {
      return {
        success: true,
        message: `✓ 连接成功，模型 ${modelId} 响应正常`,
        latencyMs: elapsed,
        model: modelId,
      }
    }

    if (resp.status === 401 || resp.status === 403) {
      return {
        success: false,
        message: '✗ API Key 无效或无权访问',
        latencyMs: elapsed,
        model: modelId,
        details: `HTTP ${resp.status}`,
      }
    }

    const body = await resp.text()
    return {
      success: false,
      message: `✗ 请求失败 (${resp.status})`,
      latencyMs: elapsed,
      model: modelId,
      details: body.slice(0, 300),
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function testAnthropic(
  baseUrl: string,
  apiKey: string,
  modelId: string,
  startTime: number,
): Promise<TestResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const resp = await fetch(`${baseUrl}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: modelId,
        max_tokens: 5,
        messages: [{ role: 'user', content: 'hi' }],
      }),
      signal: controller.signal,
    })

    const elapsed = Date.now() - startTime

    if (resp.ok) {
      return {
        success: true,
        message: `✓ 连接成功，模型 ${modelId} 可用`,
        latencyMs: elapsed,
        model: modelId,
      }
    }

    if (resp.status === 401 || resp.status === 403) {
      return {
        success: false,
        message: '✗ API Key 无效 (401)',
        latencyMs: elapsed,
        model: modelId,
        details: 'Anthropic Key 格式应为 sk-ant-api03-...',
      }
    }

    const body = await resp.text()
    return {
      success: false,
      message: `✗ 请求失败 (${resp.status})`,
      latencyMs: elapsed,
      model: modelId,
      details: body.slice(0, 300),
    }
  } finally {
    clearTimeout(timeout)
  }
}

async function testGemini(
  baseUrl: string,
  apiKey: string,
  modelId: string,
  startTime: number,
): Promise<TestResult> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const resp = await fetch(
      `${baseUrl}/models/${modelId}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'hi' }] }],
        }),
        signal: controller.signal,
      },
    )

    const elapsed = Date.now() - startTime

    if (resp.ok) {
      return {
        success: true,
        message: `✓ 连接成功，模型 ${modelId} 可用`,
        latencyMs: elapsed,
        model: modelId,
      }
    }

    if (resp.status === 403 || resp.status === 401) {
      return {
        success: false,
        message: '✗ API Key 无效或无权访问',
        latencyMs: elapsed,
        model: modelId,
        details: '请检查 Google AI Studio API Key',
      }
    }

    const body = await resp.text()
    return {
      success: false,
      message: `✗ 请求失败 (${resp.status})`,
      latencyMs: elapsed,
      model: modelId,
      details: body.slice(0, 300),
    }
  } finally {
    clearTimeout(timeout)
  }
}

function fail(msg: string, startTime: number, model: string): TestResult {
  return {
    success: false,
    message: `✗ ${msg}`,
    latencyMs: Date.now() - startTime,
    model,
  }
}

// ===== 模型列表检测 =====

export interface DiscoveredModel {
  id: string
  owned_by?: string
  created?: number
}

export interface ModelListResult {
  success: boolean
  models: DiscoveredModel[]
  error?: string
  latencyMs: number
  total: number
}

/**
 * 从 OpenAI 兼容接口获取可用模型列表
 */
export async function fetchAvailableModels(
  baseUrl: string,
  apiKey: string,
): Promise<ModelListResult> {
  const startTime = Date.now()
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, '')
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)

  try {
    const resp = await fetch(`${normalizedBaseUrl}/models`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    })

    const elapsed = Date.now() - startTime

    if (resp.ok) {
      const data = await resp.json()
      const models: DiscoveredModel[] = (data.data || []).map((m: any) => ({
        id: m.id,
        owned_by: m.owned_by || m.ownedBy,
        created: m.created,
      }))
      return {
        success: true,
        models,
        latencyMs: elapsed,
        total: models.length,
      }
    }

    if (resp.status === 401 || resp.status === 403) {
      return {
        success: false,
        models: [],
        error: 'API Key 无效，请检查后重试',
        latencyMs: elapsed,
        total: 0,
      }
    }

    return {
      success: false,
      models: [],
      error: `接口返回 HTTP ${resp.status}`,
      latencyMs: elapsed,
      total: 0,
    }
  } catch (e: any) {
    return {
      success: false,
      models: [],
      error: e.message || '网络请求失败',
      latencyMs: Date.now() - startTime,
      total: 0,
    }
  } finally {
    clearTimeout(timeout)
  }
}
