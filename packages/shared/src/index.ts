import { z } from "zod";

export const OrgSummarySchema = z.object({
  alias: z.string(),
  username: z.string().optional(),
  instanceUrl: z.string().optional(),
  isDefault: z.boolean().optional(),
});

export type OrgSummary = z.infer<typeof OrgSummarySchema>;

export type OpenProjectResult =
  | { ok: true; path: string; name?: string }
  | {
      ok: false;
      error: string;
      code?: "canceled" | "invalid";
    };

export type ListAuthorizedOrgsResult =
  | { ok: true; orgs: OrgSummary[] }
  | { ok: false; error: string };

export type WorkspaceState = {
  projectPath: string | null;
  projectName: string | null;
  defaultOrgAlias: string | null;
};

export const AgentPlanStepSchema = z.object({
  id: z.string(),
  description: z.string(),
  kind: z.enum(["read", "edit", "cli", "git"]),
  requiresApproval: z.boolean(),
});

export type AgentPlanStep = z.infer<typeof AgentPlanStepSchema>;

export type PlanDraftPayload = {
  summary: string;
  steps: AgentPlanStep[];
};

export const AgentTaskSchema = z.object({
  id: z.string(),
  prompt: z.string(),
  targetOrgAlias: z.string().optional(),
  createdAt: z.string(),
});

export type AgentTask = z.infer<typeof AgentTaskSchema>;
