/* FORMIQ · Kas dengesi
   Uses the workouts the user logged (exercise → muscles, sets, weights) to show
   which muscle groups get too little, enough or too much work, which lifts are
   improving or stuck, and what to add to the program.
   Loaded before app.js; uses app.js globals only inside functions. */
const MUS_DAYS = 28;
const UPPER = "GSOBT", LOWER = "QHPC";

function exMus(n, q) { const L = lk(n); if (L) return { p: L.p, x: L.x || "" }; return mc(q || ""); }

/* Weekly hard sets per muscle. Primary muscle = 1 set, helper muscle = ½ set. */
function musStats() {
  const from = sh(td(), -(MUS_DAYS - 1)), H = st.hist.filter((h) => h.d >= from && h.d <= td());
  const sets = {}, vol = {};
  H.forEach((h) => h.ex.forEach((e) => {
    if (e.c) return;
    const m = exMus(e.n, e.q); if (!m.p || m.p === "D") return;
    const ns = e.sets.length, v = e.sets.reduce((a, s) => a + (s.kg || 0) * (s.r || 0), 0);
    [...m.p].forEach((c) => { if (R[c]) { sets[c] = (sets[c] || 0) + ns; vol[c] = (vol[c] || 0) + v; } });
    [...(m.x || "")].forEach((c) => { if (R[c]) sets[c] = (sets[c] || 0) + ns * 0.5; });
  }));
  const start = [from, st.start || from].sort()[1];
  const span = Math.max(7, Math.min(MUS_DAYS, (new Date(td()) - new Date(start)) / 864e5 + 1));
  const weeks = span / 7, wk_ = {};
  Object.keys(R).forEach((c) => { wk_[c] = Math.round(((sets[c] || 0) / weeks) * 10) / 10; });
  const real = H.length >= 2;
  const plan = vsum(edView().days);
  const use = real ? wk_ : plan;
  return { real, n: H.length, weeks: Math.round(weeks * 10) / 10, wk: use, plan, vol };
}
const musState = (c, n) => rt(c, n);
const ST_LBL = { yok: "Hiç çalışmıyor", eksik: "Eksik", iyi: "Yeterli", fazla: "Fazla" };
const ST_ORD = { yok: 0, eksik: 1, fazla: 2, iyi: 3 };

function musMap(w) {
  const hl = {}, ms = {};
  Object.keys(R).forEach((c) => { const s = musState(c, w[c] || 0); if (s === "iyi" || s === "fazla") hl[c] = Math.min(1, 0.4 + (w[c] || 0) / R[c][2] * 0.6); else ms[c] = 1; });
  return bm(hl, ms);
}

/* Lift progress over the last 6 weeks: improving vs. stuck */
function liftTrends() {
  const from = sh(td(), -41), by = {};
  st.hist.filter((h) => h.d >= from).forEach((h) => h.ex.forEach((e) => {
    if (e.c) return; const top = Math.max(0, ...e.sets.map((s) => s.kg || 0)); if (!top) return;
    const best = Math.max(...e.sets.filter((s) => s.kg === top).map((s) => s.r || 0));
    (by[e.n] = by[e.n] || []).push({ d: h.d, kg: top, r: best });
  }));
  const up = [], flat = [];
  Object.keys(by).forEach((n) => {
    const a = by[n].sort((x, y) => (x.d < y.d ? -1 : 1)); if (a.length < 2) return;
    const f = a[0], l = a[a.length - 1], dk = l.kg - f.kg;
    if (dk > 0 || (dk === 0 && l.r > f.r)) up.push({ n, f, l, dk });
    else if (a.length >= 3) flat.push({ n, l, k: a.length });
  });
  up.sort((x, y) => y.dk - x.dk);
  return { up: up.slice(0, 4), flat: flat.slice(0, 4) };
}

