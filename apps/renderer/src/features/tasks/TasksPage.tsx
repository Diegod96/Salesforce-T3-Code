import type { PlanDraftPayload } from "@salesforce-agent/shared";
import { useState } from "react";
import { getDesktopApi } from "../../api/desktop";
import { useWorkspaceStore } from "../../stores/workspaceStore";

export function TasksPage() {
  const api = getDesktopApi();
  const projectPath = useWorkspaceStore((s) => s.projectPath);
  const defaultOrg = useWorkspaceStore((s) => s.defaultOrgAlias);
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanDraftPayload | null>(null);
  const [planApproved, setPlanApproved] = useState(false);

  async function onDraft() {
    setErr(null);
    const bridge = getDesktopApi();
    if (!bridge) {
      setErr("Desktop bridge unavailable.");
      return;
    }
    setBusy(true);
    setPlanApproved(false);
    try {
      const draft = await bridge.draftPlan(prompt);
      setPlan(draft);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function onApprove() {
    setPlanApproved(true);
  }

  function onReset() {
    setPlan(null);
    setPlanApproved(false);
    setErr(null);
  }

  if (!api) {
    return (
      <div className="panel">
        <h1>Tasks</h1>
        <p className="callout warn">
          Preload bridge not detected. Launch via pnpm dev (Electron).
        </p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h1>Tasks</h1>
      <p className="muted">
        Describe work in natural language. A plan is generated for review;{" "}
        <strong>approving the plan does not run CLI yet</strong>—that comes
        after policy checks in a later milestone.
      </p>
      <div className="context-strip muted">
        <span>
          Project:{" "}
          {projectPath ? <code className="path-inline">{projectPath}</code> : "—"}
        </span>
        <span>
          Target org: <strong>{defaultOrg ?? "—"}</strong>
        </span>
      </div>
      <label className="field-label" htmlFor="task-prompt">
        Task
      </label>
      <textarea
        id="task-prompt"
        className="field-textarea"
        rows={5}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Example: Add a validation rule on Contact.Email…"
      />
      <div className="row">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => void onDraft()}
          disabled={busy || !prompt.trim()}
        >
          {busy ? "Drafting…" : "Generate plan"}
        </button>
        {plan && (
          <button type="button" className="btn" onClick={onReset}>
            Clear
          </button>
        )}
      </div>
      {err && <p className="callout error">{err}</p>}
      {plan && (
        <div className="plan-panel">
          <h2 className="plan-heading">Plan</h2>
          <p className="plan-summary">{plan.summary}</p>
          <ol className="plan-steps">
            {plan.steps.map((step) => (
              <li key={step.id} className="plan-step">
                <div className="plan-step-head">
                  <span className={`kind kind-${step.kind}`}>{step.kind}</span>
                  {step.requiresApproval && (
                    <span className="pill">approval</span>
                  )}
                </div>
                <p className="plan-step-desc">{step.description}</p>
              </li>
            ))}
          </ol>
          <div className="row plan-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={onApprove}
              disabled={planApproved}
            >
              {planApproved ? "Plan approved" : "Approve plan"}
            </button>
          </div>
          {planApproved && (
            <p className="callout ok">
              Plan approved locally. Execution (edits / CLI) is gated until the
              next implementation step.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
