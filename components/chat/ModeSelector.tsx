import { Mode } from '@/types'

type Props = {
  modes: Mode[]
  selectedMode: string
  onSelect: (id: string) => void
}

export default function ModeSelector({ modes, selectedMode, onSelect }: Props) {
  return (
    <div className="w-[200px] flex-none bg-card border-r border-claryon-border px-[14px] py-[22px] flex flex-col gap-2">
      <div className="text-[11.5px] font-semibold tracking-[0.16em] uppercase text-text-secondary px-2 pb-1.5">
        Modo activo
      </div>

      {modes.map(mode => {
        const isActive = selectedMode === mode.id
        return (
          <button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            className={`w-full text-left border-l-[3px] px-[14px] py-[13px] text-[14px] font-sans transition-colors duration-150 ${
              isActive
                ? 'bg-purple text-white font-semibold border-purple-light rounded-r-[9px]'
                : 'bg-transparent text-text-secondary font-medium border-transparent rounded-[9px] hover:bg-claryon-border hover:text-white'
            }`}
          >
            <div>{mode.label}</div>
            {mode.description && (
              <div className="text-[11.5px] font-normal opacity-75 mt-0.5">
                {mode.description}
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
