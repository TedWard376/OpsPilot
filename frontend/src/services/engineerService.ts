export async function getAssignedEngineers(): Promise<string[]> {
  const response = await fetch('/api/engineers')

  if (!response.ok) {
    throw new Error('Unable to load engineers from the backend.')
  }

  return (await response.json()) as string[]
}
