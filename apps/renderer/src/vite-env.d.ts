/// <reference types="vite/client" />

declare global {
  interface Window {
    t3?: {
      platform: NodeJS.Platform;
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
