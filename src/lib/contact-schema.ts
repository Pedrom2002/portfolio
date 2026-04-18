import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  email: z.string().trim().email("Invalid email").max(120),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
  // Honeypot — bots fill this; humans leave it empty.
  website: z.string().max(0).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
