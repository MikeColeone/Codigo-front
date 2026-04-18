import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import ts from "typescript";

const repoRoot = path.resolve(process.cwd());

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function exists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function listFiles(dirPath) {
  const out = [];
  const stack = [dirPath];
  while (stack.length) {
    const cur = stack.pop();
    const entries = fs.readdirSync(cur, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(cur, ent.name);
      if (ent.isDirectory()) {
        if (
          ent.name === "node_modules" ||
          ent.name === ".next" ||
          ent.name === "dist" ||
          ent.name === "build" ||
          ent.name === "out" ||
          ent.name === ".turbo" ||
          ent.name === ".git" ||
          ent.name === ".cache" ||
          ent.name === "coverage"
        ) {
          continue;
        }
        stack.push(full);
        continue;
      }
      out.push(full);
    }
  }
  return out;
}

function findTsconfigPath(wsPath) {
  const candidates = [
    path.join(wsPath, "tsconfig.app.json"),
    path.join(wsPath, "tsconfig.json"),
  ];
  for (const c of candidates) {
    if (exists(c)) return c;
  }
  return null;
}

function findWorkspaces() {
  const appsDir = path.join(repoRoot, "apps");
  const pkgsDir = path.join(repoRoot, "packages");
  const workspaces = [];
  if (exists(appsDir)) {
    for (const name of fs.readdirSync(appsDir)) {
      const abs = path.join(appsDir, name);
      if (fs.statSync(abs).isDirectory()) workspaces.push(abs);
    }
  }
  if (exists(pkgsDir)) {
    for (const name of fs.readdirSync(pkgsDir)) {
      const abs = path.join(pkgsDir, name);
      if (fs.statSync(abs).isDirectory()) workspaces.push(abs);
    }
  }
  return workspaces;
}

function workspaceEntryPoints(wsPath) {
  const entries = new Set();
  const wsName = path.basename(wsPath);
  const src = path.join(wsPath, "src");


  const mainTsx = path.join(src, "main.tsx");
  const mainTs = path.join(src, "main.ts");
  if (exists(mainTsx)) entries.add(mainTsx);
  if (exists(mainTs)) entries.add(mainTs);

  const srcIndexTs = path.join(src, "index.ts");
  const srcIndexTsx = path.join(src, "index.tsx");
  if (exists(srcIndexTs)) entries.add(srcIndexTs);
  if (exists(srcIndexTsx)) entries.add(srcIndexTsx);

  const rootIndexTs = path.join(wsPath, "index.ts");
  if (exists(rootIndexTs)) entries.add(rootIndexTs);

  if (wsName === "release") {
    if (exists(src)) {
      const appDir = path.join(src, "app");
      if (exists(appDir)) {
        for (const file of listFiles(appDir)) {
          if (file.endsWith(".ts") || file.endsWith(".tsx")) entries.add(file);
        }
      }
    }
  }

  return entries;
}

