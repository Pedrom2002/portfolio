import { describe, expect, it } from "vitest";
import { validateContactForm } from "@/lib/contact-validation";

const VALID = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello there, let us collaborate.",
  website: "",
};

describe("validateContactForm", () => {
  it("accepts a valid payload and trims strings", () => {
    const r = validateContactForm({
      name: "  Ada  ",
      email: "  ada@example.com  ",
      message: "  hello there world  ",
      website: "",
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.name).toBe("Ada");
      expect(r.data.email).toBe("ada@example.com");
      expect(r.data.message).toBe("hello there world");
    }
  });

  it.each([
    ["", "empty"],
    ["A", "1 char"],
  ])("rejects name that is too short (%s)", (name) => {
    const r = validateContactForm({ ...VALID, name });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.name).toBeDefined();
  });

  it("rejects name longer than 80 chars", () => {
    const r = validateContactForm({ ...VALID, name: "x".repeat(81) });
    expect(r.ok).toBe(false);
  });

  it("rejects malformed email", () => {
    const r = validateContactForm({ ...VALID, email: "nope" });
    expect(r.ok).toBe(false);
  });

  it("rejects email longer than 120 chars", () => {
    const r = validateContactForm({ ...VALID, email: "x".repeat(116) + "@a.io" });
    expect(r.ok).toBe(false);
  });

  it("rejects short message", () => {
    const r = validateContactForm({ ...VALID, message: "short" });
    expect(r.ok).toBe(false);
  });

  it("rejects overlong message", () => {
    const r = validateContactForm({ ...VALID, message: "y".repeat(2001) });
    expect(r.ok).toBe(false);
  });

  it("rejects when the honeypot is filled", () => {
    const r = validateContactForm({ ...VALID, website: "spam" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.website).toBeDefined();
  });

  it("treats missing fields as invalid", () => {
    const r = validateContactForm({});
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errors.name).toBeDefined();
      expect(r.errors.email).toBeDefined();
      expect(r.errors.message).toBeDefined();
    }
  });
});
