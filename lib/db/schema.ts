import { pgTable, text, jsonb, timestamp } from 'drizzle-orm/pg-core'

export const tenantContext = pgTable('tenant_context', {
  org_id:     text('org_id').primaryKey(),
  basic_info: jsonb('basic_info').notNull().default({}),
  market:     jsonb('market').notNull().default({}),
  products:   jsonb('products').notNull().default([]),
  goals:      jsonb('goals').notNull().default({}),
  updated_at: timestamp('updated_at').defaultNow(),
})
