import fs from 'node:fs';
import path from 'node:path';

/**
 * @param {string} p
 */
function toPosix(p) {
  return p.split(path.sep).join('/');
}

/**
 * @param {string} filePath
 */
function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * @param {string} filePath
 */
function listMarkdownLinks(filePath) {
  const text = readText(filePath);
  const links = [];

  const mdLinkRegex = /(!?)\[[^\]]*]\(([^)]+)\)/g;
  for (const match of text.matchAll(mdLinkRegex)) {
    const isImage = match[1] === '!';
    const raw = match[2].trim();
    links.push({ isImage, raw });
  }
  return links;
}

/**
 * @param {string} raw
 */
function normalizeTarget(raw) {
  const cleaned = raw.replace(/^<|>$/g, '').trim();
  const [withoutHash] = cleaned.split('#');
  const [withoutQuery] = withoutHash.split('?');
  return withoutQuery.trim();
}

/**
 * @param {string} target
 */
function isIgnorableTarget(target) {
  if (!target) return true;
  if (target.startsWith('#')) return true;
  if (target.startsWith('http://') || target.startsWith('https://')) return true;
  if (target.startsWith('mailto:')) return true;
  return false;
}

/**
 * @param {string} text
 */
function hasUnpairedFences(text) {
  const fenceCount = (text.match(/```/g) ?? []).length;
  return fenceCount % 2 === 1;
}

/**
 * @param {string} rootDir
 */
function collectMarkdownFiles(rootDir) {
  /** @type {string[]} */
  const files = [];

  /**
   * @param {string} dir
   */
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) files.push(full);
    }
  }

  walk(rootDir);
  return files;
}

const repoRoot = process.cwd();
const docsRoot = path.join(repoRoot, '.docs');

/** @type {string[]} */
const errors = [];

if (!fs.existsSync(docsRoot)) {
  errors.push('Missing directory: .docs');
} else {
  const mdFiles = collectMarkdownFiles(docsRoot);
  for (const mdFile of mdFiles) {
    const content = readText(mdFile);

    if (hasUnpairedFences(content)) {
      errors.push(`[fence] Unpaired triple-backticks in ${toPosix(path.relative(repoRoot, mdFile))}`);
    }

    for (const link of listMarkdownLinks(mdFile)) {
      const target = normalizeTarget(link.raw);
      if (isIgnorableTarget(target)) continue;

      if (target.startsWith('file:///')) {
        errors.push(
          `[link] Disallowed file:/// link in ${toPosix(path.relative(repoRoot, mdFile))}`,
        );
        continue;
      }

      if (target.startsWith('/')) {
        errors.push(
          `[link] Absolute-path link "${target}" in ${toPosix(path.relative(repoRoot, mdFile))} (use relative link)`,
        );
        continue;
      }

      const resolved = path.resolve(path.dirname(mdFile), target);
      if (!fs.existsSync(resolved)) {
        errors.push(
          `[link] Broken ${link.isImage ? 'image' : 'link'} "${target}" in ${toPosix(
            path.relative(repoRoot, mdFile),
          )}`,
        );
      }
    }
  }
}

if (errors.length > 0) {
  process.stderr.write(`docs:check failed (${errors.length} issues)\n`);
  for (const err of errors) process.stderr.write(`- ${err}\n`);
  process.exit(1);
} else {
  process.stdout.write('docs:check passed\n');
}
