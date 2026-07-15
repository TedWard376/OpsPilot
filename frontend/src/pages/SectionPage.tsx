type PlaceholderPageProps = {
  title: string
  description?: string
  pageId?: string
}

const SUMMARY_CARDS = [
  { title: 'Status', value: 'Healthy', tone: 'bg-[var(--active-nav-bg)] text-[var(--primary)]' },
  { title: 'Attention', value: '3 alerts', tone: 'bg-[#FEF2F2] text-[#B91C1C]' },
  { title: 'Coverage', value: '99.8%', tone: 'bg-[#ECFDF3] text-[#15803D]' },
] as const

function PlaceholderPage({ title, description = 'This section is ready for future content.', pageId = 'dashboard' }: PlaceholderPageProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--primary)]">OpsPilot</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)]">{title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">{description}</p>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {renderCards(pageId)}
      </div>
    </section>
  )
}

function renderCards(pageId: string) {
  return SUMMARY_CARDS.map((card) => (
    <div key={card.title} className="rounded-xl border border-[var(--border)] bg-[var(--page-background)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted-foreground)]">{card.title}</p>
      <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-sm font-semibold ${card.tone}`}>{card.value}</p>
      <p className="mt-3 text-sm text-[var(--muted-foreground)]">{pageId === 'dashboard' ? 'Operational overview for the last 24 hours.' : 'The shell is ready for the next section-specific dashboard.'}</p>
    </div>
  ))
}

export default PlaceholderPage
