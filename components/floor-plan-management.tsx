"use client"

import { useState } from "react"
import { FloorPlanCanvas } from "@/components/floor-plan-canvas"
import type { FloorPlanData } from "@/types/floor-plan.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Building, Info, Edit, Trash2 } from "lucide-react"
import { FloorPlanDetails } from "@/components/floor-plan-details"
import { FloorPlanForm } from "@/components/floor-plan-form"
import { toast } from "@/components/ui/use-toast"

// Sample floor plans data
const sampleFloorPlans: FloorPlanData[] = [
  {
    id: "floor-1",
    name: "Main Office - First Floor",
    description: "Main office building first floor with reception area",
    lastUpdated: "2024-03-15",
    dimensions: { width: 1000, height: 800 },
    walls: [
      { start: { x: 100, y: 100 }, end: { x: 900, y: 100 }, thickness: 10 },
      { start: { x: 900, y: 100 }, end: { x: 900, y: 700 }, thickness: 10 },
      { start: { x: 900, y: 700 }, end: { x: 100, y: 700 }, thickness: 10 },
      { start: { x: 100, y: 700 }, end: { x: 100, y: 100 }, thickness: 10 },
      // Interior walls
      { start: { x: 400, y: 100 }, end: { x: 400, y: 400 }, thickness: 8 },
      { start: { x: 400, y: 400 }, end: { x: 700, y: 400 }, thickness: 8 },
    ],
    doors: [
      { start: { x: 500, y: 100 }, end: { x: 600, y: 100 }, isOpen: false },
      { start: { x: 400, y: 250 }, end: { x: 400, y: 350 }, isOpen: true, openingAngle: 90 },
    ],
    windows: [
      { start: { x: 200, y: 100 }, end: { x: 300, y: 100 }, width: 5 },
      { start: { x: 700, y: 100 }, end: { x: 800, y: 100 }, width: 5 },
      { start: { x: 900, y: 200 }, end: { x: 900, y: 300 }, width: 5 },
      { start: { x: 900, y: 500 }, end: { x: 900, y: 600 }, width: 5 },
    ],
    furniture: [
      { type: "table", position: { x: 250, y: 250 }, width: 150, height: 100, rotation: 0 },
      { type: "chair", position: { x: 250, y: 300 }, width: 50, height: 50, rotation: 0 },
      { type: "sofa", position: { x: 800, y: 200 }, width: 150, height: 70, rotation: 90 },
      { type: "bed", position: { x: 800, y: 600 }, width: 180, height: 120, rotation: 0 },
    ],
    cameras: [
      { position: { x: 100, y: 100 }, direction: 45, fieldOfView: 90, range: 300, isActive: true },
      { position: { x: 900, y: 100 }, direction: 135, fieldOfView: 90, range: 300, isActive: true },
      { position: { x: 900, y: 700 }, direction: 225, fieldOfView: 90, range: 300, isActive: true },
      { position: { x: 100, y: 700 }, direction: 315, fieldOfView: 90, range: 300, isActive: true },
    ],
  },
  {
    id: "floor-2",
    name: "Main Office - Second Floor",
    description: "Main office building second floor with meeting rooms",
    lastUpdated: "2024-02-20",
    dimensions: { width: 1000, height: 800 },
    walls: [
      { start: { x: 100, y: 100 }, end: { x: 900, y: 100 }, thickness: 10 },
      { start: { x: 900, y: 100 }, end: { x: 900, y: 700 }, thickness: 10 },
      { start: { x: 900, y: 700 }, end: { x: 100, y: 700 }, thickness: 10 },
      { start: { x: 100, y: 700 }, end: { x: 100, y: 100 }, thickness: 10 },
      // Interior walls
      { start: { x: 500, y: 100 }, end: { x: 500, y: 700 }, thickness: 8 },
      { start: { x: 100, y: 400 }, end: { x: 500, y: 400 }, thickness: 8 },
    ],
    doors: [
      { start: { x: 500, y: 200 }, end: { x: 500, y: 300 }, isOpen: false },
      { start: { x: 500, y: 500 }, end: { x: 500, y: 600 }, isOpen: true, openingAngle: 90 },
      { start: { x: 300, y: 400 }, end: { x: 400, y: 400 }, isOpen: false },
    ],
    windows: [
      { start: { x: 200, y: 100 }, end: { x: 400, y: 100 }, width: 5 },
      { start: { x: 600, y: 100 }, end: { x: 800, y: 100 }, width: 5 },
      { start: { x: 900, y: 200 }, end: { x: 900, y: 350 }, width: 5 },
      { start: { x: 900, y: 450 }, end: { x: 900, y: 600 }, width: 5 },
    ],
    furniture: [
      { type: "table", position: { x: 300, y: 200 }, width: 200, height: 120, rotation: 0 },
      { type: "chair", position: { x: 250, y: 150 }, width: 50, height: 50, rotation: 0 },
      { type: "chair", position: { x: 350, y: 150 }, width: 50, height: 50, rotation: 0 },
      { type: "chair", position: { x: 250, y: 250 }, width: 50, height: 50, rotation: 0 },
      { type: "chair", position: { x: 350, y: 250 }, width: 50, height: 50, rotation: 0 },
      { type: "table", position: { x: 700, y: 400 }, width: 150, height: 150, rotation: 0 },
    ],
    cameras: [
      { position: { x: 100, y: 100 }, direction: 45, fieldOfView: 90, range: 300, isActive: true },
      { position: { x: 900, y: 100 }, direction: 135, fieldOfView: 90, range: 300, isActive: true },
      { position: { x: 900, y: 700 }, direction: 225, fieldOfView: 90, range: 300, isActive: true },
      { position: { x: 100, y: 700 }, direction: 315, fieldOfView: 90, range: 300, isActive: true },
    ],
  },
]

