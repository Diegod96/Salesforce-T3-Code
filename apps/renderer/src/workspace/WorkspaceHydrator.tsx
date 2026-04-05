import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { getDesktopApi } from "../api/desktop";
import { useWorkspaceStore } from "../stores/workspaceStore";

export const workspaceQueryKey = ["t3-workspace"] as const;

export function WorkspaceHydrator() {
  const api = getDesktopApi();
  const hydrate = useWorkspaceStore((s) => s.hydrate);

  const q = useQuery({
    queryKey: workspaceQueryKey,
    queryFn: async () => {
      const bridge = getDesktopApi();
      if (!bridge) {
        throw new Error("Desktop bridge unavailable.");
      }
      return bridge.getWorkspaceState();
    },
    enabled: Boolean(api),
  });

  useEffect(() => {
    if (q.data) {
      hydrate(q.data);
    }
  }, [q.data, hydrate]);

  return null;
}
