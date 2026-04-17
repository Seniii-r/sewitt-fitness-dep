import type { Metadata } from "next"
import type { ReactNode } from "react"
import Script from "next/script"
import "@fontsource-variable/inter/index.css"
import "./globals.css"

export const metadata: Metadata = {
  title: "Sewitt Fitness",
  description: "Sewitt Fitness",
  icons: {
    icon: "/img/Sewitt_logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script
          src="https://plausible.io/js/pa-3TQn8LF77a5bMZjmvXJsv.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`
            window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
            plausible.init()
          `}
        </Script>
        {children}
      </body>
    </html>
  )
}
