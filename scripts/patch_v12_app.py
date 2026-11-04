p="www/app.js";s=open(p,encoding="utf-8").read()
def rep(a,b,cnt=1):
    global s
    if s.count(a)!=cnt: raise SystemExit(f"MISS {s.count(a)}: {a[:100]!r}")
    s=s.replace(a,b)

# ---------- shared state + helpers ----------
rep('let ht="g",rw=WK,wtxt="",cw=0,bmk="kg",bdc=null,rsc=false,rsv="";',
r'''let ht="g",rw=WK,wtxt="",cw=0,bmk="kg",bdc=null,rsc=false,rsv="",vday=td(),backTo="m",ed={d:0,pick:null,q:"",rg:"*"};
const vdl=()=>vday==td()?"Bugün":fl(vday);
const dayPick=()=>`<div class="dayp ${vday!=td()?'past':''}"><button data-vsh="-1" aria-label="Önceki gün">‹</button><label class="dpl"><span>📅 ${vdl()}</span><small>${vday==td()?'Geçmiş bir güne kayıt eklemek için dokun':'Kayıtlar bu güne eklenir'}</small><input type="date" data-vdate="1" max="${td()}" value="${vday}" aria-label="Gün seç"></label><button data-vsh="1" ${vday>=td()?'disabled':''} aria-label="Sonraki gün">›</button></div>${vday!=td()?`<button class="today" data-vday="${td()}">Bugüne dön</button>`:''}`;
const setDay=d=>{if(!d||d>td())return;vday=d;fd=d;cw=0;render()};
function confirmBox(title,text,ok,danger){if(danger===undefined)danger=true;return new Promise(res=>{const o=document.createElement("div");o.id="cfm";
o.innerHTML=`<div class="cfb" role="alertdialog" aria-modal="true"><h3>${esc(title)}</h3>${text?`<div class="tip">${esc(text)}</div>`:''}<div class="cfr"><button data-cfn="1">Vazgeç</button><button data-cfy="1" class="${danger?'dng-p':'p'}">${esc(ok||"Sil")}</button></div></div>`;
document.body.appendChild(o);FX.impact("LIGHT");let done=false;const fin=v=>{if(done)return;done=true;o.classList.add("out");setTimeout(()=>o.remove(),200);res(v)};
o.addEventListener("click",e=>{e.stopPropagation();const b=e.target.closest("button");if(e.target===o||(b&&b.dataset.cfn))fin(false);else if(b&&b.dataset.cfy)fin(true)});o._cancel=()=>fin(false);setTimeout(()=>{const y=o.querySelector("[data-cfn]");y&&y.focus()},50)})}
''')

# ---------- home uses the selected day ----------
rep('function home(){const t=td(),f=st.food[t]','function home(){const t=vday,f=st.food[t]')
rep('''return `<div class="c"><div class="top"><h3>Bugünün özeti</h3>''','''const dayH=st.hist.map((h,i)=>({h,i})).filter(o=>o.h.d==t);
return `${dayPick()}<div class="c"><div class="top"><h3>${vday==td()?'Bugünün özeti':esc(fl(vday))+' özeti'}</h3>''')
rep('''<div class="c"><h3>🏋️ Sıradaki antrenman</h3>${nx>=0?`<div class="n">Gün ${nx+1} · ${base()[nx].t}</div><div class="tip">${base()[nx].e.slice(0,5).map(x=>x.n).join(" · ")}</div><button class="p" data-st="${nx}">▶ Başla</button>`:'<div class="n">Bu haftaki '+GL()+' antrenmanı tamamladın 🎉</div><div class="tip">Dinlen, uykuya ve yürüyüşe odaklan.</div>'}</div>''',
'''<div class="c"><div class="top"><h3>🏋️ ${vday==td()?'Sıradaki antrenman':esc(fl(vday))+' antrenmanı'}</h3><button class="sm" data-to="e">✏️ Düzenle</button></div>${dayH.length?`<div class="done-l">${dayH.map(o=>`<div>✅ <b>${esc(o.h.name)}</b> <span class="t">${Math.round(o.h.dur/60)} dk · ${o.h.vol} kg</span><button class="sm" data-hed="${o.i}">Düzenle</button></div>`).join("")}</div>`:''}${vday!=td()?`<div class="tip">${dayH.length?'Bu güne başka bir antrenman da ekleyebilirsin:':'Bu gün yaptığın antrenmanı seç ve setlerini gir:'}</div><div class="row">${base().map((d,i)=>`<button data-st="${i}">${esc(d.t)}</button>`).join("")}</div>`:nx>=0?`<div class="n">Gün ${nx+1} · ${esc(base()[nx].t)}</div><div class="tip">${base()[nx].e.slice(0,5).map(x=>esc(x.n)).join(" · ")}</div><button class="p" data-st="${nx}">▶ Başla</button>`:'<div class="n">Bu haftaki '+GL()+' antrenmanı tamamladın 🎉</div><div class="tip">Dinlen, uykuya ve yürüyüşe odaklan.</div>'}</div>''')
rep('''<div class="c"><h3>🍽️ Bugünkü makrolar</h3>''','''<div class="c"><h3>🍽️ ${vday==td()?'Bugünkü':esc(fl(vday))} makrolar</h3>''')
rep('''<div class="c"><h3>🚶 Yürüyüş</h3><div class="n">${sp} / 10000 adım</div>${pb(sp,10000)}<div class="row"><div><label>Adım</label><input id="stp" type="number" inputmode="numeric"></div><button data-sp="1">Güncelle</button></div></div>''',
'''<div class="c"><h3>🚶 Adım</h3><div class="n">${sp} / 10000 adım</div>${pb(sp,10000)}<div class="row"><div><label>Adım sayısı</label><input id="stp" type="number" inputmode="numeric" placeholder="${sp||'örn: 8500'}"></div><button data-sp="1">Kaydet</button></div></div>''')

