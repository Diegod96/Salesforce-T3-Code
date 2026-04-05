import { z } from "zod";

export const OrgSummarySchema = z.object({
  alias: z.string(),
  username: z.string().optional(),
  instanceUrl: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type OrgSummary = z.infer<typeof OrgSummarySchema>;

export const AgentPlanStepSchema = z.object({
  id: z.string(),
  description: z.string(),
  kind: z.enum(["read", "edit", "cli", "git"]),
  requiresApproval: z.boolean(),
});

export type AgentPlanStep = z.infer<typeof AgentPlanStepSchema>;

export const AgentTaskSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  targetOrgAlias: z.string().optional(),
  createdAt: z.string(),
});

export type AgentTask = z.infer<typeof AgentTaskSchema>;
