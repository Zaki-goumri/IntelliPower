"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Server,
  Cpu,
  Fan,
  Router,
  Trash2,
  Plus,
  Minus,
  Move,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Thermometer,
  Wifi,
} from "lucide-react"

type ElementType = "rack" | "server" | "cooling" | "network"
type StatusType = "operational" | "warning" | "critical" | "offline"

interface Element {
  id: string
  type: ElementType
  x: number
  y: number
  width: number
  height: number
  rotation: number
  label: string
  status: StatusType
  temperature?: number
  load?: number
  networkStatus?: number
}

interface Room {
  id: string
  name: string
  elements: Element[]
}

// Sample data center floor plan
const initialRooms: Room[] = [
  {
    id: "server-room-1",
    name: "Server Room A",
    elements: [
      {
        id: "rack-1",
        type: "rack",
        x: 100,
        y: 100,
        width: 60,
        height: 120,
        rotation: 0,
        label: "Rack A1",
        status: "operational",
        temperature: 22,
      },
      {
        id: "rack-2",
        type: "rack",
        x: 200,
        y: 100,
        width: 60,
        height: 120,
        rotation: 0,
        label: "Rack A2",
        status: "warning",
        temperature: 28,
      },
      {
        id: "rack-3",
        type: "rack",
        x: 300,
        y: 100,
        width: 60,
        height: 120,
        rotation: 0,
        label: "Rack A3",
        status: "operational",
        temperature: 24,
      },
      {
        id: "cooling-1",
        type: "cooling",
        x: 150,
        y: 300,
        width: 80,
        height: 80,
        rotation: 0,
        label: "CRAC Unit 1",
        status: "operational",
      },
    ],
  },
  {
    id: "network-room",
    name: "Network Operations",
    elements: [
      {
        id: "network-1",
        type: "network",
        x: 500,
        y: 150,
        width: 50,
        height: 30,
        rotation: 0,
        label: "Core Switch",
        status: "operational",
        networkStatus: 95,
      },
      {
        id: "network-2",
        type: "network",
        x: 600,
        y: 150,
        width: 50,
        height: 30,
        rotation: 0,
        label: "Edge Router",
        status: "critical",
        networkStatus: 45,
      },
      {
        id: "server-1",
        type: "server",
        x: 550,
        y: 250,
        width: 80,
        height: 40,
        rotation: 0,
        label: "DNS Server",
        status: "warning",
        load: 87,
      },
    ],
  },
  {
    id: "storage-room",
    name: "Storage Array",
    elements: [
      {
        id: "rack-4",
        type: "rack",
        x: 100,
        y: 450,
        width: 60,
        height: 120,
        rotation: 0,
        label: "Storage Rack 1",
        status: "operational",
        temperature: 23,
      },
      {
        id: "rack-5",
        type: "rack",
        x: 200,
        y: 450,
        width: 60,
        height: 120,
        rotation: 0,
        label: "Storage Rack 2",
        status: "offline",
        temperature: 0,
      },
      {
        id: "cooling-2",
        type: "cooling",
        x: 300,
        y: 500,
        width: 80,
        height: 80,
        rotation: 0,
        label: "CRAC Unit 2",
        status: "warning",
      },
    ],
  },
]

