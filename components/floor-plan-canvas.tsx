"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff } from "lucide-react"
import { renderFloorPlan } from "@/lib/floor-plan-render"
import type { FloorPlanData } from "@/types/floor-plan.types"
import { toast } from "@/components/ui/use-toast"

interface FloorPlanCanvasProps {
  floorPlanData: FloorPlanData
}

export function FloorPlanCanvas({ floorPlanData }: FloorPlanCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCameras, setShowCameras] = useState<boolean>(true)

  useEffect(() => {
    if (!canvasRef.current) return

    const floorPlanWithCameraSettings = {
      ...floorPlanData,
      cameras: floorPlanData.cameras?.map((camera) => ({
        ...camera,
        isActive: showCameras,
      })),
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      toast({
        title: "Error",
        description: "Could not get canvas context",
        variant: "destructive",
      })
      return
    }

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetWidth * 0.75 // Aspect ratio of 4:3

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Render the floor plan
    renderFloorPlan(ctx, floorPlanWithCameraSettings, canvas.width, canvas.height)

    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetWidth * 0.75

      // Clear and re-render
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      renderFloorPlan(ctx, floorPlanWithCameraSettings, canvas.width, canvas.height)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [floorPlanData, showCameras])

  const toggleCameras = () => {
    setShowCameras(!showCameras)
    toast({
      title: showCameras ? "Cameras hidden" : "Cameras visible",
    })
  }

  return (
    <div className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-auto touch-none" style={{ minHeight: "500px" }} />
      <div className="flex justify-between items-center py-2 px-4 bg-purple-50 dark:bg-purple-900/50">
        <span className="text-sm text-purple-600 dark:text-purple-300">Floor Plan Viewer</span>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleCameras}
          className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-800/50"
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
  )
}
