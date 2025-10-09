import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePlanStore } from '../store/planStore';
import { generateAgentPlan } from '../lib/planGenerator';
import { channelOptions, planFormSchema, type PlanFormData, type PlanFormValues } from '../lib/validation';
import type { AgentPlan } from '../types/plan';

const goalOptions = [
  { value: 'awareness', label: 'Brand awareness' },
  { value: 'engagement', label: 'Community engagement' },
  { value: 'conversion', label: 'Conversions & sales' },
  { value: 'retention', label: 'Customer retention' },
  { value: 'thoughtLeadership', label: 'Thought leadership' }
];

const cadenceRecommendations: Record<string, number> = {
  instagram: 3,
  tiktok: 4,
  linkedin: 2,
  twitter: 5,
  youtube: 1,
  facebook: 3,
  newsletter: 1
};

export function BuilderPage(): JSX.Element {
  const addPlan = usePlanStore((state) => state.addPlan);
  const [latestPlan, setLatestPlan] = useState<AgentPlan | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<PlanFormValues, unknown, PlanFormData>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: 'Launch Sprint',
      audience: 'Early adopter product managers seeking AI co-pilots',
      brandVoice: 'Confident, energetic, forward-looking',
      primaryGoal: 'awareness',
      durationWeeks: 6,
      contentPillarsInput: 'Product education, User wins, Behind-the-scenes',
      metricsInput: 'Follower growth, Engagement rate, Click-through rate',
      notes: '',
      channels: [
        { channel: 'instagram', cadence: cadenceRecommendations.instagram, automationPreference: 'assisted' },
        { channel: 'linkedin', cadence: cadenceRecommendations.linkedin, automationPreference: 'manual' },
        { channel: 'newsletter', cadence: cadenceRecommendations.newsletter, automationPreference: 'manual' }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'channels' });
  const selectedChannels = watch('channels') ?? [];

  const onSubmit = (data: PlanFormData) => {
    const plan = generateAgentPlan(data);
    addPlan(plan);
    setLatestPlan(plan);
  };

  const toggleChannel = (channel: string) => {
    const index = selectedChannels.findIndex((item) => item.channel === channel);
    if (index === -1) {
      append({ channel, cadence: cadenceRecommendations[channel] ?? 2, automationPreference: 'assisted' });
    } else {
      remove(index);
    }
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <form
        className="space-y-6 rounded-3xl border border-white/10 bg-surface/70 p-6 shadow-xl shadow-black/30"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <h2 className="text-xl font-semibold text-white">Plan blueprint</h2>
          <p className="text-sm text-slate-300">Capture the strategy inputs and let the generator craft the channel orchestration.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-slate-300">Plan name</span>
            <input
              className="rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-white placeholder:text-slate-500"
              placeholder="AI launch sprint"
              {...register('name')}
            />
            {errors.name && <span className="mt-1 text-xs text-red-300">{errors.name.message}</span>}
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 text-slate-300">Duration (weeks)</span>
            <input
              type="number"
              min={1}
              max={52}
              className="rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-white placeholder:text-slate-500"
              {...register('durationWeeks')}
            />
            {errors.durationWeeks && <span className="mt-1 text-xs text-red-300">{errors.durationWeeks.message}</span>}
          </label>
        </div>

        <label className="flex flex-col text-sm">
          <span className="mb-1 text-slate-300">Audience</span>
          <textarea
            rows={3}
            className="rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-white placeholder:text-slate-500"
            placeholder="Describe your primary audience persona"
            {...register('audience')}
          />
          {errors.audience && <span className="mt-1 text-xs text-red-300">{errors.audience.message}</span>}
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-1 text-slate-300">Brand voice cues</span>
          <input
            className="rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-white placeholder:text-slate-500"
            placeholder="e.g. Bold, witty, optimistic"
            {...register('brandVoice')}
          />
          {errors.brandVoice && <span className="mt-1 text-xs text-red-300">{errors.brandVoice.message}</span>}
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-1 text-slate-300">Primary goal</span>
          <select
            className="rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-white"
            {...register('primaryGoal')}
          >
            {goalOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.primaryGoal && <span className="mt-1 text-xs text-red-300">{errors.primaryGoal.message}</span>}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col text-sm">
            <span className="mb-1 text-slate-300">Content pillars</span>
            <textarea
              rows={3}
              className="rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-white placeholder:text-slate-500"
              placeholder="Comma or line separated values"
              {...register('contentPillarsInput')}
            />
            {errors.contentPillarsInput && <span className="mt-1 text-xs text-red-300">{errors.contentPillarsInput.message}</span>}
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 text-slate-300">Success metrics</span>
            <textarea
              rows={3}
              className="rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-white placeholder:text-slate-500"
              placeholder="Comma or line separated values"
              {...register('metricsInput')}
            />
            {errors.metricsInput && <span className="mt-1 text-xs text-red-300">{errors.metricsInput.message}</span>}
          </label>
        </div>

        <label className="flex flex-col text-sm">
          <span className="mb-1 text-slate-300">Additional notes</span>
          <textarea
            rows={2}
            className="rounded-xl border border-white/10 bg-surface-subtle px-4 py-3 text-white placeholder:text-slate-500"
            placeholder="Constraints, campaign ideas, partnerships, etc."
            {...register('notes')}
          />
          {errors.notes && <span className="mt-1 text-xs text-red-300">{errors.notes.message}</span>}
        </label>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-white">Channels</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {channelOptions.map((option) => {
              const isSelected = selectedChannels.some((item) => item.channel === option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleChannel(option.value)}
                  className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                    isSelected
                      ? 'border-primary bg-primary/20 text-white shadow-lg shadow-primary/20'
                      : 'border-white/10 bg-white/5 text-slate-200 hover:border-primary/40'
                  }`}
                >
                  <span>{option.label}</span>
                  <span className="text-xs text-slate-300">{cadenceRecommendations[option.value] ?? 2}/wk</span>
                </button>
              );
            })}
          </div>
          {errors.channels && <span className="mt-2 block text-xs text-red-300">{errors.channels.message}</span>}
        </fieldset>

        {fields.length > 0 && (
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-medium text-white">Cadence & automation guardrails</p>
            {fields.map((field, index) => (
              <div key={field.id} className="grid gap-3 rounded-xl bg-surface-subtle/60 p-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase text-slate-400">Channel</p>
                  <p className="text-sm text-white">{field.channel}</p>
                </div>
                <label className="flex flex-col text-sm">
                  <span className="mb-1 text-slate-300">Cadence / week</span>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    className="rounded-xl border border-white/10 bg-surface px-3 py-2 text-white"
                    {...register(`channels.${index}.cadence` as const)}
                  />
                </label>
                <label className="flex flex-col text-sm">
                  <span className="mb-1 text-slate-300">Automation mode</span>
                  <select
                    className="rounded-xl border border-white/10 bg-surface px-3 py-2 text-white"
                    {...register(`channels.${index}.automationPreference` as const)}
                  >
                    <option value="manual">Manual</option>
                    <option value="assisted">Assisted</option>
                    <option value="autonomous">Autonomous</option>
                  </select>
                </label>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-full bg-primary px-6 py-3 text-base font-semibold text-white shadow-xl shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Generating...' : 'Generate agent plan'}
        </button>
      </form>

      <aside className="space-y-4">
        <div className="rounded-3xl border border-primary/20 bg-primary/10 p-6">
          <h3 className="text-lg font-semibold text-white">Real-time rationale</h3>
          <p className="mt-2 text-sm text-slate-200">
            As you capture your inputs, the generator synthesizes channel guardrails, automation comfort levels, and messaging
            tone so your AI agents never improvise outside the brief.
          </p>
        </div>

        {latestPlan ? (
          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6">
            <h4 className="text-base font-semibold text-white">Latest plan snapshot</h4>
            <p className="text-sm text-slate-200">{latestPlan.deliverableSummary}</p>
            <div className="space-y-2 text-sm text-slate-200">
              {latestPlan.channels.map((channel) => (
                <div key={channel.id} className="rounded-2xl border border-white/10 bg-surface px-3 py-2">
                  <p className="font-medium capitalize">{channel.channel}</p>
                  <p className="text-xs text-slate-300">
                    {channel.cadencePerWeek}x per week · {channel.automationLevel} automation · {channel.contentPillars.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-6 text-sm text-slate-300">
            Generate a plan to preview orchestration details here.
          </div>
        )}
      </aside>
    </section>
  );
}
