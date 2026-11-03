/* FORMIQ accounts: sign up, login, email code verification, password reset,
   cloud backup (Supabase), sign out and account deletion.
   Loaded before app.js; uses app.js variables (st, render, sv ...) only inside functions. */
const ACF = window.FORMIQ_CONFIG || {};
const SB = (ACF.supabaseUrl && ACF.supabaseAnonKey && window.supabase)
  ? window.supabase.createClient(ACF.supabaseUrl, ACF.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: "formiq-auth" },
    })
  : null;

let sess = null;
let guest = false;
try { guest = localStorage.getItem("fit_guest") === "1"; } catch (e) {}
const AU = { ready: !SB, v: "welcome", name: "", email: "", pw: "", pw2: "", code: "", ok: false, show: false, err: "", msg: "", busy: false, left: null, lo: false, del: false };

const needAuth = () => !!SB && !sess && !guest;
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

function authErr(e) {
  const m = String((e && (e.message || e.code)) || e || "");
  if (/invalid login|invalid_credentials/i.test(m)) return "E-posta veya şifre hatalı.";
  if (/already registered|already been registered|user_already_exists/i.test(m)) return "Bu e-posta ile zaten bir hesap var. Giriş yapmayı dene.";
  if (/not confirmed/i.test(m)) return "E-posta adresin henüz doğrulanmadı.";
  if (/expired|invalid.*(otp|token)|otp_expired/i.test(m)) return "Kod hatalı veya süresi dolmuş. Yeni kod isteyebilirsin.";
  if (/security purposes|rate limit|too many/i.test(m)) return "Çok sık denedin. Biraz bekleyip tekrar dene.";
  if (/weak|password should/i.test(m)) return "Şifre çok zayıf. En az 8 karakter, harf ve rakam kullan.";
  if (/fetch|network|failed to fetch|load failed/i.test(m)) return "İnternet bağlantını kontrol et.";
  return "Bir sorun oluştu: " + m;
}

/* ---------------- screens ---------------- */
const LOGO = `<svg class="lg" viewBox="0 0 64 64"><defs><linearGradient id="alg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3ddc84"/><stop offset="1" stop-color="#ff7a2f"/></linearGradient></defs><rect width="64" height="64" rx="18" fill="url(#alg)"/><path d="M20 46V18h24v7H28v5h13v7H28v9z" fill="#fff"/></svg>`;
const fld = (k, label, type, ph, ac, extra) => `<label>${label}</label><div class="af"><input class="w" data-au="${k}" type="${type}" placeholder="${ph}" autocomplete="${ac}" value="${qa(AU[k])}" ${extra || ""}>${k === "pw" ? `<button class="eye" data-apw="1">${AU.show ? "Gizle" : "Göster"}</button>` : ""}</div>`;
const pwType = () => (AU.show ? "text" : "password");
const btn = (go, label) => `<button class="p ab" data-ago="${go}" ${AU.busy ? "disabled" : ""}>${AU.busy ? '<span class="spin"></span>' : label}</button>`;
const note = () => (AU.err ? `<div class="aerr">${esc(AU.err)}</div>` : "") + (AU.msg ? `<div class="amsg">${esc(AU.msg)}</div>` : "");
const back = (to) => `<button class="aback" data-av="${to || "welcome"}" aria-label="Geri">‹</button>`;

