import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getDesktopApi } from "../../api/desktop";
import { useWorkspaceStore } from "../../stores/workspaceStore";
import { workspaceQueryKey } from "../../workspace/WorkspaceHydrator";

export function ProjectsPage() {
  const { projectPath, projectName, setProject } = useWorkspaceStore();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const api = getDesktopApi();
  const queryClient = useQueryClient();

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
      await queryClient.invalidateQueries({ queryKey: workspaceQueryKey });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel">
      <h1>Projects</h1>
      <p className="muted">
        Open a Salesforce DX folder (must contain a valid sfdx-project.json).
        The choice is saved locally for the next launch.
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
      {(projectPath || projectName) && (
        <div className="project-summary">
          {projectName && (
            <div>
              <span className="label">Name</span> {projectName}
            </div>
          )}
          {projectPath && (
            <div>
              <span className="label">Path</span>{" "}
              <code className="path">{projectPath}</code>
            </div>
          )}
        </div>
      )}
      {error && <p className="callout error">{error}</p>}
    </div>
  );
}
