import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MovingGlobeBg from '@/components/ui/MovingGlobeBg';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.eli7.ngo'),
  title: {
    default: 'ELI7 Foundation — Women-led. Youth-centred. Unapologetic.',
    template: '%s | ELI7 Foundation',
  },
  description: 'Extend Love Initiative Foundation - Empowering communities, young girls, women, and persons with disabilities through sustainable structures, healthcare, and education across Bauchi State and Nigeria.',
  keywords: [
    'ELI7 Foundation',
    'Extend Love Initiative Foundation',
    'NGO in Bauchi State',
    'Women empowerment Nigeria',
    'Menstrual hygiene campaign',
    'Disability rights advocacy Nigeria',
    'Community development Bauchi',
  ],
  authors: [{ name: 'ELI7 Foundation' }],
  creator: 'ELI7 Foundation',
  publisher: 'ELI7 Foundation',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://www.eli7.ngo',
    title: 'ELI7 Foundation — Women-led. Youth-centred. Unapologetic.',
    description: 'Extend Love Initiative Foundation - Empowering communities through healthcare, education, and youth initiatives in Bauchi State, Nigeria.',
    siteName: 'ELI7 Foundation',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'ELI7 Foundation Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ELI7 Foundation — Women-led. Youth-centred. Unapologetic.',
    description: 'Extend Love Initiative Foundation - Empowering communities through healthcare, education, and youth initiatives.',
    images: ['/logo.png'],
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Extend Love Initiative Foundation (ELI7 Foundation)',
    url: 'https://www.eli7.ngo',
    logo: 'https://www.eli7.ngo/logo.png',
    email: 'eli7foundation@gmail.com',
    telephone: '+2349017380098',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Bauchi State',
      addressCountry: 'NG',
    },
    sameAs: [
      'https://www.eli7.ngo',
    ],
  };

  // Get the Google Analytics ID from environment variables
  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  // Show the map unless explicitly turned off
  const showMovingMap = process.env.NEXT_PUBLIC_ENABLE_MOVING_MAP !== 'false';

  return (
    <html lang="en">
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {/* Google Analytics Script (Only renders if GA_ID exists) */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){window.dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      
      {/* Original white background and black text */}
      <body className="bg-[#FFFFFE] text-[#0A0A0A] antialiased relative overflow-x-hidden">
        
        {/* Render the moving map background */}
        {showMovingMap && <MovingGlobeBg />}

        {/* Main Application Container */}
        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}