import { create } from "zustand";

type ProjectState = {
  path: string | null;
  name: string | null;
  setProject: (path: string | null, name: string | null) => void;
};

export const useProjectStore = create<ProjectState>((set) => ({
  path: null,
  name: null,
  setProject: (projectPath, projectName) =>
    set({ path: projectPath, name: projectName }),
}));
