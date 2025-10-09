import { useMemo, useState } from 'react';
import { usePlanStore } from '../store/planStore';
import type { AgentPlan } from '../types/plan';

const defaultPersona = 'Product manager evaluating automation solutions';
const defaultAngle = 'Spotlight how the AI agent reduces busywork while staying on-brand';
const defaultCta = 'Invite readers to download the launch checklist';

export function PromptComposerPage(): JSX.Element {
  const plans = usePlanStore((state) => state.plans);
  const selectedPlanId = usePlanStore((state) => state.selectedPlanId);
  const selectPlan = usePlanStore((state) => state.selectPlan);

  const activePlan: AgentPlan | undefined = useMemo(() => {
    if (selectedPlanId) return plans.find((plan) => plan.id === selectedPlanId);
    return plans[0];
  }, [plans, selectedPlanId]);

  const [persona, setPersona] = useState(defaultPersona);
  const [angle, setAngle] = useState(defaultAngle);
  const [cta, setCta] = useState(defaultCta);
  const [copied, setCopied] = useState(false);

  const prompt = activePlan
    ? buildPrompt({ plan: activePlan, persona, angle, cta })
    : 'Create a plan first to compose prompts that align with your orchestration brief.';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      alert(`Copy failed: ${(error as Error).message}`);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-white">Prompt Composer</h2>
            <p className="text-sm text-slate-300">Generate channel-ready instructions that encode your guardrails.</p>
          </div>
          <select
            value={activePlan?.id ?? ''}
            onChange={(event) => selectPlan(event.target.value)}
            className="rounded-full border border-white/20 bg-surface px-3 py-2 text-sm text-white"
          >
            <option value="">Select plan</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>

        <label className="flex flex-col text-sm">
          <span className="mb-1 text-slate-300">Audience persona</span>
          <textarea
            value={persona}
            onChange={(event) => setPersona(event.target.value)}
            rows={2}
            className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-white"
          />
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-1 text-slate-300">Content angle</span>
          <textarea
            value={angle}
            onChange={(event) => setAngle(event.target.value)}
            rows={2}
            className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-white"
          />
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-1 text-slate-300">Call to action</span>
          <input
            value={cta}
            onChange={(event) => setCta(event.target.value)}
            className="rounded-xl border border-white/10 bg-surface px-4 py-3 text-white"
          />
        </label>
      </div>

      <div className="flex flex-col gap-4 rounded-3xl border border-primary/30 bg-surface/70 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Prompt preview</h3>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg shadow-primary/40"
            disabled={!activePlan}
          >
            {copied ? 'Copied!' : 'Copy prompt'}
          </button>
        </div>
        <pre className="max-h-[480px] overflow-auto whitespace-pre-wrap rounded-2xl bg-black/40 p-4 text-sm text-slate-100">
          {prompt}
        </pre>
      </div>
    </section>
  );
}

function buildPrompt({ plan, persona, angle, cta }: { plan: AgentPlan; persona: string; angle: string; cta: string }): string {
  const channelDetails = plan.channels
    .map(
      (channel) =>
        `- ${channel.channel.toUpperCase()}: ${channel.cadencePerWeek}x/week, automation=${channel.automationLevel}, pillars=${channel.contentPillars.join(', ')}`
    )
    .join('\n');

  return `You are an AI marketing agent collaborating with human stakeholders.\n\nPlan: ${plan.name}\nAudience: ${plan.audience}\nBrand voice: ${plan.brandVoice}\nPrimary goal: ${plan.goals.join(', ')}\nDuration: ${plan.durationWeeks} weeks\nSuccess metrics: ${plan.metrics.join(', ')}\n\nAudience persona focus: ${persona}\nContent angle: ${angle}\nCall to action: ${cta}\n\nChannel guardrails:\n${channelDetails}\n\nInstructions:\n1. Propose content ideas tailored to each channel while respecting cadence and automation modes.\n2. Surface experimentation ideas and note required assets.\n3. Outline success indicators per channel aligning with the metrics.\n4. Highlight cross-channel storytelling beats that create narrative cohesion.\n5. Provide compliance watchouts and escalation triggers.`;
}
