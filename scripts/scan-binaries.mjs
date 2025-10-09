#!/usr/bin/env node
import { readdir, stat, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { fileTypeFromBuffer } from 'file-type';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const maxBytes = 500 * 1024;
const ignoreDirs = new Set(['.git', 'node_modules', 'dist', '.vercel', '.render', '.github', '.husky']);
const allowedExtensions = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.json',
  '.md',
  '.css',
  '.html',
  '.svg',
  '.yml',
  '.yaml',
  '.cjs',
  '.mjs',
  '.txt',
  '.sh',
  '.webmanifest'
]);
const allowedFilenames = new Set([
  '.gitignore',
  '.gitattributes',
  'LICENSE',
  'Dockerfile'
]);

const offenders = [];

async function walk(currentDir) {
  const entries = await readdir(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const relativePath = path.relative(repoRoot, fullPath);
    if (entry.isDirectory()) {
      if (!ignoreDirs.has(entry.name)) {
        await walk(fullPath);
      }
      continue;
    }

    const fileStats = await stat(fullPath);
    if (fileStats.size > maxBytes) {
      offenders.push({ path: relativePath, reason: `File exceeds ${maxBytes} bytes` });
      continue;
    }

    const ext = path.extname(entry.name);
    if (!allowedExtensions.has(ext) && !allowedFilenames.has(entry.name)) {
      offenders.push({ path: relativePath, reason: `Extension "${ext || 'none'}" is not allowed` });
      continue;
    }

    if (await isBinary(fullPath)) {
      offenders.push({ path: relativePath, reason: 'Binary content detected' });
    }
  }
}

async function isBinary(filePath) {
  try {
    const buffer = await readFile(filePath);
    const fileType = await fileTypeFromBuffer(buffer.subarray(0, 4100));
    if (fileType) {
      if (fileType.mime === 'image/svg+xml') {
        return false;
      }
      return !fileType.mime.startsWith('text/');
    }
    if (buffer.includes(0)) {
      return true;
    }
    if (process.platform !== 'win32') {
      try {
        const { stdout } = await execFileAsync('file', ['-I', filePath]);
        const output = stdout.toString().trim().toLowerCase();
        if (output.includes('charset=binary') || output.includes('application/octet-stream')) {
          return true;
        }
      } catch (error) {
        if (error.code !== 'ENOENT') {
          console.warn(`Binary scan fallback skipped for ${filePath}: ${(error).message}`);
        }
      }
    }
    return false;
  } catch (error) {
    console.warn(`Binary scan failed for ${filePath}: ${(error).message}`);
    return false;
  }
}

await walk(repoRoot);

if (offenders.length > 0) {
  console.error('\n🚫 Binary or oversized files detected:');
  for (const offender of offenders) {
    console.error(` - ${offender.path}: ${offender.reason}`);
  }
  console.error('\nPlease remove these files or convert them to text-based alternatives before committing.');
  process.exit(1);
}

console.log('✅ Binary scan passed.');