function authv() {
  const v = AU.v;
  if (v === "welcome") return `<div class="auth aw">
    <div class="ob-hero">${LOGO}<h2>FORMIQ</h2><div class="t">Antrenman, beslenme ve ilerlemen tek yerde.<br>Kişisel koçun cebinde.</div></div>
    <div class="feat">${[["🏋️", "Sana özel program ve akıllı antrenman takibi"], ["🍽️", "Kalori, protein, su ve uyku takibi"], ["🤖", "Verilerini okuyan yapay zekâ koçu"], ["☁️", "Verilerin hesabına yedeklenir, telefon değişse de kaybolmaz"]].map((x) => `<div><span>${x[0]}</span>${x[1]}</div>`).join("")}</div>
    <button class="p ab" data-av="signup">Ücretsiz hesap oluştur</button>
    <button class="ab" data-av="login">Giriş yap</button>
    <button class="alink" data-aguest="1">Hesapsız devam et</button></div>`;

  if (v === "signup") return `<div class="auth">${back()}<h2>Hesap oluştur</h2><div class="t">Birkaç saniye sürer.</div><div class="c">
    ${fld("name", "Adın", "text", "örn: Ömer", "given-name", 'maxlength="24"')}
    ${fld("email", "E-posta", "email", "ornek@mail.com", "email", 'inputmode="email" autocapitalize="off"')}
    ${fld("pw", "Şifre", pwType(), "En az 8 karakter", "new-password")}
    ${fld("pw2", "Şifre (tekrar)", pwType(), "Şifreni tekrar yaz", "new-password")}
    <button class="chk ${AU.ok ? "on" : ""}" data-aok="1"><span>${AU.ok ? "✓" : ""}</span><div><a href="${qa(ACF.privacyUrl || "privacy.html")}" target="_blank" rel="noopener">Gizlilik politikasını</a> okudum, kabul ediyorum.</div></button>
    ${note()}${btn("signup", "Hesap oluştur")}</div>
    <button class="alink" data-av="login">Zaten hesabın var mı? <b>Giriş yap</b></button></div>`;

  if (v === "login") return `<div class="auth">${back()}<h2>Tekrar hoş geldin</h2><div class="t">Hesabına giriş yap.</div><div class="c">
    ${fld("email", "E-posta", "email", "ornek@mail.com", "email", 'inputmode="email" autocapitalize="off"')}
    ${fld("pw", "Şifre", pwType(), "Şifren", "current-password")}
    ${note()}${btn("login", "Giriş yap")}
    <button class="alink" data-av="forgot">Şifremi unuttum</button></div>
    <button class="alink" data-av="signup">Hesabın yok mu? <b>Hesap oluştur</b></button></div>`;

  if (v === "code") return `<div class="auth">${back("signup")}<h2>E-postanı doğrula</h2><div class="t"><b>${esc(AU.email)}</b> adresine bir doğrulama kodu gönderdik. Gelen kutunu (ve spam klasörünü) kontrol et.</div><div class="c">
    ${fld("code", "Doğrulama kodu", "text", "123456", "one-time-code", 'inputmode="numeric" maxlength="8"')}
    ${note()}${btn("code", "Doğrula ve başla")}
    <button class="alink" data-aresend="signup" ${AU.busy ? "disabled" : ""}>Kod gelmedi mi? <b>Tekrar gönder</b></button></div></div>`;

  if (v === "forgot") return `<div class="auth">${back("login")}<h2>Şifreni sıfırla</h2><div class="t">E-posta adresine bir sıfırlama kodu göndereceğiz.</div><div class="c">
    ${fld("email", "E-posta", "email", "ornek@mail.com", "email", 'inputmode="email" autocapitalize="off"')}
    ${note()}${btn("forgot", "Kod gönder")}</div></div>`;

  if (v === "reset") return `<div class="auth">${back("forgot")}<h2>Yeni şifre</h2><div class="t"><b>${esc(AU.email)}</b> adresine gelen kodu ve yeni şifreni yaz.</div><div class="c">
    ${fld("code", "Sıfırlama kodu", "text", "123456", "one-time-code", 'inputmode="numeric" maxlength="8"')}
    ${fld("pw", "Yeni şifre", pwType(), "En az 8 karakter", "new-password")}
    ${fld("pw2", "Yeni şifre (tekrar)", pwType(), "Tekrar yaz", "new-password")}
    ${note()}${btn("reset", "Şifreyi değiştir ve giriş yap")}
    <button class="alink" data-aresend="recovery" ${AU.busy ? "disabled" : ""}>Kod gelmedi mi? <b>Tekrar gönder</b></button></div></div>`;
  return "";
}

/* Account card in settings */
function acctCard() {
  if (!SB) return "";
  if (!sess) return `<div class="c"><h3>☁️ Hesap</h3><div class="tip">Hesapsız kullanıyorsun. Verilerin sadece bu cihazda. Ücretsiz hesap oluşturursan verilerin yedeklenir ve koçu kullanabilirsin.</div><div class="row"><button class="p" data-asignup="1">Hesap oluştur</button><button data-alogin="1">Giriş yap</button></div></div>`;
  const u = sess.user;
  return `<div class="c"><h3>☁️ Hesap</h3><div class="n">${esc((u.user_metadata && u.user_metadata.name) || "")}</div><div class="t">${esc(u.email || "")}</div><div class="tip">${saveErr ? "⚠️ Son değişiklikler henüz yedeklenmedi. İnternete bağlanınca tekrar denenecek." : "✓ Verilerin hesabına yedekleniyor."}</div>
  <div class="row"><button data-alogout="1">${AU.lo ? "Emin misin? Çıkış yap" : "Çıkış yap"}</button><button data-adel="1" style="color:var(--red)">${AU.del ? "Hesap kalıcı olarak silinsin mi? Evet" : "Hesabı sil"}</button></div>
  ${AU.del ? '<div class="tip" style="color:var(--red)">Hesabın ve tüm yedeklenmiş verilerin kalıcı olarak silinir. Bu işlem geri alınamaz.</div>' : ""}</div>`;
}

