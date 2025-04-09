"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Settings, Save, RotateCcw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SystemSettings() {
  const [systemName, setSystemName] = useState("Intelligent Power & Security System")
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [dataRetention, setDataRetention] = useState(30)
  const [timezone, setTimezone] = useState("UTC")
  const [temperatureUnit, setTemperatureUnit] = useState("celsius")

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Settings className="h-5 w-5 mr-2 text-blue-500" />
          <CardTitle className="text-xl">General Settings</CardTitle>
        </div>
        <CardDescription>Configure system-wide settings</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="system-name">System Name</Label>
            <Input id="system-name" value={systemName} onChange={(e) => setSystemName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">UTC</SelectItem>
                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature-unit">Temperature Unit</Label>
            <Select value={temperatureUnit} onValueChange={setTemperatureUnit}>
              <SelectTrigger id="temperature-unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="celsius">Celsius (°C)</SelectItem>
                <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-update">Automatic Updates</Label>
              <div className="text-sm text-muted-foreground">Keep system up to date</div>
            </div>
            <Switch id="auto-update" checked={autoUpdate} onCheckedChange={setAutoUpdate} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="data-retention">Data Retention Period (days)</Label>
              <span className="text-sm font-medium">{dataRetention} days</span>
            </div>
            <Slider
              id="data-retention"
              min={7}
              max={90}
              step={1}
              value={[dataRetention]}
              onValueChange={(value) => setDataRetention(value[0])}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <Button variant="outline" type="button">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
