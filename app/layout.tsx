import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import { env } from '@/lib/env';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScrollProgressBar } from '@/components/layout/ScrollProgressBar';
import { SectionNavigationRail } from '@/components/layout/SectionNavigationRail';
import { SceneContainer } from '@/components/3d/SceneContainer';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: 'Prince Rana | Software Engineer & AI',
    template: '%s | Prince Rana',
  },
  description:
    'Portfolio of Prince Rana — Software Development Engineer specializing in full-stack architecture, algorithmic problem solving, and intelligent systems.',
  keywords: [
    'Prince Rana',
    'Software Engineer',
    'Full Stack Developer',
    'AI Engineer',
    'Competitive Programming',
    'Codeforces Specialist',
    'LeetCode',
    'React',
    'Next.js',
    'TypeScript',
  ],
  authors: [{ name: 'Prince Rana', url: env.NEXT_PUBLIC_SITE_URL }],
  creator: 'Prince Rana',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: env.NEXT_PUBLIC_SITE_URL,
    title: 'Prince Rana | Software Engineer & AI',
    description:
      'High-performance full-stack engineering, algorithmic problem solving, and intelligent systems.',
    siteName: 'Prince Rana Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prince Rana | Software Engineer & AI',
    description:
      'Software Development Engineer specializing in full-stack systems and artificial intelligence.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Prince Rana',
    jobTitle: 'Software Development Engineer',
    url: env.NEXT_PUBLIC_SITE_URL,
    sameAs: [
      'https://github.com/RANAPRINCE06',
      'https://www.linkedin.com/in/prince-rana-0b622b32a',
      'https://codeforces.com/profile/rana_prince.1806',
      'https://leetcode.com/u/RANA_PRINCE_06/',
    ],
  };

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body bg-background-primary text-text-primary antialiased selection:bg-accent-cyan/30 selection:text-text-primary">
        <SmoothScrollProvider>
          <ScrollProgressBar />
          <SceneContainer />
          <Navbar />
          <SectionNavigationRail />
          <main className="relative z-content min-h-screen overflow-x-clip pt-28 pb-20">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

