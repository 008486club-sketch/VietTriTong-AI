/**
 * ContactPage - 联系我们 / Liên hệ
 * 提交后通过 /api/contact 发送飞书通知
 */
import type { Metadata } from 'next'
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
  const { t } = await useTranslation(lng, 'contact')
  return getMetadata({ title: t('title'), description: t('subtitle') }, lng, '/websit/contact')
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lng: string }>
}) {
  let { lng } = await params
  if (!languages.includes(lng)) lng = fallbackLng
  const { t } = await useTranslation(lng, 'contact')

  const isVi = lng === 'vi'
  const sendingText = isVi ? '⏳ Đang gửi...' : '⏳ 发送中...'
  const emptyError = isVi ? 'Vui lòng điền đầy đủ thông tin' : '请填写必填项'
  const networkError = isVi ? '❌ Lỗi kết nối, vui lòng thử lại' : '❌ 网络错误，请重试'
  const submitLabel = isVi ? 'Gửi yêu cầu →' : '提交咨询 →'

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{t('subtitle')}</p>
        </div>

        <form
          className="space-y-6 rounded-2xl border bg-card p-8 shadow-sm"
          id="contact-form"
        >
          <div>
            <label htmlFor="company" className="block text-sm font-medium mb-2">
              {t('company')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text" id="company" name="company" required
              placeholder={t('companyPlaceholder')}
              className="w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium mb-2">
              {t('contact')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text" id="contact" name="contact" required
              placeholder={t('contactPlaceholder')}
              className="w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="service" className="block text-sm font-medium mb-2">
              {t('service')}
            </label>
            <select
              id="service" name="service"
              className="w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t('servicePlaceholder')}</option>
              <option value="tiktok">{t('serviceTiktok')}</option>
              <option value="video">{t('serviceVideo')}</option>
              <option value="social">{t('serviceSocial')}</option>
              <option value="other">{t('serviceOther')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              {t('message')}
            </label>
            <textarea
              id="message" name="message" rows={4}
              placeholder={t('messagePlaceholder')}
              className="w-full rounded-lg border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit" id="contact-submit"
            className="w-full rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50"
          >
            {t('submit')}
          </button>

          <div id="contact-feedback" className="text-center text-sm" />
        </form>

        <div className="mt-12 text-center text-sm text-muted-foreground whitespace-pre-line">
          <p>{t('trustNote')}</p>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('contact-form').addEventListener('submit', async function(e) {
              e.preventDefault();
              var btn = document.getElementById('contact-submit');
              var fb = document.getElementById('contact-feedback');

              var company = document.getElementById('company').value.trim();
              var contactVal = document.getElementById('contact').value.trim();

              if (!company || !contactVal) {
                fb.innerHTML = '<span class="text-red-500">${emptyError}</span>';
                return;
              }

              btn.disabled = true;
              btn.textContent = '${sendingText}';
              fb.innerHTML = '';

              try {
                var res = await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    company: company,
                    contact: contactVal,
                    service: document.getElementById('service').value,
                    message: document.getElementById('message').value,
                    lang: '${lng}'
                  })
                });
                var data = await res.json();
                if (data.status === 'success') {
                  fb.innerHTML = '<span class="text-green-600">✅ ' + data.message + '</span>';
                  document.getElementById('contact-form').reset();
                } else {
                  fb.innerHTML = '<span class="text-red-500">❌ ' + (data.message || 'Error') + '</span>';
                }
              } catch(err) {
                fb.innerHTML = '<span class="text-red-500">${networkError}</span>';
              } finally {
                btn.disabled = false;
                btn.textContent = '${submitLabel}';
              }
            });
          `,
        }}
      />
    </div>
  )
}