export function DataCenterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rooms, setRooms] = useState<Room[]>(initialRooms)
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [currentType, setCurrentType] = useState<ElementType>("rack")
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(true)
  const [gridSize, setGridSize] = useState(20)
  const [newElementCoords, setNewElementCoords] = useState({ x: 0, y: 0 })
  const [newElementSize, setNewElementSize] = useState({ width: 40, height: 80 })
  const [newElementLabel, setNewElementLabel] = useState("")
  const [showLabels, setShowLabels] = useState(true)
  const [showStatus, setShowStatus] = useState(true)

  // Draw the canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply zoom and position
    ctx.save()
    ctx.translate(position.x, position.y)
    ctx.scale(zoom, zoom)

    // Draw grid if enabled
    if (showGrid) {
      drawGrid(ctx, canvas.width, canvas.height, gridSize, zoom, position)
    }

    // Draw room boundaries and labels
    rooms.forEach((room) => {
      const isSelected = room.id === selectedRoom

      // Calculate room boundaries
      const elements = room.elements
      if (elements.length === 0) return

      let minX = Number.POSITIVE_INFINITY,
        minY = Number.POSITIVE_INFINITY,
        maxX = Number.NEGATIVE_INFINITY,
        maxY = Number.NEGATIVE_INFINITY

      elements.forEach((element) => {
        minX = Math.min(minX, element.x - element.width / 2)
        minY = Math.min(minY, element.y - element.height / 2)
        maxX = Math.max(maxX, element.x + element.width / 2)
        maxY = Math.max(maxY, element.y + element.height / 2)
      })

      // Add padding
      const padding = 40
      minX -= padding
      minY -= padding
      maxX += padding
      maxY += padding

      // Draw room boundary
      ctx.beginPath()
      ctx.rect(minX, minY, maxX - minX, maxY - minY)
      ctx.strokeStyle = isSelected ? "#8b5cf6" : "#a78bfa"
      ctx.lineWidth = isSelected ? 3 : 2
      ctx.stroke()

      // Fill room with very light purple
      ctx.fillStyle = isSelected ? "rgba(139, 92, 246, 0.1)" : "rgba(167, 139, 250, 0.05)"
      ctx.fill()

      // Draw room name
      if (showLabels) {
        ctx.font = "16px sans-serif"
        ctx.fillStyle = "#6d28d9"
        ctx.fillText(room.name, minX + 10, minY + 20)
      }

      // Draw elements
      elements.forEach((element) => {
        drawElement(ctx, element, element.id === selectedElement)
      })
    })

    ctx.restore()
  }, [rooms, selectedRoom, selectedElement, zoom, position, showGrid, gridSize, showLabels, showStatus])

  // Draw grid
  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    size: number,
    zoom: number,
    offset: { x: number; y: number },
  ) => {
    ctx.strokeStyle = "#e9d5ff" // Light purple for grid
    ctx.lineWidth = 0.5

    const startX = Math.floor(-offset.x / zoom / size) * size
    const startY = Math.floor(-offset.y / zoom / size) * size
    const endX = startX + width / zoom + size * 2
    const endY = startY + height / zoom + size * 2

    // Draw vertical lines
    for (let x = startX; x < endX; x += size) {
      ctx.beginPath()
      ctx.moveTo(x, startY)
      ctx.lineTo(x, endY)
      ctx.stroke()
    }

    // Draw horizontal lines
    for (let y = startY; y < endY; y += size) {
      ctx.beginPath()
      ctx.moveTo(startX, y)
      ctx.lineTo(endX, y)
      ctx.stroke()
    }
  }

  // Get status color
  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case "operational":
        return "#10b981" // green
      case "warning":
        return "#f59e0b" // amber
      case "critical":
        return "#ef4444" // red
      case "offline":
        return "#6b7280" // gray
      default:
        return "#6b7280"
    }
  }

  // Draw a single element
  const drawElement = (ctx: CanvasRenderingContext2D, element: Element, isSelected: boolean) => {
    ctx.save()
    ctx.translate(element.x, element.y)
    ctx.rotate((element.rotation * Math.PI) / 180)

    const statusColor = getStatusColor(element.status)

    // Draw the element based on its type
    switch (element.type) {
      case "rack":
        // Draw rack
        ctx.fillStyle = "#f5f3ff" // Very light purple
        ctx.strokeStyle = isSelected ? "#8b5cf6" : "#a78bfa"
        ctx.lineWidth = isSelected ? 2 : 1
        ctx.fillRect(-element.width / 2, -element.height / 2, element.width, element.height)
        ctx.strokeRect(-element.width / 2, -element.height / 2, element.width, element.height)

        // Draw rack details
        ctx.fillStyle = "#c4b5fd" // Medium light purple
        for (let i = -element.height / 2 + 5; i < element.height / 2 - 5; i += 10) {
          ctx.fillRect(-element.width / 2 + 3, i, element.width - 6, 5)
        }

        // Draw status indicator
        if (showStatus) {
          ctx.fillStyle = statusColor
          ctx.beginPath()
          ctx.arc(element.width / 2 - 10, -element.height / 2 + 10, 5, 0, Math.PI * 2)
          ctx.fill()
        }
        break

      case "server":
        ctx.fillStyle = "#ede9fe" // Light purple
        ctx.strokeStyle = isSelected ? "#8b5cf6" : "#a78bfa"
        ctx.lineWidth = isSelected ? 2 : 1
        ctx.fillRect(-element.width / 2, -element.height / 2, element.width, element.height)
        ctx.strokeRect(-element.width / 2, -element.height / 2, element.width, element.height)

        // Draw server details
        ctx.fillStyle = "#c4b5fd" // Medium light purple
        ctx.fillRect(element.width / 2 - 10, -element.height / 2 + 5, 5, element.height - 10)

        // Draw status indicator
        if (showStatus) {
          ctx.fillStyle = statusColor
          ctx.beginPath()
          ctx.arc(element.width / 2 - 5, -element.height / 2 + 5, 3, 0, Math.PI * 2)
          ctx.fill()

          // Draw load bar if available
          if (element.load !== undefined) {
            const barWidth = (element.width - 15) * (element.load / 100)
            ctx.fillStyle = element.load > 80 ? "#ef4444" : element.load > 60 ? "#f59e0b" : "#10b981"
            ctx.fillRect(-element.width / 2 + 5, element.height / 2 - 8, barWidth, 3)
          }
        }
        break

      case "cooling":
        ctx.fillStyle = "#f5f3ff" // Very light purple
        ctx.strokeStyle = isSelected ? "#8b5cf6" : "#a78bfa"
        ctx.lineWidth = isSelected ? 2 : 1
        ctx.fillRect(-element.width / 2, -element.height / 2, element.width, element.height)
        ctx.strokeRect(-element.width / 2, -element.height / 2, element.width, element.height)

        // Draw cooling unit details
        ctx.beginPath()
        ctx.arc(0, 0, element.width / 3, 0, Math.PI * 2)
        ctx.fillStyle = "#ddd6fe" // Medium purple
        ctx.fill()

        // Draw status indicator
        if (showStatus) {
          ctx.fillStyle = statusColor
          ctx.beginPath()
          ctx.arc(element.width / 2 - 10, -element.height / 2 + 10, 5, 0, Math.PI * 2)
          ctx.fill()
        }
        break

      case "network":
        ctx.fillStyle = "#ede9fe" // Light purple
        ctx.strokeStyle = isSelected ? "#8b5cf6" : "#a78bfa"
        ctx.lineWidth = isSelected ? 2 : 1
        ctx.fillRect(-element.width / 2, -element.height / 2, element.width, element.height)
        ctx.strokeRect(-element.width / 2, -element.height / 2, element.width, element.height)

        // Draw network details
        ctx.fillStyle = "#c4b5fd" // Medium light purple
        ctx.fillRect(-element.width / 2 + 5, -element.height / 2 + 5, element.width - 10, 5)
        ctx.fillRect(-element.width / 2 + 5, element.height / 2 - 10, element.width - 10, 5)

        // Draw status indicator
        if (showStatus) {
          ctx.fillStyle = statusColor
          ctx.beginPath()
          ctx.arc(element.width / 2 - 5, -element.height / 2 + 5, 3, 0, Math.PI * 2)
          ctx.fill()

          // Draw network status bar if available
          if (element.networkStatus !== undefined) {
            const barWidth = (element.width - 10) * (element.networkStatus / 100)
            ctx.fillStyle = element.networkStatus < 50 ? "#ef4444" : element.networkStatus < 80 ? "#f59e0b" : "#10b981"
            ctx.fillRect(-element.width / 2 + 5, element.height / 2 - 8, barWidth, 3)
          }
        }
        break
    }

    // Draw label
    if (showLabels && element.label) {
      ctx.fillStyle = "#6d28d9" // Purple for text
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(element.label, 0, element.height / 2 + 15)
    }

    ctx.restore()
  }

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - position.x) / zoom
    const y = (e.clientY - rect.top - position.y) / zoom

    // Check if clicking on an element
    let foundElement = false

    for (const room of rooms) {
      for (const element of room.elements) {
        // Check if point is within element bounds
        const halfWidth = element.width / 2
        const halfHeight = element.height / 2

        if (
          x >= element.x - halfWidth &&
          x <= element.x + halfWidth &&
          y >= element.y - halfHeight &&
          y <= element.y + halfHeight
        ) {
          setSelectedElement(element.id)
          setSelectedRoom(room.id)
          foundElement = true
          break
        }
      }

      if (foundElement) break
    }

    if (!foundElement) {
      // Check if clicking in a room boundary
      for (const room of rooms) {
        const elements = room.elements
        if (elements.length === 0) continue

        let minX = Number.POSITIVE_INFINITY,
          minY = Number.POSITIVE_INFINITY,
          maxX = Number.NEGATIVE_INFINITY,
          maxY = Number.NEGATIVE_INFINITY

        elements.forEach((element) => {
          minX = Math.min(minX, element.x - element.width / 2)
          minY = Math.min(minY, element.y - element.height / 2)
          maxX = Math.max(maxX, element.x + element.width / 2)
          maxY = Math.max(maxY, element.y + element.height / 2)
        })

        // Add padding
        const padding = 40
        minX -= padding
        minY -= padding
        maxX += padding
        maxY += padding

        if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
          setSelectedRoom(room.id)
          setSelectedElement(null)
          foundElement = true
          break
        }
      }

      if (!foundElement) {
        setSelectedElement(null)
        setSelectedRoom(null)
        setIsDragging(true)
        setDragStart({ x: e.clientX, y: e.clientY })
      }
    }
  }

  // Handle mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y
      setPosition({ x: position.x + dx, y: position.y + dy })
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handle wheel for zooming
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    setZoom((prevZoom) => Math.min(Math.max(prevZoom * delta, 0.1), 5))
  }

  // Add a new element
  const addElement = () => {
    if (!selectedRoom) return

    // Snap to grid if enabled
    const x = showGrid ? Math.round(newElementCoords.x / gridSize) * gridSize : newElementCoords.x
    const y = showGrid ? Math.round(newElementCoords.y / gridSize) * gridSize : newElementCoords.y

    const newElement: Element = {
      id: Date.now().toString(),
      type: currentType,
      x,
      y,
      width: newElementSize.width,
      height: newElementSize.height,
      rotation: 0,
      label:
        newElementLabel ||
        `${currentType.charAt(0).toUpperCase() + currentType.slice(1)} ${Date.now().toString().slice(-4)}`,
      status: "operational",
    }

    const updatedRooms = rooms.map((room) => {
      if (room.id === selectedRoom) {
        return {
          ...room,
          elements: [...room.elements, newElement],
        }
      }
      return room
    })

    setRooms(updatedRooms)
    setNewElementLabel("")
  }

  // Delete selected element
  const deleteSelectedElement = () => {
    if (selectedElement && selectedRoom) {
      const updatedRooms = rooms.map((room) => {
        if (room.id === selectedRoom) {
          return {
            ...room,
            elements: room.elements.filter((element) => element.id !== selectedElement),
          }
        }
        return room
      })

      setRooms(updatedRooms)
      setSelectedElement(null)
    }
  }

  // Reset view
  const resetView = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  // Get icon for element type
  const getElementIcon = (type: ElementType) => {
    switch (type) {
      case "rack":
        return <Server className="h-5 w-5" />
      case "server":
        return <Cpu className="h-5 w-5" />
      case "cooling":
        return <Fan className="h-5 w-5" />
      case "network":
        return <Router className="h-5 w-5" />
    }
  }

  // Get status icon
  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "offline":
        return <XCircle className="h-4 w-4 text-gray-500" />
    }
  }

  // Get selected element details
  const getSelectedElementDetails = () => {
    if (!selectedElement || !selectedRoom) return null

    const room = rooms.find((r) => r.id === selectedRoom)
    if (!room) return null

    return room.elements.find((e) => e.id === selectedElement)
  }

  // Update element status
  const updateElementStatus = (status: StatusType) => {
    if (!selectedElement || !selectedRoom) return

    const updatedRooms = rooms.map((room) => {
      if (room.id === selectedRoom) {
        return {
          ...room,
          elements: room.elements.map((element) => {
            if (element.id === selectedElement) {
              return {
                ...element,
                status,
              }
            }
            return element
          }),
        }
      }
      return room
    })

    setRooms(updatedRooms)
  }

  // Add a new room
  const addRoom = () => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: `New Room ${rooms.length + 1}`,
      elements: [],
    }

    setRooms([...rooms, newRoom])
    setSelectedRoom(newRoom.id)
  }

  // Get room status summary
  const getRoomStatusSummary = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId)
    if (!room) return { operational: 0, warning: 0, critical: 0, offline: 0 }

    return room.elements.reduce(
      (acc, element) => {
        acc[element.status]++
        return acc
      },
      { operational: 0, warning: 0, critical: 0, offline: 0 } as Record<StatusType, number>,
    )
  }

  // Get overall data center status
  const getDataCenterStatus = () => {
    const allElements = rooms.flatMap((room) => room.elements)
    const total = allElements.length

    if (total === 0) return "unknown"

    const criticalCount = allElements.filter((e) => e.status === "critical").length
    const warningCount = allElements.filter((e) => e.status === "warning").length
    const offlineCount = allElements.filter((e) => e.status === "offline").length

    if (criticalCount > 0) return "critical"
    if (warningCount > 0) return "warning"
    if (offlineCount > 0 && offlineCount === total) return "offline"

    return "operational"
  }

  const selectedElementDetails = getSelectedElementDetails()
  const dataCenter = {
    status: getDataCenterStatus(),
    totalElements: rooms.reduce((acc, room) => acc + room.elements.length, 0),
    operationalCount: rooms.flatMap((room) => room.elements).filter((e) => e.status === "operational").length,
    warningCount: rooms.flatMap((room) => room.elements).filter((e) => e.status === "warning").length,
    criticalCount: rooms.flatMap((room) => room.elements).filter((e) => e.status === "critical").length,
    offlineCount: rooms.flatMap((room) => room.elements).filter((e) => e.status === "offline").length,
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card className="border-purple-200">
          <CardHeader className="pb-3 bg-purple-50 rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-purple-900">Data Center Floor Plan</CardTitle>
                <CardDescription className="text-purple-700">
                  Drag to pan, scroll to zoom, click elements to select
                </CardDescription>
              </div>
              <Badge
                variant={
                  dataCenter.status === "operational"
                    ? "default"
                    : dataCenter.status === "warning"
                      ? "outline"
                      : dataCenter.status === "critical"
                        ? "destructive"
                        : "secondary"
                }
                className="ml-2"
              >
                {dataCenter.status === "operational" && <CheckCircle className="h-3 w-3 mr-1" />}
                {dataCenter.status === "warning" && <AlertTriangle className="h-3 w-3 mr-1" />}
                {dataCenter.status === "critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
                {dataCenter.status === "offline" && <XCircle className="h-3 w-3 mr-1" />}
                {dataCenter.status.charAt(0).toUpperCase() + dataCenter.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative border border-purple-200 rounded-md overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-[600px] cursor-move"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
              />
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setZoom((prev) => Math.min(prev * 1.2, 5))}>
                  <Plus className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setZoom((prev) => Math.max(prev * 0.8, 0.1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={resetView}>
                  <Move className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  variant={showLabels ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowLabels(!showLabels)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Labels
                </Button>
                <Button
                  variant={showStatus ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowStatus(!showStatus)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Status
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t border-purple-100 pt-4 bg-purple-50 rounded-b-lg">
            <div className="flex gap-2">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                <span className="text-xs text-purple-900">{dataCenter.operationalCount} Operational</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
                <span className="text-xs text-purple-900">{dataCenter.warningCount} Warning</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                <span className="text-xs text-purple-900">{dataCenter.criticalCount} Critical</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-500 mr-1"></div>
                <span className="text-xs text-purple-900">{dataCenter.offlineCount} Offline</span>
              </div>
            </div>
            <div className="text-xs text-purple-700">Total: {dataCenter.totalElements} elements</div>
          </CardFooter>
        </Card>
      </div>

      <div>
        <Tabs defaultValue="rooms" className="border-purple-200">
          <TabsList className="grid w-full grid-cols-2 bg-purple-100">
            <TabsTrigger value="rooms" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Rooms
            </TabsTrigger>
            <TabsTrigger value="elements" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              Elements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-4 mt-4">
            <Card className="border-purple-200">
              <CardHeader className="pb-2 bg-purple-50 rounded-t-lg">
                <CardTitle className="text-purple-900">Data Center Rooms</CardTitle>
                <CardDescription className="text-purple-700">Manage rooms and their equipment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {rooms.map((room) => {
                  const statusSummary = getRoomStatusSummary(room.id)
                  return (
                    <div
                      key={room.id}
                      className={`p-3 border rounded-md cursor-pointer ${
                        selectedRoom === room.id ? "border-purple-500 bg-purple-50" : "border-purple-200"
                      }`}
                      onClick={() => {
                        setSelectedRoom(room.id)
                        setSelectedElement(null)
                      }}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-purple-900">{room.name}</div>
                        <div className="flex gap-1">
                          {statusSummary.operational > 0 && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                              {statusSummary.operational}
                            </Badge>
                          )}
                          {statusSummary.warning > 0 && (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                              {statusSummary.warning}
                            </Badge>
                          )}
                          {statusSummary.critical > 0 && (
                            <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
                              {statusSummary.critical}
                            </Badge>
                          )}
                          {statusSummary.offline > 0 && (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">
                              {statusSummary.offline}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-purple-700 mt-1">{room.elements.length} elements</div>
                    </div>
                  )
                })}

                <Button
                  variant="outline"
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                  onClick={addRoom}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Room
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="elements" className="space-y-4 mt-4">
            <Card className="border-purple-200">
              <CardHeader className="pb-2 bg-purple-50 rounded-t-lg">
                <CardTitle className="text-purple-900">Equipment Details</CardTitle>
                <CardDescription className="text-purple-700">
                  {selectedRoom
                    ? `Managing equipment in ${rooms.find((r) => r.id === selectedRoom)?.name}`
                    : "Select a room to manage equipment"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedRoom ? (
                  <>
                    {selectedElementDetails ? (
                      <div className="space-y-4">
                        <div className="p-3 border border-purple-200 rounded-md">
                          <div className="flex items-center gap-2">
                            {getElementIcon(selectedElementDetails.type)}
                            <div className="font-medium text-purple-900">{selectedElementDetails.label}</div>
                          </div>
                          <div className="mt-2 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm text-purple-700">Type:</div>
                              <div className="text-sm font-medium capitalize text-purple-900">
                                {selectedElementDetails.type}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm text-purple-700">Status:</div>
                              <div className="text-sm font-medium flex items-center">
                                {getStatusIcon(selectedElementDetails.status)}
                                <span className="ml-1 capitalize">{selectedElementDetails.status}</span>
                              </div>
                            </div>
                            {selectedElementDetails.temperature !== undefined && (
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-sm text-purple-700">Temperature:</div>
                                <div className="text-sm font-medium flex items-center text-purple-900">
                                  <Thermometer className="h-4 w-4 mr-1 text-purple-500" />
                                  {selectedElementDetails.temperature}°C
                                </div>
                              </div>
                            )}
                            {selectedElementDetails.load !== undefined && (
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-sm text-purple-700">Load:</div>
                                <div className="text-sm font-medium text-purple-900">
                                  {selectedElementDetails.load}%
                                </div>
                              </div>
                            )}
                            {selectedElementDetails.networkStatus !== undefined && (
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-sm text-purple-700">Network:</div>
                                <div className="text-sm font-medium flex items-center text-purple-900">
                                  <Wifi className="h-4 w-4 mr-1 text-purple-500" />
                                  {selectedElementDetails.networkStatus}%
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-4">
                            <Label className="text-purple-700">Update Status</Label>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <Button
                                size="sm"
                                variant={selectedElementDetails.status === "operational" ? "default" : "outline"}
                                onClick={() => updateElementStatus("operational")}
                                className={
                                  selectedElementDetails.status === "operational"
                                    ? "bg-purple-600 hover:bg-purple-700"
                                    : "border-purple-300 text-purple-700"
                                }
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Operational
                              </Button>
                              <Button
                                size="sm"
                                variant={selectedElementDetails.status === "warning" ? "default" : "outline"}
                                onClick={() => updateElementStatus("warning")}
                                className={
                                  selectedElementDetails.status === "warning"
                                    ? "bg-purple-600 hover:bg-purple-700"
                                    : "border-purple-300 text-purple-700"
                                }
                              >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Warning
                              </Button>
                              <Button
                                size="sm"
                                variant={selectedElementDetails.status === "critical" ? "default" : "outline"}
                                onClick={() => updateElementStatus("critical")}
                                className={
                                  selectedElementDetails.status === "critical"
                                    ? "bg-purple-600 hover:bg-purple-700"
                                    : "border-purple-300 text-purple-700"
                                }
                              >
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Critical
                              </Button>
                              <Button
                                size="sm"
                                variant={selectedElementDetails.status === "offline" ? "default" : "outline"}
                                onClick={() => updateElementStatus("offline")}
                                className={
                                  selectedElementDetails.status === "offline"
                                    ? "bg-purple-600 hover:bg-purple-700"
                                    : "border-purple-300 text-purple-700"
                                }
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Offline
                              </Button>
                            </div>
                          </div>

                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full mt-4"
                            onClick={deleteSelectedElement}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Element
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="x-coord" className="text-purple-700">
                              X Coordinate
                            </Label>
                            <Input
                              id="x-coord"
                              type="number"
                              value={newElementCoords.x}
                              onChange={(e) =>
                                setNewElementCoords({ ...newElementCoords, x: Number.parseInt(e.target.value) || 0 })
                              }
                              className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="y-coord" className="text-purple-700">
                              Y Coordinate
                            </Label>
                            <Input
                              id="y-coord"
                              type="number"
                              value={newElementCoords.y}
                              onChange={(e) =>
                                setNewElementCoords({ ...newElementCoords, y: Number.parseInt(e.target.value) || 0 })
                              }
                              className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="element-type" className="text-purple-700">
                            Element Type
                          </Label>
                          <Select value={currentType} onValueChange={(value) => setCurrentType(value as ElementType)}>
                            <SelectTrigger id="element-type" className="border-purple-200 focus:ring-purple-400">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="border-purple-200">
                              <SelectItem value="rack">
                                <div className="flex items-center gap-2">
                                  <Server className="h-4 w-4 text-purple-500" />
                                  <span>Rack</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="server">
                                <div className="flex items-center gap-2">
                                  <Cpu className="h-4 w-4 text-purple-500" />
                                  <span>Server</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="cooling">
                                <div className="flex items-center gap-2">
                                  <Fan className="h-4 w-4 text-purple-500" />
                                  <span>Cooling Unit</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="network">
                                <div className="flex items-center gap-2">
                                  <Router className="h-4 w-4 text-purple-500" />
                                  <span>Network Equipment</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="width" className="text-purple-700">
                              Width
                            </Label>
                            <Input
                              id="width"
                              type="number"
                              value={newElementSize.width}
                              onChange={(e) =>
                                setNewElementSize({ ...newElementSize, width: Number.parseInt(e.target.value) || 40 })
                              }
                              className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="height" className="text-purple-700">
                              Height
                            </Label>
                            <Input
                              id="height"
                              type="number"
                              value={newElementSize.height}
                              onChange={(e) =>
                                setNewElementSize({ ...newElementSize, height: Number.parseInt(e.target.value) || 80 })
                              }
                              className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="label" className="text-purple-700">
                            Label
                          </Label>
                          <Input
                            id="label"
                            value={newElementLabel}
                            onChange={(e) => setNewElementLabel(e.target.value)}
                            placeholder={`${currentType.charAt(0).toUpperCase() + currentType.slice(1)} ${Date.now().toString().slice(-4)}`}
                            className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                          />
                        </div>

                        <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={addElement}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Element to Room
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-6">
                    <div className="text-purple-700">Select a room to manage equipment</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader className="pb-2 bg-purple-50 rounded-t-lg">
                <CardTitle className="text-purple-900">Status Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-purple-900">Operational - Equipment functioning normally</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-purple-900">Warning - Requires attention</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-purple-900">Critical - Immediate action needed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-sm text-purple-900">Offline - Equipment not operational</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
