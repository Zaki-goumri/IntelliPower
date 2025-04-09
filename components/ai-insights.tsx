"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Brain, TrendingUp, Lightbulb } from "lucide-react"

// Mock data for energy optimization
const energyData = [
  { name: "Jan", actual: 420, optimized: 350 },
  { name: "Feb", actual: 380, optimized: 310 },
  { name: "Mar", actual: 450, optimized: 360 },
  { name: "Apr", actual: 470, optimized: 380 },
  { name: "May", actual: 500, optimized: 400 },
  { name: "Jun", actual: 580, optimized: 450 },
]

// Mock data for temperature prediction
const temperatureData = [
  { time: "00:00", actual: 22, predicted: 22 },
  { time: "04:00", actual: 21, predicted: 21 },
  { time: "08:00", actual: 23, predicted: 22.5 },
  { time: "12:00", actual: 26, predicted: 25 },
  { time: "16:00", actual: 25, predicted: 24.5 },
  { time: "20:00", actual: 23, predicted: 23 },
  { time: "24:00", actual: null, predicted: 22 },
]

// Mock data for security incidents
const securityData = [
  { name: "Unauthorized Access", value: 8 },
  { name: "Motion Detection", value: 15 },
  { name: "Temperature Alerts", value: 12 },
  { name: "Power Fluctuations", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function AIInsights() {
  const [activeTab, setActiveTab] = useState("energy")

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center">
          <Brain className="h-6 w-6 mr-2 text-purple-500" />
          <CardTitle className="text-xl">AI Insights</CardTitle>
        </div>
        <CardDescription>AI-powered analytics and recommendations</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="energy" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="energy">Energy Optimization</TabsTrigger>
            <TabsTrigger value="temperature">Temperature Prediction</TabsTrigger>
            <TabsTrigger value="security">Security Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="energy" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={energyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="actual" name="Actual Usage (kWh)" fill="#8884d8" />
                  <Bar dataKey="optimized" name="AI Optimized (kWh)" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                <h3 className="font-semibold">AI Recommendations</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                  <span>Adjust HVAC schedule to reduce power during off-hours (potential 15% savings)</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                  <span>Optimize server room cooling based on workload patterns (potential 12% savings)</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
                  <span>Implement dynamic fan speed control based on temperature sensors (potential 8% savings)</span>
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="temperature" className="space-y-4">
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={temperatureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[18, 30]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    name="Actual Temperature (°C)"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 5 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    name="AI Predicted (°C)"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                <h3 className="font-semibold">Temperature Insights</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <span>Predicted temperature peak at 16:00 tomorrow (25.5°C)</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <span>Pre-cooling recommended starting at 14:00 to maintain optimal conditions</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
                  <span>Server load correlation detected with temperature fluctuations</span>
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="h-[300px] mt-4 flex justify-center">
              <ResponsiveContainer width="80%" height="100%">
                <PieChart>
                  <Pie
                    data={securityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {securityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <div className="flex items-center mb-2">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                <h3 className="font-semibold">Security Insights</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-red-500" />
                  <span>Unusual access pattern detected for Server Room 1 (after hours access increased by 40%)</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-red-500" />
                  <span>Correlation between temperature alerts and unauthorized access attempts</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-red-500" />
                  <span>Recommended security patrol schedule optimization based on incident patterns</span>
                </li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
