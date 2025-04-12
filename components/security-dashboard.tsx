"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, ShieldAlert, Camera, Lock, Unlock, Users, BrainCircuit } from "lucide-react"
import AITrainingModule from "./ai-training-module"

export default function SecurityDashboard() {
  const [securityStatus, setSecurityStatus] = useState<"armed" | "disarmed" | "breach">("armed")
  const [selectedCamera, setSelectedCamera] = useState(1)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Handle webcam access
  useEffect(() => {
    async function startCamera() {
      try {
        setCameraError(null)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
        }
      } catch (err) {
        console.error("Camera access error:", err)
        setCameraError("Failed to access camera. Please ensure camera permissions are granted.")
      }
    }

    startCamera()

    // Cleanup: Stop camera stream when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleSecurityToggle = () => {
    setSecurityStatus(securityStatus === "armed" ? "disarmed" : "armed")
  }

  const simulateBreachAlert = () => {
    setSecurityStatus("breach")
  }

  const acknowledgeAlert = () => {
    setSecurityStatus("armed")
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Security Dashboard</CardTitle>
          <Badge
            variant={securityStatus === "armed" ? "default" : securityStatus === "disarmed" ? "outline" : "destructive"}
            className="text-xs py-1"
          >
            {securityStatus === "armed" ? "ARMED" : securityStatus === "disarmed" ? "DISARMED" : "SECURITY BREACH"}
          </Badge>
        </div>
        <CardDescription>Surveillance and security monitoring</CardDescription>
      </CardHeader>
      <CardContent>
        {securityStatus === "breach" ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
            <div className="flex items-center mb-2">
              <ShieldAlert className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold text-red-700">Security Alert</h3>
            </div>
            <p className="text-red-600 mb-4">Motion detected in Server Room 2 at 15:42:18</p>
            <div className="flex justify-end">
              <Button variant="destructive" onClick={acknowledgeAlert}>
                Acknowledge Alert
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between mb-4">
            <Button
              variant={securityStatus === "armed" ? "default" : "outline"}
              className="flex items-center"
              onClick={handleSecurityToggle}
            >
              {securityStatus === "armed" ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  System Armed
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  System Disarmed
                </>
              )}
            </Button>
            <Button variant="outline" onClick={simulateBreachAlert}>
              Simulate Breach
            </Button>
          </div>
        )}

        <Tabs defaultValue="cameras">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cameras">Cameras</TabsTrigger>
            <TabsTrigger value="access">Access Points</TabsTrigger>
            <TabsTrigger value="motion">Motion Sensors</TabsTrigger>
            <TabsTrigger value="training" className="relative">
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4" />
                <span>AI Challenge</span>
                <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  NEW
                </Badge>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cameras">
            <div className="grid grid-cols-4 gap-2 mb-4 mt-2">
              {[1, 2, 3, 4].map((camera) => (
                <Button
                  key={camera}
                  variant={selectedCamera === camera ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCamera(camera)}
                >
                  <Camera className="h-4 w-4 mr-1" />
                  Cam {camera}
                </Button>
              ))}
            </div>

            <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
              <div className="absolute top-0 left-0 p-2 bg-black/50 text-white text-xs rounded-br-md">
                Camera {selectedCamera} • Server Room {selectedCamera}
              </div>
              <div className="absolute bottom-0 right-0 p-2 bg-black/50 text-white text-xs rounded-tl-md">LIVE</div>
              {cameraError ? (
                <div className="h-full flex items-center justify-center text-red-500">
                  {cameraError}
                </div>
              ) : (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              )}
            </div>
          </TabsContent>

          {/* Access and Motion Tabs remain unchanged */}
          <TabsContent value="access">
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-green-500" />
                  <div>
                    <div className="font-medium">Main Entrance</div>
                    <div className="text-sm text-muted-foreground">Last accessed: 15:30:22</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-500">
                  Secured
                </Badge>
              </div>
              {/* Other access points unchanged */}
            </div>
          </TabsContent>

          <TabsContent value="motion">
            <div className="space-y-4 mt-2">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                  <div>
                    <div className="font-medium">Corridor Sensor</div>
                    <div className="text-sm text-muted-foreground">No motion detected</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-500">
                  Clear
                </Badge>
              </div>
              {/* Other motion sensors unchanged */}
            </div>
          </TabsContent>

          <TabsContent value="training">
            <AITrainingModule />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}