import { Link } from 'react-router-dom'

function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white shadow-sm">
            OP
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-900">OpsPilot</p>
          </div>
        </Link>

        <div className="flex flex-1 items-center">
          <label className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500 shadow-sm">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="6" />
              <path d="m20 20-4.2-4.2" />
            </svg>
            <input
              type="text"
              placeholder="Search servers, incidents, alerts..."
              className="w-full border-none bg-transparent text-sm text-slate-700 outline-none"
            />
          </label>
        </div>

        <div className="ml-4 flex items-center gap-3">
          <button className="hidden items-center gap-2 rounded-full px-3 py-1 text-sm text-sky-600 hover:bg-slate-50 md:flex">AI Search</button>

          <button aria-label="Refresh" className="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 md:flex">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 1 1-3.22-6.58" />
              <path d="M21 3v6h-6" />
            </svg>
          </button>

          <button aria-label="Notifications" className="relative h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50 flex">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 1 1 12 0c0 4 2 5 2 5H4s2-1 2-5" />
              <path d="M10 18a2 2 0 0 0 4 0" />
            </svg>
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-rose-600 text-[10px] text-white" />
          </button>

          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-sky-500 text-sm font-semibold text-white shadow-sm">SM</div>
        </div>
      </div>
    </header>
  )
}

export default TopNav
