import { NextRequest, NextResponse } from 'next/server'
import { getTenantContext, updateTenantContext } from '@/lib/db/tenant-context'
import type { TenantContextUpdate } from '@/types'

export async function GET(req: NextRequest) {
  const org_id = req.nextUrl.searchParams.get('org_id')
  if (!org_id) {
    return NextResponse.json({ error: 'org_id is required' }, { status: 400 })
  }

  try {
    const data = await getTenantContext(org_id)
    return NextResponse.json(data ?? null)
  } catch (err) {
    console.error('[GET /api/settings]', err)
    return NextResponse.json({ error: 'Failed to load settings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  let body: { org_id?: string } & TenantContextUpdate

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { org_id, ...data } = body

  if (!org_id) {
    return NextResponse.json({ error: 'org_id is required' }, { status: 400 })
  }
  if (!data.basic_info?.name?.trim()) {
    return NextResponse.json({ error: 'Nombre de empresa es obligatorio' }, { status: 422 })
  }
  if (!data.basic_info?.description?.trim()) {
    return NextResponse.json({ error: 'Descripción es obligatoria' }, { status: 422 })
  }
  if (!Array.isArray(data.products) || data.products.length === 0) {
    return NextResponse.json({ error: 'Agrega al menos un producto' }, { status: 422 })
  }

  try {
    const saved = await updateTenantContext(org_id, data)
    return NextResponse.json(saved)
  } catch (err) {
    console.error('[POST /api/settings]', err)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
