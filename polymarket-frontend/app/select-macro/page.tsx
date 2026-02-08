"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAnalysis } from "@/lib/analysis-context"
import { MACRO_SIGNALS } from "@/lib/macroSignals"
import type { MacroSignalKey } from "@/lib/types"

type CategoryMap = Record<
  string,
  {
    key: MacroSignalKey
    label: string
    description: string
  }[]
>

export default function SelectMacroPage() {
  const router = useRouter()
  const { selectedEvents, toggleEvent } = useAnalysis()

  const [openCategory, setOpenCategory] = useState<string | null>(null)

  /** Group signals by category */
  const groupedSignals: CategoryMap = Object.entries(MACRO_SIGNALS).reduce(
    (acc, [key, signal]) => {
      const category = signal.category
      if (!acc[category]) acc[category] = []
      acc[category].push({
        key: key as MacroSignalKey,
        label: signal.label,
        description: signal.description,
      })
      return acc
    },
    {} as CategoryMap
  )

  const canContinue = selectedEvents.length > 0

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold">Select macro signals</h1>
          <p className="text-muted-foreground mt-2">
            Choose the macroeconomic forces you want the model to reason over.
          </p>
        </header>

        {/* Categories */}
        <section className="space-y-4">
          {Object.entries(groupedSignals).map(([category, signals]) => {
            const isOpen = openCategory === category
            const selectedCount = signals.filter(s =>
              selectedEvents.includes(s.key)
            ).length

            return (
              <Card key={category} className="p-4">
                {/* Category Header */}
                <button
                  onClick={() =>
                    setOpenCategory(isOpen ? null : category)
                  }
                  className="w-full flex items-center justify-between"
                >
                <div className="flex flex-col items-start">
                  <h3 className="text-lg font-semibold leading-tight">
                    {category}
                  </h3>

                  <div className="text-sm text-muted-foreground leading-tight">
                    {signals.length} events
                    {selectedCount > 0 && (
                      <span className="ml-2 text-accent">
                        • {selectedCount} selected
                      </span>
                    )}
                  </div>
                </div>

                  {isOpen ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </button>

                {/* Dropdown Events */}
                {isOpen && (
                  <div className="mt-4 space-y-2 border-t border-border pt-4">
                    {signals.map(signal => {
                      const isSelected = selectedEvents.includes(signal.key)

                      return (
                        <div
                          key={signal.key}
                          onClick={() => toggleEvent(signal.key)}
                          className={`p-4 cursor-pointer transition border rounded-lg ${
                            isSelected
                              ? "border-accent bg-accent/40 ring-2 ring-accent"
                              : "border-border hover:border-muted"
                          }`} 
                        >
                          <div className="font-medium">
                            {signal.label}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {signal.description}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
            )
          })}
        </section>

        {/* Continue */}
        <div className="flex justify-end pt-4">
          <Button
            size="lg"
            disabled={!canContinue}
            onClick={() => router.push("/select-companies")}
          >
            Continue
          </Button>
        </div>
      </div>
    </main>
  )
}