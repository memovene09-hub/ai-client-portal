import { Mode } from '@/types'

type Props = {
  modes: Mode[]
  selectedMode: string
  onSelect: (id: string) => void
}

export default function ModeSelector({ modes, selectedMode, onSelect }: Props) {
  return (
    <div className="w-52 flex-shrink-0 flex flex-col gap-1 p-4 border-r border-gray-200">
      {modes.map(mode => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={`text-left px-3 py-2 rounded text-sm ${
            selectedMode === mode.id
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          <div className="font-medium">{mode.label}</div>
          <div className="text-xs opacity-70">{mode.description}</div>
        </button>
      ))}
    </div>
  )
}
