import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gazi Akter | Sr. Full Stack Web Developer',
  description: 'Sr. Full Stack Web Developer — Next.js, React, Laravel, WordPress',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Unbounded:wght@200..900&display=swap" rel="stylesheet" />
        <link href="/css/all.min.css" rel="stylesheet" />
        <link href="/css/style.css" rel="stylesheet" />
        <link href="/css/colorswitcher.css" rel="stylesheet" />
        <link id="dynamic-theme" href="/css/skins/exotic-teal.css" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
