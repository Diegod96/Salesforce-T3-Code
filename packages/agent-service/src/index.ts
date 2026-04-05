import type { AgentPlanStep } from "@salesforce-agent/shared";

export type PlanDraft = {
  summary: string;
  steps: AgentPlanStep[];
};

export function draftStubPlan(prompt: string): PlanDraft {
  return {
    summary: `Review and approve steps for: ${prompt.slice(0, 200)}`,
    steps: [
      {
        id: "1",
        description: "Analyze repository structure and sfdx-project.json",
        kind: "read",
        requiresApproval: false,
      },
      {
        id: "2",
        description: "Propose file edits (local only until approved)",
        kind: "edit",
        requiresApproval: true,
      },
      {
        id: "3",
        description: "Run approved Salesforce CLI commands against target org",
        kind: "cli",
        requiresApproval: true,
      },
    ],
  };
}
