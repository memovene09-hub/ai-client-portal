'use client'
import { useState, useRef, KeyboardEvent, ChangeEvent } from 'react'

type Props = {
  onSend: (text: string) => void
  disabled: boolean
}

export default function InputBar({ onSend, disabled }: Props) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (!value.trim() || disabled) return
    onSend(value.trim())
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }

  return (
    <div className="flex-none border-t border-claryon-border bg-navy px-9 pt-4 pb-5 flex gap-3 items-end">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={1}
        placeholder="Escribe un mensaje…"
        className="flex-1 resize-none bg-card border border-claryon-border rounded-[12px] text-white font-sans text-[14.8px] leading-[1.5] px-4 py-[13px] max-h-[140px] outline-none transition-colors duration-150 focus:border-purple placeholder:text-text-secondary placeholder:opacity-85 disabled:opacity-60"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="flex-none h-12 px-6 rounded-[12px] bg-purple text-white font-sans text-[15px] font-semibold inline-flex items-center gap-2 transition-all duration-150 hover:enabled:bg-purple-hover hover:enabled:-translate-y-px disabled:bg-[#3A3A40] disabled:text-[#8A8A93] disabled:cursor-not-allowed"
      >
        Enviar
      </button>
    </div>
  )
}
