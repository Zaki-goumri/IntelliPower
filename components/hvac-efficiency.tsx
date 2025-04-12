"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { ChartContainer } from "../components/ui/chart"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { Thermometer, Fan, Droplet } from "lucide-react"

type Period = "DAY" | "WEEK" | "MONTH"

interface HVACEfficiencyProps {
  data?: any[]
  period: Period
  onChangePeriod: (period: Period) => void
}

export default function HVACEfficiency({ data, period, onChangePeriod }: HVACEfficiencyProps) {
  // Generate sample data if none provided
  const generateHVACData = () => {
    // Sample HVAC energy distribution
    const hvacDistribution = [
      { name: "Cooling", value: 45, color: "hsl(var(--chart-1))" },
      { name: "Heating", value: 30, color: "hsl(var(--chart-2))" },
      { name: "Ventilation", value: 15, color: "hsl(var(--chart-3))" },
      { name: "Other", value: 10, color: "hsl(var(--chart-4))" },
    ]

    // Sample efficiency metrics
    const efficiencyMetrics = {
      coolingEfficiency: 82,
      heatingEfficiency: 78,
      ventilationEfficiency: 90,
      overallEfficiency: 83,
    }

    // Sample recommendations based on efficiency
    const recommendations = [
      "Schedule HVAC maintenance to improve heating efficiency",
      "Consider upgrading cooling system filters",
      "Optimize temperature setpoints during off-hours",
    ]

    return {
      distribution: hvacDistribution,
      metrics: efficiencyMetrics,
      recommendations,
    }
  }

  const hvacData = data?.length ? processData(data) : generateHVACData()

  function processData(rawData: any[]) {
    // Process real data here when available
    // This is a placeholder for actual data processing
    return generateHVACData()
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">HVAC Efficiency</CardTitle>
          <CardDescription>Monitor and optimize HVAC system performance</CardDescription>
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
          <div>
            <h3 className="text-sm font-medium mb-2">Energy Distribution</h3>
            <ChartContainer className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hvacData.distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {hvacData.distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Energy Usage"]}
                    contentStyle={{
                      background: "hsl(var(--background))",
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">System Efficiency</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Thermometer className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="text-sm">Cooling Efficiency</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${hvacData.metrics.coolingEfficiency}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{hvacData.metrics.coolingEfficiency}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Thermometer className="h-4 w-4 mr-2 text-red-500" />
                  <span className="text-sm">Heating Efficiency</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${hvacData.metrics.heatingEfficiency}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{hvacData.metrics.heatingEfficiency}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Fan className="h-4 w-4 mr-2 text-green-500" />
                  <span className="text-sm">Ventilation Efficiency</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${hvacData.metrics.ventilationEfficiency}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{hvacData.metrics.ventilationEfficiency}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Droplet className="h-4 w-4 mr-2 text-purple-500" />
                  <span className="text-sm">Overall Efficiency</span>
                </div>
                <div className="flex items-center">
                  <div className="w-32 h-2 bg-gray-200 rounded-full mr-2">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${hvacData.metrics.overallEfficiency}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{hvacData.metrics.overallEfficiency}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Optimization Recommendations</h3>
          <ul className="space-y-2">
            {hvacData.recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm flex items-start">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-2"></span>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
