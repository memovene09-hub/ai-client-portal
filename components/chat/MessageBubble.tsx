import ReactMarkdown from 'react-markdown'
import { Message } from '@/types'

type Props = {
  message: Message
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
    </div>
  )
}
