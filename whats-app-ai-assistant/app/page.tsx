"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle2, MessageSquare, Zap, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20">
      <header className="px-6 h-16 flex items-center justify-between border-b/5 border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <span>ReplyAI</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Now with Real-time WhatsApp Sync
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Automate Your <br /> WhatsApp Conversations
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              ReplyAI connects to your WhatsApp processing messages with advanced AI to draft perfect replies in seconds. Secure, fast, and always on.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform duration-300">
                  Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full hover:bg-muted/50">
                  How it Works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 px-6 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="h-8 w-8 text-amber-500" />,
                  title: "Instant AI Replies",
                  description: "Our AI analyzes context and tone to generate human-like responses instantly."
                },
                {
                  icon: <Shield className="h-8 w-8 text-emerald-500" />,
                  title: "End-to-End Secure",
                  description: "Your data is encrypted. We prioritize your privacy and never store message content permanently."
                },
                {
                  icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
                  title: "Real-time Sync",
                  description: "Seamless synchronization with your phone. What happens on WhatsApp, happens here."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-4 p-3 bg-background rounded-xl inline-block border border-border/50">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 px-6 border-t border-border/40 text-center text-muted-foreground text-sm">
        <p>&copy; 2024 ReplyAI. All rights reserved.</p>
      </footer>
    </div>
  )
}
