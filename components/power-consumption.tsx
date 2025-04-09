"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Zap, TrendingDown } from "lucide-react"

// Mock data - in a real implementation, this would come from your power monitoring system
const generateMockData = () => {
  const data = []
  const now = new Date()

  for (let i = 24; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3600000)
    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      consumption: Math.round((2 + Math.random() * 3) * 10) / 10,
    })
  }

  return data
}

export default function PowerConsumption() {
  const [data, setData] = useState(generateMockData())
  const [currentConsumption, setCurrentConsumption] = useState(data[data.length - 1].consumption)
  const [savings, setSavings] = useState(12.5) // Percentage savings compared to baseline

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = [...data.slice(1)]
      const now = new Date()
      newData.push({
        time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        consumption: Math.round((2 + Math.random() * 3) * 10) / 10,
      })

      setData(newData)
      setCurrentConsumption(newData[newData.length - 1].consumption)
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [data])

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
            <TabsTrigger value="24h">24 Hours</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
          <TabsContent value="24h" className="h-[200px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[0, 6]} />
                <Tooltip />
                <Bar dataKey="consumption" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="week">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Weekly consumption data
            </div>
          </TabsContent>
          <TabsContent value="month">
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              Monthly consumption data
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
