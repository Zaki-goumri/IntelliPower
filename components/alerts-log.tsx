"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, ShieldAlert, Thermometer, Lock } from "lucide-react"

type Alert = {
  id: number
  type: "security" | "temperature" | "access"
  message: string
  time: string
  severity: "low" | "medium" | "high"
  acknowledged: boolean
}

const recentAlerts: Alert[] = [
  {
    id: 1,
    type: "temperature",
    message: "High temperature in Server Room 1",
    time: "14:52:33",
    severity: "medium",
    acknowledged: true,
  },
  {
    id: 2,
    type: "access",
    message: "Failed access attempt at Server Room 1",
    time: "14:30:18",
    severity: "medium",
    acknowledged: true,
  },
  {
    id: 3,
    type: "security",
    message: "Motion detected after hours",
    time: "23:15:07",
    severity: "high",
    acknowledged: true,
  },
  {
    id: 4,
    type: "temperature",
    message: "Temperature normalized in Server Room 1",
    time: "15:30:22",
    severity: "low",
    acknowledged: false,
  },
]

export default function AlertsLog() {
  const [alerts, setAlerts] = useState<Alert[]>(recentAlerts)

  const acknowledgeAlert = (id: number) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, acknowledged: true } : alert)))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "security":
        return <ShieldAlert className="h-4 w-4" />
      case "temperature":
        return <Thermometer className="h-4 w-4" />
      case "access":
        return <Lock className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Alerts Log</CardTitle>
        <CardDescription>Recent system alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start justify-between">
              <div className="flex items-start">
                <div className={`mt-0.5 mr-2 ${getSeverityColor(alert.severity)}`}>{getAlertIcon(alert.type)}</div>
                <div>
                  <div className="font-medium text-sm">{alert.message}</div>
                  <div className="text-xs text-muted-foreground">{alert.time}</div>
                </div>
              </div>
              {!alert.acknowledged && (
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => acknowledgeAlert(alert.id)}>
                  Ack
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full flex items-center justify-center">
            <Bell className="h-4 w-4 mr-2" />
            View All Alerts
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
