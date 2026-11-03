# Supabase e-posta şablonları (kodlu)

Uygulama, e-postadaki bir bağlantı yerine uygulama içinde yazılan **6 haneli kodla** doğrulama yapar.
Bu yüzden kodun e-postada görünmesi gerekir.

Supabase → **Authentication** → **Emails** (bazı hesaplarda **Email Templates**) → ilgili şablonu aç, içeriğini aşağıdaki metinle değiştir ve **Save** butonuna bas.

## 1) Confirm signup (kayıt doğrulama)

**Konu (Subject):** `FORMIQ doğrulama kodun: {{ .Token }}`

**Mesaj (Message body):**
```html
<h2>FORMIQ'e hoş geldin 💪</h2>
<p>Hesabını doğrulamak için bu kodu uygulamaya yaz:</p>
<p style="font-size:32px;font-weight:800;letter-spacing:6px">{{ .Token }}</p>
<p>Bu işlemi sen yapmadıysan bu e-postayı yok sayabilirsin.</p>
```

## 2) Reset Password (şifre sıfırlama)

**Konu (Subject):** `FORMIQ şifre sıfırlama kodun: {{ .Token }}`

**Mesaj (Message body):**
```html
<h2>Şifreni sıfırla</h2>
<p>Yeni şifre belirlemek için bu kodu uygulamaya yaz:</p>
<p style="font-size:32px;font-weight:800;letter-spacing:6px">{{ .Token }}</p>
<p>Bu işlemi sen yapmadıysan bu e-postayı yok sayabilirsin, şifren değişmez.</p>
```
