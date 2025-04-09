"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, Clock } from "lucide-react"

// Mock data for power consumption prediction
const predictionData = [
  { day: "Mon", actual: 42, predicted: 45 },
  { day: "Tue", actual: 38, predicted: 40 },
  { day: "Wed", actual: 45, predicted: 43 },
  { day: "Thu", actual: 40, predicted: 42 },
  { day: "Fri", actual: 48, predicted: 46 },
  { day: "Sat", actual: 30, predicted: 32 },
  { day: "Sun", actual: 27, predicted: 28 },
  { day: "Mon", actual: null, predicted: 44 },
  { day: "Tue", actual: null, predicted: 41 },
  { day: "Wed", actual: null, predicted: 45 },
]

export default function PredictiveAnalytics() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            <CardTitle className="text-xl">Predictive Analytics</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Next 3 Days
          </Badge>
        </div>
        <CardDescription>AI-powered consumption forecasting</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[20, 50]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="actual"
                name="Actual (kWh)"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="predicted"
                name="Predicted (kWh)"
                stroke="#82ca9d"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted p-2 rounded-md">
            <div className="text-sm font-medium">Accuracy</div>
            <div className="text-2xl font-bold text-blue-500">94%</div>
          </div>
          <div className="bg-muted p-2 rounded-md">
            <div className="text-sm font-medium">Peak Day</div>
            <div className="text-2xl font-bold text-blue-500">Wed</div>
          </div>
          <div className="bg-muted p-2 rounded-md">
            <div className="text-sm font-medium">Avg. Load</div>
            <div className="text-2xl font-bold text-blue-500">43.3</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
