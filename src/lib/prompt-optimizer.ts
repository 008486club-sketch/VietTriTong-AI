/**
 * 越智通AI · Prompt 优化引擎
 *
 * 将用户简单输入 → 优化为 Seedance 可用的高质量英文 prompt
 *
 * 策略：
 *   1. 有 LLM_KEY  → 调用 DeepSeek 做智能优化
 *   2. 无 LLM_KEY  → 规则引擎：关键词提取 + 模板匹配 + 风格增强
 */

import { type Industry, type PromptTemplate, getTemplatesByIndustry } from './prompt-templates'

// ──── LLM 优化 (DeepSeek) ────

const DEEPSEEK_BASE = 'https://api.deepseek.com/v1/chat/completions'

async function optimizeWithLLM(rawInput: string, industry: Industry): Promise<string> {
  const key = process.env.DEEPSEEK_API_KEY
  if (!key) throw new Error('DEEPSEEK_API_KEY not configured')

  const systemPrompt = `You are a professional video prompt engineer for Seedance 2.0 AI video generation.
Convert the user's raw input into an optimized English prompt optimized for AI video generation.

Rules:
- Output ONLY the optimized prompt, no explanation, no markdown
- Use cinematic terminology: lighting, camera movement, composition, mood
- Include style keywords: "4K", "cinematic", "smooth camera movement"
- Target industry: ${industry}
- Keep it under 200 characters
- Use natural, flowing English sentences`

  const res = await fetch(DEEPSEEK_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: rawInput },
      ],
      max_tokens: 200,
      temperature: 0.7,
    }),
  })

  if (!res.ok) throw new Error(`DeepSeek API error: ${res.status}`)
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() || rawInput
}

// ──── 规则引擎优化 ────

const STYLE_KEYWORDS: Record<string, string[]> = {
  restaurant: ['warm lighting', 'cinematic food', 'steam', 'close-up', '4K', 'appetizing'],
  fashion: ['studio lighting', 'flowing fabric', 'minimalist background', 'magazine quality', 'slow motion'],
  beauty: ['soft focus', 'clean aesthetic', 'bright lighting', 'before-after', 'product flat lay'],
  tech: ['dark background', 'blue accent lighting', 'futuristic', '3D rotation', 'minimalist'],
  realestate: ['drone shot', 'aerial perspective', 'natural sunlight', 'spacious', 'walkthrough'],
  education: ['clean classroom', 'bright lighting', 'engaging', 'professional', 'tutorial style'],
  health: ['clean clinical', 'soft lighting', 'professional', 'calming', 'wellness'],
  general: ['4K quality', 'cinematic', 'professional lighting', 'smooth camera movement', 'commercial grade'],
}

function extractKeywords(input: string): string[] {
  const zh = [
    '餐厅', '美食', '咖啡', '奶茶', '火锅', '面包', '甜品', '越南', '河粉', '法棍',
    '时尚', '服装', '穿搭', '首饰', '包', '鞋',
    '美妆', '护肤', '化妆', '口红', '面膜',
    '手机', '电脑', '耳机', '科技', '数码', 'AI',
    '房产', '楼盘', '公寓', '别墅', '办公室',
    '教育', '培训', '课程', '学习',
    '健康', '医疗', '健身', '瑜伽',
    '促销', '优惠', '折扣', '限时', '新品',
    'TikTok', '抖音', '短视频', '探店', '打卡',
  ]
  return zh.filter(k => input.includes(k))
}

function detectIndustry(input: string): Industry {
  const k = extractKeywords(input)
  if (k.some(w => ['餐厅', '美食', '咖啡', '奶茶', '火锅', '面包', '甜品', '越南', '河粉', '法棍', '探店'].includes(w))) return 'restaurant'
  if (k.some(w => ['时尚', '服装', '穿搭', '首饰', '包', '鞋'].includes(w))) return 'fashion'
  if (k.some(w => ['美妆', '护肤', '化妆', '口红', '面膜'].includes(w))) return 'beauty'
  if (k.some(w => ['手机', '电脑', '耳机', '科技', '数码', 'AI'].includes(w))) return 'tech'
  if (k.some(w => ['房产', '楼盘', '公寓', '别墅', '办公室'].includes(w))) return 'realestate'
  if (k.some(w => ['教育', '培训', '课程', '学习'].includes(w))) return 'education'
  if (k.some(w => ['健康', '医疗', '健身', '瑜伽'].includes(w))) return 'health'
  return 'general'
}

