'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Check, X, Loader2 } from 'lucide-react'
import type { TenantContextProduct } from '@/types'

// ---------------------------------------------------------------------------
// Toast (inline — avoids a second file import for this sprint)
// ---------------------------------------------------------------------------

type ToastVariant = 'success' | 'error'
type ToastState = { message: string; variant: ToastVariant } | null

function Toast({ toast, onDismiss }: { toast: ToastState; onDismiss: () => void }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onDismiss, 3000)
    return () => clearTimeout(t)
  }, [toast, onDismiss])

  if (!toast) return null

  const isSuccess = toast.variant === 'success'
  return (
    <div
      role="alert"
      className={[
        'fixed top-4 right-4 z-50',
        'flex items-center gap-2 p-4 rounded-md',
        'text-sm font-medium text-white',
        isSuccess ? 'bg-[#22c55e]' : 'bg-[#ef4444]',
      ].join(' ')}
    >
      {isSuccess ? <Check className="w-4 h-4 flex-none" /> : <X className="w-4 h-4 flex-none" />}
      {toast.message}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ORG_ID = 'claryon-demo'

const emptyProduct = (): TenantContextProduct => ({ name: '', description: '', price: '' })

// ---------------------------------------------------------------------------
// Shared style tokens
// ---------------------------------------------------------------------------

const inputBase =
  'w-full bg-[#1C1C1C] border border-[#1E2D5A] text-white placeholder-gray-500 ' +
  'px-4 py-2 rounded-md text-sm ' +
  'focus:outline-none focus:border-[#8B35A8] focus:ring-1 focus:ring-[#8B35A8] ' +
  'transition-[border-color,box-shadow] duration-150'

// Red border + red ring; overrides focus colors when field is invalid
const inputErr = 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]'

const labelBase = 'block mb-2 text-sm font-medium text-white'

// Helper: returns className for a field wrapper to keep spacing consistent
const fieldCls = 'my-4'

// ---------------------------------------------------------------------------
// Form state
// ---------------------------------------------------------------------------

type FormState = {
  name: string
  description: string
  tone_of_voice: string
  target_audience: string
  pain_points: string
  products: TenantContextProduct[]
  main_objective: string
}

