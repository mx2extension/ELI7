
import type { Metadata } from 'next';
import Script from 'next/script';
import { Space_Grotesk, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MovingGlobeBg from '@/components/ui/MovingGlobeBg';

// Load the original ELI7 fonts
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-bricolage-grotesque',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.eli7foundation.org'),
  title: {
    default: 'ELI7 Foundation — We are a dedicated women-led organization building a framework where vulnerable populations, persons with disabilities, and underserved communities thrive as equal participants in society—especially women and girls—through education, health, economic empowerment and protection. Through your support, we break barriers and build sustainable futures across Nigeria.',
    template: '%s | ELI7 Foundation',
  },
  description: 'Extend Love Initiative Humanitarian Foundation - Women-led foundation strategically empowering communities, women, young girls, children, and persons with disabilities through sustainable structures, advocacy, healthcare, and education across Bauchi State and Nigeria.',
keywords: [
  // Brand & Domain
  'ELI7',
  'ELI7 Foundation',
  'ELI7 NGO',
  'Extend Love Initiative',
  'Extend Love Initiative Humanitarian Foundation',

  // Hyper-Local & Regional Geography
  'NGO in Gwalameji Yelwa',
  'NGO in Bauchi State',
  'Nonprofit organization in Bauchi',
  'Charity organization in Northern Nigeria',
  'Community development Bauchi',

  // Core Programs & Beneficiaries
  'Women-led NGO in Nigeria',
  'Women empowerment Nigeria',
  'Girl child education Northern Nigeria',
  'Menstrual hygiene campaign Nigeria',
  'Menstrual health education Bauchi',
  'Sanitary kit distribution Nigeria',
  'Disability rights advocacy Nigeria',
  'Persons with disabilities inclusion Nigeria',

  // Donor, Partner & Volunteer Intent
  'Donate to NGO in Bauchi State',
  'Support NGO in Northern Nigeria',
  'Donate to NGO in Nigeria',
  'Donate to NGO in Africa',
  'CSR partnership NGO Nigeria',
  'Volunteer opportunities Bauchi State',
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
    url: 'https://www.eli7foundation.org',
    title: 'ELI7 Foundation — Women-led. Youth-centred. Unapologetic.',
    description: 'Extend Love Initiative Humanitarian Foundation - Women-led foundation strategically empowering communities, women, young girls, children, and persons with disabilities through sustainable structures, advocacy, healthcare, and education across Bauchi State and Nigeria.',
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
    description: 'Extend Love Initiative Humanitarian Foundation - Women-led foundation strategically empowering communities, women, young girls, children, and persons with disabilities through sustainable structures, advocacy, healthcare, and education across Bauchi State and Nigeria.',
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
    name: 'Extend Love Initiative Humanitarian Foundation (ELI7 Foundation)',
    url: 'https://www.eli7foundation.org',
    logo: 'https://www.eli7foundation.org/logo.png',
    email: 'eli7foundation@gmail.com',
    telephone: '+2349017380098',
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Bauchi State',
      addressCountry: 'NG',
    },
    sameAs: [
      'https://www.eli7foundation.org',
    ],
  };

  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const showMovingMap =
    process.env.NEXT_PUBLIC_ENABLE_MOVING_MAP !== 'false';

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />

            <Script
              id="google-analytics"
              strategy="afterInteractive"
            >
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

      <body
        className={`
          ${spaceGrotesk.variable}
          ${bricolageGrotesque.variable}
          bg-[#F4F1EA]
          text-[#0A0A0A]
          antialiased
          relative
          overflow-x-hidden
        `}
      >
        {showMovingMap && <MovingGlobeBg />}

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />

          <main className="flex-grow">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
