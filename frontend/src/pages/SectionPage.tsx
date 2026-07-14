type PlaceholderPageProps = {
  title: string
  description?: string
}

function PlaceholderPage({ title, description = 'This section is ready for future content.' }: PlaceholderPageProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-medium text-sky-700">Section placeholder</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{description}</p>
    </section>
  )
}

export default PlaceholderPage
