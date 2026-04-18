import { NextRequest } from "next/server";
import { contactSchema } from "@/lib/contact-schema";
import { rateLimit, pruneRateLimitBuckets } from "@/lib/rate-limit";
import { sendContactEmail } from "@/lib/email";

export const runtime = "nodejs";

function jsonError(status: number, error: string, extra?: Record<string, unknown>) {
  return Response.json({ error, ...extra }, { status });
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export async function POST(req: NextRequest) {
  // Rate-limit: 5 requests / minute / IP
  const ip = getClientIp(req);
  const rl = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!rl.ok) {
    return jsonError(429, "Too many requests. Please try again in a minute.", {
      resetAt: rl.resetAt,
    });
  }

  // Opportunistic cleanup
  if (Math.random() < 0.05) pruneRateLimitBuckets();

  // Parse JSON body defensively
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, "Invalid JSON body");
  }

  // Validate
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Invalid form data", {
      details: parsed.error.flatten().fieldErrors,
    });
  }

  // Honeypot check (extra defense — schema already requires empty string)
  if (parsed.data.website && parsed.data.website.length > 0) {
    // Pretend success so bots don't probe
    return Response.json({ ok: true });
  }

  // Send (don't leak provider errors to client)
  try {
    await sendContactEmail(parsed.data);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[contact]", err);
    }
    return jsonError(502, "Could not send message. Please email me directly.");
  }

  return Response.json({ ok: true });
}
