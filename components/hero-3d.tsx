"use client";
import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const World = dynamic(
  () => import("../components/ui/globe").then((m) => m.World),
  {
    ssr: false,
  },
);

export default function GlobeDemo() {
  const globeConfig = {
    pointSize: 4,
    globeColor: "#6D28D9", // Purple color
    showAtmosphere: true,
    atmosphereColor: "rgba(216, 180, 254, 0.5)", // Light purple atmosphere
    atmosphereAltitude: 0.25,
    emissive: "#7C3AED", // Purple emissive color
    emissiveIntensity: 0.2,
    shininess: 0.9,
    polygonColor: "rgba(255,255,255,0.7)",
    ambientLight: "#8B5CF6", // Purple ambient light
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 0, // Remove rings
    maxRings: 0,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.8,
  };
  const purpleColors = ["#8B5CF6", "#7C3AED", "#6D28D9", "#5B21B6", "#4C1D95"];
  const sampleArcs = [
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.1,
      color: purpleColors[0],
    },
    {
      order: 1,
      startLat: 28.6139,
      startLng: 77.209,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.2,
      color: purpleColors[1],
    },
    {
      order: 1,
      startLat: -19.885592,
      startLng: -43.951191,
      endLat: -1.303396,
      endLng: 36.852443,
      arcAlt: 0.5,
      color: purpleColors[2],
    },
    {
      order: 2,
      startLat: 1.3521,
      startLng: 103.8198,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.2,
      color: purpleColors[3],
    },
    {
      order: 2,
      startLat: 51.5072,
      startLng: -0.1276,
      endLat: 3.139,
      endLng: 101.6869,
      arcAlt: 0.3,
      color: purpleColors[4],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full overflow-hidden h-full md:h-[40rem] relative place-items-center">
      <div className="absolute w-full  h-72 md:h-full z-10 ">
        <World data={sampleArcs} globeConfig={globeConfig} />
      </div>
    </div>
  );
}
