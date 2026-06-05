import fs from 'fs'
import path from 'path'

interface SkillEntry {
  id: string
  name: string
  content: string
}

interface ModeEntry {
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
  skills: SkillEntry[]
  modes: ModeEntry[]
}

const AGENTS_DIR = path.join(process.cwd(), 'agents')

function extractSkillName(content: string): string {
  const match = content.match(/^#\s+(?:Skill:\s+)?(.+)$/m)
  return match ? match[1].trim() : 'Unknown'
}

function extractVersion(agentDir: string): string {
  const manifestPath = path.join(agentDir, 'AGENT_MANIFEST.md')
  if (!fs.existsSync(manifestPath)) return '1.0.0'
  const manifest = fs.readFileSync(manifestPath, 'utf-8')
  const match = manifest.match(/version[:\s]+([0-9]+\.[0-9]+\.[0-9]+)/i)
  return match ? match[1] : '1.0.0'
}

function compileAgent(agentId: string): CompiledAgent {
  const agentDir = path.join(AGENTS_DIR, agentId)

  // Validate required files
  const claudePath = path.join(agentDir, 'CLAUDE.md')
  if (!fs.existsSync(claudePath)) {
    throw new Error(`Agent [${agentId}] missing CLAUDE.md`)
  }

  const modesPath = path.join(agentDir, 'MODES.json')
  if (!fs.existsSync(modesPath)) {
    throw new Error(`Agent [${agentId}] missing MODES.json — create it to define mode suffixes`)
  }

  // system_prompt_base
  const systemPromptBase = fs.readFileSync(claudePath, 'utf-8')

  // context — look for ClaryonContext.md first, then any *Context.md
  let context = ''
  const contextPrimary = path.join(agentDir, 'ClaryonContext.md')
  if (fs.existsSync(contextPrimary)) {
    context = fs.readFileSync(contextPrimary, 'utf-8')
  } else {
    const fallback = fs.readdirSync(agentDir).find(f => f.endsWith('Context.md'))
    if (fallback) {
      context = fs.readFileSync(path.join(agentDir, fallback), 'utf-8')
      console.warn(`  ⚠  [${agentId}] using ${fallback} as context`)
    } else {
      console.warn(`  ⚠  [${agentId}] no context file found — context will be empty`)
    }
  }

  // skills — sorted alphabetically so order is deterministic
  const skillsDir = path.join(agentDir, 'skills')
  const skills: SkillEntry[] = []
  if (fs.existsSync(skillsDir)) {
    const files = fs.readdirSync(skillsDir).filter(f => f.endsWith('.md')).sort()
    for (const file of files) {
      const content = fs.readFileSync(path.join(skillsDir, file), 'utf-8')
      skills.push({
        id: file.replace(/\.md$/, ''),
        name: extractSkillName(content),
        content,
      })
    }
  }

  // modes
  const modesRaw = JSON.parse(fs.readFileSync(modesPath, 'utf-8')) as { modes: ModeEntry[] }
  if (!Array.isArray(modesRaw.modes) || modesRaw.modes.length === 0) {
    throw new Error(`Agent [${agentId}] MODES.json has no modes defined`)
  }

  return {
    id: agentId,
    version: extractVersion(agentDir),
    compiled_at: new Date().toISOString(),
    system_prompt_base: systemPromptBase,
    context,
    skills,
    modes: modesRaw.modes,
  }
}

function main() {
  if (!fs.existsSync(AGENTS_DIR)) {
    console.error('❌  agents/ directory not found')
    process.exit(1)
  }

  const agentDirs = fs.readdirSync(AGENTS_DIR).filter(entry => {
    const full = path.join(AGENTS_DIR, entry)
    return fs.statSync(full).isDirectory()
  })

  if (agentDirs.length === 0) {
    console.log('No agents found in agents/')
    return
  }

  let failed = false

  for (const agentId of agentDirs) {
    try {
      const compiled = compileAgent(agentId)
      const outPath = path.join(AGENTS_DIR, agentId, 'compiled.json')
      fs.writeFileSync(outPath, JSON.stringify(compiled, null, 2), 'utf-8')
      console.log(
        `[✓] ${agentId} compiled — ${compiled.skills.length} skills, ${compiled.modes.length} modes (v${compiled.version})`
      )
    } catch (err) {
      console.error(`[✗] ${agentId}: ${(err as Error).message}`)
      failed = true
    }
  }

  if (failed) process.exit(1)
}

main()
