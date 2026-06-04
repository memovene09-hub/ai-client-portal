'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

type NavItem = {
  href: string
  label: string
  icon: ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[19px] h-[19px] flex-none stroke-current"
      >
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: '/chat',
    label: 'Chat',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[19px] h-[19px] flex-none stroke-current"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
      </svg>
    ),
  },
  {
    href: '/historial',
    label: 'Historial',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-[19px] h-[19px] flex-none stroke-current"
      >
        <path d="M3 3v5h5" />
        <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen overflow-hidden bg-navy text-white">
      <aside className="w-[220px] flex-none flex flex-col bg-card border-r border-claryon-border">
        <div className="flex items-center gap-[11px] px-[22px] pt-6 pb-[22px] border-b border-claryon-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/claryon-logo-white.png"
            alt=""
            className="w-[38px] h-auto block"
          />
          <span className="text-[18px] font-bold tracking-[0.02em]">
            Claryon
          </span>
        </div>

        <nav className="flex flex-col py-4 gap-0.5">
          {NAV_ITEMS.map(item => {
            const isActive =
              pathname === item.href || pathname?.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-[13px] px-[22px] py-3 text-[14.5px] border-l-[3px] transition-colors duration-150 ${
                  isActive
                    ? 'text-white font-semibold border-purple bg-purple/[0.14]'
                    : 'text-text-secondary font-medium border-transparent hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto flex items-center gap-[11px] px-[18px] py-4 border-t border-claryon-border">
          <div className="w-[38px] h-[38px] flex-none rounded-full bg-gradient-to-br from-purple to-purple-deep flex items-center justify-center font-bold text-[15px] text-white">
            M
          </div>
          <div className="min-w-0">
            <div className="text-[13.5px] font-semibold leading-tight">
              Memo
            </div>
            <div className="text-[11.5px] text-text-secondary truncate">
              memo@claryon.ai
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 bg-navy overflow-auto">{children}</main>
    </div>
  )
}
