import ServerTable from '../components/ServerTable'
import serversData from '../data/servers'

function ServersPage() {
  return (
    <div className="space-y-6 pb-6">
      <ServerTable servers={serversData} />
    </div>
  )
}

export default ServersPage
