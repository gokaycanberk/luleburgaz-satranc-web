# Lüleburgaz Satranç Spor Okulu — Web Sitesi

Trakya'nın en eski satranç okulunun resmi web sitesi. Next.js 14 (App Router) + TypeScript + Tailwind CSS ile inşa edilmiş, editöryel/minimalist tasarım felsefesine sahip tek sayfa uzun-scroll bir marka sitesi.

## Özellikler

- ⚡ **Next.js 14 App Router** — Server Components, static generation
- 🎨 **Custom design system** — Osmanlı bordosu, kağıt/mürekkep tonları, ebru dokusu
- ♞ **Gerçek satranç motoru** — `chess.js` + `react-chessboard` ile canlı taktik bulmacası
- 📝 **Editöryel tipografi** — Instrument Serif (başlık), DM Sans (metin), JetBrains Mono (meta)
- 📱 **Tamamen responsive** — Mobil, tablet, masaüstü
- 📊 **SVG reyting grafiği** — Öğrenci başarı yolculuğunu görselleştirme
- 📨 **İletişim formu** — API route + Resend/SMTP entegrasyon iskeleti
- ♿ **Erişilebilir** — Semantic HTML, aria-expanded, keyboard-friendly
- 🚀 **SEO hazır** — Metadata, OG tags, Türkçe locale
- 🌊 **Scroll reveal animasyonları** — IntersectionObserver ile hafif

## Kurulum

Node.js **18.17+** veya **20+** gerekli.

```bash
# Bağımlılıkları kur
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Tarayıcıda aç
open http://localhost:3000
```

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Development server (hot reload) |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint kontrolü |
| `npm run typecheck` | TypeScript tip kontrolü |

## Proje Yapısı

```
luleburgaz-satranc-web/
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout, fontlar, metadata
│   │   ├── page.tsx             # Ana sayfa (tüm section'lar)
│   │   ├── globals.css          # Global stiller, Tailwind directives
│   │   ├── not-found.tsx        # 404 sayfası
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts     # Form gönderme endpoint'i
│   │   └── blog/
│   │       └── [slug]/
│   │           └── page.tsx     # Blog yazı sayfası şablonu
│   ├── components/
│   │   ├── Nav.tsx              # Fixed nav + scroll behavior
│   │   ├── Hero.tsx             # Ana başlık + puzzle
│   │   ├── PuzzleBoard.tsx      # Canlı satranç bulmacası
│   │   ├── StatsBar.tsx         # 4 sayı istatistik
│   │   ├── About.tsx            # Hakkımızda + felsefe
│   │   ├── Programs.tsx         # 6 program kartı
│   │   ├── Coaches.tsx          # 4 eğitmen profili
│   │   ├── ProgressChart.tsx    # SVG reyting grafiği
│   │   ├── Tournaments.tsx      # Turnuva takvimi
│   │   ├── Testimonials.tsx     # Öğrenci/veli yorumları
│   │   ├── Blog.tsx             # Blog önizleme kartları
│   │   ├── FAQ.tsx              # Accordion SSS
│   │   ├── Contact.tsx          # İletişim formu
│   │   ├── Footer.tsx           # Alt footer
│   │   ├── WhatsAppFloat.tsx    # Sabit WhatsApp butonu
│   │   └── Primitives.tsx       # Eyebrow, SectionHead, FIDEBadge, MiniBoard
│   └── lib/
│       ├── data.ts              # Tüm site içeriği (programlar, eğitmenler vb.)
│       └── useReveal.ts         # IntersectionObserver hook
├── public/                      # Statik dosyalar (buraya logo/favicon ekleyin)
├── tailwind.config.ts           # Design tokens, renk paleti
├── next.config.js
├── tsconfig.json
├── postcss.config.js
├── .eslintrc.json
├── .env.example                 # Environment variable şablonu
├── .gitignore
├── package.json
└── README.md
```

## İçerik Yönetimi

Tüm site içeriği tek dosyada: **`src/lib/data.ts`**

- `SCHOOL` — Okul bilgileri (isim, adres, telefon, e-posta, WhatsApp)
- `STATS` — İstatistik sayıları
- `PROGRAMS` — 6 program kartı
- `COACHES` — 4 eğitmen profili (isim, FIDE ünvanı, ELO, bio)
- `TOURNAMENTS` — Yaklaşan turnuvalar
- `TESTIMONIALS` — Veli/öğrenci yorumları
- `BLOG_POSTS` — Blog yazıları (başlık, kategori, yazar, slug)
- `FAQ_ITEMS` — Sıkça sorulan sorular
- `NAV_LINKS` — Menü linkleri
- `PROGRESS_DATA` — Reyting grafiği veri noktaları

**Güncelleme:** İçeriği değiştirmek için sadece bu dosyayı düzenleyin.

**CMS geçişi:** İleride Sanity, Payload, Contentlayer veya benzeri bir CMS'e taşımak için bu tipler kolayca aynı şemayı verebilir.

## Design Tokens

**`tailwind.config.ts`** dosyasında tanımlı:

### Renkler

