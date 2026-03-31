import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Manrope, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '800'],
  variable: '--font-headline',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Liquid Rose — Real-Time Process Monitor',
  description: 'Production-quality real-time process monitoring dashboard with refractive telemetry analysis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body style={{ background: 'var(--surface)' }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
