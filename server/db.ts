import { eq, desc, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  clients, 
  subscriptions, 
  clawdbotInstances, 
  payments, 
  clientAssets, 
  usageAnalytics,
  notificationLog,
  type Client,
  type Subscription,
  type ClawdbotInstance,
  type Payment,
  type ClientAsset,
  type InsertClient,
  type InsertSubscription,
  type InsertClawdbotInstance,
  type InsertPayment,
  type InsertClientAsset,
  type InsertUsageAnalytic,
  type InsertNotificationLog
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// CLIENT MANAGEMENT
// ============================================================================

export async function createClient(client: InsertClient) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(clients).values(client);
  return result;
}

export async function getAllClients() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(clients).orderBy(desc(clients.createdAt));
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getClientByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(clients).where(eq(clients.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateClientStatus(id: number, status: "active" | "paused" | "cancelled" | "pending") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(clients).set({ status }).where(eq(clients.id, id));
}

export async function updateClientOnboardingStatus(id: number, completed: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(clients).set({ onboardingCompleted: completed }).where(eq(clients.id, id));
}

// ============================================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================================

export async function createSubscription(subscription: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(subscriptions).values(subscription);
  return result;
}

export async function getSubscriptionByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(subscriptions)
    .where(eq(subscriptions.clientId, clientId))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllActiveSubscriptions() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(subscriptions)
    .where(eq(subscriptions.status, "active"))
    .orderBy(desc(subscriptions.createdAt));
}

export async function updateSubscriptionStatus(id: number, status: "active" | "past_due" | "cancelled" | "trialing") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(subscriptions).set({ status }).where(eq(subscriptions.id, id));
}

// ============================================================================
// CLAWDBOT INSTANCE MANAGEMENT
// ============================================================================

export async function createClawdbotInstance(instance: InsertClawdbotInstance) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(clawdbotInstances).values(instance);
  return result;
}

export async function getClawdbotInstanceByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(clawdbotInstances)
    .where(eq(clawdbotInstances.clientId, clientId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function updateClawdbotInstanceStatus(
  id: number, 
  status: "running" | "stopped" | "pairing" | "error",
  errorMessage?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { status, lastHealthCheck: new Date() };
  if (errorMessage !== undefined) {
    updateData.errorMessage = errorMessage;
  }

  await db.update(clawdbotInstances).set(updateData).where(eq(clawdbotInstances.id, id));
}

export async function updateClawdbotQRCode(id: number, qrCode: string, expiryMinutes: number = 60) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + expiryMinutes);

  await db.update(clawdbotInstances).set({ 
    qrCode, 
    qrCodeExpiry: expiry,
    status: "pairing"
  }).where(eq(clawdbotInstances.id, id));
}

// ============================================================================
// PAYMENT MANAGEMENT
// ============================================================================

export async function createPayment(payment: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(payments).values(payment);
  return result;
}

export async function getPaymentsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(payments)
    .where(eq(payments.clientId, clientId))
    .orderBy(desc(payments.createdAt));
}

export async function updatePaymentStatus(
  id: number, 
  status: "pending" | "completed" | "failed" | "refunded",
  failureReason?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { status };
  if (status === "completed") {
    updateData.paidAt = new Date();
  }
  if (failureReason) {
    updateData.failureReason = failureReason;
  }

  await db.update(payments).set(updateData).where(eq(payments.id, id));
}

// ============================================================================
// CLIENT ASSETS MANAGEMENT
// ============================================================================

export async function createClientAsset(asset: InsertClientAsset) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(clientAssets).values(asset);
  return result;
}

export async function getClientAssetByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(clientAssets)
    .where(eq(clientAssets.clientId, clientId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function updateClientAsset(clientId: number, updates: Partial<InsertClientAsset>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(clientAssets).set(updates).where(eq(clientAssets.clientId, clientId));
}

// ============================================================================
// USAGE ANALYTICS
// ============================================================================

export async function recordUsageAnalytics(analytics: InsertUsageAnalytic) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(usageAnalytics).values(analytics);
  return result;
}

export async function getUsageAnalyticsByClientId(clientId: number, days: number = 30) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return await db.select().from(usageAnalytics)
    .where(
      and(
        eq(usageAnalytics.clientId, clientId),
        sql`${usageAnalytics.date} >= ${startDate}`
      )
    )
    .orderBy(desc(usageAnalytics.date));
}

// ============================================================================
// NOTIFICATION LOG
// ============================================================================

export async function logNotification(notification: InsertNotificationLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(notificationLog).values(notification);
  return result;
}

export async function getRecentNotifications(limit: number = 50) {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(notificationLog)
    .orderBy(desc(notificationLog.createdAt))
    .limit(limit);
}

// ============================================================================
// DASHBOARD ANALYTICS
// ============================================================================

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return {
    totalClients: 0,
    activeClients: 0,
    totalRevenue: 0,
    activeSubscriptions: 0
  };

  // Get total clients
  const totalClientsResult = await db.select({ count: sql<number>`count(*)` }).from(clients);
  const totalClients = totalClientsResult[0]?.count || 0;

  // Get active clients
  const activeClientsResult = await db.select({ count: sql<number>`count(*)` })
    .from(clients)
    .where(eq(clients.status, "active"));
  const activeClients = activeClientsResult[0]?.count || 0;

  // Get total revenue (sum of completed payments)
  const revenueResult = await db.select({ total: sql<number>`sum(${payments.amount})` })
    .from(payments)
    .where(eq(payments.status, "completed"));
  const totalRevenue = revenueResult[0]?.total || 0;

  // Get active subscriptions
  const activeSubsResult = await db.select({ count: sql<number>`count(*)` })
    .from(subscriptions)
    .where(eq(subscriptions.status, "active"));
  const activeSubscriptions = activeSubsResult[0]?.count || 0;

  return {
    totalClients,
    activeClients,
    totalRevenue,
    activeSubscriptions
  };
}
