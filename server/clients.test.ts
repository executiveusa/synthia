import { beforeEach, describe, expect, it, vi } from "vitest";

type MockClient = {
  id: number;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  businessDescription?: string;
  status: "active" | "paused" | "cancelled" | "pending";
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const dbState = vi.hoisted(() => ({
  clients: [] as MockClient[],
  nextId: 1,
}));

vi.mock("./db", () => ({
  getDashboardStats: async () => ({
    totalClients: dbState.clients.length,
    activeClients: dbState.clients.filter(client => client.status === "active").length,
    totalRevenue: dbState.clients.filter(client => client.status === "active").length * 1000,
    activeSubscriptions: dbState.clients.filter(client => client.status === "active").length,
  }),
  getAllClients: async () => [...dbState.clients].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
  getClientById: async (id: number) => dbState.clients.find(client => client.id === id),
  getClientByEmail: async (email: string) => dbState.clients.find(client => client.email === email),
  createClient: async (data: Omit<MockClient, "id" | "status" | "onboardingCompleted" | "createdAt" | "updatedAt">) => {
    const existing = dbState.clients.find(client => client.email === data.email);
    if (existing) {
      throw new Error("duplicate email");
    }

    const client: MockClient = {
      id: dbState.nextId++,
      ...data,
      status: "pending",
      onboardingCompleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dbState.clients.push(client);
    return client.id;
  },
  updateClientStatus: async (id: number, status: MockClient["status"]) => {
    const client = dbState.clients.find(item => item.id === id);
    if (!client) {
      throw new Error("Client not found");
    }
    client.status = status;
    client.updatedAt = new Date();
  },
  getAllSkills: async () => [],
  getSkillsByCategory: async () => [],
  searchSkills: async () => [],
  getSkillById: async () => undefined,
  getSkillsStats: async () => ({ totalSkills: 0, byCategory: {}, bySource: {} }),
  getClientSkills: async () => [],
  activateSkillForClient: async () => 1,
  deactivateSkillForClient: async () => undefined,
  getClientSubscription: async () => undefined,
  createSubscription: async () => 1,
  getClientInstance: async () => undefined,
  createClawdbotInstance: async () => 1,
  updateInstanceStatus: async () => undefined,
  updateInstanceQRCode: async () => undefined,
  getClientAssetByClientId: async () => undefined,
  upsertClientAsset: async () => 1,
  getUsageAnalyticsByClientId: async () => [],
  recordUsage: async () => undefined,
  getPaymentsByClientId: async () => [],
  createPayment: async () => 1,
  updatePaymentStatus: async () => undefined,
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(async () => true),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@kupurimedia.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

function createNonAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

beforeEach(() => {
  dbState.clients.length = 0;
  dbState.nextId = 1;
});

describe("clients.stats", () => {
  it("returns dashboard statistics for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.clients.stats();

    expect(result).toBeDefined();
    expect(typeof result.totalClients).toBe("number");
    expect(typeof result.activeClients).toBe("number");
    expect(typeof result.totalRevenue).toBe("number");
    expect(typeof result.activeSubscriptions).toBe("number");
  });

  it("throws FORBIDDEN error for non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.clients.stats()).rejects.toThrow("Solo administradores pueden acceder a este recurso");
  });
});

describe("clients.list", () => {
  it("returns list of clients for admin users", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.clients.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("throws FORBIDDEN error for non-admin users", async () => {
    const { ctx } = createNonAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.clients.list()).rejects.toThrow("Solo administradores pueden acceder a este recurso");
  });
});

describe("clients.create", () => {
  it("creates a new client with valid data", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const uniqueEmail = `test-${Date.now()}@example.com`;
    const result = await caller.clients.create({
      businessName: "Test Business",
      ownerName: "Test Owner",
      email: uniqueEmail,
      phone: "+525512345678",
      businessDescription: "A test business",
    });

    expect(result.success).toBe(true);
    expect(result.clientId).toBeDefined();
    expect(typeof result.clientId).toBe("number");
  });

  it("throws error when email already exists", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const duplicateEmail = `duplicate-${Date.now()}@example.com`;

    await caller.clients.create({
      businessName: "First Business",
      ownerName: "First Owner",
      email: duplicateEmail,
      phone: "+525512345678",
    });

    await expect(
      caller.clients.create({
        businessName: "Second Business",
        ownerName: "Second Owner",
        email: duplicateEmail,
        phone: "+525587654321",
      })
    ).rejects.toThrow("Ya existe un cliente con este correo");
  });

  it("validates required fields", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.clients.create({
        businessName: "",
        ownerName: "Test Owner",
        email: "test@example.com",
        phone: "+525512345678",
      } as any)
    ).rejects.toThrow();

    await expect(
      caller.clients.create({
        businessName: "Test Business",
        ownerName: "Test Owner",
        email: "invalid-email",
        phone: "+525512345678",
      })
    ).rejects.toThrow();
  });
});

describe("clients.updateStatus", () => {
  it("updates client status successfully", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const uniqueEmail = `status-test-${Date.now()}@example.com`;
    const createResult = await caller.clients.create({
      businessName: "Status Test Business",
      ownerName: "Status Test Owner",
      email: uniqueEmail,
      phone: "+525512345678",
    });

    const updateResult = await caller.clients.updateStatus({
      id: createResult.clientId,
      status: "active",
    });

    expect(updateResult.success).toBe(true);
  });

  it("validates status enum values", async () => {
    const { ctx } = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.clients.updateStatus({
        id: 1,
        status: "invalid-status" as any,
      })
    ).rejects.toThrow();
  });
});
