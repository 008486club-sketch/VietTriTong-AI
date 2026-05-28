import { dir } from 'i18next'
import { headers } from 'next/headers'
import Script from 'next/script'
import { useTranslation } from '@/app/i18n'
import { fallbackLng, languages } from '@/app/i18n/settings'
import LayoutSidebar from '@/app/layout/LayoutSidebar'
import { MainContent } from '@/app/layout/MainContent'
import MobileNav from '@/app/layout/MobileNav'
import { ChannelManager } from '@/components/ChannelManager'
import { StructuredData } from '@/components/SEO/StructuredData'
import { getHreflang } from '@/lib/i18n/languageConfig'
import { Providers } from '../layout/Providers'
import '@/app/var.css'
import '../globals.css'

export async function generateMetadata({ params }: { params: Promise<{ lng: string }> }) {
  let { lng } = await params
  if (!languages.includes(lng))
    lng = fallbackLng
  const { t } = await useTranslation(lng)

  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const proto = headersList.get('x-forwarded-proto') || 'https'
  let baseUrl = `${proto}://${host}`
  // 修复 localhost 导致的 URL 错误
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) {
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai.yuezhitong.com'
  }

  // 生成hreflang链接
  const alternateRefs = languages.map(lang => ({
    href: `${baseUrl}/${lang}`,
    hreflang: getHreflang(lang),
  }))

  // 添加x-default
  alternateRefs.push({
    href: `${baseUrl}/en`,
    hreflang: 'x-default',
  })

  return {
    title: t('title'),
    description: t('content'),
    keywords: '越智通AI平台, 越南AI, AI视频制作, 社媒托管, yuezhitong.com',
    alternates: {
      languages: Object.fromEntries(alternateRefs.map(({ href, hreflang }) => [hreflang, href])),
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lng: string }>
}>) {
  const { lng } = await params
  const headersList = await headers()
  const host = headersList.get('host') || 'localhost:3000'
  const proto = headersList.get('x-forwarded-proto') || 'https'
  let baseUrl = `${proto}://${host}`
  // 修复 localhost 导致的 URL 错误
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) {
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ai.yuezhitong.com'
  }
  const autoLoginToken = process.env.AUTO_LOGIN_TOKEN || ''

  return (
    <html lang={lng} dir={dir(lng)} suppressHydrationWarning>
      <head>
        <meta name="msvalidate.01" content="FD5353C7C4A19D33CB0E8C7F0240B1F1" />
        <meta
          name="google-site-verification"
          content="tc0EuxFIXvEW3lgie3jjqopDfYHc-Cw5MyZ93F91Wrg"
        />
        {/* SEO: 全局结构化数据 */}
        <StructuredData
          organization={{
            name: '越智通AI平台',
            url: baseUrl,
            logo: `${baseUrl}/logo.png`,
            description: 'AI-powered content creation and social media management platform',
            sameAs: ['https://www.linkedin.com/company/yuezhitong'],
          }}
          website={{
            name: '越智通AI平台',
            url: baseUrl,
            description: 'AI-powered content creation and social media management platform',
            potentialAction: {
              '@type': 'SearchAction',
              'target': `${baseUrl}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers lng={lng} autoLoginToken={autoLoginToken}>
          {/* 全局频道管理弹框 */}
          <ChannelManager />
          <p className="hidden">Impact-Site-Verification: f9836212-462a-482f-9232-8a877970eacf</p>
          {/* 移动端顶部导航 - fixed 定位，独立于 flex 布局 */}
          <MobileNav />
          <div className="flex h-screen w-full">
            {/* 桌面端侧边栏 */}
            <LayoutSidebar />
            {/* 主内容区域 - 根据页面类型动态控制 pt-14 */}
            <MainContent>{children}</MainContent>
            {/* eslint-disable-next-line next/no-sync-scripts */}
            <script src="/js/xhs_web_sign.js" />
            {/* eslint-disable-next-line next/no-sync-scripts */}
            <script src="/js/xhs_sign_init.js" />
            {/* eslint-disable-next-line next/no-sync-scripts */}
            <script src="/js/xhs_sign_core.js" />
            {/* eslint-disable-next-line next/no-sync-scripts */}
            <script src="/js/xhs_sign_inject.js" />
          </div>
        </Providers>
      </body>
    </html>
  )
}
