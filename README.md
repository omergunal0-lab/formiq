# FORMIQ: App Store ve Google Play rehberi

FORMIQ, tek bir web uygulamasının (`www/`) **Capacitor** ile gerçek iOS ve Android uygulamasına paketlenmiş hâlidir. Aynı kod üç yerde çalışır: tarayıcı, iPhone ve Android.

## Klasörler

| Klasör | İçerik |
|---|---|
| `www/` | Uygulamanın kendisi (`index.html`, `app.css`, `app.js`, `native.js`, `config.js`, `privacy.html`) |
| `android/` | Android Studio projesi (Google Play) |
| `ios/` | Xcode projesi (App Store) |
| `server/` | Yapay zekâ koçu sunucusu (Cloudflare Worker) |
| `assets/` | Simge ve açılış ekranı kaynakları (`npm run icons` ile yeniden üretilir) |
| `store/` | Mağaza metinleri (`listing.md`), ekran görüntüleri, 512 px simge |
| `.github/workflows/build.yml` | GitHub'da otomatik APK/AAB ve iOS derlemesi |

## 1. Bilgisayarında dene

```bash
npm install
```

```bash
npm run serve
```

Sonra tarayıcıda `http://localhost:8080` adresini aç. Telefon görünümü için geliştirici araçlarında mobil modu seç.

`www/` içinde bir değişiklik yaptıktan sonra uygulama projelerine aktarmak için:

```bash
npx cap sync
```

## 2. Yayından önce değiştirmen gerekenler

1. **Uygulama kimliği:** `capacitor.config.json` içindeki `"appId": "com.formiq.app"` değerini kendine ait bir kimlikle değiştir (ör. `com.soyadin.formiq`). Bu kimlik mağazaya bir kez yüklendikten sonra değiştirilemez. Değiştirdikten sonra `android/app/build.gradle` dosyasındaki `namespace` ve `applicationId` satırlarını da güncelle; iOS'ta Xcode → Signing & Capabilities → Bundle Identifier alanına aynı değeri yaz.
2. **Gizlilik politikası:** `www/privacy.html` içindeki `[Geliştirici adı]` ve `[e-posta adresi]` alanlarını doldur. Dosyayı herkese açık bir adreste yayınla (GitHub Pages ücretsizdir) ve adresi `www/config.js` → `privacyUrl` alanına yaz.
3. **Yapay zekâ koçu:** 3. adımı uygula. Atlarsan uygulama yine çalışır; koç ve "Hesapla" butonu sadece "henüz ayarlanmadı" mesajı gösterir.

## 3. Yapay zekâ koçu sunucusu

API anahtarı uygulamanın içine **konmaz**, çünkü uygulama dosyalarından çıkarılabilir. Bunun yerine küçük bir sunucu anahtarı saklar. Cloudflare Workers'ın ücretsiz planı yeterlidir.

```bash
cd server && npm install
```

```bash
npx wrangler login
```

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

```bash
npx wrangler secret put APP_KEY
```

```bash
npx wrangler deploy
```

Komut çıktısında bir adres verilir (ör. `https://formiq-ai.<hesabın>.workers.dev`). Bu adresi `www/config.js` → `aiEndpoint` alanına, `APP_KEY` için girdiğin değeri de `appKey` alanına yaz. Ardından `npx cap sync` çalıştır.

- API anahtarını https://console.anthropic.com adresinden alabilirsin.
- Varsayılan model `claude-opus-5-5`. Daha düşük maliyet istersen `server/wrangler.toml` içindeki `MODEL` değerini değiştirebilirsin.
- `APP_KEY` yalnızca rastgele kötüye kullanımı zorlaştırır, tam koruma sağlamaz. Kullanıcı sayısı artınca Cloudflare'de hız sınırı (Rate Limiting) kuralı eklemen önerilir.

## 4. Google Play (Android)

**Gereken:** Google Play Console hesabı (bir kerelik 25 $). Mac gerekmez.

### Kolay yol: GitHub Actions
1. Projeyi GitHub'a yükle. **Actions** sekmesindeki "Build mobile apps" iş akışı her push'ta çalışır.
2. Test için: tamamlanan çalıştırmanın **Artifacts** bölümünden `formiq-android` dosyasını indir. İçindeki `app-debug.apk` dosyası herhangi bir Android telefona kurulabilir.
3. Mağaza için imza anahtarı oluştur (bu dosyayı **asla kaybetme**, yedekle):
   ```bash
   keytool -genkey -v -keystore formiq-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias formiq
   ```
4. GitHub → Settings → Secrets and variables → Actions bölümüne şunları ekle:
   - `ANDROID_KEYSTORE_BASE64`: `base64 -w0 formiq-release.jks` komutunun çıktısı
   - `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_PASSWORD`: anahtarı oluştururken verdiğin şifreler
   - `ANDROID_KEY_ALIAS`: `formiq`
5. Sonraki çalıştırmada imzalı `app-release.aab` dosyası da üretilir. Play Console'da **Uygulama oluştur → Test → Dahili test** bölümüne yükle.

### Alternatif: Android Studio
`npm run android` komutu projeyi Android Studio'da açar. Ardından **Build → Generate Signed App Bundle** yolunu izle.

> Google Play'de 2023'ten sonra açılan kişisel hesaplar, uygulamayı herkese açık yayınlamadan önce **en az 12 test kullanıcısıyla 14 gün kapalı test** yapmak zorundadır. Bunu takvimine ekle.

## 5. App Store (iOS)

**Gereken:** Apple Developer Program üyeliği (yıllık 99 $) ve derleme için bir Mac (Xcode). Mac yoksa Codemagic gibi bulut Mac hizmetleri kullanılabilir.

1. Mac'te:
   ```bash
   npm install && npm run ios
   ```
2. Xcode'da **App** hedefini seç → **Signing & Capabilities** → Team alanında Apple geliştirici hesabını seç, Bundle Identifier'ı ayarla.
3. Önce kendi iPhone'unda çalıştır ve test et.
4. **Product → Archive → Distribute App → App Store Connect** yolunu izle.
5. App Store Connect'te uygulamayı oluştur. `store/listing.md` metinlerini ve `store/screenshots/ios-6.9-*.png` görüntülerini yükle, gizlilik formunu doldur, incelemeye gönder.

GitHub Actions iş akışındaki iOS adımı yalnızca projenin hatasız derlendiğini kontrol eder. İmzalı yükleme için Xcode veya Codemagic gerekir.

## 6. Yayın kontrol listesi

- [ ] `appId` değiştirildi
- [ ] Gizlilik politikası dolduruldu ve herkese açık adreste yayında
- [ ] Yapay zekâ sunucusu kuruldu, `config.js` dolduruldu (veya bilerek kapalı bırakıldı)
- [ ] Gerçek bir iPhone'da ve Android telefonda test edildi (bildirimler, titreşim, geri tuşu)
- [ ] Mağaza metinleri ve ekran görüntüleri yüklendi
- [ ] Gizlilik formu (App Privacy / Data safety) dolduruldu
- [ ] Her yeni sürümde: `www/config.js` → `version`; iOS'ta Xcode'daki Version/Build numarası; Android'de versionCode (GitHub Actions otomatik artırır)

## Yeni simge veya açılış ekranı

`scripts/make-icons.js` içindeki SVG'yi düzenle, sonra:

```bash
npm run icons && npx cap sync
```

Mağaza ekran görüntülerini örnek verilerle yeniden üretmek için:

```bash
node scripts/store-shots.js
```
