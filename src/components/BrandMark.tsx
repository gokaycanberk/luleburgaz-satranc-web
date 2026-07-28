import Image from "next/image";
import { SCHOOL } from "@/lib/data";
import clsx from "clsx";

type BrandMarkProps = {
  size?: number;
  className?: string;
  priority?: boolean;
  /** Decorative watermark — empty alt */
  decorative?: boolean;
  bordered?: boolean;
};

/** Circular club crest — single source for nav, hero watermark, footer. */
export default function BrandMark({
  size = 64,
  className,
  priority = false,
  decorative = false,
  bordered = true,
}: BrandMarkProps) {
  return (
    <span
      className={clsx(
        "relative inline-block shrink-0 overflow-hidden rounded-full bg-paper",
        bordered && "border border-line-soft",
        className
      )}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.jpeg"
        alt={decorative ? "" : `${SCHOOL.name} logo`}
        fill
        sizes={`${size}px`}
        className="object-cover"
        priority={priority}
        aria-hidden={decorative || undefined}
      />
    </span>
  );
}
