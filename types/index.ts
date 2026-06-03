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
