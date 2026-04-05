import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import {
  getWorkspaceState,
  openWorkspaceDb,
  setWorkspaceDefaultOrgAlias,
  setWorkspaceProject,
} from "@salesforce-agent/persistence-sqlite";
import { readFile } from "node:fs/promises";
import path from "node:path";

const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);

async function validateSfdxProjectRoot(dir: string): Promise<
  { ok: true; name?: string } | { ok: false; error: string }
> {
  const manifestPath = path.join(dir, "sfdx-project.json");
  try {
    const raw = await readFile(manifestPath, "utf8");
    const data = JSON.parse(raw) as Record<string, unknown>;
    const dirs = data.packageDirectories;
    if (!Array.isArray(dirs) || dirs.length === 0) {
      return {
        ok: false,
        error:
          "sfdx-project.json must include a non-empty packageDirectories array.",
      };
    }
    const name =
      typeof data.name === "string" && data.name.length > 0
        ? data.name
        : undefined;
    return { ok: true, name };
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === "ENOENT") {
      return {
        ok: false,
        error: "Not a Salesforce DX project: sfdx-project.json not found.",
      };
    }
    if (e instanceof SyntaxError) {
      return { ok: false, error: "sfdx-project.json is not valid JSON." };
    }
    return {
      ok: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

function registerIpc(): void {
  ipcMain.handle("t3:getWorkspaceState", () => {
    return getWorkspaceState();
  });

  ipcMain.handle("t3:setDefaultOrgAlias", (_e, alias: unknown) => {
    if (alias !== null && typeof alias !== "string") {
      return { ok: false as const, error: "Invalid org alias." };
    }
    const trimmed = alias === null || alias === "" ? null : alias.trim();
    setWorkspaceDefaultOrgAlias(trimmed);
    return { ok: true as const };
  });

  ipcMain.handle("t3:draftPlan", async (_e, prompt: unknown) => {
    const text = typeof prompt === "string" ? prompt : "";
    const { draftStubPlan } = await import("@salesforce-agent/agent-service");
    return draftStubPlan(text);
  });

  ipcMain.handle("t3:openProject", async () => {
    const focused = BrowserWindow.getFocusedWindow();
    const options: Electron.OpenDialogOptions = {
      properties: ["openDirectory"],
      title: "Open Salesforce DX project",
    };
    const pick =
      focused != null
        ? await dialog.showOpenDialog(focused, options)
        : await dialog.showOpenDialog(options);
    if (pick.canceled || pick.filePaths.length === 0) {
      return {
        ok: false as const,
        error: "No folder selected.",
        code: "canceled" as const,
      };
    }
    const dir = pick.filePaths[0]!;
    const check = await validateSfdxProjectRoot(dir);
    if (!check.ok) {
      return {
        ok: false as const,
        error: check.error,
        code: "invalid" as const,
      };
    }
    setWorkspaceProject(dir, check.name ?? null);
    return { ok: true as const, path: dir, name: check.name };
  });

  ipcMain.handle("t3:listAuthorizedOrgs", async () => {
    const { listAuthorizedOrgs } = await import(
      "@salesforce-agent/salesforce-core"
    );
    return listAuthorizedOrgs();
  });
}

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 840,
    webPreferences: {
      preload: path.join(__dirname, "..", "preload", "index.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    void shell.openExternal(url);
    return { action: "deny" };
  });

  if (isDev) {
    const url = process.env.VITE_DEV_SERVER_URL!;
    void win.loadURL(url);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    const indexHtml = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "apps",
      "renderer",
      "dist",
      "index.html",
    );
    void win.loadFile(indexHtml);
  }
}

void app.whenReady().then(() => {
  openWorkspaceDb(app.getPath("userData"));
  registerIpc();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
