"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { HowItWorksSection } from "@/components/how-it-works-section"

export default function LandingPage() {
  const router = useRouter()

  return (
    <main className="bg-background text-foreground">
      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="max-w-2xl text-center space-y-6 px-4">
        <h1 className="text-4xl font-bold tracking-tight">
          Market Pulse
        </h1>

        <p className="text-muted-foreground text-lg">
          A probabilistic market intelligence engine that interprets
          real money signals to infer macro regimes and stock-level outlooks.
        </p>

        {/* Powered by */}
        <div className="flex justify-center">
          <span className="inline-flex items-center rounded-full border border-border px-4 py-1 text-sm font-medium text-muted-foreground">
            Powered by <span className="ml-1 font-semibold text-foreground">Sarvam AI</span>
          </span>
        </div>

        <p className="text-sm text-muted-foreground">
          Built on prediction market data • No narratives • No opinions
        </p>

          <div className="pt-4">
            <Button size="lg" onClick={() => router.push("/select-macro")}>
              Get Started
            </Button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 w-full flex justify-center">
          <div className="flex flex-col items-center gap-2 animate-pulse">
            <span className="text-base font-semibold tracking-wide text-foreground">
              Scroll to understand how it works
            </span>
            <span className="text-2xl font-bold">↓</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorksSection />
    </main>
  )
}