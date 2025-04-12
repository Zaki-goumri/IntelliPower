"use client";
import { useEffect, useState, useRef } from "react";
import SecurityDashboard from "@/components/security-dashboard";
import AccessControl from "@/components/access-control";
import AlertsLog from "@/components/alerts-log";

export default function SecurityPage() {
  const [isOnline, setIsOnline] = useState(true);
  const [camerasConnected, setCamerasConnected] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Set online status initially
    setIsOnline(navigator.onLine);

    // Add event listeners for online status changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initialize camera
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setCamerasConnected(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
        setCamerasConnected(false);
      }
    };

    initCamera();

    // Clean up
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      // Stop all tracks when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">Security Management</h1>

      {isOnline && camerasConnected ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SecurityDashboard />
            <div className="mt-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-6">
            <AccessControl />
            <AlertsLog />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-muted-foreground">
            {!isOnline 
              ? "Internet connection lost. Please check your connection and try again."
              : "Camera access denied. Please enable camera access and refresh the page."}
          </p>
        </div>
      )}
    </main>
  );
}
