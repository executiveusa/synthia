/**
 * HERALD™ Semantic Intent Router
 * Routes plain-language intents to the correct tool or sphere.
 * v1: keyword matching | v2: pgvector semantic search
 * Bead: ZTE-ONESHOT-001 | Emerald Tablets™ compliant
 */

import { z } from 'zod'
import { publicProcedure, router } from '../_core/trpc'

const TOOL_REGISTRY = [
  {
    id: 'social_media',
    name: 'Social Media Manager',
    description: 'Create and schedule social media content',
    keywords: ['social','instagram','tiktok','contenido','publicar','post','redes','linkedin','twitter','reels'],
    defaultSphere: 'dra-cultura',
  },
  {
    id: 'revenue',
    name: 'Revenue Agent',
    description: 'Income analysis and revenue opportunities',
    keywords: ['ingreso','revenue','dinero','ventas','precio','cobrar','factura','pago','monetizar','ganar'],
    defaultSphere: 'dr-economia',
  },
  {
    id: 'research',
    name: 'Research Agent',
    description: 'Market research and competitive analysis',
    keywords: ['investigar','analizar','competencia','mercado','research','datos','tendencia','estadística'],
    defaultSphere: 'cazadora',
  },
  {
    id: 'deploy',
    name: 'Deploy Agent',
    description: 'Deploy and manage web properties',
    keywords: ['deploy','lanzar','publicar','sitio','web','dominio','vercel','hosting','servidor','código'],
    defaultSphere: 'ing-teknos',
  },
  {
    id: 'strategy',
    name: 'Strategy Agent',
    description: 'Business strategy and growth planning',
    keywords: ['estrategia','crecer','escalar','plan','negocio','latam','mercado','expansión','modelo'],
    defaultSphere: 'alex',
  },
  {
    id: 'sales',
    name: 'Sales Agent',
    description: 'Sales strategy and client conversion',
    keywords: ['vender','cliente','cerrar','deal','propuesta','oferta','cotización','contrato','convencer'],
    defaultSphere: 'seductora',
  },
]

function routeByKeyword(intent: string) {
  const lower = intent.toLowerCase()
  let best = { tool: TOOL_REGISTRY[0]!, score: 0 }
  for (const tool of TOOL_REGISTRY) {
    const score = tool.keywords.filter(k => lower.includes(k)).length
    if (score > best.score) best = { tool, score }
  }
  return {
    tool_id: best.tool.id,
    tool_name: best.tool.name,
    default_sphere: best.tool.defaultSphere,
    confidence: best.score > 0 ? Math.min(0.5 + best.score * 0.15, 0.95) : 0.3,
    routing_method: 'keyword_v1',
  }
}

export const heraldRouter = router({
  tools: publicProcedure.query(() => TOOL_REGISTRY),

  dispatch: publicProcedure
    .input(z.object({
      intent: z.string().min(1).max(1000),
      agent_id: z.string().default('synthia'),
      session_id: z.string().optional(),
      execute: z.boolean().default(false),
    }))
    .mutation(async ({ input }) => {
      const route = routeByKeyword(input.intent)
      return {
        route,
        intent: input.intent,
        agent_id: input.agent_id,
        timestamp: new Date().toISOString(),
      }
    }),
})
