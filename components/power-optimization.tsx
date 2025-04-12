"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import {
  BarChart,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer } from "../components/ui/chart"
import { ArrowDown, ArrowUp, Zap } from "lucide-react"

type Period = "DAY" | "WEEK" | "MONTH"

interface PowerOptimizationProps {
  data: any[]
  period: Period
  onChangePeriod: (period: Period) => void
}

export default function PowerOptimization({ data, period, onChangePeriod }: PowerOptimizationProps) {
  const [activeTab, setActiveTab] = useState("usage")

  // Process data for different visualizations
  const processUsageData = () => {
    if (!data || data.length === 0) return []

    // For demo purposes, if no data is provided, generate sample data
    if (!data[0]?.usage) {
      return generateSampleData(period)
    }

    return data.map((item) => ({
      time: formatTime(item.timestamp, period),
      actual: item.usage,
      optimal: item.optimal || item.usage * 0.8, // Estimate optimal if not provided
    }))
  }

  const processEfficiencyData = () => {
    if (!data || data.length === 0) return []

    // For demo purposes, if no data is provided, generate sample data
    if (!data[0]?.efficiency) {
      const sampleData = generateSampleData(period)
      return sampleData.map((item) => ({
        time: item.time,
        efficiency: Math.round(100 - ((item.actual - item.optimal) / item.actual) * 100),
      }))
    }

    return data.map((item) => ({
      time: formatTime(item.timestamp, period),
      efficiency: item.efficiency,
    }))
  }

  const calculateSavings = () => {
    const usageData = processUsageData()
    if (usageData.length === 0) return { percentage: 0, kWh: 0 }

    const totalActual = usageData.reduce((sum, item) => sum + item.actual, 0)
    const totalOptimal = usageData.reduce((sum, item) => sum + item.optimal, 0)
    const savings = totalActual - totalOptimal
    const percentage = Math.round((savings / totalActual) * 100)

    return {
      percentage,
      kWh: Math.round(savings),
    }
  }

  const formatTime = (timestamp: string, period: Period) => {
    const date = new Date(timestamp)

    if (period === "DAY") {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (period === "WEEK") {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const generateSampleData = (period: Period) => {
    const result = []
    const points = period === "DAY" ? 24 : period === "WEEK" ? 7 : 30

    for (let i = 0; i < points; i++) {
      const date = new Date()

      if (period === "DAY") {
        date.setHours(i)
        date.setMinutes(0)
      } else if (period === "WEEK") {
        date.setDate(date.getDate() - (6 - i))
      } else {
        date.setDate(i + 1)
      }

      // Generate realistic power usage patterns
      let baseUsage = 0
      if (period === "DAY") {
        // Higher during morning and evening
        if (i >= 6 && i <= 9) baseUsage = 8 + Math.random() * 4
        else if (i >= 17 && i <= 22) baseUsage = 10 + Math.random() * 5
        else baseUsage = 3 + Math.random() * 3
      } else {
        // Higher on weekdays
        baseUsage = 5 + Math.random() * 7
        if (period === "WEEK" && (i === 0 || i === 6)) {
          baseUsage = 8 + Math.random() * 4 // Weekend
        }
      }

      result.push({
        time: formatTime(date.toISOString(), period),
        actual: Math.round(baseUsage * 10) / 10,
        optimal: Math.round(baseUsage * 0.7 * 10) / 10,
      })
    }

    return result
  }

  const usageData = processUsageData()
  const efficiencyData = processEfficiencyData()
  const savings = calculateSavings()

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Power Optimization</CardTitle>
          <CardDescription>Monitor and optimize your power consumption</CardDescription>
        </div>
        <Tabs value={period} onValueChange={(value) => onChangePeriod(value as Period)} className="w-[180px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="DAY">Day</TabsTrigger>
            <TabsTrigger value="WEEK">Week</TabsTrigger>
            <TabsTrigger value="MONTH">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <div className="text-muted-foreground text-sm mb-1">Potential Savings</div>
              <div className="text-2xl font-bold flex items-center">
                {savings.percentage}%
                <ArrowDown className="ml-1 h-5 w-5 text-green-500" />
              </div>
              <div className="text-sm text-muted-foreground">{savings.kWh} kWh</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <div className="text-muted-foreground text-sm mb-1">Peak Usage Time</div>
              <div className="text-2xl font-bold flex items-center">
                {usageData.length > 0
                  ? usageData.reduce((max, item) => (item.actual > max.actual ? item : max), usageData[0]).time
                  : "N/A"}
              </div>
              <div className="text-sm text-muted-foreground">
                <Zap className="inline h-4 w-4 mr-1" />
                High demand
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <div className="text-muted-foreground text-sm mb-1">Avg. Efficiency</div>
              <div className="text-2xl font-bold flex items-center">
                {efficiencyData.length > 0
                  ? Math.round(efficiencyData.reduce((sum, item) => sum + item.efficiency, 0) / efficiencyData.length)
                  : 0}
                %
                {efficiencyData.length > 0 &&
                  (Math.round(efficiencyData.reduce((sum, item) => sum + item.efficiency, 0) / efficiencyData.length) >
                  80 ? (
                    <ArrowUp className="ml-1 h-5 w-5 text-green-500" />
                  ) : (
                    <ArrowDown className="ml-1 h-5 w-5 text-amber-500" />
                  ))}
              </div>
              <div className="text-sm text-muted-foreground">System performance</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="usage">Usage Comparison</TabsTrigger>
            <TabsTrigger value="efficiency">Efficiency Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="usage" className="pt-4 place-items-center">
            <ChartContainer className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={usageData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis label={{ value: "kWh", angle: -90, position: "insideLeft" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="actual" name="Actual Usage" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="optimal" name="Optimal Usage" fill="hsl(var(--chart-2))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="efficiency" className="pt-4">
            <ChartContainer className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={efficiencyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis domain={[0, 100]} label={{ value: "Efficiency %", angle: -90, position: "insideLeft" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="efficiency"
                    name="Efficiency"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">{label}</span>
          {payload.map((item: any) => (
            <span key={item.name} className="font-bold text-sm">
              {item.name}: {item.value} {item.name.includes("Efficiency") ? "%" : "kWh"}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
