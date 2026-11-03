const X=(n,s,r,rest,q,tip,ss)=>({n,s,r,rest,q,tip,ss});
const A1=X("Asılarak diz çekme",3,"10-12",45,"hanging knee raise","Sallanma yok, kalçayı kıvırarak çek, yavaş indir.","Cable crunch ile");
const A2=X("Cable crunch",3,"12-15",45,"cable crunch","Kalçan sabit, sadece omurgayı kıvır, karnı sık.","Asılarak diz çekme ile");
const A3=X("Ters crunch",3,"12-15",45,"reverse crunch","Dizleri göğse çek, kalçayı yerden hafif kaldır.","Cable woodchop ile");
const A4=X("Cable woodchop",3,"12",45,"cable woodchop","Gövdeyi çevir, kollar sadece taşır, kontrollü yap.","Ters crunch ile");
const D=[
{t:"İtiş",e:[X("Bench press",4,"6-8",150,"barbell bench press form","Kürek kemiklerini sık, barı göğüs ortasına yavaş indir, güçlü it."),X("Eğik dumbbell press",3,"8-10",90,"incline dumbbell press","Bank 30°, dirsekler gövdeden 45° açıda."),X("Omuz press",3,"8-10",90,"dumbbell shoulder press","Karnını sık, belini kavisletme."),X("Lateral raise",3,"12-15",60,"dumbbell lateral raise","Dirsek hafif bükük, omuz hizasına kadar, sallanma yok."),X("Triceps pushdown",3,"10-12",60,"cable triceps pushdown","Dirsekler gövdeye yapışık, altta tam aç.")]},
{t:"Çekiş + Kardiyo",e:[X("Barbell / T-bar row",4,"6-8",150,"barbell bent over row","Sırtın düz, kürek kemiklerini birleştirerek göbeğe çek."),X("Lat pulldown / Pull-up",3,"8-10",90,"lat pulldown form","Göğsü barına doğru getir, omuzları kulaktan uzak tut."),X("Chest-supported row",3,"10",90,"chest supported row","Gövde sabit, dirsekleri arkaya sür, 1 sn sık."),X("Face pull",3,"15",60,"cable face pull","Halatı yüze çek, dirsekler yüksek, arka omuzu hisset."),X("Biceps curl",3,"10-12",60,"dumbbell biceps curl","Dirsekler sabit, sallanma yok, yavaş indir."),X("Kardiyo: eğimli yürüyüş / hafif koşu",1,"25-30 dk",0,"incline treadmill walk","Konuşabileceğin tempo (zone 2).")]},
{t:"Bacak",e:[X("Squat",4,"6-8",180,"barbell back squat","Dizler ayak yönünde, paralele in, topuktan it."),X("Romanian deadlift",3,"8-10",120,"romanian deadlift","Kalçayı geri it, bar bacağa yakın, arka bacakta gerilim."),X("Leg press",3,"10-12",90,"leg press form","Bel yastıktan kalkmasın, dizleri kilitleme."),X("Leg curl",3,"12",60,"seated leg curl","Yavaş indir, üstte 1 sn sık."),X("Calf raise",4,"12",60,"standing calf raise","Altta tam gerin, üstte 1 sn bekle.")]},
{t:"Üst Vücut + Kardiyo",e:[X("Eğik bench / dumbbell press",3,"8-10",90,"incline bench press","Üst göğse odaklan, kontrollü indir."),X("Pull-up / Lat pulldown",3,"8-10",90,"pull up form","Tam aşağıdan başla, çeneyi barın üstüne getir."),X("Dumbbell row",3,"10",75,"one arm dumbbell row","Dirseği kalçaya çek, gövdeyi döndürme."),X("Lateral raise",3,"15",60,"dumbbell lateral raise","Hafif ağırlık, çok tekrar, pompayı hisset."),X("Cable fly",2,"12-15",60,"cable chest fly","Kollar hafif bükük, göğüste sık."),X("Biceps + Triceps",3,"12",60,"biceps triceps superset","Biceps curl ve triceps arka arkaya, sonra dinlen.","Biceps ↔ Triceps"),X("Kardiyo: hafif tempo",1,"20-25 dk",0,"treadmill jogging","Rahat tempo, nefes nefese kalma.")]}
];
const td=()=>new Date().toISOString().slice(0,10);
let st;try{st=JSON.parse(localStorage.getItem("fit2"))}catch(e){}
st=st||{};st.w=st.w||{};st.done=st.done||[];st.body=st.body||[];st.food=st.food||{};st.t=(st.t&&st.t.k)?st.t:{k:2200,p:160};st.start=st.start||td();st.steps=st.steps||{};st.progs=st.progs||[];st.chat=st.chat||[];st.hist=st.hist||[];st.plans=st.plans||[];st.water=st.water||{};st.fav=st.fav||[];st.sleep=st.sleep||{};st.wg=st.wg||3000;
let dref=null,tm,saveErr=false;
const sv=()=>{st._ts=Date.now();try{localStorage.setItem("fit2",JSON.stringify(st))}catch(e){}clearTimeout(tm);if(dref)tm=setTimeout(()=>dref.set(JSON.parse(JSON.stringify(st))).then(()=>{if(saveErr){saveErr=false;render()}}).catch(()=>{if(!saveErr){saveErr=true;try{toast("⚠️ Buluta kaydedilemedi, veri bu cihazda duruyor")}catch(e){}render()}}),800)};
const wk=d=>Math.floor((new Date(d)-new Date(st.start))/6048e5)+1;
let WK=wk(td());const key=(w,d,e,s)=>w+"|"+d+"|"+e+"|"+s;
const fm=s=>Math.floor(s/60)+":"+String(s%60).padStart(2,"0");
const mk=ex=>ex.map(x=>Object.assign(X(x.n,x.s,x.r,x.rest,x.q,"Kontrollü yap, tam hareket açıklığı, 1-2 tekrar depoda bırak."),{p:x.p,x:x.x}));
const AP=()=>st.plans.find(p=>p.id==st.active);
const base=()=>{const p=AP();return p?p.days.map((d,i)=>({t:d.name,id:p.id+"_"+i,e:mk(d.ex)})):D};
const GL=()=>base().length;
const DS=()=>AP()?base():D.concat(st.progs.map(p=>({t:p.name,id:p.id,e:mk(p.ex)})));
const dk=()=>DS()[day]&&DS()[day].id||day;
let tab="h",day=0,tEnd=0,iv;
const cnt=w=>st.done.filter(x=>wk(x.d)==w).length;
function streak(){let n=0,w=WK;if(cnt(w)<GL())w--;while(w>0&&cnt(w)>=GL()){n++;w--}return n}
function head(){const c=Math.min(cnt(WK),GL()),nm_=((st.prof&&st.prof.name)||"").trim(),hr=new Date().getHours(),gr=hr<5?"İyi geceler":hr<12?"Günaydın":hr<18?"İyi günler":"İyi akşamlar",$=i=>document.getElementById(i);
$("hb").style.width=c/GL()*100+"%";$("hg").textContent=gr+(nm_?", "+nm_:"");$("hdt").textContent=new Date().toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"});
$("av").textContent=(nm_||"F")[0].toLocaleUpperCase("tr-TR");$("hwl").textContent="Bu hafta "+c+"/"+GL()+" antrenman";$("hwr").textContent=Math.round(c/GL()*100)+"%";
$("hs").innerHTML=`<span>🔥 ${streak()} hafta seri</span><span>Hafta ${WK}</span>${saveErr?"<span>⚠️ Buluta kaydedilemedi</span>":dref?"<span>☁️ Senkron</span>":""}`}
const NI={h:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',w:'<path d="M6.5 6v12M17.5 6v12M3 9v6M21 9v6M6.5 12h11"/>',y:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',f:'<path d="M6 3v7a3 3 0 0 0 3 3v8M9 3v6M12 3v7a3 3 0 0 1-3 3"/><path d="M18 21V3c-2 1.2-3 4-3 7.5V13h3"/>',m:'<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>'};
function nav(){const cur={h:1,w:1,y:1,f:1}[tab]?tab:"m";document.getElementById("nav").innerHTML='<div class="bw">'+[["h","Bugün"],["w","Antrenman"],["y","İlerleme"],["f","Beslenme"],["m","Daha"]].map(x=>`<button class="${cur==x[0]?'on':''}" data-t="${x[0]}" aria-label="${x[1]}"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${NI[x[0]]}</svg></span>${x[1]}</button>`).join("")+'</div>'}
function line(a,col){if(a.length<2)return"";const mn=Math.min(...a),mx=Math.max(...a),r=(mx-mn)||1;return `<polyline fill="none" stroke="${col}" stroke-width="3" stroke-linecap="round" points="${a.map((v,i)=>(10+i*(300/(a.length-1)))+","+(90-(v-mn)/r*70)).join(" ")}"/>`}
let fd=td(),ei=null;
const sh=(d,n)=>{const x=new Date(d+"T12:00:00");x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)};
const fl=d=>d==td()?"Bugün":d==sh(td(),-1)?"Dün":new Date(d+"T12:00:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",weekday:"short"});
const qa=v=>String(v==null?"":v).replace(/"/g,"&quot;");
function food(){const f=st.food[fd]||[],K=f.reduce((a,x)=>a+x.k,0),P=f.reduce((a,x)=>a+x.p,0),t=st.t,e=ei!=null?f[ei]:null;
const LI=f.length?`<ul>${f.map((x,i)=>`<li>${x.n||'Öğün'}: ${x.k} kcal, ${x.p} g <a href="#" data-fe="${i}">düzenle</a> · <a href="#" data-fs="${i}">⭐</a> · <a href="#" data-fd="${i}">sil</a></li>`).join("")}</ul>`:'<div class="tip">Bu gün için kayıt yok.</div>';
const pb=(v,m)=>m?`<div class="pb"><i style="width:${Math.min(v/m*100,100)}%"></i></div>`:"";
return `${fd==td()?waterCard(true):''}<div class="c" style="display:flex;align-items:center;gap:8px"><button data-fn="-1">‹</button><b style="flex:1;text-align:center">${fl(fd)}</b><button data-fn="1" ${fd>=td()?'disabled':''}>›</button></div>
<div class="c"><h3>${fl(fd)} toplam</h3><div class="n">🔥 ${K} ${t.k?'/ '+t.k:''} kcal</div>${pb(K,t.k)}<div class="n">🥩 ${P} ${t.p?'/ '+t.p:''} g protein</div>${pb(P,t.p)}${f.length?`<ul>${f.map((x,i)=>`<li>${x.n||'Öğün'}: ${x.k} kcal, ${x.p} g <a href="#" data-fe="${i}">düzenle</a> · <a href="#" data-fs="${i}">⭐</a> · <a href="#" data-fd="${i}">sil</a></li>`).join("")}</ul>`:'<div class="tip">Bu gün için kayıt yok.</div>'}</div>
${fqCard()}<div class="c"><h3>✍️ Ne yedin? (${fl(fd)})</h3><input id="ft" class="w" placeholder="örn: 2 yumurta, 1 dilim ekmek, 150 g tavuk göğsü"><div class="row"><button class="p" data-fc="1">Hesapla</button></div><div class="tip" id="fm">Yazdıklarının kalori ve proteinini tahmin eder. Değerler yaklaşıktır, porsiyonu yazarsan daha doğru olur.</div></div>
${favCard()}<div class="c"><h3>${e?'Öğünü düzenle':'Elle ekle'}</h3><div class="row"><div><label>Ad</label><input id="fn" style="width:110px" value="${qa(e&&e.n)}"></div><div><label>kcal</label><input id="fk" type="number" inputmode="numeric" value="${qa(e&&e.k)}"></div><div><label>Protein g</label><input id="fp" type="number" inputmode="numeric" value="${qa(e&&e.p)}"></div><button class="p" data-fa="1">${e?'Güncelle':'Ekle'}</button>${e?'<button data-fx="1">İptal</button>':''}</div></div>
<div class="c"><h3>📋 ${fl(fd)} yediklerin</h3>${LI}</div>
<div class="c"><h3>Günlük hedefler</h3><div class="row"><div><label>kcal</label><input id="tk" type="number" value="${t.k||''}"></div><div><label>Protein g</label><input id="tp" type="number" value="${t.p||''}"></div><button data-ts="1">Kaydet</button></div><div class="tip">Başlangıç hedefi: 2200 kcal, 160 g protein. 2-3 hafta sonra kilo düşmüyorsa kaloriyi ~150 azalt.</div></div>`}
function guide(){return `<div class="c"><h3>⏱ Dinlenme süresi</h3><ul><li><b>Ağır ana hareketler</b> (bench, squat, row, deadlift): 2-3 dk. Kısa tutarsan ağırlık düşer, kas kazancı azalır.</li><li><b>Yardımcı hareketler</b> (press, çekiş, leg press): 90 sn-2 dk.</li><li><b>İzolasyon</b> (lateral raise, curl, triceps, calf): 45-60 sn.</li><li><b>Karın:</b> 30-45 sn, kısa tut.</li></ul></div>
<div class="c"><h3>🔁 Süperset ne zaman?</h3><ul><li><b>Küçük kas hareketlerini süperset yap</b> (lateral raise + face pull gibi): arka arkaya yapıp sonra 45-60 sn dinlen, zaman kazanırsın.</li><li><b>Biceps + triceps</b> da süpersete çok uygun (zıt kaslar).</li><li><b>Ana ağır hareketlerde (bench, squat, row) süperset yapma.</b> Tam dinlen.</li></ul></div>
<div class="c"><h3>🏋️ Ağırlık seçimi: max mı, form mu?</h3><ul><li><b>Max ağırlıkla (1 tekrar) çalışma.</b> Hedefin kas ve hat, tek tekrar gücü değil. Tekrar aralığını bitirebileceğin, sonunda 1-2 tekrar depoda kalan ağırlığı seç.</li><li><b>Form önce gelir.</b> Ağırlığı artırmanın şartı, aynı formla tüm tekrarları yapmak.</li><li><b>Form bozulursa set biter.</b> Squat, deadlift, row ve bench’te form bozulması sakatlık riskidir; kabul etme.</li><li><b>Küçük bozulma sadece izolasyonda ve son 1-2 tekrarda</b> (lateral raise, curl) kabul edilebilir; hafif sallayarak bitirmek olur ama alışkanlık yapma.</li><li>Kalori açığında güç biraz düşebilir, ağırlıkları korumak bile başarı sayılır.</li></ul></div>
<div class="c"><h3>📈 İlerleme kuralı</h3><ul><li>Her sette tekrar aralığının üstüne çıkınca ağırlığı artır (üst vücut +2,5 kg, bacak +5 kg).</li><li>Bitirdiğinde 1-2 tekrar depoda kalsın.</li><li>Kardiyo: nefesin hafif hızlı ama konuşabilir olsun. Günlük 8-10 bin adım.</li><li>Uyku 7-9 saat, kreatin 3-5 g/gün.</li></ul></div>`}
function render0(){const $h=document.querySelector('.hd'),$n=document.getElementById('nav'),$m=document.getElementById('main');
if(SB&&!AU.ready){$h.style.display='none';$n.innerHTML='';$m.innerHTML='';return}
if(needAuth()){$h.style.display='none';$n.innerHTML='';$m.innerHTML=authv();return}
head();nav();if(!st.prof&&!ss){document.querySelector('.hd').style.display='none';document.getElementById('nav').innerHTML='';document.getElementById('main').innerHTML=obv();return}document.querySelector(".hd").style.display=(ss||tab!="h")?"none":"";if(ss){document.getElementById("nav").innerHTML="";document.getElementById("main").innerHTML=ss.fin?sumv():sessv();return}document.getElementById("main").innerHTML=ttl()+{h:home,r:badgesv,s:setv,m:more,w:work,y:histv,l:lib,p:progs,f:food,b:body,c:coachv,g:guide}[tab]()}
function tick(){const l=Math.round((tEnd-Date.now())/1000),b=document.getElementById("tb");if(l<=0){clearInterval(iv);document.getElementById("tt").textContent="Hazır, devam! 💥";FX.success();setTimeout(()=>b.classList.remove("on"),2500)}else document.getElementById("tt").textContent="⏱ Dinlen: "+fm(l)}
async function calc(){const v=$v("ft").trim(),m=document.getElementById("fm");if(!v){m.textContent="Önce ne yediğini yaz.";return}
m.textContent="Hesaplanıyor… (10-20 sn sürebilir)";
let step="başlangıç";
try{step="istek";const r=await ai(`Aşağıdaki yemek listesini ayrı kalemlere böl ve her kalem için yaklaşık kalori (kcal) ile protein (g) tahmin et. Porsiyon yazılmamışsa Türkiye’deki tipik porsiyonu varsay. Sadece JSON dizi döndür, başka hiçbir metin yazma: [{"n":"kalem adı (porsiyonla)","k":0,"p":0}] (k ve p tamsayı). Liste: ${v}`,"food",v);
step="çözümleme";const tx=String(r||""),a0=tx.indexOf("["),a1=tx.lastIndexOf("]");let arr=JSON.parse(tx.slice(a0,a1+1));
const a=(Array.isArray(arr)?arr:[]).filter(x=>x&&isFinite(+x.k)&&isFinite(+x.p)).map(x=>({n:String(x.n||"Öğün").slice(0,60),k:Math.round(+x.k),p:Math.round(+x.p)}));
if(!a.length){m.textContent="Anlayamadım, biraz daha net yazar mısın?";return}
(st.food[fd]=st.food[fd]||[]).push(...a);sv();render();const m2=document.getElementById("fm");if(m2)m2.textContent="✅ Eklendi: "+a.map(x=>x.n+" ("+x.k+" kcal, "+x.p+" g)").join(", ")}
catch(e){m.textContent="Hesaplanamadı ("+er(e)+"). Hızlı aramadan veya elle ekleyebilirsin."}}
const R={G:["Göğüs",10,20],S:["Sırt",10,20],O:["Omuz",8,16],B:["Biceps",6,12],T:["Triceps",6,12],K:["Karın",6,12],Q:["Ön bacak",8,16],H:["Arka bacak",6,12],P:["Kalça",6,12],C:["Baldır",6,12]};
const LB=`Bench press|barbell bench press|G|OT|150
E\u011fik dumbbell press|incline dumbbell press|G|OT|90
Dumbbell press|dumbbell bench press|G|OT|90
Cable fly|cable chest fly|G||60
Pec deck|pec deck machine fly|G||60
Şınav|push up|G|OT|60
Dips|chest dips|GT|O|90
Barbell row|barbell bent over row|S|BO|150
Lat pulldown|lat pulldown|S|B|90
Pull-up|pull up|S|B|90
Chest-supported row|chest supported row|S|BO|90
Dumbbell row|one arm dumbbell row|S|B|75
Seated cable row|seated cable row|S|B|90
Straight-arm pulldown|straight arm pulldown|S||60
Face pull|cable face pull|O|S|60
Omuz press|dumbbell shoulder press|O|T|90
Arnold press|arnold press|O|T|90
Lateral raise|dumbbell lateral raise|O||60
Reverse fly|reverse dumbbell fly|O|S|60
Biceps curl|dumbbell biceps curl|B||60
Hammer curl|hammer curl|B||60
Incline curl|incline dumbbell curl|B||60
Preacher curl|preacher curl|B||60
Triceps pushdown|cable triceps pushdown|T||60
Skull crusher|skull crusher|T||75
Overhead triceps extension|overhead triceps extension|T||60
Close-grip bench|close grip bench press|T|G|120
Squat|barbell back squat|QP|H|180
Leg press|leg press|QP||90
Leg extension|leg extension|Q||60
Bulgarian split squat|bulgarian split squat|QP|H|90
Lunges|dumbbell lunge|QP|H|90
Hack squat|hack squat|Q|P|120
Deadlift|conventional deadlift|HP|S|180
Romanian deadlift|romanian deadlift|HP|S|120
Leg curl|seated leg curl|H||60
Hip thrust|barbell hip thrust|P|H|90
Glute bridge|glute bridge|P|H|60
Cable kickback|cable glute kickback|P||60
Standing calf raise|standing calf raise|C||60
Seated calf raise|seated calf raise|C||60
Hanging knee raise|hanging knee raise|K||45
Cable crunch|cable crunch|K||45
Plank|plank form|K||45
Reverse crunch|reverse crunch|K||45
Cable woodchop|cable woodchop|K||45
Ab wheel|ab wheel rollout|K|S|60
E\u011fimli yürüyüş|incline treadmill walk|D||0
Hafif koşu|treadmill jogging|D||0
Incline barbell press|incline barbell bench press|G|OT|120
Decline press|decline bench press|G|T|120
Smith machine bench|smith machine bench press|G|OT|120
Machine chest press|machine chest press|G|OT|90
Low-to-high cable fly|low to high cable fly|G|O|60
Incline cable fly|incline cable fly|G||60
Dumbbell pullover|dumbbell pullover|GS||75
Svend press|svend press|G||60
Diamond push-up|diamond push up|TG|O|60
Incline push-up|incline push up|G|OT|60
T-bar row|t bar row|S|BO|120
Meadows row|meadows row|S|B|90
Inverted row|inverted row|S|B|90
Neutral-grip pull-up|neutral grip pull up|S|B|90
Close-grip pulldown|close grip lat pulldown|S|B|90
Single-arm pulldown|single arm lat pulldown|S|B|75
Machine row|machine row|S|BO|90
Rack pull|rack pull|S|HP|150
Dumbbell shrug|dumbbell shrug|S|O|60
Back extension|back extension|SP|H|60
Good morning|good morning exercise|HP|S|120
Chin-up|chin up|BS||90
Machine shoulder press|machine shoulder press|O|T|90
Barbell overhead press|barbell overhead press|O|T|120
Cable lateral raise|cable lateral raise|O||60
Front raise|dumbbell front raise|O||60
Upright row|upright row|O|S|75
Reverse pec deck|reverse pec deck|O|S|60
Landmine press|landmine press|O|GT|90
Pike push-up|pike push up|O|T|60
Barbell curl|barbell curl|B||60
EZ-bar curl|ez bar curl|B||60
Cable curl|cable biceps curl|B||60
Concentration curl|concentration curl|B||60
Spider curl|spider curl|B||60
Zottman curl|zottman curl|B||60
Bench dips|bench dips|T|G|60
Triceps kickback|dumbbell triceps kickback|T||60
Rope overhead extension|cable overhead triceps extension|T||60
JM press|jm press|T|G|90
Reverse-grip pushdown|reverse grip triceps pushdown|T||60
Single-arm pushdown|single arm triceps pushdown|T||60
Front squat|front squat|Q|P|150
Goblet squat|goblet squat|QP|K|90
Smith machine squat|smith machine squat|QP|H|120
Step-up|dumbbell step up|QP|H|90
Sissy squat|sissy squat|Q||60
Walking lunge|walking lunge|QP|H|90
Reverse lunge|reverse lunge|QP|H|90
Wall sit|wall sit|Q||45
Stiff-leg deadlift|stiff leg deadlift|HP|S|120
Lying leg curl|lying leg curl|H||60
Nordic curl|nordic hamstring curl|H||90
Single-leg RDL|single leg romanian deadlift|HP|S|90
Cable pull-through|cable pull through|PH||60
Sumo deadlift|sumo deadlift|HP|QS|150
Hip abduction machine|hip abduction machine|P||60
Cable hip abduction|cable hip abduction|P||60
Sumo squat|sumo squat|PQ|H|90
Frog pump|frog pump|P||45
Single-leg hip thrust|single leg hip thrust|P|H|75
Donkey kick|donkey kick|P||45
Curtsy lunge|curtsy lunge|PQ|H|75
Fire hydrant|fire hydrant exercise|P||45
Banded lateral walk|banded lateral walk|P||45
Kettlebell swing|kettlebell swing|PH|S|60
Donkey calf raise|donkey calf raise|C||60
Leg press calf raise|leg press calf raise|C||60
Single-leg calf raise|single leg calf raise|C||45
Decline sit-up|decline sit up|K||45
Leg raise|lying leg raise|K||45
Mountain climber|mountain climber|K|O|45
Bicycle crunch|bicycle crunch|K||45
Russian twist|russian twist|K||45
Dead bug|dead bug exercise|K||45
Side plank|side plank|K||45
V-up|v up exercise|K||45
Pallof press|pallof press|K||45
Toes-to-bar|toes to bar|K|S|60
Hollow hold|hollow body hold|K||45
Cable side bend|cable side bend|K||45
Farmer's walk|farmers walk|S|OK|60
Bisiklet (kardiyo)|stationary bike workout|D||0
Kürek makinesi|rowing machine workout|D||0
Eliptik|elliptical trainer workout|D||0
Merdiven makinesi|stairmaster workout|D||0
İp atlama|jump rope workout|D||0
Sprint aralıklı (HIIT)|treadmill sprint intervals|D||0
Battle rope|battle rope workout|D|O|0`.split("\n").map(l=>{const a=l.split("|");return{n:a[0],q:a[1],p:a[2],x:a[3],rest:+a[4]}});
const nm=s=>[...s].map(c=>R[c]?R[c][0]:"Kardiyo").join(", ");
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const newDr=()=>({name:"",ex:[],id:null,f:1});
let rg="*",dr=newDr(),pdc=null,aiTxt="";
const vol=(ex,f)=>{const v={};ex.forEach(x=>{[...x.p].forEach(c=>v[c]=(v[c]||0)+x.s*(f||1));[...(x.x||"")].forEach(c=>v[c]=(v[c]||0)+x.s*(f||1)*.5)});return v};
const rt=(c,n)=>n==0?"yok":n<R[c][1]?"eksik":n>R[c][2]?"fazla":"iyi";
function bm(h,ms){const E=(c,x,y,rx,ry)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${h[c]?'var(--ac)':ms&&ms[c]?'#ff8a3c':'var(--bd)'}" opacity="${h[c]||(ms&&ms[c]?.9:.35)}"/>`;
const base=o=>`<circle cx="${o+50}" cy="14" r="9" fill="var(--bd)"/><rect x="${o+33}" y="28" width="34" height="54" rx="10" fill="var(--in)"/><path d="M${o+30} 36L${o+22} 70M${o+70} 36L${o+78} 70M${o+42} 82L${o+40} 148M${o+58} 82L${o+60} 148" stroke="var(--in)" stroke-width="9" stroke-linecap="round" fill="none"/>`;
return `<svg viewBox="0 0 200 160" width="100%">${base(0)}${base(100)}${E("G",43,42,9,7)+E("G",57,42,9,7)+E("O",31,35,6,6)+E("O",69,35,6,6)+E("B",26,52,4,9)+E("B",74,52,4,9)+E("K",50,66,7,12)+E("Q",43,105,7,19)+E("Q",57,105,7,19)}${E("S",150,48,15,16)+E("O",131,35,6,6)+E("O",169,35,6,6)+E("T",126,52,4,9)+E("T",174,52,4,9)+E("P",143,86,8,7)+E("P",157,86,8,7)+E("H",143,112,7,16)+E("H",157,112,7,16)+E("C",142,138,5,9)+E("C",158,138,5,9)}<text x="50" y="158" font-size="8" text-anchor="middle" fill="var(--mu)">ÖN</text><text x="150" y="158" font-size="8" text-anchor="middle" fill="var(--mu)">ARKA</text></svg>`}
async function ai(p,task,input){const W=window;
if(SB){const tk=await accessToken();const ac=new AbortController(),to=setTimeout(()=>ac.abort(),60000);
try{const r=await fetch(ACF.supabaseUrl+"/functions/v1/coach",{method:"POST",signal:ac.signal,headers:{"content-type":"application/json",authorization:"Bearer "+tk,apikey:ACF.supabaseAnonKey},body:JSON.stringify({task:task||"coach",prompt:task=="food"?"":p,input:input||""})});
let j={};try{j=await r.json()}catch(x){}if(j.left!=null)AU.left=j.left;
if(r.status==401)throw new Error("login-needed");if(r.status==429)throw new Error(j.error=="quota"?"quota":"rate");if(!r.ok)throw new Error("network "+r.status);return String(j.text||"").trim()}
catch(e){throw e&&e.name=="AbortError"?new Error("timeout"):e}finally{clearTimeout(to)}}
if(W.claude&&W.claude.use){const sm=await W.claude.use("sample");if(sm){const r=await sm(p);return String(r&&r.text||r||"").trim()}}
throw new Error("ai-off")}
const profS=()=>{const p=st.prof;return p&&p.age?`${p.g}, ${p.age} yaş, ${p.h} cm, ${p.kg} kg, hedef: ${p.goal}, haftada ${p.days} gün antrenman, seviye: ${p.lvl}`:"profil bilgisi girilmedi"};
const er=e=>{const m=String((e&&(e.code||e.message))||e);return /ai-off/.test(m)?"yapay zekâ sunucusu henüz ayarlanmadı":/login-needed/.test(m)?"koç için giriş yapmalısın":/quota/.test(m)?"bugünkü koç hakkın doldu, yarın yenilenir":/sample yok|denied|permission|not.?allowed/i.test(m)?"yapay zekâ bu görünümde kapalı veya izin verilmedi":/rate/i.test(m)?"çok sık denendi, biraz bekle":/network|fetch|timeout|failed/i.test(m)?"bağlantı sorunu, tekrar dene":m};
function home(){const t=td(),f=st.food[t]||[],K=f.reduce((a,x)=>a+x.k,0),P=f.reduce((a,x)=>a+x.p,0),T=st.t,dn=(d,i)=>st.done.some(x=>wk(x.d)==WK&&x.day===(d.id||i)),nx=base().findIndex((d,i)=>!dn(d,i)),sp=st.steps[t]||0,kg=st.body.map(x=>x.kg).filter(Boolean);
const pb=(v,m)=>`<div class="pb"><i style="width:${Math.min(v/m*100,100)}%"></i></div>`;
const ring=(v,m,col,lab,val,unit,to)=>{const C=+(2*Math.PI*34).toFixed(2),q=Math.max(0,Math.min(v/(m||1),1));return `<button class="ring" ${to?`data-to="${to}"`:''}><svg viewBox="0 0 80 80"><circle class="rt" cx="40" cy="40" r="34"/><circle class="rv" cx="40" cy="40" r="34" stroke="${col}" stroke-dasharray="${C}" stroke-dashoffset="${(C*(1-q)).toFixed(2)}" style="--c:${C}"/></svg><div class="rc"><div>${val}<small>${unit}</small></div></div><div class="rl">${lab}</div></button>`},W_=wsum(t);
return `<div class="c"><div class="top"><h3>Bugünün özeti</h3><span class="t">${Math.max(T.k-K,0)} kcal kaldı</span></div><div class="rings" style="margin-top:8px">${ring(K,T.k,"var(--ac2)","Kalori",K,"/"+T.k,"f")}${ring(P,T.p,"var(--ac)","Protein",P+"g","/"+T.p+"g","f")}${ring(W_,st.wg,"var(--blue)","Su",LT(W_),"/"+LT(st.wg)+" L","f")}${ring(sp,10000,"var(--gold)","Adım",sp>=1000?(sp/1000).toFixed(1)+"k":sp,"/10k","")}</div></div>
${streakCard()}${calCard()}<div class="c"><h3>🏋️ Sıradaki antrenman</h3>${nx>=0?`<div class="n">Gün ${nx+1} · ${base()[nx].t}</div><div class="tip">${base()[nx].e.slice(0,5).map(x=>x.n).join(" · ")}</div><button class="p" data-st="${nx}">▶ Başla</button>`:'<div class="n">Bu haftaki '+GL()+' antrenmanı tamamladın 🎉</div><div class="tip">Dinlen, uykuya ve yürüyüşe odaklan.</div>'}</div>
<div class="c"><h3>🍽️ Bugünkü makrolar</h3><div class="n">🔥 ${K} / ${T.k} kcal</div>${pb(K,T.k)}<div class="n">🥩 ${P} / ${T.p} g protein</div>${pb(P,T.p)}<div class="tip">Kalan: ${Math.max(T.k-K,0)} kcal · ${Math.max(T.p-P,0)} g protein</div><div class="row"><button class="p" data-to="f">Yemek ekle</button><button data-to="c">Ne yiyebilirim?</button></div></div>
${waterCard(false)}${sleepCard()}<div class="c"><h3>🚶 Yürüyüş</h3><div class="n">${sp} / 10000 adım</div>${pb(sp,10000)}<div class="row"><div><label>Adım</label><input id="stp" type="number" inputmode="numeric"></div><button data-sp="1">Güncelle</button></div></div>
<div class="c"><h3>📉 Vücut</h3><div class="n">${kg.length?kg[kg.length-1]+" kg":"Henüz kayıt yok"}</div><div class="tip">${kg.length>1?"İlk kayda göre "+(kg[kg.length-1]-kg[0]>0?"+":"")+(kg[kg.length-1]-kg[0]).toFixed(1)+" kg":"Vücut sekmesinden kilo ve bel ölçünü gir."}</div></div>
<div class="row"><button class="p" data-to="c">🤖 Koça sor</button><button data-to="l">📚 Program oluştur</button></div>`}
function progs(){return wizv()+planList()+progsList()}
function progsList(){if(!st.progs.length)return "";
return st.progs.map((p,i)=>{const v=vol(p.ex,p.f);return `<div class="c"><div class="n">${esc(p.name)}</div><div class="t">${p.ex.length} hareket · haftada ${p.f||1}×</div><div class="tip">${Object.keys(R).filter(c=>v[c]).map(c=>R[c][0]+" "+v[c]).join(" · ")}</div><div class="row"><button class="p" data-go="${4+i}">Antrenmana git</button><button data-pe="${i}">Düzenle</button><button data-pd="${i}">${pdc===i?'Emin misin? Sil':'Sil'}</button></div></div>`}).join("")}
const QS=["Bu hafta 1 gün eksik gideceğim, haftayı nasıl ayarlayayım?","Bugün makrolarımı karşılayamadım, kalan kalori ve proteine göre ne yiyebilirim?","Bu hafta nasıl gidiyorum? Kısa değerlendir.","Antrenmanlar ağır geliyor, ne yapmalıyım?"];
function coachv(){if(SB&&!sess)return coachGate();return coachGate()+`<div class="c"><h3>🤖 FORMIQ Koç</h3><div class="tip">Kayıtlı verilerini (antrenman, kilo, makro, adım, programlar) okuyarak cevap verir.</div><div class="row">${QS.map((q,i)=>`<button data-q="${i}" style="font-size:12px;text-align:left">${q}</button>`).join("")}</div><textarea id="cq" class="w" rows="3" placeholder="Sorunu yaz…" style="width:100%;margin-top:8px;font:inherit;padding:8px;border:1px solid var(--bd);border-radius:10px;background:var(--in);color:var(--tx)"></textarea><div class="row"><button class="p" data-ask="1">Sor</button></div><div class="tip" id="cm"></div></div>`+(st.chat.length?"":'<div class="c"><div class="tip">Henüz soru sormadın. Yukarıdaki hazır sorulardan birine dokun veya kendi sorunu yaz.</div></div>')+st.chat.map(x=>`<div class="c"><div class="n">🙋 ${esc(x.q)}</div><div style="white-space:pre-wrap;margin-top:6px">${esc(x.a)}</div></div>`).join("")}
function ctx(){const t=td(),f=st.food[t]||[],K=f.reduce((a,x)=>a+x.k,0),P=f.reduce((a,x)=>a+x.p,0);return JSON.stringify({bugun:t,profil:st.prof||null,gun:new Date().toLocaleDateString("tr-TR",{weekday:"long"}),hafta:WK,buHaftaTamamlananAntrenman:st.done.filter(x=>wk(x.d)==WK).map(x=>x.d+" "+(typeof x.day=="number"?D[x.day].t:"özel program")),haftalikHedef:GL(),hedefKcal:st.t.k,hedefProtein:st.t.p,bugunKcal:K,bugunProtein:P,kalanKcal:st.t.k-K,kalanProtein:st.t.p-P,bugunAdim:st.steps[t]||0,bugunSuMl:wsum(t),uykuSon7:[...Array(7)].map((_,i)=>sh(t,i-6)).map(d=>d+": "+(st.sleep[d]?st.sleep[d].h+" sa, his "+(st.sleep[d].q||"?")+"/5":"-")),hedefKilo:st.gw||null,suHedefMl:st.wg,sonOlcumler:st.body.slice(-4),bugunYenenler:f.map(x=>x.n+" "+x.k+"kcal "+x.p+"g"),varsayilanProgram:base().map((x,i)=>"Gün "+(i+1)+" "+x.t),sonAntrenmanlar:st.hist.slice(-4).map(h=>h.d+" "+h.name+" "+Math.round(h.dur/60)+"dk "+h.vol+"kg hacim"+(h.en?" enerji "+h.en+"/5":"")+(h.nt?" not: "+h.nt:"")+rirS(h)),kayitliProgramlar:st.progs.map(p=>p.name+": "+p.ex.map(x=>x.n).join(", "))})}
const hsh=t=>{let h=5381;for(let i=0;i<t.length;i++)h=(h*33^t.charCodeAt(i))>>>0;return h.toString(36)};
async function coach(q){q=q.trim();if(!q)return;const m=document.getElementById("cm");const hk=hsh(q+"|"+ctx()),hit=st.chat.find(x=>x.k==hk);if(hit){st.chat=[hit].concat(st.chat.filter(x=>x!==hit));render();return}m.textContent="Koç düşünüyor…";try{const a=await ai(`Sen FORMIQ uygulamasının Türkçe konuşan fitness ve beslenme koçusun. Kullanıcı profili: ${profS()}. Aşağıdaki kullanıcı verisine dayanarak soruyu yanıtla. Kısa, somut ve uygulanabilir ol (en fazla 8 satır). Yiyecek önerirken Türkiye’de kolay bulunan yiyecekleri yaklaşık kcal ve protein değerleriyle yaz. Tıbbi tavsiye verme. Uyku, enerji ve ağrı notlarının antrenman performansıyla ilişkisini gerekirse yorumla; ağrı veya sakatlık notu varsa dikkatli ol ve gerekirse doktora yönlendir. Veri: ${ctx()}\nSoru: ${q}`);st.chat.unshift({q,a,k:hk});st.chat=st.chat.slice(0,8);sv();render()}catch(e){m.textContent="Yanıt alınamadı ("+er(e)+")"}}
function toast(m){const b=document.getElementById("tb");clearInterval(iv);document.getElementById("tt").textContent=m;b.classList.add("on");setTimeout(()=>b.classList.remove("on"),2200)}
let ss=null,ti,hx="",hdc=null;
try{ss=JSON.parse(localStorage.getItem("fit_ss"))}catch(e){}
if(ss&&ss.fin)ss=null;
const saveS=()=>{try{ss&&!ss.fin?localStorage.setItem("fit_ss",JSON.stringify(ss)):localStorage.removeItem("fit_ss")}catch(e){}};
const MR=[[/triceps superset/,"BT",""],[/face pull/,"O","S"],[/triceps/,"T",""],[/biceps/,"B",""],[/shoulder press/,"O","T"],[/lateral raise/,"O",""],[/bench press|chest fly|incline dumbbell/,"G","OT"],[/row|pulldown|pull up/,"S","B"],[/romanian/,"HP","S"],[/squat|leg press/,"QP","H"],[/leg curl/,"H",""],[/calf/,"C",""],[/walk|jog/,"D",""]];
const mc=q=>{const m=MR.find(r=>r[0].test(q));return m?{p:m[1],x:m[2]}:{p:"",x:""}};
const lastOf=n=>{for(let i=st.hist.length-1;i>=0;i--){const e=st.hist[i].ex.find(y=>y.n==n);if(e)return e.sets}return null};
function startRest(s){FX.impact("MEDIUM");FX.restNotify(s);tEnd=Date.now()+s*1000;document.getElementById("tb").classList.add("on");clearInterval(iv);iv=setInterval(tick,500);tick()}
function tickS(){const e=document.getElementById("el");if(e&&ss&&!ss.fin)e.textContent=fm(Math.round((Date.now()-ss.t0)/1000))}
function startS(i){day=i;const dd=DS()[i];if(!dd||!dd.e.length){toast("Bu günde hareket yok");return}ss={day:i,id:dd.id||i,name:dd.t,t0:Date.now(),i:0,log:dd.e.map(x=>Array.from({length:x.s},()=>({kg:"",r:"",q:"",ok:false}))),fin:null,ex:JSON.parse(JSON.stringify(dd.e))};clearInterval(ti);ti=setInterval(tickS,1000);saveS();render();window.scrollTo(0,0)}
function endS(){ss=null;clearInterval(ti);clearInterval(iv);FX.cancelRest();document.getElementById("tb").classList.remove("on");saveS();render();window.scrollTo(0,0)}
function sessv(){const x=sE()[ss.i],n=sE().length,cardio=!x.rest,L=ss.log[ss.i],lp=lastOf(x.n),cd=x.p!==undefined?{p:x.p,x:x.x||""}:mc(x.q),hh={};[...cd.p].forEach(c=>hh[c]=1);[...cd.x].forEach(c=>hh[c]=.5);
return `<div class="c"><div style="display:flex;justify-content:space-between;align-items:center"><button data-sx="1">${ss.xc?'Emin misin? Çık':'✕ Çık'}</button><b id="el" style="font-size:20px">${fm(Math.round((Date.now()-ss.t0)/1000))}</b><span class="t">${ss.i+1} / ${n}</span></div><div class="pb" style="margin:10px 0 0"><i style="width:${ss.i/n*100}%"></i></div></div>
<div class="c"><div class="top"><div class="n" style="font-size:21px">${x.n}${x.sw?' <span class="ss">değiştirildi</span>':''}</div><button data-swo="1" style="font-size:12px">🔄 Değiştir</button></div><div class="t">${cardio?x.r:x.s+' × '+x.r+' · dinlenme '+fm(x.rest)}</div><div style="width:210px;max-width:70%;margin:8px auto 2px">${bm(hh)}</div><div class="t" style="text-align:center">${cd.p?nm(cd.p)+(cd.x?' (+ '+nm(cd.x)+')':''):''}</div><div class="tip">💡 ${x.tip}</div>${sg(x,cd)}<a class="g" target="_blank" rel="noopener" href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(x.q)}">Hareket görseli ↗</a></div>
${ss.swo?swapCard(x,cd):''}<div class="c">${L.map((s,i)=>`<div class="setrow${cardio?' cardio':''}"><b class="t">${cardio?'':'Set '+(i+1)}</b><input type="number" inputmode="decimal" data-sk="${i}" value="${s.kg}" placeholder="${lp&&lp[i]?lp[i].kg:(cardio?'dk':'kg')}">${cardio?'':`<input type="number" inputmode="numeric" data-sr="${i}" value="${s.r}" placeholder="${lp&&lp[i]?lp[i].r||'tekrar':'tekrar'}"><input type="number" inputmode="numeric" data-sq="${i}" value="${s.q==null?'':s.q}" placeholder="RIR">`}<button data-sd="${i}" class="${s.ok?'on':''}">${s.ok?'✓':'Bitti'}</button></div>`).join("")}${cardio?'':'<div class="t">RIR: setin sonunda kaç tekrar daha yapabilirdin? (0 = tükendim)</div>'}${lp?`<div class="tip">Geçen sefer: ${lp.map(s=>s.kg+(s.r?'×'+s.r:'')).join(' · ')}</div>`:''}</div>
<div class="row"><button data-sb="1" ${ss.i==0?'disabled':''}>← Geri</button><button class="p" data-sn="1" style="flex:1;padding:14px">${ss.i==n-1?'🏁 Antrenmanı bitir':'Devam →'}</button></div><div class="sess-sp"></div>`}
function finS(){const dd=DS()[ss.day],dur=Math.round((Date.now()-ss.t0)/1000);let vol=0,sets=0;const prs=[];
const ex=sE().map((x,i)=>({n:x.n,q:x.q,c:x.rest?0:1,sets:ss.log[i].filter(s=>s.kg!==""||s.r!=="").map(s=>({kg:+s.kg||0,r:+s.r||0,q:(s.q===""||s.q==null)?null:+s.q}))})).filter(e=>e.sets.length);
ex.forEach(e=>{if(e.c)return;e.sets.forEach(s=>{vol+=s.kg*s.r;sets++});const pv=st.hist.flatMap(h=>h.ex.filter(y=>y.n==e.n).flatMap(y=>y.sets.map(s=>s.kg))),top=Math.max(...e.sets.map(s=>s.kg));if(pv.length&&top>Math.max(...pv))prs.push(e.n+" "+top+" kg")});
st.hist.push({d:td(),id:ss.id,name:dd.t,dur,vol:Math.round(vol),ex});st.prc=(st.prc||0)+prs.length;ss.hi=st.hist.length-1;
if(!st.done.some(x=>x.d==td()&&x.day==ss.id))st.done.push({d:td(),day:ss.id});
sv();FX.success();FX.cancelRest();ss.fin={dur,vol:Math.round(vol),sets,prs,n:ex.length};clearInterval(ti);saveS();render();window.scrollTo(0,0)}
function sumv(){const f=ss.fin;return `<div class="c" style="text-align:center"><h2 style="margin:4px">🎉 Antrenman tamam!</h2><div class="n">${esc(ss.name)}</div></div><div class="c"><div class="bd">${[["⏱",fm(f.dur),"Süre"],["🏋️",f.vol+" kg","Toplam hacim"],["🔢",f.sets,"Set"],["📋",f.n,"Hareket"]].map(x=>`<div class="b ok"><big>${x[0]}</big>${x[1]}<div class="t">${x[2]}</div></div>`).join("")}</div>${f.prs.length?`<div class="n" style="margin-top:10px">🏆 Yeni rekorlar</div><ul>${f.prs.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:''}</div>${noteCard()}<div class="row"><button class="p" data-sc="y">📈 Geçmişe bak</button><button data-sc="h">Ana sayfa</button></div>`}
function work(){const sp=st.steps[td()]||0,dd=DS()[day]||DS()[0],lastH=[...st.hist].reverse().find(h=>h.id==dk());
let h=`<div class="c"><h3>🚶 Bugünkü yürüyüş</h3><div class="n">${sp} / 10000 adım</div><div class="pb"><i style="width:${Math.min(sp/100,100)}%"></i></div><div class="row"><div><label>Adım</label><input id="stp" type="number" inputmode="numeric"></div><button data-sp="1">Güncelle</button></div></div>`+`<div class="tabs">${DS().map((x,i)=>`<button class="${i==day?'on':''}" data-d="${i}">${x.id&&!AP()?'📁 ':'Gün '+(i+1)+' · '}${x.t}</button>`).join("")}</div>`;
h+=`<div class="c"><h3>${esc(dd.t)}</h3><div class="t">${dd.e.length} hareket · tahmini ${Math.round(dd.e.reduce((a,x)=>a+(x.rest?x.s*(x.rest+40)/60:x.s*25),0))} dk${lastH?' · son yapılış: '+new Date(lastH.d+"T12:00:00").toLocaleDateString("tr-TR",{day:"numeric",month:"short"}):''}</div>${dd.e.map((x,i)=>`<div class="row" style="align-items:center;border-top:1px solid var(--bd);padding-top:6px;margin:6px 0 0"><b style="width:24px">${i+1}</b><div style="flex:1">${x.n}<div class="t">${x.rest?x.s+' × '+x.r:x.r}</div></div></div>`).join("")}${dd.e.length?`<button class="p" style="width:100%;padding:14px;margin-top:12px" data-st="${day}">▶ Antrenmanı başlat</button>`:'<div class="tip">Bu günde hareket yok. Daha → Program oluştur’dan düzenle.</div>'}</div>`;
return h}
function lc(v,col){const W=300,H=100,mn=Math.min(...v),mx=Math.max(...v),r=(mx-mn)||1,X=i=>v.length>1?15+i*(W-30)/(v.length-1):W/2,Y=x=>H-18-(x-mn)/r*(H-42);
return `<svg viewBox="0 0 ${W} ${H+8}" width="100%"><polyline fill="none" stroke="${col}" stroke-width="3" points="${v.map((x,i)=>X(i)+","+Y(x)).join(" ")}"/>${v.map((x,i)=>`<circle cx="${X(i)}" cy="${Y(x)}" r="4" fill="${col}"/><text x="${X(i)}" y="${Y(x)-8}" font-size="10" text-anchor="middle" fill="var(--tx)">${x}</text>`).join("")}</svg>`}
function bc(a){const mx=Math.max(...a.map(x=>x[1]),1),bw=300/a.length;return `<svg viewBox="0 0 300 120" width="100%">${a.map((x,i)=>{const h=x[1]/mx*70;return `<rect x="${i*bw+6}" y="${95-h}" width="${bw-12}" height="${Math.max(h,1)}" rx="4" fill="var(--ac)"/><text x="${i*bw+bw/2}" y="110" font-size="10" text-anchor="middle" fill="var(--mu)">H${x[0]}</text>${x[1]?`<text x="${i*bw+bw/2}" y="${90-h}" font-size="9" text-anchor="middle" fill="var(--tx)">${Math.round(x[1]/100)/10}t</text>`:''}`}).join("")}</svg>`}
function histG(){const H=st.hist;if(!H.length)return `<div class="c"><h3>📈 Geçmiş</h3><div class="tip">Henüz tamamlanmış antrenman yok. İlk antrenmanını bitirince ilerlemeni burada göreceksin.</div><button class="p" data-to="w">Antrenmana git</button></div>`;
const tot=H.reduce((a,h)=>a+h.dur,0),vol=H.reduce((a,h)=>a+h.vol,0),wv={};H.forEach(h=>{const w=wk(h.d);wv[w]=(wv[w]||0)+h.vol});const ws=[];for(let w=Math.max(1,WK-7);w<=WK;w++)ws.push([w,wv[w]||0]);
const names=[...new Set(H.flatMap(h=>h.ex.filter(e=>!e.c).map(e=>e.n)))];if(!names.includes(hx))hx=names[0];
const pts=H.map(h=>{const e=h.ex.find(y=>y.n==hx);if(!e)return null;const s=e.sets.filter(z=>z.kg);if(!s.length)return null;return{d:h.d,kg:Math.max(...s.map(z=>z.kg)),v:s.reduce((a,z)=>a+z.kg*z.r,0)}}).filter(Boolean);
let vd="";if(pts.length>1){const a=pts[0],b=pts[pts.length-1],df=b.kg-a.kg,vp=a.v?Math.round((b.v-a.v)/a.v*100):0;vd=`<div class="n">${a.kg} kg → ${b.kg} kg (${df>0?'+':''}${df} kg)</div><div class="tip">${df>0?'📈 Ağırlıkta gelişim var.':df==0?'➖ Ağırlık aynı. Tekrar veya hacim artıyorsa ilerleme sayılır.':'⚠️ Ağırlık düşmüş. Uyku, kalori ve dinlenmeye bak.'} Set hacmi ilk seansa göre ${vp>0?'+':''}${vp}%.</div>`}
return `<div class="c"><h3>📈 Özet</h3><div class="bd">${[["🏋️",H.length,"Antrenman"],["⏱",Math.round(tot/60)+" dk","Toplam süre"],["📏",Math.round(tot/H.length/60)+" dk","Ortalama süre"],["⚖️",Math.round(vol/100)/10+" ton","Toplam hacim"]].map(x=>`<div class="b ok"><big>${x[0]}</big>${x[1]}<div class="t">${x[2]}</div></div>`).join("")}</div></div>
<div class="c"><h3>Haftalık hacim (ton)</h3>${bc(ws)}</div>
<div class="c"><h3>Hareket ilerlemesi</h3><select data-hx="1" style="width:100%;font:inherit;padding:8px;border:1px solid var(--bd);border-radius:10px;background:var(--in);color:var(--tx)">${names.map(n=>`<option ${n==hx?'selected':''}>${esc(n)}</option>`).join("")}</select>${pts.length?lc(pts.map(p=>p.kg),"#4aa631"):''}<div class="t">En ağır set (kg), seans seans</div>${vd||'<div class="tip">Karşılaştırma için bu hareketi en az 2 kez yapmış olmalısın.</div>'}</div>
<div class="c"><h3>Son antrenmanlar</h3>${[...H].map((h,i)=>({h,i})).reverse().slice(0,10).map(o=>`<details style="margin:6px 0"><summary><b>${new Date(o.h.d+"T12:00:00").toLocaleDateString("tr-TR",{day:"numeric",month:"short"})}</b> · ${esc(o.h.name)} · ${Math.round(o.h.dur/60)} dk · ${o.h.vol} kg</summary><ul>${o.h.ex.map(e=>`<li>${esc(e.n)}: ${e.sets.map(s=>s.kg+(s.r?'×'+s.r:'')+(s.q!=null?' (RIR '+s.q+')':'')).join(" · ")}</li>`).join("")}</ul>${o.h.en?'<div class="t">Enerji: '+o.h.en+'/5</div>':''}${o.h.nt?'<div class="t">Not: '+esc(o.h.nt)+'</div>':''}<a href="#" data-hd="${o.i}">${hdc===o.i?'Emin misin? Sil':'Bu kaydı sil'}</a></details>`).join("")}</div>`}
document.addEventListener("input",e=>{const d=e.target.dataset;if(!ss)return;if(d.sk!==undefined){ss.log[ss.i][+d.sk].kg=e.target.value;saveS()}else if(d.sr!==undefined){ss.log[ss.i][+d.sr].r=e.target.value;saveS()}});
document.addEventListener("change",e=>{if(e.target.dataset.hx!==undefined){hx=e.target.value;render()}});
const lk=n=>LB.find(x=>x.n==n);
const DY={"Üst A":["Bench press","Barbell row","Omuz press","Lat pulldown","Lateral raise","Triceps pushdown","Biceps curl"],"Üst B":["Dumbbell press","Seated cable row","Arnold press","Pull-up","Face pull","Hammer curl","Overhead triceps extension"],"Alt A":["Squat","Romanian deadlift","Leg press","Leg curl","Standing calf raise","Cable crunch"],"Alt B":["Hip thrust","Bulgarian split squat","Leg extension","Leg curl","Seated calf raise","Plank"],"İtiş":["Bench press","Dumbbell press","Omuz press","Lateral raise","Triceps pushdown","Cable fly"],"Çekiş":["Barbell row","Lat pulldown","Chest-supported row","Face pull","Biceps curl","Hammer curl"],"Bacak":["Squat","Romanian deadlift","Leg press","Leg curl","Standing calf raise","Hanging knee raise"],"Tüm vücut A":["Squat","Bench press","Barbell row","Omuz press","Leg curl","Plank"],"Tüm vücut B":["Romanian deadlift","Dumbbell press","Lat pulldown","Lateral raise","Leg press","Cable crunch"],"Tüm vücut C":["Bulgarian split squat","Dumbbell row","Hip thrust","Dumbbell press","Face pull","Biceps curl"]};
const MAINL=["Bench press","Squat","Deadlift","Romanian deadlift","Barbell row","Omuz press","Hip thrust","Dumbbell press"];
const vsum=ds=>{const v={};ds.forEach(d=>{const a=vol(d.ex,1);for(const c in a)v[c]=(v[c]||0)+a[c]});return v};
function gen(w){const F=w.g=="Kadın",beg=w.lvl=="Başlangıç",G=w.goal,sw={"Bench press":"Dumbbell press","Barbell row":"Seated cable row"},cd=LB.find(x=>x.p=="D");
const split=w.days==3?["Tüm vücut A","Tüm vücut B","Tüm vücut C"]:w.days==4?["Üst A","Alt A","Üst B","Alt B"]:["İtiş","Çekiş","Bacak","Üst B","Alt B"];
const days=split.map((nn,di)=>{let names=DY[nn].slice();const low=/Alt|Bacak/.test(nn),full=/Tüm/.test(nn);
if(F&&!low&&!full){names=names.map(n=>sw[n]||n);if(names.length>5)names.pop()}
if(beg)names=names.slice(0,5);
if(F&&low&&!names.includes("Cable kickback"))names.push("Cable kickback");
const ex=names.map(n=>{const x=lk(n),main=MAINL.includes(n);let s=3,r="10-12";
if(G=="Güç"){s=main?(beg?3:4):3;r=main?"4-6":"8-10"}else if(G=="Kas yap"){s=main?(beg?3:4):3;r=main?"6-10":"10-12"}else if(G=="Yağ yak"){r=main?"8-12":"12-15"}else{r=main?"10-12":"12-15"}
if(F&&low&&main&&!beg)s++;
return{n:x.n,q:x.q,p:x.p,x:x.x,rest:x.rest,s,r}});
if(G=="Yağ yak"||(G=="Genel fit"&&di%2==1))ex.push({n:cd.n,q:cd.q,p:"D",x:"",rest:0,s:1,r:G=="Yağ yak"?"20 dk":"15 dk"});
return{name:nn,ex}});
const notes=[];
for(let k=0;k<4;k++){const v=vsum(days);let ch=false;
Object.keys(R).forEach(c=>{const n=v[c]||0;
if(n<R[c][1]){const used=new Set(days.flatMap(d=>d.ex.map(e=>e.n))),cand=LB.filter(x=>x.p!="D"&&x.p.includes(c)&&!used.has(x.n)).sort((a,b)=>(a.p==c?0:1)-(b.p==c?0:1))[0];
if(cand&&days.some(d=>d.ex.length<(beg?7:9))){const d=days.slice().sort((a,b)=>a.ex.length-b.ex.length)[0],ix=d.ex.length&&d.ex[d.ex.length-1].p=="D"?d.ex.length-1:d.ex.length;d.ex.splice(ix,0,{n:cand.n,q:cand.q,p:cand.p,x:cand.x,rest:cand.rest,s:3,r:"10-12"});notes.push("➕ "+R[c][0]+" eksikti, "+cand.n+" eklendi ("+d.name+").");ch=true}}
else if(n>R[c][2]){days.flatMap(d=>d.ex).filter(e=>e.p.includes(c)&&e.s>2).slice(0,2).forEach(e=>e.s--);notes.push("➖ "+R[c][0]+" fazlaydı, set sayısı azaltıldı.");ch=true}});
if(!ch)break}
return{name:w.g+" · "+G+" · "+w.days+" gün",days,notes:[...new Set(notes)]}}
let wz={g:"",goal:"",days:0,lvl:"",res:null,txt:""};
const wb=(k,v,l)=>`<button class="${wz[k]==v?'on':''}" data-wz="${k}:${v}">${l||v}</button>`;
function wizv(){let h=`<div class="c"><h3>✨ Hazır program ekle</h3><div class="tip">Birkaç soruyu cevapla, koç sana uygun ve dengeli bir program hazırlasın.</div>
<label>Cinsiyet</label><div class="row">${wb("g","Kadın")}${wb("g","Erkek")}</div>
<label style="margin-top:8px">Hedef</label><div class="row">${["Yağ yak","Kas yap","Güç","Genel fit"].map(x=>wb("goal",x)).join("")}</div>
<label style="margin-top:8px">Haftada kaç gün?</label><div class="row">${[3,4,5].map(x=>wb("days",x,x+" gün")).join("")}</div>
<label style="margin-top:8px">Seviye</label><div class="row">${wb("lvl","Başlangıç")}${wb("lvl","Orta")}</div>
<button class="p" style="width:100%;margin-top:12px;padding:12px" data-wg="1" ${wz.g&&wz.goal&&wz.days&&wz.lvl?'':'disabled'}>Programı oluştur</button></div>`;
const r=wz.res;if(!r)return h;
const v=vsum(r.days),hl={};Object.keys(R).forEach(c=>{if(v[c])hl[c]=Math.min(1,.35+v[c]/R[c][2]*.65)});const sc=Object.keys(R).filter(c=>rt(c,v[c]||0)=="iyi").length;
return h+`<div class="c"><h3>${esc(r.name)}</h3><div class="n">Koç değerlendirmesi: denge puanı ${sc}/10</div>${r.days.map((d,i)=>`<details style="margin:6px 0"><summary><b>${i+1}. gün · ${d.name}</b> · ${d.ex.length} hareket</summary><ul>${d.ex.map(e=>`<li>${e.n} ${e.p=="D"?e.r:e.s+' × '+e.r}</li>`).join("")}</ul></details>`).join("")}
<div style="display:flex;gap:10px;align-items:center;margin-top:8px"><div style="width:120px;flex:none">${bm(hl)}</div><div style="flex:1">${Object.keys(R).map(c=>{const n=v[c]||0,q=rt(c,n);return `<div class="t">${R[c][0]} · ${n} set/hafta · ${q}</div><div class="pb" style="height:7px;margin:2px 0 5px"><i style="width:${Math.min(n/R[c][2]*100,100)}%;background:${{yok:"#999",eksik:"#ff9a3c",iyi:"var(--ac)",fazla:"#e5484d"}[q]}"></i></div>`}).join("")}</div></div>
${r.notes.length?`<ul class="tip">${r.notes.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`:'<div class="tip">Koç dengeyi kontrol etti, ek düzenleme gerekmedi.</div>'}
<div class="tip" id="wm" style="white-space:pre-wrap">${wz.txt?esc(wz.txt):''}</div><div class="row"><button data-wc="1">🤖 Koç yorumu</button><button class="p" data-wa="act">▶ Hemen uygula</button><button data-wa="save">💾 Kaydet</button></div></div>`}
async function wizAi(){const m=document.getElementById("wm"),r=wz.res;m.textContent="Koç değerlendiriyor…";try{const v=vsum(r.days);wz.txt=await ai(`Sen FORMIQ koçusun. Kullanıcı: ${wz.g}, hedef: ${wz.goal}, haftada ${wz.days} gün, seviye ${wz.lvl}. Hazır program: ${r.days.map((d,i)=>(i+1)+". gün "+d.name+": "+d.ex.map(e=>e.n+" "+(e.p=="D"?e.r:e.s+"x"+e.r)).join(", ")).join(" | ")}. Haftalık set hacmi: ${Object.keys(R).map(c=>R[c][0]+" "+(v[c]||0)+" (ideal "+R[c][1]+"-"+R[c][2]+")").join(", ")}. Programı bu kişinin hedefine göre kısaca değerlendir, nelere dikkat etmesi ve nasıl ilerlemesi gerektiğini söyle. Türkçe, en fazla 7 kısa satır.`);render()}catch(e){m.textContent="Yorum alınamadı ("+er(e)+")"}}
const newBd=()=>({step:1,name:"",n:4,days:[1,2,3,4].map(i=>({name:"Gün "+i,ex:[]})),cur:0,id:null,txt:"",ask:false});
let bd=newBd();try{const b=JSON.parse(localStorage.getItem("fit_bd"));if(b&&b.days)bd=b}catch(e){}
const saveB=()=>{try{localStorage.setItem("fit_bd",JSON.stringify(bd))}catch(e){}};
const mkEx=x=>({n:x.n,q:x.q,p:x.p,x:x.x||"",rest:x.rest,s:x.rest?3:1,r:x.rest?"8-12":"20 dk"});
const pv=()=>vsum(bd.days);
const rows=ex=>ex.map((x,i)=>`<div class="row" style="align-items:center;border-top:1px solid var(--bd);padding-top:6px"><div style="flex:1;min-width:110px"><b>${x.n}</b><div class="t">${nm(x.p)}</div></div><div><label>Set</label><input type="number" data-ds="${i}" value="${x.s}" style="width:52px"></div><div><label>Tekrar</label><input data-dr="${i}" value="${qa(x.r)}" style="width:70px"></div><button data-dx="${i}">✕</button></div>`).join("");
function lib(){saveB();return bd.step==1?bs1():bd.step==2?bs2():bs3()}
function bs1(){return `<div class="c"><h3>🧩 Program oluştur</h3><div class="t">Adım 1/3 · Kurulum</div><label style="margin-top:8px">Program adı</label><input class="w" data-bn="1" id="bpn" placeholder="örn: Yaz hazırlığı" value="${qa(bd.name)}"><label style="margin-top:8px">Haftada kaç gün antrenman yapacaksın?</label><div class="row">${[2,3,4,5,6,7].map(n=>`<button class="${bd.days.length==n?'on':''}" data-bdn="${n}">${n} gün</button>`).join("")}</div><label style="margin-top:8px">Günlerin isimleri</label>${bd.days.map((d,i)=>`<div class="row" style="align-items:center"><b style="width:46px">${i+1}. gün</b><input class="w" style="flex:1;width:auto" data-bdy="${i}" placeholder="örn: İtiş, Bacak, Üst vücut" value="${qa(d.name)}"></div>`).join("")}<button class="p" style="width:100%;margin-top:12px;padding:13px" data-bgo="1">Devam: hareketleri seç →</button>${bd.id||bd.days.some(x=>x.ex.length)?'<button style="width:100%;margin-top:8px" data-bnew="1">Sıfırla</button>':''}</div>`}
function bs2(){const d=bd.days[bd.cur];
let h=`<div class="c"><div class="top"><div><h3>${esc(bd.name||"Yeni program")}</h3><div class="t">Adım 2/3 · Hareketleri seç</div></div><button data-bstep="1">← Kurulum</button></div><div class="tabs" style="margin-top:8px">${bd.days.map((x,i)=>`<button class="${i==bd.cur?'on':''}" data-bc="${i}">${esc(x.name)} (${x.ex.length})</button>`).join("")}</div></div>`;
h+=`<div class="c"><h3>${esc(d.name)}</h3>${d.ex.length?rows(d.ex):'<div class="tip">Bu güne henüz hareket eklemedin. Aşağıdaki listeden “＋ Ekle” ile seç.</div>'}</div><button class="p" style="width:100%;padding:13px;margin-bottom:10px" data-bstep="3">📊 Analiz et →</button>`;
h+=`<input class="w" data-bq="1" placeholder="🔍 Hareket ara…"><div id="lnone" class="tip" style="display:none">Bu aramayla eşleşen hareket yok.</div><div class="tabs" style="margin-top:8px"><button class="${rg=="*"?'on':''}" data-rg="*">Tümü</button>${Object.keys(R).concat("D").map(c=>`<button class="${rg==c?'on':''}" data-rg="${c}">${c=="D"?"Kardiyo":R[c][0]}</button>`).join("")}</div>`;
return h+LB.map((x,i)=>({x,i})).filter(o=>rg=="*"||o.x.p.includes(rg)||(o.x.x||"").includes(rg)).map(o=>{const x=o.x,hh={};[...x.p].forEach(c=>hh[c]=1);[...(x.x||"")].forEach(c=>hh[c]=.5);return `<div class="c lx" data-nm="${qa(x.n.toLowerCase())}" style="display:flex;gap:10px;align-items:center"><div style="width:84px;flex:none">${bm(hh)}</div><div style="flex:1"><div class="n">${x.n}</div><div class="t">Ana: ${nm(x.p)}${x.x?' · Yardımcı: '+nm(x.x):''}</div><div class="row"><button class="p" data-add="${o.i}">＋ Ekle</button><a class="g" target="_blank" rel="noopener" href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(x.q)}">Görsel ↗</a></div></div></div>`}).join("")}
function bs3(){const v=pv(),hl={},ms={},ks=Object.keys(R);ks.forEach(c=>{const n=v[c]||0,q=rt(c,n);if(q=="iyi"||q=="fazla")hl[c]=Math.min(1,.35+n/R[c][2]*.65);else ms[c]=1});
const sc=ks.filter(c=>rt(c,v[c]||0)=="iyi").length,miss=ks.filter(c=>{const q=rt(c,v[c]||0);return q=="yok"||q=="eksik"}),over=ks.filter(c=>rt(c,v[c]||0)=="fazla");
let h=`<div class="c"><div class="top"><div><h3>📊 Program analizi</h3><div class="t">Adım 3/3 · ${esc(bd.name||"Yeni program")} · ${bd.days.length} gün</div></div><button data-bstep="2">← Geri</button></div><div style="display:flex;gap:10px;align-items:center;margin-top:8px"><div style="width:130px;flex:none">${bm(hl,ms)}</div><div style="flex:1">${ks.map(c=>{const n=v[c]||0,q=rt(c,n);return `<div class="t">${R[c][0]} · ${n} set · ${q}</div><div class="pb" style="height:7px;margin:2px 0 5px"><i style="width:${Math.min(n/R[c][2]*100,100)}%;background:${{yok:"#999",eksik:"#ff9a3c",iyi:"var(--ac)",fazla:"#e5484d"}[q]}"></i></div>`}).join("")}</div></div><div class="n" style="margin-top:6px">Denge puanı: ${sc}/10</div><div class="t">🟢 Yeterli bölge · 🟠 Eksik bölge (haritada turuncu)</div></div>`;
h+=`<div class="c"><h3>🗓 Günlere göre</h3><ul>${bd.days.map(d=>`<li><b>${esc(d.name)}</b>: ${d.ex.length?[...new Set(d.ex.flatMap(e=>[...e.p]))].filter(c=>R[c]).map(c=>R[c][0]).join(", ")||"Kardiyo":"boş"}</li>`).join("")}</ul></div>`;
if(miss.length){h+=`<div class="c"><h3>⚠️ Eksik bölgeler</h3>`+miss.map(c=>{const n=v[c]||0,cs=LB.map((x,i)=>({x,i})).filter(o=>o.x.p!="D"&&o.x.p.includes(c)).slice(0,2);return `<div class="n" style="margin-top:6px">${R[c][0]}: ${n} set (ideal ${R[c][1]}-${R[c][2]})</div><div class="tip">Şunları ekleyebiliriz:</div><div class="row">${cs.map(o=>`<button data-sug="${o.i}" style="font-size:12px">＋ ${o.x.n}</button>`).join("")}</div>`}).join("")+`</div>`}
else h+=`<div class="c"><div class="n">🎉 Tüm bölgeler yeterli, program dengeli görünüyor.</div></div>`;
if(over.length)h+=`<div class="c"><h3>📈 Fazla bölgeler</h3><div class="tip">${over.map(c=>R[c][0]+" ("+(v[c]||0)+" set)").join(", ")}: haftalık hacim yüksek, toparlanma zorlaşabilir. Birkaç seti azaltmayı düşün.</div></div>`;
h+=`<div class="c"><div class="tip" id="bmsg" style="white-space:pre-wrap">${bd.txt?esc(bd.txt):''}</div><button data-bai="1">🤖 Koç yorumu</button></div>`;
h+=bd.ask?`<div class="c" id="bask"><h3>Bu programı hemen uygulayacak mısın?</h3><div class="tip">Evet dersen aktif programın bu olur ve Antrenman sekmesinde bu günler çıkar. Hayır dersen sadece Programlar’a kaydedilir.</div><div class="row"><button class="p" data-bsave="1">Evet, aktif yap</button><button data-bsave="0">Hayır, sadece kaydet</button></div></div>`:`<button class="p" style="width:100%;padding:14px" data-bfin="1">✅ Programı bitir</button>`;
return h}
async function bdAi(){const m=document.getElementById("bmsg"),v=pv();m.textContent="Koç değerlendiriyor…";try{bd.txt=await ai(`Sen FORMIQ koçusun. Kullanıcı kendi antrenman programını oluşturdu: ${bd.name}. Günler: ${bd.days.map((d,i)=>(i+1)+". "+d.name+": "+d.ex.map(e=>e.n+" "+(e.p=="D"?e.r:e.s+"x"+e.r)).join(", ")).join(" | ")}. Haftalık set hacmi: ${Object.keys(R).map(c=>R[c][0]+" "+(v[c]||0)+" (ideal "+R[c][1]+"-"+R[c][2]+")").join(", ")}. Eksik ve fazla bölgeleri belirt, eksikler için şu kütüphaneden hareket öner: ${LB.map(x=>x.n).join(", ")}. Gün dağılımı ve toparlanma hakkında 1-2 not ekle. Türkçe, en fazla 8 kısa satır, sonda 10 üzerinden puan ver.`);render()}catch(e){m.textContent="Yorum alınamadı ("+er(e)+")"}}
function savePlan(act){const o={id:bd.id||"pl"+Date.now(),name:(bd.name||"").trim()||"Programım",days:JSON.parse(JSON.stringify(bd.days.filter(d=>d.ex.length)))},ix=st.plans.findIndex(p=>p.id==o.id);if(ix>=0)st.plans[ix]=o;else st.plans.push(o);if(act){st.active=o.id;day=0}st.ownp=1;sv();bd=newBd();saveB();tab=act?"w":"p";render();window.scrollTo(0,0);toast(act?"✅ Program aktif edildi":"✅ Program kaydedildi")}
function planList(){const ap=AP();let h=`<div class="c"><h3>✅ Aktif program</h3><div class="n">${ap?esc(ap.name):'Varsayılan program (itiş · çekiş · bacak · üst vücut)'}</div>${ap?'<button data-pact="def" style="margin-top:6px">Varsayılana dön</button>':''}</div>`;
h+=st.plans.map((p,i)=>{const v=vsum(p.days);return `<div class="c"><div class="n">${esc(p.name)} ${p.id==st.active?'<span class="ss" style="background:#dff3d8;color:#2d7a1c">Aktif</span>':''}</div><div class="t">${p.days.length} gün: ${p.days.map(d=>esc(d.name)).join(" · ")}</div><div class="tip">${Object.keys(R).filter(c=>v[c]).map(c=>R[c][0]+" "+v[c]).join(" · ")}</div><div class="row">${p.id==st.active?'':`<button class="p" data-pact="${i}">Aktif yap</button>`}<button data-ple="${i}">Düzenle</button><button data-pld="${i}">${pdc==="pl"+i?'Emin misin? Sil':'Sil'}</button></div></div>`}).join("");
if(!st.plans.length)h+=`<div class="c"><div class="tip">Henüz kayıtlı programın yok. Yukarıdan hazır program ekle veya kendi programını oluştur.</div><button class="p" data-to="l">🧩 Program oluştur</button></div>`;
return h}
document.addEventListener("input",e=>{const d=e.target.dataset;if(d.ds!==undefined){bd.days[bd.cur].ex[+d.ds].s=Math.max(1,parseInt(e.target.value)||1);saveB()}else if(d.dr!==undefined){bd.days[bd.cur].ex[+d.dr].r=e.target.value;saveB()}else if(d.bn){bd.name=e.target.value;saveB()}else if(d.bdy!==undefined){bd.days[+d.bdy].name=e.target.value;saveB()}else if(d.bq!==undefined){const v=e.target.value.toLowerCase();document.querySelectorAll(".lx").forEach(el=>{el.style.display=el.dataset.nm.includes(v)?"":"none"})}});
const TT={r:"Rozetler",s:"Ayarlar",w:"Antrenman",y:"İlerleme",f:"Beslenme",m:"Daha fazla",l:"Program oluştur",p:"Programlar",b:"Vücut",c:"FORMIQ Koç",g:"Rehber"};
const ttl=()=>tab=="h"?"":`<div class="pt">${"lpbcgsr".includes(tab)?'<button data-to="m">‹</button>':''}<h2>${TT[tab]}</h2></div>`;
function more(){return [["l","🧩","Program oluştur","Günlerini ve hareketlerini seç, analiz et"],["p","📁","Programlar","Aktif program, hazır programlar, arşiv"],["b","📉","Vücut","Kilo ve bel ölçüsü, grafik"],["c","🤖","FORMIQ Koç","Verilerine göre soru sor"],["g","📘","Rehber","Dinlenme, süperset, ilerleme kuralları"],["r","🏅","Rozetler","Kazandığın başarı rozetleri"],["s","⚙️","Ayarlar","Tema, yedekleme ve geri yükleme"]].map(x=>`<button class="mi" data-to="${x[0]}"><span class="ic">${x[1]}</span><div><div class="n">${x[2]}</div><div class="t">${x[3]}</div></div><span class="chev">›</span></button>`).join("")}
const wsum=d=>(st.water[d]||[]).reduce((a,x)=>a+x,0),LT=x=>+(x/1000).toFixed(2);
function waterCard(full){const t=td(),n=wsum(t),g=st.wg;
let h=`<div class="c"><h3>💧 Su takibi</h3><div class="n">${LT(n)} / ${LT(g)} litre${n>=g?' 🎉':''}</div><div class="pb"><i style="width:${Math.min(n/g*100,100)}%;background:#3aa0ff"></i></div><div class="row">${[200,330,500].map(x=>`<button data-wt="${x}">+${x} ml</button>`).join("")}<button data-wu="1">↩ Geri al</button></div>`;
if(full){const ds=[...Array(7)].map((_,i)=>sh(t,i-6));h+=`<div class="row"><div><label>Günlük hedef (ml)</label><input id="wgi" type="number" value="${g}"></div><button data-wgs="1">Kaydet</button></div><svg viewBox="0 0 300 92" width="100%">${ds.map((d,i)=>{const v=wsum(d),hh=Math.min(v/g,1.3)*55;return `<rect x="${i*43+8}" y="${70-hh}" width="28" height="${Math.max(hh,1)}" rx="5" fill="${v>=g?'#3aa0ff':'#9ccbff'}"/><text x="${i*43+22}" y="85" font-size="10" text-anchor="middle" fill="var(--mu)">${new Date(d+"T12:00:00").toLocaleDateString("tr-TR",{weekday:"short"})}</text>`}).join("")}</svg><div class="t">Son 7 gün (koyu mavi: hedefe ulaştın)</div>`}
return h+`</div>`}
const thm=()=>{try{return localStorage.getItem("fit_theme")||"auto"}catch(e){return"auto"}};
function applyTheme(v){const r=document.documentElement;if(v=="auto")r.removeAttribute("data-theme");else r.setAttribute("data-theme",v)}
applyTheme(thm());
const fmtD=d=>new Date(d+"T12:00:00").toLocaleDateString("tr-TR",{day:"numeric",month:"short"});
const fix=()=>{st.w=st.w||{};st.done=st.done||[];st.body=st.body||[];st.food=st.food||{};st.steps=st.steps||{};st.progs=st.progs||[];st.chat=st.chat||[];st.hist=st.hist||[];st.plans=st.plans||[];st.water=st.water||{};st.wg=st.wg||3000;st.fav=st.fav||[];st.sleep=st.sleep||{};st.start=st.start||td();st.t=(st.t&&st.t.k)?st.t:{k:2200,p:160}};
let ht="g",rw=WK,wtxt="",cw=0,bmk="kg",bdc=null,rsc=false,rsv="";
function sg(x,cd){const lp=lastOf(x.n);if(!x.rest||!lp)return"";const hi=+((String(x.r).match(/(\d+)\s*$/)||[])[1]);if(!hi||!lp.some(s=>s.r))return"";const ks=lp.map(s=>s.kg).filter(Boolean);if(!ks.length)return"";const top=Math.max(...ks),low=+((String(x.r).match(/^(\d+)/)||[])[1])||0,all=lp.every(s=>s.r>=hi),inc=/[QHP]/.test(cd.p)?5:2.5;
return `<div class="tip" style="color:var(--ac2);font-weight:600">📈 ${(!all&&lp.every(s=>s.q!=null&&s.q>=3))?`Geçen sefer setler kolaydı (RIR 3+): ağırlığı artır, ${top+inc} kg dene.`:all?`Geçen sefer tüm setlerde ${hi}+ tekrar yaptın: bu sefer ${top+inc} kg dene.`:lp.some(s=>s.r<low)?`Geçen sefer hedef tekrara ulaşamadın: ${top} kg ile tekrar dene.`:`Geçen sefer ${top} kg ile ${lp.map(s=>s.r).join("/")} tekrar yaptın: aynı ağırlıkla tekrarı artır, tüm setlerde ${hi} olunca +${inc} kg.`}</div>`}
function noteCard(){const h=st.hist[ss.hi]||{};return `<div class="c"><h3>Nasıl hissettin?</h3><div class="row">${["😫","😕","😐","🙂","💪"].map((e,i)=>`<button class="${h.en==i+1?'on':''}" data-en="${i+1}">${e}</button>`).join("")}</div><label style="margin-top:8px">Ağrı, sakatlık veya not (isteğe bağlı)</label><textarea data-ptn="1" rows="2" style="width:100%;font:inherit;padding:8px;border:1px solid var(--bd);border-radius:10px;background:var(--in);color:var(--tx)">${esc(h.nt||"")}</textarea></div>`}
function sleepCard(){const s=st.sleep[td()]||{};return `<div class="c"><h3>😴 Uyku</h3><div class="t">Dün gece kaç saat uyudun?</div><div class="row"><div><label>Saat</label><input id="slh" type="number" step="0.5" inputmode="decimal" value="${s.h||''}"></div><div style="flex:1"><label>Nasıl hissediyorsun?</label><div class="row" style="margin:0">${["😫","😕","😐","🙂","😄"].map((e,i)=>`<button class="${s.q==i+1?'on':''}" data-slq="${i+1}" style="padding:4px 8px">${e}</button>`).join("")}</div></div></div><div class="row"><button data-sls="1">Kaydet</button>${s.h?`<span class="t">Kayıtlı: ${s.h} saat</span>`:''}</div></div>`}
function calCard(){const t=td(),n=new Date(t+"T12:00:00"),mo=sh(t,-((n.getDay()+6)%7)+cw*7),ds=[...Array(7)].map((_,i)=>sh(mo,i)),dn_=["Pzt","Sal","Çar","Per","Cum","Cmt","Paz"];
return `<div class="c"><div class="top"><h3>🗓 ${cw==0?'Bu hafta':cw==-1?'Geçen hafta':fmtD(ds[0])+' haftası'}</h3><div><button data-cw="-1" style="padding:2px 10px">‹</button><button data-cw="1" style="padding:2px 10px" ${cw>=0?'disabled':''}>›</button></div></div><div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;text-align:center;margin-top:6px">${ds.map((d,i)=>{const hs=st.hist.filter(h=>h.d==d),dn=hs.length||st.done.some(x=>x.d==d);return `<div style="padding:6px 2px;border-radius:10px;background:${dn?'var(--ac)':'var(--in)'};color:${dn?'#fff':'var(--tx)'};${d==t?'outline:2px solid var(--ac2)':''}"><div style="font-size:11px">${dn_[i]}</div><div style="font-size:15px;font-weight:700">${+d.slice(8)}</div><div style="font-size:10px;min-height:12px">${dn?(hs[0]?esc(hs[0].name).slice(0,6):'✓'):''}</div></div>`}).join("")}</div></div>`}
function favCard(){const y=(st.food[sh(fd,-1)]||[]).length;return `<div class="c"><h3>⭐ Sık yediklerim</h3>${st.fav.length?`<div class="row">${st.fav.map((f,i)=>`<span style="display:inline-flex;gap:2px"><button data-fav="${i}" style="font-size:12px">＋ ${esc(f.n)} · ${f.k} kcal · ${f.p} g</button><button data-fr="${i}" style="font-size:12px;padding:2px 8px">✕</button></span>`).join("")}</div>`:'<div class="tip">Yemeklerinin yanındaki ⭐ ile favorilere ekle, sonra tek dokunuşla ekle.</div>'}${y?`<button data-cp="1" style="margin-top:8px">📋 ${fd==td()?'Dünkü':'Önceki günün'} öğünlerini kopyala (${y})</button>`:''}</div>`}
const BM=[["kg","Kilo","kg"],["bel","Bel","cm"],["kol","Kol","cm"],["gogus","Göğüs","cm"],["kalca","Kalça","cm"],["bacak","Bacak","cm"]];
function body(){const b=st.body,cur=BM.find(x=>x[0]==bmk),ser=b.filter(x=>x[bmk]).map(x=>x[bmk]),lst=k=>{const a=b.filter(x=>x[k]);return a.length?a[a.length-1][k]:""};
const kgs=b.filter(x=>x.kg),last=kgs.length?kgs[kgs.length-1].kg:null,first=kgs.length?kgs[0].kg:null,gw=st.gw;let gh="";
if(gw&&last){const rem=gw-last,rec=kgs.filter(x=>x.d>=sh(td(),-42)),days=rec.length>1?(new Date(rec[rec.length-1].d)-new Date(rec[0].d))/864e5:0,rate=days>=7?(rec[rec.length-1].kg-rec[0].kg)/days*7:null,pr=first!==gw?Math.max(0,Math.min(100,(last-first)/(gw-first)*100)):100;
gh=`<div class="n">${last} kg → hedef ${gw} kg</div><div class="pb"><i style="width:${pr}%"></i></div>`+(Math.abs(rem)<.3?'<div class="tip">🎯 Hedefe ulaştın!</div>':rate==null?'<div class="tip">Tahmin için en az 1-2 hafta arayla kilo kaydı gir.</div>':rate*rem>0?`<div class="tip">Hız: ${rate.toFixed(2)} kg/hafta. Bu tempoyla yaklaşık ${Math.max(1,Math.round(rem/rate))} haftada (~${new Date(Date.now()+rem/rate*6048e5).toLocaleDateString("tr-TR",{day:"numeric",month:"long"})}) ulaşırsın.</div>`:Math.abs(rate)<.05?'<div class="tip">⚠️ Son haftalarda kilo değişmedi. Kaloriyi ~150 azaltmayı veya adımı artırmayı düşün.</div>':'<div class="tip">⚠️ Şu an hedefinin tersine gidiyorsun. Beslenme ve uykuyu kontrol et.</div>')}
return `<div class="c"><h3>Bugünkü ölçüm</h3><div class="row">${BM.map(x=>`<div><label>${x[1]} (${x[2]})</label><input id="m_${x[0]}" type="number" inputmode="decimal" step="0.1" placeholder="${lst(x[0])}"></div>`).join("")}</div><button class="p" data-bs="1" style="margin-top:8px">Kaydet</button></div>
<div class="c"><h3>🎯 Hedef kilo</h3>${gh}<div class="row"><div><label>Hedef (kg)</label><input id="gwi" type="number" inputmode="decimal" step="0.1" value="${gw||''}"></div><button data-gw="1">Kaydet</button></div></div>
<div class="c"><h3>📉 İlerleme</h3><select data-bmk="1" style="width:100%;font:inherit;padding:8px;border:1px solid var(--bd);border-radius:10px;background:var(--in);color:var(--tx)">${BM.map(x=>`<option value="${x[0]}" ${x[0]==bmk?'selected':''}>${x[1]}</option>`).join("")}</select>${ser.length?lc(ser,"#4aa631"):'<div class="tip">Bu ölçü için kayıt yok.</div>'}${ser.length>1?`<div class="t">İlk kayda göre ${ser[ser.length-1]-ser[0]>0?'+':''}${(ser[ser.length-1]-ser[0]).toFixed(1)} ${cur[2]}</div>`:''}</div>
<div class="c"><h3>Son kayıtlar</h3>${b.length?[...b].map((x,i)=>({x,i})).reverse().slice(0,6).map(o=>`<div class="t" style="margin:4px 0">${fmtD(o.x.d)}: ${BM.filter(m=>o.x[m[0]]).map(m=>m[1]+" "+o.x[m[0]]).join(" · ")} <a href="#" data-bdel="${o.i}">${bdc===o.i?'Emin misin? Sil':'sil'}</a></div>`).join(""):'<div class="tip">Henüz kayıt yok.</div>'}</div>
<button data-to="r" style="width:100%;margin:6px 0">🏅 Rozetlerim</button>
<div class="t">Öneri: Haftada 1 kez, aynı gün sabah aç karnına tart ve ölçülerini aynı noktalardan al.</div>`}
function prv(){const m={};st.hist.forEach(h=>h.ex.forEach(e=>{if(e.c)return;e.sets.forEach(s=>{if(!s.kg)return;const e1=s.kg*(1+(s.r||1)/30),o=m[e.n]||(m[e.n]={kg:0,kr:0,kd:"",e1:0});if(s.kg>o.kg||(s.kg==o.kg&&s.r>o.kr)){o.kg=s.kg;o.kr=s.r;o.kd=h.d}if(e1>o.e1)o.e1=e1})}));
const a=Object.keys(m).map(n=>Object.assign({n},m[n])).sort((x,y)=>y.e1-x.e1);
if(!a.length)return `<div class="c"><h3>🏆 Kişisel rekorlar</h3><div class="tip">Henüz rekor yok. Antrenman kaydettikçe burada görünür.</div></div>`;
return `<div class="c"><h3>🏆 Kişisel rekorlar</h3><div class="t">Tahmini 1RM = kg × (1 + tekrar/30) (Epley formülü)</div>${a.map(x=>`<div class="row" style="align-items:center;border-top:1px solid var(--bd);padding-top:6px;margin:6px 0 0"><div style="flex:1"><b>${esc(x.n)}</b><div class="t">En ağır set: ${x.kg} kg × ${x.kr||'?'} · ${fmtD(x.kd)}</div></div><div style="text-align:right"><div class="n">${Math.round(x.e1*10)/10} kg</div><div class="t">tahmini 1RM</div></div></div>`).join("")}</div>`}
function wstat(w){const ds=[...Array(7)].map((_,i)=>sh(st.start,(w-1)*7+i)),hs=st.hist.filter(h=>wk(h.d)==w),fdd=ds.filter(d=>(st.food[d]||[]).length),av=a=>a.length?Math.round(a.reduce((x,y)=>x+y,0)/a.length):null,kg=st.body.filter(x=>x.kg&&wk(x.d)==w).map(x=>x.kg),sl=ds.map(d=>st.sleep[d]).filter(x=>x&&x.h),en=hs.map(h=>h.en).filter(Boolean);
return{n:cnt(w),dur:hs.reduce((a,h)=>a+h.dur,0),vol:hs.reduce((a,h)=>a+h.vol,0),kcal:av(fdd.map(d=>st.food[d].reduce((a,x)=>a+x.k,0))),pro:av(fdd.map(d=>st.food[d].reduce((a,x)=>a+x.p,0))),su:av(ds.map(wsum).filter(x=>x>0)),adim:av(ds.map(d=>st.steps[d]||0).filter(x=>x>0)),kg:kg.length?kg[kg.length-1]:null,uyku:sl.length?Math.round(sl.reduce((a,x)=>a+x.h,0)/sl.length*10)/10:null,enerji:en.length?Math.round(en.reduce((a,x)=>a+x,0)/en.length*10)/10:null}}
function repv(){const a=wstat(rw),b=wstat(rw-1),f=(v,u)=>v==null?"–":v+(u||"");
const rows=[["🏋️ Antrenman",a.n+"/"+GL(),b.n+"/"+GL()],["⏱ Süre",Math.round(a.dur/60)+" dk",Math.round(b.dur/60)+" dk"],["⚖️ Hacim",a.vol+" kg",b.vol+" kg"],["🔥 Ort. kalori",f(a.kcal," kcal"),f(b.kcal," kcal")],["🥩 Ort. protein",f(a.pro," g"),f(b.pro," g")],["💧 Ort. su",f(a.su!=null?LT(a.su):null," L"),f(b.su!=null?LT(b.su):null," L")],["🚶 Ort. adım",f(a.adim),f(b.adim)],["😴 Ort. uyku",f(a.uyku," sa"),f(b.uyku," sa")],["⚡ Ort. enerji",f(a.enerji,"/5"),f(b.enerji,"/5")],["📉 Kilo",f(a.kg," kg"),f(b.kg," kg")]];
return `<div class="c"><div class="top"><h3>📋 ${rw==WK?'Bu hafta':rw+'. hafta'}</h3><div><button data-rw="-1" style="padding:2px 10px">‹</button><button data-rw="1" style="padding:2px 10px" ${rw>=WK?'disabled':''}>›</button></div></div><table style="width:100%;border-collapse:collapse;font-size:14px"><tr class="t"><td></td><td>${rw}. hafta</td><td>${rw-1}. hafta</td></tr>${rows.map(r=>`<tr style="border-top:1px solid var(--bd)"><td style="padding:7px 0">${r[0]}</td><td><b>${r[1]}</b></td><td class="t">${r[2]}</td></tr>`).join("")}</table><div class="t" style="margin-top:6px">Hedefler: ${st.t.k} kcal · ${st.t.p} g protein · ${LT(st.wg)} L su</div></div><div class="c"><div class="tip" id="wrm" style="white-space:pre-wrap">${wtxt?esc(wtxt):''}</div><button class="p" data-wr="1">🤖 Koç haftalık yorum</button></div>`}
async function wrAi(){const m=document.getElementById("wrm");m.textContent="Koç değerlendiriyor…";try{wtxt=await ai(`Sen FORMIQ koçusun. Kullanıcı profili: ${profS()}. ${rw}. hafta ve önceki hafta verileri: ${JSON.stringify({buHafta:wstat(rw),oncekiHafta:wstat(rw-1),hedefKcal:st.t.k,hedefProtein:st.t.p,hedefSuMl:st.wg,haftalikAntrenmanHedefi:GL(),hedefKilo:st.gw||null})}. Haftayı kısaca değerlendir: ne iyi gitti, ne eksik, uyku ve enerji ile performans ilişkisi, gelecek hafta için 3 somut öneri. Türkçe, en fazla 8 kısa satır.`);render()}catch(e){m.textContent="Yorum alınamadı ("+er(e)+")"}}
function histv(){return `<div class="tabs">${[["g","Genel"],["r","Haftalık rapor"],["p","Rekorlar"]].map(x=>`<button class="${ht==x[0]?'on':''}" data-ht="${x[0]}">${x[1]}</button>`).join("")}</div>`+(ht=="r"?repv():ht=="p"?prv():histG())}
function setv(){const t=thm(),ta="width:100%;font:12px monospace;padding:8px;border:1px solid var(--bd);border-radius:10px;background:var(--in);color:var(--tx)";return acctCard()+`<div class="c"><h3>👤 Profil ve hedefler</h3><div class="t">${st.prof&&st.prof.age?st.prof.g+' · '+st.prof.age+' yaş · '+st.prof.h+' cm · hedef: '+st.prof.goal:'Kurulum yapılmadı'}</div><div class="t">Günlük: ${st.t.k} kcal · ${st.t.p} g protein · ${LT(st.wg)} L su</div><button data-obr="1" style="margin-top:6px">Kurulumu yeniden yap</button></div><div class="c"><h3>🎨 Tema</h3><div class="row">${[["auto","Otomatik"],["light","Açık"],["dark","Koyu"]].map(x=>`<button class="${t==x[0]?'on':''}" data-th="${x[0]}">${x[1]}</button>`).join("")}</div></div>
${remCard()}<div class="c"><h3>💾 Yedekle</h3><div class="tip">Bu metin tüm verini içerir. Kopyalayıp Notlar uygulamasına yapıştırabilirsin.</div><textarea id="bk" readonly rows="4" style="${ta}">${esc(JSON.stringify(st))}</textarea><div class="row"><button class="p" data-cpy="1">📋 Kopyala</button></div><div class="tip" id="bkm"></div></div>
<div class="c"><h3>⬆️ Geri yükle</h3><div class="tip">Yedek metnini yapıştır. Mevcut verinin üzerine yazılır.</div><textarea id="rs" rows="4" placeholder="Yedek metnini buraya yapıştır" style="${ta}">${esc(rsv)}</textarea><div class="row"><button data-rst="1">${rsc?'Emin misin? Evet, geri yükle':'Geri yükle'}</button></div><div class="tip" id="rsm"></div></div>
<div class="c"><h3>🗑 Tüm verileri sil</h3><div class="tip">Antrenman, beslenme ve ölçüm kayıtlarının tamamı bu cihazdan kalıcı olarak silinir.</div><button data-wipe="1" style="color:var(--red)">${wpc?'Emin misin? Her şeyi sil':'Verileri sil'}</button></div>
<div class="c"><h3>ℹ️ Hakkında</h3><div class="t">FORMIQ ${(window.FORMIQ_CONFIG||{}).version||''} · Verilerin yalnızca bu cihazda saklanır.</div><div class="tip">FORMIQ tıbbi tavsiye vermez. Yeni bir egzersiz veya beslenme programına başlamadan önce sağlık durumun için bir uzmana danış. Kalori ve makro değerleri tahminidir.</div><div class="row"><a class="g" href="${(window.FORMIQ_CONFIG||{}).privacyUrl||'privacy.html'}" target="_blank" rel="noopener">Gizlilik politikası ↗</a></div></div>`}
let wpc=false;
function remCard(){const r=st.rem||{on:false,t:"18:00"};return `<div class="c"><h3>🔔 Antrenman hatırlatıcısı</h3><div class="tip">Her gün seçtiğin saatte sana antrenman ve su hatırlatması gönderir.</div><div class="row" style="align-items:center"><div><label>Saat</label><input id="rmt" type="time" value="${r.t}" style="width:120px"></div><button class="${r.on?'on':''}" data-rem="1">${r.on?'Açık':'Kapalı'}</button></div>${FX.native?'':'<div class="t" style="margin-top:6px">Bildirimler mobil uygulamada çalışır.</div>'}</div>`}
document.addEventListener("input",e=>{if(e.target.dataset.ptn!==undefined&&ss&&ss.fin&&st.hist[ss.hi]){st.hist[ss.hi].nt=e.target.value;sv()}});
document.addEventListener("change",e=>{if(e.target.dataset.bmk!==undefined){bmk=e.target.value;render()}});
const FOODS=`Yumurta (haşlanmış)|1 adet|78|6
Yumurta (sahanda/omlet)|1 adet|95|6
Yumurta akı|1 adet|17|4
Menemen|1 porsiyon (2 yumurta)|260|13
Tavuk göğsü (pişmiş)|100 g|165|31
Tavuk but (derisiz, pişmiş)|100 g|180|25
Dana kıyma (pişmiş)|100 g|250|26
Dana biftek (pişmiş)|100 g|230|27
Köfte|1 porsiyon (150 g)|340|28
Ton balığı (konserve, suda)|1 kutu|130|28
Somon (pişmiş)|100 g|206|22
Levrek / çipura (pişmiş)|100 g|130|24
Yoğurt (tam yağlı)|1 kase (200 g)|125|7
Yoğurt (yarım yağlı)|1 kase (200 g)|90|7
Süzme yoğurt|100 g|95|9
Süt (yarım yağlı)|1 bardak (200 ml)|95|7
Ayran|1 bardak (200 ml)|70|4
Kefir|1 bardak (200 ml)|110|7
Lor peyniri|100 g|100|11
Beyaz peynir|1 dilim (30 g)|80|4
Kaşar peyniri|1 dilim (20 g)|70|5
Whey protein|1 ölçek (30 g)|120|24
Protein bar|1 adet|200|20
Yulaf ezmesi (kuru)|50 g|195|8
Granola|40 g|180|4
Ekmek (beyaz)|1 dilim (30 g)|80|3
Tam buğday ekmeği|1 dilim (30 g)|75|4
Simit|1 adet|300|9
Poğaça|1 adet|280|6
Peynirli tost|1 adet|320|15
Pirinç pilavı (pişmiş)|1 porsiyon (150 g)|195|4
Bulgur pilavı (pişmiş)|1 porsiyon (150 g)|130|5
Makarna (pişmiş)|1 porsiyon (150 g)|235|9
Patates (haşlanmış)|1 orta (150 g)|130|3
Tatlı patates (fırın)|150 g|135|2
Mercimek çorbası|1 kase (250 ml)|180|10
Nohut (haşlanmış)|100 g|165|9
Mercimek (haşlanmış)|100 g|115|9
Kuru fasulye (yemek)|1 porsiyon (200 g)|250|12
Humus|2 yemek kaşığı|70|2
Salata (zeytinyağlı)|1 porsiyon|90|2
Mantı (yoğurtlu)|1 porsiyon|380|15
Lahmacun|1 adet|220|11
Pizza|1 dilim|285|12
Et döner dürüm|1 adet|550|30
Tavuk döner dürüm|1 adet|500|28
Hamburger|1 adet|500|25
Kızarmış patates|1 porsiyon|365|4
Muz|1 orta|105|1
Elma|1 orta|95|0
Portakal|1 orta|62|1
Çilek|100 g|32|1
Üzüm|100 g|69|1
Avokado|yarım adet|160|2
Badem|30 g (1 avuç)|175|6
Ceviz|30 g|195|5
Fındık|30 g|185|4
Fıstık ezmesi|1 yemek kaşığı (16 g)|95|4
Zeytin|5 adet|35|0
Zeytinyağı|1 yemek kaşığı|120|0
Tereyağı|1 çay kaşığı|36|0
Bal|1 yemek kaşığı|60|0
Bitter çikolata|20 g|110|1
Sütlaç|1 kase|220|6
Baklava|1 dilim|200|3
Dondurma|1 top|140|2
Çay (şekersiz)|1 bardak|2|0
Türk kahvesi (şekersiz)|1 fincan|5|0
Kola|330 ml|140|0
Meyve suyu|200 ml|90|1`.split("\n").map(l=>{const a=l.split("|");return{n:a[0],u:a[1],k:+a[2],p:+a[3]}});
function fres(q){q=(q||"").trim().toLocaleLowerCase("tr-TR");const all=FOODS.map((x,i)=>({x,i})),l=q?all.filter(o=>(o.x.n+" "+o.x.u).toLocaleLowerCase("tr-TR").includes(q)).slice(0,12):all.slice(0,6);
return (q?'':'<div class="t">Sık kullanılanlar · yazarak ara</div>')+(l.length?l.map(o=>`<div class="row" style="align-items:center;border-top:1px solid var(--bd);padding-top:6px;margin:6px 0 0"><div style="flex:1"><b>${esc(o.x.n)}</b><div class="t">${esc(o.x.u)} · ${o.x.k} kcal · ${o.x.p} g protein</div></div><button class="p" data-fadd="${o.i}">＋ Ekle</button></div>`).join(""):'<div class="tip">Sonuç yok. “Hesapla” ile yazdığını hesaplatabilir veya aşağıdan elle ekleyebilirsin.</div>')}
const fqCard=()=>`<div class="c"><h3>🔎 Hızlı ara</h3><input class="w" data-fq="1" placeholder="örn: yumurta, tavuk, pilav…" autocomplete="off"><div class="row"><div><label>Porsiyon ×</label><input id="fqm" type="number" step="0.5" inputmode="decimal" value="1"></div></div><div id="fres">${fres("")}</div><div class="t" style="margin-top:6px">Değerler yaklaşıktır.</div></div>`;
let ob={name:"",g:"Erkek",goal:"Yağ yak",days:4,lvl:"Orta",prog:null,age:"",h:"",kg:"",err:""};
const obb=(k,v,l)=>`<button class="${ob[k]==v?'on':''}" data-ob="${k}:${v}">${l||v}</button>`;
function obv(){if(ob.prog===null)ob.prog=!(st.plans.length||st.hist.length);
const inp=(k,l,st_,ph)=>`<div style="flex:1;min-width:84px"><label>${l}</label><input style="width:100%" data-obi="${k}" type="number" inputmode="decimal" placeholder="${ph}" ${st_||''} value="${qa(ob[k])}"></div>`;
return `<div class="ob-hero"><svg class="lg" viewBox="0 0 64 64"><defs><linearGradient id="obg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3ddc84"/><stop offset="1" stop-color="#ff7a2f"/></linearGradient></defs><rect width="64" height="64" rx="18" fill="url(#obg)"/><path d="M20 46V18h24v7H28v5h13v7H28v9z" fill="#fff"/></svg><h2>FORMIQ’e hoş geldin</h2><div class="t">Hedeflerini ve programını sana göre kuralım. Yaklaşık 1 dakika sürer.</div></div>
<div class="c"><label>Adın</label><input class="w" data-obt="name" placeholder="örn: Ömer" autocomplete="given-name" maxlength="24" value="${qa(ob.name)}"><label style="margin-top:12px">Cinsiyet</label><div class="row">${obb("g","Erkek")}${obb("g","Kadın")}</div>
<div class="row" style="margin-top:8px">${inp("age","Yaş","","25")}${inp("h","Boy (cm)","","175")}${inp("kg","Kilo (kg)",'step="0.1"',"75")}</div>
<label style="margin-top:8px">Hedef</label><div class="row">${["Yağ yak","Kas yap","Güç","Genel fit"].map(x=>obb("goal",x)).join("")}</div>
<label style="margin-top:8px">Haftada kaç gün antrenman?</label><div class="row">${[3,4,5].map(x=>obb("days",x,x+" gün")).join("")}</div>
<label style="margin-top:8px">Seviye</label><div class="row">${obb("lvl","Başlangıç")}${obb("lvl","Orta")}</div>
<label style="margin-top:8px">Program</label><div class="row"><button class="${ob.prog?'on':''}" data-ob="prog:1">Programımı da hazırla</button><button class="${!ob.prog?'on':''}" data-ob="prog:0">Sadece hedefleri ayarla</button></div>
${ob.err?`<div class="tip" style="color:#e5484d">${esc(ob.err)}</div>`:''}
<button class="p" style="width:100%;margin-top:12px;padding:14px" data-obf="1">Kurulumu tamamla</button><button style="width:100%;margin-top:8px" data-obs="1">Şimdilik atla</button><div class="t" style="margin-top:6px">Hesaplamalar tahmindir (Mifflin-St Jeor). Ayarlar’dan istediğin zaman değiştirebilirsin.</div></div>`}
function obFin(){const age=+ob.age,h=+ob.h,kg=+ob.kg;
if(!(age>=14&&age<=90)||!(h>=120&&h<=230)||!(kg>=30&&kg<=250)){ob.err="Yaş (14-90), boy (120-230 cm) ve kiloyu (30-250 kg) kontrol et.";render();return}
const bmr=10*kg+6.25*h-5*age+(ob.g=="Erkek"?5:-161),tdee=bmr*{3:1.45,4:1.55,5:1.65}[ob.days];
let k=ob.goal=="Yağ yak"?tdee-450:ob.goal=="Kas yap"?tdee+250:tdee;k=Math.round(Math.max(k,bmr*1.1,1200)/50)*50;
const p=Math.round(kg*(ob.goal=="Yağ yak"?1.9:1.8)/5)*5;
st.t={k,p};st.wg=Math.round(kg*35/100)*100;
const lb=st.body.filter(x=>x.kg).slice(-1)[0];if(!lb||lb.kg!=kg)st.body.push({d:td(),kg});
st.prof={name:(ob.name||"").trim().slice(0,24),g:ob.g,age,h,kg,goal:ob.goal,days:ob.days,lvl:ob.lvl,d:td()};
if(ob.prog){const r=gen({g:ob.g,goal:ob.goal,days:ob.days,lvl:ob.lvl}),o={id:"pl"+Date.now(),name:r.name,days:r.days};st.plans.push(o);st.active=o.id;day=0}
ob.err="";sv();tab="h";render();window.scrollTo(0,0);toast("✅ Hedefin: "+k+" kcal · "+p+" g protein · "+LT(st.wg)+" L su")}
const wrun=()=>{let n=0,d=td();if(wsum(d)<st.wg)d=sh(d,-1);while(wsum(d)>=st.wg&&n<400){n++;d=sh(d,-1)}return n};
function BDG(){const n=st.done.length,vol=st.hist.reduce((a,h)=>a+h.vol,0),sk=streak(),pd=Object.keys(st.food).some(d=>{const f=st.food[d];return f.length&&f.reduce((a,x)=>a+x.p,0)>=st.t.p});
return[{id:"w1",i:"🥇",n:"İlk adım",d:"İlk antrenmanını tamamla",ok:n>=1},{id:"w5",i:"🔥",n:"Isınıyoruz",d:"5 antrenman",ok:n>=5},{id:"w10",i:"💪",n:"Düzen oturdu",d:"10 antrenman",ok:n>=10},{id:"w25",i:"🏆",n:"Disiplin",d:"25 antrenman",ok:n>=25},{id:"w50",i:"👑",n:"Efsane",d:"50 antrenman",ok:n>=50},
{id:"wk",i:"🎯",n:"Hedef haftası",d:"Bir haftanın tüm antrenmanlarını yap",ok:cnt(WK)>=GL()||sk>=1},{id:"s2",i:"⚡",n:"2 hafta seri",d:"Üst üste 2 hafta hedefi tuttur",ok:sk>=2},{id:"s4",i:"🚀",n:"4 hafta seri",d:"Üst üste 4 hafta",ok:sk>=4},
{id:"pr",i:"📈",n:"Rekor kırıcı",d:"Bir hareketi en ağır setinle geç",ok:(st.prc||0)>=1},{id:"vol",i:"🏗️",n:"10 ton",d:"Toplam 10.000 kg hacim",ok:vol>=10000},{id:"b4",i:"📏",n:"Ölçüm takipçisi",d:"4 vücut ölçümü kaydet",ok:st.body.length>=4},
{id:"su1",i:"💧",n:"Su hedefi",d:"Günlük su hedefini tamamla",ok:Object.keys(st.water).some(d=>wsum(d)>=st.wg)},{id:"su7",i:"🌊",n:"Su serisi",d:"7 gün üst üste su hedefi",ok:wrun()>=7},{id:"pro",i:"🥩",n:"Protein günü",d:"Günlük protein hedefine ulaş",ok:pd},
{id:"slp",i:"😴",n:"İyi uykucu",d:"7 gece 7+ saat uyku kaydet",ok:Object.values(st.sleep).filter(x=>x&&x.h>=7).length>=7},{id:"pl",i:"🧩",n:"Kendi programım",d:"Bir program kaydet",ok:!!st.ownp}]}
function badgesCard(){const L=BDG(),e=L.filter(b=>b.ok).length;return `<div class="c"><h3>🏅 Rozetler</h3><div class="t">${e}/${L.length} kazanıldı</div><div class="pb"><i style="width:${e/L.length*100}%;background:#ffb23a"></i></div><div class="bd">${L.map(b=>`<div class="b ${b.ok?'ok':''}"><big>${b.ok?b.i:'🔒'}</big><b>${b.n}</b><div class="t">${b.ok&&st.badges&&st.badges[b.id]?fmtD(st.badges[b.id]):b.d}</div></div>`).join("")}</div></div>`}
const badgesv=()=>badgesCard();
function streakCard(){const s=streak(),c=Math.min(cnt(WK),GL()),L=BDG(),e=L.filter(b=>b.ok).length;return `<div class="c" style="display:flex;align-items:center;gap:12px"><div class="flame${s>0||c>0?' on':''}">🔥</div><div style="flex:1"><div class="n">${s>0?s+' haftalık seri':'Seriyi başlat'}</div><div class="t">${c>=GL()?'Bu haftanın hedefi tamam! 🎉':(GL()-c)+' antrenman kaldı'+(s>0?', seri devam ediyor':'')}</div><div class="row" style="margin-top:6px;align-items:center">${[...Array(GL())].map((_,i)=>`<span class="dot${i<c?' f':''}"></span>`).join("")}<button data-to="r" style="font-size:12px;margin-left:auto">🏅 ${e}/${L.length}</button></div></div></div>`}
function celebrate(list){const o=document.createElement("div");o.id="cel";const em=["🎉","✨","💪","⭐","🔥"];
o.innerHTML=`<div class="cf">${[...Array(22)].map((_,i)=>`<span style="left:${(i*37)%100}%;animation-delay:${(i%7)*.18}s;font-size:${14+(i%4)*5}px">${em[i%5]}</span>`).join("")}</div><div class="cc"><div class="t">Yeni rozet${list.length>1?'ler':''}!</div>${list.map(b=>`<div class="cb"><div class="ci">${b.i}</div><div class="n">${b.n}</div><div class="t">${b.d}</div></div>`).join("")}<button class="p" data-celx="1" style="margin-top:10px;width:100%">Harika!</button></div>`;
document.body.appendChild(o);FX.success()}
let bt;
function chkBadges(){try{const L=BDG();if(!st.badges){st.badges={};L.forEach(b=>{if(b.ok)st.badges[b.id]=td()});sv();return}
const nw=L.filter(b=>b.ok&&!st.badges[b.id]);if(!nw.length||document.getElementById("cel"))return;nw.forEach(b=>st.badges[b.id]=td());sv();celebrate(nw)}catch(e){}}
const ORD="hwyfm";let _vk=null;
function vkey(){if(SB&&!AU.ready)return"L";if(needAuth())return"A"+AU.v;if(!st.prof&&!ss)return"O";if(ss)return ss.fin?"F":"S"+ss.i;return"T"+tab+(tab=="l"?bd.step:"")}
function afterRender(){const k=vkey(),pk=_vk;_vk=k;FX.statusBar(k=="Th");if(pk===k)return;const B=document.body;B.classList.add("vt");clearTimeout(window._vtT);window._vtT=setTimeout(()=>B.classList.remove("vt"),1300);if(pk===null)return;
const m=document.getElementById("main"),T=c=>c[0]=="T"?c[1]:null;let dx=0,dy=0;
if(k[0]=="A"&&pk[0]=="A")dx=k=="Awelcome"?-1:1;else if(pk=="L")dy=1;else if(k[0]=="S"&&pk[0]=="S")dx=+k.slice(1)>+pk.slice(1)?1:-1;else if(k[0]=="S"||k=="F"||pk=="O")dy=1;else if(pk[0]=="S"||pk=="F")dy=-1;
else{const a=ORD.indexOf(T(k)),b=ORD.indexOf(T(pk));dx=a>=0&&b>=0?(a>b?1:-1):a<0&&b>=0?1:a>=0&&b<0?-1:(T(k)=="l"&&T(pk)=="l"?(k>pk?1:-1):1)}
window.scrollTo(0,0);if(matchMedia("(prefers-reduced-motion: reduce)").matches||!m.animate)return;
const E="cubic-bezier(.2,.8,.2,1)",tf=dx?`translate3d(${dx*32}px,0,0)`:dy>0?"translate3d(0,26px,0) scale(.98)":"scale(.985)";
m.animate([{opacity:0,transform:tf},{opacity:1,transform:"none"}],{duration:380,easing:E});
[...m.children].slice(0,7).forEach((el,i)=>{if(el.classList.contains("pt"))return;el.animate([{opacity:0,transform:"translate3d(0,12px,0)"},{opacity:1,transform:"none"}],{duration:440,delay:50+i*40,easing:E,fill:"backwards"})});
if(k=="Th"){const h=document.getElementById("hd");h.animate([{opacity:0,transform:"translate3d(0,-14px,0)"},{opacity:1,transform:"none"}],{duration:420,easing:E})}}
function render(){render0();afterRender();clearTimeout(bt);bt=setTimeout(chkBadges,250)}
window.FORMIQ_back=()=>{const c=document.getElementById("cel");if(c){c.remove();return true}
if(needAuth()){if(AU.v!="welcome"){AU.v="welcome";AU.err="";render();return true}return false}
if(ss){if(ss.fin){endS();tab="h";render();return true}if(!ss.xc){ss.xc=1;render();toast("Çıkmak için tekrar geri bas");return true}endS();return true}
if("lpbcgsr".includes(tab)){tab="m";render();return true}if(tab!="h"){tab="h";render();return true}return false};
window.FORMIQ_resume=()=>{const w=wk(td());if(w!==WK){WK=w;rw=w}render();accountResume().catch(()=>{})};
const sE=()=>{if(!ss.ex)ss.ex=JSON.parse(JSON.stringify(DS()[ss.day].e));return ss.ex};
function swapCard(x,cd){const used=new Set(sE().map(e=>e.n)),card=!x.rest,pm=(cd.p||"")[0];
const alts=LB.map((a,i)=>({a,i})).filter(o=>!used.has(o.a.n)&&(card?o.a.p=="D":(o.a.p!="D"&&pm&&o.a.p.includes(pm)))).sort((u,v)=>(v.a.p==cd.p)-(u.a.p==cd.p)).slice(0,8);
return `<div class="c"><h3>🔄 Alternatif hareketler</h3><div class="t">Aynı bölgeyi çalıştıran hareketler. Seçersen bu antrenmanda ${esc(x.n)} yerine geçer, programın değişmez.</div>${alts.length?alts.map(o=>`<div class="row" style="align-items:center;border-top:1px solid var(--bd);padding-top:6px;margin:6px 0 0"><div style="flex:1"><b>${esc(o.a.n)}</b><div class="t">${nm(o.a.p)}</div></div><button class="p" data-swp="${o.i}">Seç</button></div>`).join(""):'<div class="tip">Bu hareket için uygun alternatif bulunamadı.</div>'}<button data-swo="1" style="margin-top:8px">Vazgeç</button></div>`}
const rirS=h=>{const a=h.ex.flatMap(e=>e.sets.map(s=>s.q)).filter(x=>x!=null);return a.length?" RIR ort "+(a.reduce((x,y)=>x+y,0)/a.length).toFixed(1):""};
document.addEventListener("input",e=>{const d=e.target.dataset;
if(d.obi!==undefined)ob[d.obi]=e.target.value;
else if(d.obt!==undefined)ob[d.obt]=e.target.value;
else if(ss&&d.sq!==undefined){ss.log[ss.i][+d.sq].q=e.target.value;saveS()}
else if(d.fq!==undefined){const r=document.getElementById("fres");if(r)r.innerHTML=fres(e.target.value)}
else if(d.bq!==undefined){const n=document.getElementById("lnone");if(n){const v=e.target.value.toLowerCase();n.style.display=[...document.querySelectorAll(".lx")].some(el=>el.dataset.nm.includes(v))?"none":""}}});
window.addEventListener("error",()=>{try{toast("⚠️ Bir şeyler ters gitti. Sayfayı yenilemeyi dene.")}catch(x){}});
document.addEventListener("click",e=>{const t=e.target,d=t.dataset;
if(d.t){tab=d.t;render()}else if(d.d!==undefined){day=+d.d;render()}
else if(d.r){tEnd=Date.now()+d.r*1000;document.getElementById("tb").classList.add("on");clearInterval(iv);iv=setInterval(tick,500);tick()}
else if(d.bdn){const n=+d.bdn;while(bd.days.length<n)bd.days.push({name:"Gün "+(bd.days.length+1),ex:[]});bd.days.length=n;bd.cur=Math.min(bd.cur,n-1);render()}
else if(d.bgo){bd.name=($v("bpn")||bd.name).trim();bd.step=2;render();window.scrollTo(0,0)}
else if(d.bstep){if(d.bstep=="3"&&!bd.days.some(x=>x.ex.length)){toast("Önce en az bir hareket ekle");return}bd.step=+d.bstep;bd.ask=false;render();window.scrollTo(0,0)}
else if(d.bc!==undefined){bd.cur=+d.bc;render()}
else if(d.add!==undefined){const x=LB[+d.add];bd.days[bd.cur].ex.push(mkEx(x));render();toast("＋ "+x.n+" → "+bd.days[bd.cur].name)}
else if(d.dx!==undefined){bd.days[bd.cur].ex.splice(+d.dx,1);render()}
else if(d.sug!==undefined){const x=LB[+d.sug],t=bd.days.slice().sort((a,b)=>a.ex.length-b.ex.length)[0];t.ex.push(mkEx(x));bd.txt="";render();toast("＋ "+x.n+" → "+t.name)}
else if(d.bai){bdAi()}
else if(d.bfin){bd.ask=true;render();const a=document.getElementById("bask");a&&a.scrollIntoView({block:"center"})}
else if(d.bsave!==undefined){savePlan(d.bsave=="1")}
else if(d.bnew){bd=newBd();render()}
else if(d.pact!==undefined){if(d.pact=="def")st.active=null;else st.active=st.plans[+d.pact].id;day=0;sv();render();toast(st.active?"✅ Aktif program güncellendi":"Varsayılan program aktif")}
else if(d.ple!==undefined){const p=st.plans[+d.ple];bd={step:2,name:p.name,n:p.days.length,days:JSON.parse(JSON.stringify(p.days)),cur:0,id:p.id,txt:"",ask:false};tab="l";render();window.scrollTo(0,0)}
else if(d.pld!==undefined){const i=+d.pld;if(pdc==="pl"+i){const p=st.plans.splice(i,1)[0];if(st.active==p.id){st.active=null;day=0}pdc=null;sv()}else pdc="pl"+i;render()}
else if(d.wa){const r=wz.res,o={id:"pl"+Date.now(),name:r.name,days:JSON.parse(JSON.stringify(r.days))};st.plans.push(o);if(d.wa=="act"){st.active=o.id;day=0}wz.res=null;wz.txt="";sv();tab=d.wa=="act"?"w":"p";render();window.scrollTo(0,0);toast(d.wa=="act"?"✅ Program aktif edildi":"✅ Program kaydedildi")}
else if(d.wt){(st.water[td()]=st.water[td()]||[]).push(+d.wt);sv();render();toast("💧 +"+d.wt+" ml")}
else if(d.wu){const a=st.water[td()];if(a&&a.length){a.pop();sv();render()}}
else if(d.wgs){const v=parseInt($v("wgi"));if(v>=500){st.wg=v;sv();render();toast("✅ Su hedefi güncellendi")}else toast("Hedef en az 500 ml olmalı")}
else if(d.ht){ht=d.ht;render()}
else if(d.rw){rw=Math.max(1,Math.min(WK,rw+(+d.rw)));wtxt="";render()}
else if(d.wr){wrAi()}
else if(d.cw){cw=Math.min(0,cw+(+d.cw));render()}
else if(d.en){st.hist[ss.hi].en=+d.en;sv();render()}
else if(d.slq){const o=st.sleep[td()]=st.sleep[td()]||{},i=document.getElementById("slh");if(i&&parseFloat(i.value))o.h=parseFloat(i.value);o.q=+d.slq;sv();render()}
else if(d.sls){const v=parseFloat($v("slh"));if(v>0&&v<=24){const o=st.sleep[td()]=st.sleep[td()]||{};o.h=v;sv();render();toast("😴 Uyku kaydedildi")}else toast("Uyku süresini saat olarak gir (örn. 7.5)")}
else if(d.gw){const v=parseFloat($v("gwi"));if(v>20&&v<300){st.gw=v;sv();render();toast("🎯 Hedef kaydedildi")}else toast("Geçerli bir hedef kilo gir")}
else if(d.bdel!==undefined){e.preventDefault();const i=+d.bdel;if(bdc===i){st.body.splice(i,1);bdc=null;sv()}else bdc=i;render()}
else if(d.fs!==undefined){e.preventDefault();const it=st.food[fd][+d.fs];if(!st.fav.some(f=>f.n==(it.n||"Öğün")&&f.k==it.k))st.fav.push({n:it.n||"Öğün",k:it.k,p:it.p});sv();render();toast("⭐ Favorilere eklendi")}
else if(d.fav!==undefined){const f=st.fav[+d.fav];(st.food[fd]=st.food[fd]||[]).push({n:f.n,k:f.k,p:f.p});sv();render();toast("＋ "+f.n)}
else if(d.fr!==undefined){st.fav.splice(+d.fr,1);sv();render()}
else if(d.cp){const y=st.food[sh(fd,-1)]||[];if(y.length){(st.food[fd]=st.food[fd]||[]).push(...y.map(x=>Object.assign({},x)));sv();render();toast("📋 Öğünler kopyalandı")}}
else if(d.th){try{localStorage.setItem("fit_theme",d.th)}catch(x){}applyTheme(d.th);render()}
else if(d.cpy){const ta=document.getElementById("bk"),m=document.getElementById("bkm"),fb=()=>{ta.select();ta.setSelectionRange(0,9999999);m.textContent="Metin seçildi, iPhone’da Kopyala’ya dokun."};try{navigator.clipboard.writeText(ta.value).then(()=>{m.textContent="Kopyalandı ✅"}).catch(fb)}catch(x){fb()}}
else if(d.rst){const m=document.getElementById("rsm"),v=$v("rs").trim();if(!v){m.textContent="Önce yedek metnini yapıştır.";return}if(!rsc){rsc=true;rsv=v;render();return}try{const o=JSON.parse(rsv);if(!o||typeof o!="object"||!o.start)throw 0;Object.keys(st).forEach(k=>delete st[k]);Object.assign(st,o);fix();WK=wk(td());rw=WK;sv();rsc=false;rsv="";render();toast("✅ Veriler geri yüklendi")}catch(x){rsc=false;render();document.getElementById("rsm").textContent="Yedek metni geçersiz görünüyor."}}
else if(d.rem){const t_=$v("rmt")||"18:00",on=!(st.rem&&st.rem.on);st.rem={on,t:t_};sv();FX.setReminder(on,t_).then(ok=>{if(on&&ok===false){st.rem.on=false;sv();render();toast("Bildirim izni verilmedi")}});render();toast(on?"🔔 Hatırlatıcı "+t_+" için açıldı":"Hatırlatıcı kapatıldı")}
else if(d.wipe){if(!wpc){wpc=true;render();return}wpc=false;try{["fit2","fit_bd","fit_ss"].forEach(k=>localStorage.removeItem(k))}catch(x){}Object.keys(st).forEach(k=>delete st[k]);fix();if(sess)st._uid=sess.user.id;ss=null;tab="h";WK=wk(td());sv();FX.setReminder(false);render();toast("Tüm veriler silindi")}
else if(d.celx){const c=document.getElementById("cel");c&&c.remove();clearTimeout(bt);bt=setTimeout(chkBadges,300)}
else if(d.ob){const a=d.ob.split(":");if(a[0]=="prog")ob.prog=a[1]=="1";else ob[a[0]]=a[0]=="days"?+a[1]:a[1];ob.err="";render()}
else if(d.obf){obFin()}
else if(d.obs){st.prof={skip:1,d:td()};sv();render()}
else if(d.obr){if(st.prof&&st.prof.age){const p=st.prof;ob.name=p.name||"";ob.g=p.g;ob.age=String(p.age);ob.h=String(p.h);ob.kg=String(p.kg);ob.goal=p.goal;ob.days=p.days;ob.lvl=p.lvl}ob.prog=null;ob.err="";st.prof=null;sv();render();window.scrollTo(0,0)}
else if(d.fadd!==undefined){const x=FOODS[+d.fadd],m=Math.max(.1,parseFloat($v("fqm"))||1);(st.food[fd]=st.food[fd]||[]).push({n:x.n+" ("+(m!=1?"×"+m+" ":"")+x.u+")",k:Math.round(x.k*m),p:Math.round(x.p*m)});sv();render();toast("＋ "+x.n)}
else if(d.swo){ss.swo=ss.swo?0:1;saveS();render()}
else if(d.swp!==undefined){const a=LB[+d.swp],o=sE()[ss.i],c1=!a.rest,c0=!o.rest,same=c1===c0,nx=Object.assign(X(a.n,same?o.s:(c1?1:3),same?o.r:(c1?"20 dk":"8-12"),a.rest,a.q,"Kontrollü yap, tam hareket açıklığı, 1-2 tekrar depoda bırak."),{p:a.p,x:a.x||"",sw:1});sE()[ss.i]=nx;ss.log[ss.i]=Array.from({length:nx.s},()=>({kg:"",r:"",q:"",ok:false}));ss.swo=0;saveS();render();toast("🔄 "+a.n)}
else if(d.to){tab=d.to;render();window.scrollTo(0,0)}
else if(d.go!==undefined){tab="w";day=+d.go;render();window.scrollTo(0,0)}
else if(d.rg){rg=d.rg;render()}
else if(d.pd!==undefined){const i=+d.pd;if(pdc===i){st.progs.splice(i,1);if(day>=4)day=0;pdc=null;sv()}else pdc=i;render()}
else if(d.q!==undefined){coach(QS[+d.q])}
else if(d.ask){coach($v("cq"))}
else if(d.st!==undefined){startS(+d.st)}
else if(d.sx){if(ss.xc)endS();else{ss.xc=1;render()}}
else if(d.sb){ss.swo=0;ss.i=Math.max(0,ss.i-1);ss.xc=0;saveS();render();window.scrollTo(0,0)}
else if(d.sn){ss.xc=0;ss.swo=0;if(ss.i<sE().length-1){ss.i++;saveS();render();window.scrollTo(0,0)}else finS()}
else if(d.sd!==undefined){const s=ss.log[ss.i][+d.sd];s.ok=!s.ok;saveS();t.textContent=s.ok?"✓":"Bitti";t.classList.toggle("on",s.ok);if(s.ok){const x=sE()[ss.i];if(x.rest)startRest(x.rest)}}
else if(d.sc){endS();tab=d.sc;render()}
else if(d.hd!==undefined){e.preventDefault();const i=+d.hd;if(hdc===i){st.hist.splice(i,1);hdc=null;sv()}else hdc=i;render()}
else if(d.wz){const a=d.wz.split(":");wz[a[0]]=a[0]=="days"?+a[1]:a[1];wz.res=null;wz.txt="";render()}
else if(d.wg){wz.res=gen(wz);wz.txt="";render()}
else if(d.wc){wizAi()}
else if(d.fin){const ix=st.done.findIndex(x=>x.d==td()&&x.day==dk());if(ix>=0)st.done.splice(ix,1);else st.done.push({d:td(),day:dk()});sv();render();window.scrollTo(0,0);toast(ix>=0?"Kayıt geri alındı":"✅ Antrenman kaydedildi! Bu hafta "+cnt(WK)+"/4")}
else if(d.bs){const o={d:td()};let any=false;BM.forEach(x=>{const v=parseFloat($v("m_"+x[0]));if(v){o[x[0]]=v;any=true}});if(any){st.body.push(o);sv();render();toast("✅ Ölçüm kaydedildi")}else toast("En az bir ölçü gir")}
else if(d.fc){calc()}
else if(d.fn){const n=sh(fd,+d.fn);if(n<=td()){fd=n;ei=null;render()}}
else if(d.fe!==undefined){e.preventDefault();ei=+d.fe;render();const x=document.getElementById("fk");x&&x.scrollIntoView({block:"center"})}
else if(d.fx){ei=null;render()}
else if(d.fa){const k=parseInt($v("fk"))||0,p=parseInt($v("fp"))||0;if(k||p){const L=st.food[fd]=st.food[fd]||[],o={n:$v("fn"),k,p};if(ei!=null&&L[ei])L[ei]=o;else L.push(o);ei=null;sv();render()}else toast("Kalori veya protein gir")}
else if(d.fd!==undefined){e.preventDefault();st.food[fd].splice(+d.fd,1);ei=null;sv();render()}
else if(d.ts){st.t={k:parseInt($v("tk"))||0,p:parseInt($v("tp"))||0};sv();render()}
else if(d.sp){const v=parseInt($v("stp"));if(v>=0){st.steps[td()]=v;sv();render();toast("🚶 Adım güncellendi")}else toast("Adım sayısını gir")}
else if(t.id=="tx"){FX.cancelRest();clearInterval(iv);document.getElementById("tb").classList.remove("on")}});
const $v=i=>document.getElementById(i).value;
document.addEventListener("input",e=>{if(e.target.dataset.k){st.w[e.target.dataset.k]=e.target.value;sv()}});
render();


(function boot(){const sp=document.getElementById("splash"),t0=Date.now();let hid=false;const hide=()=>{if(hid)return;hid=true;setTimeout(()=>{sp&&sp.classList.add("out");FX.hideSplash();setTimeout(()=>sp&&sp.remove(),600)},Math.max(0,450-(Date.now()-t0)))};
accountBoot(hide);setTimeout(hide,3000);
if(st.rem&&st.rem.on)FX.setReminder(true,st.rem.t);if(ss&&!ss.fin){clearInterval(ti);ti=setInterval(tickS,1000)}})();
