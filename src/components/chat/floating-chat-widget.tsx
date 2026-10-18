"use client";

import { MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { PortfolioChat } from "@/components/chat/portfolio-chat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FloatingChatWidget() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50 flex w-[min(100vw-2rem,24rem)] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-2xl transition-all sm:bottom-6 sm:right-6",
          open ? "opacity-100" : "pointer-events-none translate-y-2 opacity-0",
        )}
        id={panelId}
        role="dialog"
        aria-modal="true"
        aria-label="Ask My Portfolio chat"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Ask My Portfolio</p>
            <Link href="/demo" className="text-xs text-accent hover:underline">
              Open full demo
            </Link>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close chat"
            onClick={() => {
              setOpen(false);
              buttonRef.current?.focus();
            }}
          >
            <X className="size-4" />
          </Button>
        </div>
        <div className="h-[min(70vh,32rem)]">
          <PortfolioChat className="h-full min-h-0 rounded-none border-0" showSuggestedQuestions />
        </div>
      </div>

      {!open ? (
        <Button
          ref={buttonRef}
          type="button"
          className="fixed bottom-4 right-4 z-50 h-12 rounded-full px-4 shadow-lg sm:bottom-6 sm:right-6"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen(true)}
        >
          <MessageCircle className="size-4" aria-hidden />
          Ask AI
        </Button>
      ) : null}
    </>
  );
}