# water / sleep follow the selected day
rep('function waterCard(full){const t=td(),n=wsum(t),g=st.wg;','function waterCard(full,day){const t=day||vday,n=wsum(t),g=st.wg;')
rep('''<div class="row">${[200,330,500].map(x=>`<button data-wt="${x}">+${x} ml</button>`).join("")}<button data-wu="1">↩ Geri al</button></div>`;''',
'''<div class="row">${[200,330,500].map(x=>`<button data-wt="${x}" data-wday="${t}">+${x} ml</button>`).join("")}<button data-wu="1" data-wday="${t}" ${n?'':'disabled'}>↩ Geri al</button></div>`;''')
rep('''<div class="c"><h3>💧 Su takibi</h3>''','''<div class="c"><h3>💧 Su${t!=td()?' · '+esc(fl(t)):''}</h3>''')
rep('${fd==td()?waterCard(true):\'\'}','${waterCard(true,fd)}')
rep('''function sleepCard(){const s=st.sleep[td()]||{};return `<div class="c"><h3>😴 Uyku</h3><div class="t">Dün gece kaç saat uyudun?</div>''',
'''function sleepCard(){const s=st.sleep[vday]||{};return `<div class="c"><h3>😴 Uyku${vday!=td()?' · '+esc(fl(vday)):''}</h3><div class="t">${vday==td()?'Dün gece':'O gece'} kaç saat uyudun?</div>''')
rep('else if(d.wt){(st.water[td()]=st.water[td()]||[]).push(+d.wt);sv();render();toast("💧 +"+d.wt+" ml")}',
    'else if(d.wt){const D_=d.wday||vday;(st.water[D_]=st.water[D_]||[]).push(+d.wt);sv();render();toast("💧 +"+d.wt+" ml"+(D_!=td()?" · "+fl(D_):""))}')
rep('else if(d.wu){const a=st.water[td()];if(a&&a.length){a.pop();sv();render()}}','else if(d.wu){const a=st.water[d.wday||vday];if(a&&a.length){a.pop();sv();render()}}')
rep('else if(d.slq){const o=st.sleep[td()]=st.sleep[td()]||{}','else if(d.slq){const o=st.sleep[vday]=st.sleep[vday]||{}')
rep('if(v>0&&v<=24){const o=st.sleep[td()]=st.sleep[td()]||{};','if(v>0&&v<=24){const o=st.sleep[vday]=st.sleep[vday]||{};')
rep('if(v>=0){st.steps[td()]=v;sv();render();toast("🚶 Adım güncellendi")}','if(v>=0){st.steps[vday]=v;sv();render();toast("🚶 Adım kaydedildi"+(vday!=td()?" · "+fl(vday):""))}')
rep('if(n<=td()){fd=n;ei=null;render()}','if(n<=td()){fd=n;vday=n;ei=null;render()}')

