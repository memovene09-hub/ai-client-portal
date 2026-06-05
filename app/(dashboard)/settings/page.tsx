'use client'

import { useState, useCallback, useEffect } from 'react'
import Toast, { type ToastState } from '@/components/ui/Toast'
import type { TenantContextProduct } from '@/types'

const ORG_ID = 'claryon-demo'

// ---------------------------------------------------------------------------
// Shared input styles
// ---------------------------------------------------------------------------

const inputCls =
  'w-full bg-navy border border-claryon-border rounded-lg px-3.5 py-2.5 text-[14px] text-white placeholder-text-secondary focus:outline-none focus:border-purple transition-colors'

const labelCls = 'block text-[13px] font-medium text-text-secondary mb-1.5'

const sectionCls = 'bg-card border border-claryon-border rounded-2xl px-7 py-6 flex flex-col gap-5'

const sectionTitle = 'text-[15px] font-semibold text-lavender mb-1'

// ---------------------------------------------------------------------------
// Empty product row
// ---------------------------------------------------------------------------

const emptyProduct = (): TenantContextProduct => ({ name: '', description: '', price: '' })

// ---------------------------------------------------------------------------
// Form state type
// ---------------------------------------------------------------------------

type FormState = {
  name: string
  description: string
  tone_of_voice: string
  target_audience: string
  pain_points: string          // one per line in the textarea
  products: TenantContextProduct[]
  main_objective: string
}

