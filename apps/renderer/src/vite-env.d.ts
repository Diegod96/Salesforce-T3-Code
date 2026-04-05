/// <reference types="vite/client" />

declare global {
  interface Window {
    t3?: {
      platform: NodeJS.Platform;
      getWorkspaceState: () => Promise<
        import("@salesforce-agent/shared").WorkspaceState
      >;
      setDefaultOrgAlias: (
        alias: string | null,
      ) => Promise<{ ok: true } | { ok: false; error: string }>;
      draftPlan: (
        prompt: string,
      ) => Promise<import("@salesforce-agent/shared").PlanDraftPayload>;
      openProject: () => Promise<
        import("@salesforce-agent/shared").OpenProjectResult
      >;
      listAuthorizedOrgs: () => Promise<
        import("@salesforce-agent/shared").ListAuthorizedOrgsResult
      >;
    };
  }
}

export {};
