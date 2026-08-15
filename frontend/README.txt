Changed files: alerts pages now source engineer names from GET /api/engineers
instead of a hardcoded mock name pool.

src/services/alertDetailService.ts
  - getAlertDetail() now takes an `engineers: string[]` param instead of
    picking from the removed RELATED_INCIDENT_ENGINEERS mock pool.
  - Falls back to 'Unassigned' if the roster hasn't loaded yet / is empty.

src/pages/AlertDetail.tsx
  - Calls getAssignedEngineers() (engineerService, same as
    AssignEngineerModal / incident pages) on mount and passes the roster
    into getAlertDetail().

src/data/alertDetail.ts
  - Removed the now-unused RELATED_INCIDENT_ENGINEERS mock export.
