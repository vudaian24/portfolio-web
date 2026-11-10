import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/web-api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.includes("/opengraph-image")
  ) {
    return;
  }

  return intlMiddleware(request);
}

// Open Graph image routes are left alone: their metadata URL keeps the /en
// prefix, and the as-needed redirect would make crawlers follow a 307.
export const config = {
  matcher: ["/((?!web-api|_next|.*\\..*|.*opengraph-image).*)"],
};
