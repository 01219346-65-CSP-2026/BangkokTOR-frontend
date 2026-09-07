import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Noto_Sans_Thai,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { Providers } from "./providers";

/*
 * Every face declares its weights explicitly. Without a `weight` array the
 * Google loader ships 400 alone, and every `font-medium` / `font-semibold` in
 * the app becomes a browser-synthesized fake bold — smeared strokes, wrong
 * letterfit. That was shipping across all four families.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// Thai coverage matters: the procurement data this app surfaces is Thai, and the
// Latin display face has no Thai glyphs. Thai titles carry the page, so they
// need genuine weight contrast rather than a synthesized one.
const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "BangkokTOR",
  description:
    "Search and track Bangkok government procurement terms of reference.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      // Thai is the default; LanguageProvider updates this when the reader
      // switches, and on hydration from their stored choice.
      lang="th"
      className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${notoSansThai.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <Providers>
          <LanguageProvider>{children}</LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
