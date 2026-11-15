import { Comfortaa, Shantell_Sans } from "next/font/google";
import "./globals.css";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-comfortaa",
  display: "swap",
});

const shantell = Shantell_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-shantell",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "Prince — The Birthday Experience 👑",
  description: "A celebration of Prince · 18 November 2010",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" data-theme="dark">
      <body
        className={`${shantell.className} antialiased bg-black text-white selection:bg-white/20 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
