import { mkdirSync } from "fs";
import { resolve } from "path";
import { spawnSync } from "child_process";

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, {
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

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function main() {
  const databaseUrl = process.env.BACKUP_DATABASE_URL ?? requireEnv("DATABASE_URL");
  const backupDir = resolve(process.env.BACKUP_DIR ?? "backups");
  const output = resolve(process.env.BACKUP_FILE ?? `${backupDir}/enterpriseerp-${timestamp()}.dump`);

  mkdirSync(backupDir, { recursive: true });

  run("pg_dump", ["--format=custom", "--no-owner", "--no-acl", "--file", output, databaseUrl]);

  console.log(JSON.stringify({ status: "backup-created", output, generatedAt: new Date().toISOString() }, null, 2));
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
