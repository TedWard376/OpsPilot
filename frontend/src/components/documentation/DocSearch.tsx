import { SearchBar } from '../SearchBar'

interface DocSearchProps {
  value: string
  onChange: (value: string) => void
}

export function DocSearch({ value, onChange }: DocSearchProps) {
  return <SearchBar value={value} onChange={onChange} placeholder="Search by title, description, or tag..." ariaLabel="Search documentation" />
}
