import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as db from "./db";
import * as clawdbotManager from "./clawdbot-manager";
import { notifyOwner } from "./_core/notification";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ 
      code: 'FORBIDDEN',
      message: 'Solo administradores pueden acceder a este recurso' 
    });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Client Management
  clients: router({
    // Get all clients (admin only)
    list: adminProcedure.query(async () => {
      const clients = await db.getAllClients();
      return clients;
    }),

    // Get single client by ID
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const client = await db.getClientById(input.id);
        if (!client) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Cliente no encontrado' });
        }
        return client;
      }),

    // Create new client
    create: adminProcedure
      .input(z.object({
        businessName: z.string().min(1),
        ownerName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        whatsappNumber: z.string().optional(),
        businessDescription: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Check if email already exists
        const existing = await db.getClientByEmail(input.email);
        if (existing) {
          throw new TRPCError({ 
            code: 'CONFLICT', 
            message: 'Ya existe un cliente con este correo electrónico' 
          });
        }

        const result = await db.createClient({
          ...input,
          status: "pending",
          onboardingCompleted: false,
        });

        const clientId = Number(result[0].insertId);

        // Notify owner about new client signup
        await notifyOwner({
          title: "🎉 Nuevo Cliente Registrado - SYNTHIA™",
          content: `**Nuevo cliente registrado en SYNTHIA™**\n\n` +
            `**Negocio:** ${input.businessName}\n` +
            `**Propietario:** ${input.ownerName}\n` +
            `**Email:** ${input.email}\n` +
            `**Teléfono:** ${input.phone}\n` +
            `${input.whatsappNumber ? `**WhatsApp:** ${input.whatsappNumber}\n` : ''}` +
            `${input.businessDescription ? `**Descripción:** ${input.businessDescription}\n` : ''}` +
            `\n**ID Cliente:** ${clientId}\n` +
            `**Fecha:** ${new Date().toLocaleString('es-MX')}`,
        });

        // Log notification
        await db.logNotification({
          type: "signup",
          clientId,
          title: "Nuevo Cliente Registrado",
          content: `${input.businessName} (${input.ownerName})`,
          sentTo: "owner",
          status: "sent",
        });

        return { success: true, clientId };
      }),

    // Update client status
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["active", "paused", "cancelled", "pending"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateClientStatus(input.id, input.status);
        return { success: true };
      }),

    // Get dashboard stats
    stats: adminProcedure.query(async () => {
      const stats = await db.getDashboardStats();
      return stats;
    }),
  }),

  // Subscription Management
  subscriptions: router({
    // Get subscription by client ID
    getByClientId: adminProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        const subscription = await db.getSubscriptionByClientId(input.clientId);
        return subscription;
      }),

    // Get all active subscriptions
    listActive: adminProcedure.query(async () => {
      const subscriptions = await db.getAllActiveSubscriptions();
      return subscriptions;
    }),

    // Create subscription
    create: adminProcedure
      .input(z.object({
        clientId: z.number(),
        tier: z.enum(["basico", "profesional", "empresarial"]),
        priceMonthly: z.string(),
        currentPeriodStart: z.date(),
        currentPeriodEnd: z.date(),
      }))
      .mutation(async ({ input }) => {
        const result = await db.createSubscription({
          ...input,
          currency: "MXN",
          status: "active",
          cancelAtPeriodEnd: false,
        });

        const subscriptionId = Number(result[0].insertId);

        // Get client details for notification
        const client = await db.getClientById(input.clientId);
        if (client) {
          // Notify owner about new subscription
          await notifyOwner({
            title: "💳 Nueva Suscripción - SYNTHIA™",
            content: `**Nueva suscripción activada**\n\n` +
              `**Cliente:** ${client.businessName}\n` +
              `**Plan:** ${input.tier.charAt(0).toUpperCase() + input.tier.slice(1)}\n` +
              `**Precio:** $${input.priceMonthly} MXN/mes\n` +
              `**Periodo:** ${input.currentPeriodStart.toLocaleDateString('es-MX')} - ${input.currentPeriodEnd.toLocaleDateString('es-MX')}\n` +
              `\n**ID Suscripción:** ${subscriptionId}\n` +
              `**Fecha:** ${new Date().toLocaleString('es-MX')}`,
          });

          // Log notification
          await db.logNotification({
            type: "upgrade",
            clientId: input.clientId,
            title: "Nueva Suscripción Activada",
            content: `${client.businessName} - Plan ${input.tier}`,
            sentTo: "owner",
            status: "sent",
          });
        }

        return { success: true, subscriptionId };
      }),

    // Update subscription status
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["active", "past_due", "cancelled", "trialing"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateSubscriptionStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // Clawdbot Instance Management
  instances: router({
    // Get instance by client ID
    getByClientId: adminProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        const instance = await db.getClawdbotInstanceByClientId(input.clientId);
        return instance;
      }),

    // Create new instance
    create: adminProcedure
      .input(z.object({
        clientId: z.number(),
        instanceName: z.string(),
        configPath: z.string(),
      }))
      .mutation(async ({ input }) => {
        const result = await db.createClawdbotInstance({
          ...input,
          status: "stopped",
        });

        return { success: true, instanceId: Number(result[0].insertId) };
      }),

    // Update instance status
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["running", "stopped", "pairing", "error"]),
        errorMessage: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateClawdbotInstanceStatus(input.id, input.status, input.errorMessage);
        return { success: true };
      }),

    // Update QR code for pairing
    updateQRCode: adminProcedure
      .input(z.object({
        id: z.number(),
        qrCode: z.string(),
      }))
      .mutation(async ({ input }) => {
        await db.updateClawdbotQRCode(input.id, input.qrCode);
        return { success: true };
      }),
  }),

  // Payment Management
  payments: router({
    // Get payments by client ID
    getByClientId: adminProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        const payments = await db.getPaymentsByClientId(input.clientId);
        return payments;
      }),

    // Create payment
    create: adminProcedure
      .input(z.object({
        clientId: z.number(),
        subscriptionId: z.number().optional(),
        amount: z.string(),
        paymentMethod: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await db.createPayment({
          ...input,
          currency: "MXN",
          status: "pending",
        });

        return { success: true, paymentId: Number(result[0].insertId) };
      }),

    // Update payment status
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "completed", "failed", "refunded"]),
        failureReason: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updatePaymentStatus(input.id, input.status, input.failureReason);
        return { success: true };
      }),
  }),

  // Client Assets Management
  assets: router({
    // Get assets by client ID
    getByClientId: adminProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        const assets = await db.getClientAssetByClientId(input.clientId);
        return assets;
      }),

    // Create or update client assets
    upsert: adminProcedure
      .input(z.object({
        clientId: z.number(),
        logoUrl: z.string().optional(),
        logoS3Key: z.string().optional(),
        primaryColor: z.string().optional(),
        secondaryColor: z.string().optional(),
        accentColor: z.string().optional(),
        assistantName: z.string().optional(),
        assistantPersonality: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const existing = await db.getClientAssetByClientId(input.clientId);
        
        if (existing) {
          await db.updateClientAsset(input.clientId, input);
        } else {
          await db.createClientAsset(input);
        }

        return { success: true };
      }),
  }),

  // Clawdbot Management
  clawdbot: router({
    // Initialize instance for a client
    initialize: adminProcedure
      .input(z.object({
        clientId: z.number(),
        businessName: z.string(),
        whatsappNumber: z.string().optional(),
        assistantName: z.string().optional(),
        assistantPersonality: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // Initialize workspace
        await clawdbotManager.initializeInstanceWorkspace(input.clientId);
        
        // Write config file
        const configPath = await clawdbotManager.writeInstanceConfig(input);
        
        // Create instance record in database
        const instanceName = `synthia-client-${input.clientId}`;
        await db.createClawdbotInstance({
          clientId: input.clientId,
          instanceName,
          configPath,
          status: "stopped",
        });
        
        return { success: true, configPath };
      }),

    // Start instance
    start: adminProcedure
      .input(z.object({ clientId: z.number() }))
      .mutation(async ({ input }) => {
        const result = await clawdbotManager.startInstance(input.clientId);
        
        if (result.success) {
          const instance = await db.getClawdbotInstanceByClientId(input.clientId);
          if (instance) {
            await db.updateClawdbotInstanceStatus(instance.id, "running");
          }
        }
        
        return result;
      }),

    // Stop instance
    stop: adminProcedure
      .input(z.object({ clientId: z.number() }))
      .mutation(async ({ input }) => {
        const result = await clawdbotManager.stopInstance(input.clientId);
        
        if (result.success) {
          const instance = await db.getClawdbotInstanceByClientId(input.clientId);
          if (instance) {
            await db.updateClawdbotInstanceStatus(instance.id, "stopped");
          }
        }
        
        return result;
      }),

    // Generate QR code for pairing
    generateQR: adminProcedure
      .input(z.object({ clientId: z.number() }))
      .mutation(async ({ input }) => {
        const result = await clawdbotManager.generatePairingQRCode(input.clientId);
        
        if (result.success && result.qrCode) {
          const instance = await db.getClawdbotInstanceByClientId(input.clientId);
          if (instance) {
            await db.updateClawdbotQRCode(instance.id, result.qrCode);
          }
        }
        
        return result;
      }),

    // Health check
    healthCheck: adminProcedure
      .input(z.object({ clientId: z.number() }))
      .query(async ({ input }) => {
        const result = await clawdbotManager.healthCheck(input.clientId);
        return result;
      }),
  }),

  // Usage Analytics
  analytics: router({
    // Get usage analytics by client ID
    getByClientId: adminProcedure
      .input(z.object({ 
        clientId: z.number(),
        days: z.number().optional().default(30),
      }))
      .query(async ({ input }) => {
        const analytics = await db.getUsageAnalyticsByClientId(input.clientId, input.days);
        return analytics;
      }),

    // Record usage
    record: adminProcedure
      .input(z.object({
        clientId: z.number(),
        date: z.date(),
        messagesSent: z.number().optional().default(0),
        messagesReceived: z.number().optional().default(0),
        voiceMinutes: z.string().optional().default("0"),
        apiCalls: z.number().optional().default(0),
      }))
      .mutation(async ({ input }) => {
        await db.recordUsageAnalytics(input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
