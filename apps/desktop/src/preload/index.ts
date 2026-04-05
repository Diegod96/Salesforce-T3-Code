import { contextBridge, ipcRenderer } from "electron";
import type {
  ListAuthorizedOrgsResult,
  OpenProjectResult,
  PlanDraftPayload,
  WorkspaceState,
} from "@salesforce-agent/shared";

contextBridge.exposeInMainWorld("t3", {
  platform: process.platform,
  getWorkspaceState: (): Promise<WorkspaceState> =>
    ipcRenderer.invoke("t3:getWorkspaceState"),
  setDefaultOrgAlias: (
    alias: string | null,
  ): Promise<{ ok: true } | { ok: false; error: string }> =>
    ipcRenderer.invoke("t3:setDefaultOrgAlias", alias),
  draftPlan: (prompt: string): Promise<PlanDraftPayload> =>
    ipcRenderer.invoke("t3:draftPlan", prompt),
  openProject: (): Promise<OpenProjectResult> =>
    ipcRenderer.invoke("t3:openProject"),
  listAuthorizedOrgs: (): Promise<ListAuthorizedOrgsResult> =>
    ipcRenderer.invoke("t3:listAuthorizedOrgs"),
});