# calendar: tap a day to select it
rep('''return `<div style="padding:6px 2px;border-radius:10px;background:${dn?'var(--ac)':'var(--in)'};color:${dn?'#fff':'var(--tx)'};${d==t?'outline:2px solid var(--ac2)':''}"><div style="font-size:11px">${dn_[i]}</div><div style="font-size:15px;font-weight:700">${+d.slice(8)}</div><div style="font-size:10px;min-height:12px">${dn?(hs[0]?esc(hs[0].name).slice(0,6):'✓'):''}</div></div>`''',
'''return `<button class="calc${dn?' dn':''}${d==vday?' sel':''}${d==t?' tdy':''}" data-vday="${d}" ${d>t?'disabled':''} aria-label="${fl(d)}"><div style="font-size:11px">${dn_[i]}</div><div style="font-size:15px;font-weight:700">${+d.slice(8)}</div><div style="font-size:10px;min-height:12px">${dn?(hs[0]?esc(hs[0].name).slice(0,6):'✓'):''}</div></button>`''')
rep('''<h3>🗓 ${cw==0?'Bu hafta':cw==-1?'Geçen hafta':fmtD(ds[0])+' haftası'}</h3>''','''<div><h3>🗓 ${cw==0?'Bu hafta':cw==-1?'Geçen hafta':fmtD(ds[0])+' haftası'}</h3><div class="t">Kayıt eklemek için bir güne dokun</div></div>''')

# ---------- workout page ----------
rep('''let h=`<div class="c"><h3>🚶 Bugünkü yürüyüş</h3><div class="n">${sp} / 10000 adım</div><div class="pb"><i style="width:${Math.min(sp/100,100)}%"></i></div><div class="row"><div><label>Adım</label><input id="stp" type="number" inputmode="numeric"></div><button data-sp="1">Güncelle</button></div></div>`+`<div class="tabs">''',
'''let h=dayPick()+`<div class="tabs">''')
rep('''h+=`<div class="c"><h3>${esc(dd.t)}</h3>''','''h+=`<div class="c"><div class="top"><h3>${esc(dd.t)}</h3><button class="sm" data-to="e">✏️ Programı düzenle</button></div>''')
rep('''${dd.e.length?`<button class="p" style="width:100%;padding:14px;margin-top:12px" data-st="${day}">▶ Antrenmanı başlat</button>`:'<div class="tip">Bu günde hareket yok. Daha → Program oluştur’dan düzenle.</div>'}</div>`;''',
'''${dd.e.length?`<button class="p" style="width:100%;padding:14px;margin-top:12px" data-st="${day}">${vday==td()?'▶ Antrenmanı başlat':'✍️ '+esc(fl(vday))+' için kaydet'}</button>`:'<div class="tip">Bu günde hareket yok.</div><button class="p" data-to="e">＋ Hareket ekle</button>'}</div>`;''')

