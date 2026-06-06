import { eq, desc, and, like, inArray } from "drizzle-orm";
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
  skills,
  clientSkills,
  type Client,
  type Subscription,
  type ClawdbotInstance,
  type Payment,
  type ClientAsset,
  type UsageAnalytic,
  type NotificationLog,
  type Skill,
  type ClientSkill
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
// SKILLS MARKETPLACE
// ============================================================================

export async function getAllSkills(): Promise<Skill[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(skills).where(eq(skills.isActive, true)).orderBy(desc(skills.createdAt));
  return result;
}

export async function getSkillsByCategory(category: string): Promise<Skill[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(skills)
    .where(and(eq(skills.category, category), eq(skills.isActive, true)))
    .orderBy(desc(skills.createdAt));
  return result;
}

export async function searchSkills(query: string): Promise<Skill[]> {
  const db = await getDb();
  if (!db) return [];
  
  const searchPattern = `%${query}%`;
  const result = await db.select().from(skills)
    .where(and(
      eq(skills.isActive, true),
      like(skills.name, searchPattern)
    ))
    .orderBy(desc(skills.createdAt));
  return result;
}

export async function getSkillById(id: number): Promise<Skill | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getClientSkills(clientId: number): Promise<(ClientSkill & { skill: Skill })[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select({
    clientSkill: clientSkills,
    skill: skills
  })
  .from(clientSkills)
  .leftJoin(skills, eq(clientSkills.skillId, skills.id))
  .where(eq(clientSkills.clientId, clientId))
  .orderBy(desc(clientSkills.activatedAt));
  
  return result.map(r => ({
    ...r.clientSkill,
    skill: r.skill!
  }));
}

export async function activateSkillForClient(clientId: number, skillId: number, config: Record<string, any> = {}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(clientSkills).values({
    clientId,
    skillId,
    isEnabled: true,
    config: config as any,
    usageCount: 0,
    activatedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return Number((result as any).insertId);
}

export async function deactivateSkillForClient(clientId: number, skillId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(clientSkills)
    .set({ isEnabled: false, updatedAt: new Date() })
    .where(and(eq(clientSkills.clientId, clientId), eq(clientSkills.skillId, skillId)));
}

export async function incrementSkillUsage(clientId: number, skillId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.execute(`
    UPDATE client_skills 
    SET usageCount = usageCount + 1, lastUsedAt = NOW(), updatedAt = NOW()
    WHERE clientId = ${clientId} AND skillId = ${skillId}
  `);
}

export async function getSkillsStats(): Promise<{
  totalSkills: number;
  byCategory: Record<string, number>;
  bySource: Record<string, number>;
}> {
  const db = await getDb();
  if (!db) return { totalSkills: 0, byCategory: {}, bySource: {} };
  
  const allSkills = await db.select().from(skills).where(eq(skills.isActive, true));
  
  const byCategory: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  
  for (const skill of allSkills) {
    byCategory[skill.category] = (byCategory[skill.category] || 0) + 1;
    bySource[skill.source] = (bySource[skill.source] || 0) + 1;
  }
  
  return {
    totalSkills: allSkills.length,
    byCategory,
    bySource
  };
}

// ============================================================================
// CLIENT MANAGEMENT
// ============================================================================

export async function getAllClients(): Promise<Client[]> {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db.select().from(clients).orderBy(desc(clients.createdAt));
  return result;
}

export async function getClientById(id: number): Promise<Client | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getClientByEmail(email: string): Promise<Client | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(clients).where(eq(clients.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createClient(data: {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  businessDescription?: string;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(clients).values({
    ...data,
    status: "pending",
    onboardingCompleted: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return Number((result as any).insertId);
}

export async function updateClientStatus(id: number, status: "active" | "paused" | "cancelled" | "pending"): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(clients).set({ status, updatedAt: new Date() }).where(eq(clients.id, id));
}

export async function completeClientOnboarding(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(clients).set({ onboardingCompleted: true, status: "active", updatedAt: new Date() }).where(eq(clients.id, id));
}

// ============================================================================
// SUBSCRIPTION MANAGEMENT
// ============================================================================

export async function getClientSubscription(clientId: number): Promise<Subscription | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(subscriptions)
    .where(eq(subscriptions.clientId, clientId))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function createSubscription(data: {
  clientId: number;
  tier: "basico" | "profesional" | "empresarial";
  priceMonthly: string;
  currency?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  externalSubscriptionId?: string;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(subscriptions).values({
    ...data,
    currency: data.currency || "MXN",
    status: "active",
    cancelAtPeriodEnd: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return Number((result as any).insertId);
}

// ============================================================================
// CLAWDBOT INSTANCE MANAGEMENT
// ============================================================================

export async function getClientInstance(clientId: number): Promise<ClawdbotInstance | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(clawdbotInstances)
    .where(eq(clawdbotInstances.clientId, clientId))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function createClawdbotInstance(data: {
  clientId: number;
  instanceName: string;
  configPath: string;
}): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(clawdbotInstances).values({
    ...data,
    status: "stopped",
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return Number((result as any).insertId);
}

export async function updateInstanceStatus(id: number, status: "running" | "stopped" | "pairing" | "error", errorMessage?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(clawdbotInstances).set({
    status,
    errorMessage,
    lastHealthCheck: new Date(),
    updatedAt: new Date()
  }).where(eq(clawdbotInstances.id, id));
}

export async function updateInstanceQRCode(id: number, qrCode: string, expiryMinutes: number = 60): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + expiryMinutes);
  
  await db.update(clawdbotInstances).set({
    qrCode,
    qrCodeExpiry: expiry,
    status: "pairing",
    updatedAt: new Date()
  }).where(eq(clawdbotInstances.id, id));
}

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return {
    totalClients: 0,
    activeClients: 0,
    totalRevenue: 0,
    activeSubscriptions: 0
  };
  
  const allClients = await db.select().from(clients);
  const activeClients = allClients.filter(c => c.status === "active");
  
  const allSubscriptions = await db.select().from(subscriptions);
  const activeSubscriptions = allSubscriptions.filter(s => s.status === "active");
  
  const totalRevenue = activeSubscriptions.reduce((sum, sub) => sum + parseFloat(sub.priceMonthly), 0);
  
  return {
    totalClients: allClients.length,
    activeClients: activeClients.length,
    totalRevenue,
    activeSubscriptions: activeSubscriptions.length
  };
}
