"use client";
import { useEffect, useState } from "react";
import TemperatureMonitor from "@/components/temperature-monitor";
import PowerConsumption from "@/components/power-consumption";
import HVACControl from "@/components/hvac-control";
import FloorSelector from "@/components/floor-selector";
import useGetData from "./useGetData";
import { useAreaFloorStore } from "@/store/useAreaSelector";
import { fetchDashboardData } from "./dashboard.service";

export default function DashboardPage() {
  const [selectedFloor, setSelectedFloor] = useState<string | undefined>();
  const [selected, setSelected] = useState<{
    value: string;
    label: string;
    type: string;
    id: string;
  }>();
  const [areas, setAreas] = useState<
    { value: string; label: string; type: string; id: string }[] | undefined
  >();

  const { data } = useGetData();

  useEffect(() => {
    if (data && data.length > 0) {
      setAreas(data);
      setSelectedFloor(data[0].value);
      setSelected(data[0]);
    }
  }, [data]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (selectedFloor) {
        try {
          const dashboardData = await fetchDashboardData(
            selected?.type,
            selected?.id,
          );
          console.log(dashboardData);
        } catch (error) {
          console.error("Failed to fetch dashboard data:", error);
        }
      }
    };

    loadDashboardData();
  }, [selectedFloor]);

  return (
    <main className="flex min-h-screen flex-col p-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">
          Intelligent Power & Security System
        </h1>
        <FloorSelector
          value={selectedFloor}
          onFloorChange={setSelectedFloor}
          className="w-full md:w-64"
          data={areas}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TemperatureMonitor floor={selectedFloor} />
        <PowerConsumption floor={selectedFloor} />
        <HVACControl floor={selectedFloor} />
      </div>
    </main>
  );
}
