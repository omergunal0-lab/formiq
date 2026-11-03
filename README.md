# FORMIQ: sıfırdan mağazaya rehber

Bu rehber daha önce hiç uygulama yayınlamamış biri için yazıldı. Adımları sırayla izle. Takıldığın yerde Claude'a "X. adımda takıldım" yazman yeterli.

## Büyük resim: hangi parça ne işe yarıyor?

```
 Telefon (FORMIQ uygulaması)
      │  giriş, kayıt, yedekleme, koç soruları
      ▼
 Supabase  ── hesaplar, veritabanı, koç sunucusu ──►  Anthropic (yapay zekâ)
      ▲
 GitHub  ── kodun saklandığı yer; Android dosyasını otomatik üretir
```

| Hizmet | Ne işe yarar | Ücret |
|---|---|---|
| **GitHub** | Proje dosyalarının internetteki "Google Drive"ı. Her değişiklik kaydedilir, geri alınabilir. Android uygulama dosyasını senin yerine otomatik üretir. | Ücretsiz |
| **Supabase** | Kullanıcı hesapları (kayıt, giriş, şifre sıfırlama), verilerin yedeklenmesi ve koç sunucusu. | Ücretsiz plan yeterli |
| **Resend** | Doğrulama kodu e-postalarını gönderir. Supabase'in kendi e-postası sadece sana gönderebilir, gerçek kullanıcılar için bu gerekli. | Ücretsiz (ayda 3.000 e-posta) |
| **Anthropic** | Yapay zekâ koçu (Claude Haiku 5.5, en ucuz model). | Kullandıkça: koç sorusu başına yaklaşık **0,0003 $** (1 $ ≈ 3.000 soru) |
| **Google Play** | Android mağazası. | Bir kerelik 25 $ |
| **Apple Developer** | App Store. Uygulamayı yüklemek için bir Mac gerekir. | Yıllık 99 $ |

---

## Adım 1: GitHub (yaklaşık 5 dakika)

1. https://github.com/signup adresinden ücretsiz hesap aç.
2. https://claude.ai/connect-github adresine git ve GitHub hesabını Claude'a bağla.
3. GitHub'da sağ üstteki **+** → **New repository**. İsim: `formiq`, görünürlük: **Private** (gizli). Başka hiçbir şeyi işaretlemeden **Create repository** butonuna bas.
4. Claude'a GitHub kullanıcı adını yaz. Proje dosyalarını oraya Claude yükleyecek.

## Adım 2: Supabase (yaklaşık 15 dakika)

1. https://supabase.com adresinde "Start your project" ile hesap aç (GitHub ile giriş yapabilirsin).
2. **New project**: isim `formiq`, güçlü bir veritabanı şifresi seç (bir yere not al), bölge **Central EU (Frankfurt)**. Projenin hazırlanmasını bekle (1-2 dakika).
3. **Veritabanı:** soldaki menüden **SQL Editor** → **New query** → `supabase/setup.sql` dosyasının tamamını kopyalayıp yapıştır → **Run**. "Success" yazısını görmelisin.
4. **E-posta şablonları:** `supabase/email-templates.md` dosyasındaki adımları uygula (2 şablon, kopyala-yapıştır).
5. **Şifre kuralı:** **Authentication** → **Providers** (veya Sign In / Providers) → **Email** → "Minimum password length" değerini `8` yap.
6. **Anahtarlar:** **Project Settings** → **API** (veya üstteki **Connect** butonu). Buradaki **Project URL** ve **anon / publishable key** değerlerini Claude'a gönder. Bu iki değer gizli değildir, uygulamanın içinde durur. **service_role / secret** anahtarını kimseyle paylaşma.

## Adım 3: E-posta gönderimi (Resend, yaklaşık 10 dakika)

1. https://resend.com adresinde hesap aç → **API Keys** → **Create API Key**, anahtarı kopyala.
2. Supabase → **Authentication** → **Emails** → **SMTP Settings** → **Enable custom SMTP**:
   - Host: `smtp.resend.com` · Port: `465` · Username: `resend` · Password: Resend anahtarın
   - Sender email: başlangıçta `onboarding@resend.dev` olabilir. Kendi alan adın varsa Resend'de doğrulayıp onu kullan. Mağazaya çıkmadan önce kendi alan adın önerilir.
   - Sender name: `FORMIQ`
3. **Save**.

> Bu adımı atlarsan kayıt kodları sadece Supabase hesabının e-postasına gider. Kendin test ederken yeterlidir, ama gerçek kullanıcılar kod alamaz.

## Adım 4: Yapay zekâ koçu (yaklaşık 10 dakika)

1. https://console.anthropic.com adresinde hesap aç → **Billing** bölümünden en az 5 $ kredi yükle.
2. **Önemli:** **Limits** bölümünden aylık harcama limiti koy (ör. 10 $). Böylece ne olursa olsun fatura bu tutarı geçemez.
3. **API Keys** → **Create Key** → anahtarı kopyala (bir daha gösterilmez).
4. Supabase → **Edge Functions** → **Secrets** → **Add new secret**: Name `ANTHROPIC_API_KEY`, Value: kopyaladığın anahtar → Save.
5. Supabase → **Edge Functions** → **Deploy a new function** → **Via Editor**. Fonksiyonun adını tam olarak `coach` yap. Editördeki örnek kodu silip `supabase/functions/coach/index.ts` dosyasının tamamını yapıştır → **Deploy**.

