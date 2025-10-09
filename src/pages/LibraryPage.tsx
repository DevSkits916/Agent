import { useMemo, useRef } from 'react';
import { usePlanStore } from '../store/planStore';
import { PlanSummaryCard } from '../components/PlanSummaryCard';
import type { AgentPlan } from '../types/plan';

export function LibraryPage(): JSX.Element {
  const { plans, removePlan, selectPlan, selectedPlanId, importPlans, reset } = usePlanStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedPlan = useMemo(() => plans.find((plan) => plan.id === selectedPlanId), [plans, selectedPlanId]);

  const handleExport = (plan: AgentPlan) => {
    const blob = new Blob([JSON.stringify({ plan, exportedAt: new Date().toISOString(), version: '1.0.0' }, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${plan.name.replace(/\s+/g, '-')}-agent-plan.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text) as unknown;
      const planPayload = normalizeImportPayload(data);
      if (planPayload.length === 0) {
        throw new Error('No valid plan found in file');
      }
      importPlans(planPayload);
    } catch (error) {
      alert(`Import failed: ${(error as Error).message}`);
    } finally {
      event.target.value = '';
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Plan library</h2>
          <p className="text-sm text-slate-300">Persisted locally via secure storage. Import or export JSON to collaborate.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          <button
            type="button"
            onClick={handleImportClick}
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-slate-100 hover:border-primary/50"
          >
            Import JSON
          </button>
          <button
            type="button"
            onClick={() => selectedPlan && handleExport(selectedPlan)}
            disabled={!selectedPlan}
            className="rounded-full bg-primary px-4 py-2 font-medium text-white shadow-lg shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Export selected
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-red-400/60 px-4 py-2 text-red-200 hover:bg-red-500/10"
          >
            Clear library
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          onChange={(event) => {
            void handleImport(event);
          }}
          className="hidden"
        />
      </div>

      {plans.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
          No saved plans yet. Generate a plan to populate your library.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <PlanSummaryCard
              key={plan.id}
              plan={plan}
              onSelect={() => selectPlan(plan.id)}
              onRemove={() => removePlan(plan.id)}
              isActive={plan.id === selectedPlanId}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function normalizeImportPayload(data: unknown): AgentPlan[] {
  if (Array.isArray(data)) {
    return data.filter(isAgentPlan);
  }
  if (isAgentPlan(data)) {
    return [data];
  }
  if (isPlanWrapper(data)) {
    return isAgentPlan(data.plan) ? [data.plan] : [];
  }
  return [];
}

function isPlanWrapper(value: unknown): value is { plan: unknown } {
  return typeof value === 'object' && value !== null && 'plan' in value;
}

function isAgentPlan(value: unknown): value is AgentPlan {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Partial<AgentPlan>;
  return typeof candidate.id === 'string' && typeof candidate.name === 'string' && Array.isArray(candidate.channels);
}
