const ALLOWED_SF_PREFIXES = [
  "org list",
  "project ",
  "soql ",
  "apex ",
  "data ",
  "deploy ",
  "retrieve ",
];

export function isSfInvocationAllowed(command: string): boolean {
  const trimmed = command.trim().toLowerCase();
  if (!trimmed.startsWith("sf ")) {
    return false;
  }
  const rest = trimmed.slice(3).trimStart();
  return ALLOWED_SF_PREFIXES.some((p) => rest.startsWith(p));
}
