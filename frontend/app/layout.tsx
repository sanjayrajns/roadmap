import type { Metadata } from 'next';
import './globals.css';

import { Plus_Jakarta_Sans } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  variable: '--font-jakarta'
});

export const metadata: Metadata = {
  title: 'AI Dev Roadmap',
  description: 'AI-powered personalized developer roadmaps based on roadmap.sh',
};

import Navbar from '@/components/ui/navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-white text-zinc-950 font-sans antialiased selection:bg-zinc-900 selection:text-white ${jakarta.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
