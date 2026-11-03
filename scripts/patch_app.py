import re, sys
p = sys.argv[1]
s = open(p, encoding="utf-8").read()
n = 0
def rep(old, new, count=1):
    global s, n
    if s.count(old) != count:
        raise SystemExit(f"MISS ({s.count(old)}x): {old[:90]!r}")
    s = s.replace(old, new); n += 1

# 1) header
old_head = s[s.index("function head(){"):s.index("function nav(){")]
rep(old_head, r'''function head(){const c=Math.min(cnt(WK),GL()),nm_=((st.prof&&st.prof.name)||"").trim(),hr=new Date().getHours(),gr=hr<5?"İyi geceler":hr<12?"Günaydın":hr<18?"İyi günler":"İyi akşamlar",$=i=>document.getElementById(i);
$("hb").style.width=c/GL()*100+"%";$("hg").textContent=gr+(nm_?", "+nm_:"");$("hdt").textContent=new Date().toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"});
$("av").textContent=(nm_||"F")[0].toLocaleUpperCase("tr-TR");$("hwl").textContent="Bu hafta "+c+"/"+GL()+" antrenman";$("hwr").textContent=Math.round(c/GL()*100)+"%";
$("hs").innerHTML=`<span>🔥 ${streak()} hafta seri</span><span>Hafta ${WK}</span>${saveErr?"<span>⚠️ Buluta kaydedilemedi</span>":dref?"<span>☁️ Senkron</span>":""}`}
''')

# 2) nav with SVG icons
old_nav = s[s.index("function nav(){"):s.index("function line(")]
rep(old_nav, r'''const NI={h:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',w:'<path d="M6.5 6v12M17.5 6v12M3 9v6M21 9v6M6.5 12h11"/>',y:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',f:'<path d="M6 3v7a3 3 0 0 0 3 3v8M9 3v6M12 3v7a3 3 0 0 1-3 3"/><path d="M18 21V3c-2 1.2-3 4-3 7.5V13h3"/>',m:'<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>'};
function nav(){const cur={h:1,w:1,y:1,f:1}[tab]?tab:"m";document.getElementById("nav").innerHTML='<div class="bw">'+[["h","Bugün"],["w","Antrenman"],["y","İlerleme"],["f","Beslenme"],["m","Daha"]].map(x=>`<button class="${cur==x[0]?'on':''}" data-t="${x[0]}" aria-label="${x[1]}"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${NI[x[0]]}</svg></span>${x[1]}</button>`).join("")+'</div>'}
''')

# 3) home: rings instead of hard-coded greeting
rep('''return `<div class="c"><h3>Selam Ömer 👋</h3><div class="t">${new Date().toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})}</div></div>
''', '''const ring=(v,m,col,lab,val,unit,to)=>{const C=+(2*Math.PI*34).toFixed(2),q=Math.max(0,Math.min(v/(m||1),1));return `<button class="ring" ${to?`data-to="${to}"`:''}><svg viewBox="0 0 80 80"><circle class="rt" cx="40" cy="40" r="34"/><circle class="rv" cx="40" cy="40" r="34" stroke="${col}" stroke-dasharray="${C}" stroke-dashoffset="${(C*(1-q)).toFixed(2)}" style="--c:${C}"/></svg><div class="rc"><div>${val}<small>${unit}</small></div></div><div class="rl">${lab}</div></button>`},W_=wsum(t);
return `<div class="c"><div class="top"><h3>Bugünün özeti</h3><span class="t">${Math.max(T.k-K,0)} kcal kaldı</span></div><div class="rings" style="margin-top:8px">${ring(K,T.k,"var(--ac2)","Kalori",K,"/"+T.k,"f")}${ring(P,T.p,"var(--ac)","Protein",P+"g","/"+T.p+"g","f")}${ring(W_,st.wg,"var(--blue)","Su",LT(W_),"/"+LT(st.wg)+" L","f")}${ring(sp,10000,"var(--gold)","Adım",sp>=1000?(sp/1000).toFixed(1)+"k":sp,"/10k","")}</div></div>
''')

