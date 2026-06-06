'use client'
import { useState, useEffect, useCallback } from 'react'
import { Message, TenantConfig } from '@/types'
import ModeSelector from '@/components/chat/ModeSelector'
import ChatWindow from '@/components/chat/ChatWindow'
import InputBar from '@/components/chat/InputBar'
import Spinner from '@/components/ui/Spinner'

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID ?? 'claryon-demo'

// ---------------------------------------------------------------------------
// Inline error toast (auto-dismiss, top-right)
// ---------------------------------------------------------------------------

function ErrorToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000)
    return () => clearTimeout(t)
  }, [message, onDismiss])

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-red-600 text-white text-sm font-medium px-4 py-3 rounded-lg shadow-lg max-w-sm">
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-none">
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
      </svg>
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="text-white/70 hover:text-white transition-colors">✕</button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChatPage() {
  const [tenant, setTenant] = useState<TenantConfig | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [modeId, setModeId] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/tenant/${TENANT_ID}`)
      .then(res => res.json())
      .then((data: TenantConfig) => {
        setTenant(data)
        setModeId(data.agent.availableModes[0]?.id ?? '')
      })
      .catch(() => setErrorMsg('No se pudo cargar la configuración del agente.'))
  }, [])

  const handleSend = useCallback(async (text: string) => {
    if (!tenant || isStreaming) return

    const userMessage: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsStreaming(true)
    setErrorMsg(null)

    // Optimistic empty assistant bubble
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, modeId, tenantId: TENANT_ID }),
      })

      if (!res.ok) {
        // Server returned a JSON error — remove the empty assistant bubble
        setMessages(prev => prev.slice(0, -1))
        const json = await res.json().catch(() => ({}))
        setErrorMsg(json.error ?? `Error del servidor (${res.status})`)
        return
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = {
            role: 'assistant',
            content: updated[updated.length - 1].content + chunk,
          }
          return updated
        })
      }
    } catch {
      setMessages(prev => prev.slice(0, -1))
      setErrorMsg('Error de red — revisa tu conexión e intenta de nuevo.')
    } finally {
      setIsStreaming(false)
    }
  }, [messages, modeId, tenant, isStreaming])

  if (!tenant) {
    return (
      <div className="flex h-full items-center justify-center bg-navy">
        <Spinner />
      </div>
    )
  }

  return (
    <>
      <div className="flex h-full bg-navy">
        <ModeSelector
          modes={tenant.agent.availableModes}
          selectedMode={modeId}
          onSelect={setModeId}
        />
        <section className="flex-1 min-w-0 flex flex-col bg-navy">
          <ChatWindow messages={messages} isStreaming={isStreaming} />
          <InputBar onSend={handleSend} disabled={isStreaming} />
        </section>
      </div>

      {errorMsg && (
        <ErrorToast message={errorMsg} onDismiss={() => setErrorMsg(null)} />
      )}
    </>
  )
}
