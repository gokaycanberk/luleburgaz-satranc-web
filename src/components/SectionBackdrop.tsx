import Image from "next/image";

type SectionBackdropProps = {
  src: string;
  /** 0–1 how strong the photo shows through (before paper wash) */
  strength?: number;
  /** object-position CSS value */
  position?: string;
  /** dark wash for dark sections */
  tone?: "paper" | "ink";
};

/** Soft full-bleed photo behind a text section — not a hero, just atmosphere. */
export default function SectionBackdrop({
  src,
  strength = 0.22,
  position = "center",
  tone = "paper",
}: SectionBackdropProps) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: position, opacity: strength }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            tone === "ink"
              ? "linear-gradient(180deg, rgba(20,19,17,0.88) 0%, rgba(20,19,17,0.92) 100%)"
              : "linear-gradient(180deg, rgba(245,242,234,0.88) 0%, rgba(245,242,234,0.94) 100%)",
        }}
      />
    </div>
  );
}
