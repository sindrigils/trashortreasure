import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Trash or Treasure 🍬',
  description: 'Live candy voting results',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-[#050510] via-[#111a2b] to-[#1a0f2f] text-slate-100 antialiased">
        <div className="relative min-h-screen">
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(93,63,211,0.25),_transparent_55%)]" />
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(16,185,129,0.2),_transparent_60%)]" />
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  )
}
