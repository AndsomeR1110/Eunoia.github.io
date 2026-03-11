import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";

const workspaceRoot = process.cwd();
const ignoredDirectories = [
  ".git",
  ".next",
  "coverage",
  "node_modules",
  "out",
  "public",
];
const ignoredFiles = new Set([
  ".env.example",
  "package-lock.json",
]);

const patterns = [
  {
    label: "OpenAI-style key",
    regex: /\bsk-[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    label: "Credential assignment",
    regex:
      /\b(?:api[_-]?key|secret|token|password)\b\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{16,}["']?/gi,
  },
  {
    label: "Bearer token",
    regex: /\bBearer\s+[A-Za-z0-9._=-]{20,}\b/g,
  },
];

const allowedValueHints = [
  "example",
  "placeholder",
  "changeme",
  "change-this-before-production",
  "your-",
  "demo",
  "test",
];

function listCandidateFiles() {
  const outputs = [];

  try {
    outputs.push(
      execFileSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACMR"], {
        encoding: "utf8",
        cwd: workspaceRoot,
      }),
    );
    outputs.push(
      execFileSync("git", ["ls-files"], {
        encoding: "utf8",
        cwd: workspaceRoot,
      }),
    );
  } catch (error) {
    console.error("Unable to list git files for secret scan.");
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  return [...new Set(outputs.join("\n").split(/\r?\n/).filter(Boolean))];
}

function shouldSkipFile(relativePath) {
  if (ignoredFiles.has(relativePath)) {
    return true;
  }

  const segments = relativePath.split(/[\\/]/);
  return segments.some((segment) => ignoredDirectories.includes(segment));
}

function isProbablyBinary(relativePath) {
  const extension = path.extname(relativePath).toLowerCase();
  return [".ico", ".jpg", ".jpeg", ".png", ".pdf", ".zip"].includes(extension);
}

function looksLikeRealSecret(match) {
  const normalized = match.toLowerCase();
  return !allowedValueHints.some((hint) => normalized.includes(hint));
}

const findings = [];

for (const relativePath of listCandidateFiles()) {
  if (shouldSkipFile(relativePath) || isProbablyBinary(relativePath)) {
    continue;
  }

  const absolutePath = path.join(workspaceRoot, relativePath);

  try {
    if (!statSync(absolutePath).isFile()) {
      continue;
    }
  } catch {
    continue;
  }

  const content = readFileSync(absolutePath, "utf8");
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      return;
    }

    for (const pattern of patterns) {
      pattern.regex.lastIndex = 0;
      const matches = trimmed.match(pattern.regex);

      if (!matches) {
        continue;
      }

      const suspiciousMatch = matches.find(looksLikeRealSecret);

      if (!suspiciousMatch) {
        continue;
      }

      findings.push({
        file: relativePath,
        line: index + 1,
        label: pattern.label,
        preview: trimmed.slice(0, 140),
      });
      break;
    }
  });
}

if (findings.length > 0) {
  console.error("Secret scan failed. Remove hard-coded credentials before pushing code:\n");

  for (const finding of findings) {
    console.error(
      `- ${finding.file}:${finding.line} [${finding.label}] ${finding.preview}`,
    );
  }

  process.exit(1);
}

console.log("Secret scan passed.");
