import { describe, expect, it } from 'vitest';
import { usePlanStore } from './planStore';
import type { AgentPlan } from '../types/plan';

const createPlan = (overrides?: Partial<AgentPlan>): AgentPlan => ({
  id: overrides?.id ?? 'plan-1',
  name: overrides?.name ?? 'Plan 1',
  audience: 'Audience',
  brandVoice: 'Voice',
  goals: ['awareness'],
  durationWeeks: 4,
  metrics: ['Reach'],
  notes: 'Notes',
  deliverableSummary: 'Summary',
  channels: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

describe('usePlanStore', () => {
  it('adds and removes plans', () => {
    const { addPlan, removePlan, plans } = usePlanStore.getState();
    expect(plans).toHaveLength(0);
    addPlan(createPlan());
    expect(usePlanStore.getState().plans).toHaveLength(1);
    removePlan('plan-1');
    expect(usePlanStore.getState().plans).toHaveLength(0);
  });
});
