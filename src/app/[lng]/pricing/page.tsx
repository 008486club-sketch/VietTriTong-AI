/**
 * PricingPage - 定价方案页
 * 中越双语 · 三档定价 · FAQ
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
  const { t } = await useTranslation(lng, 'pricing')
  return getMetadata({ title: t('title'), description: t('subtitle') }, lng, '/pricing')
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ lng: string }>
}) {
  let { lng } = await params
  if (!languages.includes(lng)) lng = fallbackLng
  const { t } = await useTranslation(lng, 'pricing')
  const plans = t('plans', { returnObjects: true }) as any[]
  const faq = t('faq', { returnObjects: true }) as any

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

      {/* Pricing Cards */}
      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {Array.isArray(plans) && plans.map((plan: any, i: number) => (
            <div
              key={plan.id || i}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                plan.highlight
                  ? 'border-primary shadow-lg shadow-primary/10 ring-1 ring-primary'
                  : 'bg-card shadow-sm'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  {lng === 'vi' ? 'Phổ biến nhất' : '最受欢迎'}
                </div>
              )}

              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${plan.highlight ? 'text-primary' : ''}`}>
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">{plan.unit}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>

              <ul className="mt-6 space-y-3 flex-1">
                {Array.isArray(plan.features) && plan.features.map((f: string, j: number) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.ctaHref || '/chat'}
                className={`mt-8 block w-full rounded-lg px-4 py-3 text-center text-sm font-semibold transition-all ${
                  plan.highlight
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Contact Us */}
        <div className="mt-8 text-center">
          <Link
            href={lng === 'vi' ? '/vi/websit/contact' : '/zh-CN/websit/contact'}
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            {t('contactUs')}
          </Link>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t('disclaimer')}
        </p>
      </div>

      {/* FAQ */}
      {faq && faq.items && (
        <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-10">{faq.title}</h2>
          <div className="space-y-4">
            {Array.isArray(faq.items) && faq.items.map((item: any, i: number) => (
              <details key={i} className="group rounded-xl border bg-card p-5">
                <summary className="cursor-pointer font-medium text-foreground list-none flex items-center justify-between">
                  {item.q}
                  <svg className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
