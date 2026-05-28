import { NextRequest, NextResponse } from 'next/server'

// 飞书通知
async function sendFeishu(text: string) {
  try {
    // Get tenant_access_token
    const tokenRes = await fetch(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          app_id: process.env.FEISHU_APP_ID || '',
          app_secret: process.env.FEISHU_APP_SECRET || '',
        }),
      }
    )
    const tokenData = await tokenRes.json()
    const token = tokenData.tenant_access_token
    if (!token) return

    // Send to chat
    await fetch(
      `https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receive_id: process.env.FEISHU_CHAT_ID || 'oc_33189fc0da140b2a6ad6d7d28731b31d',
          msg_type: 'text',
          content: JSON.stringify({ text }),
        }),
      }
    )
  } catch (e) {
    console.error('Feishu notify failed:', e)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const company = (body.company || '').trim()
    const contact = (body.contact || '').trim()
    const service = (body.service || '').trim()
    const message = (body.message || '').trim()
    const lang = body.lang || 'vi'

    if (!company || !contact) {
      return NextResponse.json(
        { status: 'error', message: lang === 'vi' ? 'Vui lòng điền đầy đủ thông tin' : '请填写完整信息' },
        { status: 400 }
      )
    }

    const serviceMap: Record<string, string> = {
      tiktok: 'TikTok运营',
      video: 'AI视频制作',
      social: '社媒托管',
      other: '其他',
    }
    const serviceLabel = serviceMap[service] || service || '未选择'

    const feishuText = [
      '📩 新咨询 · ai.yuezhitong.com',
      '',
      `🏢 公司: ${company}`,
      `📞 联系方式: ${contact}`,
      `🛠 需求: ${serviceLabel}`,
      `💬 留言: ${message || '无'}`,
      `🌐 语言: ${lang === 'vi' ? 'Tiếng Việt' : '中文'}`,
    ].join('\n')

    // Async notify - don't block response
    sendFeishu(feishuText).catch(console.error)

    const successMsg = lang === 'vi'
      ? 'Cảm ơn bạn! Chúng tôi sẽ liên hệ trong vòng 24 giờ.'
      : '感谢咨询！我们将在24小时内与您联系。'

    return NextResponse.json({ status: 'success', message: successMsg })
  } catch (e) {
    return NextResponse.json(
      { status: 'error', message: 'Server error, please try again later' },
      { status: 500 }
    )
  }
}
