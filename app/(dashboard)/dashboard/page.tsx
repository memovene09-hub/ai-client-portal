import Link from 'next/link'
import ActivityFeed from '@/components/dashboard/ActivityFeed'

export default function DashboardPage() {
  return (
    <div className="px-[52px] pt-11 pb-14">
      <div className="max-w-[780px]">
        <header className="mb-[30px]">
          <h1 className="text-[30px] font-bold tracking-[-0.01em] mb-1.5">
            Bienvenido, Memo
          </h1>
          <p className="text-text-secondary text-[14.5px]">
            Tu agente está listo para atender la conversación.
          </p>
        </header>

        <section className="flex items-center gap-6 bg-card border border-claryon-border border-l-[6px] border-l-purple rounded-2xl px-7 py-[26px] shadow-agent-card mb-10">
          <div className="flex-1 min-w-0">
            <div className="text-[11.5px] font-semibold tracking-[0.16em] uppercase text-lavender mb-[9px]">
              Agente activo
            </div>
            <div className="text-[22px] font-bold mb-[11px]">
              Asistente Claryon
            </div>
            <span className="inline-flex items-center gap-[7px] text-[13.5px] font-medium text-text-secondary">
              <span className="w-[9px] h-[9px] rounded-full bg-ready shadow-[0_0_0_4px_rgba(52,211,153,0.16)]" />
              Listo
            </span>
          </div>

          <Link
            href="/chat"
            className="group flex-none inline-flex items-center gap-[9px] bg-purple text-white rounded-[11px] px-[22px] py-[14px] text-[15px] font-semibold shadow-cta transition-all duration-150 hover:bg-purple-hover hover:-translate-y-px hover:shadow-cta-hover active:translate-y-0"
          >
            Abrir chat{' '}
            <span className="transition-transform duration-150 group-hover:translate-x-[3px]">
              →
            </span>
          </Link>
        </section>

        <h2 className="text-base font-semibold tracking-[0.005em] mb-4">
          Actividad reciente
        </h2>
        <ActivityFeed />
      </div>
    </div>
  )
}