# 4) unified AI
rep('''async function ai(p){const sm=await claude.use("sample");if(!sm)throw new Error("sample yok");const r=await sm(p);return String(r&&r.text||r||"").trim()}''',
r'''async function ai(p,task){const W=window;if(W.claude&&W.claude.use){const sm=await W.claude.use("sample");if(sm){const r=await sm(p);return String(r&&r.text||r||"").trim()}}
const cf=W.FORMIQ_CONFIG||{};if(!cf.aiEndpoint)throw new Error("ai-off");const ac=new AbortController(),to=setTimeout(()=>ac.abort(),60000);
try{const r=await fetch(cf.aiEndpoint,{method:"POST",signal:ac.signal,headers:{"content-type":"application/json","x-formiq-key":cf.appKey||""},body:JSON.stringify({task:task||"coach",prompt:p})});
if(r.status==429)throw new Error("rate");if(!r.ok)throw new Error("network "+r.status);const j=await r.json();return String(j.text||"").trim()}catch(e){throw e&&e.name=="AbortError"?new Error("timeout"):e}finally{clearTimeout(to)}}
const profS=()=>{const p=st.prof;return p&&p.age?`${p.g}, ${p.age} yaş, ${p.h} cm, ${p.kg} kg, hedef: ${p.goal}, haftada ${p.days} gün antrenman, seviye: ${p.lvl}`:"profil bilgisi girilmedi"};''')
rep('''step="sample";const sm=await claude.use("sample");if(!sm){m.textContent="Hesaplama bu görünümde kullanılamıyor (sample yok). Aşağıdan elle ekleyebilirsin.";return}
step="istek";const r=await sm(''', '''step="istek";const r=await ai(''')
rep('''Liste: ${v}`);''', '''Liste: ${v}`,"food");''')
rep('''step="çözümleme";const tx=String(r&&r.text||r||"")''', '''step="çözümleme";const tx=String(r||"")''')
rep('''catch(e){m.textContent="Hesaplanamadı ("+step+": "+((e&&(e.code||e.message))||e)+"). Elle ekleyebilirsin."}}''',
    '''catch(e){m.textContent="Hesaplanamadı ("+er(e)+"). Hızlı aramadan veya elle ekleyebilirsin."}}''')
rep('''return /sample yok|denied''', '''return /ai-off/.test(m)?"yapay zekâ sunucusu henüz ayarlanmadı":/sample yok|denied''')
rep('''Kullanıcı 24 yaşında, 177 cm, yağ yakıp atletik ve belirgin hatlı bir fizik hedefliyor, haftada 4 gün spora gidiyor.''', '''Kullanıcı profili: ${profS()}.''')
rep('''Sen FORMIQ koçusun. Kullanıcı yağ yakıp atletik fizik hedefliyor. ${rw}''', '''Sen FORMIQ koçusun. Kullanıcı profili: ${profS()}. ${rw}''')

# 5) set rows grid
rep('''L.map((s,i)=>`<div class="row" style="align-items:center"><b style="width:46px">''', '''L.map((s,i)=>`<div class="setrow${cardio?' cardio':''}"><b class="t">''')
rep('''placeholder="RIR" style="width:58px">''', '''placeholder="RIR">''')

# 6) haptics + rest notifications
rep('''function startRest(s){tEnd=Date.now()+s*1000;''', '''function startRest(s){FX.impact("MEDIUM");FX.restNotify(s);tEnd=Date.now()+s*1000;''')
rep('''document.getElementById("tt").textContent="Hazır, devam! 💥";try{navigator.vibrate&&navigator.vibrate([200,100,200])}catch(e){}''',
    '''document.getElementById("tt").textContent="Hazır, devam! 💥";FX.success();''')
rep('''else if(t.id=="tx"){clearInterval(iv);''', '''else if(t.id=="tx"){FX.cancelRest();clearInterval(iv);''')
rep('''document.body.appendChild(o);try{navigator.vibrate&&navigator.vibrate([60,40,60])}catch(e){}}''', '''document.body.appendChild(o);FX.success()}''')
rep('''sv();ss.fin={dur,vol:Math.round(vol),sets,prs,n:ex.length};''', '''sv();FX.success();FX.cancelRest();ss.fin={dur,vol:Math.round(vol),sets,prs,n:ex.length};''')

# 7) more menu chevron
rep('''<span class="t">›</span></button>`).join("")}''', '''<span class="chev">›</span></button>`).join("")}''')

# 8) onboarding: name + empty defaults + new hero
rep('''let ob={g:"Erkek",goal:"Yağ yak",days:4,lvl:"Orta",prog:null,age:"24",h:"177",kg:"84",err:""};''',
    '''let ob={name:"",g:"Erkek",goal:"Yağ yak",days:4,lvl:"Orta",prog:null,age:"",h:"",kg:"",err:""};''')
