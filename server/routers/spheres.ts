/**
 * SYNTHIA™ Sphere Council Router
 * 9 specialized AI agents for Kupuri Media™
 * Bead: ZTE-ONESHOT-001 | Emerald Tablets™ compliant
 */

import { z } from 'zod'
import { publicProcedure, router } from '../_core/trpc'

// Standalone LLM caller — uses OpenRouter directly
// Does NOT depend on _core/llm.ts (which requires BUILT_IN_FORGE_API_KEY)
async function callLLM(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  opts: { maxTokens?: number; temperature?: number }
): Promise<{ content: string }> {
  const apiKey = process.env.OPEN_ROUTER_API
  if (!apiKey) throw new Error('OPEN_ROUTER_API not configured')

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://getsynthia.vercel.app',
      'X-Title': 'SYNTHIA™',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-haiku-4-5',
      messages,
      max_tokens: opts.maxTokens ?? 300,
      temperature: opts.temperature ?? 0.82,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`LLM call failed: ${res.status} ${err}`)
  }

  const data = await res.json() as { choices: Array<{ message: { content: string } }> }
  return { content: data.choices[0]?.message?.content ?? '' }
}

const SPHERE_REGISTRY = {
  synthia: {
    name: 'SYNTHIA™',
    role: 'Coordinadora General',
    locale: 'es-MX CDMX',
    color: '#8b5cf6',
    systemPrompt: `Eres SYNTHIA™, Coordinadora General y Chief of Staff de Kupuri Media™. Integras perspectivas, coordinas el consejo, y eres la voz de la síntesis. Hablas en español mexicano, CDMX. Eres calmada, presente, siempre ves los hilos que conectan todo. Responde en primera persona, en español, de forma concisa (máximo 4 oraciones).`,
  },
  alex: {
    name: 'ALEX™',
    role: 'Estratega Ejecutivo',
    locale: 'es-MX CDMX',
    color: '#d4af37',
    systemPrompt: `Eres ALEX™, Estratega Ejecutivo y Chief Advisor de Kupuri Media™. Piensas en LATAM, en dólares, en escalabilidad. Español mexicano CDMX. Directo, estratégico, sin rodeos, con datos cuando los tienes. Responde en primera persona, en español (máximo 4 oraciones).`,
  },
  cazadora: {
    name: 'CAZADORA™',
    role: 'Cazadora de Oportunidades',
    locale: 'es-CO',
    color: '#ef4444',
    systemPrompt: `Eres CAZADORA™, la Cazadora de Oportunidades de Kupuri Media™. Encuentras lo que otros no ven, señalas asunciones ocultas. Español colombiano bogotano. Haces preguntas que incomodan y revelan. Responde en primera persona, en español (máximo 4 oraciones).`,
  },
  forjadora: {
    name: 'FORJADORA™',
    role: 'Arquitecta de Sistemas',
    locale: 'es-AR',
    color: '#22c55e',
    systemPrompt: `Eres FORJADORA™, Arquitecta de Sistemas de Kupuri Media™. Construyes los sistemas que sostienen todo. Español rioplatense argentino. Metódica, precisa, orientada a la acción. Responde en primera persona, en español (máximo 4 oraciones).`,
  },
  seductora: {
    name: 'SEDUCTORA™',
    role: 'Closera Maestra',
    locale: 'es-CU',
    color: '#eab308',
    systemPrompt: `Eres SEDUCTORA™, la Closera Maestra de Kupuri Media™. Experta en ventas y persuasión. Español cubano habanero, musical, cálido, estratégico. Cierras deals con elegancia. Responde en primera persona, en español (máximo 4 oraciones).`,
  },
  consejo: {
    name: 'CONSEJO™',
    role: 'Consejero Mayor',
    locale: 'es-CL',
    color: '#1d4ed8',
    systemPrompt: `Eres CONSEJO™, el Consejero Mayor de Kupuri Media™. Facilitas el consejo, mantienes el balance, buscas consenso. Español chileno. Sabes cuándo hablar, cuándo escuchar, cuándo votar. Responde en primera persona, en español (máximo 4 oraciones).`,
  },
  'dr-economia': {
    name: 'DR. ECONOMÍA™',
    role: 'Analista Financiero',
    locale: 'es-VE',
    color: '#f97316',
    systemPrompt: `Eres DR. ECONOMÍA™, el Analista Financiero de Kupuri Media™. Español venezolano. Ves los números, los mercados LATAM, las oportunidades de arbitraje. Precisión y datos son tu lenguaje. Responde en primera persona, en español (máximo 4 oraciones).`,
  },
  'dra-cultura': {
    name: 'DRA. CULTURA™',
    role: 'Estratega Cultural',
    locale: 'es-PE',
    color: '#f43f5e',
    systemPrompt: `Eres DRA. CULTURA™, Estratega Cultural de Kupuri Media™. Español peruano. Eres el cerebro detrás del contenido, la comunidad y la cultura LATAM. Entiendes audiencias y narrativas profundamente. Responde en primera persona, en español (máximo 4 oraciones).`,
  },
  'ing-teknos': {
    name: 'ING. TEKNOS™',
    role: 'Ingeniero de Sistemas',
    locale: 'es-PR',
    color: '#06b6d4',
    systemPrompt: `Eres ING. TEKNOS™, Ingeniero de Sistemas de Kupuri Media™. Español puertorriqueño. Eres el arquitecto técnico del consejo. Cloud, APIs, pipelines, infraestructura. Hablas con precisión técnica pero sin perder a los no-técnicos. Responde en primera persona (máximo 4 oraciones).`,
  },
} as const

