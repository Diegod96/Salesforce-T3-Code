import type {
  ListAuthorizedOrgsResult,
  OpenProjectResult,
  PlanDraftPayload,
  WorkspaceState,
} from "@salesforce-agent/shared";

/** Narrow window API exposed by Electron preload (context bridge). */
export type DesktopApi = {
  platform: NodeJS.Platform;
  getWorkspaceState: () => Promise<WorkspaceState>;
  setDefaultOrgAlias: (
    alias: string | null,
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  draftPlan: (prompt: string) => Promise<PlanDraftPayload>;
  openProject: () => Promise<OpenProjectResult>;
  listAuthorizedOrgs: () => Promise<ListAuthorizedOrgsResult>;
};

export function getDesktopApi(): DesktopApi | null {
  const t3 = window.t3;
  if (
    !t3?.openProject ||
    !t3?.listAuthorizedOrgs ||
    !t3?.getWorkspaceState ||
    !t3?.setDefaultOrgAlias ||
    !t3?.draftPlan
  ) {
    return null;
  }
  return t3 as DesktopApi;
}