rep('''const inp=(k,l,st_)=>`<div><label>${l}</label><input data-obi="${k}" type="number" inputmode="decimal" ${st_||''} value="${qa(ob[k])}"></div>`;''',
    '''const inp=(k,l,st_,ph)=>`<div style="flex:1;min-width:84px"><label>${l}</label><input style="width:100%" data-obi="${k}" type="number" inputmode="decimal" placeholder="${ph}" ${st_||''} value="${qa(ob[k])}"></div>`;''')
rep('''return `<div class="c" style="text-align:center;margin-top:18px"><div style="font-size:44px">💪</div><h2 style="margin:4px">FORMIQ’e hoş geldin</h2><div class="t">Birkaç bilgiyle hedeflerini ve programını sana göre kuralım. Yaklaşık 1 dakika sürer.</div></div>
<div class="c"><label>Cinsiyet</label>''', '''return `<div class="ob-hero"><svg class="lg" viewBox="0 0 64 64"><defs><linearGradient id="obg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3ddc84"/><stop offset="1" stop-color="#ff7a2f"/></linearGradient></defs><rect width="64" height="64" rx="18" fill="url(#obg)"/><path d="M20 46V18h24v7H28v5h13v7H28v9z" fill="#fff"/></svg><h2>FORMIQ’e hoş geldin</h2><div class="t">Hedeflerini ve programını sana göre kuralım. Yaklaşık 1 dakika sürer.</div></div>
<div class="c"><label>Adın</label><input class="w" data-obt="name" placeholder="örn: Ömer" autocomplete="given-name" maxlength="24" value="${qa(ob.name)}"><label style="margin-top:12px">Cinsiyet</label>''')
rep('''${inp("age","Yaş")}${inp("h","Boy (cm)")}${inp("kg","Kilo (kg)",'step="0.1"')}''', '''${inp("age","Yaş","","25")}${inp("h","Boy (cm)","","175")}${inp("kg","Kilo (kg)",'step="0.1"',"75")}''')
rep('''st.prof={g:ob.g,age,h,kg,''', '''st.prof={name:(ob.name||"").trim().slice(0,24),g:ob.g,age,h,kg,''')
rep('''if(st.prof&&st.prof.age){const p=st.prof;ob.g=p.g;''', '''if(st.prof&&st.prof.age){const p=st.prof;ob.name=p.name||"";ob.g=p.g;''')
rep('''if(d.obi!==undefined)ob[d.obi]=e.target.value;''', '''if(d.obi!==undefined)ob[d.obi]=e.target.value;
else if(d.obt!==undefined)ob[d.obt]=e.target.value;''')

# 9) settings additions: reminders, about, delete data
rep('''<div class="c"><h3>💾 Yedekle</h3>''', '''${remCard()}<div class="c"><h3>💾 Yedekle</h3>''')
rep('''<div class="row"><button data-rst="1">${rsc?'Emin misin? Evet, geri yükle':'Geri yükle'}</button></div><div class="tip" id="rsm"></div></div>`}''',
    '''<div class="row"><button data-rst="1">${rsc?'Emin misin? Evet, geri yükle':'Geri yükle'}</button></div><div class="tip" id="rsm"></div></div>
<div class="c"><h3>🗑 Tüm verileri sil</h3><div class="tip">Antrenman, beslenme ve ölçüm kayıtlarının tamamı bu cihazdan kalıcı olarak silinir.</div><button data-wipe="1" style="color:var(--red)">${wpc?'Emin misin? Her şeyi sil':'Verileri sil'}</button></div>
<div class="c"><h3>ℹ️ Hakkında</h3><div class="t">FORMIQ ${(window.FORMIQ_CONFIG||{}).version||''} · Verilerin yalnızca bu cihazda saklanır.</div><div class="tip">FORMIQ tıbbi tavsiye vermez. Yeni bir egzersiz veya beslenme programına başlamadan önce sağlık durumun için bir uzmana danış. Kalori ve makro değerleri tahminidir.</div><div class="row"><a class="g" href="${(window.FORMIQ_CONFIG||{}).privacyUrl||'privacy.html'}" target="_blank" rel="noopener">Gizlilik politikası ↗</a></div></div>`}
let wpc=false;
function remCard(){const r=st.rem||{on:false,t:"18:00"};return `<div class="c"><h3>🔔 Antrenman hatırlatıcısı</h3><div class="tip">Her gün seçtiğin saatte sana antrenman ve su hatırlatması gönderir.</div><div class="row" style="align-items:center"><div><label>Saat</label><input id="rmt" type="time" value="${r.t}" style="width:120px"></div><button class="${r.on?'on':''}" data-rem="1">${r.on?'Açık':'Kapalı'}</button></div>${FX.native?'':'<div class="t" style="margin-top:6px">Bildirimler mobil uygulamada çalışır.</div>'}</div>`}''')
rep('''else if(d.celx){''', '''else if(d.rem){const t_=$v("rmt")||"18:00",on=!(st.rem&&st.rem.on);st.rem={on,t:t_};sv();FX.setReminder(on,t_).then(ok=>{if(on&&ok===false){st.rem.on=false;sv();render();toast("Bildirim izni verilmedi")}});render();toast(on?"🔔 Hatırlatıcı "+t_+" için açıldı":"Hatırlatıcı kapatıldı")}
else if(d.wipe){if(!wpc){wpc=true;render();return}wpc=false;try{["fit2","fit_bd","fit_ss"].forEach(k=>localStorage.removeItem(k))}catch(x){}Object.keys(st).forEach(k=>delete st[k]);fix();ss=null;tab="h";WK=wk(td());sv();FX.setReminder(false);render();toast("Tüm veriler silindi")}
else if(d.celx){''')

