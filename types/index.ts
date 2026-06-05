// ---------------------------------------------------------------------------
// Tenant context (persisted in tenant_context Postgres table)
// ---------------------------------------------------------------------------

export type TenantContextBasicInfo = {
  name?: string
  description?: string
  tone_of_voice?: string
}

export type TenantContextMarket = {
  target_audience?: string
  pain_points?: string[]
}

export type TenantContextProduct = {
  name: string
  description: string
  price: string | number
}

export type TenantContextGoals = {
  main_objective?: string
}

export type TenantContext = {
  org_id: string
  basic_info: TenantContextBasicInfo
  market: TenantContextMarket
  products: TenantContextProduct[]
  goals: TenantContextGoals
  updated_at: Date | null
}

/** Partial update — all fields optional except org_id (passed separately) */
export type TenantContextUpdate = Partial<Omit<TenantContext, 'org_id' | 'updated_at'>>

// ---------------------------------------------------------------------------
// Agent / tenant config (loaded from config/clients/*.json)
// ---------------------------------------------------------------------------

export type Mode = {
  id: string
  label: string
  description: string
  systemPromptSuffix: string
}

export type AgentConfig = {
  id: string
  systemPromptFile: string
  skillsDir: string
  availableModes: Mode[]
}

export type TenantConfig = {
  id: string
  name: string
  allowedEmails: string[]
  agent: AgentConfig
}

export type Message = {
  role: 'user' | 'assistant'
  content: string
}
