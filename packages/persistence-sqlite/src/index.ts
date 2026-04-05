export type { WorkspaceState } from "@salesforce-agent/shared";
export {
  getWorkspaceState,
  openWorkspaceDb,
  setWorkspaceDefaultOrgAlias,
  setWorkspaceProject,
} from "./workspace-db";

export interface KeyValueStore {
  get(key: string): Promise<string | undefined>;
  set(key: string, value: string): Promise<void>;
}

/** In-memory store for tests or fallbacks. */
export function createMemoryStore(): KeyValueStore {
  const map = new Map<string, string>();
  return {
    async get(key: string) {
      return map.get(key);
    },
    async set(key: string, value: string) {
      map.set(key, value);
    },
  };
}
