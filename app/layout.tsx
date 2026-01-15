import type { Metadata, Viewport } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SocketProvider } from "@/components/providers/socket-provider"
import { ConvexClientProvider } from "@/components/providers/convex-client-provider"
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

const inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ReplyAI - WhatsApp AI Reply Assistant",
  description: "Your personal AI reply assistant for WhatsApp. Stay connected even when you're away.",
  generator: "v0.app",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a1a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" className="dark">
        <body className={`font-sans antialiased`}>
          <ConvexClientProvider>
            <SocketProvider>
              {children}
            </SocketProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}
