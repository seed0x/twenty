#!/usr/bin/env node
/**
 * build-single.mjs — bundle the whole site into ONE html file.
 *
 *   node scripts/build-single.mjs
 *
 * Writes:
 *   dist/index.html     a self-contained page (CSS, JS, fonts, posts inlined)
 *                       that also works when opened straight from disk
 *   dist/artifact.html  the same page without <html>/<head>/<body> wrappers,
 *                       for hosts that wrap your markup themselves
 *
 * The normal site (index.html + css/ + js/ + posts/) needs no build at all;
 * this is only for sharing a single file.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const b64 = (p) => fs.readFileSync(path.join(root, p)).toString('base64');

let html = read('index.html');

// 1. Stylesheets → <style>, with the font files inlined as data URIs
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, href) => {
  const css = read(href).replace(/url\("\.\.\/(assets\/fonts\/[^"]+)"\)/g,
    (m, file) => `url("data:font/woff2;base64,${b64(file)}")`);
  return `<style>\n${css}\n</style>`;
});

// 2. Favicon → data URI
html = html.replace(/<link rel="icon" href="assets\/favicon\.svg" type="image\/svg\+xml">/,
  () => `<link rel="icon" href="data:image/svg+xml;base64,${b64('assets/favicon.svg')}" type="image/svg+xml">`);

// 3. Blog posts → window.__POSTS__ (the site checks this before fetching)
const posts = {};
for (const f of fs.readdirSync(path.join(root, 'posts'))) {
  if (f.endsWith('.md')) posts[f.slice(0, -3)] = read(`posts/${f}`);
}
const postsScript = `<script>window.__POSTS__ = ${JSON.stringify(posts).replace(/<\//g, '<\\/')};</script>`;

// 4. Scripts → inline, posts first
let first = true;
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) => {
  const js = read(src).replace(/<\/script/gi, '<\\/script');
  const out = `${first ? `${postsScript}\n` : ''}<script>\n${js}\n</script>`;
  first = false;
  return out;
});

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/index.html'), html);

// 5. Fragment version: <title> + styles + body content (no document wrappers)
const head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];
// The fragment is named after the site owner, read from content.js
const ownerName = (read('js/content.js').match(/\n\s*name:\s*'([^']+)'/) || [, 'Personal site'])[1];
const title = `<title>${ownerName}</title>`;
const styles = (head.match(/<style>[\s\S]*?<\/style>/g) || []).join('\n');
fs.writeFileSync(path.join(root, 'dist/artifact.html'), `${title}\n${styles}\n${body.trim()}\n`);

const kb = (f) => `${(fs.statSync(path.join(root, f)).size / 1024).toFixed(0)} KB`;
console.log(`dist/index.html     ${kb('dist/index.html')}`);
console.log(`dist/artifact.html  ${kb('dist/artifact.html')}`);
