import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("t3", {
  platform: process.platform,
});