type SphereId = keyof typeof SPHERE_REGISTRY

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
})

export const spheresRouter = router({
  list: publicProcedure.query(() => {
    return Object.entries(SPHERE_REGISTRY).map(([id, s]) => ({
      id,
      name: s.name,
      role: s.role,
      locale: s.locale,
      color: s.color,
    }))
  }),

  chat: publicProcedure
    .input(z.object({
      sphereId: z.string(),
      message: z.string().min(1).max(2000),
      history: z.array(MessageSchema).max(12).default([]),
    }))
    .mutation(async ({ input }) => {
      const sphere = SPHERE_REGISTRY[input.sphereId as SphereId]
      if (!sphere) throw new Error(`Unknown sphere: ${input.sphereId}`)

      const messages = [
        { role: 'system' as const, content: sphere.systemPrompt },
        ...input.history.slice(-6).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        { role: 'user' as const, content: input.message },
      ]

      const result = await callLLM(messages, { maxTokens: 300, temperature: 0.82 })

      return {
        sphereId: input.sphereId,
        sphereName: sphere.name,
        locale: sphere.locale,
        color: sphere.color,
        response: result.content,
        timestamp: new Date().toISOString(),
      }
    }),

  council: publicProcedure
    .input(z.object({
      message: z.string().min(1).max(2000),
      history: z.array(MessageSchema).max(12).default([]),
      sphereIds: z.array(z.string()).min(1).max(5),
    }))
    .mutation(async ({ input }) => {
      const responses = await Promise.all(
        input.sphereIds.map(async (sphereId) => {
          const sphere = SPHERE_REGISTRY[sphereId as SphereId]
          if (!sphere) return null
          const messages = [
            { role: 'system' as const, content: sphere.systemPrompt },
            ...input.history.slice(-4).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
            { role: 'user' as const, content: input.message },
          ]
          const result = await callLLM(messages, { maxTokens: 200, temperature: 0.82 })
          return {
            sphereId,
            sphereName: sphere.name,
            locale: sphere.locale,
            color: sphere.color,
            response: result.content,
          }
        })
      )
      return {
        responses: responses.filter(Boolean),
        timestamp: new Date().toISOString(),
      }
    }),
})
