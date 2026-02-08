"use client"

import { TrendingUp, Droplets, Activity } from "lucide-react"

export function StatusBadges({
  risk,
  liquidity,
  volatility,
}: {
  risk: "Risk-On" | "Risk-Off" | "Transitional"
  liquidity: "Easing" | "Neutral" | "Tightening"
  volatility: "Low" | "Normal" | "Elevated"
}) 
{
  const badges = [
    {
      label: "Risk Regime",
      value: risk,
      icon: TrendingUp,
      color:
        risk === "Risk-On"
          ? "bg-chart-3/20 text-chart-3 border-chart-3/30"
          : risk === "Risk-Off"
          ? "bg-chart-1/20 text-chart-1 border-chart-1/30"
          : "bg-chart-2/20 text-chart-2 border-chart-2/30",
    },
    {
      label: "Liquidity",
      value: liquidity,
      icon: Droplets,
      color:
        liquidity === "Easing"
          ? "bg-chart-4/20 text-chart-4 border-chart-4/30"
          : liquidity === "Tightening"
          ? "bg-chart-1/20 text-chart-1 border-chart-1/30"
          : "bg-chart-2/20 text-chart-2 border-chart-2/30",
    },
    {
      label: "Volatility",
      value: volatility,
      icon: Activity,
      color:
        volatility === "Elevated"
          ? "bg-chart-5/20 text-chart-5 border-chart-5/30"
          : "bg-chart-2/20 text-chart-2 border-chart-2/30",
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${badge.color}`}
        >
          <badge.icon className="h-5 w-5" />
          <div className="flex-1">
            <div className="text-xs opacity-80">{badge.label}</div>
            <div className="font-semibold">{badge.value}</div>
          </div>
        </div>
      ))}
    </div>
  )
}