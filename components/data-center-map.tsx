"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Text, Html } from "@react-three/drei"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Fan, Thermometer, AlertTriangle, PenToolIcon as Tool, Info, Eye, EyeOff } from "lucide-react"

// Mock data for server racks and their status
const initialRacks = [
  {
    id: 1,
    position: [-4, 0, 0],
    name: "Rack A1",
    temperature: 24.5,
    fanStatus: "normal", // normal, warning, critical
    lastMaintenance: "2023-12-15",
    needsMaintenance: false,
  },
  {
    id: 2,
    position: [-2, 0, 0],
    name: "Rack A2",
    temperature: 26.8,
    fanStatus: "warning", // Fan is running at high speed
    lastMaintenance: "2023-11-10",
    needsMaintenance: true,
  },
  {
    id: 3,
    position: [0, 0, 0],
    name: "Rack A3",
    temperature: 22.3,
    fanStatus: "normal",
    lastMaintenance: "2024-01-05",
    needsMaintenance: false,
  },
  {
    id: 4,
    position: [2, 0, 0],
    name: "Rack A4",
    temperature: 31.2,
    fanStatus: "critical", // Fan failure
    lastMaintenance: "2023-10-20",
    needsMaintenance: true,
  },
  {
    id: 5,
    position: [4, 0, 0],
    name: "Rack A5",
    temperature: 25.1,
    fanStatus: "normal",
    lastMaintenance: "2023-12-28",
    needsMaintenance: false,
  },
  {
    id: 6,
    position: [-4, 0, 3],
    name: "Rack B1",
    temperature: 23.7,
    fanStatus: "normal",
    lastMaintenance: "2024-01-10",
    needsMaintenance: false,
  },
  {
    id: 7,
    position: [-2, 0, 3],
    name: "Rack B2",
    temperature: 28.9,
    fanStatus: "warning",
    lastMaintenance: "2023-11-25",
    needsMaintenance: true,
  },
  {
    id: 8,
    position: [0, 0, 3],
    name: "Rack B3",
    temperature: 24.2,
    fanStatus: "normal",
    lastMaintenance: "2023-12-05",
    needsMaintenance: false,
  },
  {
    id: 9,
    position: [2, 0, 3],
    name: "Rack B4",
    temperature: 25.6,
    fanStatus: "normal",
    lastMaintenance: "2024-01-15",
    needsMaintenance: false,
  },
  {
    id: 10,
    position: [4, 0, 3],
    name: "Rack B5",
    temperature: 29.8,
    fanStatus: "warning",
    lastMaintenance: "2023-10-30",
    needsMaintenance: true,
  },
]

// Server rack component
function ServerRack({ position, name, temperature, fanStatus, needsMaintenance, onClick }) {
  // Determine color based on status
  let color = "#4ade80" // Green for normal

  if (fanStatus === "warning" || temperature > 28) {
    color = "#f59e0b" // Amber for warning
  }

  if (fanStatus === "critical" || temperature > 30) {
    color = "#ef4444" // Red for critical
  }

  return (
    <group position={position} onClick={onClick}>
      {/* Server rack body */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 2, 0.8]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Status indicator on top */}
      <mesh position={[0, 2.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>

      {/* Rack name */}
      <Text position={[0, 0.1, 0]} fontSize={0.15} color="white" anchorX="center" anchorY="middle">
        {name}
      </Text>

      {/* Maintenance indicator */}
      {needsMaintenance && (
        <mesh position={[0.4, 1.8, 0.4]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={0.5} />
        </mesh>
      )}
    </group>
  )
}

// Floor component
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#94a3b8" />
    </mesh>
  )
}

