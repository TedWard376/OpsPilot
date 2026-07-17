import type { RecommendationData } from '../data/dashboard'
import { ArrowRight, Zap, Lock, TrendingUp } from 'lucide-react'

/**
 * RecommendationCard Component
 * Presentational component that displays AI recommendations:
 * - Category icon (optimization, security, reliability)
 * - Title and description
 * - Impact level indicator
 * - Action button for future implementation
 */

interface RecommendationCardProps {
  recommendation: RecommendationData
  onAction?: () => void
}

const categoryConfig = {
  optimization: {
    icon: TrendingUp,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  security: {
    icon: Lock,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  reliability: {
    icon: Zap,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
}

const impactConfig = {
  high: 'bg-red-50 text-red-700',
  medium: 'bg-yellow-50 text-yellow-700',
  low: 'bg-blue-50 text-blue-700',
}

export function RecommendationCard({ recommendation, onAction }: RecommendationCardProps) {
  const categoryInfo = categoryConfig[recommendation.category]
  const CategoryIcon = categoryInfo.icon

  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-sm transition-colors hover:bg-[var(--page-background)]">
      <div className="flex items-start gap-3">
        <div className={`mt-1 rounded-lg p-2 ${categoryInfo.bg}`}>
          <CategoryIcon className={`h-4 w-4 ${categoryInfo.color}`} />
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-semibold text-[var(--foreground)]">{recommendation.title}</h4>
          <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">{recommendation.description}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${impactConfig[recommendation.impact]}`}>
          {recommendation.impact.charAt(0).toUpperCase() + recommendation.impact.slice(1)} impact
        </span>
        {onAction && (
          <button
            onClick={onAction}
            className="flex items-center gap-1 text-xs font-medium text-[var(--primary)] transition-colors hover:text-[#005a9e]"
          >
            Learn more
            <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}
