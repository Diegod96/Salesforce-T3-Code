import type { WorkspaceState } from "@salesforce-agent/shared";
import { create } from "zustand";

type WorkspaceStore = WorkspaceState & {
  hydrate: (state: WorkspaceState) => void;
  setProject: (path: string | null, name: string | null) => void;
  setDefaultOrgAlias: (alias: string | null) => void;
};

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  projectPath: null,
  projectName: null,
  defaultOrgAlias: null,
  hydrate: (state) => set({ ...state }),
  setProject: (projectPath, projectName) =>
    set({ projectPath, projectName }),
  setDefaultOrgAlias: (defaultOrgAlias) => set({ defaultOrgAlias }),
}));
