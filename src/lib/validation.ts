import { z } from 'zod';
import type { ChannelType } from '../types/plan';

export const channelOptions: { value: ChannelType; label: string }[] = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'X / Twitter' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'newsletter', label: 'Email Newsletter' }
];

export const planFormSchema = z.object({
  name: z.string().min(2, 'Plan name is required'),
  audience: z.string().min(5, 'Audience description is required'),
  brandVoice: z.string().min(3, 'Brand voice is required'),
  primaryGoal: z
    .enum(['awareness', 'engagement', 'conversion', 'retention', 'thoughtLeadership'])
    .describe('Primary marketing objective'),
  durationWeeks: z
    .coerce
    .number({ invalid_type_error: 'Duration must be a number' })
    .min(1)
    .max(52),
  contentPillarsInput: z
    .string()
    .min(3, 'Add at least one content pillar')
    .transform(splitToList),
  metricsInput: z
    .string()
    .min(3, 'Add at least one metric')
    .transform(splitToList),
  notes: z.string().optional(),
  channels: z
    .array(
      z.object({
        channel: z.string(),
        cadence: z.coerce.number().min(1).max(14),
        automationPreference: z.enum(['manual', 'assisted', 'autonomous'])
      })
    )
    .min(1, 'Select at least one channel')
});

export type PlanFormSchema = typeof planFormSchema;
export type PlanFormValues = z.input<PlanFormSchema>;
export type PlanFormData = z.output<PlanFormSchema>;

function splitToList(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}
