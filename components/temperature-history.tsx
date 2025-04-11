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
import { Calendar, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TemperatureReading {
  id: string;
  sensorId: number;
  temp: number;
  humidity: number;
  createdAt: string;
}

interface DayData {
  key: string;
  average: number;
  content: TemperatureReading[];
}

interface HistoryData {
  actualRes?: DayData[];
}

export default function TemperatureHistory({
  data,
  period,
  onChangePeriod,
}: {
  data: any;
  period: "DAY" | "WEEK" | "MONTH";
  onChangePeriod: (period: "DAY" | "WEEK" | "MONTH") => void;
}) {
  const [chartData, setChartData] = useState<
    { time: string; temp: number; humidity?: number }[]
  >([]);
  const [stats, setStats] = useState({ avg: 0, min: 0, max: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const calculatedStats = calculateStats(data);

      setChartData(data?.content);
      console.log(data?.content)
      setStats(calculatedStats);
      setLoading(false);
    } catch (error) {
      console.error("Error processing data:", error);
      setLoading(false);
    }
  }, [data, period]);

  const processDataForPeriod = (data: HistoryData, period: string) => {
    if (!data.actualRes?.length) return [];

    switch (period) {
      case "DAY":
        return processDailyData(data);
      case "WEEK":
        return processWeeklyData(data);
      case "MONTH":
        return processMonthlyData(data);
      default:
        return [];
    }
  };

  const processDailyData = (data: HistoryData) => {
    const recentDay = data.actualRes?.[0];
    if (!recentDay?.content?.length) return [];

    const hourlyData: Map<string, { tempSum: number; humiditySum: number; count: number }> = new Map();

    recentDay.content.forEach((reading) => {
      try {
        const date = new Date(reading.createdAt);
        const hour = date.getHours();
        const hourKey = `${hour.toString().padStart(2, "0")}:00`;

        const current = hourlyData.get(hourKey) || { tempSum: 0, humiditySum: 0, count: 0 };
        hourlyData.set(hourKey, {
          tempSum: current.tempSum + (reading.temp || 0),
          humiditySum: current.humiditySum + (reading.humidity || 0),
          count: current.count + 1,
        });
      } catch (e) {
        console.warn("Error processing reading:", reading);
      }
    });

    return Array.from(hourlyData.entries())
      .map(([time, { tempSum, humiditySum, count }]) => ({
        time,
        temperature: parseFloat((tempSum / count).toFixed(1)),
        humidity: parseFloat((humiditySum / count).toFixed(1)),
      }))
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const processWeeklyData = (data: HistoryData) => {
    return (data.actualRes || []).slice(0, 7).map((day) => {
      const humidityValues = day.content.map(reading => reading.humidity).filter(h => h !== undefined);
      const avgHumidity = humidityValues.length > 0 
        ? humidityValues.reduce((sum, val) => sum + val, 0) / humidityValues.length
        : undefined;

      return {
        time: new Date(day.key).toLocaleDateString([], { weekday: "short" }),
        temperature: parseFloat((day.average || 0).toFixed(1)),
        humidity: avgHumidity ? parseFloat(avgHumidity.toFixed(1)) : undefined
      };
    });
  };

  const processMonthlyData = (data: HistoryData) => {
    return (data.actualRes || []).map((day) => {
      const humidityValues = day.content.map(reading => reading.humidity).filter(h => h !== undefined);
      const avgHumidity = humidityValues.length > 0 
        ? humidityValues.reduce((sum, val) => sum + val, 0) / humidityValues.length
        : undefined;

      return {
        time: new Date(day.key).getDate().toString(),
        temperature: parseFloat((day.average || 0).toFixed(1)),
        humidity: avgHumidity ? parseFloat(avgHumidity.toFixed(1)) : undefined
      };
    });
  };

  const calculateStats = (data: HistoryData) => {
    const allTemps = (data.actualRes || [])
      .flatMap((day) => day.content?.map((r) => r.temp) || [])
      .filter((temp): temp is number => typeof temp === "number");

    if (allTemps.length === 0) return { avg: 0, min: 0, max: 0 };

    const avg = allTemps.reduce((s, t) => s + t, 0) / allTemps.length;
    return {
      avg: parseFloat(avg.toFixed(1)),
      min: parseFloat(Math.min(...allTemps).toFixed(1)),
      max: parseFloat(Math.max(...allTemps).toFixed(1)),
    };
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Humidity History</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={period} onValueChange={(value) => onChangePeriod(value as "DAY" | "WEEK" | "MONTH")}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="DAY" className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Daily
              </TabsTrigger>
              <TabsTrigger value="WEEK" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Weekly
              </TabsTrigger>
              <TabsTrigger value="MONTH" className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Monthly
              </TabsTrigger>
            </TabsList>

            {/* <Button variant="outline" size="sm" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button> */}
          </div>

          {loading ? (
            <div className="h-[250px] flex items-center justify-center">
              <p>Loading temperature data...</p>
            </div>
          ) : (
            <>
              <TabsContent value="DAY" className="h-[250px] mt-2">
                <ChartComponent data={chartData} yDomain={[20, 35]} />
              </TabsContent>

              <TabsContent value="WEEK" className="h-[250px] mt-2">
                <ChartComponent data={chartData} yDomain={[20, 35]} />
              </TabsContent>

              <TabsContent value="MONTH" className="h-[250px] mt-2">
                <ChartComponent data={chartData} yDomain={[15, 40]} />
              </TabsContent>
            </>
          )}
        </Tabs>

        <StatsDisplay stats={stats} />
      </CardContent>
    </Card>
  );
}

const ChartComponent = ({
  data,
  yDomain,
}: {
  data: any[];
  yDomain: [number, number];
}) => (
  <ResponsiveContainer width="100%" height="100%">
    <LineChart 
      data={data}
      margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="time" />
      <YAxis 
        yAxisId="left" 
        domain={yDomain} 
        label={{ value: '°C', angle: -90, position: 'insideLeft' }} 
      />
      <YAxis 
        yAxisId="right" 
        orientation="right" 
        domain={[0, 100]} 
        label={{ value: '%', angle: 90, position: 'insideRight' }} 
      />
      <Tooltip 
        formatter={(value: number, name: string) => {
          if (name === 'temp') return [`${value}°C`, "Temperature"];
          if (name === 'humidity') return [`${value}%`, "Humidity"];
          return [value, name];
        }} 
      />
      <Line
        yAxisId="left"
        type="monotone"
        dataKey="temperature"
        stroke="#3b82f6"
        strokeWidth={2}
        dot={false}
        activeDot={{ r: 6 }}
        name="Temperature"
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="humidity"
        stroke="#10b981"
        strokeWidth={2}
        dot={false}
        activeDot={{ r: 3 }}
        name="Humidity"
      />
    </LineChart>
  </ResponsiveContainer>
);

const StatsDisplay = ({
  stats,
}: {
  stats: { avg: number; min: number; max: number };
}) => (
  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
    <div className="bg-muted p-2 rounded-md">
      <div className="text-sm font-medium">Average</div>
      <div className="text-xl font-bold text-blue-500">
        {stats.avg.toFixed(1)}°C
      </div>
    </div>
    <div className="bg-muted p-2 rounded-md">
      <div className="text-sm font-medium">Min</div>
      <div className="text-xl font-bold text-green-500">
        {stats.min.toFixed(1)}°C
      </div>
    </div>
    <div className="bg-muted p-2 rounded-md">
      <div className="text-sm font-medium">Max</div>
      <div className="text-xl font-bold text-amber-500">
        {stats.max.toFixed(1)}°C
      </div>
    </div>
  </div>
);
