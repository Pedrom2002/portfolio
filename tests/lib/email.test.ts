import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

const VALID = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  message: "Hello there!",
  website: "",
};

beforeEach(() => {
  vi.resetModules();
  sendMock.mockReset();
  process.env.RESEND_API_KEY = "re_test";
  process.env.CONTACT_TO_EMAIL = "to@example.com";
  delete process.env.CONTACT_FROM_EMAIL;
});

afterEach(() => {
  delete process.env.RESEND_API_KEY;
  delete process.env.CONTACT_TO_EMAIL;
  delete process.env.CONTACT_FROM_EMAIL;
});

describe("sendContactEmail", () => {
  it("calls resend.emails.send with the right shape", async () => {
    sendMock.mockResolvedValueOnce({ data: { id: "msg_1" }, error: null });
    const { sendContactEmail } = await import("@/lib/email");

    await sendContactEmail(VALID);

    expect(sendMock).toHaveBeenCalledOnce();
    const arg = sendMock.mock.calls[0][0];
    expect(arg.to).toBe("to@example.com");
    expect(arg.from).toBe("onboarding@resend.dev");
    expect(arg.replyTo).toBe(VALID.email);
    expect(arg.subject).toContain(VALID.name);
    expect(arg.text).toContain(VALID.message);
    expect(arg.html).toContain(VALID.message);
  });

  it("uses CONTACT_FROM_EMAIL when set", async () => {
    process.env.CONTACT_FROM_EMAIL = "hello@pedromarques.dev";
    sendMock.mockResolvedValueOnce({ data: { id: "msg_2" }, error: null });
    const { sendContactEmail } = await import("@/lib/email");

    await sendContactEmail(VALID);

    expect(sendMock.mock.calls[0][0].from).toBe("hello@pedromarques.dev");
  });

  it("escapes HTML in name/email/message to prevent injection", async () => {
    sendMock.mockResolvedValueOnce({ data: { id: "msg_3" }, error: null });
    const { sendContactEmail } = await import("@/lib/email");

    await sendContactEmail({
      ...VALID,
      name: "<script>alert('x')</script>",
      message: "evil & <img src=x>",
    });

    const arg = sendMock.mock.calls[0][0];
    expect(arg.html).not.toContain("<script>");
    expect(arg.html).toContain("&lt;script&gt;");
    expect(arg.html).toContain("&amp;");
    expect(arg.html).toContain("&lt;img");
  });

  it("throws when Resend returns an error", async () => {
    sendMock.mockResolvedValueOnce({
      data: null,
      error: { message: "The domain is invalid", name: "validation_error" },
    });
    const { sendContactEmail } = await import("@/lib/email");

    await expect(sendContactEmail(VALID)).rejects.toThrow(/domain is invalid/);
  });

  it("throws when RESEND_API_KEY is missing", async () => {
    delete process.env.RESEND_API_KEY;
    const { sendContactEmail } = await import("@/lib/email");

    await expect(sendContactEmail(VALID)).rejects.toThrow(/RESEND_API_KEY/);
  });

  it("throws when CONTACT_TO_EMAIL is missing", async () => {
    delete process.env.CONTACT_TO_EMAIL;
    const { sendContactEmail } = await import("@/lib/email");

    await expect(sendContactEmail(VALID)).rejects.toThrow(/CONTACT_TO_EMAIL/);
  });
});
