"use client";

import { useState } from "react";

export function Avatar({
  src,
  initials,
  size = 96,
  className = "",
}: {
  src?: string | null;
  initials: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-surface-2 ring-1 ring-border ${className}`}
      style={{ width: size, height: size }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={initials}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center font-medium text-muted"
          style={{ fontSize: size * 0.34 }}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
