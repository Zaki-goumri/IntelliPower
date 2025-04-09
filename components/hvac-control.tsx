"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Fan, Snowflake, Flame, Power } from "lucide-react"

export default function HVACControl() {
  const [mode, setMode] = useState<"auto" | "cooling" | "heating" | "fan">("auto")
  const [targetTemp, setTargetTemp] = useState(23)
  const [fanSpeed, setFanSpeed] = useState(2)
  const [isOn, setIsOn] = useState(true)

  const handleModeChange = (newMode: "auto" | "cooling" | "heating" | "fan") => {
    setMode(newMode)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">HVAC Control</CardTitle>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-muted-foreground">Power</span>
            <Switch checked={isOn} onCheckedChange={setIsOn} />
          </div>
        </div>
        <CardDescription>Smart temperature control system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`transition-opacity ${isOn ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
          <div className="flex justify-center mb-6">
            <div className="text-5xl font-bold">{targetTemp}°C</div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">18°C</span>
              <span className="text-sm text-muted-foreground">30°C</span>
            </div>
            <Slider
              value={[targetTemp]}
              min={18}
              max={30}
              step={0.5}
              onValueChange={(value) => setTargetTemp(value[0])}
              disabled={!isOn}
            />
          </div>

          <div className="grid grid-cols-4 gap-2 mb-6">
            <Button
              variant={mode === "auto" ? "default" : "outline"}
              className="flex flex-col items-center py-3"
              onClick={() => handleModeChange("auto")}
              disabled={!isOn}
            >
              <Power className="h-5 w-5 mb-1" />
              <span className="text-xs">Auto</span>
            </Button>
            <Button
              variant={mode === "cooling" ? "default" : "outline"}
              className="flex flex-col items-center py-3"
              onClick={() => handleModeChange("cooling")}
              disabled={!isOn}
            >
              <Snowflake className="h-5 w-5 mb-1" />
              <span className="text-xs">Cool</span>
            </Button>
            <Button
              variant={mode === "heating" ? "default" : "outline"}
              className="flex flex-col items-center py-3"
              onClick={() => handleModeChange("heating")}
              disabled={!isOn}
            >
              <Flame className="h-5 w-5 mb-1" />
              <span className="text-xs">Heat</span>
            </Button>
            <Button
              variant={mode === "fan" ? "default" : "outline"}
              className="flex flex-col items-center py-3"
              onClick={() => handleModeChange("fan")}
              disabled={!isOn}
            >
              <Fan className="h-5 w-5 mb-1" />
              <span className="text-xs">Fan</span>
            </Button>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm">Fan Speed</span>
              <span className="text-sm font-medium">{fanSpeed === 1 ? "Low" : fanSpeed === 2 ? "Medium" : "High"}</span>
            </div>
            <Slider
              value={[fanSpeed]}
              min={1}
              max={3}
              step={1}
              onValueChange={(value) => setFanSpeed(value[0])}
              disabled={!isOn}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full text-sm text-muted-foreground">
          {isOn
            ? mode === "auto"
              ? "System is automatically managing temperature"
              : mode === "cooling"
                ? "System is in cooling mode"
                : mode === "heating"
                  ? "System is in heating mode"
                  : "System is in fan-only mode"
            : "System is powered off"}
        </div>
      </CardFooter>
    </Card>
  )
}
