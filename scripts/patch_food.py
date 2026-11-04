p="www/app.js";s=open(p,encoding="utf-8").read()
def rep(a,b):
    global s
    if s.count(a)!=1: raise SystemExit(f"MISS {s.count(a)}: {a[:90]!r}")
    s=s.replace(a,b)
MORE='''Yumurta sarısı|1 adet|55|3
Haşlanmış yumurta beyazı omlet|3 yumurta akı|52|11
Sucuklu yumurta|1 porsiyon (2 yumurta)|340|19
Sucuk|30 g|140|6
Pastırma|30 g|75|9
Hindi füme|30 g|35|6
Salam|30 g|90|4
Sosis|1 adet (50 g)|130|5
Tavuk şiş|1 porsiyon (200 g)|330|50
Tavuk sote|1 porsiyon (250 g)|300|35
Izgara tavuk kanat|100 g|210|25
Tavuk döner (porsiyon)|1 porsiyon (150 g)|310|30
Et döner (porsiyon)|1 porsiyon (150 g)|370|28
Adana kebap|1 porsiyon (180 g)|520|34
Urfa kebap|1 porsiyon (180 g)|500|34
İskender|1 porsiyon|750|40
Kuzu pirzola|100 g|290|24
Kıymalı makarna|1 porsiyon (250 g)|420|20
Etli nohut|1 porsiyon (250 g)|330|20
Etli kuru fasulye|1 porsiyon (250 g)|330|19
Taze fasulye (zeytinyağlı)|1 porsiyon (200 g)|140|4
Karnıyarık|1 porsiyon|320|12
İmam bayıldı|1 porsiyon|260|4
Dolma (zeytinyağlı)|5 adet|220|4
Sarma (zeytinyağlı)|5 adet|200|4
Türlü|1 porsiyon (250 g)|180|5
Ispanak yemeği|1 porsiyon (200 g)|150|7
Pırasa (zeytinyağlı)|1 porsiyon (200 g)|160|3
Mücver|2 adet|200|7
Patates kızartması|1 porsiyon (150 g)|420|5
Patates püresi|1 porsiyon (200 g)|210|4
Fırın patates|1 porsiyon (200 g)|190|4
Ezogelin çorbası|1 kase (250 ml)|170|8
Tavuk çorbası|1 kase (250 ml)|130|9
Domates çorbası|1 kase (250 ml)|130|3
Yayla çorbası|1 kase (250 ml)|150|6
İşkembe çorbası|1 kase (250 ml)|190|13
Kısır|1 porsiyon (150 g)|230|5
Çoban salata|1 porsiyon (200 g)|110|2
Mevsim salata|1 porsiyon (200 g)|90|2
Ton balıklı salata|1 porsiyon|280|25
Sezar salata|1 porsiyon|380|20
Cacık|1 kase (200 g)|110|6
Haydari|2 yemek kaşığı|70|3
Pide (kaşarlı)|1 adet|650|26
Pide (kıymalı)|1 adet|700|33
Kumpir|1 adet|750|20
Börek (peynirli)|1 dilim (120 g)|360|12
Su böreği|1 dilim (150 g)|420|16
Gözleme (peynirli)|1 adet|450|17
Açma|1 adet|300|6
Kruvasan|1 adet|270|5
Bazlama|1 adet|300|9
Lavaş|1 adet|170|5
Tortilla|1 adet|140|4
Ekmek (çavdar)|1 dilim (30 g)|70|3
Ekmek (kepekli)|1 dilim (30 g)|70|4
Galeta|5 adet|90|3
Pirinç (haşlanmış)|100 g|130|3
Bulgur (haşlanmış)|100 g|85|3
Makarna (kuru)|100 g|360|12
Erişte|1 porsiyon (150 g)|240|8
Kinoa (pişmiş)|100 g|120|4
Mısır gevreği|40 g|150|3
Müsli|50 g|190|5
Yulaf lapası (sütlü)|1 kase|260|11
Pankek|2 adet|230|6
Tost ekmeği|1 dilim|75|2
Kaşarlı tost|1 adet|300|13
Kavurmalı tost|1 adet|380|18
Hamburger köftesi|1 adet (100 g)|250|18
Pizza (karışık)|1 dilim|300|13
Lahmacun (dürüm)|1 adet|280|13
Çiğ köfte dürüm|1 adet|330|8
Falafel|5 adet|330|13
Cips|1 paket (40 g)|210|3
Kraker|5 adet|80|2
Bisküvi|3 adet|130|2
Gofret|1 adet|170|2
Sütlü çikolata|30 g|160|2
Lokum|2 adet|90|0
Helva|50 g|250|6
Künefe|1 porsiyon|560|12
Kek|1 dilim|250|4
Pasta (yaş)|1 dilim|350|5
Kazandibi|1 kase|230|6
Profiterol|1 porsiyon|400|7
Puding|1 kase|180|5
Tahin|1 yemek kaşığı|90|3
Pekmez|1 yemek kaşığı|60|0
Tahin pekmez|2 yemek kaşığı|150|3
Reçel|1 yemek kaşığı|50|0
Nutella|1 yemek kaşığı (20 g)|110|1
Krem peynir|1 yemek kaşığı (30 g)|70|2
Labne|2 yemek kaşığı (30 g)|60|2
Tulum peyniri|30 g|110|7
Lor (light)|100 g|80|12
Mozzarella|30 g|85|6
Cottage peyniri|100 g|98|11
Skyr / yüksek proteinli yoğurt|1 kutu (150 g)|90|15
Protein puding|1 kutu|160|20
Protein shake (sütle)|1 bardak|250|32
Süt (tam yağlı)|1 bardak (200 ml)|125|7
Süt (light)|1 bardak (200 ml)|70|7
Laktozsuz süt|1 bardak (200 ml)|95|7
Badem sütü|1 bardak (200 ml)|30|1
Latte|1 bardak (300 ml)|190|10
Cappuccino|1 bardak (250 ml)|120|6
Filtre kahve|1 kupa|5|0
Americano|1 kupa|10|0
Sahlep|1 bardak|200|5
Portakal suyu (taze)|1 bardak (200 ml)|90|1
Limonata|1 bardak (250 ml)|110|0
Enerji içeceği|250 ml|110|0
Soda|200 ml|0|0
Bira|330 ml|140|1
Şarap|1 kadeh (150 ml)|125|0
Rakı|1 kadeh (50 ml)|130|0
Mandalina|1 adet|45|1
Armut|1 adet|100|1
Şeftali|1 adet|60|1
Kayısı|3 adet|50|1
Erik|5 adet|60|1
Kiraz|100 g|63|1
Karpuz|1 dilim (300 g)|90|2
Kavun|1 dilim (250 g)|85|2
Ananas|100 g|50|1
Kivi|1 adet|45|1
Nar|yarım adet|70|1
İncir|2 adet|75|1
Hurma|3 adet|70|1
Kuru üzüm|30 g|90|1
Kuru kayısı|5 adet|85|1
Yaban mersini|100 g|57|1
Domates|1 orta|22|1
Salatalık|1 orta|30|1
Biber|1 adet|20|1
Havuç|1 orta|25|1
Brokoli (haşlanmış)|100 g|35|3
Mantar|100 g|22|3
Mısır (haşlanmış)|1 koçan|90|3
Bezelye|100 g|80|5
Edamame|100 g|120|11
Kaju|30 g|165|5
Antep fıstığı|30 g|170|6
Yer fıstığı|30 g|170|7
Leblebi|30 g|110|6
Ay çekirdeği|30 g|170|6
Kabak çekirdeği|30 g|160|9
Chia tohumu|1 yemek kaşığı|60|2
Keten tohumu|1 yemek kaşığı|55|2
Kreatin|5 g|0|0
BCAA|1 ölçek|10|0
Mayonez|1 yemek kaşığı|95|0
Ketçap|1 yemek kaşığı|20|0
Şeker|1 çay kaşığı|16|0
Uskumru (ızgara)|100 g|260|24
Hamsi (tava)|1 porsiyon (150 g)|330|25
Karides|100 g|100|20
Midye dolma|5 adet|200|7
Sardalya (konserve)|1 kutu|190|23
Tofu|100 g|80|9'''
rep('''Meyve suyu|200 ml|90|1`.split("\\n")''','''Meyve suyu|200 ml|90|1
'''+MORE+'''`.split("\\n")''')
# local parser
rep('''async function calc(){const v=$v("ft").trim(),m=document.getElementById("fm");if(!v){m.textContent="Önce ne yediğini yaz.";return}
m.textContent="Hesaplanıyor… (10-20 sn sürebilir)";''',r'''/* Free, offline food parser: "2 yumurta, 1 dilim ekmek, 150 g tavuk" → items from FOODS */
const trl=t=>String(t).toLocaleLowerCase("tr-TR").replace(/[’'`]/g,"");
const NUMW={"yarım":.5,"bir":1,"iki":2,"üç":3,"dört":4,"beş":5,"altı":6,"yedi":7,"sekiz":8,"dokuz":9,"on":10,"çeyrek":.25,"buçuk":.5};
const UNITW=/^(adet|tane|dilim|kase|porsiyon|bardak|kupa|fincan|kaşık|kaşığı|yemek|tatlı|çay|avuç|top|kutu|paket|ölçek|şişe|kadeh|koçan|tabak|parça|orta|büyük|küçük|tam|dolu)$/;
const STOP=new Set(["ve","ile","bir","az","biraz","çok","yanında","üstüne","tane","adet","pişmiş","porsiyon","dilim","kase","bardak"]);
let _fidx=null;
const fidx=()=>_fidx||(_fidx=FOODS.map((f,i)=>{const main=trl(f.n.replace(/\(.*?\)/g," ")).split(/[^a-zçğıöşü0-9]+/).filter(w=>w.length>1),all=trl(f.n).split(/[^a-zçğıöşü0-9]+/).filter(w=>w.length>1),u=trl(f.u),g=(u.match(/(\d+(?:[.,]\d+)?)\s*(g|ml)\b/)||[]),c=(u.match(/^(\d+(?:[.,]\d+)?)/)||[])[1];
return{f,i,main,all,gram:g[1]?+g[1].replace(",","."):null,count:/^yarım/.test(u)?.5:c?+c.replace(",","."):1,pure:/^\d+\s*(g|ml)$/.test(u.trim())}}));
const wm=(w,t)=>w===t||w.startsWith(t)||(t.length>=5&&w.startsWith(t.slice(0,-1)))||(w.length>=4&&t.startsWith(w));
function parseItem(raw){let t=" "+trl(raw).replace(/(\d),(\d)/g,"$1.$2")+" ",qty=null,unit="n",m;
if((m=t.match(/(\d+(?:\.\d+)?)\s*(kg|g|gr|gram|ml|l|lt|litre)\b/))){qty=+m[1];unit=m[2];if(unit=="kg"){qty*=1000;unit="g"}else if(/^(l|lt|litre)$/.test(unit)){qty*=1000;unit="ml"}else if(unit!="ml")unit="g";t=t.replace(m[0]," ")}
else if((m=t.match(/(\d+(?:\.\d+)?)/))){qty=+m[1];t=t.replace(m[0]," ");if(/\bbuçuk\b/.test(t))qty+=.5}
else{for(const k in NUMW){if(new RegExp("(^|\\s)"+k+"(\\s|$)").test(t)&&k!="buçuk"){qty=NUMW[k];t=t.replace(new RegExp("(^|\\s)"+k+"(\\s|$)")," ");break}}}
const words=t.split(/[^a-zçğıöşü0-9]+/).filter(w=>w.length>1&&!STOP.has(w)&&!UNITW.test(w));if(!words.length)return null;
let best=null,bs=0;fidx().forEach(o=>{if(!o.main.length||!words.some(w=>wm(w,o.main[0])))return;let sc=2;o.all.slice(1).forEach(tk=>{if(words.some(w=>wm(w,tk)))sc+=1});o.main.slice(1).forEach(tk=>{if(!words.some(w=>wm(w,tk)))sc-=.6});if(sc>bs){bs=sc;best=o}});
if(!best)return{miss:raw.trim()};
let mult=1,lbl=best.f.u;if(qty!=null){if(unit!="n"&&best.gram){mult=qty/best.gram;lbl=qty+" "+(unit=="ml"?"ml":"g")}else if(unit!="n"){mult=qty/100;lbl=qty+" "+unit}else{mult=best.pure?qty:qty/best.count;lbl=best.pure?qty+" × "+best.f.u:qty+" "+best.f.u.replace(/^(\d+(?:[.,]\d+)?|yarım)\s*/,"")}}
return{item:{n:best.f.n+" · "+lbl,k:Math.round(best.f.k*mult),p:Math.round(best.f.p*mult)}}}
function localFood(v){const parts=v.split(/,|;|\n|\+|\s+ve\s+|\s+ile\s+/i).map(x=>x.trim()).filter(Boolean),items=[],miss=[];parts.forEach(x=>{const r=parseItem(x);if(!r)return;r.item?items.push(r.item):miss.push(r.miss)});return{items,miss}}
async function calc(){const v=$v("ft").trim(),m=document.getElementById("fm");if(!v){m.textContent="Önce ne yediğini yaz.";return}
const loc=localFood(v),addAll=(a,extra)=>{(st.food[fd]=st.food[fd]||[]).push(...a);sv();render();const m2=document.getElementById("fm");if(m2)m2.innerHTML="✅ Eklendi: "+esc(a.map(x=>x.n+" ("+x.k+" kcal, "+x.p+" g)").join(", "))+(extra?"<br>"+extra:"")};
if(loc.items.length&&!loc.miss.length){addAll(loc.items);return}
const missTxt=loc.miss.length?"Tanınmayan: <b>"+esc(loc.miss.join(", "))+"</b>. Bunları “Hızlı ara”dan seçebilir veya elle ekleyebilirsin.":"";
const canAi=(SB&&sess)||(window.claude&&window.claude.use);
if(!canAi){if(loc.items.length)addAll(loc.items,missTxt);else m.innerHTML="Tanıyamadım: <b>"+esc(loc.miss.join(", "))+"</b>. “Hızlı ara”dan seçebilir veya elle ekleyebilirsin.";return}
const vAi=loc.miss.join(", ");
m.textContent="Hesaplanıyor…";''')
rep('''Liste: ${v}`,"food",v);''','''Liste: ${vAi}`,"food",vAi);''')
rep('''if(!a.length){m.textContent="Anlayamadım, biraz daha net yazar mısın?";return}
(st.food[fd]=st.food[fd]||[]).push(...a);sv();render();const m2=document.getElementById("fm");if(m2)m2.textContent="✅ Eklendi: "+a.map(x=>x.n+" ("+x.k+" kcal, "+x.p+" g)").join(", ")}
catch(e){m.textContent="Hesaplanamadı ("+er(e)+"). Hızlı aramadan veya elle ekleyebilirsin."}}''','''if(!a.length&&!loc.items.length){m.textContent="Anlayamadım, biraz daha net yazar mısın?";return}
addAll(loc.items.concat(a))}
catch(e){if(loc.items.length)addAll(loc.items,missTxt);else m.innerHTML="Tanıyamadım: <b>"+esc(loc.miss.join(", "))+"</b>. “Hızlı ara”dan seçebilir veya elle ekleyebilirsin."}}''')
rep('''<div class="tip" id="fm">Yazdıklarının kalori ve proteinini tahmin eder. Değerler yaklaşıktır, porsiyonu yazarsan daha doğru olur.''','''<div class="tip" id="fm">Virgülle ayırarak yaz: <b>2 yumurta, 1 dilim ekmek, 150 g tavuk</b>. Uygulama 230'dan fazla yiyeceği kendi tanır (internetsiz, ücretsiz). Değerler yaklaşıktır.''')
open(p,"w",encoding="utf-8").write(s);print("food ok")
