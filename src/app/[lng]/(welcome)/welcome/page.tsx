/**
 * WelcomePage - 欢迎页面
 * 品牌展示落地页，用于吸引新用户
 */

import type { Metadata } from 'next'
import { useTranslation } from '@/app/i18n'
import { fallbackLng, languages } from '@/app/i18n/settings'
import { getMetadata } from '@/utils/general'
import WelcomePageContent from './WelcomePageContent'

// SEO 元数据
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>
}): Promise<Metadata> {
  let { lng } = await params
  if (!languages.includes(lng))
    lng = fallbackLng

  const { t } = await useTranslation(lng, 'welcome')

  return getMetadata(
    {
      title: t('seo.title'),
      description: t('seo.description'),
      keywords: t('seo.keywords'),
      openGraph: {
        type: 'website',
        images: [
          {
            url: '/logo.png',
            width: 1600,
            height: 838,
            alt: t('seo.title'),
          },
        ],
      },
    },
    lng,
    '/welcome',
  )
}

interface WelcomePageProps {
  params: Promise<{ lng: string }>
}

export default async function WelcomePage({ params }: WelcomePageProps) {
  const { lng } = await params

  return (
    <>
      {/* yzt-build: 2026-05-21-v3 */}
      <WelcomePageContent lng={lng} />
    </>
  )
}
