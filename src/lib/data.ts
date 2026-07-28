// Tüm site içeriği burada — CMS'e taşımak için tek noktadan yönetim

export const SCHOOL = {
  name: "Lüleburgaz Satranç Spor Okulu",
  shortName: "Lüleburgaz",
  founded: 2014,
  cities: ["Kırklareli", "Lüleburgaz"],
  address: "Yıldırım Mah. 34. Sk. No: 12/A, Lüleburgaz, Kırklareli",
  phone: "+90 288 417 00 00",
  whatsapp: "905000000000",
  email: "merhaba@luleburgazsatranc.com",
};

export const STATS = [
  { num: "2014", label: "Kuruluş Yılı" },
  { num: "640+", label: "Mezun Öğrenci" },
  { num: "48", label: "FIDE Dereceli Sporcu" },
  { num: "17", label: "Türkiye Şampiyonluğu" },
];

export type Program = {
  num: string;
  title: string;
  duration: string;
  freq: string;
  body: string;
  level: string;
};

export const PROGRAMS: Program[] = [
  {
    num: "01",
    title: "Bireysel Özel Ders",
    duration: "60 dk",
    freq: "Haftada 1–2",
    body: "Reyting hedefli, kişiye özel açılış repertuvarı ve zayıf yön analizi. Her ders sonrası PGN dosyası ve ödev.",
    level: "Tüm seviyeler",
  },
  {
    num: "02",
    title: "Grup Dersleri",
    duration: "90 dk",
    freq: "Haftada 1",
    body: "4–8 kişilik seviye grupları. Ortak açılış çalışması, blitz turnuvaları ve grup analizleri ile rekabetçi ortam.",
    level: "Başlangıç – İleri",
  },
  {
    num: "03",
    title: "Online Dersler",
    duration: "45–60 dk",
    freq: "Esnek",
    body: "Lichess ve Chess.com üzerinden canlı ders. Ekran paylaşımı, analiz odası ve kayıt hakkı dahil.",
    level: "Tüm seviyeler",
  },
  {
    num: "04",
    title: "Turnuva Hazırlık Kampı",
    duration: "3–5 gün",
    freq: "Turnuva öncesi",
    body: "Rakip analizi, açılış hazırlığı, oyun temposu ve turnuva psikolojisi üzerine yoğun program. Simülasyonlu maçlar.",
    level: "Orta – İleri",
  },
  {
    num: "05",
    title: "Analiz & Koçluk",
    duration: "90 dk",
    freq: "Aylık paket",
    body: "Kendi oyunlarınızın motor destekli derin analizi. Kritik pozisyonlar üzerinden hesaplama antrenmanı.",
    level: "Orta – İleri",
  },
  {
    num: "06",
    title: "Yaz & Kış Okulu",
    duration: "Yarım gün",
    freq: "Sömestr / yaz",
    body: "Tatil dönemlerinde iki haftalık yoğun program. Sabah teorik ders, öğleden sonra turnuva pratiği.",
    level: "8–16 yaş",
  },
];

export type Coach = {
  name: string;
  role: string;
  fide: "GM" | "IM" | "FM" | "CM" | "WGM" | "WIM" | "WFM";
  rating: number;
  bio: string;
  years: number;
};

export const COACHES: Coach[] = [
  {
    name: "Berkan Hacıoğlu",
    role: "Kurucu · Başantrenör",
    fide: "FM",
    rating: 2314,
    bio: "İstanbul Üniversitesi mezunu. TSF 1. kademe antrenör lisansı. Bölgesel şampiyonalar ve kulüp organizasyonlarında aktif antrenör.",
    years: 16,
  },
  {
    name: "Özgür Kantar",
    role: "Kurucu · Antrenör",
    fide: "CM",
    rating: 2198,
    bio: "Kulüp kurucu ortağı. Çocuk ve genç gruplarında seviye gelişimi, turnuva hazırlığı.",
    years: 20,
  },
  {
    name: "Mert Aksoy",
    role: "Antrenör · Analiz",
    fide: "CM",
    rating: 2087,
    bio: "Trakya Üniversitesi bilgisayar mühendisi. Motor destekli analiz ve açılış hazırlığı sorumlusu.",
    years: 5,
  },
  {
    name: "Zeynep Kaya",
    role: "Genç Sporcu Koçu",
    fide: "FM",
    rating: 2245,
    bio: "Balkan Genç Şampiyonu 2018. FIDE Trainer sertifikalı. Turnuva psikolojisi ve zaman yönetimi.",
    years: 6,
  },
];

