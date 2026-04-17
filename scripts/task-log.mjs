#!/usr/bin/env node

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();
const args = parseArgs(process.argv.slice(2));

if (args.help || args.h) {
  printHelp();
  process.exit(0);
}

try {
  const payload = buildLogPayload(args, rootDir);
  const output = writeLogFiles(payload, rootDir);

  console.log(`Task log created: ${output.markdownPath}`);
  console.log(`Task snapshot created: ${output.snapshotPath}`);
  console.log(`Task id: ${payload.taskId}`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

/**
 * Parses CLI arguments and supports repeated flags such as `--command`.
 * Boolean flags are treated as `true` when they do not provide a value.
 *
 * @param {string[]} rawArgs CLI arguments without the node executable and script path.
 * @returns {Record<string, string | string[] | boolean>} Parsed argument bag.
 */
function parseArgs(rawArgs) {
  /** @type {Record<string, string | string[] | boolean>} */
  const parsed = {};

  for (let index = 0; index < rawArgs.length; index += 1) {
    const token = rawArgs[index];

    if (!token.startsWith('--')) {
      throw new Error(`Unexpected argument "${token}". Use --help to view supported options.`);
    }

    const withoutPrefix = token.slice(2);

    if (!withoutPrefix) {
      throw new Error('Empty flag name is not allowed.');
    }

    if (withoutPrefix.includes('=')) {
      const separatorIndex = withoutPrefix.indexOf('=');
      const key = withoutPrefix.slice(0, separatorIndex);
      const value = withoutPrefix.slice(separatorIndex + 1);
      pushArgValue(parsed, key, value);
      continue;
    }

    const nextToken = rawArgs[index + 1];
    const hasValue = nextToken && !nextToken.startsWith('--');

    if (!hasValue) {
      parsed[withoutPrefix] = true;
      continue;
    }

    pushArgValue(parsed, withoutPrefix, nextToken);
    index += 1;
  }

  return parsed;
}

/**
 * Appends a value to the parsed argument bag and upgrades single values to arrays.
 *
 * @param {Record<string, string | string[] | boolean>} parsed Parsed argument bag.
 * @param {string} key Argument name without the `--` prefix.
 * @param {string} value Raw argument value.
 * @returns {void}
 */
function pushArgValue(parsed, key, value) {
  const current = parsed[key];

  if (current === undefined) {
    parsed[key] = value;
    return;
  }

  if (Array.isArray(current)) {
    current.push(value);
    return;
  }

  parsed[key] = [String(current), value];
}

/**
 * Builds the final task log payload by combining CLI input, environment metadata and repository snapshots.
 *
 * @param {Record<string, string | string[] | boolean>} parsed Parsed argument bag.
 * @param {string} workspaceRoot Repository root directory.
 * @returns {TaskLogPayload} Task log payload.
 */
function buildLogPayload(parsed, workspaceRoot) {
  const title = requireTextArg(parsed, 'title');
  const goal = requireTextArg(parsed, 'goal');
  const summary = requireTextArg(parsed, 'summary');
  const reproduction = getListArg(parsed, 'repro');

  if (reproduction.length === 0) {
    throw new Error('At least one --repro step is required so the task can be reproduced.');
  }

  const now = new Date();
  const taskId = createTaskId(now);
  const slug = slugify(title);
  const gitInfo = collectGitInfo(workspaceRoot);
  const changedFiles = collectChangedFiles(workspaceRoot);
  const workspacePackages = collectWorkspacePackages(workspaceRoot);
  const environment = collectEnvironmentSnapshot(workspaceRoot);

  return {
    taskId,
    slug,
    title,
    goal,
    summary,
    scope: getTextArg(parsed, 'scope') || 'repository',
    author: getTextArg(parsed, 'author') || 'Trae Agent',
    timestamp: now.toISOString(),
    tags: getListArg(parsed, 'tag'),
    commands: getListArg(parsed, 'command'),
    verification: getListArg(parsed, 'verify'),
    reproduction,
    notes: getListArg(parsed, 'note'),
    artifacts: getListArg(parsed, 'artifact'),
    gitInfo,
    changedFiles,
    environment,
    workspacePackages,
  };
}

/**
 * Returns a required string argument and trims surrounding whitespace.
 *
 * @param {Record<string, string | string[] | boolean>} parsed Parsed argument bag.
 * @param {string} key Argument name.
 * @returns {string} Trimmed value.
 */
function requireTextArg(parsed, key) {
  const value = getTextArg(parsed, key);

  if (!value) {
    throw new Error(`Missing required argument --${key}. Use --help to view supported options.`);
  }

  return value;
}

/**
 * Reads a single string argument and returns an empty string when the argument is absent.
 *
 * @param {Record<string, string | string[] | boolean>} parsed Parsed argument bag.
 * @param {string} key Argument name.
 * @returns {string} Trimmed value or an empty string.
 */
function getTextArg(parsed, key) {
  const value = parsed[key];

  if (Array.isArray(value)) {
    return String(value.at(-1) || '').trim();
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  return '';
}

/**
 * Reads repeated arguments and always returns a trimmed string array.
 *
 * @param {Record<string, string | string[] | boolean>} parsed Parsed argument bag.
 * @param {string} key Argument name.
 * @returns {string[]} Trimmed values.
 */
function getListArg(parsed, key) {
  const value = parsed[key];

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === 'string') {
    return [value.trim()].filter(Boolean);
  }

  return [];
}

/**
 * Generates a sortable task identifier from the current timestamp.
 *
 * @param {Date} date Task creation time.
 * @returns {string} Stable task identifier.
 */
function createTaskId(date) {
  return [
    'TASK',
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('');
}

/**
 * Converts the task title into a safe file slug.
 *
 * @param {string} text Raw title text.
 * @returns {string} Filesystem-safe slug.
 */
function slugify(text) {
  const slug = text
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  return slug || 'task';
}

/**
 * Collects Git metadata that is useful for traceability and rollback analysis.
 *
 * @param {string} workspaceRoot Repository root directory.
 * @returns {TaskGitInfo} Git metadata snapshot.
 */
function collectGitInfo(workspaceRoot) {
  return {
    branch: runCommand('git rev-parse --abbrev-ref HEAD', workspaceRoot),
    commit: runCommand('git rev-parse HEAD', workspaceRoot),
    shortCommit: runCommand('git rev-parse --short HEAD', workspaceRoot),
    status: runCommand('git status --short', workspaceRoot),
  };
}

/**
 * Collects the current working tree changes so the log can point to touched files.
 *
 * @param {string} workspaceRoot Repository root directory.
 * @returns {string[]} Changed files from `git status --short`.
 */
function collectChangedFiles(workspaceRoot) {
  const output = runCommand('git status --short', workspaceRoot);

  if (!output) {
    return [];
  }

  return output
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

/**
 * Captures the environment snapshot needed to reproduce the task later.
 *
 * @param {string} workspaceRoot Repository root directory.
 * @returns {TaskEnvironmentSnapshot} Environment metadata.
 */
function collectEnvironmentSnapshot(workspaceRoot) {
  const rootPackagePath = path.join(workspaceRoot, 'package.json');
  const rootPackage = JSON.parse(fs.readFileSync(rootPackagePath, 'utf8'));
  const pnpmLockPath = path.join(workspaceRoot, 'pnpm-lock.yaml');

  return {
    os: `${os.platform()} ${os.release()} ${os.arch()}`,
    cwd: workspaceRoot,
    nodeVersion: process.version,
    pnpmVersion: runCommand('pnpm --version', workspaceRoot),
    packageManager: rootPackage.packageManager || 'unknown',
    pnpmLockSha256: hashFileIfExists(pnpmLockPath),
  };
}

/**
 * Scans workspace package manifests so every log contains a package-version snapshot.
 *
 * @param {string} workspaceRoot Repository root directory.
 * @returns {TaskWorkspacePackage[]} Sorted workspace package metadata.
 */
function collectWorkspacePackages(workspaceRoot) {
  const packageDirs = ['apps', 'packages'];
  /** @type {TaskWorkspacePackage[]} */
  const results = [];

  for (const baseDir of packageDirs) {
    const targetDir = path.join(workspaceRoot, baseDir);

    if (!fs.existsSync(targetDir)) {
      continue;
    }

    const entries = fs.readdirSync(targetDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      const packagePath = path.join(targetDir, entry.name, 'package.json');

      if (!fs.existsSync(packagePath)) {
        continue;
      }

      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

      results.push({
        name: packageJson.name || entry.name,
        version: packageJson.version || '0.0.0',
        relativePath: path.relative(workspaceRoot, path.dirname(packagePath)).replace(/\\/g, '/'),
      });
    }
  }

  return results.sort((left, right) => left.name.localeCompare(right.name));
}

/**
 * Executes a shell command and returns trimmed output.
 * Command failures are converted into `unknown` so logging never blocks due to optional metadata.
 *
 * @param {string} command Shell command to execute.
 * @param {string} workspaceRoot Repository root directory.
 * @returns {string} Command output or `unknown`.
 */
function runCommand(command, workspaceRoot) {
  try {
    return execSync(command, {
      cwd: workspaceRoot,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8',
    }).trim();
  } catch {
    return 'unknown';
  }
}

/**
 * Calculates a SHA-256 digest for a file when it exists.
 *
 * @param {string} filePath Absolute file path.
 * @returns {string} Lowercase SHA-256 digest or `missing`.
 */
function hashFileIfExists(filePath) {
  if (!fs.existsSync(filePath)) {
    return 'missing';
  }

  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(fileBuffer).digest('hex');
}

/**
 * Writes both Markdown and JSON task logs and updates the shared task index.
 *
 * @param {TaskLogPayload} payload Task log payload.
 * @param {string} workspaceRoot Repository root directory.
 * @returns {{ markdownPath: string, snapshotPath: string }} Written file paths.
 */
function writeLogFiles(payload, workspaceRoot) {
  const date = payload.timestamp.slice(0, 10);
  const dayDir = path.join(workspaceRoot, '.trae', 'task-logs', date);
  fs.mkdirSync(dayDir, { recursive: true });

  const baseName = `${payload.taskId}-${payload.slug}`;
  const markdownPath = path.join(dayDir, `${baseName}.md`);
  const snapshotPath = path.join(dayDir, `${baseName}.json`);

  fs.writeFileSync(markdownPath, buildMarkdown(payload), 'utf8');
  fs.writeFileSync(snapshotPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');

  updateIndexFile(workspaceRoot, payload, markdownPath, snapshotPath);

  return { markdownPath, snapshotPath };
}

/**
 * Updates the log index so teammates can browse task history without scanning directories.
 *
 * @param {string} workspaceRoot Repository root directory.
 * @param {TaskLogPayload} payload Task log payload.
 * @param {string} markdownPath Written Markdown file path.
 * @param {string} snapshotPath Written JSON file path.
 * @returns {void}
 */
function updateIndexFile(workspaceRoot, payload, markdownPath, snapshotPath) {
  const indexPath = path.join(workspaceRoot, '.trae', 'task-logs', 'index.json');
  /** @type {TaskLogIndexEntry[]} */
  const current = fs.existsSync(indexPath)
    ? JSON.parse(fs.readFileSync(indexPath, 'utf8'))
    : [];

  current.unshift({
    taskId: payload.taskId,
    title: payload.title,
    scope: payload.scope,
    author: payload.author,
    timestamp: payload.timestamp,
    gitBranch: payload.gitInfo.branch,
    gitCommit: payload.gitInfo.shortCommit,
    markdownPath: normalizePath(path.relative(workspaceRoot, markdownPath)),
    snapshotPath: normalizePath(path.relative(workspaceRoot, snapshotPath)),
  });

  fs.writeFileSync(indexPath, `${JSON.stringify(current, null, 2)}\n`, 'utf8');
}

/**
 * Renders the Markdown task log document.
 *
 * @param {TaskLogPayload} payload Task log payload.
 * @returns {string} Markdown content.
 */
function buildMarkdown(payload) {
  const lines = [
    `# ${payload.taskId} ${payload.title}`,
    '',
    '## Metadata',
    '',
    `- Timestamp: ${payload.timestamp}`,
    `- Author: ${payload.author}`,
    `- Scope: ${payload.scope}`,
    `- Tags: ${payload.tags.length > 0 ? payload.tags.join(', ') : 'none'}`,
    `- Git Branch: ${payload.gitInfo.branch}`,
    `- Git Commit: ${payload.gitInfo.commit}`,
    '',
    '## Goal',
    '',
    payload.goal,
    '',
    '## Summary',
    '',
    payload.summary,
    '',
    '## Changed Files',
    '',
    ...renderList(payload.changedFiles, 'No working tree changes detected at log time.'),
    '',
    '## Commands Executed',
    '',
    ...renderList(payload.commands, 'No commands were recorded.'),
    '',
    '## Verification',
    '',
    ...renderList(payload.verification, 'No verification result was recorded.'),
    '',
    '## Reproduction Steps',
    '',
    ...renderList(payload.reproduction, 'No reproduction steps were recorded.'),
    '',
    '## Notes',
    '',
    ...renderList(payload.notes, 'No extra notes.'),
    '',
    '## Artifacts',
    '',
    ...renderList(payload.artifacts, 'No artifact paths were recorded.'),
    '',
    '## Environment Snapshot',
    '',
    `- OS: ${payload.environment.os}`,
    `- Working Directory: ${payload.environment.cwd}`,
    `- Node.js: ${payload.environment.nodeVersion}`,
    `- pnpm: ${payload.environment.pnpmVersion}`,
    `- Package Manager: ${payload.environment.packageManager}`,
    `- pnpm-lock SHA256: ${payload.environment.pnpmLockSha256}`,
    '',
    '## Workspace Package Snapshot',
    '',
    ...renderList(
      payload.workspacePackages.map(
        (workspacePackage) =>
          `${workspacePackage.name}@${workspacePackage.version} (${workspacePackage.relativePath})`,
      ),
      'No workspace packages were detected.',
    ),
    '',
    '## Git Status Snapshot',
    '',
    '```text',
    payload.gitInfo.status || 'clean',
    '```',
    '',
  ];

  return `${lines.join('\n')}\n`;
}

/**
 * Converts raw items to Markdown bullet points.
 *
 * @param {string[]} items Content items.
 * @param {string} emptyMessage Fallback when the list is empty.
 * @returns {string[]} Markdown lines.
 */
function renderList(items, emptyMessage) {
  if (items.length === 0) {
    return [`- ${emptyMessage}`];
  }

  return items.map((item) => `- ${item}`);
}

/**
 * Normalizes Windows paths into slash-separated repository paths.
 *
 * @param {string} value Relative path.
 * @returns {string} Normalized path.
 */
function normalizePath(value) {
  return value.replace(/\\/g, '/');
}

/**
 * Formats integers as two-digit strings.
 *
 * @param {number} value Number to pad.
 * @returns {string} Padded value.
 */
function pad(value) {
  return String(value).padStart(2, '0');
}

/**
 * Prints CLI help and required arguments.
 *
 * @returns {void}
 */
function printHelp() {
  const helpText = `
Usage:
  pnpm run task:log -- --title "Task title" --goal "Target" --summary "Outcome" --repro "Step 1"

Required:
  --title     Task title
  --goal      Original task goal
  --summary   Final delivery summary
  --repro     Reproduction step, can be repeated

Optional:
  --scope     Task scope, defaults to "repository"
  --author    Task owner, defaults to "Trae Agent"
  --tag       Task tag, can be repeated
  --command   Executed command, can be repeated
  --verify    Verification result, can be repeated
  --note      Extra note, can be repeated
  --artifact  Related file or preview path, can be repeated
  --help      Show this message
`;

  console.log(helpText.trim());
}

/**
 * @typedef {Object} TaskGitInfo
 * @property {string} branch
 * @property {string} commit
 * @property {string} shortCommit
 * @property {string} status
 */

/**
 * @typedef {Object} TaskEnvironmentSnapshot
 * @property {string} os
 * @property {string} cwd
 * @property {string} nodeVersion
 * @property {string} pnpmVersion
 * @property {string} packageManager
 * @property {string} pnpmLockSha256
 */

/**
 * @typedef {Object} TaskWorkspacePackage
 * @property {string} name
 * @property {string} version
 * @property {string} relativePath
 */

/**
 * @typedef {Object} TaskLogPayload
 * @property {string} taskId
 * @property {string} slug
 * @property {string} title
 * @property {string} goal
 * @property {string} summary
 * @property {string} scope
 * @property {string} author
 * @property {string} timestamp
 * @property {string[]} tags
 * @property {string[]} commands
 * @property {string[]} verification
 * @property {string[]} reproduction
 * @property {string[]} notes
 * @property {string[]} artifacts
 * @property {TaskGitInfo} gitInfo
 * @property {string[]} changedFiles
 * @property {TaskEnvironmentSnapshot} environment
 * @property {TaskWorkspacePackage[]} workspacePackages
 */

/**
 * @typedef {Object} TaskLogIndexEntry
 * @property {string} taskId
 * @property {string} title
 * @property {string} scope
 * @property {string} author
 * @property {string} timestamp
 * @property {string} gitBranch
 * @property {string} gitCommit
 * @property {string} markdownPath
 * @property {string} snapshotPath
 */
