"use client";
import { useEffect, useState } from "react";
import SecurityDashboard from "@/components/security-dashboard";
import AccessControl from "@/components/access-control";
import AlertsLog from "@/components/alerts-log";

export default function SecurityPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [camerasConnected, setCamerasConnected] = useState(false);

  useEffect(() => {
    // Set online status initially
    setIsOnline(navigator.onLine);

    // Add event listeners for online status changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check for connected cameras
    const checkCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCamerasConnected(videoDevices.length > 0);
      } catch (error) {
        console.error("Error checking cameras:", error);
        setCamerasConnected(false);
      }
    };

    checkCameras();

    // Set up interval to periodically check camera connection
    const cameraCheckInterval = setInterval(checkCameras, 10000); // Check every 10 seconds

    // Clean up event listeners and interval
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(cameraCheckInterval);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">Security Management</h1>

      {isOnline && camerasConnected ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SecurityDashboard />
          </div>
          <div className="space-y-6">
            <AccessControl />
            <AlertsLog />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-muted-foreground">
            Internet connection lost. Please check your connection and try
            again.
          </p>
        </div>
      )}
    </main>
  );
}
