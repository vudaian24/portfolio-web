import { z } from "zod";

export const contactErrorKeys = [
  "nameMin",
  "nameMax",
  "emailInvalid",
  "emailMax",
  "messageMin",
  "messageMax",
] as const;

export type ContactErrorKey = (typeof contactErrorKeys)[number];

// Limits keep the Telegram message under the 4096-character sendMessage cap
// (counted after entity parsing), with room for the fixed template text.
export const CONTACT_MAX_BODY_BYTES = 16 * 1024;

export const ContactSchema = z.object({
  name: z
    .string({ error: "nameMin" satisfies ContactErrorKey })
    .min(2, { error: "nameMin" satisfies ContactErrorKey })
    .max(100, { error: "nameMax" satisfies ContactErrorKey }),
  email: z
    .email({ error: "emailInvalid" satisfies ContactErrorKey })
    .max(254, { error: "emailMax" satisfies ContactErrorKey }),
  message: z
    .string({ error: "messageMin" satisfies ContactErrorKey })
    .min(10, { error: "messageMin" satisfies ContactErrorKey })
    .max(2000, { error: "messageMax" satisfies ContactErrorKey }),
});

export type ContactForm = z.infer<typeof ContactSchema>;

export function isContactErrorKey(
  value: string | undefined,
): value is ContactErrorKey {
  return contactErrorKeys.includes(value as ContactErrorKey);
}

export function escapeTelegramHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export const inputClass =
  "w-full rounded-lg border bg-background/80 px-4 py-3 text-sm text-foreground transition-[border-color,box-shadow] outline-none placeholder:text-text-muted focus-visible:ring-2 focus-visible:ring-brand/25 disabled:cursor-not-allowed disabled:opacity-50";