/* Coach view banner */
function coachGate() {
  if (!SB) return "";
  if (!sess) return `<div class="c"><h3>🔒 Koç için hesap gerekli</h3><div class="tip">Yapay zekâ koçu ücretsiz hesapla kullanılabilir. Hesabın verilerini de yedekler.</div><button class="p" data-asignup="1">Ücretsiz hesap oluştur</button></div>`;
  return AU.left != null ? `<div class="t" style="margin:-4px 0 10px 4px">Bugün kalan koç hakkın: <b>${AU.left}</b></div>` : "";
}

/* ---------------- cloud sync ---------------- */
function localHas() { return !!(st.prof || st.hist.length || st.body.length || Object.keys(st.food).length || st.plans.length); }
function replaceLocal(d) {
  Object.keys(st).forEach((k) => delete st[k]);
  Object.assign(st, JSON.parse(JSON.stringify(d)));
  fix(); WK = wk(td()); rw = WK;
  try { localStorage.setItem("fit2", JSON.stringify(st)); } catch (e) {}
}
function makeRef(uid) {
  return { set: (d) => SB.from("user_state").upsert({ user_id: uid, data: d, updated_at: new Date().toISOString() }).then((r) => { if (r.error) throw r.error; }) };
}
async function syncPull() {
  if (!SB || !sess) return;
  const uid = sess.user.id;
  const { data, error } = await SB.from("user_state").select("data").eq("user_id", uid).maybeSingle();
  if (error) { saveErr = true; dref = makeRef(uid); return; }
  const remote = data && data.data;
  if (remote && (st._uid !== uid || !localHas() || (remote._ts || 0) >= (st._ts || 0))) {
    replaceLocal(remote);
  } else {
    st._uid = uid;
    dref = makeRef(uid);
    sv();
  }
  st._uid = uid;
  dref = makeRef(uid);
  saveErr = false;
}
async function onSignedIn(s) {
  const first = !sess || sess.user.id !== s.user.id;
  sess = s;
  guest = false;
  try { localStorage.removeItem("fit_guest"); } catch (e) {}
  if (first) {
    await syncPull();
    const n = s.user.user_metadata && s.user.user_metadata.name;
    if (!st.prof && n && !ob.name) ob.name = n;
    if (st.prof && n && !st.prof.name) { st.prof.name = n; sv(); }
    AU.pw = AU.pw2 = AU.code = ""; AU.err = AU.msg = "";
  }
  render();
}
function wipeLocal() {
  try { ["fit2", "fit_bd", "fit_ss", "fit_guest"].forEach((k) => localStorage.removeItem(k)); } catch (e) {}
  Object.keys(st).forEach((k) => delete st[k]);
  fix(); ss = null; tab = "h"; WK = wk(td()); dref = null; saveErr = false;
  FX.setReminder(false);
}

function accountBoot(done) {
  if (!SB) { done(); return; }
  SB.auth.onAuthStateChange((ev, s) => {
    setTimeout(() => {
      if (ev === "SIGNED_OUT") { sess = null; dref = null; render(); }
      else if (s && (ev === "SIGNED_IN" || ev === "TOKEN_REFRESHED" || ev === "USER_UPDATED")) {
        if (!sess || sess.user.id !== s.user.id) onSignedIn(s); else sess = s;
      }
    }, 0);
  });
  SB.auth.getSession().then(async ({ data }) => {
    if (data.session) { sess = data.session; await syncPull(); }
    AU.ready = true; render(); done();
  }).catch(() => { AU.ready = true; render(); done(); });
  window.addEventListener("online", () => { if (dref) sv(); });
}
async function accountResume() {
  if (!SB || !sess || !dref) return;
  const { data } = await SB.from("user_state").select("data").eq("user_id", sess.user.id).maybeSingle();
  if (data && data.data && (data.data._ts || 0) > (st._ts || 0)) { replaceLocal(data.data); render(); }
}
async function accessToken() {
  const { data } = await SB.auth.getSession();
  if (!data.session) throw new Error("login-needed");
  return data.session.access_token;
}

