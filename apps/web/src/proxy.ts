import { NextResponse, type NextRequest } from "next/server";

function buildCsp(nonce: string, isProduction: boolean) {
  const scriptSrc = isProduction
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`
    : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "form-action 'self'",
    scriptSrc,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "media-src 'self' blob: https://enterpriseerp-web.onrender.com",
    isProduction
      ? "connect-src 'self' https://enterpriseerp-api.onrender.com"
      : "connect-src 'self' https://enterpriseerp-api.onrender.com http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const isProduction = process.env.NODE_ENV === "production";
  const requestHeaders = new Headers(request.headers);
  const csp = buildCsp(nonce, isProduction);

  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|favicon.ico|enterpriseerp-icon.png|enterpriseerp-logo.png|enterpriseerp-og.png|robots.txt|sitemap.xml).*)",
    },
  ],
};
