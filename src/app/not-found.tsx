import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="font-serif italic text-[200px] leading-none text-bordo mb-6">404</div>
        <h1 className="font-serif text-[40px] leading-[1.1] mb-4">Sayfa bulunamadı</h1>
        <p className="text-ink-2 mb-8">Aradığınız sayfa taşınmış veya silinmiş olabilir.</p>
        <Link href="/" className="btn btn-primary">
          Ana sayfaya dön <span className="arrow-hover">→</span>
        </Link>
      </div>
    </div>
  );
}
