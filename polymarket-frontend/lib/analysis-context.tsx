"use client"

import React, { createContext, useContext, useState } from "react"
import type { AnalyzeRequest, AnalyzeResponse, MacroSignalKey } from "./types"

type AnalysisState = {
  selectedEvents: MacroSignalKey[]
  selectedCompanies: string[]
  analysis: AnalyzeResponse | null
  isLoading: boolean
  error: string | null

  toggleEvent: (event: MacroSignalKey) => void
  toggleCompany: (company: string) => void
  runAnalysis: () => Promise<void>
}

const AnalysisContext = createContext<AnalysisState | null>(null)

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [selectedEvents, setSelectedEvents] = useState<MacroSignalKey[]>([])
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
    const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleEvent = (event: MacroSignalKey) => {
    setSelectedEvents(prev =>
      prev.includes(event)
        ? prev.filter(e => e !== event)
        : [...prev, event]
    )
  }

  const toggleCompany = (company: string) => {
    setSelectedCompanies(prev =>
      prev.includes(company)
        ? prev.filter(c => c !== company)
        : [...prev, company]
    )
  }

  const runAnalysis = async () => {
    setIsLoading(true)
    setError(null)


    try {
      const payload: AnalyzeRequest = {
        events: selectedEvents,
        companies: selectedCompanies
      }

        console.log("RUN ANALYSIS PAYLOAD", payload)

      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        throw new Error("Analysis request failed")
      }

      const data = await res.json()
      setAnalysis(data)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnalysisContext.Provider
    value={{
        selectedEvents,
        selectedCompanies,
        analysis,
        isLoading,
        error,
        toggleEvent,
        toggleCompany,
        runAnalysis
    }}
    >
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext)
  if (!ctx) {
    throw new Error("useAnalysis must be used inside AnalysisProvider")
  }
  return ctx
}