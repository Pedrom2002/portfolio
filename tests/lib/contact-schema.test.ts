import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact-schema";

describe("contactSchema", () => {
  const valid = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "I would love to chat about your work.",
    website: "",
  };

  it("accepts a valid payload", () => {
    const r = contactSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it("trims whitespace on string fields", () => {
    const r = contactSchema.safeParse({
      ...valid,
      name: "  Ada  ",
      email: "  ada@example.com  ",
      message: "  hello there world  ",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.name).toBe("Ada");
      expect(r.data.email).toBe("ada@example.com");
      expect(r.data.message).toBe("hello there world");
    }
  });

  it.each([
    ["", "empty"],
    ["A", "1 char"],
  ])("rejects name that is too short (%s)", (name) => {
    const r = contactSchema.safeParse({ ...valid, name });
    expect(r.success).toBe(false);
  });

  it("rejects name longer than 80 chars", () => {
    const r = contactSchema.safeParse({ ...valid, name: "x".repeat(81) });
    expect(r.success).toBe(false);
  });

  it("rejects malformed email", () => {
    const r = contactSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  it("rejects email longer than 120 chars", () => {
    const long = "x".repeat(116) + "@a.io"; // 121 chars
    const r = contactSchema.safeParse({ ...valid, email: long });
    expect(r.success).toBe(false);
  });

  it("rejects message shorter than 10 chars", () => {
    const r = contactSchema.safeParse({ ...valid, message: "too short" });
    expect(r.success).toBe(false);
  });

  it("rejects message longer than 2000 chars", () => {
    const r = contactSchema.safeParse({ ...valid, message: "y".repeat(2001) });
    expect(r.success).toBe(false);
  });

  it("rejects honeypot when filled (bot)", () => {
    const r = contactSchema.safeParse({ ...valid, website: "spam.example" });
    expect(r.success).toBe(false);
  });

  it("defaults website to empty string when omitted", () => {
    const { website: _w, ...rest } = valid;
    void _w;
    const r = contactSchema.safeParse(rest);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.website).toBe("");
  });
});
