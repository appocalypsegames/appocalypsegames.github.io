import { readFile, access } from 'node:fs/promises';
import { games } from './games.mjs';

const root = new URL('../', import.meta.url);
const pages = ['index.html', 'games.html', 'about-us.html', 'support.html', 'privacy-policy.html', ...games.map(game => `games/${game.slug}.html`), ...games.map(game => `privacy-policy/${game.slug}.html`), 'privacy-policy/illuminati-hand.html'];
let links = 0;
const errors = [];
for (const name of pages) {
  const html = await readFile(new URL(name, root), 'utf8');
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) errors.push(`${name}: expected exactly one h1`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) errors.push(`${name}: duplicate id`);
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]); } catch { errors.push(`${name}: invalid structured data`); }
  }
  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (/^(https?:|mailto:|data:)/.test(url)) continue;
    const [pathname, hash] = url.split('#');
    const target = pathname ? new URL(pathname.replace(/^\//, ''), root) : new URL(name, root);
    if (pathname === '/') target.pathname += 'index.html';
    else if (pathname && !/\.[a-z0-9]+$/i.test(target.pathname)) target.pathname += '.html';
    try {
      await access(target);
      if (hash) {
        const targetHtml = await readFile(target, 'utf8');
        if (!targetHtml.includes(`id="${hash}"`)) errors.push(`${name}: missing anchor ${url}`);
      }
      links++;
    } catch { errors.push(`${name}: missing local target ${url}`); }
  }
}
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Verified ${pages.length} pages, ${links} local links/assets, headings, anchors and structured data.`);
