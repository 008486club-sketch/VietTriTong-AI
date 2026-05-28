/**
 * CaseStudiesPage - 客户案例 / Case Studies
 * 中越双语 · 3个业务场景 · 数据驱动
 */
import type { Metadata } from 'next'
import Link from 'next/link'
import { useTranslation } from '@/app/i18n'
import { fallbackLng, languages } from '@/app/i18n/settings'
import { getMetadata } from '@/utils/general'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>
}): Promise<Metadata> {
  let { lng } = await params
  if (!languages.includes(lng)) lng = fallbackLng
  const { t } = await useTranslation(lng, 'case-studies')
  return getMetadata({ title: t('title'), description: t('subtitle') }, lng, '/websit/case-studies')
}

export default async function CaseStudiesPage({
  params,
}: {
  params: Promise<{ lng: string }>
}) {
  let { lng } = await params
  if (!languages.includes(lng)) lng = fallbackLng
  const { t } = await useTranslation(lng, 'case-studies')
  const cases = t('cases', { returnObjects: true }) as any[]

  const tagColors: Record<string, string> = {
    'TikTok运营': 'bg-pink-100 text-pink-700',
    'Vận hành TikTok': 'bg-pink-100 text-pink-700',
    'AI视频制作': 'bg-blue-100 text-blue-700',
    'Sản xuất video AI': 'bg-blue-100 text-blue-700',
    '社媒托管': 'bg-green-100 text-green-700',
    'Quản lý MXH': 'bg-green-100 text-green-700',
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t('title')}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Cases */}
      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8 space-y-12">
        {Array.isArray(cases) && cases.map((item: any, i: number) => (
          <div
            key={item.id || i}
            className="rounded-2xl border bg-card shadow-sm overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              {/* Tag + Title */}
              <div className="flex items-center gap-3 mb-4">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${tagColors[item.tag] || 'bg-gray-100 text-gray-700'}`}>
                  {item.tag}
                </span>
              </div>
              <h2 className="text-2xl font-bold">{item.title}</h2>

              {/* Challenge + Solution */}
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div className="rounded-lg border bg-muted/50 p-5">
                  <h3 className="text-sm font-semibold text-red-600 mb-2">
                    {lng === 'vi' ? '🔴 Thách thức' : '🔴 挑战'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.challenge}</p>
                </div>
                <div className="rounded-lg border bg-muted/50 p-5">
                  <h3 className="text-sm font-semibold text-green-600 mb-2">
                    {lng === 'vi' ? '🟢 Giải pháp' : '🟢 解决方案'}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.solution}</p>
                </div>
              </div>

              {/* Results */}
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.isArray(item.results) && item.results.map((r: any, j: number) => (
                  <div key={j} className="rounded-lg bg-primary/5 p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{r.value}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{r.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mx-auto max-w-5xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-primary p-10 text-center text-primary-foreground">
          <h2 className="text-2xl font-bold">{t('cta')}</h2>
          <Link
            href={t('ctaHref')}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-white/90"
          >
            {t('ctaButton')}
          </Link>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t('disclaimer')}
        </p>
      </div>
    </div>
  )
}
