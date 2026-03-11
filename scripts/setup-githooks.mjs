import { execFileSync } from "node:child_process";

try {
  execFileSync("git", ["rev-parse", "--git-dir"], {
    stdio: "ignore",
  });
} catch {
  process.exit(0);
}

try {
  execFileSync("git", ["config", "core.hooksPath", ".githooks"], {
    stdio: "ignore",
  });
  console.log("Configured git hooks at .githooks");
} catch (error) {
  console.warn(
    `Skipped git hook setup: ${error instanceof Error ? error.message : String(error)}`,
  );
}
