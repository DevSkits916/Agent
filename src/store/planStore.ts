import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AgentPlan } from '../types/plan';

interface PlanState {
  plans: AgentPlan[];
  selectedPlanId?: string;
  addPlan: (plan: AgentPlan) => void;
  removePlan: (id: string) => void;
  selectPlan: (id?: string) => void;
  updatePlan: (plan: AgentPlan) => void;
  importPlans: (plans: AgentPlan[]) => void;
  reset: () => void;
}

interface StorageShape {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
}

const memoryStorage = (): StorageShape => {
  const store = new Map<string, string>();
  return {
    getItem: (name) => store.get(name) ?? null,
    setItem: (name, value) => {
      store.set(name, value);
    },
    removeItem: (name) => {
      store.delete(name);
    }
  };
};

const storage = createJSONStorage<PlanState>(() => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return memoryStorage();
});

export const usePlanStore = create<PlanState>()(
  persist(
    (set, get) => ({
      plans: [],
      selectedPlanId: undefined,
      addPlan: (plan) =>
        set(({ plans }) => ({
          plans: [plan, ...plans],
          selectedPlanId: plan.id
        })),
      removePlan: (id) =>
        set(({ plans, selectedPlanId }) => ({
          plans: plans.filter((plan) => plan.id !== id),
          selectedPlanId: selectedPlanId === id ? undefined : selectedPlanId
        })),
      selectPlan: (id) => set({ selectedPlanId: id }),
      updatePlan: (plan) =>
        set(({ plans }) => ({
          plans: plans.map((item) => (item.id === plan.id ? plan : item)),
          selectedPlanId: plan.id
        })),
      importPlans: (plans) => {
        const existing = get().plans;
        const mergedPlans = [...plans, ...existing.filter((plan) => !plans.some((p) => p.id === plan.id))];
        set({ plans: mergedPlans, selectedPlanId: mergedPlans[0]?.id });
      },
      reset: () => set({ plans: [], selectedPlanId: undefined })
    }),
    {
      name: 'agent-plan-storage',
      version: 1,
      storage
    }
  )
);
