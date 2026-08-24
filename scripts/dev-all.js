const { spawn } = require("node:child_process");
const http = require("node:http");
const net = require("node:net");

function cleanEnv(env) {
  return Object.fromEntries(
    Object.entries(env).filter(([key, value]) => key && !key.startsWith("=") && value !== undefined)
  );
}

let shuttingDown = false;

function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, "0.0.0.0");
  });
}

function canReach(url) {
  return new Promise((resolve) => {
    const request = http.get(url, (response) => {
      response.resume();
      resolve(true);
    });

    request.on("error", () => resolve(false));
    request.setTimeout(1000, () => {
      request.destroy();
      resolve(false);
    });
  });
}

async function findAvailablePort(startPort) {
  let port = startPort;

  while (!(await isPortAvailable(port))) {
    port += 1;
  }

  return port;
}

function startProcess(processConfig) {
  const child = spawn(processConfig.command, {
    cwd: process.cwd(),
    env: cleanEnv({
      ...process.env,
      ...processConfig.env,
    }),
    shell: true,
    stdio: ["inherit", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => {
    process.stdout.write(`[${processConfig.name}] ${chunk}`);
  });

  child.stderr.on("data", (chunk) => {
    process.stderr.write(`[${processConfig.name}] ${chunk}`);
  });

  child.on("exit", (code) => {
    if (code && !shuttingDown) {
      console.error(`[${processConfig.name}] exited with code ${code}`);
      shutdown(code);
    }
  });

  return child;
}

const children = [];

async function main() {
  const requestedApiPort = Number(process.env.API_PORT ?? 4000);
  const requestedWebPort = Number(process.env.WEB_PORT ?? process.env.PORT ?? 3000);
  const existingWebUrl = `http://localhost:${requestedWebPort}`;
  const existingApiUrl = `http://localhost:${requestedApiPort}`;
  const hasExistingWebServer = await canReach(existingWebUrl);
  const hasExistingApiServer = await canReach(`${existingApiUrl}/health`);
  const apiPort = hasExistingApiServer ? requestedApiPort : await findAvailablePort(requestedApiPort);
  const webPort = hasExistingWebServer ? requestedWebPort : await findAvailablePort(requestedWebPort);
  const apiUrl = `http://localhost:${apiPort}`;

  console.log(`API: ${apiUrl}${hasExistingApiServer ? " (existing API server)" : ""}`);
  console.log(`Web: http://localhost:${webPort}${hasExistingWebServer ? " (existing Next server)" : ""}`);

  if (!hasExistingApiServer) {
    children.push(
      startProcess({
        name: "api",
        command: "npm --prefix services/api run dev",
        env: {
          PORT: String(apiPort),
        },
      })
    );
  }

  if (!hasExistingWebServer) {
    children.push(
      startProcess({
        name: "web",
        command: "npm --prefix apps/web run dev",
        env: {
          PORT: String(webPort),
          NEXT_PUBLIC_API_URL: apiUrl,
        },
      })
    );
  }
}

function shutdown(code = 0) {
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }

  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

main().catch((error) => {
  console.error(error);
  shutdown(1);
});
