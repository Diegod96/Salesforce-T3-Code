import simpleGit from "simple-git";

export function openGit(baseDir: string) {
  return simpleGit(baseDir);
}

export type { SimpleGit } from "simple-git";
