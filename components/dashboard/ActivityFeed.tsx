import type { ReactNode } from 'react'

type Activity = {
  id: number
  description: string
  meta: string
  date: string
  icon: ReactNode
}

const ChatIcon = (
  <svg
    viewBox="0 0 24 24"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    className="w-[19px] h-[19px] stroke-lavender"
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.9-.9L3 21l1.9-5.6A8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
  </svg>
)

const FileIcon = (
  <svg
    viewBox="0 0 24 24"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    className="w-[19px] h-[19px] stroke-lavender"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M8 13h8M8 17h5" />
  </svg>
)

const LoginIcon = (
  <svg
    viewBox="0 0 24 24"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    fill="none"
    className="w-[19px] h-[19px] stroke-lavender"
  >
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <path d="M10 17l5-5-5-5" />
    <path d="M15 12H3" />
  </svg>
)

const ACTIVITY: Activity[] = [
  {
    id: 1,
    description: 'Nueva conversación con Asistente Claryon',
    meta: '12 mensajes intercambiados',
    date: 'Hoy, 09:24',
    icon: ChatIcon,
  },
  {
    id: 2,
    description: 'Resumen de conversación generado',
    meta: 'Exportado a PDF',
    date: 'Ayer, 18:02',
    icon: FileIcon,
  },
  {
    id: 3,
    description: 'Sesión iniciada desde Chrome',
    meta: 'Ciudad de México',
    date: '29 may, 2026',
    icon: LoginIcon,
  },
]

export default function ActivityFeed() {
  return (
    <div className="flex flex-col border border-claryon-border rounded-[14px] overflow-hidden bg-card/[0.45]">
      {ACTIVITY.map((item, i) => (
        <div
          key={item.id}
          className={`flex items-center gap-4 px-5 py-4 ${
            i < ACTIVITY.length - 1 ? 'border-b border-claryon-border' : ''
          }`}
        >
          <div className="w-10 h-10 flex-none rounded-full bg-lavender/[0.16] flex items-center justify-center">
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14.5px] font-medium leading-snug">
              {item.description}
            </div>
            <div className="text-[12.5px] text-text-secondary mt-[3px]">
              {item.meta}
            </div>
          </div>
          <div className="flex-none text-[12.5px] text-text-secondary whitespace-nowrap">
            {item.date}
          </div>
        </div>
      ))}
    </div>
  )
}
