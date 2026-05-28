import { NextRequest, NextResponse } from 'next/server'
import { textToVideo, imageToVideo, type SeedanceOptions, type SeedanceResponse } from '@/lib/seedance'
import { optimizePrompt, optimizePromptSync } from '@/lib/prompt-optimizer'

/**
 * POST /api/seedance/generate
 *
 * 越智通AI 视频生成 API
 * 自动优化用户输入为高质量英文 prompt → UPTOKEN Seedance 2.0 生成
 *
 * Body:
 * {
 *   mode: 'text-to-video' | 'image-to-video'
 *   prompt: string | { raw: string; language?: 'zh' | 'vi' | 'en'; industry?: string }
 *   imageUrl?: string
 *   resolution?: '720p' | '1080p'
 *   duration?: number
 *   model?: string                    // seedance-2.0-pro | seedance-2.0-fast | ...
 *   autoOptimize?: boolean            // 默认 true，自动优化 prompt
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const mode: 'text-to-video' | 'image-to-video' = body.mode || 'text-to-video'
    const autoOptimize = body.autoOptimize !== false // 默认开启

    // ──── Prompt 解析 & 优化 ────
    let prompt: string
    let optimizedBy: string = 'raw'

    if (typeof body.prompt === 'object' && body.prompt.raw) {
      // 结构化输入：{ raw: "我的咖啡店", language: "zh", industry: "restaurant" }
      const { raw, language, industry } = body.prompt
      if (autoOptimize) {
        const result = await optimizePrompt(raw, language || 'zh', industry)
        prompt = result.prompt
        optimizedBy = result.method
      } else {
        prompt = raw
      }
    } else if (typeof body.prompt === 'string') {
      const raw = body.prompt.trim()
      if (!raw) {
        return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
      }
      if (autoOptimize && raw.length < 100) {
        // 短输入自动优化
        const result = optimizePromptSync(raw, 'zh')
        prompt = result.prompt
        optimizedBy = result.method
      } else {
        prompt = raw
      }
    } else {
      return NextResponse.json({ error: 'prompt is required (string or {raw, language, industry})' }, { status: 400 })
    }

    const imageUrl: string | undefined = body.imageUrl

    if (mode === 'image-to-video' && !imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required for image-to-video' }, { status: 400 })
    }

    const options: SeedanceOptions = {
      resolution: body.resolution || '720p',
      duration: body.duration ?? 15,
      model: body.model || 'seedance-2.0-pro',
      negative_prompt: body.negative_prompt || '',
      seed: body.seed,
      guidance_scale: body.guidance_scale,
      num_inference_steps: body.num_inference_steps,
    }

    let result: SeedanceResponse

    if (mode === 'image-to-video') {
      result = await imageToVideo(imageUrl!, prompt, options)
    } else {
      result = await textToVideo(prompt, options)
    }

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        originalPrompt: typeof body.prompt === 'string' ? body.prompt : body.prompt?.raw,
        optimizedPrompt: prompt,
        optimizedBy,
      },
    })
  } catch (error: any) {
    console.error('Seedance generate error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 },
    )
  }
}
