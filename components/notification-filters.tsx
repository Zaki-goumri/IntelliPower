"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Filter, Save, Thermometer, Shield, Power, Bell, RotateCcw } from "lucide-react"

export default function NotificationFilters() {
  const [temperatureAlerts, setTemperatureAlerts] = useState(true)
  const [securityAlerts, setSecurityAlerts] = useState(true)
  const [powerAlerts, setPowerAlerts] = useState(true)
  const [systemAlerts, setSystemAlerts] = useState(true)
  const [temperatureThreshold, setTemperatureThreshold] = useState(28)
  const [severityLevel, setSeverityLevel] = useState(1) // 1=low, 2=medium, 3=high

  const resetFilters = () => {
    setTemperatureAlerts(true)
    setSecurityAlerts(true)
    setPowerAlerts(true)
    setSystemAlerts(true)
    setTemperatureThreshold(28)
    setSeverityLevel(1)
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Filter className="h-5 w-5 mr-2 text-purple-500" />
          <CardTitle className="text-xl">Filters</CardTitle>
        </div>
        <CardDescription>Customize notification preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-4">
            <div className="font-medium">Alert Types</div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Thermometer className="h-4 w-4 mr-2 text-red-500" />
                <Label htmlFor="temperature-alerts">Temperature</Label>
              </div>
              <Switch id="temperature-alerts" checked={temperatureAlerts} onCheckedChange={setTemperatureAlerts} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-blue-500" />
                <Label htmlFor="security-alerts">Security</Label>
              </div>
              <Switch id="security-alerts" checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Power className="h-4 w-4 mr-2 text-yellow-500" />
                <Label htmlFor="power-alerts">Power</Label>
              </div>
              <Switch id="power-alerts" checked={powerAlerts} onCheckedChange={setPowerAlerts} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="h-4 w-4 mr-2 text-gray-500" />
                <Label htmlFor="system-alerts">System</Label>
              </div>
              <Switch id="system-alerts" checked={systemAlerts} onCheckedChange={setSystemAlerts} />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="font-medium">Thresholds</div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="temperature-threshold">Temperature Threshold</Label>
                <span className="text-sm font-medium">{temperatureThreshold}°C</span>
              </div>
              <Slider
                id="temperature-threshold"
                min={20}
                max={35}
                step={0.5}
                value={[temperatureThreshold]}
                onValueChange={(value) => setTemperatureThreshold(value[0])}
                disabled={!temperatureAlerts}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="severity-level">Minimum Severity</Label>
                <span className="text-sm font-medium">
                  {severityLevel === 1 ? "Low" : severityLevel === 2 ? "Medium" : "High"}
                </span>
              </div>
              <Slider
                id="severity-level"
                min={1}
                max={3}
                step={1}
                value={[severityLevel]}
                onValueChange={(value) => setSeverityLevel(value[0])}
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" type="button" onClick={resetFilters}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Apply
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
