/**
 * AIGraderSection - AI 打分工具区块
 * 页面顶部的首屏展示，使用 Tailwind CSS 重写
 */

'use client'

import { Sparkles } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { useTransClient } from '@/app/i18n/client'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/store/user'
import { navigateToLogin } from '@/utils/auth'

import { graderPhone } from '../../data/grader'

/** 渐变模糊视频背景资源 */
const GRADER_VIDEO = {
  desktop: {
    mp4: '/welcome/grader-blur-desktop.mp4',
    webm: '/welcome/grader-blur-desktop.webm',
    poster: '/welcome/grader-blur-desktop-poster.jpg',
  },
  tablet: {
    mp4: '/welcome/grader-blur-mobile.mp4',
    webm: '/welcome/grader-blur-mobile.webm',
    poster: '/welcome/grader-blur-mobile-poster.jpg',
  },
}

/** 上箭头图标 */
function ArrowUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.75 8.25L8.99999 3L14.25 8.25M8.99999 14.6912V3.375" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function AIGraderSection() {
  const { t, i18n } = useTransClient('welcome')
  const isVi = i18n.language === 'vi'
  const router = useRouter()
  const token = useUserStore(state => state.token)
  const [searchText, setSearchText] = useState('')

  const handleSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()

    // 已登录用户直接跳转到首页
    if (token) {
      router.push('/')
      return
    }

    navigateToLogin()
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#f5f3f0] to-[#fefdfd] pb-12 pt-24 md:pb-20 md:pt-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {/* 顶部徽章 */}
          <div className="mb-4 flex items-center gap-2 rounded-full border border-border/50 bg-background px-4 py-2 shadow-sm">
            <Sparkles className="size-4 text-orange-500" />
            <span className="text-sm font-medium">{t('hero.badge')}</span>
          </div>

          {/* 大标题 */}
          <h1 className="max-w-5xl text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>

          {/* 副标题 */}
          <p className="mt-4 max-w-3xl text-center text-base text-muted-foreground md:mt-6 md:text-lg">
            {t('hero.subtitle')}
          </p>

          {/* 搜索框 - 视频背景渐变边框 */}
          <div className="relative mx-auto mt-8 w-full max-w-xl md:mt-10">
            {/* 视频背景层 */}
            <div className="pointer-events-none absolute -inset-x-3 -inset-y-1.5 z-0 overflow-hidden rounded-[24px] blur-[3px]">
              {/* 桌面端视频 - scale-110 确保边缘内容溢出到模糊区域 */}
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={GRADER_VIDEO.desktop.poster}
                className="hidden size-full scale-110 object-cover md:block"
              >
                <source src={GRADER_VIDEO.desktop.mp4} type="video/mp4" />
                <source src={GRADER_VIDEO.desktop.webm} type="video/webm" />
              </video>
              {/* 平板/移动端视频 */}
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={GRADER_VIDEO.tablet.poster}
                className="size-full object-cover md:hidden"
              >
                <source src={GRADER_VIDEO.tablet.mp4} type="video/mp4" />
                <source src={GRADER_VIDEO.tablet.webm} type="video/webm" />
              </video>
            </div>

            {/* 搜索框 - 覆盖在视频上 */}
            <form
              onSubmit={handleSubmit}
              className="relative z-10 flex w-full items-center gap-2 rounded-[18px] bg-white p-[10px] pl-[24px] shadow-[71px_70px_40px_#3a312703,40px_39px_34px_#3a31270a,18px_17px_25px_#3a31270f,4px_4px_14px_#3a312712]"
            >
              <div className="flex-1">
                <Input
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  placeholder={t('hero.placeholder')}
                  className="!h-10 !border-0 !bg-transparent !shadow-none !ring-0 !pl-2"
                />
              </div>
              <button
                type="submit"
                className="flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-70 md:px-6"
              >
                <span className="hidden sm:inline">{t('hero.cta')}</span>
                <ArrowUpIcon />
              </button>
            </form>
          </div>

          {/* 产品介绍视频 */}
          <div className="relative mt-10 w-64 md:mt-12 md:w-72 lg:w-80">
            <video
              src="/welcome/hero-video.mp4"
              poster="/welcome/hero-illustration-zh.svg"
              autoPlay
              loop
              muted
              playsInline
              className="relative z-[10] w-full rounded-3xl shadow-2xl"
            ></video>
            {/* 浮动标签 - 移动端隐藏避免溢出 */}
            {graderPhone.tags.map((tag, index) => (
              <div
                key={index}
                className={cn(
                  'absolute z-3 hidden rounded-full bg-background px-3 py-1.5 shadow-lg sm:block',
                  index === 0
                    ? '-left-4 top-1/4 -translate-x-full md:-left-6'
                    : '-right-4 top-2/3 translate-x-full md:-right-6',
                )}
              >
                <div className="flex items-center gap-1.5">
                  <div className="size-3 rounded-sm bg-orange-500" />
                  <span className="whitespace-nowrap text-xs font-medium">{t(tag.textKey)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