type FormErrors = Partial<Record<keyof FormState | 'products_min', string>>

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
// Page
// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(defaultForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastState>(null)

  const dismissToast = useCallback(() => setToast(null), [])

  // ── Load saved context ────────────────────────────────────────────────────

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
      .catch(() => { /* first time — start empty */ })
      .finally(() => setLoading(false))
  }, [])

  // ── Field helpers ─────────────────────────────────────────────────────────

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }))
  }

  function setProduct(index: number, field: keyof TenantContextProduct, value: string) {
    setForm(prev => ({
      ...prev,
      products: prev.products.map((p, i) => i === index ? { ...p, [field]: value } : p),
    }))
    if (errors.products_min) setErrors(prev => ({ ...prev, products_min: undefined }))
  }

  function addProduct() {
    setForm(prev => ({ ...prev, products: [...prev.products, emptyProduct()] }))
  }

  function removeProduct(index: number) {
    setForm(prev => ({ ...prev, products: prev.products.filter((_, i) => i !== index) }))
  }

  // ── Validation ────────────────────────────────────────────────────────────

  function validate(): boolean {
    const next: FormErrors = {}
    if (!form.name.trim())        next.name = 'Nombre de empresa es obligatorio'
    if (!form.description.trim()) next.description = 'Descripción es obligatoria'
    if (!form.products.some(p => p.name.trim()))
      next.products_min = 'Agrega al menos un producto con nombre'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  // ── Submit ────────────────────────────────────────────────────────────────

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
            pain_points: form.pain_points.split('\n').map(l => l.trim()).filter(Boolean),
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

  // ── Loading state ─────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-[#CBD5E1] text-sm">
        Cargando configuración...
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Page wrapper ───────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto py-8 px-6">

        {/* ── Page header ──────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">
            Configuración de la empresa
          </h1>
          <p className="text-sm text-[#CBD5E1]">
            Actualiza la información para que nuestros agentes entiendan tu negocio y entreguen mejores resultados.
          </p>
        </div>

        {/* ── Main card ────────────────────────────────────────────────── */}
        <div className="bg-[#1C1C1C] border border-[#1E2D5A] rounded-lg p-8">

          {/* ── Sección 1 — Información básica ───────────────────────── */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              Información básica
            </h2>

            {/* Nombre */}
            <div className={fieldCls}>
              <label className={labelBase}>
                Nombre de empresa <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Distribuidora Zapopan S.A."
                value={form.name}
                onChange={e => setField('name', e.target.value)}
                aria-invalid={!!errors.name}
                className={`${inputBase} ${errors.name ? inputErr : ''}`}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-[#ef4444]">{errors.name}</p>
              )}
            </div>

            {/* Descripción */}
            <div className={fieldCls}>
              <label className={labelBase}>
                Descripción <span className="text-[#ef4444]">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Qué hace la empresa, cómo opera, a quién atiende..."
                value={form.description}
                onChange={e => setField('description', e.target.value)}
                aria-invalid={!!errors.description}
                className={`${inputBase} resize-none ${errors.description ? inputErr : ''}`}
              />
              {errors.description && (
                <p className="mt-1 text-xs text-[#ef4444]">{errors.description}</p>
              )}
            </div>

            {/* Tone of voice */}
            <div className={fieldCls}>
              <label className={labelBase}>Tone of voice</label>
              <input
                type="text"
                placeholder="Ej: casual, divertido, accesible"
                value={form.tone_of_voice}
                onChange={e => setField('tone_of_voice', e.target.value)}
                className={inputBase}
              />
            </div>
          </section>

          {/* ── Sección 2 — Mercado ──────────────────────────────────── */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Mercado</h2>

            {/* Audiencia objetivo */}
            <div className={fieldCls}>
              <label className={labelBase}>Audiencia objetivo</label>
              <textarea
                rows={2}
                placeholder="Ej: Dueños de PyMEs en Guadalajara con 10–50 empleados..."
                value={form.target_audience}
                onChange={e => setField('target_audience', e.target.value)}
                className={`${inputBase} resize-none`}
              />
            </div>

            {/* Pain points */}
            <div className={fieldCls}>
              <label className={labelBase}>
                Pain points{' '}
                <span className="text-[#CBD5E1] font-normal">(uno por línea)</span>
              </label>
              <textarea
                rows={4}
                placeholder={
                  'Procesos manuales que consumen mucho tiempo\n' +
                  'Falta de visibilidad sobre el negocio\n' +
                  'Dificultad para escalar sin caos'
                }
                value={form.pain_points}
                onChange={e => setField('pain_points', e.target.value)}
                className={`${inputBase} resize-none font-mono`}
              />
            </div>
          </section>

          {/* ── Sección 3 — Productos ────────────────────────────────── */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              Productos / Servicios <span className="text-[#ef4444]">*</span>
            </h2>

            {/* Table */}
            <div className="mt-4 bg-[#1C1C1C] border border-[#1E2D5A] rounded-lg overflow-hidden">
              {/* Header */}
              <div className="flex bg-[#1E2D5A] text-white font-semibold text-sm px-4 py-3">
                <span className="flex-1">Nombre</span>
                <span className="flex-[2]">Descripción</span>
                <span className="flex-1">Precio</span>
                <span className="w-20" />
              </div>

              {/* Rows */}
              {form.products.map((product, i) => (
                <div
                  key={i}
                  className="flex items-center border-t border-[#1E2D5A] px-4 py-3 gap-3"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Nombre"
                      value={product.name}
                      onChange={e => setProduct(i, 'name', e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div className="flex-[2]">
                    <input
                      type="text"
                      placeholder="Descripción breve"
                      value={product.description}
                      onChange={e => setProduct(i, 'description', e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="$0 MXN"
                      value={String(product.price)}
                      onChange={e => setProduct(i, 'price', e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div className="w-20 flex justify-center">
                    <button
                      type="button"
                      onClick={() => removeProduct(i)}
                      title="Eliminar"
                      className="text-[#ef4444] hover:text-[#dc2626] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Error message */}
            {errors.products_min && (
              <p className="mt-1 text-xs text-[#ef4444]">{errors.products_min}</p>
            )}

            {/* Add product button */}
            <button
              type="button"
              onClick={addProduct}
              className="mt-3 flex items-center gap-1 text-sm font-medium text-[#8B35A8] hover:text-[#B8A8D4] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Agregar producto
            </button>
          </section>

          {/* ── Sección 4 — Objetivo ─────────────────────────────────── */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Objetivo</h2>

            <div className="my-4">
              <label className={labelBase}>Objetivo principal</label>
              <textarea
                rows={3}
                placeholder="Ej: Cerrar 2 clientes nuevos por mes en el segmento PyME de manufactura en Jalisco..."
                value={form.main_objective}
                onChange={e => setField('main_objective', e.target.value)}
                className={`${inputBase} resize-none`}
              />
            </div>
          </section>

          {/* ── Botones ──────────────────────────────────────────────── */}
          <div className="mt-8 pt-8 border-t border-[#1E2D5A] flex flex-row-reverse gap-4">
            {/* Guardar */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-[#8B35A8] text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-[#B8A8D4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>

            {/* Cancelar */}
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 rounded-md text-sm font-medium text-[#8B35A8] hover:bg-[#1E2D5A] transition-colors"
            >
              Cancelar
            </button>
          </div>

        </div>
      </div>

      <Toast toast={toast} onDismiss={dismissToast} />
    </>
  )
}
