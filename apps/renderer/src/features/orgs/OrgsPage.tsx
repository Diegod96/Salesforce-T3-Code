import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getDesktopApi } from "../../api/desktop";
import { useWorkspaceStore } from "../../stores/workspaceStore";
import { workspaceQueryKey } from "../../workspace/WorkspaceHydrator";

export function OrgsPage() {
  const api = getDesktopApi();
  const queryClient = useQueryClient();
  const appDefaultAlias = useWorkspaceStore((s) => s.defaultOrgAlias);
  const setStoreDefault = useWorkspaceStore((s) => s.setDefaultOrgAlias);
  const [busyAlias, setBusyAlias] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["authorized-orgs"],
    queryFn: async () => {
      const bridge = getDesktopApi();
      if (!bridge) {
        throw new Error("Desktop bridge unavailable.");
      }
      return bridge.listAuthorizedOrgs();
    },
    enabled: Boolean(api),
  });

  async function setAppDefault(alias: string) {
    const bridge = getDesktopApi();
    if (!bridge) return;
    setErrMsg(null);
    setBusyAlias(alias);
    try {
      const res = await bridge.setDefaultOrgAlias(alias);
      if (!res.ok) {
        setErrMsg(res.error);
        return;
      }
      setStoreDefault(alias);
      await queryClient.invalidateQueries({ queryKey: workspaceQueryKey });
    } finally {
      setBusyAlias(null);
    }
  }

  async function clearAppDefault() {
    const bridge = getDesktopApi();
    if (!bridge) return;
    setErrMsg(null);
    setBusyAlias("__clear__");
    try {
      const res = await bridge.setDefaultOrgAlias(null);
      if (!res.ok) {
        setErrMsg(res.error);
        return;
      }
      setStoreDefault(null);
      await queryClient.invalidateQueries({ queryKey: workspaceQueryKey });
    } finally {
      setBusyAlias(null);
    }
  }

  if (!api) {
    return (
      <div className="panel">
        <h1>Orgs</h1>
        <p className="callout warn">
          Preload bridge not detected. Launch via pnpm dev (Electron).
        </p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h1>Orgs</h1>
      <p className="muted">
        Authorized orgs from <code>sf org list authorized --json</code>. Set an
        app default for tasks (stored locally).
      </p>
      {appDefaultAlias ? (
        <p className="muted">
          App default org: <strong>{appDefaultAlias}</strong>
          <button
            type="button"
            className="btn btn-inline"
            onClick={() => void clearAppDefault()}
            disabled={busyAlias !== null}
          >
            Clear
          </button>
        </p>
      ) : (
        <p className="muted">No app default org selected.</p>
      )}
      <div className="row">
        <button
          type="button"
          className="btn"
          onClick={() => void q.refetch()}
          disabled={q.isFetching}
        >
          {q.isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      {errMsg && <p className="callout error">{errMsg}</p>}
      {q.isError && (
        <p className="callout error">
          {q.error instanceof Error ? q.error.message : String(q.error)}
        </p>
      )}
      {q.data && !q.data.ok && (
        <p className="callout error">{q.data.error}</p>
      )}
      {q.data?.ok && q.data.orgs.length === 0 && (
        <p className="muted">No authorized orgs found. Run sf org login.</p>
      )}
      {q.data?.ok && q.data.orgs.length > 0 && (
        <ul className="org-list">
          {q.data.orgs.map((o) => {
            const alias = o.alias || "";
            const isAppDefault = Boolean(
              appDefaultAlias && alias === appDefaultAlias,
            );
            return (
              <li key={`${o.alias}-${o.username ?? ""}`} className="org-row">
                <span className="org-alias">{o.alias || "(no alias)"}</span>
                {o.isDefault && <span className="pill">cli default</span>}
                {isAppDefault && <span className="pill pill-app">app</span>}
                {o.username && (
                  <span className="org-meta muted">{o.username}</span>
                )}
                {o.instanceUrl && (
                  <span className="org-meta muted">{o.instanceUrl}</span>
                )}
                {alias ? (
                  <button
                    type="button"
                    className="btn btn-small"
                    disabled={busyAlias !== null || isAppDefault}
                    onClick={() => void setAppDefault(alias)}
                  >
                    {busyAlias === alias ? "Saving…" : "Use as app default"}
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
