"use client";
import { useEffect, useState } from "react";
import TemperatureMonitor from "@/components/temperature-monitor";
import PowerConsumption from "@/components/power-consumption";
import HVACControl from "@/components/hvac-control";
import FloorSelector from "@/components/floor-selector";
import useGetData from "./useGetData";
import {
  fetchDashboardTemperatureData,
  fetchEnergyConsumationData,
} from "./dashboard.service";

type Period = "DAY" | "WEEK" | "MONTH";

export default function DashboardPage() {
  const [selectedFloorId, setSelectedFloorId] = useState<string | undefined>();
  const [selectedPeriodTemp, setSelectedPeriodTemp] = useState<Period>("DAY");
  const [selectedPeriodEnrg, setSelectedPeriodEnrg] = useState<Period>("DAY");
  const [temperatureData, setTemperatureData] = useState<any[]>([]);
  const [energyConsumption, setEnergyConsumption] = useState<any[]>([]);

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

    const loadEnergyData = async () => {
      if (selectedFloorId && selectedFloorData) {
        try {
          const energyData = await fetchEnergyConsumationData(
            selectedFloorData.type,
            selectedFloorId,
            selectedPeriodEnrg,
          );

          setEnergyConsumption(energyData?.data || []);
        } catch (error) {
          console.error("Failed to fetch energy consumption data:", error);
        }
      }
    };

    loadTemperatureData();
    loadEnergyData();
  }, [
    selectedFloorId,
    selectedFloorData,
    selectedPeriodTemp,
    selectedPeriodEnrg,
  ]);

  return (
    <main className="flex min-h-screen flex-col p-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          Intelligent Power & Security System
        </h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TemperatureMonitor
            data={temperatureData}
            areaId={selectedFloorData.label}
            period={selectedPeriodTemp}
            onChangePeriod={setSelectedPeriodTemp}
          />

          <PowerConsumption
            data={energyConsumption}
            period={selectedPeriodEnrg}
            onChangePeriod={setSelectedPeriodEnrg}
          />
          <HVACControl floor={selectedFloorId} />
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-muted-foreground">
            nternet connection lost. Please check your connection and try again.          </p>
        </div>
      )}
    </main>
  );
}
