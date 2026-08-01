import { Sparkles } from 'lucide-react'
import type { AIAssistantPlaceholder } from '../../../types/documentation'

interface AIAssistantPanelProps {
  assistant: AIAssistantPlaceholder
}

export function AIAssistantPanel({ assistant }: AIAssistantPanelProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-[var(--border)] bg-[var(--active-nav-bg)] px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-white">
          <Sparkles size={16} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-[var(--foreground)]">AI Assistant</h2>
          <p className="text-xs text-[var(--muted-foreground)]">Ask a question about this document</p>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <p className="text-sm leading-6 text-[var(--foreground)]">{assistant.summary}</p>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted-foreground)]">Try asking</h4>
          <div className="mt-2 flex flex-col gap-2">
            {assistant.suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                disabled
                className="cursor-not-allowed rounded-lg border border-[var(--border)] bg-[var(--page-background)] px-3 py-2 text-left text-sm text-[var(--foreground)] opacity-70"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
