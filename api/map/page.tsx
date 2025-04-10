'use client'
import { FloorPlanCanvas } from "./FloorPlanCanvas";
import { useFloorPlanData } from "./useFloorPlanData";

const Index = () => {
  const { floorPlanData, isLoading, error } = useFloorPlanData();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="w-full py-6 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-black">Floor Planner</h1>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8 flex flex-col items-center">
        {isLoading && (
          <div className="flex items-center justify-center h-96 w-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
            <p>Error loading floor plan data: {error.message}</p>
          </div>
        )}

        {floorPlanData && (
          <div className="w-full max-w-5xl  rounded-lg overflow-hidden bg-white">
            <FloorPlanCanvas floorPlanData={floorPlanData} />
          </div>
        )}

        
      </main>
    </div>
  );
};

export default Index;
