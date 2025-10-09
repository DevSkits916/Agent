import type { AgentPlan } from '../types/plan';
import { formatDistanceToNow } from '../lib/time';

interface PlanSummaryCardProps {
  plan: AgentPlan;
  onSelect?: (plan: AgentPlan) => void;
  onRemove?: (plan: AgentPlan) => void;
  isActive?: boolean;
}

export function PlanSummaryCard({ plan, onSelect, onRemove, isActive }: PlanSummaryCardProps): JSX.Element {
  return (
    <article
      className={`rounded-2xl border ${isActive ? 'border-primary/70 bg-white/10' : 'border-white/5 bg-white/5'} p-5 shadow-inner`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
          <p className="text-sm text-slate-300">{plan.audience}</p>
          <p className="mt-2 text-xs uppercase tracking-wide text-primary-light">
            {plan.channels.length} channels · {plan.durationWeeks} week campaign
          </p>
        </div>
        <div className="text-right text-xs text-slate-400">
          <p>Updated {formatDistanceToNow(plan.updatedAt)} ago</p>
          <p>{plan.metrics.join(', ')}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-slate-200">{plan.deliverableSummary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {plan.channels.map((channel) => (
          <span key={channel.id} className="rounded-full bg-surface-subtle px-3 py-1 text-xs text-slate-200">
            {channel.channel} · {channel.cadencePerWeek}/wk
          </span>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2 text-sm">
        {onSelect && (
          <button
            type="button"
            onClick={() => onSelect(plan)}
            className="rounded-full bg-primary px-4 py-2 font-medium text-white shadow-lg shadow-primary/30"
          >
            Open
          </button>
        )}
        {onRemove && (
          <button
            type="button"
            onClick={() => onRemove(plan)}
            className="rounded-full border border-red-400/60 px-4 py-2 text-red-300 hover:bg-red-500/10"
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
