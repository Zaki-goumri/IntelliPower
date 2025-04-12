"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Fan, Plus, RefreshCw, WifiOff, Wifi } from "lucide-react";
import { io, type Socket } from "socket.io-client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FloorSelector from "@/components/floor-selector";
import axios from "@/api/axios.config";
import useGetData from "../dashboard/useGetData";

interface Temperature {
  id: string;
  sensorId: string;
  temp: number;
  humidity: number;
  createdAt: string;
}

interface Sensor {
  id: string;
  name: string;
  areaId: string;
  locationX: number;
  locationY: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  Temperature: Temperature[];
}


interface FanState {
  fan: {
    id: string;
    name: string;
    areaId: string;
    locationX: number;
    locationY: number;
    locationZ: number;
    speed: "low" | "medium" | "high";
    lastMaintenance: string | null;
    status: "on" | "off";
    createdAt: string;
    updatedAt: string;
  };
  temperature: number;
}



//     isOn: true,
//     speed: 2,
//     targetTemp: 23,
//     location: "Living Room",
//   },
//   {
//     id: "fan-2",
//     name: "Bedroom Fan",
//     isOn: false,
//     speed: 1,
//     targetTemp: 22,
//     location: "Bedroom",
//   },
//   {
//     id: "fan-3",
//     name: "Kitchen Fan",
//     isOn: true,
//     speed: 3,
//     targetTemp: 24,
//     location: "Kitchen",
//   },
//   {
//     id: "fan-4",
//     name: "Office Fan",
//     isOn: false,
//     speed: 2,
//     targetTemp: 21,
//     location: "Office",
//   },
// ];




