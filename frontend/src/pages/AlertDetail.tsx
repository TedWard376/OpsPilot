import { useParams } from 'react-router-dom'
import PlaceholderPage from './SectionPage'

function AlertDetailPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <PlaceholderPage
      title={`Alert ${id ?? ''}`}
      description="Full alert detail — timeline, affected resource, and investigation history — will render here once this route is built out."
      pageId="alerts"
    />
  )
}

export default AlertDetailPage
