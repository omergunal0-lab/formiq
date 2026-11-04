// Records a narrated (captioned) walkthrough of FORMIQ with demo data.
// Usage: serve www on :8765, then: node scripts/make-video.js <mock-supabase.js> <outdir>
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const [mockPath, outDir] = process.argv.slice(2);
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

const OVERLAY = `
(() => {
  const css = document.createElement('style');
  css.textContent = \`
  #vcap{position:fixed;left:12px;right:12px;bottom:calc(88px + env(safe-area-inset-bottom,0px));z-index:200;pointer-events:none;
    background:rgba(10,16,12,.86);color:#fff;border-radius:18px;padding:12px 16px;font:600 15px/1.35 -apple-system,system-ui,sans-serif;
    box-shadow:0 10px 30px rgba(0,0,0,.35);opacity:0;transform:translateY(12px);transition:opacity .35s,transform .35s}
  #vcap.on{opacity:1;transform:none}
  body:has(#cfm) #vcap{bottom:auto;top:calc(env(safe-area-inset-top,0px) + 14px)}
  #vcap b{display:block;font-size:17px;color:#7dffb0;margin-bottom:2px}
  .vtap{position:fixed;z-index:210;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(255,122,47,.45);
    border:2px solid rgba(255,255,255,.9);pointer-events:none;animation:vtap .6s ease-out forwards}
  @keyframes vtap{from{transform:scale(.4);opacity:1}to{transform:scale(1.5);opacity:0}}
  #vcard{position:fixed;inset:0;z-index:300;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:30px;
    background:radial-gradient(120% 80% at 100% 0%,rgba(255,138,61,.6),transparent 55%),radial-gradient(90% 80% at 0% 100%,rgba(61,220,132,.5),transparent 60%),linear-gradient(160deg,#0f2a1a,#123d24 45%,#1a5a33);
    color:#fff;font-family:-apple-system,system-ui,sans-serif;transition:opacity .6s}
  #vcard h1{margin:0;font-size:40px;font-weight:800;letter-spacing:-.03em}
  #vcard p{margin:0;font-size:18px;opacity:.9;line-height:1.45}
  #vcard .lg{width:96px;height:96px;animation:vpop .8s cubic-bezier(.2,.8,.2,1) both}
  #vcard ul{list-style:none;padding:0;margin:8px 0 0;font-size:16px;line-height:2;text-align:left}
  @keyframes vpop{from{transform:scale(.5);opacity:0}}\`;
  const addCss = () => { if (!css.isConnected) (document.head || document.documentElement).appendChild(css); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addCss); else addCss();
  const ensure = () => { addCss(); let c = document.getElementById('vcap'); if (!c) { c = document.createElement('div'); c.id = 'vcap'; document.body.appendChild(c); } return c; };
  window.cap = (t, s) => { const c = ensure(); c.classList.remove('on'); setTimeout(() => { c.innerHTML = '<b>' + t + '</b>' + (s || ''); c.classList.add('on'); }, 200); };
  window.capOff = () => { const c = ensure(); c.classList.remove('on'); };
  window.card = (html) => { addCss(); let c = document.getElementById('vcard'); if (!c) { c = document.createElement('div'); c.id = 'vcard'; document.body.appendChild(c); } c.style.opacity = 1; c.innerHTML = html; };
  window.cardOff = () => { const c = document.getElementById('vcard'); if (c) { c.style.opacity = 0; setTimeout(() => c.remove(), 650); } };
  document.addEventListener('pointerdown', (e) => { const d = document.createElement('div'); d.className = 'vtap'; d.style.left = e.clientX + 'px'; d.style.top = e.clientY + 'px'; document.body.appendChild(d); setTimeout(() => d.remove(), 700); }, true);
})();`;
const LOGO = `<svg class="lg" viewBox="0 0 64 64"><defs><linearGradient id="vg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3ddc84"/><stop offset="1" stop-color="#ff7a2f"/></linearGradient></defs><rect width="64" height="64" rx="18" fill="url(#vg)"/><path d="M20 46V18h24v7H28v5h13v7H28v9z" fill="#fff"/></svg>`;

