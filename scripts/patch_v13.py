p="www/app.js";s=open(p,encoding="utf-8").read()
def rep(a,b,cnt=1):
    global s
    if s.count(a)!=cnt: raise SystemExit(f"MISS {s.count(a)}: {a[:100]!r}")
    s=s.replace(a,b)
def cut(start,end_marker):
    """replace from start (inclusive) up to end_marker (exclusive)"""
    global s
    i=s.index(start); j=s.index(end_marker,i); return i,j

# ---------- HOME: summary, workout, daily log, week, muscles ----------
i=s.index('<div class="c"><h3>🍽️ ${vday==td()?\'Bugünkü\':esc(fl(vday))} makrolar</h3>')
j=s.index('function progs(){')
sl_end=s.rindex('`}',i,j)
s=s[:i]+'''<div class="c"><h3>📝 Günlük takip</h3><div class="ql">
<div class="qi"><span class="qe">💧</span><div class="qv"><b>${LT(W_)} / ${LT(st.wg)} L</b><small>Su</small></div><div class="qb"><button class="sm" data-wu="1" data-wday="${t}" ${W_?'':'disabled'} aria-label="Son eklenen suyu geri al">↩</button><button class="sm" data-wt="250" data-wday="${t}">+250</button><button class="sm p" data-wt="500" data-wday="${t}">+500</button></div></div>
<div class="qi"><span class="qe">😴</span><div class="qv"><b>${(st.sleep[t]||{}).h?(st.sleep[t]||{}).h+' saat':'–'}</b><small>Uyku</small></div><div class="qb"><input id="slh" type="number" step="0.5" inputmode="decimal" placeholder="saat" aria-label="Uyku saati"><button class="sm" data-sls="1">Kaydet</button></div></div>
<div class="qi"><span class="qe">🚶</span><div class="qv"><b>${sp?sp.toLocaleString("tr-TR"):'–'}</b><small>Adım</small></div><div class="qb"><input id="stp" type="number" inputmode="numeric" placeholder="adım" aria-label="Adım sayısı"><button class="sm" data-sp="1">Kaydet</button></div></div>
</div></div>
${calCard()}${musMini()}'''+s[sl_end:]
rep('${streakCard()}${calCard()}<div class="c"><div class="top"><h3>🏋️ ${vday==td()?','<div class="c"><div class="top"><h3>🏋️ ${vday==td()?')

# calendar header carries the streak (streak card removed from home)
rep('''<div><h3>🗓 ${cw==0?'Bu hafta':cw==-1?'Geçen hafta':fmtD(ds[0])+' haftası'}</h3><div class="t">Kayıt eklemek için bir güne dokun</div></div>''',
'''<div><h3>${cw==0?(streak()>0?'🔥 '+streak()+' haftalık seri':'🗓 Bu hafta'):cw==-1?'🗓 Geçen hafta':'🗓 '+fmtD(ds[0])+' haftası'}</h3><div class="t">${cw==0?Math.min(cnt(WK),GL())+'/'+GL()+' antrenman · ':''}Kayıt eklemek için bir güne dokun</div></div>''')

