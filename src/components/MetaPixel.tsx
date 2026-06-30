"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { FACEBOOK_PIXEL_ID } from "@/lib/site";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Meta (Facebook) Pixel.
 *
 * The inline bootstrap script defines `fbq`, loads fbevents.js, and fires the
 * first PageView. Because the App Router navigates on the client without a full
 * page reload, the standard snippet would only ever record one PageView — so we
 * fire a fresh PageView on each subsequent route change via the effect below.
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    // The bootstrap script already counted the initial load; skip it here to
    // avoid double-counting, then track every client-side navigation after.
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FACEBOOK_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* Intentional 1x1 tracking beacon — next/image can't run in <noscript>. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${FACEBOOK_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
