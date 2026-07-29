import { SearchBar } from '../SearchBar'

interface AlertSearchProps {
  value: string
  onChange: (value: string) => void
}

export function AlertSearch({ value, onChange }: AlertSearchProps) {
  return <SearchBar value={value} onChange={onChange} placeholder="Search by alert name or ID..." ariaLabel="Search alerts" />
}
