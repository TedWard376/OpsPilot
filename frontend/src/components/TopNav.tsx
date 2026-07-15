import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, RefreshCw, Search, Sparkles } from 'lucide-react'

function TopNav() {
  const navigate = useNavigate()
  const [hasNotif, setHasNotif] = useState(true)

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-[var(--border)] bg-[var(--card)] px-5">
      <div className="flex flex-1 max-w-md items-center rounded-lg border border-[var(--border)] bg-[var(--page-background)] px-3 py-2 text-sm text-[var(--muted-foreground)]">
        <Search size={14} className="mr-2" />
        <input
          placeholder="Search servers, incidents, alerts..."
          className="w-full border-none bg-transparent text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--muted-foreground)]"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={() => navigate('/ai')}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[var(--active-nav-bg)]"
        >
          <Sparkles size={13} />
          <span>AI Search</span>
        </button>

        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]">
          <RefreshCw size={14} />
        </button>

        <button
          onClick={() => setHasNotif(false)}
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]"
        >
          <Bell size={15} />
          {hasNotif && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--danger)]" />}
        </button>

        <Link to="/" className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-semibold text-white">
          SM
        </Link>
      </div>
    </header>
  )
}

export default TopNav