# 10) view transitions + native hooks
rep('''function render(){render0();clearTimeout(bt);bt=setTimeout(chkBadges,250)}''',
r'''const ORD="hwyfm";let _vk=null;
function vkey(){if(!st.prof&&!ss)return"O";if(ss)return ss.fin?"F":"S"+ss.i;return"T"+tab+(tab=="l"?bd.step:"")}
function afterRender(){const k=vkey(),pk=_vk;_vk=k;FX.statusBar(k=="Th");if(pk===null||pk===k)return;
const m=document.getElementById("main"),T=c=>c[0]=="T"?c[1]:null;let dx=0,dy=0;
if(k[0]=="S"&&pk[0]=="S")dx=+k.slice(1)>+pk.slice(1)?1:-1;else if(k[0]=="S"||k=="F"||pk=="O")dy=1;else if(pk[0]=="S"||pk=="F")dy=-1;
else{const a=ORD.indexOf(T(k)),b=ORD.indexOf(T(pk));dx=a>=0&&b>=0?(a>b?1:-1):a<0&&b>=0?1:a>=0&&b<0?-1:(T(k)=="l"&&T(pk)=="l"?(k>pk?1:-1):1)}
window.scrollTo(0,0);if(matchMedia("(prefers-reduced-motion: reduce)").matches||!m.animate)return;
const E="cubic-bezier(.2,.8,.2,1)",tf=dx?`translate3d(${dx*32}px,0,0)`:dy>0?"translate3d(0,26px,0) scale(.98)":"scale(.985)";
m.animate([{opacity:0,transform:tf},{opacity:1,transform:"none"}],{duration:380,easing:E});
[...m.children].slice(0,7).forEach((el,i)=>{if(el.classList.contains("pt"))return;el.animate([{opacity:0,transform:"translate3d(0,12px,0)"},{opacity:1,transform:"none"}],{duration:440,delay:50+i*40,easing:E,fill:"backwards"})});
if(k=="Th"){const h=document.getElementById("hd");h.animate([{opacity:0,transform:"translate3d(0,-14px,0)"},{opacity:1,transform:"none"}],{duration:420,easing:E})}}
function render(){render0();afterRender();clearTimeout(bt);bt=setTimeout(chkBadges,250)}
window.FORMIQ_back=()=>{const c=document.getElementById("cel");if(c){c.remove();return true}
if(ss){if(ss.fin){endS();tab="h";render();return true}if(!ss.xc){ss.xc=1;render();toast("Çıkmak için tekrar geri bas");return true}endS();return true}
if("lpbcgsr".includes(tab)){tab="m";render();return true}if(tab!="h"){tab="h";render();return true}return false};
window.FORMIQ_resume=()=>{const w=wk(td());if(w!==WK){WK=w;rw=w}render()};''')

# hide hd via id (render0 uses .hd selector which still works) - make nav also hide on onboarding
open(p, "w", encoding="utf-8").write(s)
print("ok", n, "replacements")
