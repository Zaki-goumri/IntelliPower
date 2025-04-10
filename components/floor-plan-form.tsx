"use client"

import type React from "react"

import { useState } from "react"
import type { FloorPlanData } from "@/types/floor-plan.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Save, X } from "lucide-react"

interface FloorPlanFormProps {
  floorPlan?: FloorPlanData
  onSubmit: (floorPlan: FloorPlanData) => void
  onCancel: () => void
}

export function FloorPlanForm({ floorPlan, onSubmit, onCancel }: FloorPlanFormProps) {
  const isEditing = !!floorPlan

  const [formData, setFormData] = useState<FloorPlanData>(
    floorPlan || {
      id: `floor-${Date.now()}`,
      name: "",
      description: "",
      lastUpdated: new Date().toISOString().split("T")[0],
      dimensions: { width: 1000, height: 800 },
      walls: [
        { start: { x: 100, y: 100 }, end: { x: 900, y: 100 }, thickness: 10 },
        { start: { x: 900, y: 100 }, end: { x: 900, y: 700 }, thickness: 10 },
        { start: { x: 900, y: 700 }, end: { x: 100, y: 700 }, thickness: 10 },
        { start: { x: 100, y: 700 }, end: { x: 100, y: 100 }, thickness: 10 },
      ],
      doors: [],
      windows: [],
      furniture: [],
      cameras: [],
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    if (name === "width" || name === "height") {
      setFormData({
        ...formData,
        dimensions: {
          ...formData.dimensions,
          [name]: Number.parseInt(value) || 0,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Update the lastUpdated field
    const updatedFloorPlan = {
      ...formData,
      lastUpdated: new Date().toISOString().split("T")[0],
    }

    onSubmit(updatedFloorPlan)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-purple-900 dark:text-purple-100">
              Floor Plan Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Main Office - First Floor"
              required
              className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 dark:border-purple-800 dark:focus:border-purple-600 dark:focus:ring-purple-600"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-purple-900 dark:text-purple-100">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of this floor plan"
              rows={3}
              className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 dark:border-purple-800 dark:focus:border-purple-600 dark:focus:ring-purple-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width" className="text-purple-900 dark:text-purple-100">
                Width (px)
              </Label>
              <Input
                id="width"
                name="width"
                type="number"
                value={formData.dimensions.width}
                onChange={handleChange}
                min={100}
                max={2000}
                required
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 dark:border-purple-800 dark:focus:border-purple-600 dark:focus:ring-purple-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-purple-900 dark:text-purple-100">
                Height (px)
              </Label>
              <Input
                id="height"
                name="height"
                type="number"
                value={formData.dimensions.height}
                onChange={handleChange}
                min={100}
                max={2000}
                required
                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400 dark:border-purple-800 dark:focus:border-purple-600 dark:focus:ring-purple-600"
              />
            </div>
          </div>
        </div>

        <div>
          <Tabs defaultValue="template">
            <TabsList className="grid grid-cols-2 w-full bg-purple-100 dark:bg-purple-900">
              <TabsTrigger
                value="template"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800 data-[state=active]:text-purple-900 dark:data-[state=active]:text-purple-100"
              >
                Template
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800 data-[state=active]:text-purple-900 dark:data-[state=active]:text-purple-100"
              >
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="mt-4">
              <Card className="border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="text-sm text-purple-600 dark:text-purple-300">
                      Select a template to quickly create a floor plan:
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center p-4 aspect-square border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-800/50"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            name: formData.name || "Office Space",
                            walls: [
                              { start: { x: 100, y: 100 }, end: { x: 900, y: 100 }, thickness: 10 },
                              { start: { x: 900, y: 100 }, end: { x: 900, y: 700 }, thickness: 10 },
                              { start: { x: 900, y: 700 }, end: { x: 100, y: 700 }, thickness: 10 },
                              { start: { x: 100, y: 700 }, end: { x: 100, y: 100 }, thickness: 10 },
                              { start: { x: 500, y: 100 }, end: { x: 500, y: 700 }, thickness: 8 },
                            ],
                            doors: [
                              { start: { x: 300, y: 100 }, end: { x: 400, y: 100 }, isOpen: false },
                              { start: { x: 500, y: 300 }, end: { x: 500, y: 400 }, isOpen: true, openingAngle: 90 },
                            ],
                            windows: [
                              { start: { x: 600, y: 100 }, end: { x: 800, y: 100 }, width: 5 },
                              { start: { x: 900, y: 200 }, end: { x: 900, y: 400 }, width: 5 },
                            ],
                          })
                        }}
                      >
                        <div className="w-full h-16 border-2 border-dashed border-purple-300 dark:border-purple-700 mb-2 flex items-center justify-center">
                          <div className="w-1/2 h-full bg-purple-100 dark:bg-purple-800"></div>
                          <div className="w-1/2 h-full"></div>
                        </div>
                        <span>Office Space</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center p-4 aspect-square border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-800/50"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            name: formData.name || "Conference Room",
                            walls: [
                              { start: { x: 100, y: 100 }, end: { x: 900, y: 100 }, thickness: 10 },
                              { start: { x: 900, y: 100 }, end: { x: 900, y: 500 }, thickness: 10 },
                              { start: { x: 900, y: 500 }, end: { x: 100, y: 500 }, thickness: 10 },
                              { start: { x: 100, y: 500 }, end: { x: 100, y: 100 }, thickness: 10 },
                            ],
                            doors: [{ start: { x: 450, y: 500 }, end: { x: 550, y: 500 }, isOpen: false }],
                            windows: [{ start: { x: 300, y: 100 }, end: { x: 700, y: 100 }, width: 5 }],
                            furniture: [
                              { type: "table", position: { x: 500, y: 300 }, width: 400, height: 150, rotation: 0 },
                              { type: "chair", position: { x: 350, y: 220 }, width: 50, height: 50, rotation: 0 },
                              { type: "chair", position: { x: 450, y: 220 }, width: 50, height: 50, rotation: 0 },
                              { type: "chair", position: { x: 550, y: 220 }, width: 50, height: 50, rotation: 0 },
                              { type: "chair", position: { x: 650, y: 220 }, width: 50, height: 50, rotation: 0 },
                              { type: "chair", position: { x: 350, y: 380 }, width: 50, height: 50, rotation: 180 },
                              { type: "chair", position: { x: 450, y: 380 }, width: 50, height: 50, rotation: 180 },
                              { type: "chair", position: { x: 550, y: 380 }, width: 50, height: 50, rotation: 180 },
                              { type: "chair", position: { x: 650, y: 380 }, width: 50, height: 50, rotation: 180 },
                            ],
                          })
                        }}
                      >
                        <div className="w-full h-16 border-2 border-dashed border-purple-300 dark:border-purple-700 mb-2 flex items-center justify-center">
                          <div className="w-3/4 h-1/2 mx-auto bg-purple-100 dark:bg-purple-800"></div>
                        </div>
                        <span>Conference Room</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center p-4 aspect-square border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-800/50"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            name: formData.name || "Apartment",
                            walls: [
                              { start: { x: 100, y: 100 }, end: { x: 900, y: 100 }, thickness: 10 },
                              { start: { x: 900, y: 100 }, end: { x: 900, y: 700 }, thickness: 10 },
                              { start: { x: 900, y: 700 }, end: { x: 100, y: 700 }, thickness: 10 },
                              { start: { x: 100, y: 700 }, end: { x: 100, y: 100 }, thickness: 10 },
                              { start: { x: 400, y: 100 }, end: { x: 400, y: 400 }, thickness: 8 },
                              { start: { x: 400, y: 400 }, end: { x: 900, y: 400 }, thickness: 8 },
                              { start: { x: 650, y: 400 }, end: { x: 650, y: 700 }, thickness: 8 },
                            ],
                            doors: [
                              { start: { x: 300, y: 100 }, end: { x: 350, y: 100 }, isOpen: false },
                              { start: { x: 400, y: 200 }, end: { x: 400, y: 250 }, isOpen: true, openingAngle: 90 },
                              { start: { x: 500, y: 400 }, end: { x: 550, y: 400 }, isOpen: false },
                              { start: { x: 750, y: 400 }, end: { x: 800, y: 400 }, isOpen: false },
                              { start: { x: 650, y: 550 }, end: { x: 650, y: 600 }, isOpen: false },
                            ],
                            windows: [
                              { start: { x: 200, y: 100 }, end: { x: 250, y: 100 }, width: 5 },
                              { start: { x: 600, y: 100 }, end: { x: 700, y: 100 }, width: 5 },
                              { start: { x: 900, y: 200 }, end: { x: 900, y: 300 }, width: 5 },
                              { start: { x: 900, y: 500 }, end: { x: 900, y: 600 }, width: 5 },
                              { start: { x: 300, y: 700 }, end: { x: 400, y: 700 }, width: 5 },
                              { start: { x: 750, y: 700 }, end: { x: 850, y: 700 }, width: 5 },
                            ],
                            furniture: [
                              { type: "bed", position: { x: 250, y: 250 }, width: 200, height: 150, rotation: 0 },
                              { type: "table", position: { x: 750, y: 200 }, width: 100, height: 100, rotation: 0 },
                              { type: "sofa", position: { x: 250, y: 550 }, width: 200, height: 80, rotation: 0 },
                              { type: "table", position: { x: 250, y: 450 }, width: 100, height: 60, rotation: 0 },
                              { type: "table", position: { x: 780, y: 550 }, width: 150, height: 80, rotation: 0 },
                            ],
                          })
                        }}
                      >
                        <div className="w-full h-16 border-2 border-dashed border-purple-300 dark:border-purple-700 mb-2 flex items-center justify-center">
                          <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                            <div className="border-r border-b border-purple-300 dark:border-purple-700"></div>
                            <div className="border-b border-purple-300 dark:border-purple-700"></div>
                            <div className="border-r border-purple-300 dark:border-purple-700"></div>
                            <div className="grid grid-cols-2">
                              <div className="border-r border-purple-300 dark:border-purple-700"></div>
                              <div></div>
                            </div>
                          </div>
                        </div>
                        <span>Apartment</span>
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        className="h-auto flex flex-col items-center justify-center p-4 aspect-square border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-800/50"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            name: formData.name || "Empty Room",
                            walls: [
                              { start: { x: 100, y: 100 }, end: { x: 900, y: 100 }, thickness: 10 },
                              { start: { x: 900, y: 100 }, end: { x: 900, y: 700 }, thickness: 10 },
                              { start: { x: 900, y: 700 }, end: { x: 100, y: 700 }, thickness: 10 },
                              { start: { x: 100, y: 700 }, end: { x: 100, y: 100 }, thickness: 10 },
                            ],
                            doors: [{ start: { x: 450, y: 700 }, end: { x: 550, y: 700 }, isOpen: false }],
                            windows: [
                              { start: { x: 300, y: 100 }, end: { x: 400, y: 100 }, width: 5 },
                              { start: { x: 600, y: 100 }, end: { x: 700, y: 100 }, width: 5 },
                            ],
                            furniture: [],
                            cameras: [],
                          })
                        }}
                      >
                        <div className="w-full h-16 border-2 border-dashed border-purple-300 dark:border-purple-700 mb-2"></div>
                        <span>Empty Room</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced" className="mt-4">
              <Card className="border-purple-200 dark:border-purple-800">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="text-sm text-purple-600 dark:text-purple-300">
                      Advanced settings will be available in a future update. Currently, you can use templates to create
                      floor plans.
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="gap-2 border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-800/50"
        >
          <X size={16} />
          Cancel
        </Button>
        <Button type="submit" className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
          <Save size={16} />
          {isEditing ? "Update Floor Plan" : "Create Floor Plan"}
        </Button>
      </div>
    </form>
  )
}
