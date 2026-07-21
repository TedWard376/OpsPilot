import { SearchBar } from '../SearchBar'

interface IncidentSearchProps {
  value: string
  onChange: (value: string) => void
}

export function IncidentSearch({ value, onChange }: IncidentSearchProps) {
  return (
    <SearchBar
      value={value}
      onChange={onChange}
      placeholder="Search by incident title or ID..."
      ariaLabel="Search incidents"
    />
  )
}