function defaultForm(): FormState {
  return {
    name: '',
    description: '',
    tone_of_voice: '',
    target_audience: '',
    pain_points: '',
    products: [emptyProduct()],
    main_objective: '',
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const [form, setForm] = useState<FormState>(defaultForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'products_min', string>>>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastState>(null)

  const dismissToast = useCallback(() => setToast(null), [])

  // Load existing context on mount
  useEffect(() => {
    fetch(`/api/settings?org_id=${ORG_ID}`)
      .then(r => r.json())
      .then(data => {
        if (!data) return
        setForm({
          name: data.basic_info?.name ?? '',
          description: data.basic_info?.description ?? '',
          tone_of_voice: data.basic_info?.tone_of_voice ?? '',
          target_audience: data.market?.target_audience ?? '',
          pain_points: Array.isArray(data.market?.pain_points)
            ? data.market.pain_points.join('\n')
            : (data.market?.pain_points ?? ''),
          products: data.products?.length ? data.products : [emptyProduct()],
          main_objective: data.goals?.main_objective ?? '',
        })
      })
      .catch(() => {/* first time or no DB — start empty */})
      .finally(() => setLoading(false))
  }, [])

  // ---- field helpers -------------------------------------------------------

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  function setProduct(index: number, field: keyof TenantContextProduct, value: string) {
    setForm(prev => {
      const updated = prev.products.map((p, i) =>
        i === index ? { ...p, [field]: value } : p
      )
      return { ...prev, products: updated }
    })
    if (errors.products_min) setErrors(prev => ({ ...prev, products_min: undefined }))
  }

  function addProduct() {
    setForm(prev => ({ ...prev, products: [...prev.products, emptyProduct()] }))
  }

  function removeProduct(index: number) {
    setForm(prev => ({ ...prev, products: prev.products.filter((_, i) => i !== index) }))
  }

  // ---- validation ----------------------------------------------------------

  function validate(): boolean {
    const next: typeof errors = {}
    if (!form.name.trim()) next.name = 'Nombre de empresa es obligatorio'
    if (!form.description.trim()) next.description = 'Descripción es obligatoria'
    if (form.products.length === 0 || form.products.every(p => !p.name.trim())) {
      next.products_min = 'Agrega al menos un producto con nombre'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  // ---- submit --------------------------------------------------------------

  async function handleSave() {
    if (!validate()) return

    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          org_id: ORG_ID,
          basic_info: {
            name: form.name.trim(),
            description: form.description.trim(),
            tone_of_voice: form.tone_of_voice.trim(),
          },
          market: {
            target_audience: form.target_audience.trim(),
            pain_points: form.pain_points
              .split('\n')
              .map(l => l.trim())
              .filter(Boolean),
          },
          products: form.products.filter(p => p.name.trim()),
          goals: { main_objective: form.main_objective.trim() },
        }),
      })

      const json = await res.json()

      if (!res.ok) {
        setToast({ message: json.error ?? 'Error al guardar', variant: 'error' })
      } else {
        setToast({ message: 'Contexto guardado', variant: 'success' })
      }
    } catch {
      setToast({ message: 'Error de red — intenta de nuevo', variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  // ---- render --------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-text-secondary text-[14px]">
        Cargando configuración...
      </div>
    )
  }

  return (
    <>
      <div className="px-[52px] pt-11 pb-14">
        <div className="max-w-[780px]">

          <header className="mb-8">
            <h1 className="text-[30px] font-bold tracking-[-0.01em] mb-1.5">
              Configuración de empresa
            </h1>
            <p className="text-text-secondary text-[14.5px]">
              Esta información contextualiza a tu agente para respuestas más precisas.
            </p>
          </header>

          <div className="flex flex-col gap-6">

            {/* ── Información básica ─────────────────────────────────── */}
            <section className={sectionCls}>
              <h2 className={sectionTitle}>Información básica</h2>

              <div>
                <label className={labelCls}>Nombre de empresa <span className="text-purple-light">*</span></label>
                <input
                  type="text"
                  placeholder="Ej: Distribuidora Zapopan S.A."
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  className={`${inputCls} ${errors.name ? 'border-red-400' : ''}`}
                />
                {errors.name && <p className="text-red-400 text-[12px] mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className={labelCls}>Descripción <span className="text-purple-light">*</span></label>
                <textarea
                  rows={3}
                  placeholder="Qué hace la empresa, cómo opera, a quién atiende..."
                  value={form.description}
                  onChange={e => setField('description', e.target.value)}
                  className={`${inputCls} resize-none ${errors.description ? 'border-red-400' : ''}`}
                />
                {errors.description && <p className="text-red-400 text-[12px] mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className={labelCls}>Tone of voice</label>
                <input
                  type="text"
                  placeholder="Ej: casual, divertido, accesible"
                  value={form.tone_of_voice}
                  onChange={e => setField('tone_of_voice', e.target.value)}
                  className={inputCls}
                />
              </div>
            </section>

            {/* ── Mercado ────────────────────────────────────────────── */}
            <section className={sectionCls}>
              <h2 className={sectionTitle}>Mercado</h2>

              <div>
                <label className={labelCls}>Audiencia objetivo</label>
                <textarea
                  rows={2}
                  placeholder="Ej: Dueños de PyMEs en Guadalajara con 10–50 empleados..."
                  value={form.target_audience}
                  onChange={e => setField('target_audience', e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              </div>

              <div>
                <label className={labelCls}>Pain points <span className="text-text-secondary font-normal">(uno por línea)</span></label>
                <textarea
                  rows={4}
                  placeholder={"Procesos manuales que consumen mucho tiempo\nFalta de visibilidad sobre el negocio\nDificultad para escalar sin caos"}
                  value={form.pain_points}
                  onChange={e => setField('pain_points', e.target.value)}
                  className={`${inputCls} resize-none font-mono text-[13px]`}
                />
              </div>
            </section>

            {/* ── Productos ──────────────────────────────────────────── */}
            <section className={sectionCls}>
              <div className="flex items-center justify-between">
                <h2 className={sectionTitle}>
                  Productos / Servicios <span className="text-purple-light">*</span>
                </h2>
                <button
                  type="button"
                  onClick={addProduct}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-purple-light hover:text-white transition-colors"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                  </svg>
                  Agregar producto
                </button>
              </div>

              {errors.products_min && (
                <p className="text-red-400 text-[12px] -mt-2">{errors.products_min}</p>
              )}

              <div className="flex flex-col gap-3">
                {/* Header row */}
                {form.products.length > 0 && (
                  <div className="grid grid-cols-[1fr_1.5fr_100px_36px] gap-3 px-1">
                    <span className="text-[11.5px] font-semibold text-text-secondary uppercase tracking-[0.08em]">Nombre</span>
                    <span className="text-[11.5px] font-semibold text-text-secondary uppercase tracking-[0.08em]">Descripción</span>
                    <span className="text-[11.5px] font-semibold text-text-secondary uppercase tracking-[0.08em]">Precio</span>
                    <span />
                  </div>
                )}

                {form.products.map((product, i) => (
                  <div key={i} className="grid grid-cols-[1fr_1.5fr_100px_36px] gap-3 items-start">
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={product.name}
                      onChange={e => setProduct(i, 'name', e.target.value)}
                      className={inputCls}
                    />
                    <input
                      type="text"
                      placeholder="Descripción breve"
                      value={product.description}
                      onChange={e => setProduct(i, 'description', e.target.value)}
                      className={inputCls}
                    />
                    <input
                      type="text"
                      placeholder="$0 MXN"
                      value={String(product.price)}
                      onChange={e => setProduct(i, 'price', e.target.value)}
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => removeProduct(i)}
                      disabled={form.products.length === 1}
                      title="Eliminar"
                      className="flex items-center justify-center h-[42px] rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* ── Objetivos ──────────────────────────────────────────── */}
            <section className={sectionCls}>
              <h2 className={sectionTitle}>Objetivos</h2>

              <div>
                <label className={labelCls}>Objetivo principal</label>
                <textarea
                  rows={3}
                  placeholder="Ej: Cerrar 2 clientes nuevos por mes en el segmento PyME de manufactura en Jalisco..."
                  value={form.main_objective}
                  onChange={e => setField('main_objective', e.target.value)}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </section>

          </div>

          {/* ── Save button ──────────────────────────────────────────── */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2.5 bg-purple text-white rounded-[11px] px-7 py-3.5 text-[15px] font-semibold shadow-cta transition-all duration-150 hover:bg-purple-hover hover:-translate-y-px hover:shadow-cta-hover active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {saving ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Guardando...
                </>
              ) : (
                'Guardar configuración'
              )}
            </button>
          </div>

        </div>
      </div>

      <Toast toast={toast} onDismiss={dismissToast} />
    </>
  )
}
