import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Qr To Print | Scan, Upload, Print',
  description: 'QR-based printing platform for local print shops. Customers scan, upload and pay — the shop prints.',
  keywords: ['QR Print', 'Print Shop', 'Mobile Upload Print', 'Cyber Cafe Print'],
  openGraph: {
    title: 'Qr To Print | Scan, Upload, Print',
    description: 'Customers scan QR, upload document, the shop prints automatically.',
    siteName: 'Qr To Print',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
