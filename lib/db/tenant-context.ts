import { eq } from 'drizzle-orm'
import { db } from './index'
import { tenantContext } from './schema'
import type { TenantContext, TenantContextUpdate } from '@/types'

export async function getTenantContext(org_id: string): Promise<TenantContext | null> {
  const rows = await db
    .select()
    .from(tenantContext)
    .where(eq(tenantContext.org_id, org_id))
    .limit(1)

  return rows[0] ? (rows[0] as TenantContext) : null
}

export async function updateTenantContext(
  org_id: string,
  data: TenantContextUpdate
): Promise<TenantContext> {
  const rows = await db
    .insert(tenantContext)
    .values({
      org_id,
      ...data,
      updated_at: new Date(),
    })
    .onConflictDoUpdate({
      target: tenantContext.org_id,
      set: {
        ...data,
        updated_at: new Date(),
      },
    })
    .returning()

  return rows[0] as TenantContext
}
