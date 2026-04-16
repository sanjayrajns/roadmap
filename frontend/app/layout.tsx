import type { Metadata } from 'next';
import './globals.css';

import { Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';

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
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-100 font-sans antialiased selection:bg-zinc-900 selection:text-white transition-colors duration-300 ${jakarta.variable}`}>
        <ThemeProvider>
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

