# AceCast (Windows)

Modern, Türkçe, ACE Stream tabanlı masaüstü oynatıcı.

## Öne Çıkanlar

- Açılışta engine başlatma (bloklamadan hızlı başlangıç)
- İlk açılışta otomatik kanal oynatma yok
- Tam Türkçe arayüz
- Dark / Light tema
- İkon tabanlı modern butonlar
- Tam ekran: `F` ile aç/kapat, `ESC` ile çık
- Tam ekranda kontrol çubuğu auto-hide
- Kanal ileri / geri
- Smooth ses slider
- Kanal ekleme (ACE link ile, kalıcı)
- Sağ tık menüsü:
  - Kanalı Kaldır
  - Kanalı Özelleştir (isim/logo)
- Kanal sırası değiştirme (drag & drop, kalıcı)
- Playlist parse hatalarını çökmeden işaretleme
- Buffering için timeout + retry mekanizması
- Kanal logo eşleme (internet kaynaklı logo URL)

## Kurulum

```powershell
cd C:\Users\Admin\Documents\GitHub\n\acecast-player
npm install
npm start
```

## Not

Varsayılan playlist yolu:
`C:\Users\%USERNAME%\Desktop\New folder (3)\maclar\maç.xspf`

Varsayılan engine yolu:
`%APPDATA%\ACEStream\engine\ace_engine.exe`