# ---------- session: date, edit mode, add/remove sets ----------
rep('''ss={day:i,id:dd.id||i,name:dd.t,t0:Date.now(),i:0,''','''ss={day:i,id:dd.id||i,name:dd.t,t0:Date.now(),i:0,date:vday,''')
rep('''return `<div class="c"><div style="display:flex;justify-content:space-between;align-items:center"><button data-sx="1">${ss.xc?'Emin misin? Çık':'✕ Çık'}</button><b id="el" style="font-size:20px">${fm(Math.round((Date.now()-ss.t0)/1000))}</b><span class="t">${ss.i+1} / ${n}</span></div>''',
'''const live=ss.edit==null&&(ss.date||td())==td();
return `<div class="c sess-hd"><div style="display:flex;justify-content:space-between;align-items:center"><button data-sx="1">✕ Çık</button>${live?`<b id="el" style="font-size:20px">${fm(Math.round((Date.now()-ss.t0)/1000))}</b>`:`<b style="font-size:14px">${ss.edit!=null?'✏️ Kaydı düzenliyorsun':'📅 '+esc(fl(ss.date))}</b>`}<span class="t">${ss.i+1} / ${n}</span></div>''')
rep('''<div class="t">${cardio?x.r:x.s+' × '+x.r+' · dinlenme '+fm(x.rest)}</div>''','''<div class="t">${cardio?(x.r||'Kardiyo'):L.length+(x.r?' × '+x.r:' set')+' · dinlenme '+fm(x.rest)}</div>''')
rep('''${cardio?'':'<div class="t">RIR: setin sonunda kaç tekrar daha yapabilirdin? (0 = tükendim)</div>'}''',
'''${cardio?'':`<div class="row"><button class="sm" data-sadd="1">＋ Set ekle</button>${L.length>1?'<button class="sm" data-srem="1">− Son seti sil</button>':''}</div><div class="t" style="margin-top:8px">RIR: setin sonunda kaç tekrar daha yapabilirdin? (0 = tükendim)</div>`}''')
rep('''${ss.i==n-1?'🏁 Antrenmanı bitir':'Devam →'}''','''${ss.i==n-1?(ss.edit!=null?'💾 Değişiklikleri kaydet':'🏁 Antrenmanı bitir'):'Devam →'}''')
rep('''function finS(){const dd=DS()[ss.day],dur=Math.round((Date.now()-ss.t0)/1000);''',
'''function finS(){const D_=ss.date||td(),live=ss.edit==null&&D_==td(),est=Math.round(sE().reduce((a,x,i)=>a+(x.rest?ss.log[i].length*(x.rest+40):(+ss.log[i][0].kg||20)*60),0)),dur=live?Math.round((Date.now()-ss.t0)/1000):est;''')
rep('''st.hist.push({d:td(),id:ss.id,name:dd.t,dur,vol:Math.round(vol),ex});st.prc=(st.prc||0)+prs.length;ss.hi=st.hist.length-1;
if(!st.done.some(x=>x.d==td()&&x.day==ss.id))st.done.push({d:td(),day:ss.id});''',
'''let ent;if(ss.edit!=null&&st.hist[ss.edit]){ent=Object.assign(st.hist[ss.edit],{ex,vol:Math.round(vol)});prs.length=0}
else{ent={d:D_,id:ss.id,name:ss.name,dur,vol:Math.round(vol),ex};st.hist.push(ent);st.prc=(st.prc||0)+prs.length;if(!st.done.some(x=>x.d==D_&&x.day==ss.id))st.done.push({d:D_,day:ss.id})}
st.hist.sort((a,b)=>a.d<b.d?-1:a.d>b.d?1:0);ss.hi=st.hist.indexOf(ent);''')
rep('''ss.fin={dur,vol:Math.round(vol),sets,prs,n:ex.length};''','''ss.fin={dur:ent.dur,vol:Math.round(vol),sets,prs,n:ex.length};''')
rep('''<h2 style="margin:4px">🎉 Antrenman tamam!</h2><div class="n">${esc(ss.name)}</div>''','''<h2 style="margin:4px">${ss.edit!=null?'✅ Kayıt güncellendi':'🎉 Antrenman tamam!'}</h2><div class="n">${esc(ss.name)}</div>${(ss.date||td())!=td()?`<div class="t">${esc(fl(ss.date))}</div>`:''}''')
rep('''<label style="margin-top:8px">Ağrı, sakatlık veya not (isteğe bağlı)</label>''','''<div class="row"><div><label>Süre (dakika)</label><input type="number" inputmode="numeric" data-hdur="1" value="${Math.round((h.dur||0)/60)}"></div></div><label style="margin-top:8px">Ağrı, sakatlık veya not (isteğe bağlı)</label>''')
rep('''if(s.ok){const x=sE()[ss.i];if(x.rest)startRest(x.rest)}''','''if(s.ok){const x=sE()[ss.i];if(x.rest&&ss.edit==null&&(ss.date||td())==td())startRest(x.rest);else FX.impact("LIGHT")}''')
rep('''else if(d.sx){if(ss.xc)endS();else{ss.xc=1;render()}}''','''else if(d.sx){confirmBox(ss.edit!=null?"Düzenlemeden çıkılsın mı?":"Antrenmandan çıkılsın mı?",ss.edit!=null?"Yaptığın değişiklikler kaydedilmez.":"Bu antrenmanda girdiğin setler kaydedilmez.","Çık").then(ok=>{if(ok)endS()})}''')

# ---------- history: edit + delete with confirmation ----------
rep('''<a href="#" data-hd="${o.i}">${hdc===o.i?'Emin misin? Sil':'Bu kaydı sil'}</a></details>''','''<div class="row"><button class="sm" data-hed="${o.i}">✏️ Düzenle</button><button class="sm dng" data-hd="${o.i}">🗑 Sil</button></div></details>''')
rep('''else if(d.hd!==undefined){e.preventDefault();const i=+d.hd;if(hdc===i){st.hist.splice(i,1);hdc=null;sv()}else hdc=i;render()}''',
'''else if(d.hd!==undefined){e.preventDefault();const i=+d.hd,h=st.hist[i];confirmBox("Antrenman kaydı silinsin mi?",fmtD(h.d)+" · "+h.name,"Sil").then(ok=>{if(!ok)return;st.hist.splice(i,1);const k=st.done.findIndex(x=>x.d==h.d&&x.day==h.id);if(k>=0&&!st.hist.some(y=>y.d==h.d&&y.id==h.id))st.done.splice(k,1);sv();render();toast("🗑 Kayıt silindi")})}''')

