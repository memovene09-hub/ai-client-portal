import { useEffect, useRef } from 'react'
import { Message } from '@/types'
import MessageBubble from './MessageBubble'
import Spinner from '@/components/ui/Spinner'

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
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, i) => (
        <MessageBubble key={i} message={msg} />
      ))}
      {lastIsEmpty && (
        <div className="flex justify-start mb-3 px-4">
          <Spinner />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
