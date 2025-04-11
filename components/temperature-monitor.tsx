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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Thermometer, AlertTriangle, Droplets } from "lucide-react";

interface TemperatureReadingProps {
  id: string;
  sensorId: string;
  temp: number;
  humidity: number;
  createdAt: string;
}
const domainSettings = {
  DAY: [20, 35],
  WEEK: [18, 38],
  MONTH: [15, 40],
};

export default function TemperatureMonitor({
  data,
  areaId = "Unknown",
  period,
  onChangePeriod,
}: {
  data: TemperatureReadingProps[];
  areaId?: string;
  period: "DAY" | "WEEK" | "MONTH";
  onChangePeriod: (period: "DAY" | "WEEK" | "MONTH") => void;
}) {
  const [currentTemp, setCurrentTemp] = useState<number | null>(null);
  const [currentHumidity, setCurrentHumidity] = useState<number | null>(null);
  const [threshold, setThreshold] = useState(28);
  const [loading, setLoading] = useState(false);

  const [data24h, setData24h] = useState<TemperatureReadingProps[]>([]);
  const [dataWeek, setDataWeek] = useState<TemperatureReadingProps[]>([]);
  const [dataMonth, setDataMonth] = useState<TemperatureReadingProps[]>([]);

  useEffect(() => {
    if (!data || data.length === 0) {
      setLoading(true);
      return;
    }

    const sortedData = [...data].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    const now = new Date();

    const last24h = sortedData.filter(
      (item) =>
        new Date(item.createdAt).getTime() >
        now.getTime() - 24 * 60 * 60 * 1000,
    );
    setData24h(last24h);

    // Last week data
    const lastWeek = sortedData.filter(
      (item) =>
        new Date(item.createdAt).getTime() >
        now.getTime() - 7 * 24 * 60 * 60 * 1000,
    );
    setDataWeek(lastWeek);

    // Last month data
    const lastMonth = sortedData.filter(
      (item) =>
        new Date(item.createdAt).getTime() >
        now.getTime() - 30 * 24 * 60 * 60 * 1000,
    );
    setDataMonth(lastMonth);

    // Set current temperature and humidity from the latest reading
    if (sortedData.length > 0) {
      const latestReading = sortedData[sortedData.length - 1];
      setCurrentTemp(latestReading.temp);
      setCurrentHumidity(latestReading.humidity);
    }

    setLoading(false);
  }, [data]);

  const isHighTemperature = currentTemp !== null && currentTemp > threshold;

  const chartConfigs = [
    {
      id: "DAY", // Changed from "24h" to match period values
      label: "24 Hours",
      data: data24h,
      domain: [20, 35],
    },
    {
      id: "WEEK",
      label: "Week",
      data: dataWeek,
      domain: [20, 35],
    },
    {
      id: "MONTH",
      label: "Month",
      data: dataMonth,
      domain: [18, 38],
    },
  ];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Temperature Monitor</CardTitle>
          <CardDescription>Loading temperature data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

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
        <CardDescription>
          Real-time temperature monitoring - Area {areaId}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Thermometer className="h-8 w-8 mr-2 text-blue-500" />
              <div className="text-3xl font-bold">
                {currentTemp !== null ? `${currentTemp.toFixed(1)}°C` : "N/A"}
              </div>
            </div>
            <div className="flex items-center">
              <Droplets className="h-8 w-8 mr-2 text-cyan-500" />
              <div className="text-xl text-muted-foreground">
                {currentHumidity !== null
                  ? `${currentHumidity.toFixed(1)}%`
                  : "N/A"}
              </div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Threshold: {threshold}°C
          </div>
        </div>

        <Tabs
          value={period}
          onValueChange={(value) =>
            onChangePeriod(value as "DAY" | "WEEK" | "MONTH")
          }
        >
          <TabsList className="grid w-full grid-cols-3">
            {chartConfigs.map((config) => (
              <TabsTrigger key={config.id} value={config.id}>
                {config.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {chartConfigs.map((config) => (
            <TabsContent
              key={config.id}
              value={config.id}
              className="h-[200px] mt-2"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={config.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="createdAt"
                    interval="preserveStartEnd"
                    minTickGap={40}
                    tickFormatter={(time) => {
                      const date = new Date(time);
                      if (period === "WEEK") {
                        // For week view, return day name
                        return date.toLocaleDateString(undefined, { weekday: 'short' });
                      } else if (period === "MONTH") {
                        // For month view, format as week indicator (MMM DD)
                        return date.toLocaleDateString(undefined, { 
                          month: 'short', 
                          day: 'numeric' 
                        });
                      }
                      // For day view, return just hours and minutes
                      return date.toLocaleTimeString(undefined, { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      });
                    }}
                  />
                  <YAxis domain={domainSettings[period]} />
                  <Tooltip
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                    formatter={(value: number) => [
                      `${value.toFixed(1)}°C`,
                      "Temperature",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
