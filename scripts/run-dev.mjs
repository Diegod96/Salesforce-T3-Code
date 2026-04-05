import { spawn } from "node:child_process";
import net from "node:net";

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.once("error", () => resolve(false));
    server.listen({ port, host: "127.0.0.1" }, () => {
      server.close(() => resolve(true));
    });
  });
}

async function pickPort(start = 5173, attempts = 30) {
  for (let i = 0; i < attempts; i++) {
    const port = start + i;
    if (await isPortFree(port)) return port;
  }
  throw new Error(
    `No free TCP port between ${start} and ${start + attempts - 1} on 127.0.0.1`,
  );
}

let port;
if (process.env.VITE_DEV_PORT) {
  port = Number(process.env.VITE_DEV_PORT);
  if (!Number.isFinite(port) || port < 1 || port > 65535) {
    console.error("[salesforce-t3-code] Invalid VITE_DEV_PORT");
    process.exit(1);
  }
} else {
  port = await pickPort();
  process.env.VITE_DEV_PORT = String(port);
}

console.error(
  `[salesforce-t3-code] VITE_DEV_PORT=${port} (export VITE_DEV_PORT to pin; free port auto-picked when unset)`,
);

const args = [
  "exec",
  "turbo",
  "run",
  "dev",
  "--filter=@salesforce-agent/renderer",
  "--filter=@salesforce-agent/desktop",
];

const child = spawn("pnpm", args, {
  stdio: "inherit",
  env: process.env,
});
child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
