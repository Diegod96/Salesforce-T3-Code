export interface KeyValueStore {
  get(key: string): Promise<string | undefined>;
  set(key: string, value: string): Promise<void>;
}

/** In-memory store until SQLite is wired (see plan.md persistence). */
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
