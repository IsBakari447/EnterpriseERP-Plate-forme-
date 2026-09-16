import { existsSync } from "fs";
import { resolve } from "path";
import { spawnSync } from "child_process";

const forbiddenProductionHosts = [/enterpriseerp.*prod/i, /enterpriseerp-api/i, /render\.com/i];

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function run(command: string, args: string[], cwd = process.cwd(), env: NodeJS.ProcessEnv = process.env) {
  const result = spawnSync(command, args, {
    cwd,
    env,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${command} exited with code ${result.status ?? "unknown"}.`);
  }
}

function assertSafeRestoreTarget(databaseUrl: string) {
  if (process.env.RESTORE_CONFIRM !== "I_UNDERSTAND") {
    throw new Error("Set RESTORE_CONFIRM=I_UNDERSTAND to confirm this destructive restore.");
  }

  if (process.env.ALLOW_PRODUCTION_RESTORE === "true") {
    throw new Error("Refusing production restore. Use a disposable staging database only.");
  }

  const parsed = new URL(databaseUrl);
  const target = `${parsed.hostname}${parsed.pathname}`;
  const looksDisposable =
    /staging|stage|restore|drill|test|ci|temporary|temp/i.test(target) ||
    ["localhost", "127.0.0.1"].includes(parsed.hostname);

  if (!looksDisposable || forbiddenProductionHosts.some((pattern) => pattern.test(target))) {
    throw new Error(`Refusing to restore into unsafe target: ${parsed.hostname}${parsed.pathname}`);
  }
}

function main() {
  const backupFile = resolve(requireEnv("BACKUP_FILE"));
  const restoreUrl = requireEnv("RESTORE_DATABASE_URL");
  const start = Date.now();

  if (!existsSync(backupFile)) {
    throw new Error(`BACKUP_FILE does not exist: ${backupFile}`);
  }

  assertSafeRestoreTarget(restoreUrl);

  run("pg_restore", ["--clean", "--if-exists", "--no-owner", "--no-acl", "--dbname", restoreUrl, backupFile]);
  run("npm", ["run", "prisma:deploy"], process.cwd(), { ...process.env, DATABASE_URL: restoreUrl });

  console.log(
    JSON.stringify(
      {
        status: "restore-complete",
        backupFile,
        restoredAt: new Date().toISOString(),
        restoreDurationSeconds: Math.round((Date.now() - start) / 1000),
      },
      null,
      2
    )
  );
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