# ---------- other deletes get the confirmation dialog ----------
rep('''else if(d.fd!==undefined){e.preventDefault();st.food[fd].splice(+d.fd,1);ei=null;sv();render()}''',
'''else if(d.fd!==undefined){e.preventDefault();const it=st.food[fd][+d.fd];confirmBox("Öğün silinsin mi?",(it.n||"Öğün")+" · "+it.k+" kcal","Sil").then(ok=>{if(!ok)return;st.food[fd].splice(+d.fd,1);ei=null;sv();render();toast("🗑 Öğün silindi")})}''')
rep('''else if(d.bdel!==undefined){e.preventDefault();const i=+d.bdel;if(bdc===i){st.body.splice(i,1);bdc=null;sv()}else bdc=i;render()}''',
'''else if(d.bdel!==undefined){e.preventDefault();const i=+d.bdel;confirmBox("Ölçüm silinsin mi?",fmtD(st.body[i].d)+" tarihli kayıt","Sil").then(ok=>{if(!ok)return;st.body.splice(i,1);sv();render();toast("🗑 Ölçüm silindi")})}''')
rep('''<a href="#" data-bdel="${o.i}">${bdc===o.i?'Emin misin? Sil':'sil'}</a>''','''<a href="#" data-bdel="${o.i}">sil</a>''')
rep('''else if(d.pld!==undefined){const i=+d.pld;if(pdc==="pl"+i){const p=st.plans.splice(i,1)[0];if(st.active==p.id){st.active=null;day=0}pdc=null;sv()}else pdc="pl"+i;render()}''',
'''else if(d.pld!==undefined){const i=+d.pld;confirmBox("Program silinsin mi?",st.plans[i].name,"Sil").then(ok=>{if(!ok)return;const p=st.plans.splice(i,1)[0];if(st.active==p.id){st.active=null;day=0}sv();render();toast("🗑 Program silindi")})}''')
rep('''<button data-pld="${i}">${pdc==="pl"+i?'Emin misin? Sil':'Sil'}</button>''','''<button data-pld="${i}" class="dng">Sil</button>''')
rep('''else if(d.dx!==undefined){bd.days[bd.cur].ex.splice(+d.dx,1);render()}''',
'''else if(d.dx!==undefined){const x=bd.days[bd.cur].ex[+d.dx];confirmBox(x.n+" silinsin mi?","Bu günden kaldırılacak.","Sil").then(ok=>{if(!ok)return;bd.days[bd.cur].ex.splice(+d.dx,1);render()})}''')
rep('''else if(d.fr!==undefined){st.fav.splice(+d.fr,1);sv();render()}''','''else if(d.fr!==undefined){confirmBox("Favorilerden çıkarılsın mı?",st.fav[+d.fr].n,"Çıkar").then(ok=>{if(!ok)return;st.fav.splice(+d.fr,1);sv();render()})}''')
rep('''else if(d.wipe){if(!wpc){wpc=true;render();return}wpc=false;''','''else if(d.wipe){confirmBox("Tüm veriler silinsin mi?","Antrenman, beslenme ve ölçüm kayıtlarının tamamı kalıcı olarak silinir"+(sess?" (hesabındaki yedek dahil)":"")+". Bu işlem geri alınamaz.","Her şeyi sil").then(ok=>{if(!ok)return;''')
rep('''FX.setReminder(false);render();toast("Tüm veriler silindi")}''','''FX.setReminder(false);render();toast("Tüm veriler silindi")})}''')
rep('''<button data-wipe="1" style="color:var(--red)">${wpc?'Emin misin? Her şeyi sil':'Verileri sil'}</button>''','''<button data-wipe="1" class="dng">Verileri sil</button>''')

