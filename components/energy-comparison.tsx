"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ChartContainer } from "../components/ui/chart"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts"
import { Badge } from "../components/ui/badge"
import { ArrowDown, ArrowUp } from "lucide-react"

type Period = "DAY" | "WEEK" | "MONTH"

interface EnergyComparisonProps {
  data?: any[]
  period: Period
  onChangePeriod: (period: Period) => void
}

export default function EnergyComparison({ data, period, onChangePeriod }: EnergyComparisonProps) {
  // Generate sample data if none provided
  const generateComparisonData = () => {
    const timeLabels = {
      DAY: ["12am", "4am", "8am", "12pm", "4pm", "8pm"],
      WEEK: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      MONTH: ["Week 1", "Week 2", "Week 3", "Week 4"],
    }

    const labels = timeLabels[period]

    // Generate comparison data with current, previous, and benchmark values
    return labels.map((label, index) => {
      // Create realistic patterns
      let current = 0
      let previous = 0

      if (period === "DAY") {
        // Higher during business hours
        if (index >= 2 && index <= 4) {
          current = 70 + Math.random() * 30
          previous = 80 + Math.random() * 30
        } else {
          current = 30 + Math.random() * 20
          previous = 35 + Math.random() * 25
        }
      } else if (period === "WEEK") {
        // Lower on weekends
        if (index >= 5) {
          current = 40 + Math.random() * 20
          previous = 45 + Math.random() * 25
        } else {
          current = 70 + Math.random() * 30
          previous = 80 + Math.random() * 30
        }
      } else {
        // Consistent pattern for month view
        current = 60 + Math.random() * 20
        previous = 70 + Math.random() * 20
      }

      // Calculate benchmark (industry average)
      const benchmark = current * (0.9 + Math.random() * 0.2)

      return {
        name: label,
        current: Math.round(current),
        previous: Math.round(previous),
        benchmark: Math.round(benchmark),
        savings: Math.round(previous - current),
      }
    })
  }

  const comparisonData = data?.length ? processData(data) : generateComparisonData()

  function processData(rawData: any[]) {
    // Process real data here when available
    // This is a placeholder for actual data processing
    return generateComparisonData()
  }

  // Calculate total savings and percentage
  const calculateSavings = () => {
    const totalCurrent = comparisonData.reduce((sum, item) => sum + item.current, 0)
    const totalPrevious = comparisonData.reduce((sum, item) => sum + item.previous, 0)
    const savings = totalPrevious - totalCurrent
    const percentage = Math.round((savings / totalPrevious) * 100)

    return {
      amount: savings,
      percentage,
      improved: savings > 0,
    }
  }

  const savings = calculateSavings()

  // Calculate benchmark comparison
  const calculateBenchmark = () => {
    const totalCurrent = comparisonData.reduce((sum, item) => sum + item.current, 0)
    const totalBenchmark = comparisonData.reduce((sum, item) => sum + item.benchmark, 0)
    const difference = totalBenchmark - totalCurrent
    const percentage = Math.round((difference / totalBenchmark) * 100)

    return {
      percentage,
      betterThanBenchmark: difference > 0,
    }
  }

  const benchmark = calculateBenchmark()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">Energy Comparison</CardTitle>
          <CardDescription>Compare current usage with previous periods</CardDescription>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">vs Previous {period.toLowerCase()}</span>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold">{savings.amount} kWh</span>
                  <Badge variant={savings.improved ? "success" : "destructive"} className="ml-2">
                    {savings.improved ? <ArrowDown className="h-3 w-3 mr-1" /> : <ArrowUp className="h-3 w-3 mr-1" />}
                    {savings.percentage}%
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {savings.improved
                    ? `You've reduced energy consumption by ${savings.percentage}%`
                    : `Energy consumption increased by ${Math.abs(savings.percentage)}%`}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">vs Industry Benchmark</span>
                <div className="flex items-center mt-1">
                  <span className="text-2xl font-bold">{benchmark.percentage}%</span>
                  <Badge variant={benchmark.betterThanBenchmark ? "success" : "destructive"} className="ml-2">
                    {benchmark.betterThanBenchmark ? (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    )}
                    {benchmark.betterThanBenchmark ? "Better" : "Worse"}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {benchmark.betterThanBenchmark
                    ? `Your consumption is ${benchmark.percentage}% below industry average`
                    : `Your consumption is ${Math.abs(benchmark.percentage)}% above industry average`}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="comparison">Usage Comparison</TabsTrigger>
            <TabsTrigger value="savings">Savings Trend</TabsTrigger>
          </TabsList>
          <TabsContent value="comparison" className="pt-4 place-items-center">
            <ChartContainer className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "kWh", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    formatter={(value) => [`${value} kWh`, ""]}
                    contentStyle={{
                      background: "hsl(var(--background))",
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="current" name="Current" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="previous" name="Previous" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="benchmark" name="Benchmark" fill="hsl(var(--chart-3))" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          <TabsContent value="savings" className="pt-4">
            <ChartContainer className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={comparisonData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: "kWh", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    formatter={(value) => [`${value} kWh`, ""]}
                    contentStyle={{
                      background: "hsl(var(--background))",
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="savings" name="Savings" stroke="hsl(var(--chart-4))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