export default function FanControlPage() {
  const { data } = useGetData();


  const [areas, setAreas] = useState<
    { value: string; label: string; type: string; id: string }[] | undefined
  >(); const [selectedFloorId, setSelectedFloorId] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [fans, setFans] = useState<FanState[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "error">("connected");
  const [isMounted, setIsMounted] = useState(false);

  const accessToken = document.cookie
    .split(";")
    .find((cookie: string) => cookie.includes("accessToken"))
    ?.split("=")[1];
  const wsAuth = `Bearer ${accessToken}`;

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);


  useEffect(() => {
    if (data && data.length > 0) {
      const floorData = data.map((item: any) => ({
        value: item.id,
        label: item.name,
        type: "floor",
        id: item.id,
      }));
      setAreas(floorData);

      if (!selectedFloorId && floorData[0]) {
        setSelectedFloorId(floorData[0].id);
      }
    }
  }, [data, selectedFloorId]);

  useEffect(() => {
    if (selectedFloorId) {
      fetchAllFans(selectedFloorId);
    }
  }, [selectedFloorId]);



  const fetchAllFans = async (floorId: string) => {
    try {
      const response = await axios.get(`fan-control/get-floor-fans/${floorId}`);
      setFans(response.data);
      console.log("Fetched fans:", fans);
      return response.data;
    } catch (error) {
      console.error("Error fetching fans:", error);
      throw error;
    }
  }


  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("ws://10.42.0.1:3000", {
      auth: {
        token: wsAuth,
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
      setConnectionStatus("connected");
      toast({
        title: "Connected",
        description: "Connected to fan control server",
      });
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
      setConnectionStatus("error");
      toast({
        title: "Disconnected",
        description: "Lost connection to fan control server",
      });
    });

    newSocket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      setConnectionStatus("error");
      toast({
        title: "Connection Error",
        description: "Failed to connect to fan control server",
      });
    });

    newSocket.on("fan_turned_on", (data: { fanId: string; status: string }) => {
      setFans((prev) =>
        prev?.map((fan) =>
          fan.fan.id === data.fanId ? { ...fan, fan: { ...fan.fan, status: "on" } } : fan
        )
      );
      toast({
        title: "Fan Turned On",
        description: `Fan ${data.fanId} is now on`,
      });
    });

    newSocket.on("fan_turned_off", (data: { fanId: string; status: string }) => {
      setFans((prev) =>
        prev?.map((fan) =>
          fan.fan.id === data.fanId ? { ...fan, fan: { ...fan.fan, status: "off" } } : fan
        )
      );
      toast({
        title: "Fan Turned Off",
        description: `Fan ${data.fanId} is now off`,
      });
    });

    newSocket.on(
      "fan_speed_changed",
      (data: { fanId: string; speed: "low" | "medium" | "high" }) => {
        setFans((prev) =>
          prev?.map((fan) =>
            fan.fan.id === data.fanId ? { ...fan, fan: { ...fan.fan, speed: data.speed } } : fan
          )
        );
        toast({
          title: "Fan Speed Changed",
          description: `Fan ${data.fanId} speed set to ${data.speed}`,
        });
      }
    );

    return () => {
      newSocket.disconnect();
    };
  }, []);


  const handlePowerChange = async (fanId: string, checked: boolean) => {
    setIsLoading(true);
    const event = checked ? "turn_on" : "turn_off";
    const url = checked ? "/fan-control/turn-on" : "/fan-control/turn-off";

    // Send WebSocket message
    if (socket && connectionStatus === "connected") {
      socket.emit(event, { fanId }, () => {
        setIsLoading(false);
      });
    }

    // Send HTTP POST request
    axios
      .post(
        url,
        { deviceId: fanId },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(() => {
        setFans((prev) =>
          prev?.map((fan) =>
            fan.fan.id === fanId
              ? { ...fan, fan: { ...fan.fan, status: checked ? "on" : "off" } }
              : fan
          )
        );
      })
      .catch((error) => {
        console.error(`Error turning ${event} fan:`, error);
        toast({
          title: "Error",
          description: `Failed to turn ${event} fan`,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleFanSpeedChange = (fanId: string, value: number[]) => {
    setIsLoading(true);
    const speedValue = value[0];
    const speed = speedValue === 1 ? "low" : speedValue === 2 ? "medium" : "high";

    // Send WebSocket message
    if (socket && connectionStatus === "connected") {
      socket.emit("set_speed", { fanId, speed }, () => {
        setIsLoading(false);
      });
    }

    // Send HTTP POST request
    axios
      .post(
        "/fan-control/set-speed",
        { deviceId: fanId, speed },
        { headers: { "Content-Type": "application/json" } }
      )
      .then(() => {
        setFans((prev) =>
          prev?.map((fan) =>
            fan.fan.id === fanId ? { ...fan, fan: { ...fan.fan, speed } } : fan
          )
        );
      })
      .catch((error) => {
        console.error("Error setting fan speed:", error);
        toast({
          title: "Error",
          description: "Failed to set fan speed",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTargetTempChange = (fanId: string, value: number[]) => {

  };

  return (
    <div className="mx-auto p-4 min-h-screen">
      <div className="mb-4">
        <FloorSelector
          value={selectedFloorId}
          onFloorChange={setSelectedFloorId}
          className="w-full md:w-64  "
          data={areas}
        />
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
          Smart Fan Control
        </h1>
        <p className="text-black dark:text-white">
          Manage all your connected fans
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="text-black dark:text-white">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-black dark:data-[state=active]:text-white"
              >
                All Fans
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-black dark:data-[state=active]:text-white"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="inactive"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-black dark:data-[state=active]:text-white"
              >
                Inactive
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2 items-center">
              {connectionStatus === "connected" ? (
                <Badge
                  variant="outline"
                  className="bg-green-50 border-green-200 mr-2 text-black"
                >
                  <Wifi className="h-3 w-3 mr-1 text-black" />{" "}
                  Connected
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-black dark:text-white border-purple-200 mr-2"
                >
                  <WifiOff className="h-3 w-3 mr-1 text-black dark:text-white" />{" "}
                  not connected
                </Badge>
              )}

              <Button
                variant="outline"
                size="sm"
                className="border-purple-300 text-black dark:text-white hover:bg-purple-100"
                onClick={() => {fetchAllFans(selectedFloorId??"");;}}
                disabled={isRefreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-1 text-black dark:text-white ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                variant="default"
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-black dark:text-white"
              >
                <Plus className="h-4 w-4 mr-1 text-black dark:text-white" />
                Add Fan
              </Button>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(fans) && fans.map((fan) => (
                <FanCard
                  key={fan.fan.id}
                  data={fan}
                  onPowerChange={handlePowerChange}
                  onSpeedChange={handleFanSpeedChange}
                  onTempChange={handleTargetTempChange}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(fans) && fans
                .filter((fan) => fan.fan.status === "on")
                .map((fan) => (
                  <FanCard
                    key={fan.fan.id}
                    data={fan}
                    onPowerChange={handlePowerChange}
                    onSpeedChange={handleFanSpeedChange}
                    onTempChange={handleTargetTempChange}
                    isLoading={isLoading}
                  />
                ))}
              {Array.isArray(fans) && fans.filter((fan) => fan.fan.status === 'on').length === 0 && (
                <div className="col-span-full text-center py-10 text-black dark:text-white">
                  No active fans found
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inactive" className="m-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(fans) && fans
                .filter((fan) => fan.fan.status !== "on")
                .map((fan) => (
                  <FanCard
                    key={fan.fan.id}
                    data={fan}
                    onPowerChange={handlePowerChange}
                    onSpeedChange={handleFanSpeedChange}
                    onTempChange={handleTargetTempChange}
                    isLoading={isLoading}
                  />
                ))}
              {Array.isArray(fans) && fans.filter((fan) => fan.fan.status === 'off').length === 0 && (
                <div className="col-span-full text-center py-10 text-black dark:text-white">
                  No inactive fans found
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface FanCardProps {
  data: FanState;
  onPowerChange: (fanId: string, checked: boolean) => void;
  onSpeedChange: (fanId: string, value: number[]) => void;
  onTempChange: (fanId: string, value: number[]) => void;
  isLoading: boolean;
}

function FanCard({
  data,
  onPowerChange,
  onSpeedChange,
  onTempChange,
  isLoading,
}: FanCardProps) {



  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl text-black dark:text-white">
              {data.fan.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 text-black dark:text-white">
              <Fan className="h-3.5 w-3.5 text-black dark:text-white" />
              {data.fan.name} - {data.fan.locationX}°C
            </CardDescription>
          </div>
          <div className="flex items-center">
            <Badge
              variant="outline"
              className={`mr-2 
                "bg-green-50 text-black dark:text-white border-green-200"`}
            >
              {data.fan.status}
            </Badge>
            <Switch
              onCheckedChange={(checked) => onPowerChange(data.fan.id, checked)}
              disabled={isLoading}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div
          className={`transition-opacity `}
        >
          <div className="flex justify-center mb-6">
            <div className="text-4xl font-bold text-black dark:text-white">
              {data.temperature}°C
            </div>
          </div>
          <div className="mb-2">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-black dark:text-white">
                Fan Speed
              </span>
              <span className="text-sm font-medium text-black dark:text-white">
                {data.fan.speed}
              </span>
            </div>
            <Slider
              value={[data.fan.speed === "low" ? 1 : data.fan.speed === "medium" ? 2 : 3]}
              min={1}
              max={3}
              step={1}
              onValueChange={(value) => onSpeedChange(data.fan.id, value)}
              className="[&>span]:bg-purple-600"
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full text-sm text-center text-black dark:text-white">
          {/* {data.isOn
            ? `Running at ${data.fan.speed === 1 ? "low" : data.fan.speed === 2 ? "medium" : "high"
            } speed`
            : "Fan is powered off"} */}
        </div>
      </CardFooter>
    </Card >
  );
}