# ---------- navigation: program editor tab, smart back ----------
rep('''const TT={r:"Rozetler",''','''const TT={e:"Programım",r:"Rozetler",''')
rep('''const ttl=()=>tab=="h"?"":`<div class="pt">${"lpbcgsr".includes(tab)?'<button data-to="m">‹</button>':''}<h2>${TT[tab]}</h2></div>`;''',
'''const ttl=()=>tab=="h"?"":`<div class="pt">${"lpbcgsre".includes(tab)?`<button data-to="${backTo}" aria-label="Geri">‹</button>`:''}<h2>${TT[tab]}</h2></div>`;''')
rep('''function more(){return [["l","🧩","Program oluştur",''','''function more(){return [["e","✏️","Programım","Hareketleri değiştir, sil, sırala, gün ekle"],["l","🧩","Program oluştur",''')
rep('''{h:home,r:badgesv,''','''{h:home,e:edv,r:badgesv,''')
rep('''else if(d.to){tab=d.to;render();window.scrollTo(0,0)}''','''else if(d.to){if("lpbcgsre".includes(d.to)&&"hwyfm".includes(tab))backTo=tab;if(d.to=="e"){ed.pick=null;if(AP())ed.d=Math.min(day,AP().days.length-1)}if(d.to=="f")fd=vday;tab=d.to;render();window.scrollTo(0,0)}''')
rep('''if("lpbcgsr".includes(tab)){tab="m";render();return true}''','''const cf_=document.getElementById("cfm");if(cf_){cf_._cancel();return true}if(tab=="e"&&ed.pick){ed.pick=null;render();return true}if("lpbcgsre".includes(tab)){tab=backTo;render();return true}''')
rep('''if(needAuth()){if(AU.v!="welcome"){AU.v="welcome";AU.err="";render();return true}return false}''','''if(needAuth()){if(AU.v!="login"){AU.v="login";AU.err="";render();return true}return false}''')
rep('''if(k[0]=="A"&&pk[0]=="A")dx=k=="Awelcome"?-1:1;''','''if(k[0]=="A"&&pk[0]=="A")dx=k=="Alogin"?-1:1;''')
rep('''return"T"+tab+(tab=="l"?bd.step:"")}''','''return"T"+tab+(tab=="l"?bd.step:"")+(tab=="e"&&ed.pick?"p":"")}''')
rep('''window.FORMIQ_resume=()=>{const w=wk(td());if(w!==WK){WK=w;rw=w}''','''window.FORMIQ_resume=()=>{const w=wk(td());if(w!==WK){WK=w;rw=w}if(window._ltd&&window._ltd!==td()&&vday===window._ltd){vday=td();fd=vday}window._ltd=td();''')

