"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAnalysis } from "@/lib/analysis-context"

const COMPANIES = [
  { ticker: "NVDA", name: "NVIDIA" },
  { ticker: "MSFT", name: "Microsoft" },
  { ticker: "GOOGL", name: "Alphabet" },
  { ticker: "AAPL", name: "Apple" },
  { ticker: "AMZN", name: "Amazon" }
]

export default function SelectCompaniesPage() {
  const router = useRouter()
  const {
    selectedCompanies,
    toggleCompany,
    runAnalysis,
    isLoading,
  } = useAnalysis()

  const canContinue = selectedCompanies.length > 0 && !isLoading

  const handleRun = async () => {
    await runAnalysis()
    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold">Select companies</h1>
          <p className="text-muted-foreground mt-2">
            Choose companies you want evaluated under the selected macro regime.
          </p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {COMPANIES.map(c => (
            <Card
              key={c.ticker}
              className={`p-4 cursor-pointer text-center transition border ${
                selectedCompanies.includes(c.ticker)
                  ? "border-accent bg-accent/10"
                  : "hover:border-muted"
              }`}
              onClick={() => toggleCompany(c.ticker)}
            >
              <span className="font-medium">{c.name}</span>
            </Card>
          ))}
        </section>

        <div className="flex justify-between pt-4">
          <Button variant="ghost" onClick={() => router.back()}>
            Back
          </Button>

          <Button size="lg" disabled={!canContinue} onClick={handleRun}>
            {isLoading ? "Running analysis…" : "Run Analysis"}
          </Button>
        </div>
      </div>
    </main>
  )
}