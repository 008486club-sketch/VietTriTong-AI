/**
 * 越智通AI — AI 视频生成客户端
 *
 * 主引擎: UPTOKEN (宋总提供，聚合 Seedance 2.0 / Seedream 等)
 * 备选:   FAL_KEY 直连 fal.ai
 */

const UPTOKEN_BASE = 'https://uptoken.cc/v1'
const FAL_ENDPOINT = 'https://fal.run/fal-ai/seedance-v2'

export type SeedanceResolution = '720p' | '1080p'
export type SeedanceModel = 'seedance-2.0-pro' | 'seedance-2.0-fast' | 'seedream-5.0-lite' | 'seedance-1.5-pro'

export interface SeedanceOptions {
  resolution?: SeedanceResolution
  duration?: number           // 秒，默认 5
  model?: SeedanceModel       // 默认 seedance-2.0-fast
  negative_prompt?: string
  seed?: number
  guidance_scale?: number
  num_inference_steps?: number
}

export interface SeedanceResponse {
  id: string
  status: 'running' | 'succeeded' | 'failed'
  videoUrl?: string
  duration?: number
  billableQuantity?: number
  usage?: { currency: string; total_cost_microcents: number }
  progress?: number
}

// ──── UPTOKEN (主引擎) ────

async function uptokenRequest(path: string, options: RequestInit = {}) {
  const key = process.env.UPTOKEN_API_KEY
  if (!key) throw new Error('UPTOKEN_API_KEY not configured')
  const res = await fetch(`${UPTOKEN_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}`, ...options.headers },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`UPTOKEN error (${res.status}): ${text}`)
  }
  return res.json()
}

async function uptokenPoll(taskId: string, timeoutMs = 300000): Promise<any> {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const data = await uptokenRequest(`/video/generations/${taskId}`)
    if (data.status === 'succeeded' || data.status === 'failed') return data
    await new Promise(r => setTimeout(r, 3000)) // poll every 3s
  }
  throw new Error(`UPTOKEN video generation timed out after ${timeoutMs / 1000}s`)
}

// ──── FAL_KEY (备选) ────

async function falRequest(endpoint: string, payload: any) {
  const key = process.env.FAL_KEY
  if (!key) throw new Error('FAL_KEY not configured')
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Key ${key}` },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`FAL error (${res.status}): ${await res.text()}`)
  return res.json()
}

// ──── 统一入口 ────

function buildPayload(prompt: string, options: SeedanceOptions, imageUrl?: string) {
  return {
    prompt,
    image_url: imageUrl,
    model: options.model || 'seedance-2.0-fast',
    duration: options.duration ?? 5,
    resolution: options.resolution || '720p',
    negative_prompt: options.negative_prompt || '',
    seed: options.seed,
    guidance_scale: options.guidance_scale,
    num_inference_steps: options.num_inference_steps,
  }
}

function parseResponse(data: any): SeedanceResponse {
  return {
    id: data.id,
    status: data.status || 'succeeded',
    videoUrl: data.content?.video_url || data.video?.url,
    duration: data.duration,
    billableQuantity: data.billable_quantity,
    usage: data.usage,
    progress: data.progress,
  }
}

/** 文生视频 */
export async function textToVideo(prompt: string, options: SeedanceOptions = {}): Promise<SeedanceResponse> {
  // 优先 UPTOKEN
  if (process.env.UPTOKEN_API_KEY) {
    const payload = buildPayload(prompt, options)
    const created = await uptokenRequest('/video/generations', { method: 'POST', body: JSON.stringify(payload) })
    const result = await uptokenPoll(created.id)
    return parseResponse(result)
  }
  // 备选 FAL
  const result = await falRequest(FAL_ENDPOINT, { prompt, ...options })
  return { id: result.request_id || '', status: 'succeeded', videoUrl: result.video?.url }
}

/** 图生视频 */
export async function imageToVideo(imageUrl: string, prompt: string, options: SeedanceOptions = {}): Promise<SeedanceResponse> {
  if (process.env.UPTOKEN_API_KEY) {
    const payload = buildPayload(prompt, options, imageUrl)
    const created = await uptokenRequest('/video/generations', { method: 'POST', body: JSON.stringify(payload) })
    const result = await uptokenPoll(created.id)
    return parseResponse(result)
  }
  const result = await falRequest(FAL_ENDPOINT, { image_url: imageUrl, prompt, ...options })
  return { id: result.request_id || '', status: 'succeeded', videoUrl: result.video?.url }
}

/** 定价 */
export function getPricing(resolution: SeedanceResolution = '720p') {
  const pricing: Record<string, { price: number; duration: number; unit: string }> = {
    '720p':  { price: 4.5, duration: 15, unit: 'USD' },
    '1080p': { price: 10.0, duration: 15, unit: 'USD' },
  }
  return pricing[resolution]
}

/** 可用模型列表 */
export async function listModels(): Promise<SeedanceModel[]> {
  if (process.env.UPTOKEN_API_KEY) {
    const data = await uptokenRequest('/models')
    return (data.data || []).map((m: any) => m.id)
  }
  return ['seedance-2.0-pro', 'seedance-2.0-fast']
}
