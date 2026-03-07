<div align="center">

```
████████╗ █████╗ ██████╗ ██╗██╗  ██╗████████╗ █████╗ ███╗   ██╗████████╗ █████╗
╚══██╔══╝██╔══██╗██╔══██╗██║██║ ██╔╝╚══██╔══╝██╔══██╗████╗  ██║╚══██╔══╝██╔══██╗
   ██║   ███████║██████╔╝██║█████╔╝    ██║   ███████║██╔██╗ ██║   ██║   ███████║
   ██║   ██╔══██║██╔══██╗██║██╔═██╗    ██║   ██╔══██║██║╚██╗██║   ██║   ██╔══██║
   ██║   ██║  ██║██║  ██║██║██║  ██╗   ██║   ██║  ██║██║ ╚████║   ██║   ██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝  ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝   ╚═╝  ╚═╝
```

**Çevirmen Çalışma İstasyonu** — Kişisel ders notu & terminoloji sistemi

[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PWA](https://img.shields.io/badge/PWA-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[**🚀 Canlı Demo**](https://tariktanta.github.io) · [**📖 Dersler**](#dersler) · [**⚙️ Kurulum**](#kurulum)

</div>

---

## 📌 Nedir?

**Tariktanta**, çeviri bölümü son sınıf öğrencisi olan Tarık'ın 8 derslik müfredatını yönetmek için geliştirdiği kişisel bir web uygulamasıdır. Ders notları, terminoloji sözlükleri, Leitner flashcard sistemi, quiz modülü ve Pomodoro sayacı tek bir arayüzde birleştirilmiştir.

Sıfır bağımlılık, sıfır framework. Vanilla HTML/CSS/JS. Şifre korumalı, PWA olarak ana ekrana eklenebilir, tamamen offline çalışır.

---

## ✨ Özellikler

| Özellik | Açıklama |
|---|---|
| 🔒 **PIN Kilidi** | 4 haneli şifre koruması |
| 📚 **8 Ders Paneli** | Her ders için haftalık not sistemi |
| 🃏 **Leitner Flashcard** | Bil/bilmiyorum sistemiyle akıllı tekrar |
| 🧠 **Quiz Modülü** | Her turda karışık 12 soru |
| 🎤 **Çeviri Pratiği** | Cümle çevirisi + cevap görme |
| ⏱️ **Pomodoro** | 25/5/15 dk döngüsü, ses bildirimi |
| 📖 **Hızlı Sözlük** | Free Dictionary API entegrasyonu |
| 🔊 **Ortam Sesleri** | Yağmur, orman, şömine, okyanus... |
| 🔍 **Global Arama** | Tüm terminolojide Türkçe/İngilizce arama |
| 🌙 **Dark/Light Tema** | localStorage'da kalıcı |
| 🌐 **TR/EN Dil** | Arayüz dil değiştirme |
| 📱 **PWA** | Ana ekrana ekle, offline çalış |
| ⌨️ **Klavye Kısayolları** | `⌘K` arama, `1-8` ders geçişi, `T` tema |

---

## 🎓 Dersler

```
Pazartesi   🎙️  Ardıl Çeviriye Giriş    09:30–13:15   FEF 228
            ⚖️  Hukuk Çevirisi          13:30–16:15   FEF 140

Salı        📐  Çeviri Göstergebilimi II 11:30–14:30   FEF 228

Çarşamba    ⚡  Çeviride Etik           08:30–11:15   FEF 33
            🤟  Türk İşaret Dili        09:30–12:15   225
            🌿  Tıbbi Bitki             13:00–14:45   —

Perşembe    🇷🇺  Rusça IV               11:30–14:15   YDYO 226
            🇷🇺  Rusça VI               14:30–17:15   YDYO 226
```

Her dersin paneli haftalara bölünmüştür (Hafta 2–7). Her haftaya şunlar eklenebilir:

- 📝 Ders notları (bölüm bölüm)
- 📋 Terminoloji tabloları (EN → TR)
- 🃏 Flashcard seti (Leitner sistemi)
- 🧠 Quiz soruları (çoktan seçmeli)
- 🎤 Çeviri pratiği cümleleri
- ✅ Ders öncesi kontrol listesi

---

## 🗂️ Dosya Yapısı

```
tariktanta/
│
├── index.html          # Ana uygulama — tüm paneller burada
├── styles.css          # Tüm stiller (dark/light tema, responsive)
├── app.js              # Uygulama mantığı, tüm veriler burada
│
├── favicon.svg         # Uygulama ikonu
├── manifest.json       # PWA manifest
│
└── README.md
```

> **Not:** Tüm ders verisi `app.js` içindeki sabitlerde tutulmaktadır (`COURSES`, `SCHEDULE`, `TERMS`, `SESSIONS`, vb.)

---

## ⚙️ Kurulum

### GitHub Pages ile (önerilen)

```bash
# 1. Repoyu fork'la veya klonla
git clone https://github.com/kullanici-adi/tariktanta.git
cd tariktanta

# 2. GitHub Pages'i etkinleştir
# Settings → Pages → Source: main branch → / (root)

# 3. Bitti — site yayında
# https://kullanici-adi.github.io/tariktanta
```

### Yerel kullanım

```bash
# Herhangi bir static server ile aç
npx serve .
# veya
python3 -m http.server 8080
# veya dosyayı doğrudan tarayıcıda aç
open index.html
```

---

## 📝 Yeni Hafta Notu Ekleme

`app.js` dosyasında ilgili dersin verisini bul ve hafta içeriğini ekle.

### 1. `WEEK_AVAILABILITY` güncelle

```js
const WEEK_AVAILABILITY = {
  'davos': { 2: true, 3: true, 4: false, ... },  // 3. haftayı aktif et
  'hukuk': { 2: true, 3: false, ... },
  // ...
};
```

### 2. `index.html`'de ilgili panel panelini doldur

Her dersin her haftası için `panel-{ders}-w{hafta}` ID'li bir `div` zaten hazır. İçini doldur:

```html
<!-- ÖRN: Ardıl Çeviri 3. Hafta -->
<div class="app-panel" id="panel-davos-w3">
  <!-- Buraya ders notu HTML'ini ekle -->
  <!-- panel-davos veya panel-hukuk'u örnek al -->
</div>
```

### 3. Terminoloji eklemek için

`app.js` içindeki `TERMS` dizisine yeni kategori veya satır ekle:

```js
const TERMS = [
  {
    cat: '🔵 Yeni Kategori',
    color: '#38bdf8',
    items: [
      ['source term', 'hedef terim', 'opsiyonel not'],
    ]
  },
  // ...
];
```

### 4. Flashcard eklemek için

`app.js` içindeki ilgili kart dizisine nesne ekle:

```js
const hCards = [
  // Hukuk flashcard'ları
  { q: "Soru metni?", a: "Cevap metni.", topic: "Konu Başlığı" },
  // ...
];
```

### 5. Quiz sorusu eklemek için

```js
const QUIZ_Q = [
  {
    q: 'Soru metni?',
    opts: ['Seçenek A', 'Seçenek B', 'Seçenek C', 'Seçenek D'],
    ans: 0,  // doğru cevabın index'i
    exp: 'Açıklama metni.'
  },
  // ...
];
```

---

## ⌨️ Klavye Kısayolları

| Kısayol | İşlev |
|---|---|
| `⌘K` / `/` | Global arama |
| `D` | Dashboard'a dön |
| `T` | Dark/Light tema değiştir |
| `ESC` | Aramayı kapat |
| `1` | Hukuk Çevirisi |
| `2` | Ardıl Çeviriye Giriş |
| `3` | Çeviri Göstergebilimi |
| `4` | Rusça IV |
| `5` | Rusça VI |
| `6` | Çeviride Etik |
| `7` | Türk İşaret Dili |
| `8` | Tıbbi Bitki |

---

## 🔧 PIN Değiştirme

`app.js` dosyasının en üstündeki `lockCheck()` fonksiyonunda:

```js
function lockCheck() {
  const val = document.getElementById('lock-input').value;
  if (val === '1234') {  // ← burası
```

---

## 🌐 Kullanılan API'lar

| API | Kullanım | Ücret |
|---|---|---|
| [Free Dictionary API](https://dictionaryapi.dev) | Hızlı sözlük | Ücretsiz |
| [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference) | Ortam sesleri (desktop) | Ücretsiz |
| [Freesound CDN](https://freesound.org) | Ortam sesleri (iOS) | Ücretsiz |
| [Google Fonts](https://fonts.google.com) | Syne, IBM Plex, DM Sans | Ücretsiz |
| [Simple Icons CDN](https://simpleicons.org) | Uygulama ikonları | Ücretsiz |

---

## 📱 PWA Kurulumu

**iOS (Safari):** Paylaş → Ana Ekrana Ekle

**Android (Chrome):** Adres çubuğu → Yükle / Ana ekrana ekle

**Desktop (Chrome/Edge):** Adres çubuğu sağındaki install ikonu

Uygulama tam offline çalışır — Service Worker tüm asset'leri cache'ler.

---

## 🗓️ Yol Haritası

- [x] Dashboard + Pomodoro
- [x] Hukuk Çevirisi paneli (Hafta 2)
- [x] Ardıl Çeviri / Davos paneli (Hafta 2)
- [x] Global arama
- [x] PWA + offline destek
- [x] Hafta overlay sistemi
- [ ] Hafta 3–7 içerikleri (dönem boyunca dolacak)
- [ ] Göstergebilim paneli
- [ ] Çeviride Etik paneli
- [ ] Rusça IV/VI paneli
- [ ] İşaret Dili paneli
- [ ] Tıbbi Bitki paneli
- [ ] Not dışa aktarma (PDF)

---

## 📄 Lisans

[MIT](LICENSE) — Kişisel kullanım için özgürce fork'layabilirsin.

---

<div align="center">

Son sınıf — 8 ders, 1 hedef.

</div>
