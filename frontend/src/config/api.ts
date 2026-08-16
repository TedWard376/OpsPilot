/**
 * Central place for the backend API base URL.
 *
 * Reads from the Vite-injected `VITE_API_URL` build-time environment
 * variable so the same code can point at different backends without any
 * source changes:
 *
 *   - Local development: leave `VITE_API_URL` unset. Requests are made
 *     with a relative path (e.g. `/api/alerts`), which works through a
 *     Vite dev server proxy or when the frontend is served from the same
 *     origin as the API.
 *   - Production: set `VITE_API_URL=https://api.opspilot.example.com` in
 *     the deployment environment (e.g. `.env.production`, or the hosting
 *     provider's environment variable settings) to point at the deployed
 *     FastAPI instance.
 *
 * Only ever put non-secret, public values in `VITE_`-prefixed variables —
 * Vite inlines them into the client bundle at build time, so anything
 * here is visible to anyone who opens the app.
 */
export const API_BASE_URL: string = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
