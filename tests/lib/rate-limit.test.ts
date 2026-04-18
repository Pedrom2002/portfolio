import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { pruneRateLimitBuckets, rateLimit } from "@/lib/rate-limit";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("rateLimit", () => {
  it("allows requests below the limit", () => {
    const k = `t1:${Math.random()}`;
    const r1 = rateLimit(k, 3, 60_000);
    expect(r1.ok).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = rateLimit(k, 3, 60_000);
    expect(r2.ok).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = rateLimit(k, 3, 60_000);
    expect(r3.ok).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it("blocks requests above the limit", () => {
    const k = `t2:${Math.random()}`;
    rateLimit(k, 2, 60_000);
    rateLimit(k, 2, 60_000);
    const r = rateLimit(k, 2, 60_000);
    expect(r.ok).toBe(false);
    expect(r.remaining).toBe(0);
  });

  it("resets the bucket after the window expires", () => {
    const k = `t3:${Math.random()}`;
    rateLimit(k, 1, 1000);
    expect(rateLimit(k, 1, 1000).ok).toBe(false);

    vi.advanceTimersByTime(1100);

    const fresh = rateLimit(k, 1, 1000);
    expect(fresh.ok).toBe(true);
    expect(fresh.remaining).toBe(0);
  });

  it("uses independent buckets per key", () => {
    rateLimit("a:test", 1, 60_000);
    const r = rateLimit("b:test", 1, 60_000);
    expect(r.ok).toBe(true);
  });

  it("returns a sensible resetAt timestamp", () => {
    const r = rateLimit(`t4:${Math.random()}`, 5, 5_000);
    expect(r.resetAt).toBe(Date.now() + 5_000);
  });
});

describe("pruneRateLimitBuckets", () => {
  it("removes only expired buckets", () => {
    const live = `live:${Math.random()}`;
    const dead = `dead:${Math.random()}`;
    rateLimit(live, 1, 60_000);
    rateLimit(dead, 1, 1_000);

    vi.advanceTimersByTime(2_000);

    pruneRateLimitBuckets();

    // dead bucket pruned -> next call gives a fresh window
    const after = rateLimit(dead, 1, 1_000);
    expect(after.ok).toBe(true);
    expect(after.remaining).toBe(0);

    // live bucket survived -> already at limit
    const live2 = rateLimit(live, 1, 60_000);
    expect(live2.ok).toBe(false);
  });
});
