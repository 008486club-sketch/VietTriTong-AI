/**
 * Providers - 全局 Provider 组件
 * 包含 Google OAuth、Ant Design 配置、Toast、主题等全局配置
 */

'use client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from 'next-themes'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { useShallow } from 'zustand/shallow'
import LoginDialog from '@/app/layout/LoginDialog'
import { useLoginDialogStore } from '@/app/layout/LoginDialog/store'
import { LowBalanceAlertProvider } from '@/components/common/LowBalanceAlert/LowBalanceAlertProvider'
import SettingsModal from '@/components/SettingsModal'
import { useSettingsModalStore } from '@/components/SettingsModal/store'
import NotificationCenter from '@/components/ui/NotificationCenter'
import { Toaster } from '@/components/ui/sonner'
import { useUserStore } from '@/store/user'
import { isPublicPage } from '@/utils/route'

// Google OAuth Client ID — 从环境变量读取，未配置时降级为邮箱登录
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

export function Providers({ children, lng, autoLoginToken }: { children: React.ReactNode, lng: string, autoLoginToken?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const hasPromptedRef = useRef(false)

  const { _hasHydrated, token } = useUserStore(
    useShallow(state => ({
      _hasHydrated: state._hasHydrated,
      token: state.token,
    })),
  )

  const { settingsVisible, settingsDefaultTab, closeSettings } = useSettingsModalStore()

  useEffect(() => {
    if (!_hasHydrated)
      return
    if (!useUserStore.getState().token && autoLoginToken) {
      useUserStore.getState().setToken(autoLoginToken)
    }
    if (!isPublicPage(pathname)) {
      useUserStore.getState().appInit()
    }
  }, [_hasHydrated, autoLoginToken, pathname])

  useEffect(() => {
    useUserStore.getState().setLang(lng)
  }, [lng])

  useEffect(() => {
    if (!_hasHydrated) return
    if (token) { hasPromptedRef.current = false; return }
    if (isPublicPage(pathname)) { hasPromptedRef.current = false; return }
    if (hasPromptedRef.current) return
    hasPromptedRef.current = true
    useLoginDialogStore.getState().openLoginDialog({ fromGuard: true })
  }, [_hasHydrated, token, pathname])

  useLayoutEffect(() => {
    const hl = lng.replace('-', '_')
    const GIS_URL = 'https://accounts.google.com/gsi/client'
    const originalAppendChild = document.body.appendChild.bind(document.body)
    document.body.appendChild = function <T extends Node>(node: T): T {
      if (node instanceof HTMLScriptElement && node.src === GIS_URL) {
        node.src = `${GIS_URL}?hl=${hl}`
      }
      return originalAppendChild(node)
    }
    return () => { document.body.appendChild = originalAppendChild }
  }, [lng])

  const inner = (
    <>
      <Toaster position="top-center" richColors />
      <NotificationCenter />
      <LowBalanceAlertProvider />
      <LoginDialog />
      <SettingsModal
        open={settingsVisible}
        onClose={closeSettings}
        defaultTab={settingsDefaultTab}
      />
      {children}
    </>
  )

  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        {GOOGLE_CLIENT_ID ? (
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            {inner}
          </GoogleOAuthProvider>
        ) : (
          inner
        )}
      </ThemeProvider>
    </>
  )
}
