import fs from 'fs'
import path from 'path'
import { TenantConfig } from '@/types'

export function getTenantConfig(tenantId: string): TenantConfig {
  const filePath = path.join(process.cwd(), 'config', 'clients', `${tenantId}.json`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as TenantConfig
}
