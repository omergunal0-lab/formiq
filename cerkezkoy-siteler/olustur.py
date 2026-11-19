#!/usr/bin/env python3
"""Çerkezköy işletmeleri için tanıtım (demo) siteleri ve teklif panosu üretir.

Çalıştır:  python3 cerkezkoy-siteler/olustur.py
Çıktı:     cerkezkoy-siteler/<slug>/index.html  ve  cerkezkoy-siteler/index.html
"""
import html
import json
import pathlib
import urllib.parse

KOK = pathlib.Path(__file__).parent
FIYAT = "15.000 TL"
BAKIM = "1.000 TL"

ISLETMELER = [
    {
        "slug": "mc-doner",
        "ad": "MC Döner",
        "alt": "Çerkezköy",
        "tur": "Döner Restoranı",
        "yorum": "635+", "puan": "4,4",
        "tel": "+90 282 726 50 51",
        "whatsapp": None,
        "adres": "Atatürk Cad. No:57/1, Çerkezköy / Tekirdağ",
        "instagram": "mcdoner.cerkezkoy",
        "slogan": "Her gün taze, her lokmada usta işi.",
        "hakkinda": "Çerkezköy'ün en çok konuşulan dönercisi. Günlük hazırlanan et ve tavuk döner, "
                    "çıtır ekmek ve hızlı servisle öğle arasından gece yarısına kadar yanınızda.",
        "menu": [("Et Döner Dürüm", "Lavaş, közlenmiş biber, domates"),
                 ("Tavuk Döner Porsiyon", "Pilav, patates, turşu"),
                 ("İskender", "Tereyağı, yoğurt, domates sosu"),
                 ("Döner Ekmek Arası", "Yarım ve tam ekmek seçeneği"),
                 ("Pilav Üstü Döner", "Tereyağlı pirinç pilavı"),
                 ("Ayran & İçecekler", "Açık ayran, şalgam, meşrubat")],
        "tema": {"bg": "#14110f", "yuzey": "#1f1a17", "yazi": "#f6efe8", "soluk": "#b9ab9d",
                 "vurgu": "#e2382b", "vurgu2": "#f2a541", "baslik": "'Bebas Neue', sans-serif",
                 "govde": "'Inter', sans-serif", "font": "Bebas+Neue&family=Inter:wght@400;600;700",
                 "koyu": True, "desen": "cizgi"},
    },
    {
        "slug": "safinaz-doner",
        "ad": "Safinaz Döner",
        "alt": "Fast Food & Döner",
        "tur": "Döner & Fast Food",
        "yorum": "445+", "puan": "4,3",
        "tel": "+90 282 726 31 41",
        "whatsapp": None,
        "adres": "Gazi Osman Paşa Mah., Atatürk Cad. No:97, Çerkezköy / Tekirdağ",
        "instagram": None,
        "slogan": "Atatürk Caddesi'nin bildik lezzeti.",
        "hakkinda": "Yıllardır aynı caddede, aynı tarifle. Döner, hamburger ve tost çeşitleriyle "
                    "hem hızlı bir öğle yemeği hem de akşam paket servisi için Çerkezköy'ün tercihi.",
        "menu": [("Et Döner", "Porsiyon, dürüm veya ekmek arası"),
                 ("Tavuk Döner", "Özel soslu, bol garnitürlü"),
                 ("Hamburger", "Patates kızartmasıyla"),
                 ("Karışık Tost", "Sucuk, kaşar, domates"),
                 ("Patates Kızartması", "Küçük ve büyük boy"),
                 ("Paket Servis", "Telefonla sipariş verin, kapınıza gelsin")],
        "tema": {"bg": "#fff8ef", "yuzey": "#ffffff", "yazi": "#2a1d14", "soluk": "#7a6553",
                 "vurgu": "#d9480f", "vurgu2": "#f59f00", "baslik": "'Fraunces', serif",
                 "govde": "'Inter', sans-serif", "font": "Fraunces:opsz,wght@9..144,600;9..144,800&family=Inter:wght@400;600",
                 "koyu": False, "desen": "nokta"},
    },
    {
        "slug": "yeni-kardelen",
        "ad": "Yeni Kardelen",
        "alt": "Pide · Lahmacun · Döner",
        "tur": "Pide & Lahmacun Salonu",
        "yorum": "265+", "puan": "4,3",
        "tel": "+90 282 726 82 13",
        "whatsapp": None,
        "adres": "Çerkezköy / Tekirdağ",
        "instagram": None,
        "slogan": "Taş fırından çıkan sıcak pide, ince açılmış lahmacun.",
        "hakkinda": "Hamuru her sabah yeniden açılır, fırın gün boyu sönmez. Aileler için geniş "
                    "salonumuz ve hızlı paket servisimizle Çerkezköy'de pide denince akla gelen adres.",
        "menu": [("Kıymalı Pide", "Elle çekilmiş kıyma, taze sebze"),
                 ("Kuşbaşılı Pide", "Tereyağıyla fırından"),
                 ("Kaşarlı Yumurtalı", "Klasik ve doyurucu"),
                 ("Lahmacun", "İnce hamur, bol maydanoz ve limon"),
                 ("Döner Porsiyon", "Pilav ve közlenmiş sebze"),
                 ("Künefe", "Tatlı arası için")],
        "tema": {"bg": "#f4efe3", "yuzey": "#fffdf7", "yazi": "#1d2a22", "soluk": "#5f6b5f",
                 "vurgu": "#1f6f4a", "vurgu2": "#c98a2b", "baslik": "'Playfair Display', serif",
                 "govde": "'Inter', sans-serif", "font": "Playfair+Display:wght@600;800&family=Inter:wght@400;600",
                 "koyu": False, "desen": "dalga"},
    },
    {
        "slug": "filozof-coffee",
        "ad": "Filozof",
        "alt": "Coffee & Shop",
        "tur": "Kafe",
        "yorum": "245+", "puan": "4,4",
        "tel": "+90 538 350 34 34",
        "whatsapp": "905383503434",
        "adres": "Gazi Osman Paşa Mah., Beyazsu Sk. No:60, Çerkezköy / Tekirdağ",
        "instagram": None,
        "slogan": "Bir fincan kahve, biraz da düşünce.",
        "hakkinda": "Kitap raflarının arasında demlenen kahveler, ev yapımı tatlılar ve sakin bir köşe. "
                    "Ders çalışmak, sohbet etmek ya da sadece durup düşünmek için Çerkezköy'ün kafesi.",
        "menu": [("Filtre Kahve", "Günün çekirdeğiyle"),
                 ("Latte & Cappuccino", "Süt seçenekleriyle"),
                 ("Türk Kahvesi", "Lokumuyla"),
                 ("Cheesecake", "Ev yapımı, günlük"),
                 ("Soğuk İçecekler", "Iced latte, limonata"),
                 ("Kahve Çekirdeği", "Evinize götürün")],
        "tema": {"bg": "#f3ede4", "yuzey": "#fbf8f3", "yazi": "#2b211b", "soluk": "#6e5f53",
                 "vurgu": "#6b3e26", "vurgu2": "#b08150", "baslik": "'Cormorant Garamond', serif",
                 "govde": "'Inter', sans-serif", "font": "Cormorant+Garamond:ital,wght@0,600;1,500&family=Inter:wght@400;600",
                 "koyu": False, "desen": "nokta"},
    },
    {
        "slug": "hk-bistro",
        "ad": "HK Bistro",
        "alt": "Kahvaltı & Mutfak",
        "tur": "Bistro / Kahvaltı",
        "yorum": "210+", "puan": "4,4",
        "tel": "+90 532 203 12 60",
        "whatsapp": "905322031260",
        "adres": "Namık Kemal Blv. No:9-11, Çerkezköy / Tekirdağ",
        "instagram": None,
        "slogan": "Sakin bir sabah, taze bir sofra.",
        "hakkinda": "Köy ürünleriyle hazırlanan serpme kahvaltı, gün boyu sıcak yemekler ve huzurlu bir ortam. "
                    "Hafta sonu kahvaltıları için rezervasyon önerilir.",
        "menu": [("Serpme Kahvaltı", "2 kişilik ve üzeri"),
                 ("Kahvaltı Tabağı", "Tek kişilik"),
                 ("Menemen & Sahanda", "Tereyağında"),
                 ("Makarna Çeşitleri", "Gün boyu"),
                 ("Izgara Tavuk", "Mevsim salata ile"),
                 ("Tatlı & Kahve", "Ev yapımı")],
        "tema": {"bg": "#f1f3ec", "yuzey": "#ffffff", "yazi": "#1f2a24", "soluk": "#5d6a61",
                 "vurgu": "#3e6b4f", "vurgu2": "#d39b4a", "baslik": "'DM Serif Display', serif",
                 "govde": "'Inter', sans-serif", "font": "DM+Serif+Display&family=Inter:wght@400;600",
                 "koyu": False, "desen": "dalga"},
    },
    {
        "slug": "nihat-basar-kuafor",
        "ad": "Nihat Başar",
        "alt": "Erkek Kuaförü",
        "tur": "Erkek Kuaförü",
        "yorum": "80+", "puan": "4,6",
        "tel": "+90 543 242 31 35",
        "whatsapp": "905432423135",
        "adres": "Çerkezköy / Tekirdağ",
        "instagram": None,
        "slogan": "Keskin hatlar, temiz iş.",
        "hakkinda": "Saç kesimi, sakal tasarımı ve bakım hizmetleriyle Çerkezköy'de güvenilir erkek kuaförü. "
                    "Beklemeden gelmek için WhatsApp'tan randevu alın.",
        "menu": [("Saç Kesimi", "Klasik ve modern kesimler"),
                 ("Sakal Tıraşı & Tasarım", "Ustura ile"),
                 ("Saç + Sakal", "Komple bakım"),
                 ("Çocuk Saç Kesimi", "Sabırla, özenle"),
                 ("Cilt Bakımı", "Maske ve buhar"),
                 ("Damat Tıraşı", "Özel gün paketi")],
        "tema": {"bg": "#0f0f10", "yuzey": "#19191b", "yazi": "#f2efe9", "soluk": "#a8a29a",
                 "vurgu": "#c9a24b", "vurgu2": "#e8d5a3", "baslik": "'Oswald', sans-serif",
                 "govde": "'Inter', sans-serif", "font": "Oswald:wght@500;700&family=Inter:wght@400;600",
                 "koyu": True, "desen": "cizgi"},
    },
]

