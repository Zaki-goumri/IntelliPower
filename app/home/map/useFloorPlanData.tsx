import { useState, useEffect } from "react";
import { FloorPlanData } from "./floorPlan.types";
import { fetchFloorPlanData } from "./floorPlaneService";

export const useFloorPlanData = () => {
  const [floorPlanData, setFloorPlanData] = useState<FloorPlanData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadFloorPlanData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFloorPlanData();
        setFloorPlanData(data);
        setError(null);
      } catch (err) {
        console.error("Error loading floor plan data:", err);
        setError(err instanceof Error ? err : new Error("Failed to load floor plan data"));
      } finally {
        setIsLoading(false);
      }
    };

    loadFloorPlanData();
  }, []);

  return { floorPlanData, isLoading, error };
};