export function FloorPlanManagement() {
  const [floorPlans, setFloorPlans] = useState<FloorPlanData[]>(sampleFloorPlans)
  const [selectedFloorPlanId, setSelectedFloorPlanId] = useState<string>(floorPlans[0]?.id || "")
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const selectedFloorPlan = floorPlans.find((plan) => plan.id === selectedFloorPlanId)

  const handleAddNewPlan = (newPlan: FloorPlanData) => {
    setFloorPlans([...floorPlans, newPlan])
    setSelectedFloorPlanId(newPlan.id)
    setIsCreatingNew(false)
    toast({
      title: "Floor plan created",
      description: `${newPlan.name} has been added successfully.`,
    })
  }

  const handleUpdatePlan = (updatedPlan: FloorPlanData) => {
    setFloorPlans(floorPlans.map((plan) => (plan.id === updatedPlan.id ? updatedPlan : plan)))
    setIsEditing(false)
    toast({
      title: "Floor plan updated",
      description: `${updatedPlan.name} has been updated successfully.`,
    })
  }

  const handleDeletePlan = (id: string) => {
    const planToDelete = floorPlans.find((plan) => plan.id === id)
    if (!planToDelete) return

    setFloorPlans(floorPlans.filter((plan) => plan.id !== id))
    if (selectedFloorPlanId === id) {
      setSelectedFloorPlanId(floorPlans[0]?.id || "")
    }
    toast({
      title: "Floor plan deleted",
      description: `${planToDelete.name} has been deleted.`,
      variant: "destructive",
    })
  }

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-purple-100">Floor Plans Management</h1>
          <p className="text-gray-600 dark:text-purple-300">View, create and manage your building floor plans</p>
        </div>
        <Button onClick={() => setIsCreatingNew(true)} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
          <PlusCircle size={16} />
          Add New Floor Plan
        </Button>
      </div>

      {isCreatingNew ? (
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="bg-purple-50 dark:bg-purple-900/50">
            <CardTitle className="text-purple-900 dark:text-purple-100">Create New Floor Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <FloorPlanForm onSubmit={handleAddNewPlan} onCancel={() => setIsCreatingNew(false)} />
          </CardContent>
        </Card>
      ) : isEditing && selectedFloorPlan ? (
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader className="bg-purple-50 dark:bg-purple-900/50">
            <CardTitle className="text-purple-900 dark:text-purple-100">Edit Floor Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <FloorPlanForm
              floorPlan={selectedFloorPlan}
              onSubmit={handleUpdatePlan}
              onCancel={() => setIsEditing(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-purple-200 dark:border-purple-800">
              <CardHeader className="bg-purple-50 dark:bg-purple-900/50">
                <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
                  <Building size={18} className="text-purple-600 dark:text-purple-400" />
                  Floor Plans
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {floorPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                        selectedFloorPlanId === plan.id
                          ? "bg-purple-100 dark:bg-purple-800/50"
                          : "hover:bg-purple-50 dark:hover:bg-purple-900/30"
                      }`}
                      onClick={() => setSelectedFloorPlanId(plan.id)}
                    >
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-purple-100">{plan.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-purple-300">Last updated: {plan.lastUpdated}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-800/50"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedFloorPlanId(plan.id)
                            setIsEditing(true)
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-800/50"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeletePlan(plan.id)
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedFloorPlan && (
              <Card className="border-purple-200 dark:border-purple-800">
                <CardHeader className="bg-purple-50 dark:bg-purple-900/50">
                  <CardTitle className="flex items-center justify-between text-purple-900 dark:text-purple-100">
                    <span className="flex items-center gap-2">
                      <Info size={18} className="text-purple-600 dark:text-purple-400" />
                      Quick Info
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDetails(!showDetails)}
                      className="text-xs border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-800/50"
                    >
                      {showDetails ? "Hide Details" : "Show Details"}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Name</div>
                      <div className="text-gray-900 dark:text-purple-100">{selectedFloorPlan.name}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Dimensions</div>
                      <div className="text-gray-900 dark:text-purple-100">
                        {selectedFloorPlan.dimensions.width} × {selectedFloorPlan.dimensions.height}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Elements</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-purple-900 dark:bg-purple-100 rounded-full"></div>
                          <span className="text-gray-800 dark:text-purple-200">
                            Walls: {selectedFloorPlan.walls.length}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                          <span className="text-gray-800 dark:text-purple-200">
                            Doors: {selectedFloorPlan.doors?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                          <span className="text-gray-800 dark:text-purple-200">
                            Windows: {selectedFloorPlan.windows?.length || 0}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-800 dark:text-purple-200">
                            Cameras: {selectedFloorPlan.cameras?.length || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-purple-100 dark:bg-purple-900">
                <TabsTrigger
                  value="preview"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800 data-[state=active]:text-purple-900 dark:data-[state=active]:text-purple-100"
                >
                  Preview
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800 data-[state=active]:text-purple-900 dark:data-[state=active]:text-purple-100"
                >
                  Details
                </TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="mt-4">
                {selectedFloorPlan ? (
                  <Card className="border-purple-200 dark:border-purple-800">
                    <CardContent className="p-0 overflow-hidden rounded-md">
                      <FloorPlanCanvas floorPlanData={selectedFloorPlan} />
                    </CardContent>
                  </Card>
                ) : (
                  <div className="flex items-center justify-center h-64 bg-purple-100 dark:bg-purple-900/50 rounded-md">
                    <p className="text-purple-600 dark:text-purple-300">Select a floor plan to preview</p>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="details" className="mt-4">
                {selectedFloorPlan ? (
                  <FloorPlanDetails floorPlan={selectedFloorPlan} />
                ) : (
                  <div className="flex items-center justify-center h-64 bg-purple-100 dark:bg-purple-900/50 rounded-md">
                    <p className="text-purple-600 dark:text-purple-300">Select a floor plan to view details</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  )
}
