import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

export const metadata = {
  title: "Prince — Chapter 16",
  description: "A birthday transmission for Prince.",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