function musInsights(w) {
  const g = (s) => [...s].reduce((a, c) => a + (w[c] || 0), 0), out = [];
  const push = (w.G || 0) + (w.O || 0) * 0.5 + (w.T || 0) * 0.5, pull = (w.S || 0) + (w.B || 0) * 0.5;
  if (push > 4 && pull < push * 0.8) out.push(["⚖️", "Çekiş itişe göre az", `Sırt + biceps itiş hareketlerinin yalnızca %${Math.round(pull / push * 100)} kadarı. Duruş ve omuz sağlığı için sırt hareketi ekle.`]);
  if (pull > 4 && push < pull * 0.7) out.push(["⚖️", "İtiş çekişe göre az", "Göğüs ve omuz hacmini biraz artırmak dengeyi düzeltir."]);
  if ((w.Q || 0) > 4 && (w.H || 0) < (w.Q || 0) * 0.6) out.push(["🦵", "Arka bacak ön bacağa göre zayıf", "Bu dengesizlik diz ve arka bacak sakatlığı riskini artırır. Romanian deadlift veya leg curl ekle."]);
  const up = g(UPPER), low = g(LOWER);
  if (up > 10 && low < up * 0.5) out.push(["🏋️", "Bacak günleri az", "Üst vücuda göre bacak hacmin yarıdan az. Haftada en az 2 bacak çalışması öner."]);
  if (!(w.K > 0)) out.push(["🎯", "Karın hiç çalışmıyor", "Haftada 2 kez 2-3 set karın hareketi gövde stabilitesini ve ağır kaldırışları güçlendirir."]);
  return out;
}

function musSuggest(c, n) {
  const P = edView(), used = new Set(P.days.flatMap((d) => d.ex.map((e) => e.n)));
  return LB.map((x, i) => ({ x, i })).filter((o) => o.x.p !== "D" && o.x.p[0] === c && !used.has(o.x.n)).slice(0, n || 2);
}

function musBar(c, n) {
  const mx = R[c][2] * 1.4, s = musState(c, n), col = { yok: "var(--mu)", eksik: "var(--ac2)", iyi: "var(--ac)", fazla: "var(--red)" }[s];
  return `<div class="mr"><div class="mrh"><b>${R[c][0]}</b><span class="mst ${s}">${ST_LBL[s]}</span><span class="t">${n} set/hafta</span></div>
  <div class="mb"><i class="band" style="left:${R[c][1] / mx * 100}%;width:${(R[c][2] - R[c][1]) / mx * 100}%"></i><i class="fill" style="width:${Math.min(n / mx, 1) * 100}%;background:${col}"></i></div></div>`;
}

