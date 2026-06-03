'use client'
import { useState, useEffect, useCallback } from 'react'
import { Message, TenantConfig } from '@/types'
import ModeSelector from '@/components/chat/ModeSelector'
import ChatWindow from '@/components/chat/ChatWindow'
import InputBar from '@/components/chat/InputBar'
import Spinner from '@/components/ui/Spinner'

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID ?? 'claryon-demo'

export default function ChatPage() {
  const [tenant, setTenant] = useState<TenantConfig | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [modeId, setModeId] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  useEffect(() => {
    fetch(`/api/tenant/${TENANT_ID}`)
      .then(res => res.json())
      .then((data: TenantConfig) => {
        setTenant(data)
        setModeId(data.agent.availableModes[0]?.id ?? '')
      })
  }, [])

  const handleSend = useCallback(async (text: string) => {
    if (!tenant) return
    const userMessage: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsStreaming(true)

    const assistantMessage: Message = { role: 'assistant', content: '' }
    setMessages(prev => [...prev, assistantMessage])

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages, modeId, tenantId: TENANT_ID })
    })

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
          content: updated[updated.length - 1].content + chunk
        }
        return updated
      })
    }

    setIsStreaming(false)
  }, [messages, modeId, tenant])

  if (!tenant) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <ModeSelector
        modes={tenant.agent.availableModes}
        selectedMode={modeId}
        onSelect={setModeId}
      />
      <div className="flex flex-col flex-1">
        <ChatWindow messages={messages} isStreaming={isStreaming} />
        <InputBar onSend={handleSend} disabled={isStreaming} />
      </div>
    </div>
  )
}
