import { useEffect, useRef, useState } from "react";
import { FloorPlanData } from "./floorPlan.types";
import { renderFloorPlan } from "./floorPlan.Render";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Camera, CameraOff } from "lucide-react";

interface FloorPlanCanvasProps {
  floorPlanData: FloorPlanData;
}

export const FloorPlanCanvas = ({ floorPlanData }: FloorPlanCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCameras, setShowCameras] = useState<boolean>(true);

  // Update floor plan data to toggle camera visibility
  const floorPlanWithCameraSettings = {
    ...floorPlanData,
    cameras: floorPlanData.cameras?.map((camera) => ({
      ...camera,
      isActive: showCameras,
    })),
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      toast.error("Could not get canvas context");
      return;
    }

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetWidth * 0.75; // Aspect ratio of 4:3

    // Clear canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render the floor plan
    renderFloorPlan(
      ctx,
      floorPlanWithCameraSettings,
      canvas.width,
      canvas.height,
    );

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetWidth * 0.75;

      // Clear and re-render
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      renderFloorPlan(
        ctx,
        floorPlanWithCameraSettings,
        canvas.width,
        canvas.height,
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [floorPlanWithCameraSettings]);

  const toggleCameras = () => {
    setShowCameras(!showCameras);
    toast.success(showCameras ? "Cameras hidden" : "Cameras visible");
  };

  return (
    <div className="w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-auto touch-none"
        style={{ minHeight: "500px" }}
      />
      <div className="flex justify-between items-center py-2 px-4 bg-gray-50">
        <span className="text-sm text-gray-500">Floor Plan Viewer</span>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleCameras}
          className="gap-2"
        >
          {showCameras ? (
            <>
              <CameraOff size={16} />
              Hide Cameras
            </>
          ) : (
            <>
              <Camera size={16} />
              Show Cameras
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
