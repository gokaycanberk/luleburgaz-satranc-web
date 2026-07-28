import Image from "next/image";

type ImageBandProps = {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  objectPosition?: string;
};

/** Full-viewport photo chapter — never a thin strip. */
export default function ImageBand({
  src,
  alt,
  caption,
  priority = false,
  objectPosition = "center",
}: ImageBandProps) {
  return (
    <section className="w-full bg-paper" aria-label={alt}>
      <div className="relative w-full min-h-[100svh] overflow-hidden bg-paper-3">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition }}
        />
      </div>
      {caption ? (
        <div className="container-lg py-5 md:py-6">
          <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-3">
            {caption}
          </p>
        </div>
      ) : null}
    </section>
  );
}
