import { Geist, Geist_Mono } from 'next/font/google'

export const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
})

export const fontVariables = `${fontSans.variable} ${fontMono.variable}`
