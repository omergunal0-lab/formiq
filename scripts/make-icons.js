// Renders FORMIQ app icon + splash PNGs from SVG (needs Playwright/Chromium).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const G = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3ddc84"/><stop offset=".55" stop-color="#1fae5b"/><stop offset="1" stop-color="#ff7a2f"/></linearGradient>
<radialGradient id="h" cx=".2" cy=".1" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>`;
const F = (s, ox, oy) => `<g transform="translate(${ox} ${oy}) scale(${s})"><path d="M20 46V18h24v7H28v5h13v7H28v9z" fill="#fff"/><rect x="44" y="39" width="7" height="7" rx="1.5" fill="#fff" opacity=".9"/></g>`;
const svg = {
  icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${G}<rect width="64" height="64" fill="url(#g)"/><rect width="64" height="64" fill="url(#h)"/>${F(1, 0, 0)}</svg>`,
  fg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${F(.62, 12.2, 12.2)}</svg>`,
  bg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${G}<rect width="64" height="64" fill="url(#g)"/><rect width="64" height="64" fill="url(#h)"/></svg>`,
  splash: (bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2732 2732"><rect width="2732" height="2732" fill="${bg}"/>
    <g transform="translate(1166 1066) scale(6.25)">${G}<rect width="64" height="64" rx="18" fill="url(#g)"/>${F(1, 0, 0)}</g>
    <text x="1366" y="1610" font-family="-apple-system,Segoe UI,Roboto,sans-serif" font-size="120" font-weight="800" fill="#fff" text-anchor="middle" letter-spacing="-3">FORMIQ</text></svg>`,
};
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  const shot = async (s, size, out, transparent) => {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent(`<html><body style="margin:0;background:transparent">${s.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await p.screenshot({ path: out, omitBackground: !!transparent });
  };
  const A = (f) => path.join(root, 'assets', f), W = (f) => path.join(root, 'www', 'icons', f);
  await shot(svg.icon, 1024, A('icon-only.png'));
  await shot(svg.fg, 1024, A('icon-foreground.png'), true);
  await shot(svg.bg, 1024, A('icon-background.png'));
  await shot(svg.splash('#0f2a1a'), 2732, A('splash.png'));
  await shot(svg.splash('#0a0d0b'), 2732, A('splash-dark.png'));
  for (const s of [192, 512]) await shot(svg.icon, s, W(`icon-${s}.png`));
  await shot(svg.icon, 512, W('maskable-512.png'));
  await shot(svg.icon, 180, W('apple-touch-icon.png'));
  await shot(svg.icon, 512, path.join(root, 'store', 'icon-512.png'));
  await b.close(); console.log('icons ok');
})();
