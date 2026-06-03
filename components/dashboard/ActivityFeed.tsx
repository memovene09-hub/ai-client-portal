const ACTIVITY = [
  {
    id: 1,
    icon: '🏭',
    description: 'Grupo Herdez analizado — Score ICP: 72',
    date: '2026-06-01',
  },
  {
    id: 2,
    icon: '📧',
    description: 'Correo enviado a Bimbo S.A. de C.V.',
    date: '2026-05-30',
  },
  {
    id: 3,
    icon: '🔍',
    description: 'Sector Manufactura — 5 candidatos generados',
    date: '2026-05-29',
  },
]

export default function ActivityFeed() {
  return (
    <div className="flex flex-col gap-2">
      {ACTIVITY.map(item => (
        <div
          key={item.id}
          className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
        >
          <span className="text-lg">{item.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800">{item.description}</p>
            <p className="text-xs text-gray-400 mt-1">{item.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