(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: false, colorScheme: 'light',
    recordVideo: { dir: outDir, size: { width: 780, height: 1688 } } });
  const st = seed(); st._uid = 'u1'; st._ts = Date.now();
  st.badges = Object.fromEntries(['w1','w5','w10','w25','w50','wk','s2','s4','pr','vol','b4','su1','su7','pro','slp','pl'].map(k => [k, td()]));
  await ctx.addInitScript(({ s }) => { try { if (!localStorage.getItem('__seeded')) { localStorage.setItem('__mockstate', JSON.stringify(s)); localStorage.setItem('__seeded', '1'); localStorage.setItem('fit_email', 'omer@ornek.com'); } } catch (e) {} }, { s: st });
  await ctx.addInitScript(OVERLAY);
  await ctx.route('**/vendor/supabase.js', r => r.fulfill({ contentType: 'application/javascript', body: fs.readFileSync(mockPath, 'utf8') }));
  await ctx.route('**/config.js', r => r.fulfill({ contentType: 'application/javascript', body: 'window.FORMIQ_CONFIG={version:"1.2.0",supabaseUrl:"http://localhost:8765/sb",supabaseAnonKey:"anon",privacyUrl:"privacy.html"}' }));
  await ctx.route('**/sb/functions/v1/coach', r => r.fulfill({ contentType: 'application/json', body: JSON.stringify({ left: 14, text: 'Harika gidiyorsun, bu hafta 3/4 antrenman tamam! 💪\n• Bugün 58 g protein eksiğin var: akşam 200 g tavuk göğsü (≈330 kcal, 62 g protein) tam yeter.\n• Bench press’te 4 haftada +6 kg ilerledin, aynı tempoyla devam.\n• Uyku ortalaman 7,2 saat, toparlanma için ideal.' }) }));
  const p = await ctx.newPage();
  const W = (ms) => p.waitForTimeout(ms);
  const cap = (t, s) => p.evaluate(([t, s]) => window.cap(t, s), [t, s]);
  const tap = async (sel) => { const el = p.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await W(250); await el.click(); };
  const type = async (sel, text) => { await tap(sel); await p.locator(sel).first().fill(''); await p.locator(sel).first().type(text, { delay: 55 }); };
  const scroll = (y) => p.evaluate((y) => window.scrollTo({ top: y, behavior: 'smooth' }), y);
  const noCel = () => p.evaluate(() => document.getElementById('cel')?.remove());

  await p.goto('http://localhost:8765/');
  await p.evaluate((h) => window.card(h), `${LOGO}<h1>FORMIQ</h1><p>Antrenman, beslenme ve ilerlemen<br>tek uygulamada.</p>`);
  await W(3500); await p.evaluate(() => window.cardOff()); await W(700);

  // 1. Login
  await cap('Güvenli giriş', 'E-posta ve şifrenle giriş yap. “Beni hatırla” açıksa çıkış yapana kadar bir daha şifre sorulmaz.');
  await W(2500); await type('[data-au=pw]', 'sifre1234'); await W(600);
  await tap('[data-ago=login]'); await W(900); await noCel();

  // 2. Home
  await cap('Bugünün özeti', 'Kalori, protein, su ve adım hedeflerin tek bakışta. Verilerin hesabına yedeklenir.');
  await W(4000);
  await cap('Seri ve haftalık takvim', 'Haftalık hedefini tuttukça serin büyür, rozet kazanırsın.');
  await scroll(330); await W(3500);

  // 3. Past day
  await scroll(0); await W(600);
  await cap('Geçmiş güne kayıt', 'Antrenmanı veya suyu girmeyi mi unuttun? Günü seç, kayıt o güne eklenir.');
  await W(1200); await tap('[data-vsh="-1"]'); await W(1800);
  await scroll(1150); await W(900); await tap('[data-wt="500"]'); await W(1600);
  await scroll(0); await W(800); await tap('[data-vday]'); await W(1500);

  // 4. Workout
  await cap('Akıllı antrenman', 'Sıradaki antrenmanın hazır. Başla’ya dokun, setlerini kaydet.');
  await scroll(820); await W(1500); await tap('#main [data-st]'); await W(700);
  await cap('Set, tekrar ve RIR', 'Kas haritası, hareket ipucu ve geçen seferki değerlerinle ne zaman ağırlık artıracağını bilirsin.');
  await W(2500); await scroll(560); await W(800);
  await type('[data-sk="0"]', '62.5'); await type('[data-sr="0"]', '8'); await W(400); await tap('[data-sd="0"]'); await W(900);
  await cap('Dinlenme sayacı', 'Set bitince otomatik başlar. −15 / +15 ile süreyi ayarla, süre bitince bildirim gelir.');
  await W(1500); await tap('#tp15'); await W(2500);
  await tap('[data-sadd]'); await W(1200);
  await cap('Antrenmandan çıkmak', 'Yanlışlıkla çıkmaman için önce onay sorulur.');
  await scroll(0); await W(800); await tap('[data-sx]'); await W(2200); await tap('[data-cfy]'); await W(1400);

  // 5. Program editor
  await tap('[data-t=w]'); await W(400);
  await cap('Programını düzenle', 'Hareketleri değiştir, sil, sırala; set ve tekrarları güncelle. Değişiklikler anında kaydedilir.');
  await W(1500); await tap('#main [data-to=e]'); await W(2000);
  await scroll(380); await W(1200); await tap('[data-esp="0"]'); await W(900); await tap('[data-esp="0"]'); await W(1000);
  await tap('[data-eswap="1"]'); await W(1500);
  await cap('Hareketi değiştir', 'Aynı kas bölgesini çalıştıran alternatifler en üstte.');
  await W(1500); await type('#epq', 'pull'); await W(1300); await tap('[data-epick]'); await W(1800);
  await cap('Silmeden önce onay', 'Bir hareketi silerken “Emin misin?” sorusu çıkar, yanlışlıkla silinmez.');
  await scroll(700); await W(800); await tap('[data-edel="2"]'); await W(2200); await tap('[data-cfy]'); await W(1800);

  // 6. Nutrition
  await tap('[data-t=f]'); await W(400);
  await cap('Beslenme', 'Ne yediğini normal yazar gibi yaz: “2 yumurta, 1 dilim ekmek, 150 g tavuk”. 240+ yiyecek internetsiz tanınır.');
  await scroll(980); await W(1500);
  await type('#ft', '2 yumurta, 1 dilim ekmek, 150 g tavuk'); await W(500); await tap('[data-fc]'); await W(3000);
  await scroll(560); await W(2500);

  // 7. Progress
  await tap('[data-t=y]'); await W(400);
  await cap('İlerleme', 'Haftalık hacim, hareket bazında gelişim grafiği ve tüm antrenman geçmişin.');
  await W(2500); await scroll(700); await W(2800);
  await tap('[data-ht=p]'); await W(1000);
  await cap('Kişisel rekorlar', 'En ağır setlerin ve tahmini 1 tekrar maksimumun (1RM) otomatik hesaplanır.');
  await W(3200);

  // 8. Coach
  await tap('[data-t=m]'); await W(1000); await tap('#main [data-to=c]'); await W(400);
  await cap('FORMIQ Koç', 'Senin verilerini okuyan yapay zekâ koçu. Hazır sorulardan birine dokun veya kendin yaz.');
  await W(2000); await tap('[data-q="2"]'); await W(2600); await scroll(520); await W(4000);

  // 9. Outro
  await p.evaluate(() => window.capOff());
  await p.evaluate((h) => window.card(h), `${LOGO}<h1>FORMIQ</h1><ul><li>🏋️ Akıllı antrenman takibi</li><li>📅 Geçmiş günlere kayıt</li><li>✏️ Kolay program düzenleme</li><li>🍽️ Hızlı kalori ve protein</li><li>📈 İlerleme ve rekorlar</li><li>☁️ Hesabına yedeklenir</li></ul>`);
  await W(4500);
  const vid = p.video(); await ctx.close(); await b.close();
  const src = await vid.path(); fs.renameSync(src, path.join(outDir, 'raw.webm')); console.log('recorded', path.join(outDir, 'raw.webm'));
})();
