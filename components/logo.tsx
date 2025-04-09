"use client"

import { Shield } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} rounded-full bg-primary flex items-center justify-center`}>
        <Shield
          className={`${size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6"} text-primary-foreground`}
        />
      </div>
      {showText && <div className={`font-bold ${textSizeClasses[size]} text-foreground`}>IntelliPower</div>}
    </div>
  )
}