function extractSpecifiers(filePath, content) {
  const pre = ts.preProcessFile(content, true, true);
  const specs = new Set();
  for (const imp of pre.importedFiles ?? []) specs.add(imp.fileName);
  for (const imp of pre.referencedFiles ?? []) specs.add(imp.fileName);
  const requireRe = /\brequire\s*\(\s*["'`](.+?)["'`]\s*\)/g;
  const dynImportRe = /\bimport\s*\(\s*["'`](.+?)["'`]\s*\)/g;
  for (const re of [requireRe, dynImportRe]) {
    for (let m = re.exec(content); m; m = re.exec(content)) {
      specs.add(m[1]);
    }
  }
  return specs;
}

function collectSourceFiles() {
  const ws = findWorkspaces();
  const all = [];
  for (const wsPath of ws) {
    const srcDir = path.join(wsPath, "src");
    if (exists(srcDir)) all.push(...listFiles(srcDir));
    const rootIndex = path.join(wsPath, "index.ts");
    if (exists(rootIndex)) all.push(rootIndex);
  }
  return all.filter((f) => f.endsWith(".ts") || f.endsWith(".tsx"));
}

function createResolver(compilerOptions, cacheBaseDir) {
  const host = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    directoryExists: ts.sys.directoryExists,
    realpath: ts.sys.realpath,
    getCurrentDirectory: () => cacheBaseDir,
    getDirectories: ts.sys.getDirectories,
  };
  const cache = ts.createModuleResolutionCache(
    cacheBaseDir,
    (p) => p,
    compilerOptions,
  );

  return function resolve(containingFile, spec) {
    const resolved = ts.resolveModuleName(
      spec,
      containingFile,
      compilerOptions,
      host,
      cache,
    ).resolvedModule;
    if (!resolved?.resolvedFileName) return null;
    return path.normalize(resolved.resolvedFileName);
  };
}

function loadWorkspaceConfig(wsPath) {
  const tsconfigPath = findTsconfigPath(wsPath);
  if (!tsconfigPath) return null;
  const host = {
    ...ts.sys,
    onUnRecoverableConfigFileDiagnostic: () => {},
  };
  const parsed = ts.getParsedCommandLineOfConfigFile(tsconfigPath, {}, host);
  if (!parsed) return null;
  const resolve = createResolver(parsed.options, path.dirname(tsconfigPath));
  return { wsPath, tsconfigPath, options: parsed.options, resolve };
}

function buildImporterMap(files) {
  const workspaces = findWorkspaces();
  const configs = workspaces
    .map(loadWorkspaceConfig)
    .filter(Boolean)
    .sort((a, b) => b.wsPath.length - a.wsPath.length);

  function configForFile(filePath) {
    for (const c of configs) {
      const rel = path.relative(c.wsPath, filePath);
      if (!rel.startsWith("..") && !path.isAbsolute(rel)) return c;
    }
    return null;
  }

  const importers = new Map();
  for (const f of files) importers.set(f, new Set());

  for (const fromFile of files) {
    let content = "";
    try {
      content = readText(fromFile);
    } catch {
      continue;
    }

    const specs = extractSpecifiers(fromFile, content);
    const cfg = configForFile(fromFile);
    for (const spec of specs) {
      if (!spec) continue;
      const resolved = cfg ? cfg.resolve(fromFile, spec) : null;
      if (!resolved) continue;
      if (!isInRepo(resolved)) continue;
      if (!importers.has(resolved)) continue;
      importers.get(resolved).add(fromFile);
    }
  }
  return importers;
}

function isInRepo(filePath) {
  const rel = path.relative(repoRoot, filePath);
  return rel && !rel.startsWith("..") && !path.isAbsolute(rel);
}

function main() {
  const files = collectSourceFiles();
  const importerMap = buildImporterMap(files);

  const entries = new Set();
  for (const wsPath of findWorkspaces()) {
    for (const e of workspaceEntryPoints(wsPath)) entries.add(e);
  }

  const unused = [];
  for (const f of files) {
    const importers = importerMap.get(f);
    const importerCount = importers ? importers.size : 0;
    if (importerCount > 0) continue;
    if (entries.has(f)) continue;
    if (toPosix(f).includes("/__tests__/")) continue;
    if (f.endsWith(".test.ts") || f.endsWith(".test.tsx")) continue;
    if (f.endsWith(".spec.ts") || f.endsWith(".spec.tsx")) continue;
    unused.push({
      file: toPosix(path.relative(repoRoot, f)),
      importers: [],
    });
  }

  unused.sort((a, b) => a.file.localeCompare(b.file));

  const asJson = process.argv.includes("--json");
  const outIdx = process.argv.indexOf("--out");
  const outPath = outIdx >= 0 ? process.argv[outIdx + 1] : null;
  if (asJson && outPath) {
    fs.writeFileSync(
      path.resolve(repoRoot, outPath),
      `${JSON.stringify({ unused }, null, 2)}\n`,
      "utf8",
    );
    process.stdout.write(`Wrote: ${toPosix(outPath)}\nTotal: ${unused.length}\n`);
    return;
  }

  if (asJson) {
    process.stdout.write(`${JSON.stringify({ unused }, null, 2)}\n`);
    return;
  }

  const all = process.argv.includes("--all");
  const limitIdx = process.argv.indexOf("--limit");
  const limitRaw = limitIdx >= 0 ? process.argv[limitIdx + 1] : null;
  const limit = Number.isFinite(Number(limitRaw)) ? Number(limitRaw) : 50;
  const shown = all ? unused.length : Math.min(unused.length, limit);
  for (let i = 0; i < shown; i++) process.stdout.write(`${unused[i].file}\n`);
  if (!all && unused.length > shown) {
    process.stdout.write(`... (${unused.length - shown} more)\n`);
  }
  process.stdout.write(`Total: ${unused.length}\n`);
}

main();
