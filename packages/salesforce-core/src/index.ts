import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { ListAuthorizedOrgsResult, OrgSummary } from "@salesforce-agent/shared";
import { OrgSummarySchema } from "@salesforce-agent/shared";

const execFileAsync = promisify(execFile);

export type ListOrgsResult = ListAuthorizedOrgsResult;

function parseOrgListJson(raw: string): OrgSummary[] {
  const data = JSON.parse(raw) as { result?: unknown[] };
  const rows = data.result ?? [];
  return rows
    .map((row) => {
      const rec = row as Record<string, unknown>;
      return OrgSummarySchema.safeParse({
        alias: String(rec.alias ?? rec.orgId ?? ""),
        username: rec.username != null ? String(rec.username) : undefined,
        instanceUrl:
          rec.instanceUrl != null
            ? String(rec.instanceUrl)
            : rec.loginUrl != null
              ? String(rec.loginUrl)
              : undefined,
        isDefault: Boolean(rec.isDefaultUsername || rec.defaultMarker),
      });
    })
    .filter((r) => r.success)
    .map((r) => r.data);
}

export async function listAuthorizedOrgs(): Promise<ListAuthorizedOrgsResult> {
  try {
    const { stdout } = await execFileAsync(
      "sf",
      ["org", "list", "authorized", "--json"],
      { maxBuffer: 10 * 1024 * 1024 },
    );
    return { ok: true, orgs: parseOrgListJson(stdout) };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, error: message };
  }
}
