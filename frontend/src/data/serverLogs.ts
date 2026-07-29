/**
 * Mock content for the server logs viewer — pure content only.
 * See services/serverLogService.ts for getServerLogs().
 */

export const INFO_TEMPLATES = [
  (svc: string) => `${svc} health check passed`,
  (svc: string) => `${svc} accepted new connection`,
  (svc: string) => `${svc} completed scheduled task`,
  (svc: string) => `${svc} configuration reloaded`,
  (svc: string) => `${svc} request completed in 42ms`,
  (svc: string) => `${svc} cache warmed successfully`,
]

export const WARN_TEMPLATES = [
  (svc: string) => `${svc} response time above 500ms`,
  (svc: string) => `${svc} connection pool nearing capacity`,
  (svc: string) => `${svc} retrying failed upstream call`,
  (svc: string) => `${svc} disk usage approaching threshold`,
  (svc: string) => `${svc} deprecated API endpoint called`,
]

export const ERROR_TEMPLATES = [
  (svc: string) => `${svc} failed to connect to upstream dependency`,
  (svc: string) => `${svc} request timed out after 30s`,
  (svc: string) => `${svc} unhandled exception in request handler`,
  (svc: string) => `${svc} out of memory — process restarted`,
  (svc: string) => `${svc} authentication failure from unknown client`,
]