# ---------- program editor ----------
s+=r'''
/* ===== Programım: edit the active program ===== */
const toPlanEx=x=>{const L=lk(x.n),m=x.p!==undefined?{p:x.p,x:x.x||""}:(L?{p:L.p,x:L.x||""}:mc(x.q||""));return{n:x.n,q:x.q||(L&&L.q)||x.n,p:m.p,x:m.x||"",rest:x.rest,s:x.s,r:x.r}};
const edView=()=>AP()||{name:"Varsayılan program",days:D.map(d=>({name:d.t,ex:d.e.map(toPlanEx)}))};
function edPlan(){let p=AP();if(p)return p;p={id:"pl"+Date.now(),name:"Programım",days:D.map(d=>({name:d.t,ex:d.e.map(toPlanEx)}))};st.plans.push(p);st.active=p.id;
st.done.forEach(x=>{if(typeof x.day=="number"&&x.day<D.length)x.day=p.id+"_"+x.day});day=0;return p}
const exRow=(x,i,n)=>{const cardio=x.p=="D"||!x.rest;return `<div class="exr"><div class="exh"><div class="exi">${i+1}</div><div style="flex:1;min-width:0"><div class="n" style="font-size:15px">${esc(x.n)}</div><div class="t">${cardio?"Kardiyo":esc(nm(x.p||""))}</div></div><div class="exm"><button data-eup="${i}" ${i==0?'disabled':''} aria-label="Yukarı taşı">↑</button><button data-edn="${i}" ${i==n-1?'disabled':''} aria-label="Aşağı taşı">↓</button></div></div>
<div class="row exc">${cardio?`<div style="flex:1;min-width:110px"><label>Süre</label><input class="w" data-er="${i}" value="${qa(x.r)}"></div>`:`<div><label>Set</label><div class="stp"><button data-esm="${i}" aria-label="Set azalt">−</button><b>${x.s}</b><button data-esp="${i}" aria-label="Set artır">+</button></div></div><div style="flex:1;min-width:84px"><label>Tekrar</label><input class="w" data-er="${i}" value="${qa(x.r)}"></div>`}<button class="sm" data-eswap="${i}">🔄 Değiştir</button><button class="sm dng" data-edel="${i}">🗑 Sil</button></div></div>`};
const pickItems=()=>{const P=edView(),k=ed.pick,cur=k&&k.mode=="rep"?P.days[ed.d].ex[k.i]:null,q=ed.q.trim().toLocaleLowerCase("tr-TR"),pm=cur&&cur.p&&cur.p!="D"?cur.p[0]:"";
let L=LB.map((x,i)=>({x,i})).filter(o=>(ed.rg=="*"||o.x.p.includes(ed.rg)||(o.x.x||"").includes(ed.rg))&&(!q||o.x.n.toLocaleLowerCase("tr-TR").includes(q))&&(!cur||o.x.n!=cur.n));
if(pm&&ed.rg=="*"&&!q)L.sort((a,b)=>(b.x.p.includes(pm))-(a.x.p.includes(pm)));return{L,pm}};
const pickList=()=>{const {L,pm}=pickItems();return L.length?L.slice(0,80).map(o=>`<div class="pkr"><div style="flex:1;min-width:0"><b>${esc(o.x.n)}</b>${pm&&o.x.p.includes(pm)?' <span class="ss">aynı bölge</span>':''}<div class="t">${o.x.p=="D"?"Kardiyo":esc(nm(o.x.p))}${o.x.x?' · yardımcı: '+esc(nm(o.x.x)):''}</div></div><button class="p sm" data-epick="${o.i}">Seç</button></div>`).join(""):'<div class="tip">Bu aramayla eşleşen hareket yok.</div>'};
function edv(){const P=edView();if(ed.d>=P.days.length)ed.d=Math.max(0,P.days.length-1);
if(ed.pick){const cur=ed.pick.mode=="rep"?P.days[ed.d].ex[ed.pick.i]:null;return `<div class="c"><div class="top"><div><h3>${cur?esc(cur.n)+' yerine ne yapacaksın?':'Hareket ekle'}</h3><div class="t">${esc(P.days[ed.d].name)}</div></div><button class="sm" data-ecancel="1">Vazgeç</button></div><input class="w" id="epq" data-epq="1" placeholder="🔍 Hareket ara…" value="${qa(ed.q)}" style="margin-top:10px" autocomplete="off"></div>
<div class="tabs"><button class="${ed.rg=="*"?'on':''}" data-erg="*">Tümü</button>${Object.keys(R).concat("D").map(c=>`<button class="${ed.rg==c?'on':''}" data-erg="${c}">${c=="D"?"Kardiyo":R[c][0]}</button>`).join("")}</div><div class="c" id="eplist">${pickList()}</div>`}
const dd=P.days[ed.d];
return `<div class="c"><label>Program adı</label><input class="w" data-epn="1" value="${qa(P.name)}" maxlength="40">${AP()?'':'<div class="tip">Şu an varsayılan programı kullanıyorsun. İlk değişiklikte senin için kopyalanır, sonra istediğin gibi düzenleyebilirsin.</div>'}</div>
<div class="tabs">${P.days.map((x,i)=>`<button class="${i==ed.d?'on':''}" data-eday="${i}">${i+1}. ${esc(x.name)} (${x.ex.length})</button>`).join("")}<button data-eaddday="1">＋ Gün ekle</button></div>
${dd?`<div class="c"><label>Gün adı</label><div class="row" style="margin-top:0;align-items:center"><input class="w" style="flex:1;width:auto" id="edn" data-ename="1" value="${qa(dd.name)}" maxlength="30"><button class="sm dng" data-edelday="1">Günü sil</button></div></div>
<div class="c">${dd.ex.length?dd.ex.map((x,i)=>exRow(x,i,dd.ex.length)).join(""):'<div class="tip">Bu günde hareket yok. Aşağıdan ekleyebilirsin.</div>'}<button class="p" style="width:100%;margin-top:12px" data-eadd="1">＋ Hareket ekle</button></div>`:'<div class="c"><div class="tip">Programında hiç gün yok. “＋ Gün ekle” ile başla.</div></div>'}
<div class="t" style="text-align:center;margin:4px 0 14px">✓ Değişiklikler otomatik kaydedilir</div>`}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("button");if(!b||b.disabled)return;const d=b.dataset;
if(d.eday!==undefined){ed.d=+d.eday;render()}
else if(d.eaddday){const p=edPlan();p.days.push({name:"Gün "+(p.days.length+1),ex:[]});ed.d=p.days.length-1;sv();render();toast("＋ Yeni gün eklendi");setTimeout(()=>{const i=document.getElementById("edn");if(i){i.focus();i.select()}},450)}
else if(d.edelday){const P=edView(),x=P.days[ed.d];confirmBox(`“${x.name}” günü silinsin mi?`,x.ex.length?`Bu gündeki ${x.ex.length} hareket de silinir.`:"",`Günü sil`).then(ok=>{if(!ok)return;const p=edPlan();p.days.splice(ed.d,1);ed.d=Math.max(0,ed.d-1);day=0;sv();render();toast("🗑 Gün silindi")})}
else if(d.eup!==undefined||d.edn!==undefined){const p=edPlan(),a=p.days[ed.d].ex,i=+(d.eup!==undefined?d.eup:d.edn),j=d.eup!==undefined?i-1:i+1;if(j<0||j>=a.length)return;const t=a[i];a[i]=a[j];a[j]=t;sv();render()}
else if(d.esm!==undefined||d.esp!==undefined){const p=edPlan(),x=p.days[ed.d].ex[+(d.esm!==undefined?d.esm:d.esp)];x.s=Math.max(1,Math.min(10,(+x.s||1)+(d.esp!==undefined?1:-1)));sv();render()}
else if(d.eswap!==undefined){ed.pick={mode:"rep",i:+d.eswap};ed.q="";ed.rg="*";render()}
else if(d.eadd){ed.pick={mode:"add"};ed.q="";ed.rg="*";render()}
else if(d.ecancel){ed.pick=null;render()}
else if(d.erg){ed.rg=d.erg;render()}
else if(d.epick!==undefined){const x=LB[+d.epick],p=edPlan(),a=p.days[ed.d].ex;if(ed.pick.mode=="rep"){const o=a[ed.pick.i],c1=!x.rest,c0=!o.rest,same=c1===c0;a[ed.pick.i]={n:x.n,q:x.q,p:x.p,x:x.x||"",rest:x.rest,s:same?o.s:(c1?1:3),r:same?o.r:(c1?"20 dk":"8-12")};toast("🔄 "+o.n+" → "+x.n)}else{a.push(mkEx(x));toast("＋ "+x.n+" eklendi")}ed.pick=null;sv();render()}
else if(d.edel!==undefined){const P=edView(),x=P.days[ed.d].ex[+d.edel];confirmBox(`${x.n} silinsin mi?`,`“${P.days[ed.d].name}” gününden kaldırılacak.`,"Sil").then(ok=>{if(!ok)return;const p=edPlan();p.days[ed.d].ex.splice(+d.edel,1);sv();render();toast("🗑 "+x.n+" silindi")})}
else if(d.hed!==undefined){startEdit(+d.hed)}
else if(d.vday){setDay(d.vday)}
else if(d.vsh){setDay(sh(vday,+d.vsh))}
else if(d.sadd){const L=ss.log[ss.i];L.push({kg:L.length?L[L.length-1].kg:"",r:"",q:"",ok:false});sE()[ss.i].s=L.length;saveS();render()}
else if(d.srem){const L=ss.log[ss.i],last=L[L.length-1],go=()=>{L.pop();sE()[ss.i].s=L.length;saveS();render()};if(last&&(last.kg!==""||last.r!==""))confirmBox("Son set silinsin mi?",`Set ${L.length}: ${last.kg||"–"} kg × ${last.r||"–"}`,"Sil").then(ok=>ok&&go());else go()}
else if(b.id=="tm15"||b.id=="tp15"){tEnd=Math.max(Date.now()+1000,tEnd+(b.id=="tp15"?15000:-15000));FX.restNotify(Math.round((tEnd-Date.now())/1000));tick()}});
document.addEventListener("input",e=>{const d=e.target.dataset,v=e.target.value;
if(d.ename!==undefined){const p=edPlan();p.days[ed.d].name=v.slice(0,30);sv();const t=document.querySelector(`[data-eday="${ed.d}"]`);if(t)t.textContent=`${ed.d+1}. ${v} (${p.days[ed.d].ex.length})`}
else if(d.epn!==undefined){edPlan().name=v.slice(0,40);sv()}
else if(d.er!==undefined){const p=edPlan();p.days[ed.d].ex[+d.er].r=v.slice(0,20);sv()}
else if(d.epq!==undefined){ed.q=v;const l=document.getElementById("eplist");if(l)l.innerHTML=pickList()}
else if(d.hdur!==undefined&&ss&&ss.fin&&st.hist[ss.hi]){const m=parseInt(v);if(m>0&&m<600){st.hist[ss.hi].dur=m*60;ss.fin.dur=m*60;sv()}}});
document.addEventListener("change",e=>{if(e.target.dataset.vdate!==undefined)setDay(e.target.value)});
function startEdit(i){const h=st.hist[i];if(!h)return;const ex=h.ex.map(e=>{const L=lk(e.n),m=L?{p:L.p,x:L.x||""}:mc(e.q||"");const rest=e.c?0:((L&&L.rest)||90);return Object.assign(X(e.n,e.sets.length,e.c?"":"",rest,e.q||(L&&L.q)||e.n,"Değerleri düzelt, sonra son adımda “Değişiklikleri kaydet”e bas."),{p:e.c?"D":m.p,x:m.x})});
ss={day:null,id:h.id,name:h.name,t0:Date.now(),i:0,date:h.d,edit:i,ex,log:h.ex.map(e=>e.sets.map(s=>({kg:String(s.kg==null?"":s.kg),r:e.c?"":String(s.r==null?"":s.r),q:s.q==null?"":String(s.q),ok:true}))),fin:null};saveS();render()}
window._ltd=td();
'''
open(p,"w",encoding="utf-8").write(s); print("app ok")
