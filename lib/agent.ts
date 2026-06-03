import fs from 'fs'
import path from 'path'
import { TenantConfig, Message } from '@/types'
import Anthropic from '@anthropic-ai/sdk'

export function buildSystemPrompt(tenant: TenantConfig, modeId: string): string {
  const promptPath = path.join(process.cwd(), tenant.agent.systemPromptFile)
  const basePrompt = fs.readFileSync(promptPath, 'utf-8')

  const skillsDir = path.join(process.cwd(), tenant.agent.skillsDir)
  const skillFiles = fs.existsSync(skillsDir)
    ? fs.readdirSync(skillsDir).filter(f => f.endsWith('.md'))
    : []

  const skills = skillFiles
    .map(f => fs.readFileSync(path.join(skillsDir, f), 'utf-8'))
    .join('\n\n---\n\n')

  const mode = tenant.agent.availableModes.find(m => m.id === modeId)
  const modeSuffix = mode?.systemPromptSuffix ?? ''

  return [
    basePrompt,
    skills ? `\n\n## Skills cargados\n\n${skills}` : '',
    modeSuffix ? `\n\n## Instrucción de modo activo\n\n${modeSuffix}` : ''
  ].join('')
}

export function createAnthropicClient() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}