function musv() {
  const S = musStats(), w = S.wk, ks = Object.keys(R);
  const score = ks.filter((c) => musState(c, w[c] || 0) === "iyi").length;
  const low = ks.filter((c) => ["yok", "eksik"].includes(musState(c, w[c] || 0))).sort((a, b) => (w[a] || 0) / R[a][1] - (w[b] || 0) / R[b][1]);
  const high = ks.filter((c) => musState(c, w[c] || 0) === "fazla");
  const T = liftTrends(), I = musInsights(w);
  const src = S.real ? `Son 4 hafta · ${S.n} antrenman` : "Programına göre (yeterli antrenman kaydı yok)";
  let h = `<div class="c"><div class="top"><div><h3>💪 Kas dengesi</h3><div class="t">${src}</div></div><div class="score"><b style="color:${score>=7?"var(--ac)":score>=4?"var(--gold)":"var(--ac2)"}">${score}</b><span>/10</span><div class="t" style="font-size:11px;margin-top:2px">denge puanı</div></div></div>
  <div class="mmap">${musMap(w)}</div>
  <div class="lgd"><span><i style="background:var(--ac)"></i>Yeterli</span><span><i style="background:#ff8a3c"></i>Eksik</span></div>
  ${S.real ? "" : '<div class="tip">Antrenmanlarını kaydettikçe bu ekran gerçek verine göre hesaplanır.</div>'}</div>`;

  h += `<div class="c"><h3>🔎 Özet</h3>${low.length ? `<div class="sumr"><span class="mst eksik">Gelişmeli</span><div>${low.map((c) => `<b>${R[c][0]}</b>`).join(", ")}</div></div>` : ""}${high.length ? `<div class="sumr"><span class="mst fazla">Fazla</span><div>${high.map((c) => `<b>${R[c][0]}</b>`).join(", ")} <span class="t">toparlanma zorlaşabilir, set azalt</span></div></div>` : ""}${!low.length && !high.length ? '<div class="n">🎉 Tüm kas grupların dengeli çalışıyor.</div>' : ""}
  ${I.map((x) => `<div class="ins"><span>${x[0]}</span><div><b>${x[1]}</b><div class="t">${x[2]}</div></div></div>`).join("")}</div>`;

  if (low.length) h += `<div class="c"><h3>➕ Eksikler için öneri</h3><div class="t" style="margin-bottom:6px">Dokun, aktif programına eklensin. Sonra Programım'dan istediğin güne taşıyabilirsin.</div>${low.slice(0, 3).map((c) => `<div class="sug"><div class="t"><b>${R[c][0]}</b> · ${w[c] || 0} set/hafta, hedef ${R[c][1]}-${R[c][2]}</div><div class="row" style="margin-top:4px">${musSuggest(c).map((o) => `<button class="sm" data-madd="${o.i}">＋ ${esc(o.x.n)}</button>`).join("")}</div></div>`).join("")}</div>`;

  h += `<div class="c"><h3>📊 Kas grupları</h3><div class="t" style="margin-bottom:8px">Haftalık set sayısı. Açık yeşil alan önerilen aralık. Yardımcı kaslar yarım set sayılır.</div>${ks.slice().sort((a, b) => ST_ORD[musState(a, w[a] || 0)] - ST_ORD[musState(b, w[b] || 0)]).map((c) => musBar(c, w[c] || 0)).join("")}</div>`;

  if (T.up.length || T.flat.length) h += `<div class="c"><h3>📈 Güç gelişimi</h3><div class="t">Son 6 hafta</div>
  ${T.up.map((x) => `<div class="trd"><span class="up">▲</span><div style="flex:1"><b>${esc(x.n)}</b><div class="t">${x.f.kg} kg × ${x.f.r} → ${x.l.kg} kg × ${x.l.r}</div></div><b class="up">${x.dk > 0 ? "+" + x.dk + " kg" : "+tekrar"}</b></div>`).join("")}
  ${T.flat.map((x) => `<div class="trd"><span class="flat">■</span><div style="flex:1"><b>${esc(x.n)}</b><div class="t">${x.k} seanstır ${x.l.kg} kg'da. Tekrar sayısını artırmayı dene; olmuyorsa 1 hafta hafiflet.</div></div></div>`).join("")}</div>`;
  return h;
}

function musMini() {
  const S = musStats(), w = S.wk, ks = Object.keys(R);
  const low = ks.filter((c) => ["yok", "eksik"].includes(musState(c, w[c] || 0)));
  return `<button class="c mmini" data-mus="1"><div class="mmm">${musMap(w)}</div><div style="flex:1;min-width:0;text-align:left"><div class="n">💪 Kas dengesi</div>
  <div class="t">${low.length ? "Gelişmeli: " + low.slice(0, 4).map((c) => R[c][0]).join(", ") + (low.length > 4 ? "…" : "") : "Tüm kas grupları dengede 🎉"}</div><div class="t" style="margin-top:4px;color:var(--ac)">${S.real ? "Antrenmanlarına göre" : "Programına göre"} · detay ›</div></div></button>`;
}

document.addEventListener("click", (e) => {
  const b = e.target.closest && e.target.closest("[data-mus],[data-madd]"); if (!b) return;
  if (b.dataset.mus) { if ("hwyfm".includes(tab)) backTo = tab; tab = "y"; ht = "k"; render(); window.scrollTo(0, 0); return; }
  if (b.dataset.madd !== undefined) {
    const x = LB[+b.dataset.madd], p = edPlan(), lowSide = LOWER.includes(x.p[0]);
    const score = (d) => d.ex.filter((y) => y.p && y.p !== "D" && (lowSide ? LOWER : UPPER).includes(y.p[0])).length * 10 - d.ex.length;
    const di = p.days.length ? p.days.map((d, i) => ({ i, s: score(d) })).sort((a, b) => b.s - a.s)[0].i : (p.days.push({ name: "Gün 1", ex: [] }), 0);
    p.days[di].ex.push(mkEx(x)); sv(); render(); toast("＋ " + x.n + " → " + p.days[di].name);
  }
});
