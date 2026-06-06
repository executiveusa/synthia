import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): { ctx: TrpcContext } {
  return {
    ctx: {
      user: null,
      req: {
        protocol: "https",
        headers: {},
      } as TrpcContext["req"],
      res: {
        clearCookie: () => {},
      } as TrpcContext["res"],
    },
  };
}

describe("control panel routers", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("lists spheres and tool routes", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const spheres = await caller.spheres.list();
    const tools = await caller.herald.tools();

    expect(spheres.length).toBeGreaterThan(0);
    expect(spheres.map(sphere => sphere.id)).toContain("synthia");
    expect(tools.map(tool => tool.id)).toContain("deploy");
  });

  it("routes a plain-language intent", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.herald.dispatch({
      intent: "Deploy the control panel and prepare the onboarding flow.",
      agent_id: "synthia",
      execute: false,
    });

    expect(result.route.tool_id).toBe("deploy");
    expect(result.route.default_sphere).toBe("ing-teknos");
    expect(result.intent).toContain("Deploy the control panel");
  });

  it("reports voice provider state from env", async () => {
    vi.stubEnv("ELEVENLABS_API_KEY", "test-elevenlabs");
    vi.stubEnv("TWILIO_ACCOUNT_SID", "test-twilio");

    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.voice.health();

    expect(result.status).toBe("ready");
    expect(result.providers.elevenlabs).toBe("configured");
    expect(result.providers.twilio).toBe("configured");
  });

  it("exposes pricing tiers with Creem identifiers", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.payments.tiers();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "starter", creem_id: expect.any(String) }),
        expect.objectContaining({ id: "pro", creem_id: expect.any(String) }),
        expect.objectContaining({ id: "elite", creem_id: expect.any(String) }),
      ])
    );
  });

  it("creates a Creem checkout when configured", async () => {
    vi.stubEnv("CREEM_API_KEY", "test-creem-key");
    vi.stubEnv("CREEM_TIER_PRO_ID", "creem-pro-123");

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ checkout_url: "https://creem.test/checkout" }),
    } as Response);

    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.payments.createCheckout({ tierId: "pro" });

    expect(result.checkoutUrl).toBe("https://creem.test/checkout");
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const [, requestInit] = fetchSpy.mock.calls[0] ?? [];
    const body = JSON.parse(String(requestInit?.body ?? "{}")) as { product_id: string };
    expect(body.product_id).toBe("creem-pro-123");
  });

  it("fails closed when Creem is not configured", async () => {
    vi.stubEnv("CREEM_API_KEY", "");

    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(caller.payments.createCheckout({ tierId: "starter" })).rejects.toThrow(
      "CREEM_API_KEY not configured"
    );
  });

  it("accepts chat requests against the spheres router", async () => {
    vi.stubEnv("OPEN_ROUTER_API", "test-openrouter-key");

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        choices: [
          {
            message: {
              content: "Respuesta lista.",
            },
          },
        ],
      }),
    } as Response);

    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.spheres.chat({
      sphereId: "synthia",
      message: "Resume the operational status.",
      history: [],
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(result.sphereId).toBe("synthia");
    expect(result.response).toBe("Respuesta lista.");
  });
});
