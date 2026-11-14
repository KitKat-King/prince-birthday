import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Prince — The Birthday Experience",
  description: "A celebration for Prince · 18 November 2010",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased selection:bg-white/20">
        {children}
      </body>
    </html>
  );
}
