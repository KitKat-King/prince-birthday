import "bootstrap/dist/css/bootstrap-grid.min.css";
import "./globals.css";
import SmoothScroll from "@/components/providers/smooth-scroll";

export const metadata = {
  title: "Prince — Chapter 16",
  description:
    "A private birthday transmission for Prince. Chapter 16: it's your era.",
  applicationName: "Prince — Chapter 16",
  authors: [{ name: "From your best friend" }],
  openGraph: {
    title: "Prince — Chapter 16",
    description: "A private birthday transmission. Unlock the era.",
    type: "website",
    images: [{ url: "/images/cover.webp", width: 1024, height: 1365, alt: "Prince — Chapter 16" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Prince — Chapter 16",
    description: "A private birthday transmission. Unlock the era.",
    images: ["/images/cover.webp"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#07070a",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="a" suppressHydrationWarning>
      <body>
        <audio id="site-audio" src="/audio/bg.mp3" loop preload="none" />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
