import { useMemo } from 'react';
import { usePlanStore } from '../store/planStore';

export function ExportPage(): JSX.Element {
  const plans = usePlanStore((state) => state.plans);
  const selectedPlanId = usePlanStore((state) => state.selectedPlanId);

  const plan = useMemo(() => plans.find((item) => item.id === selectedPlanId) ?? plans[0], [plans, selectedPlanId]);

  const exportPayload = plan
    ? JSON.stringify({ plan, exportedAt: new Date().toISOString(), version: '1.0.0' }, null, 2)
    : '// Generate or import a plan to export configuration';

  const handleDownload = () => {
    if (!plan) return;
    const blob = new Blob([exportPayload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${plan.name.replace(/\s+/g, '-')}-export.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white">Exports & handoff</h2>
        <p className="mt-2 text-sm text-slate-300">
          This JSON is safe to share with collaborators or other automation platforms. It encodes channel guardrails, cadence
          assumptions, and automation permissions. No posting actions are included.
        </p>
        <button
          type="button"
          onClick={handleDownload}
          disabled={!plan}
          className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-medium text-white shadow-lg shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Download JSON
        </button>
      </div>
      <pre className="max-h-[520px] overflow-auto rounded-3xl border border-white/10 bg-black/40 p-6 text-xs text-emerald-200">
        {exportPayload}
      </pre>
    </section>
  );
}
