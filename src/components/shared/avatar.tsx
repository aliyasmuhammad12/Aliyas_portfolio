"use client";

import Image from "next/image";
import { useState } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

type AvatarProps = {
  className?: string;
  size?: number;
};

export function Avatar({ className, size = 40 }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const initials = initialsFromName(siteConfig.name);

  if (failed) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-surface text-sm font-semibold text-accent ring-1 ring-border",
          className,
        )}
        style={{ width: size, height: size }}
        aria-hidden
      >
        {initials}
      </div>
    );
  }

  return (
    <Image
      src="/images/aliyas.jpg"
      alt=""
      width={size}
      height={size}
      className={cn("rounded-full object-cover ring-1 ring-border", className)}
      onError={() => setFailed(true)}
    />
  );
}