DESENLER = {
    "cizgi": "repeating-linear-gradient(135deg, color-mix(in srgb, var(--vurgu) 10%, transparent) 0 2px, transparent 2px 22px)",
    "nokta": "radial-gradient(color-mix(in srgb, var(--vurgu) 18%, transparent) 1.2px, transparent 1.4px) 0 0/18px 18px",
    "dalga": "radial-gradient(circle at 100% 50%, transparent 20%, color-mix(in srgb, var(--vurgu) 9%, transparent) 21%, color-mix(in srgb, var(--vurgu) 9%, transparent) 34%, transparent 35%) 0 0/36px 36px",
}

e = html.escape


def site(b):
    t = b["tema"]
    tel_ham = b["tel"].replace(" ", "")
    wa = b["whatsapp"]
    harita = "https://maps.google.com/maps?q=" + urllib.parse.quote(f'{b["ad"]} {b["alt"]} {b["adres"]}') + "&output=embed"
    menu = "\n".join(
        f'<li><span class="no">{i+1:02d}</span><div><h3>{e(a)}</h3><p>{e(d)}</p></div></li>'
        for i, (a, d) in enumerate(b["menu"]))
    wa_btn = (f'<a class="btn ikincil" href="https://wa.me/{wa}">WhatsApp</a>' if wa else "")
    ig = (f'<a href="https://instagram.com/{b["instagram"]}">@{e(b["instagram"])}</a>' if b["instagram"] else "")
    return f"""<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(b["ad"])} {e(b["alt"])} | Çerkezköy</title>
<meta name="description" content="{e(b["ad"])} – {e(b["tur"])}, Çerkezköy. {e(b["slogan"])}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family={t["font"]}&display=swap" rel="stylesheet">
<style>
:root {{
  --bg:{t["bg"]}; --yuzey:{t["yuzey"]}; --yazi:{t["yazi"]}; --soluk:{t["soluk"]};
  --vurgu:{t["vurgu"]}; --vurgu2:{t["vurgu2"]};
  --cizgi: color-mix(in srgb, var(--yazi) 12%, transparent);
}}
* {{ box-sizing:border-box; margin:0; padding:0 }}
html {{ scroll-behavior:smooth }}
body {{ background:var(--bg); color:var(--yazi); font-family:{t["govde"]}; line-height:1.6; -webkit-font-smoothing:antialiased }}
a {{ color:inherit }}
.kap {{ width:min(1120px, 100% - 32px); margin-inline:auto }}
h1,h2,h3 {{ font-family:{t["baslik"]}; line-height:1.05; font-weight:700 }}
.ust {{ position:sticky; top:0; z-index:5; background:color-mix(in srgb, var(--bg) 88%, transparent); backdrop-filter:blur(10px); border-bottom:1px solid var(--cizgi) }}
.ust .kap {{ display:flex; align-items:center; justify-content:space-between; height:64px; gap:16px }}
.logo {{ font-family:{t["baslik"]}; font-size:1.5rem; text-decoration:none; letter-spacing:.02em }}
.logo span {{ color:var(--vurgu) }}
.ust nav {{ display:flex; gap:22px; font-size:.92rem }}
.ust nav a {{ text-decoration:none; color:var(--soluk) }}
.ust nav a:hover {{ color:var(--yazi) }}
.btn {{ display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:14px 22px; border-radius:999px; background:var(--vurgu); color:#fff; font-weight:600; text-decoration:none; transition:transform .15s, box-shadow .15s }}
.btn:hover {{ transform:translateY(-2px); box-shadow:0 10px 24px -10px var(--vurgu) }}
.btn.ikincil {{ background:transparent; color:var(--yazi); border:1.5px solid var(--cizgi) }}
.hero {{ position:relative; overflow:hidden; padding:96px 0 88px; background:{DESENLER[t["desen"]]} }}
.hero::after {{ content:""; position:absolute; inset:auto -10% -40% auto; width:520px; aspect-ratio:1; border-radius:50%; background:radial-gradient(circle, color-mix(in srgb, var(--vurgu2) 35%, transparent), transparent 65%); pointer-events:none }}
.etiket {{ display:inline-flex; gap:8px; align-items:center; font-size:.85rem; font-weight:600; color:var(--vurgu); text-transform:uppercase; letter-spacing:.12em }}
.hero h1 {{ font-size:clamp(3rem, 9vw, 6.5rem); margin:14px 0 6px; max-width:12ch }}
.hero h1 em {{ font-style:normal; color:var(--vurgu) }}
.hero .alt {{ font-family:{t["baslik"]}; font-size:clamp(1.3rem, 3vw, 1.9rem); color:var(--soluk) }}
.hero p.slogan {{ font-size:1.15rem; max-width:46ch; margin:22px 0 32px; color:var(--soluk) }}
.eylem {{ display:flex; flex-wrap:wrap; gap:12px }}
.rozet {{ margin-top:40px; display:inline-flex; align-items:center; gap:14px; padding:12px 18px; border-radius:16px; background:var(--yuzey); border:1px solid var(--cizgi); position:relative; z-index:1 }}
.rozet b {{ font-size:1.6rem; font-family:{t["baslik"]} }}
.yildiz {{ color:var(--vurgu2); letter-spacing:2px }}
.rozet small {{ display:block; color:var(--soluk); font-size:.82rem }}
section {{ padding:88px 0 }}
.bolum-bas {{ display:flex; justify-content:space-between; align-items:end; gap:24px; margin-bottom:40px; flex-wrap:wrap }}
.bolum-bas h2 {{ font-size:clamp(2.2rem, 5vw, 3.4rem) }}
.bolum-bas p {{ color:var(--soluk); max-width:42ch }}
.hakkinda {{ background:var(--yuzey); border-block:1px solid var(--cizgi) }}
.hakkinda .kap {{ display:grid; grid-template-columns:1.1fr 1fr; gap:56px; align-items:center }}
.hakkinda p.buyuk {{ font-size:1.3rem; line-height:1.55 }}
.sayilar {{ display:grid; grid-template-columns:repeat(3, 1fr); gap:12px }}
.sayilar div {{ padding:22px 16px; border-radius:18px; background:var(--bg); border:1px solid var(--cizgi) }}
.sayilar b {{ display:block; font-family:{t["baslik"]}; font-size:2.2rem; color:var(--vurgu) }}
.sayilar span {{ font-size:.85rem; color:var(--soluk) }}
.menu {{ list-style:none; display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px }}
.menu li {{ display:flex; gap:16px; padding:24px; border-radius:20px; background:var(--yuzey); border:1px solid var(--cizgi); transition:border-color .2s }}
.menu li:hover {{ border-color:var(--vurgu) }}
.menu .no {{ font-family:{t["baslik"]}; font-size:1.4rem; color:var(--vurgu2) }}
.menu h3 {{ font-size:1.35rem; margin-bottom:4px }}
.menu p {{ color:var(--soluk); font-size:.95rem }}
.not {{ margin-top:18px; font-size:.85rem; color:var(--soluk) }}
.iletisim .kap {{ display:grid; grid-template-columns:1fr 1.2fr; gap:32px }}
.kart {{ padding:32px; border-radius:24px; background:var(--yuzey); border:1px solid var(--cizgi); display:flex; flex-direction:column; gap:22px }}
.kart dt {{ font-size:.8rem; text-transform:uppercase; letter-spacing:.1em; color:var(--soluk) }}
.kart dd {{ font-size:1.15rem; font-weight:600; margin-top:2px }}
.kart dd a {{ text-decoration:none }}
.harita {{ border-radius:24px; overflow:hidden; border:1px solid var(--cizgi); min-height:360px }}
.harita iframe {{ width:100%; height:100%; min-height:360px; border:0; {"filter:invert(.9) hue-rotate(180deg);" if t["koyu"] else ""} }}
footer {{ padding:32px 0 100px; border-top:1px solid var(--cizgi); color:var(--soluk); font-size:.85rem }}
footer .kap {{ display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap }}
.yuzen {{ position:fixed; right:16px; bottom:16px; z-index:9; display:none }}
.demo {{ position:fixed; left:16px; bottom:16px; z-index:9; font-size:.72rem; padding:6px 10px; border-radius:999px; background:var(--yazi); color:var(--bg); opacity:.75 }}
@media (max-width:820px) {{
  .ust nav {{ display:none }}
  .hero {{ padding:64px 0 56px }}
  section {{ padding:64px 0 }}
  .hakkinda .kap, .iletisim .kap {{ grid-template-columns:1fr; gap:32px }}
  .yuzen {{ display:inline-flex }}
  .demo {{ bottom:auto; top:72px }}
}}
</style>
</head>
<body>
<header class="ust"><div class="kap">
  <a class="logo" href="#">{e(b["ad"])}<span>.</span></a>
  <nav><a href="#hakkinda">Hakkımızda</a><a href="#menu">{"Hizmetler" if "Kuaför" in b["tur"] else "Menü"}</a><a href="#iletisim">İletişim</a></nav>
  <a class="btn" href="tel:{tel_ham}">Hemen Ara</a>
</div></header>

<main>
<section class="hero"><div class="kap">
  <span class="etiket">● {e(b["tur"])} · Çerkezköy</span>
  <h1>{e(b["ad"])}<em>.</em></h1>
  <div class="alt">{e(b["alt"])}</div>
  <p class="slogan">{e(b["slogan"])}</p>
  <div class="eylem">
    <a class="btn" href="tel:{tel_ham}">{"Randevu Al" if "Kuaför" in b["tur"] else "Sipariş / Rezervasyon"}</a>
    {wa_btn}
    <a class="btn ikincil" href="#iletisim">Yol Tarifi</a>
  </div>
  <div class="rozet"><b>{b["puan"]}</b><div><span class="yildiz">★★★★★</span><small>Google'da {b["yorum"]} değerlendirme</small></div></div>
</div></section>

<section class="hakkinda" id="hakkinda"><div class="kap">
  <div>
    <span class="etiket">Hakkımızda</span>
    <h2 style="font-size:clamp(2rem,4.5vw,3rem);margin:12px 0 18px">Çerkezköy'ün sevdiği adres</h2>
    <p class="buyuk">{e(b["hakkinda"])}</p>
  </div>
  <div class="sayilar">
    <div><b>{b["puan"]}</b><span>Google puanı</span></div>
    <div><b>{b["yorum"]}</b><span>Müşteri yorumu</span></div>
    <div><b>7/24</b><span>Online erişim</span></div>
  </div>
</div></section>

<section id="menu"><div class="kap">
  <div class="bolum-bas"><h2>{"Hizmetlerimiz" if "Kuaför" in b["tur"] else "Öne Çıkanlar"}</h2><p>{"Fiyat bilgisi ve uygun saatler için bizi arayın." if "Kuaför" in b["tur"] else "Günlük taze hazırlanan lezzetlerimizden bir seçki."}</p></div>
  <ul class="menu">{menu}</ul>
  <p class="not">Güncel {"hizmet listesi" if "Kuaför" in b["tur"] else "menü ve fiyatlar"} için bizi arayabilirsiniz.</p>
</div></section>

<section class="iletisim" id="iletisim"><div class="kap">
  <dl class="kart">
    <span class="etiket">İletişim</span>
    <div><dt>Telefon</dt><dd><a href="tel:{tel_ham}">{e(b["tel"])}</a></dd></div>
    <div><dt>Adres</dt><dd>{e(b["adres"])}</dd></div>
    {f'<div><dt>Instagram</dt><dd>{ig}</dd></div>' if ig else ''}
    <div class="eylem"><a class="btn" href="tel:{tel_ham}">Ara</a>{wa_btn}<a class="btn ikincil" href="https://www.google.com/maps/search/?api=1&query={urllib.parse.quote(b["ad"] + " " + b["adres"])}">Haritada Aç</a></div>
  </dl>
  <div class="harita"><iframe loading="lazy" title="Harita" src="{harita}"></iframe></div>
</div></section>
</main>

<footer><div class="kap"><span>© 2026 {e(b["ad"])} {e(b["alt"])} · Çerkezköy</span><span>Tüm hakları saklıdır.</span></div></footer>
<a class="btn yuzen" href="{f'https://wa.me/{wa}' if wa else f'tel:{tel_ham}'}">{"WhatsApp" if wa else "Ara"}</a>
<span class="demo">Tanıtım tasarımı</span>
</body>
</html>
"""


