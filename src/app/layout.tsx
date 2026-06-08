import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Braj Nidhi Guesthouse | Divine Stay in Vrindavan",
  description: "Experience the divine and royal hospitality at Braj Nidhi Guesthouse, located in the heart of Vrindavan near Bankey Bihari Temple.",
};

import LoadingTransition from "@/components/LoadingTransition";
import { MusicProvider } from "@/lib/MusicContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css"
        />
        <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js" async></script>
      </head>
      <body className="index-page antialiased">
        <MusicProvider>
          <LoadingTransition />
          {children}
        </MusicProvider>
        {/* Chatling AI Chatbot — inject after page is interactive so config is set first */}
        <Script id="chatling-embed" strategy="afterInteractive">
          {`
            window.chtlConfig = { chatbotId: "6539271511" };
            (function() {
              var s = document.createElement("script");
              s.async = true;
              s.setAttribute("data-id", "6539271511");
              s.id = "chtl-script";
              s.type = "text/javascript";
              s.src = "https://chatling.ai/js/embed.js";
              document.head.appendChild(s);
            })();
          `}
        </Script>
      </body>
    </html>
  );
}
