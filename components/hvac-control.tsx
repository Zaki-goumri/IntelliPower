// HVACControl.tsx
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
import { Power } from "lucide-react";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { toast } from "@/components/ui/use-toast";

interface FanState {
  isOn: boolean;
  speed: number; // 1: Low, 2: Medium, 3: High
  targetTemp?: number; // Not supported by API, managed client-side
}

export default function HVACControl() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [targetTemp, setTargetTemp] = useState(23);
  const [fanSpeed, setFanSpeed] = useState(2);
  const [isOn, setIsOn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = "http://10.42.0.1:3000";
  const WS_URL = "ws://10.42.0.1:3000";
  const DEVICE_ID = "fan-1";

  function parseToken() {
    const accessToken = document.cookie
      .split(";")
      .find((cookie: string) => cookie.includes("accessToken"))
    return accessToken;
  }

  const fetchFanStatus = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/fan-control/get-status`,
        {
          deviceId: DEVICE_ID,
        },
      );
      const fanState: FanState = response.data;
      console.log("Fetched initial fan status:", fanState);
      setIsOn(fanState.isOn);
      setFanSpeed(fanState.speed);
    } catch (error) {
      console.error("Error fetching fan status:", error);
      toast({
        title: "Error",
        description: "Failed to fetch fan status. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFanStatus();

    const newSocket = io(WS_URL, { auth: { token: parseToken() } });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server");
      newSocket.emit("get_status", { deviceId: DEVICE_ID });
    });

    newSocket.on("fan_turned_on", () => {
      setIsOn(true);
      toast({
        title: "Success",
        description: "Fan turned on",
      });
    });

    newSocket.on("fan_turned_off", () => {
      setIsOn(false);
      toast({
        title: "Success",
        description: "Fan turned off",
      });
    });

    newSocket.on("fan_speed_changed", (data: { speed: number }) => {
      setFanSpeed(data.speed);
      toast({
        title: "Success",
        description: `Fan speed set to ${data.speed === 1 ? "Low" : data.speed === 2 ? "Medium" : "High"}`,
      });
    });

    // Assume the server emits a "status" event after "get_status"
    newSocket.on("status", (fanState: FanState) => {
      console.log("Received fan status via WebSocket:", fanState);
      setIsOn(fanState.isOn);
      setFanSpeed(fanState.speed);
    });

    // Handle WebSocket errors
    newSocket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      toast({
        title: "Error",
        description: "Failed to connect to the server. Please try again.",
        variant: "destructive",
      });
    });

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const emitFanCommand = (event: string, data: any) => {
    if (socket) {
      setIsLoading(true);
      socket.emit(event, { deviceId: DEVICE_ID, ...data }, () => {
        setIsLoading(false); 
      });
    }
  };

  const handlePowerChange = (checked: boolean) => {
    setIsOn(checked);
    emitFanCommand(checked ? "turn_on" : "turn_off", {});
  };

  const handleFanSpeedChange = (value: number[]) => {
    const newFanSpeed = value[0];
    setFanSpeed(newFanSpeed);
    emitFanCommand("set_speed", { speed: newFanSpeed });
  };

  const handleTargetTempChange = (value: number[]) => {
    const newTargetTemp = value[0];
    setTargetTemp(newTargetTemp);
  };

  return (
    <Card className="flex flex-col justify-between w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Fan Control</CardTitle>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-muted-foreground">Power</span>
            <Switch
              checked={isOn}
              onCheckedChange={handlePowerChange}
              disabled={isLoading}
            />
          </div>
        </div>
        <CardDescription>Smart fan control system</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`transition-opacity ${isOn ? "opacity-100" : "opacity-50 pointer-events-none"}`}
        >
          <div className="flex justify-center mb-6">
            <div className="text-5xl font-bold">{targetTemp}°C</div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Target Temperature</span>
              <span className="text-sm font-medium">{targetTemp}°C</span>
            </div>
            <Slider
              value={[targetTemp]}
              min={16}
              max={30}
              step={1}
              onValueChange={handleTargetTempChange}
              disabled={!isOn || isLoading}
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Fan Speed</span>
              <span className="text-sm font-medium">
                {fanSpeed === 1 ? "Low" : fanSpeed === 2 ? "Medium" : "High"}
              </span>
            </div>
            <Slider
              value={[fanSpeed]}
              min={1}
              max={3}
              step={1}
              onValueChange={handleFanSpeedChange}
              disabled={!isOn || isLoading}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full text-sm text-center text-muted-foreground place-self-center">
          {isOn ? "Fan is running" : "Fan is powered off"}
        </div>
      </CardFooter>
    </Card>
  );
}
