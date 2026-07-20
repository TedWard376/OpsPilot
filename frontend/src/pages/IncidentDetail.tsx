import { useParams } from 'react-router-dom'
import PlaceholderPage from './SectionPage'

function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <PlaceholderPage
      title={`Incident ${id ?? ''}`}
      description="Full incident detail — root cause, response timeline, and related servers — will render here once this route is built out."
      pageId="incidents"
    />
  )
}

export default IncidentDetailPage
