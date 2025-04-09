"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Check, X, AlertCircle } from "lucide-react"

type Anomaly = {
  id: number
  type: "temperature" | "power" | "security" | "access"
  message: string
  time: string
  severity: "low" | "medium" | "high"
  resolved: boolean
}

const anomalies: Anomaly[] = [
  {
    id: 1,
    type: "temperature",
    message: "Unusual temperature spike in Server Room 2",
    time: "15:30:22",
    severity: "medium",
    resolved: false,
  },
  {
    id: 2,
    type: "power",
    message: "Unexpected power consumption pattern",
    time: "14:15:07",
    severity: "low",
    resolved: false,
  },
  {
    id: 3,
    type: "security",
    message: "Unusual access pattern detected",
    time: "09:42:33",
    severity: "high",
    resolved: true,
  },
  {
    id: 4,
    type: "access",
    message: "Multiple failed access attempts",
    time: "08:30:18",
    severity: "medium",
    resolved: true,
  },
]

export default function AnomalyDetection() {
  const [detectedAnomalies, setDetectedAnomalies] = useState<Anomaly[]>(anomalies)

  const resolveAnomaly = (id: number) => {
    setDetectedAnomalies(
      detectedAnomalies.map((anomaly) => (anomaly.id === id ? { ...anomaly, resolved: true } : anomaly)),
    )
  }

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return <AlertTriangle className="h-4 w-4" />
      case "power":
        return <AlertCircle className="h-4 w-4" />
      case "security":
        return <AlertTriangle className="h-4 w-4" />
      case "access":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-amber-500"
      case "low":
        return "text-blue-500"
      default:
        return "text-blue-500"
    }
  }

  const activeAnomalies = detectedAnomalies.filter((a) => !a.resolved)

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
            <CardTitle className="text-xl">Anomaly Detection</CardTitle>
          </div>
          <Badge variant={activeAnomalies.length > 0 ? "destructive" : "outline"} className="text-xs">
            {activeAnomalies.length} Active
          </Badge>
        </div>
        <CardDescription>AI-detected unusual patterns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {detectedAnomalies.map((anomaly) => (
            <div key={anomaly.id} className="flex items-start justify-between">
              <div className="flex items-start">
                <div className={`mt-0.5 mr-2 ${getSeverityColor(anomaly.severity)}`}>
                  {getAnomalyIcon(anomaly.type)}
                </div>
                <div>
                  <div className="font-medium text-sm">{anomaly.message}</div>
                  <div className="text-xs text-muted-foreground">{anomaly.time}</div>
                </div>
              </div>
              {anomaly.resolved ? (
                <Badge variant="outline" className="text-green-500 text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  Resolved
                </Badge>
              ) : (
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => resolveAnomaly(anomaly.id)}>
                  <X className="h-3 w-3 mr-1" />
                  Dismiss
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
