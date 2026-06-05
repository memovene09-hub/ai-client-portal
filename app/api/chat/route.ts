import { buildSystemPromptFromCompiled, createAnthropicClient } from '@/lib/agent'
import { getTenantConfig } from '@/lib/tenant'
import { Message } from '@/types'

export async function POST(req: Request) {
  const { messages, modeId, tenantId } = await req.json() as {
    messages: Message[]
    modeId: string
    tenantId: string
  }

  const tenant = getTenantConfig(tenantId)
  // TODO (Fase 2): drive agentId from tenant config instead of hardcoding
  const agentId = tenant.agent.id
  const systemPrompt = buildSystemPromptFromCompiled(agentId, modeId)
  const client = createAnthropicClient()

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001', // Modelo para testing, cambiar por el modelo definitivo
    max_tokens: 4096,
    system: systemPrompt,
    messages
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    }
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  })
}
