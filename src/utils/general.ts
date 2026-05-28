import type { Metadata } from 'next'
import { getHreflang, languages } from '@/lib/i18n/languageConfig'

const SITE_NAMES: Record<string, string> = {
  'zh-CN': '越智通AI平台',
  en: 'AI Platform',
  vi: 'Nền tảng AI',
  ja: 'AIプラットフォーム',
  ko: 'AI 플랫폼',
  de: 'AI-Plattform',
  fr: 'Plateforme IA',
}

const TITLE_SEPARATORS: Record<string, string> = {
  'zh-CN': ' —— ',
  en: ' — ',
  vi: ' — ',
  ja: ' — ',
  ko: ' — ',
  de: ' — ',
  fr: ' — ',
}

function getSiteName(lng: string): string {
  return SITE_NAMES[lng] || SITE_NAMES['zh-CN']
}

export async function getPageTitle(name: string, lng: string) {
  const siteName = getSiteName(lng)
  const sep = TITLE_SEPARATORS[lng] || ' — '
  return `${name}${sep}${siteName}`
}

/**
 * 生成页面 Metadata（符合 SEO 最佳实践）
 * @param props - 基础 Metadata 配置
 * @param lng - 当前语言
 * @param path - 页面路径（不含语言前缀），如 '/accounts'
 */
export async function getMetadata(props: Metadata, lng: string, path?: string): Promise<Metadata> {
  path = path || '/'

  const { headers } = await import('next/headers')
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const proto = headersList.get('x-forwarded-proto') || 'https'
  let baseUrl = `${proto}://${host}`
  // 修复 localhost 导致的 OG 图片 URL 错误
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) {
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai.yuezhitong.com'
  }

  const title = await getPageTitle(typeof props.title === 'string' ? props.title : '', lng)

  const description = typeof props.description === 'string' ? props.description : ''

  // 生成所有语言的 alternate links（用于 hreflang）
  const languageAlternates = languages.reduce(
    (acc, lang) => {
      // 使用 x-default 作为默认语言的 hreflang
      const hreflang = lang === 'en' ? 'x-default' : getHreflang(lang)
      acc[hreflang] = `${baseUrl}/${lang}${path}`
      return acc
    },
    {} as Record<string, string>,
  )

  // 默认的 OG 图片
  const defaultOgImage = `${baseUrl}/og-image.png`

  return {
    ...props,
    title,
    description,
    keywords: props.keywords,
    referrer: 'no-referrer',
    // Canonical URL 和 alternate links
    alternates: {
      canonical: `${baseUrl}/${lng}${path}`,
      languages: languageAlternates,
      ...props.alternates,
    },
    // OpenGraph 元数据（社交媒体分享）
    openGraph: (() => {
      // 解析传入的 openGraph images 中的相对路径
      const resolved: Record<string, any> = { ...props.openGraph }
      if (resolved.images && Array.isArray(resolved.images)) {
        resolved.images = resolved.images.map((img: any) => ({
          ...img,
          url: img.url?.startsWith('/') ? `${baseUrl}${img.url}` : img.url,
        }))
      }
      return {
        title,
        description,
        url: `${baseUrl}/${lng}${path}`,
        siteName: getSiteName(lng),
        locale: lng,
        type: 'website',
        images: [
          {
            url: defaultOgImage,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        ...resolved,
      }
    })(),
    // Twitter Card 元数据
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [defaultOgImage],
      ...props.twitter,
    },
    // 搜索引擎爬虫指令
    robots: props.robots || {
      index: true,
      follow: true,
      googleBot: {
        'index': true,
        'follow': true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}
