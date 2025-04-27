import { ClerkProvider } from "@clerk/nextjs"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import ThemeProviderWrapper from "../components/theme-provider-wrapper"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "FlashMind - AI-Powered Flashcards",
  description: "Learn smarter with AI-generated flashcards",
  generator: "v0.dev",
}

// Your Clerk API key (replace with your actual key)
const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_FRONTEND_API

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ClerkProvider frontendApi={clerkFrontendApi}>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        </body>
      </ClerkProvider>
    </html>
  )
}
