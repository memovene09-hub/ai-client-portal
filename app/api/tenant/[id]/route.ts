import { NextRequest } from 'next/server'
import { getTenantConfig } from '@/lib/tenant'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const tenant = getTenantConfig(params.id)
  return Response.json(tenant)
}
