// Zero-dependency client-side validation of the contact form.
// Mirrors the rules in `contact-schema.ts` (Zod, server-only). Kept separate
// from the Zod schema so that importing this from a client component doesn't
// pull Zod's JIT probe into the client bundle (Zod v4 calls `new Function("")`
// at module load which trips a CSP `unsafe-eval` violation in the console
// even though the probe is in try/catch).

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  website: string;
}

export type ContactFieldErrors = Partial<Record<keyof ContactFormData, string[]>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContactForm(
  raw: Record<string, unknown>,
): { ok: true; data: ContactFormData } | { ok: false; errors: ContactFieldErrors } {
  const name = String(raw.name ?? "").trim();
  const email = String(raw.email ?? "").trim();
  const message = String(raw.message ?? "").trim();
  const website = String(raw.website ?? "");

  const errors: ContactFieldErrors = {};

  if (name.length < 2) {
    errors.name = ["Name must be at least 2 characters"];
  } else if (name.length > 80) {
    errors.name = ["Name must be at most 80 characters"];
  }

  if (!EMAIL_RE.test(email)) {
    errors.email = ["Invalid email"];
  } else if (email.length > 120) {
    errors.email = ["Email must be at most 120 characters"];
  }

  if (message.length < 10) {
    errors.message = ["Message must be at least 10 characters"];
  } else if (message.length > 2000) {
    errors.message = ["Message must be at most 2000 characters"];
  }

  // Honeypot — if a bot filled this, bail with a soft error. The server also
  // defends against this independently.
  if (website.length > 0) {
    errors.website = ["unexpected"];
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { name, email, message, website } };
}
