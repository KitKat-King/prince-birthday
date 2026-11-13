import './globals.css';

export const metadata = {
  title: 'UI Pro Max Ultra Frontend',
  description: 'High-fidelity frontend UI powered by Next.js, React, Tailwind CSS, and Framer Motion',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        {children}
      </body>
    </html>
  );
}
