"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Thermometer, AlertTriangle } from "lucide-react"

// Mock data - in a real implementation, this would come from your sensors
const generateMockData = () => {
  const data = []
  const now = new Date()

  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000)
    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      temperature: Math.round((22 + Math.random() * 8) * 10) / 10,
    })
  }

  return data
}

export default function TemperatureMonitor() {
  const [data, setData] = useState(generateMockData())
  const [currentTemp, setCurrentTemp] = useState(data[data.length - 1].temperature)
  const [threshold, setThreshold] = useState(28)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = [...data.slice(1)]
      const now = new Date()
      newData.push({
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        temperature: Math.round((22 + Math.random() * 8) * 10) / 10,
      })

      setData(newData)
      setCurrentTemp(newData[newData.length - 1].temperature)
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [data])

  const isHighTemperature = currentTemp > threshold

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Temperature Monitor</CardTitle>
          {isHighTemperature && (
            <div className="flex items-center text-red-500">
              <AlertTriangle className="h-5 w-5 mr-1" />
              <span>High Temperature</span>
            </div>
          )}
        </div>
        <CardDescription>Real-time temperature monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Thermometer className="h-8 w-8 mr-2 text-blue-500" />
            <div className="text-3xl font-bold">{currentTemp}°C</div>
          </div>
          <div className="text-sm text-muted-foreground">Threshold: {threshold}°C</div>
        </div>

        <Tabs defaultValue="24h">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="24h">24 Hours</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          <TabsContent value="24h" className="h-[200px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[20, 35]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="week">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Weekly data visualization
            </div>
          </TabsContent>
          <TabsContent value="month">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Monthly data visualization
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
