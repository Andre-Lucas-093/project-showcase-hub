"use client"

import { useMemo } from "react"
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  const isDark = useMemo(() => {
    if (theme === "dark") return true
    if (theme === "light") return false

    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }

    return false
  }, [theme])

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  return (
    <div
      className={cn(
        "relative flex h-8 w-16 cursor-pointer rounded-full border p-1 transition-all duration-500 ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isDark
          ? "border-zinc-700/70 bg-zinc-900 shadow-[inset_0_0_18px_rgba(16,185,129,0.16)]"
          : "border-emerald-200 bg-[#f8f5ef] shadow-[inset_0_0_16px_rgba(22,163,74,0.14)]",
        className,
      )}
      onClick={toggleTheme}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          toggleTheme()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Alternar tema"
      aria-pressed={isDark}
    >
      <div className="pointer-events-none absolute inset-1 overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full w-full transition-opacity duration-500",
            isDark
              ? "bg-[radial-gradient(circle_at_30%_40%,rgba(16,185,129,0.22),transparent_60%)] opacity-100"
              : "bg-[radial-gradient(circle_at_70%_50%,rgba(22,163,74,0.2),transparent_62%)] opacity-100",
          )}
        />
      </div>

      <div className="relative flex w-full items-center justify-between px-0.5">
        <Sun
          className={cn(
            "h-4 w-4 transition-all duration-500",
            isDark ? "scale-90 text-zinc-500 opacity-70" : "scale-100 text-emerald-700 opacity-100",
          )}
          strokeWidth={1.8}
        />

        <Moon
          className={cn(
            "h-4 w-4 transition-all duration-500",
            isDark ? "scale-100 text-emerald-100 opacity-100" : "scale-90 text-zinc-400 opacity-70",
          )}
          strokeWidth={1.8}
        />
      </div>

      <div
        className={cn(
          "absolute top-1 h-6 w-6 rounded-full transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          "shadow-[0_4px_18px_rgba(0,0,0,0.2)]",
          isDark
            ? "left-1 translate-x-0 bg-zinc-800"
            : "left-1 translate-x-8 bg-gradient-to-br from-emerald-100 to-emerald-300",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-opacity duration-500",
            isDark
              ? "bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.35),transparent_65%)] opacity-100"
              : "bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.8),transparent_58%)] opacity-100",
          )}
        />
      </div>
    </div>
  )
}
