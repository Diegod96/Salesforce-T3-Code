/** Narrow window API exposed by Electron preload (context bridge). */
export type DesktopApi = {
  platform: NodeJS.Platform;
  openProject: () => Promise<import("@salesforce-agent/shared").OpenProjectResult>;
  listAuthorizedOrgs: () => Promise<
    import("@salesforce-agent/shared").ListAuthorizedOrgsResult
  >;
};

export function getDesktopApi(): DesktopApi | null {
  const t3 = window.t3;
  if (!t3?.openProject || !t3.listAuthorizedOrgs) {
    return null;
  }
  return t3 as DesktopApi;
}
