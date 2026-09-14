import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const skillRoot = fileURLToPath(new URL('..', import.meta.url));
const vendor = path.join(skillRoot, 'assets', 'vendor');
const required = [
  ['d3.v7.9.0.min.js', /D3|d3/i],
  ['three.r186.module.js', /three/i],
  ['three.core.js', /three/i],
  ['p5.v2.3.1.js', /p5\.js v2\.3\.1/i],
  ['p5.v2.3.1.min.js', /p5/i],
  ['p5-2.3.1-npm-package.tgz', null],
  ['p5-2.3.1-github-source.tar.gz', null],
  ['p5-2.3.1.package.json', /"version"\s*:\s*"2\.3\.1"/i],
  ['D3-LICENSE.txt', /ISC/i],
  ['THREE-LICENSE.txt', /MIT/i],
  ['P5-LICENSE.txt', /LESSER GENERAL PUBLIC LICENSE/i],
  ['THIRD-PARTY-NOTICES.md', /unmodified official distributions/i],
];
for (const [name, marker] of required) {
  const file = path.join(vendor, name);
  assert.ok(fs.existsSync(file), `missing vendor asset: ${name}`);
  if (marker) assert.match(fs.readFileSync(file, 'utf8').slice(0, 120000), marker, `license/source marker missing: ${name}`);
}
const sourceArchive = path.join(vendor, 'p5-2.3.1-github-source.tar.gz');
const sourceArchiveBytes = fs.readFileSync(sourceArchive);
assert.ok(sourceArchiveBytes.length > 1000000, 'p5 GitHub source archive is complete-sized');
assert.match(fs.readFileSync(path.join(vendor, 'THIRD-PARTY-NOTICES.md'), 'utf8'), /peeled commit `a0c5805a36a03e313e5ef9990c8997b2a95d91a9`/);
const sourceListing = execFileSync('tar', ['-tzf', sourceArchive], { encoding: 'utf8' });
assert.match(sourceListing, /p5\.js-2\.3\.1\/src\//, 'p5 GitHub archive contains complete source tree');
assert.match(sourceListing, /p5\.js-2\.3\.1\/package\.json/, 'p5 GitHub archive contains build metadata');
for (const name of ['graphics-common.js', 'graphics-d3.js', 'graphics-three.js', 'graphics-p5.js']) {
  assert.match(fs.readFileSync(path.join(skillRoot, 'assets', 'primitives', name), 'utf8'), /mount|dispose/, `${name} is not an adapter`);
}
console.log(`PASS runtime asset smoke: ${required.length} vendored assets and 4 adapters are present with notices.`);
await import('../evaluations/runtime-contract.test.mjs');
