#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const atomsDir = join(root, 'src', 'components', 'atoms');
const marginRegex = /\b(?:m|mx|my|mt|mr|mb|ml)-\[/g; // arbitrary values
const marginScale
  = /\b(?:m|mx|my|mt|mr|mb|ml)-(?:\d|px|0\.5|1\.5|2\.5|3\.5|10|11|12|14|16|20|24|28|32|36|40|44|48|52|56|60|64|72|80|96)\b/g;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const s = statSync(p);
    if (s.isDirectory()) {
      walk(p);
    } else if (s.isFile() && ['.tsx', '.ts', '.jsx', '.js'].includes(extname(p))) {
      checkFile(p);
    }
  }
}

let failed = false;
function checkFile(path) {
  const content = readFileSync(path, 'utf8');
  const hasClassName = content.includes('className=');
  if (!hasClassName) {
    return;
  }
  if (marginRegex.test(content) || marginScale.test(content)) {
    console.error(`Forbidden margin class detected in: ${path}`);
    failed = true;
  }
}

walk(atomsDir);
if (failed) {
  console.error('Atoms must not contain margin classes.');
  process.exit(1);
}
