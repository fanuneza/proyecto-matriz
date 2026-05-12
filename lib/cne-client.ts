const BASE_URL = process.env.CNE_API_BASE_URL ?? "https://api.cne.cl";
const EMAIL    = process.env.CNE_API_EMAIL ?? "";
const PASSWORD = process.env.CNE_API_PASSWORD ?? "";
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 4;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number) {
  return status === 429 || status >= 500;
}

function getRetryDelayMs(res: Response, attempt: number) {
  const retryAfterSeconds = Number(res.headers.get("retry-after"));
  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
    return retryAfterSeconds * 1000;
  }

  return 400 * 2 ** attempt;
}

async function fetchWithTimeout(input: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchWithRetry(input: string, init: RequestInit = {}) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const res = await fetchWithTimeout(input, init);
      if (!isRetryableStatus(res.status) || attempt === MAX_RETRIES) {
        return res;
      }

      lastError = new Error(`Retryable HTTP status ${res.status}`);
      await wait(getRetryDelayMs(res, attempt));
      continue;
    } catch (err) {
      lastError = err;
      if (attempt === MAX_RETRIES) {
        throw err;
      }
    }

    await wait(400 * 2 ** attempt);
  }

  throw lastError instanceof Error ? lastError : new Error("CNE request failed");
}

/* ── Token management ─────────────────────────────────────────────── */
let cachedToken: string | null = null;
let tokenExpiresAt = 0;
let tokenPromise: Promise<string> | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt - 60_000) return cachedToken;
  if (tokenPromise) return tokenPromise;

  if (!EMAIL || !PASSWORD) {
    throw new Error("CNE API credentials are not configured");
  }

  tokenPromise = (async () => {
    const body = new URLSearchParams({ email: EMAIL, password: PASSWORD });
    const res = await fetchWithRetry(`${BASE_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body,
    });

    if (!res.ok) throw new Error(`CNE login failed: ${res.status} ${res.statusText}`);

    const json = (await res.json()) as { token: string };
    if (!json.token) throw new Error("CNE login returned no token");

    cachedToken = json.token;
    try {
      const payload = JSON.parse(Buffer.from(json.token.split(".")[1], "base64url").toString());
      tokenExpiresAt = (payload.exp as number) * 1000;
    } catch {
      tokenExpiresAt = Date.now() + 55 * 60 * 1000;
    }

    return cachedToken;
  })();

  try {
    return await tokenPromise;
  } finally {
    tokenPromise = null;
  }
}

/* ── Response cache ───────────────────────────────────────────────── */
type CacheEntry<T> = { data: T; fetchedAt: number };
const responseCache = new Map<string, CacheEntry<unknown>>();

async function fetchCne<T>(path: string, ttlMs: number): Promise<{ data: T; fetchedAt: number }> {
  const cached = responseCache.get(path) as CacheEntry<T> | undefined;
  if (cached && Date.now() - cached.fetchedAt < ttlMs) return cached;

  const token = await getToken();
  const res = await fetchWithRetry(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });

  if (!res.ok) throw new Error(`CNE API ${path} responded with ${res.status} ${res.statusText}`);

  const json = (await res.json()) as T;
  const entry: CacheEntry<T> = { data: json, fetchedAt: Date.now() };
  responseCache.set(path, entry);
  return entry;
}

const TTL_CAPACIDAD  = 6  * 60 * 60 * 1000; // 6 h
const TTL_PIPELINE   = 6  * 60 * 60 * 1000; // 6 h
const TTL_NETBILLING = 24 * 60 * 60 * 1000; // 24 h

export const fetchCapacidadRaw     = () => fetchCne<unknown>("/api/ea/capacidad/instaladagx",      TTL_CAPACIDAD);
export const fetchPipelineRaw      = () => fetchCne<unknown>("/api/ea/proyectosenconstrucciongx",   TTL_PIPELINE);
export const fetchNetBillingRaw    = () => fetchCne<unknown>("/api/ea/netbilling",                  TTL_NETBILLING);
