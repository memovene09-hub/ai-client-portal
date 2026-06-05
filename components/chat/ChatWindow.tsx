import { useEffect, useRef } from 'react'
import { Message } from '@/types'
import MessageBubble from './MessageBubble'

type Props = {
  messages: Message[]
  isStreaming: boolean
}

export default function ChatWindow({ messages, isStreaming }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const lastIsEmpty =
    isStreaming &&
    messages.length > 0 &&
    messages[messages.length - 1].content === ''

  return (
    <div className="flex-1 overflow-y-auto pt-8 pb-6 flex flex-col gap-[18px]">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}

      {lastIsEmpty && (
        <div className="flex justify-start px-9">
          <div className="max-w-[68%] bg-agent-bubble text-white rounded-[18px] rounded-bl-[6px] px-[18px] py-[14px]">
            <div className="inline-flex items-center gap-1.5 py-1 px-0.5">
              <span className="w-2 h-2 rounded-full bg-lavender-soft animate-blink" />
              <span
                className="w-2 h-2 rounded-full bg-lavender-soft animate-blink"
                style={{ animationDelay: '0.2s' }}
              />
              <span
                className="w-2 h-2 rounded-full bg-lavender-soft animate-blink"
                style={{ animationDelay: '0.4s' }}
              />
            </div>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