/* ---------------- events ---------------- */
document.addEventListener("input", (e) => {
  const k = e.target.dataset && e.target.dataset.au;
  if (k !== undefined) { AU[k] = e.target.value; }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.dataset && e.target.dataset.au !== undefined) {
    const b = document.querySelector("[data-ago]"); if (b) b.click();
  }
});
document.addEventListener("click", async (e) => {
  if (e.target.closest && e.target.closest("a")) return;
  const el = (e.target.closest && e.target.closest("button")) || e.target;
  const d = el.dataset || {};
  if (d.av) { AU.v = d.av; AU.err = AU.msg = ""; render(); return; }
  if (d.apw) { AU.show = !AU.show; render(); return; }
  if (d.aok) { AU.ok = !AU.ok; render(); return; }
  if (d.aguest) { guest = true; try { localStorage.setItem("fit_guest", "1"); } catch (x) {} render(); return; }
  if (d.asignup || d.alogin) { guest = false; try { localStorage.removeItem("fit_guest"); } catch (x) {} AU.v = d.asignup ? "signup" : "login"; AU.err = AU.msg = ""; render(); return; }
  if (d.alogout) {
    if (!AU.lo) { AU.lo = true; AU.del = false; render(); return; }
    AU.lo = false;
    try { if (dref) await dref.set(JSON.parse(JSON.stringify(st))); } catch (x) {}
    await SB.auth.signOut().catch(() => {});
    sess = null; wipeLocal(); AU.v = "welcome"; render(); toast("Çıkış yapıldı");
    return;
  }
  if (d.adel) {
    if (!AU.del) { AU.del = true; AU.lo = false; render(); return; }
    AU.del = false;
    const { error } = await SB.rpc("delete_my_account");
    if (error) { toast(authErr(error)); return; }
    await SB.auth.signOut().catch(() => {});
    sess = null; wipeLocal(); AU.v = "welcome"; render(); toast("Hesabın ve verilerin silindi");
    return;
  }
  if (d.aresend) {
    AU.busy = true; AU.err = AU.msg = ""; render();
    const r = d.aresend === "signup" ? await SB.auth.resend({ type: "signup", email: AU.email }) : await SB.auth.resetPasswordForEmail(AU.email);
    AU.busy = false; if (r.error) AU.err = authErr(r.error); else AU.msg = "Yeni kod gönderildi."; render();
    return;
  }
  if (!d.ago) return;

  const go = d.ago, email = AU.email.trim().toLowerCase();
  AU.err = AU.msg = "";
  const fail = (m) => { AU.err = m; AU.busy = false; render(); };
  if (go !== "code" && go !== "reset" && !emailOk(email)) return fail("Geçerli bir e-posta adresi yaz.");
  if (go === "signup") {
    if (AU.name.trim().length < 2) return fail("Adını yaz.");
    if (AU.pw.length < 8) return fail("Şifre en az 8 karakter olmalı.");
    if (AU.pw !== AU.pw2) return fail("Şifreler aynı değil.");
    if (!AU.ok) return fail("Devam etmek için gizlilik politikasını kabul et.");
  }
  if (go === "login" && !AU.pw) return fail("Şifreni yaz.");
  if ((go === "code" || go === "reset") && !/^\d{6,8}$/.test(AU.code.trim())) return fail("E-postana gelen kodu yaz.");
  if (go === "reset") {
    if (AU.pw.length < 8) return fail("Şifre en az 8 karakter olmalı.");
    if (AU.pw !== AU.pw2) return fail("Şifreler aynı değil.");
  }
  AU.email = email; AU.busy = true; render();

  try {
    if (go === "signup") {
      const { data, error } = await SB.auth.signUp({ email, password: AU.pw, options: { data: { name: AU.name.trim() } } });
      if (error) return fail(authErr(error));
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) return fail(authErr("already registered"));
      AU.busy = false;
      if (data.session) { await onSignedIn(data.session); return; }
      AU.v = "code"; AU.code = ""; render(); return;
    }
    if (go === "login") {
      const { data, error } = await SB.auth.signInWithPassword({ email, password: AU.pw });
      if (error) {
        if (/not confirmed/i.test(error.message || "")) {
          await SB.auth.resend({ type: "signup", email });
          AU.busy = false; AU.v = "code"; AU.code = ""; AU.msg = "Hesabını doğrulaman gerekiyor. Yeni kod gönderdik."; render(); return;
        }
        return fail(authErr(error));
      }
      AU.busy = false; await onSignedIn(data.session); return;
    }
    if (go === "code") {
      const { data, error } = await SB.auth.verifyOtp({ email, token: AU.code.trim(), type: "signup" });
      if (error) return fail(authErr(error));
      AU.busy = false; await onSignedIn(data.session); toast("✅ Hesabın hazır"); return;
    }
    if (go === "forgot") {
      const { error } = await SB.auth.resetPasswordForEmail(email);
      if (error) return fail(authErr(error));
      AU.busy = false; AU.v = "reset"; AU.code = AU.pw = AU.pw2 = ""; render(); return;
    }
    if (go === "reset") {
      const { data, error } = await SB.auth.verifyOtp({ email, token: AU.code.trim(), type: "recovery" });
      if (error) return fail(authErr(error));
      const up = await SB.auth.updateUser({ password: AU.pw });
      if (up.error) return fail(authErr(up.error));
      AU.busy = false; await onSignedIn(data.session); toast("✅ Şifren değiştirildi"); return;
    }
  } catch (x) { fail(authErr(x)); }
});
