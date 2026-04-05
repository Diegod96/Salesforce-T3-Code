import type { PlanDraftPayload } from "@salesforce-agent/shared";

export type PlanDraft = PlanDraftPayload;

export function draftStubPlan(prompt: string): PlanDraftPayload {
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
