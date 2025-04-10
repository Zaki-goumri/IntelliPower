"use client";
import { useEffect, useState } from "react";
import TemperatureMonitor from "@/components/temperature-monitor";
import PowerConsumption from "@/components/power-consumption";
import HVACControl from "@/components/hvac-control";
import FloorSelector from "@/components/floor-selector";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useGetData from "./useGetData";
import { IFloor } from "./dashboard.types";

const FLOOR_ENUM = {
  FLOOR: "floor",
  AREA: "area",
};

function addFloors(floors: IFloor[]) {
  const flatList = floors
    .flatMap((floor) => [
      { name: floor.name, id: floor.id, type: FLOOR_ENUM.FLOOR },
      ...floor.areas.map((area) => ({
        name: area.name,
        id: area.id,
        type: FLOOR_ENUM.AREA,
      })),
    ])
    .map((floor) => {
      return {
        label: floor.name,
        value: floor.id,
        type: floor.type,
      };
    });
  return flatList;
}

export default function DashboardPage() {
  const [selectedFloor, setSelectedFloor] = useState("ground");
  const [areas, setAreas] = useState<
    { value: string; label: string; type: string }[] | undefined
  >();
  const queryClient = new QueryClient();

  const { data } = useGetData();

  useEffect(() => {
    const flatList = data ? addFloors(data) : [];
    setAreas(flatList);
  });

  return (
    <QueryClientProvider client={queryClient}>
      <main className="flex min-h-screen flex-col p-6 w-full">
        <div className="flex flex-col md:flex-row justify-/between items-start md:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">
            Intelligent Power & Security System
          </h1>
          <FloorSelector
            onFloorChange={setSelectedFloor}
            className="w-full md:w-64"
            data={areas || []}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TemperatureMonitor
          path={Array.isArray(areas) && areas.length > 0 ? `${areas[0].type}/${areas[0].label}` : ""}
          />
          <PowerConsumption />
          <HVACControl />
        </div>
      </main>
    </QueryClientProvider>
  );
}
