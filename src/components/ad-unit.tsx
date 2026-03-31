"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type AdFormat = "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";

interface AdUnitProps {
  slot: string;
  format?: AdFormat;
  responsive?: boolean;
  lazy?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";

export function AdUnit({
  slot,
  format = "auto",
  responsive = true,
  lazy = false,
  className = "",
  style,
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(!lazy);
  const pushed = useRef(false);

  useEffect(() => {
    if (!lazy) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (adRef.current) observer.observe(adRef.current);
    return () => observer.disconnect();
  }, [lazy]);

  useEffect(() => {
    if (!isVisible || !ADSENSE_CLIENT_ID || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, [isVisible]);

  if (!ADSENSE_CLIENT_ID) return null;

  return (
    <div className={`ad-container ${className}`} ref={adRef}>
      {isVisible && (
        <ins
          className="adsbygoogle"
          style={style ?? { display: "block" }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slot}
          data-ad-format={format}
          {...(responsive && { "data-full-width-responsive": "true" })}
        />
      )}
    </div>
  );
}

export function HeaderAd({ slot }: { slot: string }) {
  return (
    <AdUnit
      slot={slot}
      format="horizontal"
      className="my-4"
      style={{ display: "block", minHeight: "90px" }}
    />
  );
}

export function InContentAd({ slot }: { slot: string }) {
  return (
    <AdUnit
      slot={slot}
      format="fluid"
      lazy
      className="my-6"
      style={{ display: "block", textAlign: "center" }}
    />
  );
}

export function SidebarAd({ slot }: { slot: string }) {
  return (
    <AdUnit
      slot={slot}
      format="rectangle"
      lazy
      className="my-4"
      style={{ display: "block", minHeight: "250px" }}
    />
  );
}

export function FooterAd({ slot }: { slot: string }) {
  return (
    <AdUnit
      slot={slot}
      format="horizontal"
      lazy
      className="mt-8"
      style={{ display: "block", minHeight: "90px" }}
    />
  );
}
