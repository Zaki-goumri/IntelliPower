"use client";
import { useEffect, useState } from "react";
import TemperatureMonitor from "@/components/temperature-monitor";
import HVACControl from "@/components/hvac-control";
import TemperatureHistory from "@/components/temperature-history";
import TemperatureAlerts from "@/components/temperature-alerts";
import FloorSelector from "@/components/floor-selector";
import { fetchDashboardTemperatureData } from "../dashboard/dashboard.service";
import { getHistoryTemperature } from "./temperatures.service";
import useGetData from "../dashboard/useGetData";

type Period = "DAY" | "WEEK" | "MONTH";

export default function TemperaturePage() {
  const [selectedFloorId, setSelectedFloorId] = useState<string | undefined>();
  const [selectedPeriodTemp, setSelectedPeriodTemp] = useState<Period>("DAY");
  const [selectedPeriodHistory, setSelectedPeriodHistory] =
    useState<Period>("DAY");
  const [temperatureData, setTemperatureData] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any>(null);
  const [temperatureAlerts, setTemperatureAlerts] = useState<any[]>([]);

  const [areas, setAreas] = useState<
    { value: string; label: string; type: string; id: string }[] | undefined
  >();
  const { data } = useGetData();

  const processTemperatureData = (apiData: any[]) => {
    if (!apiData || !Array.isArray(apiData)) return [];
    return apiData.map((item) => ({
      id: item.id || `temp-${Date.now()}`,
      sensorId: item.sensorId || "default-sensor",
      temp: item.temperature || item.temp,
      humidity: item.humidity || 0,
      createdAt: item.timestamp || item.createdAt || new Date().toISOString(),
    }));
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setAreas(data);
      if (!selectedFloorId && data[0]) {
        setSelectedFloorId(data[0].id);
      }
    }
  }, [data]);

  const selectedFloorData = areas?.find((area) => area.id === selectedFloorId);

  useEffect(() => {
    const loadTemperatureData = async () => {
      if (selectedFloorId && selectedFloorData) {
        try {
          const tempData = await fetchDashboardTemperatureData(
            selectedFloorData.type,
            selectedFloorId,
            selectedPeriodTemp,
          );

          setTemperatureData(processTemperatureData(tempData?.data || []));
        } catch (error) {
          console.error("Failed to fetch temperature data:", error);
        }
      }
    };

    loadTemperatureData();
  }, [selectedFloorId, selectedFloorData, selectedPeriodTemp]);

  useEffect(() => {
    const loadHistoryData = async () => {
      if (selectedFloorId && selectedFloorData) {
        try {
          const endDate = new Date();
          const startDate = new Date();

          switch (selectedPeriodHistory) {
            case "DAY":
              startDate.setDate(startDate.getDate() - 1);
              break;
            case "WEEK":
              startDate.setDate(startDate.getDate() - 7);
              break;
            case "MONTH":
              startDate.setMonth(startDate.getMonth() - 1);
              break;
          }

          const groupBy = selectedPeriodHistory.toLowerCase() as
            | "day"
            | "week"
            | "month";

          const historyResponse = await getHistoryTemperature(
            selectedFloorData.type,
            selectedFloorId,
            startDate,
            endDate,
            groupBy,
          );
          const formattedData = {
            actualRes: Array.isArray(historyResponse?.data)
              ? historyResponse.data
              : [historyResponse?.data || {}],
          };
          setHistoryData(formattedData?.actualRes[0].actualRes[0] || []);
        } catch (error) {
          console.error("Failed to fetch temperature history data:", error);
        }
      }
    };

    loadHistoryData();
  }, [selectedFloorId, selectedFloorData, selectedPeriodHistory]);

  return (
    <main className="flex min-h-screen flex-col p-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Temperature Management</h1>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <FloorSelector
            value={selectedFloorId}
            onFloorChange={setSelectedFloorId}
            className="w-full md:w-64"
            data={areas}
          />
        </div>
      </div>

      {selectedFloorData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TemperatureMonitor
            data={temperatureData}
            areaId={selectedFloorData.label}
            period={selectedPeriodTemp}
            onChangePeriod={setSelectedPeriodTemp}
          />
          <HVACControl floor={selectedFloorId} />
          {historyData && (
            <TemperatureHistory
              data={historyData}
              period={selectedPeriodHistory}
              onChangePeriod={setSelectedPeriodHistory}
            />
          )}
          <TemperatureAlerts />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-muted-foreground">
            Internet connection lost. Please check your connection and try
            again.{" "}
          </p>
        </div>
      )}
    </main>
  );
}
