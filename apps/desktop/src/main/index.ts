import { app, BrowserWindow, shell } from "electron";
import path from "node:path";

const isDev = Boolean(process.env.VITE_DEV_SERVER_URL);

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
