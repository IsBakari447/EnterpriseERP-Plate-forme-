const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const root = path.resolve(__dirname, "..");
const nextCache = path.join(root, ".next");

if (fs.existsSync(nextCache)) {
  try {
    fs.rmSync(nextCache, { recursive: true, force: true });
    console.log("Removed stale Next cache.");
  } catch (error) {
    console.warn("Could not remove .next. If the page shows a runtime cache error, stop the old dev server and run npm run dev again.");
    console.warn(error instanceof Error ? error.message : error);
  }
}

const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const port = process.env.PORT || "3000";
const host = process.env.NEXT_HOST || "0.0.0.0";
const child = spawn(process.execPath, [nextBin, "dev", "--hostname", host, "--port", port], {
  cwd: root,
  env: process.env,
  stdio: "inherit",
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
