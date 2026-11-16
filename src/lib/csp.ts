/**
 * The Content-Security-Policy, built per request (T13, stored XSS).
 *
 * script-src carries a fresh nonce instead of 'unsafe-inline': an injected
 * <script> — or an inline event handler — has no way to know the nonce, so it
 * does not run. Next.js reads the nonce back out of the request's CSP header
 * and stamps it on its own framework, page and inline scripts (see
 * node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md).
 * 'strict-dynamic' then lets those trusted scripts load their own chunks.
 *
 * Previously this policy lived in the Caddyfile with script-src
 * 'unsafe-inline', because a static header there cannot carry a per-request
 * nonce. Everything else below is carried over from it unchanged.
 *
 * style-src keeps 'unsafe-inline' on purpose: React `style={{…}}` props are
 * style ATTRIBUTES, which a nonce cannot cover, and adding a nonce to
 * style-src would make browsers ignore 'unsafe-inline' and break them. CSS
 * cannot execute script, so this leaves T13 closed.
 */

/** 128 random bits, base64. Unguessable and unique per request. */
export function generateNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

export function buildCsp(nonce: string, { dev = false }: { dev?: boolean } = {}): string {
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    // Dev only: React uses eval to rebuild server error stacks in the browser.
    // Production never needs it.
    "script-src": ["'self'", `'nonce-${nonce}'`, "'strict-dynamic'", ...(dev ? ["'unsafe-eval'"] : [])],
    "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    "img-src": ["'self'", "data:", "https:"],
    "font-src": ["'self'", "https://fonts.gstatic.com"],
    "connect-src": ["'self'"],
    "object-src": ["'none'"],
    "frame-ancestors": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
  };

  return Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(" ")}`)
    .join("; ");
}
