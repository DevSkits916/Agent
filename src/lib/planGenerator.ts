import { nanoid } from '../utils/nanoid';
import type { AgentPlan, ChannelPlan, ChannelType } from '../types/plan';
import type { PlanFormData } from './validation';

const channelDefaults: Record<ChannelType, Omit<ChannelPlan, 'id'>> = {
  instagram: {
    channel: 'instagram',
    cadencePerWeek: 3,
    contentPillars: ['Behind-the-scenes', 'Community highlights'],
    toneGuidance: 'Vibrant, personable, authentic',
    primaryCallToAction: 'Drive profile visits and story replies',
    automationLevel: 'assisted',
    assetFormats: ['Reels', 'Stories', 'Carousel']
  },
  tiktok: {
    channel: 'tiktok',
    cadencePerWeek: 4,
    contentPillars: ['Trends remix', 'Educational tips'],
    toneGuidance: 'Playful, quick, trend-aware',
    primaryCallToAction: 'Encourage follows and comments',
    automationLevel: 'assisted',
    assetFormats: ['Short-form video', 'Live sessions']
  },
  linkedin: {
    channel: 'linkedin',
    cadencePerWeek: 2,
    contentPillars: ['Thought leadership', 'Case studies'],
    toneGuidance: 'Confident, insightful, B2B-friendly',
    primaryCallToAction: 'Generate leads and conversation',
    automationLevel: 'manual',
    assetFormats: ['Articles', 'Carousel', 'Documents']
  },
  twitter: {
    channel: 'twitter',
    cadencePerWeek: 5,
    contentPillars: ['Hot takes', 'Micro updates'],
    toneGuidance: 'Witty, concise, timely',
    primaryCallToAction: 'Spark replies and reposts',
    automationLevel: 'autonomous',
    assetFormats: ['Threads', 'Spaces']
  },
  youtube: {
    channel: 'youtube',
    cadencePerWeek: 1,
    contentPillars: ['Deep dives', 'Explain-it-like-I’m-five'],
    toneGuidance: 'Educational, story-driven',
    primaryCallToAction: 'Drive subscribers and watch time',
    automationLevel: 'manual',
    assetFormats: ['Long-form video', 'YouTube Shorts']
  },
  facebook: {
    channel: 'facebook',
    cadencePerWeek: 3,
    contentPillars: ['Community Q&A', 'Announcements'],
    toneGuidance: 'Friendly, informative',
    primaryCallToAction: 'Engage comments and shares',
    automationLevel: 'assisted',
    assetFormats: ['Live video', 'Events', 'Posts']
  },
  newsletter: {
    channel: 'newsletter',
    cadencePerWeek: 1,
    contentPillars: ['Curated insights', 'Product updates'],
    toneGuidance: 'Editorial, value-first',
    primaryCallToAction: 'Drive click-through to site',
    automationLevel: 'manual',
    assetFormats: ['Email digest', 'Automations']
  }
};

const goalDeliverableMap: Record<string, string> = {
  awareness: 'Top-of-funnel campaigns emphasizing storytelling and reach.',
  engagement: 'Interactive formats, live activations, and community-driven prompts.',
  conversion: 'Offer-driven narratives with strong calls-to-action and retargeting.',
  retention: 'Lifecycle messaging to keep existing audience delighted and informed.',
  thoughtLeadership: 'Long-form insights, data storytelling, and expert POVs.'
};

export function generateAgentPlan(input: PlanFormData): AgentPlan {
  const createdAt = new Date().toISOString();

  const channels = input.channels.map<ChannelPlan>(({ channel, cadence, automationPreference }) => {
    const defaults = channelDefaults[channel as ChannelType];
    const cadenceAdjusted = Math.max(1, Math.min(14, cadence));

    return {
      id: nanoid(),
      ...defaults,
      channel: channel as ChannelType,
      cadencePerWeek: cadenceAdjusted,
      automationLevel: automationPreference,
      contentPillars: mergeDistinct(defaults.contentPillars, input.contentPillarsInput),
      toneGuidance: `${defaults.toneGuidance}. Infuse ${input.brandVoice} voice.`,
      primaryCallToAction: defaults.primaryCallToAction,
      assetFormats: defaults.assetFormats
    };
  });

  const plan: AgentPlan = {
    id: nanoid(),
    name: input.name,
    audience: input.audience,
    brandVoice: input.brandVoice,
    goals: [input.primaryGoal],
    durationWeeks: input.durationWeeks,
    metrics: input.metricsInput,
    notes: input.notes,
    channels,
    deliverableSummary: buildDeliverablesSummary(input),
    createdAt,
    updatedAt: createdAt
  };

  return plan;
}

function buildDeliverablesSummary(input: PlanFormData): string {
  const goalSummary = goalDeliverableMap[input.primaryGoal] ?? 'Balanced channel mix with adaptive messaging.';
  const cadenceTotal = input.channels.reduce((sum, c) => sum + c.cadence, 0);
  return `Plan spans ${input.durationWeeks} weeks with ${cadenceTotal} touchpoints per week across ${input.channels.length} channels. ${goalSummary}`;
}

function mergeDistinct(base: string[], additions: string[]): string[] {
  const set = new Set<string>();
  base.forEach((value) => set.add(value));
  additions.forEach((value) => set.add(value));
  return Array.from(set);
}
