import { useState } from "react";
import { getDesktopApi } from "../../api/desktop";
import { useProjectStore } from "../../stores/projectStore";

export function ProjectsPage() {
  const { path, name, setProject } = useProjectStore();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const api = getDesktopApi();

  async function onOpen() {
    setError(null);
    const bridge = getDesktopApi();
    if (!bridge) {
      setError("Desktop bridge unavailable. Launch via pnpm dev (Electron).");
      return;
    }
    setBusy(true);
    try {
      const res = await bridge.openProject();
      if (!res.ok) {
        if (res.code === "canceled") {
          return;
        }
        setError(res.error);
        return;
      }
      setProject(res.path, res.name ?? null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel">
      <h1>Projects</h1>
      <p className="muted">
        Open a Salesforce DX folder (must contain a valid sfdx-project.json).
      </p>
      {!api && (
        <p className="callout warn">
          Preload bridge not detected. Use the Electron app (not the browser
          tab alone) for project actions.
        </p>
      )}
      <div className="row">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => void onOpen()}
          disabled={busy || !api}
        >
          {busy ? "Opening…" : "Open project…"}
        </button>
      </div>
      {(path || name) && (
        <div className="project-summary">
          {name && (
            <div>
              <span className="label">Name</span> {name}
            </div>
          )}
          {path && (
            <div>
              <span className="label">Path</span>{" "}
              <code className="path">{path}</code>
            </div>
          )}
        </div>
      )}
      {error && <p className="callout error">{error}</p>}
    </div>
  );
}
