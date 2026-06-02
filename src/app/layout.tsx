import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Braj Nidhi Guesthouse | Divine Stay in Vrindavan",
  description: "Experience the divine and royal hospitality at Braj Nidhi Guesthouse, located in the heart of Vrindavan near Bankey Bihari Temple.",
};

import LoadingTransition from "@/components/LoadingTransition";
import { MusicProvider } from "@/lib/MusicContext";
import SPDivineBar from "@/components/SPDivineBar";

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
        {/* Chatling AI Chatbot */}
        <script dangerouslySetInnerHTML={{ __html: `window.chtlConfig = { chatbotId: "6846893215" }` }} />
        <script async data-id="6846893215" id="chtl-script" src="https://chatling.ai/js/embed.js" />
      </head>
      <body className="index-page antialiased">
        <MusicProvider>
          <SPDivineBar />
          <LoadingTransition />
          {children}
        </MusicProvider>

      </body>
    </html>
  );
}
