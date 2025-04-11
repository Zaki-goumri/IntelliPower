"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Calendar, Clock, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const generateDailyData = () => {
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

const generateWeeklyData = () => {
  const data = []
  const now = new Date()

  for (let i = 7; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 3600000)
    data.push({
      time: date.toLocaleDateString([], { weekday: "short" }),
      temperature: Math.round((23 + Math.random() * 6) * 10) / 10,
    })
  }

  return data
}

const generateMonthlyData = () => {
  const data = []
  const now = new Date()
  const currentMonth = now.getMonth()

  for (let i = 30; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 3600000)
    if (date.getMonth() === currentMonth) {
      data.push({
        time: date.getDate().toString(),
        temperature: Math.round((23 + Math.random() * 6) * 10) / 10,
      })
    }
  }

  return data
}

export default function TemperatureHistory() {
  const [dailyData] = useState(generateDailyData())
  const [weeklyData] = useState(generateWeeklyData())
  const [monthlyData] = useState(generateMonthlyData())
  const [selectedLocation, setSelectedLocation] = useState("server-room-1")

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Temperature History</CardTitle>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="server-room-1">Server Room 1</SelectItem>
              <SelectItem value="server-room-2">Server Room 2</SelectItem>
              <SelectItem value="network-room">Network Room</SelectItem>
              <SelectItem value="backup-power">Backup Power Room</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <CardDescription>Historical temperature data analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="daily" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Daily
              </TabsTrigger>
              <TabsTrigger value="weekly" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Weekly
              </TabsTrigger>
              <TabsTrigger value="monthly" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Monthly
              </TabsTrigger>
            </TabsList>

            <Button variant="outline" size="sm" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <TabsContent value="daily" className="h-[250px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[20, 35]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="weekly" className="h-[250px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[20, 35]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="monthly" className="h-[250px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis domain={[20, 35]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="bg-muted p-2 rounded-md">
            <div className="text-sm font-medium">Average</div>
            <div className="text-xl font-bold text-blue-500">24.3°C</div>
          </div>
          <div className="bg-muted p-2 rounded-md">
            <div className="text-sm font-medium">Min</div>
            <div className="text-xl font-bold text-green-500">21.5°C</div>
          </div>
          <div className="bg-muted p-2 rounded-md">
            <div className="text-sm font-medium">Max</div>
            <div className="text-xl font-bold text-amber-500">29.8°C</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
