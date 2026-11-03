// Store screenshots with sample data: node scripts/store-shots.js
const { chromium } = require('playwright');
const path = require('path');
const root = path.join(__dirname, '..');
const td = (n = 0) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
function seed() {
  const hist = [], done = [], body = [], sleep = {}, water = {}, steps = {}, food = {};
  for (let i = 27; i >= 0; i--) {
    const d = td(-i);
    if (i % 2 === 0 && i > 0) {
      const k = 50 + (27 - i) * 0.9;
      hist.push({ d, id: 'demo_' + (i % 4), name: ['Üst A', 'Alt A', 'Üst B', 'Alt B'][i % 4], dur: 3600 + (i % 3) * 300, vol: Math.round(5200 + (27 - i) * 120),
        ex: [{ n: 'Bench press', q: 'barbell bench press', c: 0, sets: [{ kg: Math.round(k), r: 8, q: 2 }, { kg: Math.round(k), r: 7, q: 1 }] },
             { n: 'Squat', q: 'barbell back squat', c: 0, sets: [{ kg: Math.round(k * 1.4), r: 6, q: 2 }] }] });
      done.push({ d, day: 'demo_' + (i % 4) });
    }
    if (i % 4 === 0) body.push({ d, kg: +(86 - (27 - i) * 0.12).toFixed(1), bel: +(92 - (27 - i) * 0.1).toFixed(1) });
    sleep[d] = { h: 6.5 + (i % 4) * 0.5, q: 3 + (i % 3) };
    water[d] = i ? [500, 500, 330, 500, 500, 330] : [500, 330, 500, 330];
    steps[d] = 6000 + (i * 397) % 6000;
  }
  food[td()] = [{ n: 'Yulaf + whey', k: 420, p: 32 }, { n: 'Tavuk göğsü, pilav, salata', k: 690, p: 52 }, { n: 'Süzme yoğurt, ceviz', k: 290, p: 18 }];
  return { w: {}, done, body, food, t: { k: 2400, p: 160 }, start: td(-27), steps, progs: [], chat: [{ q: 'Bu hafta nasıl gidiyorum? Kısa değerlendir.', a: 'Harika gidiyorsun! 3/4 antrenman tamam, protein hedefinin %90’ındasın.\n• Bench press’te 4 haftada +6 kg ilerleme var.\n• Uyku ortalaman 7,2 saat, toparlanma için ideal.\n• Bu akşam 1 porsiyon tavuk veya 200 g süzme yoğurt ile proteini tamamla.' }],
    hist, plans: [], water, fav: [], sleep, wg: 2900, badges: {}, prof: { name: 'Ömer', g: 'Erkek', age: 24, h: 177, kg: 84, goal: 'Yağ yak', days: 4, lvl: 'Orta', d: td(-27) } };
}
(async () => {
  const b = await chromium.launch();
  const sizes = [['ios-6.9', 440, 956, 3], ['android', 412, 915, 2.625]];
  for (const [name, w, h, dpr] of sizes) {
    for (const scheme of ['dark']) {
      const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, colorScheme: scheme });
      const st = seed(); st.badges = Object.fromEntries(['w1','w5','w10','w25','w50','wk','s2','s4','pr','vol','b4','su1','su7','pro','slp','pl'].map(k => [k, td()]));
      await ctx.addInitScript((s) => { try { if (!localStorage.getItem('seeded')) { localStorage.setItem('fit2', JSON.stringify(s)); localStorage.setItem('seeded', '1'); } } catch (e) {} }, st);
      const p = await ctx.newPage();
      await p.goto('file://' + path.join(root, 'www/index.html')); await p.waitForTimeout(1800);
      const snap = async (n) => { await p.waitForTimeout(1400); await p.screenshot({ path: path.join(root, 'store/screenshots', `${name}-${n}.png`) }); };
      await snap('1-bugun');
      await p.click('[data-t=w]'); await snap('2-antrenman');
      await p.click('text=Antrenmanı başlat'); await p.fill('[data-sk="0"]', '62.5'); await p.fill('[data-sr="0"]', '8'); await p.click('[data-sd="0"]'); await snap('3-seans');
      await p.click('[data-sx]'); await p.click('[data-sx]');
      await p.click('[data-t=y]'); await snap('4-ilerleme');
      await p.click('[data-t=f]'); await snap('5-beslenme');
      await p.click('[data-t=m]'); await p.click('#main [data-to=c]'); await snap('6-koc');
      await ctx.close();
    }
  }
  await b.close(); console.log('screenshots ok');
})();
