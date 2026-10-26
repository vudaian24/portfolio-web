import net from "node:net";
import { NextResponse } from "next/server";
import {
  CONTACT_MAX_BODY_BYTES,
  ContactSchema,
  escapeTelegramHtml,
} from "@/lib/contact";

const TELEGRAM_TIMEOUT_MS = 10_000;

// api.telegram.org publishes an AAAA record that is unreachable from the
// cluster, so Node spends its first Happy Eyeballs attempt on IPv6 and the IPv4
// attempt is the only one that can succeed. Each attempt gets 250 ms by
// default, while the IPv4 round trip from ap-southeast-1 measures 159-292 ms,
// so a healthy connection was aborted as ETIMEDOUT about four times in ten. The
// IPv6 attempt still fails within a few milliseconds with ENETUNREACH, so a
// larger budget costs nothing in the common case.
const FAMILY_ATTEMPT_TIMEOUT_MS = 5_000;

net.setDefaultAutoSelectFamilyAttemptTimeout(FAMILY_ATTEMPT_TIMEOUT_MS);

class BodyTooLargeError extends Error {}

// Reads the body as text and stops once it exceeds maxBytes, so an oversized
// request is never buffered in full.
async function readBodyText(req: Request, maxBytes: number): Promise<string> {
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (declared > maxBytes) throw new BodyTooLargeError();
  if (!req.body) return "";

  const reader = req.body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let text = "";

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel();
      throw new BodyTooLargeError();
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

// Pulls the error code off a fetch failure. The message is left alone on
// purpose: it can carry the request URL, and that URL holds the bot token.
function causeCode(error: unknown): string {
  const cause = error instanceof Error ? error.cause : undefined;
  if (cause && typeof cause === "object" && "code" in cause) {
    return String((cause as { code: unknown }).code);
  }
  return error instanceof Error ? error.name : "unknown";
}

export async function POST(req: Request) {
  try {
    let body: unknown;
    try {
      body = JSON.parse(await readBodyText(req, CONTACT_MAX_BODY_BYTES));
    } catch (error) {
      if (error instanceof BodyTooLargeError) {
        return NextResponse.json(
          { error: "Payload too large" },
          { status: 413 },
        );
      }
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { name, email, message } = parsed.data;

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      console.error(
        "Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID environment variables",
      );
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const safeName = escapeTelegramHtml(name);
    const safeEmail = escapeTelegramHtml(email);
    const safeMessage = escapeTelegramHtml(message);

    const text = `
<b>📩 New contact request</b>
<b>👤 Name:</b> ${safeName}
<b>📧 Email:</b> ${safeEmail}
<b>💬 Message:</b> ${safeMessage}
    `;

    let response: Response;
    try {
      response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: "HTML",
          }),
          signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
        },
      );
    } catch (error) {
      if (error instanceof Error && error.name === "TimeoutError") {
        console.error("Telegram API timed out");
        return NextResponse.json(
          { error: "Telegram API timed out" },
          { status: 504 },
        );
      }
      // A socket-level failure arrives as TypeError("fetch failed") with the
      // real reason on `cause`, long before AbortSignal.timeout can fire. That
      // is an upstream reachability problem, so report it as 504 instead of
      // letting it fall through to the catch-all 500. Log only the error code:
      // the request URL carries the bot token.
      console.error("Telegram API unreachable:", causeCode(error));
      return NextResponse.json(
        { error: "Telegram API unreachable" },
        { status: 504 },
      );
    }

    if (!response.ok) {
      console.error("Telegram API HTTP error:", response.status);
      return NextResponse.json(
        { error: "Failed to deliver message" },
        { status: 502 },
      );
    }

    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
    } | null;

    if (!result?.ok) {
      console.error("Telegram API returned not ok");
      return NextResponse.json(
        { error: "Failed to deliver message" },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
