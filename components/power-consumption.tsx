"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Zap, TrendingDown } from "lucide-react"

const timeScales = {
  "24h": {
    label: "24 Hours",
    count: 25,
    tickKey: "time",
    yDomain: [0, 6],
    intervalMs: 3600000, // 1 hour
    formatter: (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    baseValue: () => 2 + Math.random() * 3,
    multiplier: 1
  },
  "week": {
    label: "Week",
    count: 7,
    tickKey: "day",
    yDomain: [0, 30],
    intervalMs: 86400000, // 1 day
    formatter: (date) => date.toLocaleDateString([], { weekday: 'short' }),
    baseValue: () => 20 + Math.random() * 8,
    multiplier: 1
  },
  "month": {
    label: "Month",
    count: 4,
    tickKey: "week",
    yDomain: [0, 200],
    intervalMs: 7 * 86400000, // 1 week
    formatter: (date, i) => `Week ${4-i}`,
    baseValue: () => 140 + Math.random() * 40,
    multiplier: 1
  }
}

const generateMockData = (scale) => {
  const config = timeScales[scale]
  const data = []
  const now = new Date()

  for (let i = config.count - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * config.intervalMs)
    const value = Math.round(config.baseValue() * 10) / 10

    data.push({
      [config.tickKey]: config.formatter(date, i),
      consumption: value
    })
  }

  return data
}

export default function PowerConsumption() {
  const [chartData, setChartData] = useState({
    "24h": generateMockData("24h"),
    "week": generateMockData("week"),
    "month": generateMockData("month")
  })
  const [currentConsumption, setCurrentConsumption] = useState(
    chartData["24h"][chartData["24h"].length - 1].consumption
  )
  const [savings, setSavings] = useState(12.5) // Percentage savings compared to baseline

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const hourlyData = [...chartData["24h"].slice(1)]
      const now = new Date()
      hourlyData.push({
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        consumption: Math.round((2 + Math.random() * 3) * 10) / 10,
      })

      setChartData(prevData => ({
        ...prevData,
        "24h": hourlyData
      }))
      setCurrentConsumption(hourlyData[hourlyData.length - 1].consumption)
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [chartData])

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Power Consumption</CardTitle>
          <div className="flex items-center text-green-500">
            <TrendingDown className="h-5 w-5 mr-1" />
            <span>{savings}% Savings</span>
          </div>
        </div>
        <CardDescription>Real-time power monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Zap className="h-8 w-8 mr-2 text-yellow-500" />
            <div className="text-3xl font-bold">{currentConsumption} kW</div>
          </div>
          <div className="text-sm text-muted-foreground">Daily avg: 2.8 kW</div>
        </div>

        <Tabs defaultValue="24h">
          <TabsList className="grid w-full grid-cols-3">
            {Object.keys(timeScales).map(scale => (
              <TabsTrigger key={scale} value={scale}>
                {timeScales[scale].label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(timeScales).map(scale => (
            <TabsContent key={scale} value={scale} className="h-[200px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData[scale]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={timeScales[scale].tickKey} />
                  <YAxis domain={timeScales[scale].yDomain} />
                  <Tooltip />
                  <Bar dataKey="consumption" fill="#eab308" />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
