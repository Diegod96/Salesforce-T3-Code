import { useQuery } from "@tanstack/react-query";
import { getDesktopApi } from "../../api/desktop";

export function OrgsPage() {
  const api = getDesktopApi();
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
        Authorized orgs from <code>sf org list authorized --json</code>.
      </p>
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
          {q.data.orgs.map((o) => (
            <li key={`${o.alias}-${o.username ?? ""}`} className="org-row">
              <span className="org-alias">{o.alias || "(no alias)"}</span>
              {o.isDefault && <span className="pill">default</span>}
              {o.username && (
                <span className="org-meta muted">{o.username}</span>
              )}
              {o.instanceUrl && (
                <span className="org-meta muted">{o.instanceUrl}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