| Token | Hex | Kullanım |
|---|---|---|
| `paper` | `#F5F2EA` | Ana zemin (sıcak kağıt beyazı) |
| `paper-2` | `#EBE6D8` | Alternatif zemin, kart arka planı |
| `paper-3` | `#DDD5C0` | Koyu bej, dekoratif |
| `ink` | `#141311` | Ana metin (koyu mürekkep) |
| `ink-2` | `#3A362E` | Body text secondary |
| `ink-3` | `#6B6558` | Etiketler, meta |
| `ink-4` | `#9A9384` | En soluk metin |
| `bordo` | `#7A1E1E` | Aksan rengi (Osmanlı bordosu) |
| `bordo-dark` | `#5C1414` | Hover state |
| `gold` | `#B8935A` | FIDE badges, dark section aksanı |
| `gold-soft` | `#D9BF8F` | Dark section etiketleri |

### Tipografi

- **Serif:** `Instrument Serif` (Google Fonts) — başlıklar, alıntılar
- **Sans:** `DM Sans` (Google Fonts) — body, UI
- **Mono:** `JetBrains Mono` (Google Fonts) — eyebrow, meta, koordinatlar

Fontlar `next/font/google` ile self-host edilir — CLS yok, offline çalışır.

## Form Yönetimi

**API route:** `src/app/api/contact/route.ts`

Şu anda sadece sunucuda `console.log` yapıyor. Üretim için 3 opsiyon:

### Opsiyon 1: Resend (önerilir)

```bash
npm install resend
```

`.env`:
```
RESEND_API_KEY=re_xxx
CONTACT_TO_EMAIL=merhaba@luleburgazsatranc.com
```

`route.ts` içindeki Resend bloğunu yorumdan çıkarın.

### Opsiyon 2: Formspree / Basin

3rd party form servisi — `fetch` URL'ini değiştirmeniz yeterli.

### Opsiyon 3: Google Sheets

Google Apps Script + webhook — küçük ölçekler için ücretsiz.

## Görseller

Şu an tüm görseller **placeholder** durumunda:
- Eğitmen portreleri → baş harfler (Instrument Serif italic)
- Blog kartı → dev Unicode satranç taşı
- Logo → serif italik "L" + Unicode ♞ karakteri
- Ebru dokusu → SVG turbulence filter (prosedürel, ekstra asset gerekmez)

**Üretim için gerekenler:**
1. Okul logosu (SVG önerilir) → `public/logo.svg`
2. 4 eğitmen portresi (4:5 aspect, sıcak tonlu) → `public/coaches/`
3. Sınıf içi/turnuva fotoğrafları (opsiyonel, testimonials'a eklenebilir)
4. Favicon + OG image → `public/favicon.ico`, `public/og-image.png`

Görsel yükleme için `next/image` component'ini kullanın (otomatik lazy load + optimize).

## Satranç Kütüphaneleri

- **`chess.js`** — Hamle validasyonu ve pozisyon yönetimi (motor)
- **`react-chessboard`** — Görsel tahta bileşeni (drag & drop, custom stiller)

Ana sayfa puzzle'ı `PuzzleBoard.tsx`'de. Yeni bulmacalar için sadece FEN, `SOLUTION_FROM`, `SOLUTION_TO` değişkenlerini değiştirin — veya rastgele bulmaca listesinden çeken bir fonksiyon yazın.

## Deployment

### Vercel (önerilir — Next.js'in geliştiricisi)

1. Bu klasörü bir Git repo'ya push edin (GitHub, GitLab, Bitbucket)
2. [vercel.com/new](https://vercel.com/new) → repo'yu import edin
3. Environment variables (`RESEND_API_KEY` vb.) ekleyin
4. Deploy — otomatik build + edge CDN

### Diğer

- **Netlify** — `npm run build` + `.next` klasörünü deploy et (Netlify Next Runtime kullanır)
- **Cloudflare Pages** — Next.js on Pages adapter ile
- **Kendi sunucu** — `npm run build && npm start` + Nginx reverse proxy

## Performans

- Lighthouse hedefi: 95+ (Performance / Accessibility / Best Practices / SEO)
- İlk paint: `<1s` (3G'de)
- Bundle boyutu: `<200KB` (JS, gzip)

`react-chessboard` en büyük bağımlılık (~50KB) — sadece puzzle görünür olduğunda yükletilebilir (dynamic import) — bkz. `PuzzleBoard.tsx`.

## Erişilebilirlik

- Semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`)
- FAQ butonlarında `aria-expanded`
- `:focus-visible` outline (bordo)
- Klavye ile puzzle drag desteği (react-chessboard yerleşik)
- Renk kontrast oranı AAA (koyu metin/açık zemin)

## Lisans

Bu kod Lüleburgaz Satranç Spor Okulu'na aittir. Üretim ve yayın için sınırsız kullanım hakkı okulundur.

Kullanılan üçüncü parti kütüphaneler:
- Next.js — MIT
- React — MIT
- Tailwind CSS — MIT
- chess.js — BSD-2-Clause
- react-chessboard — MIT
- framer-motion — MIT
- Instrument Serif — SIL Open Font License
- DM Sans — SIL Open Font License
- JetBrains Mono — SIL Open Font License

---

Sorular / issue'lar için: `merhaba@luleburgazsatranc.com`
