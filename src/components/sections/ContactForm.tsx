"use client";

import { useState, type FormEvent } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { contactSchema } from "@/lib/contact-schema";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "ok" }
  | { kind: "error"; message: string };

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-galaxy-darker/90 px-4 py-3 text-sm text-white placeholder:text-text-secondary/50 outline-none transition-colors focus:border-primary/60 focus:bg-galaxy-darker focus:ring-2 focus:ring-primary/20";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const formEl = e.currentTarget;
    const data = Object.fromEntries(new FormData(formEl).entries());
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors);
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = (await res.json().catch(() => ({}))) as {
        error?: string;
        details?: Record<string, string[]>;
      };

      if (!res.ok) {
        if (json.details) setErrors(json.details);
        setStatus({
          kind: "error",
          message: json.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      formEl.reset();
      setStatus({ kind: "ok" });
    } catch {
      setStatus({
        kind: "error",
        message: "Network error. Please try again or email me directly.",
      });
    }
  }

  if (status.kind === "ok") {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center"
      >
        <CheckCircle2 className="text-primary" size={32} />
        <p className="text-base font-medium text-white">Message sent — thanks!</p>
        <p className="text-sm text-text-secondary">I&apos;ll get back to you as soon as I can.</p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-2 text-xs font-medium uppercase tracking-widest text-primary/80 underline-offset-4 hover:text-primary hover:underline"
        >
          Send another
        </button>
      </div>
    );
  }

  const sending = status.kind === "sending";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#050812]/85 p-6 text-left shadow-2xl shadow-primary/5 backdrop-blur-xl sm:p-7"
      aria-label="Contact form"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-text-secondary">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            disabled={sending}
            className={inputClass}
            placeholder="Ada Lovelace"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name && (
            <p id="contact-name-error" className="mt-1.5 text-xs text-red-400">{errors.name[0]}</p>
          )}
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-text-secondary">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            disabled={sending}
            className={inputClass}
            placeholder="ada@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email && (
            <p id="contact-email-error" className="mt-1.5 text-xs text-red-400">{errors.email[0]}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-text-secondary">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          required
          disabled={sending}
          className={`${inputClass} resize-y`}
          placeholder="Tell me about your project, idea, or just say hi…"
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="mt-1.5 text-xs text-red-400">{errors.message[0]}</p>
        )}
      </div>

      {/* Honeypot — visually hidden, accessibility-hidden, but reachable by bots */}
      <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Leave this empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status.kind === "error" && (
        <div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-300">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{status.message}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={sending}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {sending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send size={16} className="transition-transform group-hover:translate-x-0.5" />
            Send message
          </>
        )}
      </button>
    </form>
  );
}
