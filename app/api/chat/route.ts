import { buildSystemPromptFromCompiled, createAnthropicClient } from '@/lib/agent'
import { getTenantConfig } from '@/lib/tenant'
import { Message } from '@/types'

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function POST(req: Request) {
  let tenantId: string
  let modeId: string
  let messages: Message[]

  try {
    const body = await req.json()
    tenantId = body.tenantId
    modeId = body.modeId
    messages = body.messages
    if (!tenantId || !modeId || !Array.isArray(messages)) {
      return jsonError('Missing required fields: tenantId, modeId, messages', 400)
    }
  } catch {
    return jsonError('Invalid JSON body', 400)
  }

  let systemPrompt: string
  try {
    const tenant = getTenantConfig(tenantId)
    const agentId = tenant.agent.id
    systemPrompt = await buildSystemPromptFromCompiled(tenantId, agentId, modeId)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (message.includes('not compiled')) {
      return jsonError(`Agent not compiled. Run: npm run compile-agents`, 503)
    }
    if (message.includes('no such file') || message.includes('ENOENT')) {
      return jsonError(`Tenant config not found: ${tenantId}`, 404)
    }
    console.error('[/api/chat] agent setup error:', message)
    return jsonError('Agent setup error', 500)
  }

  try {
    const client = createAnthropicClient()
    const stream = await client.messages.stream({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      system: systemPrompt,
      messages,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
        } catch {
          controller.error(new Error('Stream interrupted'))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(readable, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[/api/chat] LLM error:', message)

    if (message.includes('API key') || message.includes('auth')) {
      return jsonError('LLM authentication error — check ANTHROPIC_API_KEY', 502)
    }
    if (message.includes('rate') || message.includes('quota')) {
      return jsonError('LLM rate limit reached — try again in a moment', 429)
    }
    return jsonError('LLM service error', 502)
  }
}
