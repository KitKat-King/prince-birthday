import { Space_Grotesk, Syne } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-grotesk",
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export const metadata = {
  title: "Prince — The Birthday Experience 👑",
  description: "A celebration of Prince · 18 November 2010 · Turning 16",
  openGraph: {
    title: "Happy Birthday Prince 👑",
    description: "A special birthday experience for Prince. 18 November 2010.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${grotesk.variable} ${syne.className} bg-black text-white antialiased min-h-screen overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