// Info panel component
function InfoPanel({ rack, onClose }) {
  if (!rack) return null

  const getStatusColor = (status) => {
    switch (status) {
      case "normal":
        return "text-green-500"
      case "warning":
        return "text-amber-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-blue-500"
    }
  }

  const getTemperatureColor = (temp) => {
    if (temp > 30) return "text-red-500"
    if (temp > 28) return "text-amber-500"
    return "text-green-500"
  }

  return (
    <Html position={[0, 4, 0]} center>
      <Card className="w-64 shadow-lg border border-gray-200 dark:border-gray-800">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold">{rack.name}</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
              ×
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Thermometer className="h-4 w-4 mr-2" />
                <span>Temperature</span>
              </div>
              <span className={getTemperatureColor(rack.temperature)}>{rack.temperature}°C</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Fan className="h-4 w-4 mr-2" />
                <span>Fan Status</span>
              </div>
              <Badge
                variant={rack.fanStatus === "normal" ? "outline" : "destructive"}
                className={getStatusColor(rack.fanStatus)}
              >
                {rack.fanStatus.toUpperCase()}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Tool className="h-4 w-4 mr-2" />
                <span>Last Maintenance</span>
              </div>
              <span>{rack.lastMaintenance}</span>
            </div>

            {(rack.fanStatus !== "normal" || rack.temperature > 28 || rack.needsMaintenance) && (
              <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md dark:bg-amber-950/30 dark:border-amber-900">
                <div className="flex items-start">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 mr-2" />
                  <div className="text-sm text-amber-800 dark:text-amber-300">
                    {rack.fanStatus === "critical" ? (
                      <span>Critical: Fan failure detected. Immediate maintenance required.</span>
                    ) : rack.temperature > 30 ? (
                      <span>Critical: Overheating detected. Check cooling system.</span>
                    ) : rack.needsMaintenance ? (
                      <span>Warning: Scheduled maintenance overdue.</span>
                    ) : (
                      <span>Warning: Performance degradation detected.</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <Button className="w-full mt-2" size="sm">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </Html>
  )
}

// Legend component
function MapLegend() {
  return (
    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 p-3 rounded-md shadow-md border border-gray-200 dark:border-gray-800">
      <h3 className="font-medium mb-2 flex items-center text-gray-900 dark:text-gray-100">
        <Info className="h-4 w-4 mr-2" />
        Map Legend
      </h3>
      <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span>Normal Operation</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
          <span>Warning (High Temperature/Fan Issue)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <span>Critical (Overheating/Fan Failure)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
          <span>Maintenance Required</span>
        </div>
      </div>
    </div>
  )
}

// Stats component
function DataCenterStats({ racks }) {
  const criticalCount = racks.filter((r) => r.fanStatus === "critical" || r.temperature > 30).length
  const warningCount = racks.filter(
    (r) => (r.fanStatus === "warning" || (r.temperature > 28 && r.temperature <= 30)) && r.fanStatus !== "critical",
  ).length
  const maintenanceCount = racks.filter((r) => r.needsMaintenance).length
  const normalCount = racks.filter((r) => r.fanStatus === "normal" && r.temperature <= 28 && !r.needsMaintenance).length

  const avgTemperature = racks.reduce((sum, rack) => sum + rack.temperature, 0) / racks.length

  return (
    <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-gray-900/90 p-3 rounded-md shadow-md border border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Racks</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{racks.length}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Critical</div>
          <div className="text-2xl font-bold text-red-500">{criticalCount}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Warning</div>
          <div className="text-2xl font-bold text-amber-500">{warningCount}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Maintenance</div>
          <div className="text-2xl font-bold text-orange-500">{maintenanceCount}</div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Avg. Temp</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{avgTemperature.toFixed(1)}°C</div>
        </div>
      </div>
    </div>
  )
}

export function DataCenterMap() {
  const [racks, setRacks] = useState(initialRacks)
  const [selectedRack, setSelectedRack] = useState(null)
  const [showStatus, setShowStatus] = useState(true)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRacks((prevRacks) =>
        prevRacks.map((rack) => ({
          ...rack,
          temperature: Math.max(20, Math.min(33, rack.temperature + (Math.random() - 0.5) * 0.5)),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRackClick = (rack) => {
    setSelectedRack(rack)
  }

  const closeInfoPanel = () => {
    setSelectedRack(null)
  }

  const toggleStatus = () => {
    setShowStatus(!showStatus)
  }

  return (
    <div className="relative w-full h-full">
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }} shadows>
        <color attach="background" args={["#f8fafc"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
        <pointLight position={[-10, 10, -10]} intensity={0.5} />

        <Floor />

        {/* Server racks */}
        {racks.map((rack) => (
          <ServerRack
            key={rack.id}
            position={rack.position}
            name={rack.name}
            temperature={rack.temperature}
            fanStatus={showStatus ? rack.fanStatus : "normal"}
            needsMaintenance={showStatus ? rack.needsMaintenance : false}
            onClick={() => handleRackClick(rack)}
          />
        ))}

        {/* Info panel for selected rack */}
        {selectedRack && <InfoPanel rack={selectedRack} onClose={closeInfoPanel} />}

        {/* Environment and controls */}
        <Environment preset="warehouse" />
        <OrbitControls minDistance={3} maxDistance={20} maxPolarAngle={Math.PI / 2 - 0.1} minPolarAngle={0.2} />
      </Canvas>

      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleStatus}
          className="bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 shadow-md flex items-center gap-2"
        >
          {showStatus ? (
            <>
              <EyeOff size={16} />
              Hide Status
            </>
          ) : (
            <>
              <Eye size={16} />
              Show Status
            </>
          )}
        </Button>
      </div>

      <MapLegend />
      <DataCenterStats racks={racks} />
    </div>
  )
}
