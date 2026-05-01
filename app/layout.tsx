import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Mkato.study — Making Things Simpler',
  description: 'The AI-powered study companion for Kenyan university students. Find past papers, get instant explanations, and never fail an exam again.',
  keywords: 'university past papers Kenya, study AI, KCA past papers ,  UoN past papers, Strathmore past papers,KU past papers, JKUAT',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

