<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
import ClientLayout from "./ClientLayout"

export const metadata = {
=======
import ClientLayout from "./ClientLayout"

export const metadata = {
>>>>>>> Stashed changes
  title: "FlashMind AI - Smart Flashcard Learning",
  description: "AI-powered flashcard application for efficient learning",
    generator: 'v0.dev'
}
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes

export default function RootLayout({ children }) {
  return (
    <html lang="en">
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      <ClerkProvider frontendApi={clerkFrontendApi}>
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <ThemeProviderWrapper>{children}</ThemeProviderWrapper>
        </body>
      </ClerkProvider>
=======
=======
>>>>>>> Stashed changes
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <ClientLayout>{children}</ClientLayout>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    </html>
  )
}


import './globals.css'