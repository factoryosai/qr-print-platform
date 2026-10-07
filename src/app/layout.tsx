import type { Metadata, Viewport } from 'next'
import './globals.css'
import CssLoader from '@/components/CssLoader'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f43f64',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://qr-print-platform-theta.vercel.app'),
  title: {
    default: 'Qr To Print | Scan, Upload, Print Automatically',
    template: '%s | Qr To Print',
  },
  description: 'QR-based document printing service for local print shops in India. Customers scan the QR, upload documents on their phone, and it prints automatically.',
  keywords: ['print shop QR code', 'document printing India', 'scan to print', 'QR Print', 'Mobile Upload Print', 'Cyber Cafe Print', 'automated printing software', 'A4 printing service'],
  authors: [{ name: 'Kaushik Savaliya', url: 'https://qr-print-platform-theta.vercel.app' }],
  creator: 'Kaushik Savaliya',
  publisher: 'Qr To Print',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
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
  openGraph: {
    title: 'Qr To Print | Scan, Upload, Print Automatically',
    description: 'QR-based document printing service for local print shops. Customers scan QR, upload document, the shop prints automatically.',
    url: 'https://qr-print-platform-theta.vercel.app',
    siteName: 'Qr To Print',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Qr To Print - Scan, Upload, Print',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qr To Print | Scan, Upload, Print Automatically',
    description: 'QR-based document printing service for local print shops in India.',
    creator: '@QrToPrint',
    images: ['/og-image.png'],
  },
  verification: {
    google: 'google-site-verification-placeholder',
  },
  other: {
    'geo.region': 'IN-GJ',
    'geo.placename': 'Gujarat',
    'geo.position': '22.2587;71.1924',
    'ICBM': '22.2587, 71.1924',
    'speakable': '{"@type":"SpeakableSpecification","xpath":["/html/head/title","/html/head/meta[@name=\'description\']/@content"]}',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://qr-print-platform-theta.vercel.app/#organization',
      name: 'Qr To Print',
      url: 'https://qr-print-platform-theta.vercel.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://qr-print-platform-theta.vercel.app/logo.png',
      },
      sameAs: [],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-7069525795',
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['en', 'hi', 'gu'],
      }
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://qr-print-platform-theta.vercel.app/#software',
      name: 'Qr To Print Platform',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Windows 10+, Android, iOS',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'INR'
      }
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://qr-print-platform-theta.vercel.app/#localbusiness',
      name: 'Qr To Print HQ',
      telephone: '+91-7069525795',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Gujarat',
        addressRegion: 'GJ',
        addressCountry: 'IN'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '22.2587',
        longitude: '71.1924'
      }
    }
  ]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet" />
        <meta name="description" content="QR-based document printing service for local print shops in India. Customers scan the QR, upload documents on their phone, and it prints automatically. Perfect for Cyber Cafes and stationery shops." />
        <CssLoader />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
