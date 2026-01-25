import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json } from "drizzle-orm/mysql-core";

/**
 * SYNTHIA™ Database Schema
 * Multi-tenant SaaS platform for managing Clawdbot WhatsApp assistant instances
 */

// Core user table for admin authentication
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// Client businesses using SYNTHIA™
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  businessName: varchar("businessName", { length: 255 }).notNull(),
  ownerName: varchar("ownerName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  whatsappNumber: varchar("whatsappNumber", { length: 20 }),
  businessDescription: text("businessDescription"),
  status: mysqlEnum("status", ["active", "paused", "cancelled", "pending"]).default("pending").notNull(),
  onboardingCompleted: boolean("onboardingCompleted").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Subscription tiers and billing
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id, { onDelete: "cascade" }),
  tier: mysqlEnum("tier", ["basico", "profesional", "empresarial"]).notNull(), // $599, $1299, $2999 MXN
  priceMonthly: decimal("priceMonthly", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("MXN").notNull(),
  status: mysqlEnum("status", ["active", "past_due", "cancelled", "trialing"]).default("active").notNull(),
  currentPeriodStart: timestamp("currentPeriodStart").notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  cancelAtPeriodEnd: boolean("cancelAtPeriodEnd").default(false).notNull(),
  externalSubscriptionId: varchar("externalSubscriptionId", { length: 255 }), // Lemon Squeezy ID
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Clawdbot instance management
export const clawdbotInstances = mysqlTable("clawdbot_instances", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id, { onDelete: "cascade" }),
  instanceName: varchar("instanceName", { length: 255 }).notNull().unique(),
  configPath: varchar("configPath", { length: 500 }).notNull(),
  whatsappSessionPath: varchar("whatsappSessionPath", { length: 500 }),
  processId: int("processId"),
  status: mysqlEnum("status", ["running", "stopped", "pairing", "error"]).default("stopped").notNull(),
  qrCode: text("qrCode"), // Base64 QR code for pairing
  qrCodeExpiry: timestamp("qrCodeExpiry"),
  lastHealthCheck: timestamp("lastHealthCheck"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Payment transactions
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id, { onDelete: "cascade" }),
  subscriptionId: int("subscriptionId").references(() => subscriptions.id, { onDelete: "set null" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("MXN").notNull(),
  status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  externalTransactionId: varchar("externalTransactionId", { length: 255 }), // Lemon Squeezy transaction ID
  failureReason: text("failureReason"),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Client brand assets and customization
export const clientAssets = mysqlTable("client_assets", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id, { onDelete: "cascade" }),
  logoUrl: varchar("logoUrl", { length: 500 }),
  logoS3Key: varchar("logoS3Key", { length: 500 }),
  primaryColor: varchar("primaryColor", { length: 7 }), // Hex color
  secondaryColor: varchar("secondaryColor", { length: 7 }),
  accentColor: varchar("accentColor", { length: 7 }),
  assistantName: varchar("assistantName", { length: 100 }), // Custom name for their WhatsApp assistant
  assistantPersonality: text("assistantPersonality"), // Custom personality description
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Usage analytics for billing and insights
export const usageAnalytics = mysqlTable("usage_analytics", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  messagesSent: int("messagesSent").default(0).notNull(),
  messagesReceived: int("messagesReceived").default(0).notNull(),
  voiceMinutes: decimal("voiceMinutes", { precision: 10, scale: 2 }).default("0").notNull(),
  apiCalls: int("apiCalls").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Notification log for tracking owner notifications
export const notificationLog = mysqlTable("notification_log", {
  id: int("id").autoincrement().primaryKey(),
  type: mysqlEnum("type", ["signup", "upgrade", "payment_failed", "cancellation", "system"]).notNull(),
  clientId: int("clientId").references(() => clients.id, { onDelete: "set null" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  sentTo: varchar("sentTo", { length: 320 }).notNull(),
  status: mysqlEnum("status", ["sent", "failed"]).default("sent").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Skills marketplace tables
export const skills = mysqlTable("skills", {
  id: int("id").autoincrement().primaryKey(),
  source: mysqlEnum("source", ["clawdbot", "composio", "n8n", "custom"]).notNull(),
  skillId: varchar("skillId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  requirements: json("requirements").$type<string[]>(),
  config: json("config").$type<Record<string, any>>(),
  metadata: json("metadata").$type<Record<string, any>>(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Client-activated skills
export const clientSkills = mysqlTable("client_skills", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("clientId").notNull().references(() => clients.id, { onDelete: "cascade" }),
  skillId: int("skillId").notNull().references(() => skills.id, { onDelete: "cascade" }),
  isEnabled: boolean("isEnabled").default(true).notNull(),
  config: json("config").$type<Record<string, any>>(),
  usageCount: int("usageCount").default(0).notNull(),
  lastUsedAt: timestamp("lastUsedAt"),
  activatedAt: timestamp("activatedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

export type ClawdbotInstance = typeof clawdbotInstances.$inferSelect;
export type InsertClawdbotInstance = typeof clawdbotInstances.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

export type ClientAsset = typeof clientAssets.$inferSelect;
export type InsertClientAsset = typeof clientAssets.$inferInsert;

export type UsageAnalytic = typeof usageAnalytics.$inferSelect;
export type InsertUsageAnalytic = typeof usageAnalytics.$inferInsert;

export type NotificationLog = typeof notificationLog.$inferSelect;
export type InsertNotificationLog = typeof notificationLog.$inferInsert;


export type Skill = typeof skills.$inferSelect;
export type InsertSkill = typeof skills.$inferInsert;

export type ClientSkill = typeof clientSkills.$inferSelect;
export type InsertClientSkill = typeof clientSkills.$inferInsert;
