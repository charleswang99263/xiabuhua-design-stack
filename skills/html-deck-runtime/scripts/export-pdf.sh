#!/usr/bin/env bash
# Export a fixed-stage HTML deck to a selectable-text PDF.
#
# Usage:
#   bash scripts/export-pdf.sh <path-to-html> [output.pdf]
#
# The deck's validated stage dimensions determine the PDF page size. This
# helper only uses a preinstalled Playwright package and browser; it never
# installs packages, downloads a browser, or opens the resulting file.
set -euo pipefail

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'
info() { echo -e "${CYAN}ℹ${NC} $*"; }
ok() { echo -e "${GREEN}✓${NC} $*"; }
err() { echo -e "${RED}✗${NC} $*" >&2; }

if [[ $# -lt 1 || $# -gt 2 ]]; then
    err "Usage: bash scripts/export-pdf.sh <path-to-html> [output.pdf]"
    exit 1
fi

INPUT_HTML="$1"
if [[ ! -f "$INPUT_HTML" ]]; then
    err "File not found: $INPUT_HTML"
    exit 1
fi
INPUT_HTML="$(cd "$(dirname "$INPUT_HTML")" && pwd -P)/$(basename "$INPUT_HTML")"

if [[ $# -eq 2 ]]; then
    OUTPUT_ARG="$2"
else
    OUTPUT_ARG="${INPUT_HTML%.html}.pdf"
fi
# Resolve this before any temporary cleanup or working-directory change.
OUTPUT_DIR_ARG="$(dirname "$OUTPUT_ARG")"
mkdir -p "$OUTPUT_DIR_ARG"
OUTPUT_PDF="$(cd "$OUTPUT_DIR_ARG" && pwd -P)/$(basename "$OUTPUT_ARG")"

if ! command -v node >/dev/null 2>&1; then
    err "Node.js is required for PDF export."
    exit 1
fi

INPUT_DIR="$(dirname "$INPUT_HTML")"
PLAYWRIGHT_SEARCH_PATH="${HTML_DECK_NODE_MODULES:-$INPUT_DIR}"
PLAYWRIGHT_ENTRY="$(node -e 'try { const path = require("node:path"); const p = process.argv[1]; console.log(require.resolve("playwright", { paths: [p, path.dirname(p), process.cwd()] })); } catch {}' "$PLAYWRIGHT_SEARCH_PATH")"
if [[ -z "$PLAYWRIGHT_ENTRY" ]]; then
    err "A preinstalled Playwright runtime was not found."
    err "Provision Playwright outside this helper (or set HTML_DECK_NODE_MODULES to a directory containing it), then retry; no package or browser download is performed here."
    exit 1
fi

echo -e "${BOLD}Export Slides to PDF${NC}"
info "Using the authored deck stage dimensions and print media."

node --input-type=module - "$INPUT_DIR" "$(basename "$INPUT_HTML")" "$OUTPUT_PDF" "$PLAYWRIGHT_ENTRY" <<'EXPORT_SCRIPT'
import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const [serveDir, htmlFile, outputPdf, playwrightEntry] = process.argv.slice(2);
const loadedPlaywright = await import(pathToFileURL(playwrightEntry).href);
const { chromium } = loadedPlaywright['module.exports'] || loadedPlaywright.default || loadedPlaywright;
const root = resolve(serveDir);
const roots = [root, resolve(root, '..'), resolve(root, '../..'), resolve(root, '../../..')];
const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
};

const server = createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relativePath = pathname === '/' ? htmlFile : pathname;
    const candidate = roots.map((serveRoot) => resolve(serveRoot, join('.', relativePath)))
      .find((filePath) => { try { return statSync(filePath).isFile(); } catch { return false; } });
    if (!candidate) throw new Error('not a file');
    response.writeHead(200, { 'Content-Type': mimeTypes[extname(candidate).toLowerCase()] || 'application/octet-stream' });
    response.end(readFileSync(candidate));
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});

const listenPort = await new Promise((resolvePort, reject) => {
  server.once('error', reject);
  server.listen(0, '127.0.0.1', () => resolvePort(server.address().port));
});
let browser;
try {
  browser = await chromium.launch();
} catch (error) {
  server.close();
  console.error(`Preinstalled Playwright browser is unavailable: ${error.message}`);
  console.error('Provision the browser outside this helper, then retry; no browser download is performed here.');
  process.exit(1);
}

const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
try {
  await page.goto(`http://127.0.0.1:${listenPort}/${encodeURIComponent(htmlFile)}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts?.ready);
  const deck = await page.evaluate(() => {
    const candidates = [...document.querySelectorAll(
      'deck-stage, .deck-viewport[data-html-deck-runtime-standalone], .deck-viewport',
    )];
    if (candidates.length !== 1) {
      throw new Error(`expected exactly one deck target, found ${candidates.length}`);
    }
    const target = candidates[0];
    const readDimension = (name, cssName) => {
      const attr = target.getAttribute(name);
      const raw = attr == null ? getComputedStyle(target).getPropertyValue(cssName).trim() : attr.trim();
      const value = Number(raw.replace(/px$/, ''));
      if (!Number.isFinite(value) || value <= 0) throw new Error(`deck ${name} must be a positive finite number`);
      return value;
    };
    const slides = target.querySelectorAll('.slide');
    if (!slides.length) throw new Error('deck target has no .slide elements');
    const width = readDimension('width', '--html-deck-runtime-stage-width');
    const height = readDimension('height', '--html-deck-runtime-stage-height');
    const apiResult = typeof target.prepareForPrint === 'function' ? target.prepareForPrint() : null;
    return { width: apiResult?.width || width, height: apiResult?.height || height, slideCount: slides.length };
  });
  if (!Number.isFinite(deck.width) || deck.width <= 0 || !Number.isFinite(deck.height) || deck.height <= 0) {
    throw new Error('deck runtime returned invalid stage dimensions');
  }
  await page.setViewportSize({ width: Math.ceil(deck.width), height: Math.ceil(deck.height) });
  await page.emulateMedia({ media: 'print' });
  await page.pdf({
    path: outputPdf,
    width: `${deck.width}px`,
    height: `${deck.height}px`,
    printBackground: true,
    preferCSSPageSize: false,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  console.log(`PDF saved to ${outputPdf} (${deck.slideCount} pages, ${deck.width}×${deck.height}px)`);
} finally {
  await browser.close();
  server.close();
}
EXPORT_SCRIPT

ok "PDF exported: $OUTPUT_PDF"