function ruleBasedOptimize(rawInput: string, industry?: Industry): { prompt: string; industry: Industry; matched: boolean } {
  const detected = industry || detectIndustry(rawInput)
  const tags = extractKeywords(rawInput)
  const styleWords = STYLE_KEYWORDS[detected] || STYLE_KEYWORDS.general

  // 尝试匹配模板
  const industryTemplates = getTemplatesByIndustry(detected)
  const matched = tags.length > 0

  if (industryTemplates.length > 0) {
    // 取第一个模板的英文 prompt + 用户关键词增强
    const base = industryTemplates[0].promptEn
    const enhanced = tags.length > 0
      ? `${base}, featuring ${tags.slice(0, 3).join(', ')}`
      : base
    return { prompt: enhanced, industry: detected, matched }
  }

  // 无模板时，组合关键词 + 风格词
  const built = [
    tags.length > 0 ? `Showcasing ${tags.join(', ')}` : 'Professional product showcase',
    ...styleWords.slice(0, 4),
  ].join(', ')

  return { prompt: built, industry: detected, matched }
}

// ──── 越南语 prompt 翻译增强 ────

const VI_STYLE_MAP: Record<string, string> = {
  'nhà hàng': 'restaurant', 'quán ăn': 'restaurant', 'cà phê': 'restaurant', 'trà sữa': 'restaurant',
  'thời trang': 'fashion', 'quần áo': 'fashion', 'giày dép': 'fashion',
  'làm đẹp': 'beauty', 'trang điểm': 'beauty', 'mỹ phẩm': 'beauty',
  'công nghệ': 'tech', 'điện thoại': 'tech', 'máy tính': 'tech',
  'bất động sản': 'realestate', 'căn hộ': 'realestate', 'nhà đất': 'realestate',
}

function detectIndustryVi(input: string): Industry {
  for (const [viWord, industry] of Object.entries(VI_STYLE_MAP)) {
    if (input.toLowerCase().includes(viWord)) return industry as Industry
  }
  return 'general'
}

// ──── 统一入口 ────

export interface OptimizeResult {
  prompt: string
  industry: Industry
  method: 'llm' | 'template' | 'rule'
  cost: number  // 预估 token 消耗
}

/**
 * 优化用户的原始输入 → Seedance 高质量英文 prompt
 * 
 * @param rawInput  用户输入（支持中/越/英）
 * @param language  用户语言
 * @param industry  行业（可选，自动检测）
 */
export async function optimizePrompt(
  rawInput: string,
  language: 'zh' | 'vi' | 'en' = 'zh',
  industry?: Industry,
): Promise<OptimizeResult> {
  const trimmed = rawInput.trim()
  if (!trimmed) {
    return { prompt: 'Professional product showcase, 4K cinematic quality, smooth camera movement', industry: 'general', method: 'rule', cost: 0 }
  }

  // 1. 确定行业
  const resolvedIndustry = industry || (
    language === 'vi' ? detectIndustryVi(trimmed) : detectIndustry(trimmed)
  )

  // 2. 尝试 LLM 优化
  if (process.env.DEEPSEEK_API_KEY) {
    try {
      const prompt = await optimizeWithLLM(trimmed, resolvedIndustry)
      return { prompt, industry: resolvedIndustry, method: 'llm', cost: 500 }
    } catch (e) {
      console.warn('[PromptOptimizer] LLM fallback to rules:', (e as Error).message)
    }
  }

  // 3. 规则引擎降级
  const result = ruleBasedOptimize(trimmed, resolvedIndustry)
  return {
    prompt: result.prompt,
    industry: result.industry,
    method: result.matched ? 'template' : 'rule',
    cost: 0,
  }
}

/**
 * 快速优化（同步版，仅规则引擎）
 */
export function optimizePromptSync(rawInput: string, language: 'zh' | 'vi' | 'en' = 'zh', industry?: Industry): OptimizeResult {
  const resolvedIndustry = industry || (language === 'vi' ? detectIndustryVi(rawInput) : detectIndustry(rawInput))
  const result = ruleBasedOptimize(rawInput, resolvedIndustry)
  return { prompt: result.prompt, industry: result.industry, method: result.matched ? 'template' : 'rule', cost: 0 }
}
