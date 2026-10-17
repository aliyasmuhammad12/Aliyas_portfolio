import { Github, Linkedin } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";

function UpworkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M18.561 13.158c-1.102 0-2.135-.467-3.074-1.227l.228-1.109.008-.042c.207-1.143.849-3.06 2.839-3.06 1.492 0 2.703 1.212 2.703 2.703-.001 1.489-1.212 2.702-2.704 2.702zm0-8.14c-2.539 0-4.51 1.649-5.31 4.366-1.22-1.834-2.148-4.036-2.687-5.892H7.489v11.183c-.002 1.426-1.158 2.725-2.644 2.722-1.487-.003-2.642-1.3-2.644-2.728V3.492H0v11.183c0 2.729 2.211 4.938 4.938 4.938 2.728 0 4.938-2.21 4.938-4.938V9.099c.988 1.497 2.297 2.728 3.793 3.487 1.032.557 2.158.84 3.33.84 3.875 0 7.017-3.14 7.017-7.016-.001-3.876-3.143-7.017-7.018-7.017z" />
    </svg>
  );
}

export function Footer() {
  // Static year avoids unstable `Date` during Next.js prerender (update manually or via site config).
  const year = 2026;

  return (
    <footer className="mt-auto border-t border-border bg-surface/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="font-semibold text-foreground">{siteConfig.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{siteConfig.tagline}</p>
          <p className="mt-3 text-sm text-muted-foreground">{siteConfig.locationNote}</p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-foreground">Connect</p>
          <ul className="flex flex-wrap gap-3">
            <li>
              <Link
                href={siteConfig.socials.github}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="size-4" aria-hidden />
                GitHub
              </Link>
            </li>
            <li>
              <Link
                href={siteConfig.socials.linkedin}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="size-4" aria-hidden />
                LinkedIn
              </Link>
            </li>
            <li>
              <Link
                href={siteConfig.socials.upwork}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent"
                target="_blank"
                rel="noopener noreferrer"
              >
                <UpworkIcon className="size-4" />
                Upwork
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {year} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  );
}
