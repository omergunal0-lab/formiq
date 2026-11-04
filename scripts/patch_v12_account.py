p="www/account.js";s=open(p,encoding="utf-8").read()
def rep(a,b):
    global s
    if s.count(a)!=1: raise SystemExit(f"MISS {s.count(a)}: {a[:90]!r}")
    s=s.replace(a,b)
rep('''const SB = (ACF.supabaseUrl && ACF.supabaseAnonKey && window.supabase)
  ? window.supabase.createClient(ACF.supabaseUrl, ACF.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: "formiq-auth" },
    })
  : null;''','''/* "Beni hatırla": on → the session is kept until sign-out; off → it ends when the app is closed. */
const remembered = () => { try { return localStorage.getItem("fit_rem") !== "0"; } catch (e) { return true; } };
const authStore = {
  getItem: (k) => { try { return localStorage.getItem(k) ?? sessionStorage.getItem(k); } catch (e) { return null; } },
  setItem: (k, v) => { try { if (remembered()) { localStorage.setItem(k, v); sessionStorage.removeItem(k); } else { sessionStorage.setItem(k, v); localStorage.removeItem(k); } } catch (e) {} },
  removeItem: (k) => { try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch (e) {} },
};
const SB = (ACF.supabaseUrl && ACF.supabaseAnonKey && window.supabase)
  ? window.supabase.createClient(ACF.supabaseUrl, ACF.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: "formiq-auth", storage: authStore },
    })
  : null;''')
rep('''let guest = false;
try { guest = localStorage.getItem("fit_guest") === "1"; } catch (e) {}
const AU = { ready: !SB, v: "welcome", name: "", email: "",''','''let guest = false;
try { localStorage.removeItem("fit_guest"); } catch (e) {}
let lastEmail = ""; try { lastEmail = localStorage.getItem("fit_email") || ""; } catch (e) {}
const AU = { ready: !SB, v: "login", rem: remembered(), name: "", email: lastEmail,''')
rep('const needAuth = () => !!SB && !sess && !guest;','const needAuth = () => !!SB && !sess;')
rep('''const back = (to) => `<button class="aback" data-av="${to || "welcome"}" aria-label="Geri">‹</button>`;''','''const back = (to) => `<button class="aback" data-av="${to || "login"}" aria-label="Geri">‹</button>`;''')
a=s.index('  if (v === "welcome") return'); b=s.index('  if (v === "signup") return')
s=s[:a]+s[b:]
rep('''  if (v === "login") return `<div class="auth">${back()}<h2>Tekrar hoş geldin</h2><div class="t">Hesabına giriş yap.</div><div class="c">
    ${fld("email", "E-posta", "email", "ornek@mail.com", "email", 'inputmode="email" autocapitalize="off"')}
    ${fld("pw", "Şifre", pwType(), "Şifren", "current-password")}
    ${note()}${btn("login", "Giriş yap")}''','''  if (v === "login") return `<div class="auth al">
    <div class="ob-hero">${LOGO}<h2>FORMIQ</h2><div class="t">Antrenman, beslenme ve ilerlemen tek yerde.</div></div><div class="c">
    ${fld("email", "E-posta", "email", "ornek@mail.com", "username", 'inputmode="email" autocapitalize="off"')}
    ${fld("pw", "Şifre", pwType(), "Şifren", "current-password")}
    <button class="chk ${AU.rem ? "on" : ""}" data-arem="1"><span>${AU.rem ? "✓" : ""}</span><div><b>Beni hatırla</b><br><span class="t">Açıkken çıkış yapana kadar tekrar şifre sorulmaz.</span></div></button>
    ${note()}${btn("login", "Giriş yap")}''')
rep('''  if (d.aguest) { guest = true; try { localStorage.setItem("fit_guest", "1"); } catch (x) {} render(); return; }
''','''  if (d.arem) { AU.rem = !AU.rem; render(); return; }
''')
rep('''  if (d.alogout) {
    if (!AU.lo) { AU.lo = true; AU.del = false; render(); return; }
    AU.lo = false;''','''  if (d.alogout) {
    if (!(await confirmBox("Çıkış yapılsın mı?", "Verilerin hesabında kalır. Tekrar giriş yapınca geri gelir.", "Çıkış yap", false))) return;''')
rep('''    sess = null; wipeLocal(); AU.v = "welcome"; render(); toast("Çıkış yapıldı");''','''    sess = null; wipeLocal(); AU.v = "login"; AU.pw = ""; render(); toast("Çıkış yapıldı");''')
rep('''  if (d.adel) {
    if (!AU.del) { AU.del = true; AU.lo = false; render(); return; }
    AU.del = false;''','''  if (d.adel) {
    if (!(await confirmBox("Hesabın kalıcı olarak silinsin mi?", "Hesabın ve yedeklenmiş tüm verilerin silinir. Bu işlem geri alınamaz.", "Hesabı sil"))) return;''')
rep('''    sess = null; wipeLocal(); AU.v = "welcome"; render(); toast("Hesabın ve verilerin silindi");''','''    sess = null; wipeLocal(); AU.v = "login"; AU.pw = ""; AU.email = ""; render(); toast("Hesabın ve verilerin silindi");''')
rep('''<div class="row"><button data-alogout="1">${AU.lo ? "Emin misin? Çıkış yap" : "Çıkış yap"}</button><button data-adel="1" style="color:var(--red)">${AU.del ? "Hesap kalıcı olarak silinsin mi? Evet" : "Hesabı sil"}</button></div>
  ${AU.del ? '<div class="tip" style="color:var(--red)">Hesabın ve tüm yedeklenmiş verilerin kalıcı olarak silinir. Bu işlem geri alınamaz.</div>' : ""}</div>`;''','''<div class="row"><button data-alogout="1">Çıkış yap</button><button data-adel="1" class="dng">Hesabı sil</button></div></div>`;''')
# remember choice is stored before signing in; remember email
rep('''    if (go === "login") {
      const { data, error } = await SB.auth.signInWithPassword({ email, password: AU.pw });''','''    if (go === "login") {
      try { localStorage.setItem("fit_rem", AU.rem ? "1" : "0"); localStorage.setItem("fit_email", email); } catch (x) {}
      const { data, error } = await SB.auth.signInWithPassword({ email, password: AU.pw });''')
rep('''    if (go === "signup") {
      const { data, error } = await SB.auth.signUp(''','''    if (go === "signup") {
      try { localStorage.setItem("fit_rem", "1"); localStorage.setItem("fit_email", email); } catch (x) {}
      const { data, error } = await SB.auth.signUp(''')
# never mix two users' data on one device
rep('''  const remote = data && data.data;
  if (remote && (st._uid !== uid''','''  const remote = data && data.data;
  if (st._uid && st._uid !== uid) { replaceLocal({}); }
  if (remote && (st._uid !== uid''')
open(p,"w",encoding="utf-8").write(s); print("account ok")
