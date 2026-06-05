'use client'

import { useEffect } from 'react'

export type ToastVariant = 'success' | 'error'

export type ToastState = {
  message: string
  variant: ToastVariant
} | null

type Props = {
  toast: ToastState
  onDismiss: () => void
}

export default function Toast({ toast, onDismiss }: Props) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onDismiss, 3500)
    return () => clearTimeout(t)
  }, [toast, onDismiss])

  if (!toast) return null

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl text-[14px] font-medium shadow-lg animate-pop ${
        toast.variant === 'success'
          ? 'bg-ready/10 border border-ready/30 text-ready'
          : 'bg-red-500/10 border border-red-400/30 text-red-300'
      }`}
    >
      {toast.variant === 'success' ? (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] flex-none">
          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="currentColor" className="w-[18px] h-[18px] flex-none">
          <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
        </svg>
      )}
      {toast.message}
    </div>
  )
}
