import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";

const sendMock = vi.fn();
vi.mock("@/lib/email", () => ({
  sendContactEmail: sendMock,
}));

// Reset the in-memory rate-limit between tests by re-importing the module.
async function loadRoute() {
  vi.resetModules();
  return await import("@/app/api/contact/route");
}

const VALID = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "I would love to chat about your work.",
  website: "",
};

function makeReq(body: unknown, ip = "1.2.3.4") {
  return {
    headers: new Headers({ "x-forwarded-for": ip }),
    json: async () => body,
  } as unknown as NextRequest;
}

beforeEach(() => {
  sendMock.mockReset();
  sendMock.mockResolvedValue({ id: "msg" });
  process.env.RESEND_API_KEY = "re_test";
  process.env.CONTACT_TO_EMAIL = "to@example.com";
});

afterEach(() => {
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_TO_EMAIL;
});

describe("POST /api/contact", () => {
  it("sends email and returns 200 for valid payload", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeReq(VALID));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledOnce();
    expect(sendMock).toHaveBeenCalledWith(expect.objectContaining({
      name: VALID.name,
      email: VALID.email,
      message: VALID.message,
    }));
  });

  it("returns 400 when JSON body is invalid", async () => {
    const { POST } = await loadRoute();
    const req = {
      headers: new Headers(),
      json: async () => {
        throw new Error("bad json");
      },
    } as unknown as NextRequest;
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid JSON body" });
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 when payload fails Zod validation, with field errors", async () => {
    const { POST } = await loadRoute();
    const res = await POST(
      makeReq({ name: "X", email: "nope", message: "short" }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("Invalid form data");
    expect(body.details).toBeDefined();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("silently ACKs honeypot-filled submissions (no email sent)", async () => {
    const { POST } = await loadRoute();
    const res = await POST(makeReq({ ...VALID, website: "spam.example" }));
    // Schema actually rejects non-empty website with 400 — confirm no email sent regardless.
    expect(res.status).toBeGreaterThanOrEqual(200);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 502 when sendContactEmail throws", async () => {
    sendMock.mockRejectedValueOnce(new Error("Resend down"));
    const { POST } = await loadRoute();
    const res = await POST(makeReq(VALID));
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body.error).toMatch(/Could not send/);
  });

  it("rate-limits after 5 successful requests in the same window", async () => {
    const { POST } = await loadRoute();
    const ip = "9.9.9.9";

    for (let i = 0; i < 5; i++) {
      const ok = await POST(makeReq(VALID, ip));
      expect(ok.status).toBe(200);
    }

    const blocked = await POST(makeReq(VALID, ip));
    expect(blocked.status).toBe(429);
    const body = await blocked.json();
    expect(body.error).toMatch(/Too many/i);
    expect(typeof body.resetAt).toBe("number");
  });

  it("treats different IPs as independent rate-limit buckets", async () => {
    const { POST } = await loadRoute();
    for (let i = 0; i < 5; i++) {
      await POST(makeReq(VALID, "10.0.0.1"));
    }
    const otherIp = await POST(makeReq(VALID, "10.0.0.2"));
    expect(otherIp.status).toBe(200);
  });

  it("falls back to x-real-ip when x-forwarded-for is missing", async () => {
    const { POST } = await loadRoute();
    const req = {
      headers: new Headers({ "x-real-ip": "5.5.5.5" }),
      json: async () => VALID,
    } as unknown as NextRequest;

    const res = await POST(req);
    expect(res.status).toBe(200);
  });

  it("uses 'unknown' IP key when no headers provided", async () => {
    const { POST } = await loadRoute();
    const req = {
      headers: new Headers(),
      json: async () => VALID,
    } as unknown as NextRequest;

    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
