import { readFile, writeFile } from "node:fs/promises";

export async function readTextFile(path: string): Promise<string> {
  return readFile(path, "utf8");
}

export async function writeTextFile(path: string, contents: string): Promise<void> {
  await writeFile(path, contents, "utf8");
}
