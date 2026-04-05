import { contextBridge, ipcRenderer } from "electron";
import type {
  ListAuthorizedOrgsResult,
  OpenProjectResult,
} from "@salesforce-agent/shared";

contextBridge.exposeInMainWorld("t3", {
  platform: process.platform,
  openProject: (): Promise<OpenProjectResult> =>
    ipcRenderer.invoke("t3:openProject"),
  listAuthorizedOrgs: (): Promise<ListAuthorizedOrgsResult> =>
    ipcRenderer.invoke("t3:listAuthorizedOrgs"),
});
