import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Qr To Print | Scan, Upload, Pay, Print',
  description: 'Qr To Print connects customer phone uploads with local print shops and Windows printers.',
  keywords: ['QR Print', 'Print Shop', 'Mobile Upload Print', 'Print Agent', 'Cyber Cafe Print'],
  openGraph: {
    title: 'Qr To Print | Scan, Upload, Pay, Print',
    description: 'Qr To Print connects customer phone uploads with local print shops and Windows printers.',
    url: 'https://qrtoprint.in',
    siteName: 'Qr To Print',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qr To Print | Scan, Upload, Pay, Print',
    description: 'Connects customer phone uploads with local print shops.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" rel="stylesheet" />
        <link href="https://qrtoprint.in/assets/front-redesign.css" rel="stylesheet" />
        <link href="https://qrtoprint.in/assets/proof-redesign.css" rel="stylesheet" />
      </head>
      <body>
        {children}
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" async></script>
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" async></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js" async></script>
        <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js" async></script>
        <script src="https://qrtoprint.in/assets/front-redesign.js" async></script>
      </body>
    </html>
  )
}
