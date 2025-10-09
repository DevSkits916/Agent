import { describe, expect, it } from 'vitest';
import { generateAgentPlan } from './planGenerator';
import type { PlanFormData } from './validation';

const baseInput: PlanFormData = {
  name: 'Test plan',
  audience: 'Developers exploring AI workflows',
  brandVoice: 'Helpful and precise',
  primaryGoal: 'awareness',
  durationWeeks: 4,
  contentPillarsInput: ['Education', 'Product news'],
  metricsInput: ['Reach'],
  notes: 'Focus on transparency',
  channels: [
    { channel: 'twitter', cadence: 5, automationPreference: 'autonomous' },
    { channel: 'newsletter', cadence: 1, automationPreference: 'manual' }
  ]
};

describe('generateAgentPlan', () => {
  it('creates agent plan with merged content pillars', () => {
    const plan = generateAgentPlan(baseInput);
    expect(plan.channels[0]?.contentPillars).toContain('Education');
    expect(plan.channels[0]?.contentPillars).toContain('Product news');
  });

  it('clamps cadence between 1 and 14', () => {
    const plan = generateAgentPlan({
      ...baseInput,
      channels: baseInput.channels.map((channel) => ({ ...channel, cadence: 99 }))
    });
    expect(plan.channels.every((channel) => channel.cadencePerWeek === 14)).toBe(true);
  });
});
