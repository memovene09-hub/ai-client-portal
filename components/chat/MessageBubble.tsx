import ReactMarkdown from 'react-markdown'
import { Message } from '@/types'

type Props = {
  message: Message
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user'

  return (
    <div
      className={`flex px-9 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[68%] px-[18px] py-[14px] text-[14.8px] leading-[1.55] break-words animate-pop motion-reduce:animate-none ${
          isUser
            ? 'bg-purple text-white rounded-[18px] rounded-br-[6px]'
            : 'bg-agent-bubble text-white rounded-[18px] rounded-bl-[6px]'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div
            className="
              [&_h1]:text-[19px] [&_h2]:text-[17px] [&_h3]:text-[15.5px]
              [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold
              [&_h1]:leading-[1.3] [&_h2]:leading-[1.3] [&_h3]:leading-[1.3]
              [&_h1]:my-2 [&_h2]:my-2 [&_h3]:my-2
              [&_h3]:text-[#E4D6F2]
              [&_p]:my-1.5 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0
              [&_ul]:my-1.5 [&_ul]:pl-5 [&_ul]:list-disc
              [&_ol]:my-1.5 [&_ol]:pl-5 [&_ol]:list-decimal
              [&_li]:my-[3px]
              [&_strong]:font-bold [&_strong]:text-white
              [&_code]:font-mono [&_code]:text-[13px]
              [&_code]:bg-black/30 [&_code]:px-1.5 [&_code]:py-[1.5px]
              [&_code]:rounded-[5px] [&_code]:text-[#E4D6F2]
              [&_pre]:bg-[#0F1733] [&_pre]:border [&_pre]:border-white/10
              [&_pre]:rounded-[10px] [&_pre]:px-[14px] [&_pre]:py-3
              [&_pre]:my-2 [&_pre]:overflow-x-auto
              [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-text-secondary
              [&_pre_code]:text-[12.8px] [&_pre_code]:leading-[1.6]
              [&_blockquote]:border-l-[3px] [&_blockquote]:border-lavender-soft
              [&_blockquote]:py-0.5 [&_blockquote]:pl-3 [&_blockquote]:my-2
              [&_blockquote]:text-text-secondary [&_blockquote]:italic
              [&_a]:text-lavender-soft
            "
          >
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
