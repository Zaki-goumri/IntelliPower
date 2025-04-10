"use client"

import type { FloorPlanData } from "@/types/floor-plan.types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  WallpaperIcon as Wall,
  DoorOpen,
  Blinds,
  Sofa,
  Camera,
  LayoutGrid,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react"

interface FloorPlanDetailsProps {
  floorPlan: FloorPlanData
}

export function FloorPlanDetails({ floorPlan }: FloorPlanDetailsProps) {
  // Calculate statistics
  const totalWalls = floorPlan.walls.length
  const totalDoors = floorPlan.doors?.length || 0
  const totalWindows = floorPlan.windows?.length || 0
  const totalFurniture = floorPlan.furniture?.length || 0
  const totalCameras = floorPlan.cameras?.length || 0

  const activeCameras = floorPlan.cameras?.filter((camera) => camera.isActive).length || 0
  const inactiveCameras = totalCameras - activeCameras

  const openDoors = floorPlan.doors?.filter((door) => door.isOpen).length || 0
  const closedDoors = totalDoors - openDoors

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 dark:border-purple-800">
        <CardHeader className="">
          <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
            <LayoutGrid size={18} className="text-purple-600 dark:text-purple-400" />
            Floor Plan Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-purple-100">{floorPlan.name}</h3>
              <p className="text-gray-600 dark:text-purple-300">{floorPlan.description}</p>
              <p className="text-sm text-gray-500 dark:text-purple-400 mt-2">Last updated: {floorPlan.lastUpdated}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/50 p-3 rounded-md">
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Dimensions</div>
                <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
                  {floorPlan.dimensions.width} × {floorPlan.dimensions.height}
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/50 p-3 rounded-md">
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Elements</div>
                <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
                  {totalWalls + totalDoors + totalWindows + totalFurniture + totalCameras}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-md flex flex-col items-center">
              <Wall className="h-6 w-6 mb-1 text-purple-700 dark:text-purple-300" />
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalWalls}</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Walls</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-md flex flex-col items-center">
              <DoorOpen className="h-6 w-6 mb-1 text-amber-500" />
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalDoors}</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Doors</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-md flex flex-col items-center">
              <Blinds className="h-6 w-6 mb-1 text-sky-500" />
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalWindows}</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Windows</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-md flex flex-col items-center">
              <Sofa className="h-6 w-6 mb-1 text-purple-500" />
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalFurniture}</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Furniture</div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-md flex flex-col items-center">
              <Camera className="h-6 w-6 mb-1 text-green-500" />
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{totalCameras}</div>
              <div className="text-xs text-purple-600 dark:text-purple-400">Cameras</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="cameras">
        <TabsList className="grid grid-cols-4 w-full bg-purple-100 dark:bg-purple-900">
          <TabsTrigger
            value="cameras"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800 data-[state=active]:text-purple-900 dark:data-[state=active]:text-purple-100"
          >
            Cameras
          </TabsTrigger>
          <TabsTrigger
            value="doors"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800 data-[state=active]:text-purple-900 dark:data-[state=active]:text-purple-100"
          >
            Doors
          </TabsTrigger>
          <TabsTrigger
            value="windows"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800 data-[state=active]:text-purple-900 dark:data-[state=active]:text-purple-100"
          >
            Windows
          </TabsTrigger>
          <TabsTrigger
            value="furniture"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-purple-800 data-[state=active]:text-purple-900 dark:data-[state=active]:text-purple-100"
          >
            Furniture
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cameras" className="mt-4">
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="">
              <CardTitle className="flex items-center justify-between text-purple-900 dark:text-purple-100">
                <span className="flex items-center gap-2">
                  <Camera size={18} className="text-purple-600 dark:text-purple-400" />
                  Cameras
                </span>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                  >
                    {activeCameras} Active
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800"
                  >
                    {inactiveCameras} Inactive
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-purple-50 dark:bg-purple-900/30">
                  <TableRow>
                    <TableHead className="text-purple-900 dark:text-purple-300">Position</TableHead>
                    <TableHead className="text-purple-900 dark:text-purple-300">Direction</TableHead>
                    <TableHead className="text-purple-900 dark:text-purple-300">Field of View</TableHead>
                    <TableHead className="text-purple-900 dark:text-purple-300">Range</TableHead>
                    <TableHead className="text-purple-900 dark:text-purple-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {floorPlan.cameras?.map((camera, index) => (
                    <TableRow key={index} className="border-b border-purple-100 dark:border-purple-800">
                      <TableCell className="text-gray-800 dark:text-purple-200">
                        ({camera.position.x}, {camera.position.y})
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-purple-200">{camera.direction}°</TableCell>
                      <TableCell className="text-gray-800 dark:text-purple-200">{camera.fieldOfView}°</TableCell>
                      <TableCell className="text-gray-800 dark:text-purple-200">{camera.range}</TableCell>
                      <TableCell>
                        {camera.isActive ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800 flex items-center gap-1"
                          >
                            <CheckCircle2 size={12} />
                            Active
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800 flex items-center gap-1"
                          >
                            <AlertTriangle size={12} />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doors" className="mt-4">
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="">
              <CardTitle className="flex items-center justify-between text-purple-900 dark:text-purple-100">
                <span className="flex items-center gap-2">
                  <DoorOpen size={18} className="text-purple-600 dark:text-purple-400" />
                  Doors
                </span>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                  >
                    {openDoors} Open
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800"
                  >
                    {closedDoors} Closed
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-purple-50 dark:bg-purple-900/30">
                  <TableRow>
                    <TableHead className="text-purple-900 dark:text-purple-300">Start Position</TableHead>
                    <TableHead className="text-purple-900 dark:text-purple-300">End Position</TableHead>
                    <TableHead className="text-purple-900 dark:text-purple-300">Status</TableHead>
                    <TableHead className="text-purple-900 dark:text-purple-300">Opening Angle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {floorPlan.doors?.map((door, index) => (
                    <TableRow key={index} className="border-b border-purple-100 dark:border-purple-800">
                      <TableCell className="text-gray-800 dark:text-purple-200">
                        ({door.start.x}, {door.start.y})
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-purple-200">
                        ({door.end.x}, {door.end.y})
                      </TableCell>
                      <TableCell>
                        {door.isOpen ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                          >
                            Open
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800"
                          >
                            Closed
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-purple-200">{door.openingAngle || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="windows" className="mt-4">
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
                <Blinds size={18} className="text-purple-600 dark:text-purple-400" />
                Windows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-purple-50 dark:bg-purple-900/30">
                  <TableRow>
                    <TableHead className="text-purple-900 dark:text-purple-300">Start Position</TableHead>
                    <TableHead className="text-purple-900 dark:text-purple-300">End Position</TableHead>
                    <TableHead className="text-purple-900 dark:text-purple-300">Width</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {floorPlan.windows?.map((window, index) => (
                    <TableRow key={index} className="border-b border-purple-100 dark:border-purple-800">
                      <TableCell className="text-gray-800 dark:text-purple-200">
                        ({window.start.x}, {window.start.y})
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-purple-200">
                        ({window.end.x}, {window.end.y})
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-purple-200">{window.width}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="furniture" className="mt-4">
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader className="">
              <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
                <Sofa size={18} className="text-purple-600 dark:text-purple-400" />
                Furniture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-purple-50 dark:bg-purple-900/30">
                  <TableRow>
                    <TableHead className="text-purple-900 dark:text-purple-300">Type</TableHead>
                    <TableHead className="text-purple-900 dark:text-purple-300">Position</TableHead>
                    <TableHead className="text-purple-900 dark:text-purple-300">Dimensions</TableHead>
                    <TableHead className="text-purple-900 dark:text-purple-300">Rotation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {floorPlan.furniture?.map((furniture, index) => (
                    <TableRow key={index} className="border-b border-purple-100 dark:border-purple-800">
                      <TableCell className="capitalize text-gray-800 dark:text-purple-200">{furniture.type}</TableCell>
                      <TableCell className="text-gray-800 dark:text-purple-200">
                        ({furniture.position.x}, {furniture.position.y})
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-purple-200">
                        {furniture.width} × {furniture.height}
                      </TableCell>
                      <TableCell className="text-gray-800 dark:text-purple-200">{furniture.rotation}°</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