# ---------- NUTRITION: one summary card + one "add" card ----------
i=s.index('function food(){'); j=s.index('\nfunction guide(){',i)
s=s[:i]+r'''let fmode="y";
function food(){const f=st.food[fd]||[],K=f.reduce((a,x)=>a+x.k,0),P=f.reduce((a,x)=>a+x.p,0),t=st.t,e=ei!=null?f[ei]:null;if(e)fmode="e";
const bar=(v,m,c)=>`<div class="pb"><i style="width:${m?Math.min(v/m*100,100):0}%;${c?'background:'+c:''}"></i></div>`,y=(st.food[sh(fd,-1)]||[]).length;
const list=f.length?`<div class="fl">${f.map((x,i)=>`<div class="fi"><div style="flex:1;min-width:0"><b>${esc(x.n||'Öğün')}</b><div class="t">${x.k} kcal · ${x.p} g protein</div></div><button class="ib" data-fs="${i}" aria-label="Favorilere ekle">☆</button><button class="ib" data-fe="${i}" aria-label="Düzenle">✎</button><button class="ib dng" data-fd="${i}" aria-label="Sil">✕</button></div>`).join("")}</div>`:'<div class="tip">Henüz bir şey eklemedin. Aşağıdan ekleyebilirsin.</div>';
let add;
if(fmode=="y")add=`<input id="ft" class="w" placeholder="örn: 2 yumurta, 1 dilim ekmek, 150 g tavuk"><button class="p" style="width:100%;margin-top:10px" data-fc="1">Hesapla ve ekle</button><div class="tip" id="fm">Normal yazar gibi, virgülle ayırarak yaz. 240'tan fazla yiyecek internetsiz tanınır.</div>`;
else if(fmode=="a")add=`<input class="w" data-fq="1" placeholder="Yiyecek ara: yumurta, tavuk, pilav…" autocomplete="off"><div class="row" style="align-items:center"><label style="margin:0">Porsiyon</label><input id="fqm" type="number" step="0.5" inputmode="decimal" value="1" style="width:76px"><span class="t">×</span></div><div id="fres">${fres("")}</div>`;
else if(fmode=="f")add=(st.fav.length?`<div class="fl">${st.fav.map((x,i)=>`<div class="fi"><div style="flex:1;min-width:0"><b>${esc(x.n)}</b><div class="t">${x.k} kcal · ${x.p} g</div></div><button class="p sm" data-fav="${i}">Ekle</button><button class="ib dng" data-fr="${i}" aria-label="Favorilerden çıkar">✕</button></div>`).join("")}</div>`:'<div class="tip">Listendeki yemeklerin yanındaki ☆ ile favorilere ekle; burada tek dokunuşla eklersin.</div>')+(y?`<button style="width:100%;margin-top:10px" data-cp="1">📋 ${fd==td()?'Dünkü':'Önceki günün'} öğünlerini kopyala (${y})</button>`:'');
else add=`<div class="row"><div style="flex:1;min-width:120px"><label>Ad</label><input id="fn" class="w" value="${qa(e&&e.n)}" placeholder="örn: Ev yemeği"></div><div><label>kcal</label><input id="fk" type="number" inputmode="numeric" value="${qa(e&&e.k)}"></div><div><label>Protein g</label><input id="fp" type="number" inputmode="numeric" value="${qa(e&&e.p)}"></div></div><div class="row"><button class="p" style="flex:1" data-fa="1">${e?'Güncelle':'Ekle'}</button>${e?'<button data-fx="1">İptal</button>':''}</div>`;
return `${dayPick()}<div class="c"><div class="top"><h3>🍽️ ${fd==td()?'Bugün':esc(fl(fd))}</h3><span class="t">${Math.max(t.k-K,0)} kcal · ${Math.max(t.p-P,0)} g protein kaldı</span></div>
<div class="mac"><div><div class="t">Kalori</div><div><b>${K}</b><span class="t"> / ${t.k}</span></div>${bar(K,t.k,'var(--ac2)')}</div><div><div class="t">Protein</div><div><b>${P} g</b><span class="t"> / ${t.p} g</span></div>${bar(P,t.p)}</div></div>${list}</div>
<div class="c"><h3>${e?'✏️ Öğünü düzenle':'➕ Yemek ekle'}</h3>${e?'':`<div class="seg">${[["y","Yaz"],["a","Ara"],["f","Favoriler"],["e","Elle"]].map(x=>`<button class="${fmode==x[0]?'on':''}" data-fmode="${x[0]}">${x[1]}</button>`).join("")}</div>`}${add}</div>
<details class="c"><summary><b>🎯 Günlük hedefler</b> <span class="t">${t.k} kcal · ${t.p} g protein</span></summary><div class="row"><div><label>kcal</label><input id="tk" type="number" value="${t.k||''}"></div><div><label>Protein g</label><input id="tp" type="number" value="${t.p||''}"></div><button data-ts="1">Kaydet</button></div><div class="tip">2-3 hafta sonra kilo beklediğin gibi değişmiyorsa kaloriyi ~150 azalt veya artır.</div></details>
<button class="ghost" data-to="c">🤖 Koça sor: bugün ne yiyebilirim?</button>`}'''+s[j:]
rep('else if(d.fx){ei=null;render()}','else if(d.fx){ei=null;fmode="y";render()}')
rep('else if(d.fa){const k=parseInt($v("fk"))||0,p=parseInt($v("fp"))||0;if(k||p){const L=st.food[fd]=st.food[fd]||[],o={n:$v("fn"),k,p};if(ei!=null&&L[ei])L[ei]=o;else L.push(o);ei=null;sv();render()}',
    'else if(d.fa){const k=parseInt($v("fk"))||0,p=parseInt($v("fp"))||0;if(k||p){const L=st.food[fd]=st.food[fd]||[],o={n:$v("fn"),k,p},ed_=ei!=null&&L[ei];if(ed_)L[ei]=o;else L.push(o);ei=null;if(ed_)fmode="y";sv();render();toast(ed_?"✅ Güncellendi":"＋ Eklendi")}')