export type Tournament = {
  date: string;
  month: string;
  name: string;
  category: string;
  location: string;
  spots: string;
};

export const TOURNAMENTS: Tournament[] = [
  { date: "15 AĞU", month: "2026", name: "Lüleburgaz Yaz Kupası", category: "FIDE Ratingli · Açık", location: "Kültür Merkezi", spots: "128 sporcu" },
  { date: "12 EYL", month: "2026", name: "Kırklareli Genç Yıldızlar", category: "U8 – U16", location: "Trakya Ün. Kongre Salonu", spots: "96 sporcu" },
  { date: "18 EKI", month: "2026", name: "Trakya Bölge Şampiyonası", category: "FIDE Ratingli · Klasik", location: "Edirne", spots: "200 sporcu" },
  { date: "05 KAS", month: "2026", name: "Cumhuriyet Kupası", category: "Hızlı Satranç · Açık", location: "Lüleburgaz Belediyesi", spots: "160 sporcu" },
];

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Oğlum iki yıldır burada. Sadece satranç değil, konsantrasyon ve sabır öğreniyor. Antrenörlerin her öğrenciyi ayrı ayrı takip etmesi bizim için çok değerli.",
    author: "Ayşe Y.",
    role: "Öğrenci velisi · Berk (10 yaş)",
  },
  {
    quote:
      "İlk turnuvamda çok gergindim ama Zeynep hocanın hazırlığı sayesinde odaklanabildim. Bir yılda 400 reyting kazandım.",
    author: "Ege D.",
    role: "Öğrenci · 11 yaş · 1620 ELO",
  },
  {
    quote:
      "Kızım şimdi bölge şampiyonalarına katılıyor. Küçük şehirde bu kalitede bir eğitim almak beklemediğimiz bir fırsattı.",
    author: "Mehmet K.",
    role: "Öğrenci velisi · Nisa (13 yaş)",
  },
];

export type BlogPost = {
  cat: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  read: string;
  piece: "wK" | "wQ" | "wR" | "wB" | "wN" | "wP" | "bK" | "bQ" | "bR" | "bB" | "bN" | "bP";
  slug: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    cat: "AÇILIŞ TEORİSİ",
    title: "İtalyan Oyunu: Klasik hattın modern yorumu",
    excerpt: "Yüzyıllar öncesinden gelen Giuoco Piano bugün hâlâ elit turnuvalarda görülüyor. Ana varyantlar ve tuzaklar.",
    author: "Kadir Yıldız",
    date: "18 Tem 2026",
    read: "8 dk",
    piece: "wN",
    slug: "italyan-oyunu-modern-yorum",
  },
  {
    cat: "ORTA OYUN",
    title: "İzole vezir piyonu: güç mü, zayıflık mı?",
    excerpt: "IQP pozisyonlarında hem beyaz hem siyah için stratejik anahtarlar. Karpov ve Kasparov klasikleri üzerinden.",
    author: "Mert Aksoy",
    date: "02 Tem 2026",
    read: "12 dk",
    piece: "wQ",
    slug: "izole-vezir-piyonu",
  },
  {
    cat: "ÇOCUK PSİKOLOJİSİ",
    title: "İlk turnuva: kaybetmeyi nasıl öğretmeli?",
    excerpt: "Çocuk sporcular için turnuva sonrası konuşmalar. Ebeveynler ve antrenörler için pratik bir rehber.",
    author: "Elif Demirtaş",
    date: "24 Haz 2026",
    read: "6 dk",
    piece: "bK",
    slug: "ilk-turnuva-kaybetmeyi-ogretmek",
  },
];

