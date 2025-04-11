"use client";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Zap, TrendingDown } from "lucide-react";

interface EnergyData {
  id: string;
  power: number;
  voltage: number;
  createdAt: string;
  sensorId: string;
}

interface PowerConsumptionProps {
  data: EnergyData[];
  period: "DAY" | "WEEK" | "MONTH";
  onChangePeriod: (period: "DAY" | "WEEK" | "MONTH") => void;
}

const timeScales = {
  DAY: {
    label: "24 Hours",
    tickKey: "hour",
    yDomain: [100, 150],
    formatter: (date: Date) =>
      date.toLocaleTimeString([], { hour: "2-digit", hour12: false }),
  },
  WEEK: {
    label: "Week",
    tickKey: "day",
    yDomain: [100, 150],
    formatter: (date: Date) =>
      date.toLocaleDateString([], { weekday: "short" }),
  },
  MONTH: {
    label: "Month",
    tickKey: "week",
    yDomain: [100, 150],
    formatter: (date: Date) => `Week ${Math.ceil(date.getDate() / 7)}`,
  },
};

export default function PowerConsumption({
  data,
  period,
  onChangePeriod,
}: PowerConsumptionProps) {
  const [currentPower, setCurrentPower] = useState(0);
  const [dailyAverage, setDailyAverage] = useState(0);
  // const [savings] = useState(12.5);

  useEffect(() => {
    if (data.length > 0) {
      // Set current power from latest reading
      const latest = data[data.length - 1].power;
      setCurrentPower(latest);

      // Calculate daily average
      const total = data.reduce((sum, entry) => sum + entry.power, 0);
      setDailyAverage(total / data.length);
    }
  }, [data]);

  const processChartData = (period: keyof typeof timeScales) => {
    return data.map((entry) => ({
      ...entry,
      [timeScales[period].tickKey]: timeScales[period].formatter(
        new Date(entry.createdAt),
      ),
      power: Number(entry.power.toFixed(2)),
    }));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Power Consumption</CardTitle>
        </div>
        <CardDescription>Real-time power monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Zap className="h-8 w-8 mr-2 text-yellow-500" />
            <div className="text-3xl font-bold">
              {currentPower.toFixed(1)} kW
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Daily avg: {dailyAverage.toFixed(1)} kW
          </div>
        </div>

        <Tabs
          value={period}
          onValueChange={(value) => onChangePeriod(value as typeof period)}
        >
          <TabsList className="grid w-full grid-cols-3">
            {Object.keys(timeScales).map((scale) => (
              <TabsTrigger key={scale} value={scale}>
                {timeScales[scale as keyof typeof timeScales].label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(timeScales).map((scale) => (
            <TabsContent key={scale} value={scale} className="h-[200px] mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={processChartData(scale as keyof typeof timeScales)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey={
                      timeScales[scale as keyof typeof timeScales].tickKey
                    }
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    domain={
                      timeScales[scale as keyof typeof timeScales].yDomain
                    }
                    tickFormatter={(value) => `${value} kW`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toFixed(2)} kW`,
                      "Power Consumption",
                    ]}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="power" fill="#eab308" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