Koç maliyetini düşük tutan önlemler (hepsi hazır):
- En ucuz model (**Claude Haiku 5.5**) ve kısa cevap ayarı
- Kullanıcı başına **günde 15 koç hakkı**. Değiştirmek için Secrets'a `DAILY_LIMIT` ekle (ör. `10`).
- Yemek hesaplamaları ortak önbellekte saklanır: "2 yumurta" bir kez hesaplanır, sonra herkes için bedava ve anında gelir.
- Aynı gün aynı soruyu tekrar sorarsan cevap telefondan gelir, ücret ödenmez.
- Hızlı yemek arama ve elle ekleme yapay zekâ kullanmaz.
- Koç sadece hesabı olan kullanıcılara açıktır, böylece başkaları sunucunu kötüye kullanamaz.

## Adım 5: Telefonda dene

Claude dosyaları GitHub'a yükledikten sonra:
1. GitHub'da `formiq` deposunu aç → üstteki **Actions** sekmesi → en son çalışan "Build mobile apps" satırı (yeşil ✓ olunca hazır).
2. Sayfanın altındaki **Artifacts** bölümünden `formiq-android` dosyasını indir, zip'i aç.
3. İçindeki `app-debug.apk` dosyasını Android telefonuna gönder ve aç ("bilinmeyen kaynaklardan yüklemeye izin ver" sorusuna izin ver).
4. iPhone'da denemek için Mac gerekir (aşağıya bak).

## Adım 6: Mağazalara yükleme

**Yayından önce:**
- [ ] `www/privacy.html` ve `www/delete-account.html` içindeki `[Geliştirici adı]` ve `[e-posta adresi]` alanlarını doldur (Claude'a adını ve e-postanı söylersen o doldurur).
- [ ] Bu iki sayfayı herkese açık bir adreste yayınla (Claude, GitHub Pages ile ücretsiz yayınlayabilir).
- [ ] Uygulama kimliği `com.formiq.app` sana uygunsa kalsın. Değişecekse **ilk yüklemeden önce** Claude'a söyle; sonra değiştirilemez.

**Google Play (Mac gerekmez):**
1. https://play.google.com/console adresinde geliştirici hesabı aç (25 $, kimlik doğrulaması birkaç gün sürebilir).
2. İmza anahtarını Claude ile birlikte oluşturup GitHub'a gizli olarak ekleyeceksiniz. Bu anahtar, uygulamanın sana ait olduğunu kanıtlar; kaybolursa güncelleme yapılamaz, mutlaka yedekle. Bundan sonra GitHub her seferinde mağazaya hazır `app-release.aab` dosyasını üretir.
3. Play Console → **Uygulama oluştur** → `store/listing.md` metinlerini ve `store/screenshots/android-*.png` görüntülerini kullan → **Kapalı test** bölümüne `.aab` dosyasını yükle.
4. Yeni kişisel hesaplarda herkese açık yayından önce **12 test kullanıcısıyla 14 günlük kapalı test** zorunludur (arkadaşlar, aile).

**App Store (Mac gerekir):**
1. https://developer.apple.com/programs adresinden üyelik al (yıllık 99 $).
2. Bir Mac'te bu projeyi aç (`npm install`, ardından `npm run ios`). Xcode'da **Signing & Capabilities** → Team alanında hesabını seç → **Product → Archive → Distribute App**.
3. App Store Connect'te `store/listing.md` metinlerini ve `store/screenshots/ios-6.9-*.png` görüntülerini yükle. İnceleme ekibi için bir **demo hesap** (e-posta ve şifre) yaz.
4. Mac'in yoksa Codemagic gibi bulut Mac hizmetleri kullanılabilir; Claude kurulumda yardım eder.

---

## Geliştirici notları

| Klasör / dosya | İçerik |
|---|---|
| `www/` | Uygulama: `app.js` (ana kod), `account.js` (hesaplar ve yedekleme), `native.js` (titreşim, bildirim, geri tuşu), `config.js` (Supabase adresi) |
| `supabase/setup.sql` | Tablolar, güvenlik kuralları, günlük limit ve hesap silme fonksiyonları |
| `supabase/functions/coach/index.ts` | Koç sunucusu (Edge Function; model `claude-haiku-5-5`) |
| `android/`, `ios/` | Capacitor yerel projeleri |
| `store/` | Mağaza metinleri ve ekran görüntüleri |
| `.github/workflows/build.yml` | Otomatik Android (APK/AAB) ve iOS derleme kontrolü |

`www/` içinde değişiklik yaptıktan sonra yerel projeleri güncellemek için:

```bash
npx cap sync
```

Tarayıcıda denemek için:

```bash
npm run serve
```

Simgeleri ve ekran görüntülerini yeniden üretmek için:

```bash
npm run icons && node scripts/store-shots.js
```
