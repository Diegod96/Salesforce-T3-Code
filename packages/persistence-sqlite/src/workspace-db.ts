import type { WorkspaceState } from "@salesforce-agent/shared";
import Database from "better-sqlite3";
import path from "node:path";

let db: Database.Database | null = null;

export function openWorkspaceDb(userDataDir: string): void {
  if (db) {
    return;
  }
  const file = path.join(userDataDir, "salesforce-t3-code.db");
  const database = new Database(file);
  database.pragma("journal_mode = WAL");
  database.exec(`
    CREATE TABLE IF NOT EXISTS workspace (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      project_path TEXT,
      project_name TEXT,
      default_org_alias TEXT
    );
    INSERT OR IGNORE INTO workspace (id, project_path, project_name, default_org_alias)
    VALUES (1, NULL, NULL, NULL);
  `);
  db = database;
}

function requireDb(): Database.Database {
  if (!db) {
    throw new Error("Workspace database not initialized; call openWorkspaceDb first.");
  }
  return db;
}

export function getWorkspaceState(): WorkspaceState {
  const row = requireDb()
    .prepare(
      "SELECT project_path AS projectPath, project_name AS projectName, default_org_alias AS defaultOrgAlias FROM workspace WHERE id = 1",
    )
    .get() as {
    projectPath: string | null;
    projectName: string | null;
    defaultOrgAlias: string | null;
  };
  return {
    projectPath: row.projectPath,
    projectName: row.projectName,
    defaultOrgAlias: row.defaultOrgAlias,
  };
}

export function setWorkspaceProject(
  projectPath: string | null,
  projectName: string | null,
): void {
  requireDb()
    .prepare("UPDATE workspace SET project_path = ?, project_name = ? WHERE id = 1")
    .run(projectPath, projectName);
}

export function setWorkspaceDefaultOrgAlias(alias: string | null): void {
  requireDb()
    .prepare("UPDATE workspace SET default_org_alias = ? WHERE id = 1")
    .run(alias);
}