def mesaj(b):
    return (
        f"Merhaba, {b['ad']} {b['alt']} ekibi 👋\n\n"
        f"Google'da {b['yorum']} yorumunuz ve {b['puan']} puanınız var ama bir web siteniz yok. "
        f"Müşterileriniz sizi Google'da aradığında menünüzü, adresinizi ve telefonunuzu tek tıkla görebilsin diye "
        f"işletmenize özel bir site tasarımı hazırladım (ekran görüntüsü ektedir).\n\n"
        f"• Mobil uyumlu, size özel tasarım\n"
        f"• Tek tıkla arama, WhatsApp ve yol tarifi\n"
        f"• Alan adı kurulumu ve Google'da görünürlük\n\n"
        f"Kurulum: {FIYAT} (tek seferlik)\n"
        f"Bakım ve güncelleme: aylık {BAKIM}\n\n"
        f"İsterseniz tasarımı birlikte sizin için son haline getirelim. "
        f"İlgilenmiyorsanız \"HAYIR\" yazmanız yeterli, tekrar mesaj atmam.\n\n"
        f"[Adınız Soyadınız] · [Telefonunuz]"
    )


def pano():
    satirlar = []
    for b in ISLETMELER:
        m = mesaj(b)
        if b["whatsapp"]:
            link = f'<a class="btn" href="https://wa.me/{b["whatsapp"]}?text={urllib.parse.quote(m)}" target="_blank">WhatsApp\'ta aç</a>'
            durum = '<span class="ok">Cep numarası · WhatsApp uygun</span>'
        else:
            link = f'<a class="btn ikincil" href="tel:{b["tel"].replace(" ", "")}">Ara (sabit hat)</a>'
            durum = '<span class="uyari">Sabit hat · önce arayıp cep/WhatsApp numarası isteyin</span>'
        satirlar.append(f"""
<article>
  <img src="{b['slug']}/onizleme.png" alt="{e(b['ad'])} site önizlemesi" loading="lazy">
  <div class="ic">
    <h2>{e(b['ad'])} <small>{e(b['alt'])}</small></h2>
    <p class="meta">{e(b['tur'])} · ★ {b['puan']} · {b['yorum']} yorum · {e(b['tel'])}</p>
    {durum}
    <textarea readonly>{e(m)}</textarea>
    <div class="eylem"><a class="btn ikincil" href="{b['slug']}/index.html" target="_blank">Siteyi aç</a>
    <button class="btn ikincil" onclick="kopyala(this)">Mesajı kopyala</button>{link}</div>
  </div>
</article>""")
    return f"""<!doctype html>
<html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Çerkezköy Teklif Panosu</title>
<style>
:root {{ --bg:#f6f5f2; --kart:#fff; --yazi:#1c1c1a; --soluk:#6b6a65; --vurgu:#1f7a4d; --cizgi:#e4e2dc }}
@media (prefers-color-scheme: dark) {{ :root {{ --bg:#141413; --kart:#1d1d1b; --yazi:#f1efe9; --soluk:#a3a19a; --vurgu:#3fb27a; --cizgi:#2e2d2a }} }}
* {{ box-sizing:border-box; margin:0 }}
body {{ background:var(--bg); color:var(--yazi); font:15px/1.55 system-ui, sans-serif; padding:32px 16px }}
.kap {{ max-width:1100px; margin:auto }}
header h1 {{ font-size:1.8rem }} header p {{ color:var(--soluk); margin-top:6px }}
.fiyat {{ display:flex; gap:12px; margin:20px 0 28px; flex-wrap:wrap }}
.fiyat div {{ background:var(--kart); border:1px solid var(--cizgi); border-radius:14px; padding:12px 18px }}
.fiyat b {{ font-size:1.4rem; display:block }}
article {{ display:grid; grid-template-columns:220px 1fr; gap:20px; background:var(--kart); border:1px solid var(--cizgi); border-radius:18px; padding:16px; margin-bottom:16px }}
article img {{ width:100%; border-radius:12px; border:1px solid var(--cizgi); aspect-ratio:9/16; object-fit:cover; object-position:top }}
h2 small {{ font-weight:400; color:var(--soluk); font-size:.9rem }}
.meta {{ color:var(--soluk); margin:4px 0 8px }}
.ok, .uyari {{ font-size:.82rem; padding:3px 10px; border-radius:999px; display:inline-block }}
.ok {{ background:color-mix(in srgb, var(--vurgu) 15%, transparent); color:var(--vurgu) }}
.uyari {{ background:#f5a52422; color:#b4740a }}
textarea {{ width:100%; height:190px; margin:12px 0; padding:12px; border-radius:12px; border:1px solid var(--cizgi); background:var(--bg); color:var(--yazi); font:inherit; font-size:.88rem; resize:vertical }}
.eylem {{ display:flex; gap:8px; flex-wrap:wrap }}
.btn {{ padding:9px 16px; border-radius:999px; background:var(--vurgu); color:#fff; text-decoration:none; border:0; font:inherit; font-weight:600; cursor:pointer }}
.btn.ikincil {{ background:transparent; color:var(--yazi); border:1px solid var(--cizgi) }}
@media (max-width:640px) {{ article {{ grid-template-columns:1fr }} article img {{ max-height:320px }} }}
</style></head><body><div class="kap">
<header><h1>Çerkezköy · Web Sitesi Teklif Panosu</h1>
<p>Web sitesi bulunmayan, en çok yorum alan işletmeler. Mesajı göndermeden önce [Adınız] alanını doldurun ve site önizleme görselini mesaja ekleyin.</p></header>
<div class="fiyat"><div>Kurulum<b>{FIYAT}</b></div><div>Aylık bakım<b>{BAKIM}</b></div><div>İşletme<b>{len(ISLETMELER)}</b></div></div>
{''.join(satirlar)}
</div>
<script>
function kopyala(b) {{ const t = b.closest('article').querySelector('textarea'); navigator.clipboard.writeText(t.value).then(() => {{ b.textContent = 'Kopyalandı ✓'; setTimeout(() => b.textContent = 'Mesajı kopyala', 1500) }}) }}
</script></body></html>
"""


if __name__ == "__main__":
    for b in ISLETMELER:
        d = KOK / b["slug"]
        d.mkdir(exist_ok=True)
        (d / "index.html").write_text(site(b), encoding="utf-8")
        (d / "whatsapp-mesaji.txt").write_text(mesaj(b), encoding="utf-8")
    (KOK / "index.html").write_text(pano(), encoding="utf-8")
    (KOK / "isletmeler.json").write_text(json.dumps(
        [{k: b[k] for k in ("ad", "alt", "tur", "puan", "yorum", "tel", "whatsapp", "adres")} for b in ISLETMELER],
        ensure_ascii=False, indent=2), encoding="utf-8")
    print("Tamam:", len(ISLETMELER), "site")
