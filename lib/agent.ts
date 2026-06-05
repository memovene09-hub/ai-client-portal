import fs from 'fs'
import path from 'path'
import { TenantConfig } from '@/types'
import Anthropic from '@anthropic-ai/sdk'

// ---------------------------------------------------------------------------
// Compiled-agent path
// ---------------------------------------------------------------------------

interface CompiledSkill {
  id: string
  name: string
  content: string
}

interface CompiledMode {
  id: string
  label: string
  suffix: string
}

interface CompiledAgent {
  id: string
  version: string
  compiled_at: string
  system_prompt_base: string
  context: string
  skills: CompiledSkill[]
  modes: CompiledMode[]
}

export function buildSystemPromptFromCompiled(agentId: string, modeId: string): string {
  const compiledPath = path.join(process.cwd(), 'agents', agentId, 'compiled.json')

  if (!fs.existsSync(compiledPath)) {
    throw new Error(`Agent [${agentId}] not compiled. Run: npm run compile-agents`)
  }

  const compiled: CompiledAgent = JSON.parse(fs.readFileSync(compiledPath, 'utf-8'))

  const mode = compiled.modes.find(m => m.id === modeId)
  const modeSuffix = mode?.suffix ?? ''

  const skillsBlock = compiled.skills.map(s => s.content).join('\n\n---\n\n')

  return [
    compiled.system_prompt_base,
    compiled.context ? `\n\n${compiled.context}` : '',
    skillsBlock ? `\n\n## Skills cargados\n\n${skillsBlock}` : '',
    modeSuffix ? `\n\n## Instrucción de modo activo\n\n${modeSuffix}` : '',
  ].join('')
}

// ---------------------------------------------------------------------------
// Legacy path (file-based, reads source files directly)
// ---------------------------------------------------------------------------

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
