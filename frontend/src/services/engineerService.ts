import { API_BASE_URL } from '../config/api'

let engineerRosterPromise: Promise<string[]> | null = null

export function getAssignedEngineers(forceRefresh = false): Promise<string[]> {
  if (forceRefresh) {
    engineerRosterPromise = null
  }

  if (!engineerRosterPromise) {
    engineerRosterPromise = fetch(`${API_BASE_URL}/api/engineers`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Unable to load engineers from the backend.')
        }

        return (await response.json()) as string[]
      })
      .catch((error) => {
        engineerRosterPromise = null
        throw error
      })
  }

  return engineerRosterPromise
}
