import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: "Los's Auto Glass | Auto Glass Without The Lag-time",
  description: 'Fast, reliable, and affordable auto glass replacement and repair services in Utah. Call (385) 424-6781',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
