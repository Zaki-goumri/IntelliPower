"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Thermometer, Bell, AlertTriangle, Check } from "lucide-react"

type Alert = {
  id: number
  location: string
  message: string
  time: string
  severity: "low" | "medium" | "high"
  acknowledged: boolean
}

const initialAlerts: Alert[] = [
  {
    id: 1,
    location: "Server Room 1",
    message: "Temperature above threshold (29.5°C)",
    time: "15:30:22",
    severity: "medium",
    acknowledged: false,
  },
  {
    id: 2,
    location: "Network Room",
    message: "Rapid temperature increase detected",
    time: "14:15:07",
    severity: "high",
    acknowledged: false,
  },
  {
    id: 3,
    location: "Server Room 2",
    message: "Temperature normalized",
    time: "13:42:33",
    severity: "low",
    acknowledged: true,
  },
  {
    id: 4,
    location: "Backup Power Room",
    message: "Temperature above threshold (28.2°C)",
    time: "09:30:18",
    severity: "medium",
    acknowledged: true,
  },
]

export default function TemperatureAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)
  const [alertsEnabled, setAlertsEnabled] = useState(true)

  const acknowledgeAlert = (id: number) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-amber-500"
      case "low":
        return "text-green-500"
      default:
        return "text-blue-500"
    }
  }

  const activeAlerts = alerts.filter((a) => !a.acknowledged)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Thermometer className="h-5 w-5 mr-2 text-red-500" />
            <CardTitle className="text-xl">Temperature Alerts</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Alerts</span>
            <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
          </div>
        </div>
        <CardDescription>Temperature threshold notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`space-y-4 ${!alertsEnabled && "opacity-50 pointer-events-none"}`}>
          {alerts.length > 0 ? (
            alerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between">
                <div className="flex items-start">
                  <div className={`mt-0.5 mr-2 ${getSeverityColor(alert.severity)}`}>
                    {alert.severity === "high" ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : alert.severity === "medium" ? (
                      <Bell className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{alert.location}</div>
                    <div className="text-xs">{alert.message}</div>
                    <div className="text-xs text-muted-foreground">{alert.time}</div>
                  </div>
                </div>
                {!alert.acknowledged && (
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => acknowledgeAlert(alert.id)}>
                    Acknowledge
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">No temperature alerts at this time</div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full text-sm" disabled={!alertsEnabled}>
              Clear All
            </Button>
            <Button variant="outline" className="w-full text-sm" disabled={!alertsEnabled}>
              Configure Thresholds
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
