import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopNav from '../components/TopNav'

function MainLayout() {
  return (
    <div className="h-screen overflow-hidden bg-[var(--page-background)] text-[var(--foreground)]">
      <div className="flex h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav />

          <main className="flex-1 overflow-hidden bg-[var(--page-background)] p-4 lg:p-6">
            <div className="mx-auto flex h-full max-w-7xl flex-col overflow-y-auto pr-1">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
