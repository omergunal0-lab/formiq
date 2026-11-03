/* FORMIQ ayarları. Supabase → Project Settings → API (veya "Connect") sayfasındaki
   Project URL ve anon (publishable) anahtarı buraya yazılır. Bu anahtarın uygulamada durması güvenlidir;
   veritabanı supabase/setup.sql içindeki kurallarla korunur.
   Boş bırakılırsa uygulama hesapsız çalışır (veriler sadece cihazda, koç kapalı). */
window.FORMIQ_CONFIG = {
  version: "1.1.0",
  supabaseUrl: "",
  supabaseAnonKey: "",
  privacyUrl: "privacy.html"
};
