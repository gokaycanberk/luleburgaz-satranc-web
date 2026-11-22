"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";

/** User + domain ayrı tutulur; HTML kaynağında tek parça mailto azalır. */
const USER = "luleburgazsatrancsporkulubu";
const DOMAIN = "gmail.com";

type EmailLinkProps = {
  className?: string;
  children?: React.ReactNode;
  /** true: görünür metin de e-posta olur */
  showAddress?: boolean;
};

export default function EmailLink({
  className,
  children,
  showAddress = false,
}: EmailLinkProps) {
  const [href, setHref] = useState<string | undefined>(undefined);
  const [label, setLabel] = useState(children ?? "E-posta");

  useEffect(() => {
    const address = `${USER}@${DOMAIN}`;
    setHref(`mailto:${address}`);
    if (showAddress) setLabel(address);
  }, [showAddress]);

  return (
    <a
      href={href}
      className={clsx(className, !href && "pointer-events-none")}
      onClick={(e) => {
        if (!href) e.preventDefault();
      }}
    >
      {label}
    </a>
  );
}
