/**
 * Clawdbot Configuration Generator
 * Generates JSON5 config files for each client's Clawdbot instance
 */

export interface ClawdbotConfig {
  agents: {
    defaults: {
      workspace: string;
      identity?: string;
      systemPrompt?: string;
    };
  };
  channels: {
    whatsapp?: {
      allowFrom?: string[];
      groups?: Record<string, {
        requireMention?: boolean;
      }>;
    };
  };
  voice?: {
    enabled: boolean;
    provider: string;
    language: string;
  };
}

/**
 * Generate Clawdbot config for a client instance
 */
export function generateClawdbotConfig(params: {
  clientId: number;
  businessName: string;
  whatsappNumber?: string;
  assistantName?: string;
  assistantPersonality?: string;
}): ClawdbotConfig {
  const { clientId, businessName, whatsappNumber, assistantName, assistantPersonality } = params;

  // Default Mexican Spanish system prompt
  const defaultSystemPrompt = `Eres ${assistantName || 'SYNTHIA'}, una asistente de inteligencia artificial especializada en ayudar a emprendedoras mexicanas.

Tu rol es asistir a ${businessName} con:
- Gestión de clientes y agenda
- Diseño de marca y materiales visuales
- Respuestas rápidas y profesionales
- Automatización de tareas repetitivas

Personalidad: ${assistantPersonality || 'Profesional, amigable, y siempre dispuesta a ayudar. Usas un tono cálido pero respetuoso, apropiado para el contexto de negocios mexicano.'}

Instrucciones importantes:
- Siempre responde en español mexicano (es-MX)
- Usa "usted" en contextos formales y "tú" cuando el cliente lo prefiera
- Sé concisa pero completa en tus respuestas
- Si no estás segura de algo, admítelo y ofrece buscar la información
- Mantén un tono profesional pero cercano
- Respeta los horarios de negocio mexicanos (9am-6pm hora de México)
- Conoce las festividades mexicanas importantes`;

  const config: ClawdbotConfig = {
    agents: {
      defaults: {
        workspace: `~/clawdbot-instances/client-${clientId}`,
        identity: assistantName || `SYNTHIA para ${businessName}`,
        systemPrompt: defaultSystemPrompt,
      },
    },
    channels: {
      whatsapp: {
        // If whatsappNumber is provided, restrict to that number
        ...(whatsappNumber && {
          allowFrom: [whatsappNumber],
        }),
        groups: {
          "*": {
            requireMention: true, // Require @mention in groups
          },
        },
      },
    },
    voice: {
      enabled: true,
      provider: "elevenlabs",
      language: "es-MX", // Mexican Spanish
    },
  };

  return config;
}

/**
 * Convert config object to JSON5 string
 */
export function configToJSON5(config: ClawdbotConfig): string {
  // JSON5 allows comments and trailing commas
  // For simplicity, we'll use regular JSON with pretty printing
  return JSON.stringify(config, null, 2);
}

/**
 * Get workspace path for a client instance
 */
export function getInstanceWorkspace(clientId: number): string {
  return `/home/ubuntu/clawdbot-instances/client-${clientId}`;
}

/**
 * Get config file path for a client instance
 */
export function getInstanceConfigPath(clientId: number): string {
  return `${getInstanceWorkspace(clientId)}/clawdbot.json`;
}

/**
 * Generate complete config file content for a client
 */
export function generateConfigFile(params: {
  clientId: number;
  businessName: string;
  whatsappNumber?: string;
  assistantName?: string;
  assistantPersonality?: string;
}): string {
  const config = generateClawdbotConfig(params);
  return configToJSON5(config);
}
