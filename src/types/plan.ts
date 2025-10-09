export type ChannelType =
  | 'instagram'
  | 'tiktok'
  | 'linkedin'
  | 'twitter'
  | 'youtube'
  | 'facebook'
  | 'newsletter';

export interface ChannelPlan {
  id: string;
  channel: ChannelType;
  cadencePerWeek: number;
  contentPillars: string[];
  toneGuidance: string;
  primaryCallToAction: string;
  automationLevel: 'manual' | 'assisted' | 'autonomous';
  assetFormats: string[];
}

export interface AgentPlan {
  id: string;
  name: string;
  audience: string;
  brandVoice: string;
  goals: string[];
  durationWeeks: number;
  metrics: string[];
  notes?: string;
  channels: ChannelPlan[];
  deliverableSummary: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlanExport {
  plan: AgentPlan;
  exportedAt: string;
  version: string;
}

export interface PromptTemplateInput {
  plan: AgentPlan;
  audiencePersona: string;
  contentAngle: string;
  callToAction: string;
}