# ---------- PROGRAMS hub ----------
rep('function progs(){return wizv()+planList()+progsList()}',r'''let pw=false;
function progs(){const P=edView(),ap=AP(),others=st.plans.map((p,i)=>({p,i})).filter(o=>o.p.id!=st.active);
return `<div class="c"><div class="t">Aktif program</div><div class="n" style="font-size:19px;margin:2px 0">${esc(P.name)}</div><div class="t">${P.days.length} gün · ${P.days.map(d=>esc(d.name)).join(" · ")}</div><div class="row"><button class="p" data-to="e">✏️ Düzenle</button><button data-mus="1">💪 Kas dengesi</button></div></div>
<div class="c"><h3>➕ Yeni program</h3><div class="tip">Hedefine göre hazır program oluşturabilir veya boş bir programla başlayıp hareketleri kendin seçebilirsin.</div><div class="row"><button class="${pw?'on':''}" data-pw="1">✨ Bana uygun program hazırla</button><button data-pnew="1">Boş programla başla</button></div></div>
${pw?wizv():''}
${others.length||ap?`<div class="c"><h3>📁 Diğer programların</h3>${ap?`<div class="fi"><div style="flex:1"><b>Varsayılan program</b><div class="t">İtiş · Çekiş · Bacak · Üst vücut</div></div><button class="sm" data-pact="def">Aktif yap</button></div>`:''}${others.map(o=>`<div class="fi"><div style="flex:1;min-width:0"><b>${esc(o.p.name)}</b><div class="t">${o.p.days.length} gün: ${o.p.days.map(d=>esc(d.name)).join(" · ")}</div></div><button class="sm" data-pact="${o.i}">Aktif yap</button><button class="ib dng" data-pld="${o.i}" aria-label="Sil">✕</button></div>`).join("")}</div>`:''}`}''')
rep('const TT={e:"Programım",r:"Rozetler",s:"Ayarlar",w:"Antrenman",y:"İlerleme",f:"Beslenme",m:"Daha fazla",l:"Program oluştur",p:"Programlar",',
    'const TT={e:"Programı düzenle",r:"Rozetler",s:"Ayarlar",w:"Antrenman",y:"İlerleme",f:"Beslenme",m:"Daha fazla",l:"Program oluştur",p:"Programlarım",')
i=s.index('function more(){return [');j=s.index('.map(x=>`<button class="mi"',i)
s=s[:i]+'function more(){return [["p","📁","Programlarım","Aktif program, düzenleme, yeni program"],["c","🤖","FORMIQ Koç","Verilerine göre soru sor"],["r","🏅","Rozetler","Kazandığın başarı rozetleri"],["g","📘","Rehber","Dinlenme, süperset, ilerleme kuralları"],["s","⚙️","Ayarlar","Hesap, profil, tema, hatırlatıcı"]]'+s[j:]

# ---------- PROGRESS: muscles + body measurements live here ----------
rep('''function histv(){return `<div class="tabs">${[["g","Genel"],["r","Haftalık rapor"],["p","Rekorlar"]].map(x=>`<button class="${ht==x[0]?'on':''}" data-ht="${x[0]}">${x[1]}</button>`).join("")}</div>`+(ht=="r"?repv():ht=="p"?prv():histG())}''',
'''function histv(){return `<div class="seg seg5">${[["g","Genel"],["k","Kaslar"],["b","Vücut"],["p","Rekorlar"],["r","Rapor"]].map(x=>`<button class="${ht==x[0]?'on':''}" data-ht="${x[0]}">${x[1]}</button>`).join("")}</div>`+(ht=="r"?repv():ht=="p"?prv():ht=="k"?musv():ht=="b"?body():histG())}''')
# heading icons + extra handlers
rep('function render(){render0();afterRender();','const chipH=h=>h.replace(/<h3>((?:\\p{Extended_Pictographic}|[\\u2600-\\u27BF])\\uFE0F?(?:\\u200D\\p{Extended_Pictographic}\\uFE0F?)*)\\s*/gu,\'<h3><span class="hi">$1</span>\');\nfunction render(){render0();const mm_=document.getElementById("main"),ch_=chipH(mm_.innerHTML);if(ch_!==mm_.innerHTML)mm_.innerHTML=ch_;afterRender();')
s+=r'''
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("button");if(!b||b.disabled)return;const d=b.dataset;
if(d.fmode){fmode=d.fmode;ei=null;render();setTimeout(()=>{const i=document.getElementById(fmode=="y"?"ft":fmode=="e"?"fn":"");const q=document.querySelector("[data-fq]");(i||q)&&fmode!="f"&&(i||q).focus()},300)}
else if(d.pw){pw=!pw;render()}
else if(d.pnew){const p={id:"pl"+Date.now(),name:"Yeni program",days:[{name:"Gün 1",ex:[]}]};st.plans.push(p);st.active=p.id;day=0;ed.d=0;ed.pick=null;sv();backTo="p";tab="e";render();window.scrollTo(0,0);toast("Boş program oluşturuldu, hareket ekle")}});
'''
open(p,"w",encoding="utf-8").write(s);print("v13 ok")
