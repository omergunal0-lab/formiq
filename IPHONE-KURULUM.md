# FORMIQ'i iPhone'a kurma (bilgisayarsız, ücretsiz)

Sonuç: FORMIQ ana ekranında simgesiyle duran, tam ekran açılan bir uygulama olur. Gerçek hesapların ve bulut yedeğin çalışır. Bütün adımlar iPhone'daki Safari'den yapılır.

Bu yolla çalışmayanlar: titreşim ve bildirimler. İkisi de App Store sürümünde gelecek.

---

## 1. GitHub (yaklaşık 5 dakika)

1. Safari'de **github.com/signup** adresine git, ücretsiz hesap aç.
2. **claude.ai/connect-github** adresine git, GitHub hesabını Claude'a bağla.
3. GitHub'da yeni depo oluştur: **github.com/new**
   - Repository name: `formiq`
   - **Public** seç. Ücretsiz web yayını için gerekli. Kod herkese görünür olur ama şifre veya gizli anahtar içermez; gizli anahtarlar ayrı, kilitli bir bölümde durur.
   - Başka hiçbir şeyi işaretleme → **Create repository**
4. Claude'a GitHub **kullanıcı adını** yaz. Dosyaları Claude yükleyecek.

## 2. Web yayınını aç (1 dakika, Claude dosyaları yükledikten sonra)

GitHub'da `formiq` deposu → **Settings** → soldaki menüden **Pages** → **Source** kısmında **GitHub Actions** seç.

> Telefonda Settings sekmesi görünmüyorsa sayfayı yana kaydır veya Safari'de "aA" → **Masaüstü Web Sitesi İste** seçeneğini kullan.

## 3. Supabase (yaklaşık 10 dakika)

1. **supabase.com** → **Start your project** → "Continue with GitHub" ile giriş yap.
2. **New project**:
   - Name: `formiq`
   - Database Password: **Generate a password**'e bas (bir yere not al)
   - Region: **Central EU (Frankfurt)**
   - **Create new project**, ardından 1-2 dakika bekle.
3. Proje adresindeki kimliği bul: tarayıcı adresi `supabase.com/dashboard/project/`**abcdefghijkl** şeklindedir. Sondaki bu harf grubu senin **Project ref**'in.
4. Erişim anahtarı oluştur: **supabase.com/dashboard/account/tokens** → **Generate new token** → isim `github` → çıkan anahtarı kopyala (bir daha gösterilmez).

## 4. Anahtarları GitHub'a ekle (yaklaşık 5 dakika)

GitHub'da `formiq` deposu → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**. Her biri için ayrı ayrı:

| Name | Secret |
|---|---|
| `SUPABASE_PROJECT_REF` | 3. adımdaki Project ref (ör. `abcdefghijkl`) |
| `SUPABASE_ACCESS_TOKEN` | 3. adımda kopyaladığın anahtar |

Bu anahtarları Claude'a veya sohbete **yazma**. Sadece buraya gir.

## 5. Kurulumu çalıştır (2 dakika)

1. Depoda üstteki **Actions** sekmesi → soldan **Supabase setup** → **Run workflow** → yeşil **Run workflow**.
2. Yeşil ✓ çıkınca: **Web app (iPhone home screen)** → **Run workflow**.
3. Yeşil ✓ çıkınca uygulaman şu adreste yayında olur:
   **https://KULLANICI-ADIN.github.io/formiq/**

Kırmızı ✗ çıkarsa Claude'a "kurulum kırmızı oldu" yaz. Claude hata kaydını okuyup düzeltir.

## 6. iPhone'a ekle

1. Adresi **Safari**'de aç (Chrome değil).
2. Alttaki **Paylaş** butonu (yukarı oklu kare) → **Ana Ekrana Ekle** → **Ekle**.
3. Ana ekrandaki FORMIQ simgesinden aç ve hesap oluştur. Kod, Supabase'e kayıt olduğun e-postaya gelir.

> Supabase'in ücretsiz e-posta gönderimi saatte birkaç e-postayla ve sadece senin kendi e-postanla sınırlı. Kendi kullanımın için yeterli. Başkaları kayıt olacağı zaman Resend kurulur (Claude yardım eder).

---

## İsteğe bağlı: yapay zekâ koçunu aç

1. **console.anthropic.com** → hesap aç → **Billing**: 5 $ kredi yükle → **Limits**: aylık limit koy (ör. 5 $).
2. **API Keys** → **Create Key** → kopyala.
3. GitHub → Secrets'a ekle: Name `ANTHROPIC_API_KEY`, Secret: kopyaladığın anahtar.
4. Actions → **Supabase setup** → **Run workflow**.

Koç en ucuz modeli kullanır: yaklaşık 3.000 soru 1 $ tutar. Kullanıcı başına günde 15 soru hakkı vardır.

## Güncellemeler

Claude bir değişiklik yapıp GitHub'a yüklediğinde web sürümü birkaç dakika içinde kendiliğinden güncellenir. Ana ekrandaki uygulamayı kapatıp açman yeterli.
