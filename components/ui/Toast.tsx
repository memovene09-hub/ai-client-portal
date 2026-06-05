'use client'

// Standalone Toast — re-exported for use outside settings.
// The settings page embeds its own inline Toast to keep the import tree simple.
import { useEffect } from 'react'
import { Check, X } from 'lucide-react'

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
    const t = setTimeout(onDismiss, 3000)
    return () => clearTimeout(t)
  }, [toast, onDismiss])

  if (!toast) return null

  const isSuccess = toast.variant === 'success'
  return (
    <div
      role="alert"
      className={[
        'fixed top-4 right-4 z-50',
        'flex items-center gap-2 p-4 rounded-md',
        'text-sm font-medium text-white',
        isSuccess ? 'bg-[#22c55e]' : 'bg-[#ef4444]',
      ].join(' ')}
    >
      {isSuccess
        ? <Check className="w-4 h-4 flex-none" />
        : <X className="w-4 h-4 flex-none" />}
      {toast.message}
    </div>
  )
}
