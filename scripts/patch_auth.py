import sys
p=sys.argv[1]; s=open(p,encoding="utf-8").read()
def rep(a,b):
    global s
    if s.count(a)!=1: raise SystemExit(f"MISS {s.count(a)}: {a[:80]!r}")
    s=s.replace(a,b)
rep('const sv=()=>{try{localStorage','const sv=()=>{st._ts=Date.now();try{localStorage')
rep('''function render0(){head();nav();if(!st.prof&&!ss){''','''function render0(){const $h=document.querySelector('.hd'),$n=document.getElementById('nav'),$m=document.getElementById('main');
if(SB&&!AU.ready){$h.style.display='none';$n.innerHTML='';$m.innerHTML='';return}
if(needAuth()){$h.style.display='none';$n.innerHTML='';$m.innerHTML=authv();return}
head();nav();if(!st.prof&&!ss){''')
rep('''function vkey(){if(!st.prof&&!ss)return"O";''','''function vkey(){if(SB&&!AU.ready)return"L";if(needAuth())return"A"+AU.v;if(!st.prof&&!ss)return"O";''')
rep('''if(k[0]=="S"&&pk[0]=="S")dx=''','''if(k[0]=="A"&&pk[0]=="A")dx=k=="Awelcome"?-1:1;else if(pk=="L")dy=1;else if(k[0]=="S"&&pk[0]=="S")dx=''')
rep('''window.FORMIQ_back=()=>{const c=document.getElementById("cel");if(c){c.remove();return true}''','''window.FORMIQ_back=()=>{const c=document.getElementById("cel");if(c){c.remove();return true}
if(needAuth()){if(AU.v!="welcome"){AU.v="welcome";AU.err="";render();return true}return false}''')
rep('''window.FORMIQ_resume=()=>{const w=wk(td());if(w!==WK){WK=w;rw=w}render()};''','''window.FORMIQ_resume=()=>{const w=wk(td());if(w!==WK){WK=w;rw=w}render();accountResume().catch(()=>{})};''')
# AI
a0=s.index("async function ai(p,task){"); a1=s.index("const profS=")
s=s[:a0]+r'''async function ai(p,task,input){const W=window;
if(SB){const tk=await accessToken();const ac=new AbortController(),to=setTimeout(()=>ac.abort(),60000);
try{const r=await fetch(ACF.supabaseUrl+"/functions/v1/coach",{method:"POST",signal:ac.signal,headers:{"content-type":"application/json",authorization:"Bearer "+tk,apikey:ACF.supabaseAnonKey},body:JSON.stringify({task:task||"coach",prompt:task=="food"?"":p,input:input||""})});
let j={};try{j=await r.json()}catch(x){}if(j.left!=null)AU.left=j.left;
if(r.status==401)throw new Error("login-needed");if(r.status==429)throw new Error(j.error=="quota"?"quota":"rate");if(!r.ok)throw new Error("network "+r.status);return String(j.text||"").trim()}
catch(e){throw e&&e.name=="AbortError"?new Error("timeout"):e}finally{clearTimeout(to)}}
if(W.claude&&W.claude.use){const sm=await W.claude.use("sample");if(sm){const r=await sm(p);return String(r&&r.text||r||"").trim()}}
throw new Error("ai-off")}
'''+s[a1:]
rep('''Liste: ${v}`,"food");''','''Liste: ${v}`,"food",v);''')
rep('''return /ai-off/.test(m)?"yapay zekâ sunucusu henüz ayarlanmadı"''','''return /ai-off/.test(m)?"yapay zekâ sunucusu henüz ayarlanmadı":/login-needed/.test(m)?"koç için giriş yapmalısın":/quota/.test(m)?"bugünkü koç hakkın doldu, yarın yenilenir"''')
rep('''function coachv(){return `<div class="c"><h3>🤖 FORMIQ Koç</h3>''','''function coachv(){if(SB&&!sess)return coachGate();return coachGate()+`<div class="c"><h3>🤖 FORMIQ Koç</h3>''')
rep('''return `<div class="c"><h3>👤 Profil ve hedefler</h3>''','''return acctCard()+`<div class="c"><h3>👤 Profil ve hedefler</h3>''')
rep('''Object.keys(st).forEach(k=>delete st[k]);fix();ss=null;tab="h";WK=wk(td());sv();FX.setReminder(false);''','''Object.keys(st).forEach(k=>delete st[k]);fix();if(sess)st._uid=sess.user.id;ss=null;tab="h";WK=wk(td());sv();FX.setReminder(false);''')
# remove claude db IIFE
i0=s.index('(async()=>{try{const db=await claude.use("db")'); i1=s.index('dref=r;render()}catch(e){}})();')+len('dref=r;render()}catch(e){}})();')
s=s[:i0]+s[i1:]
rep('''(function boot(){const sp=document.getElementById("splash");setTimeout(()=>{sp&&sp.classList.add("out");FX.hideSplash();setTimeout(()=>sp&&sp.remove(),600)},450);''','''(function boot(){const sp=document.getElementById("splash"),t0=Date.now();let hid=false;const hide=()=>{if(hid)return;hid=true;setTimeout(()=>{sp&&sp.classList.add("out");FX.hideSplash();setTimeout(()=>sp&&sp.remove(),600)},Math.max(0,450-(Date.now()-t0)))};
accountBoot(hide);setTimeout(hide,3000);''')
open(p,"w",encoding="utf-8").write(s); print("ok")
