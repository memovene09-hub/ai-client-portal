'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type State = 'idle' | 'loading' | 'done'

export default function LoginPage() {
  const router = useRouter()
  const [state, setState] = useState<State>('idle')

  const handleClick = () => {
    if (state !== 'idle') return
    setState('loading')
    setTimeout(() => {
      setState('done')
      setTimeout(() => router.push('/dashboard'), 800)
    }, 1800)
  }

  const label =
    state === 'loading'
      ? 'Conectando con Google…'
      : state === 'done'
      ? 'Conectado'
      : 'Continuar con Google'

  return (
    <main
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 55% at 50% 38%, rgba(46, 70, 150, 0.38) 0%, rgba(20, 32, 81, 0) 70%), radial-gradient(120% 90% at 50% 120%, rgba(8, 14, 38, 0.85) 0%, rgba(20, 32, 81, 0) 60%)',
        }}
      />

      <div className="relative z-10 flex w-full max-w-[392px] flex-col items-center gap-[34px]">
        <div className="flex flex-col items-center gap-[18px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/claryon-logo-white.png"
            alt="Claryon"
            className="w-24 h-auto block drop-shadow-[0_6px_22px_rgba(0,0,0,0.35)]"
          />
          <p className="text-[13px] font-medium uppercase tracking-[0.26em] text-text-secondary text-center">
            Portal de Agentes IA
          </p>
        </div>

        <div className="w-full bg-card border border-claryon-border rounded-[18px] p-7 shadow-login-card">
          <button
            type="button"
            onClick={handleClick}
            disabled={state !== 'idle'}
            aria-label="Continuar con Google"
            className={`group relative flex h-[54px] w-full items-center justify-center gap-3 rounded-[11px] bg-white font-sans text-[15px] font-semibold tracking-[0.01em] shadow-[0_1px_2px_rgba(0,0,0,0.18)] transition-all duration-150 ease-out focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[rgba(126,156,255,0.7)] ${
              state === 'idle'
                ? 'text-ink cursor-pointer hover:-translate-y-px hover:shadow-[0_6px_18px_-6px_rgba(0,0,0,0.45)] active:translate-y-0 active:shadow-[0_2px_6px_rgba(0,0,0,0.3)]'
                : state === 'loading'
                ? 'text-[#3C4043] cursor-default'
                : 'text-[#137333] cursor-default'
            }`}
          >
            {state === 'idle' && (
              <svg
                viewBox="0 0 48 48"
                aria-hidden
                className="w-[19px] h-[19px] flex-none"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
            )}

            {state === 'loading' && (
              <span
                aria-hidden
                className="w-[19px] h-[19px] flex-none rounded-full border-[2.5px] border-[rgba(60,64,67,0.25)] border-t-[#3C4043] animate-spin motion-reduce:[animation-duration:1.4s]"
              />
            )}

            {state === 'done' && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className="w-[19px] h-[19px] flex-none"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="#137333"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}

            <span>{label}</span>
          </button>
        </div>
      </div>
    </main>
  )
}