export const FAQ_ITEMS = [
  {
    q: "Kaç yaşındaki çocuklar başlayabilir?",
    a: "Genellikle 6 yaşında başlıyoruz. Bu yaşta oyunun temel kurallarını öğrenmek ve odaklanma süresini geliştirmek için uygundur. Daha küçük yaşta motivasyonu yüksek çocuklar için de bireysel değerlendirme yapıyoruz.",
  },
  {
    q: "Hiç satranç bilmeyen bir çocuk için uygun mudur?",
    a: 'Kesinlikle. Yeni başlayan öğrencilerimiz için özel "sıfırdan başlayanlar" grup dersi bulunuyor. İlk sekiz haftada taşların hareketi, temel motifler ve turnuva etiketi öğretilir.',
  },
  {
    q: "Ders programı nasıl oluşturuluyor?",
    a: "İlk ücretsiz görüşmede öğrencinin seviyesi ve hedefleri belirlenir. Buna göre haftalık ders sayısı, bireysel/grup dengesi ve turnuva takvimi planlanır. Program üç ayda bir gözden geçirilir.",
  },
  {
    q: "FIDE reyting turnuvasına ne zaman girebilirim?",
    a: "Türkiye Satranç Federasyonu tarafından belirlenen kurallara göre, resmi bir kulüp lisansına sahip öğrenciler FIDE ratingli turnuvalara katılabilir. Genellikle 1000+ oyun kuvvetine ulaşan öğrencilerimizi yönlendiriyoruz.",
  },
  {
    q: "Online dersler yüz yüze kadar verimli mi?",
    a: "Belirli hedeflerde evet. Analiz, açılış çalışması ve bireysel dersler online formatta çok verimli. Ancak grup dinamiği ve turnuva pratiği için yüz yüze eğitim vazgeçilmezdir. Hibrit model öneriyoruz.",
  },
  {
    q: "Turnuva harçlarını okul mu karşılıyor?",
    a: "Kayıtlı öğrencilerimiz için Kırklareli ve Lüleburgaz içindeki turnuva harçları paket ücrete dahildir. Şehir dışı turnuvalarda yol ve konaklama velimize aittir; grup organizasyonlarında koordinasyonu okul yapar.",
  },
  {
    q: "Deneme dersi ücretli mi?",
    a: "İlk deneme dersimiz tamamen ücretsizdir. Grup dersine oturarak öğrencinin ortamı deneyimlemesini, ardından antrenörle birebir kısa bir değerlendirme yapmasını öneriyoruz.",
  },
];

export const NAV_LINKS = [
  { label: "Hakkımızda", href: "#hakkimizda" },
  { label: "Programlar", href: "#programlar" },
  { label: "Eğitmenler", href: "#egitmenler" },
  { label: "Turnuvalar", href: "#turnuvalar" },
  { label: "Blog", href: "#blog" },
  { label: "İletişim", href: "#iletisim" },
];

// Progress chart data — Ege D. rating growth
export const PROGRESS_DATA = [
  { m: 0, r: 850 }, { m: 2, r: 920 }, { m: 4, r: 1010 }, { m: 6, r: 1060 },
  { m: 8, r: 1140 }, { m: 10, r: 1180 }, { m: 12, r: 1240 }, { m: 14, r: 1320 },
  { m: 16, r: 1380 }, { m: 18, r: 1420 }, { m: 20, r: 1490 }, { m: 22, r: 1550 },
  { m: 24, r: 1620 },
];

// Unicode chess pieces (for decorative use — actual board uses react-chessboard SVG pieces)
export const PIECES: Record<string, string> = {
  wK: "\u2654", wQ: "\u2655", wR: "\u2656", wB: "\u2657", wN: "\u2658", wP: "\u2659",
  bK: "\u265A", bQ: "\u265B", bR: "\u265C", bB: "\u265D", bN: "\u265E", bP: "\u265F",
};
