"use client";

import type React from "react";

import { useState } from "react";
import type { FloorPlanData } from "@/types/floor-plan.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Save, X } from "lucide-react";

interface FloorPlanFormProps {
  floorPlan?: FloorPlanData;
  onSubmit: (floorPlan: FloorPlanData) => void;
  onCancel: () => void;
}

export function FloorPlanForm({
  floorPlan,
  onSubmit,
  onCancel,
}: FloorPlanFormProps) {
  const isEditing = !!floorPlan;

  // Add imageData to the formData state
  const [formData, setFormData] = useState<FloorPlanData>(
    floorPlan || {
      id: `floor-${Date.now()}`,
      name: "",
      description: "",
      imageData: "",
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
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "width" || name === "height") {
      setFormData({
        ...formData,
        dimensions: {
          ...formData.dimensions,
          [name]: Number.parseInt(value) || 0,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData({
          ...formData,
          imageData: event.target.result as string,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Update the lastUpdated field
    const updatedFloorPlan = {
      ...formData,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    onSubmit(updatedFloorPlan);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Floor Plan Name
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Main Office - First Floor"
              required
              className="border-[#6d28d9] focus:border-[#8b5cf6] focus:ring-[#8b5cf6] bg-[#3b0764] text-white placeholder:text-purple-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of this floor plan"
              rows={3}
              className="border-[#6d28d9] focus:border-[#8b5cf6] focus:ring-[#8b5cf6] bg-[#3b0764] text-white placeholder:text-purple-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="floorPlanImage" className="text-white">
              Floor Plan Image
            </Label>
            <div className="flex flex-col gap-4">
              <Input
                id="floorPlanImage"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="border-[#6d28d9] focus:border-[#8b5cf6] focus:ring-[#8b5cf6] bg-[#3b0764] text-white file:bg-[#6d28d9] file:text-white file:border-0"
              />

              {formData.imageData && (
                <div className="relative w-full h-48 overflow-hidden rounded-md border border-[#6d28d9]">
                  <img
                    src={formData.imageData || "/placeholder.svg"}
                    alt="Floor plan preview"
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="gap-2 border-[#6d28d9] text-purple-200 hover:bg-[#4c1d95] hover:text-white"
        >
          <X size={16} />
          Cancel
        </Button>
        <Button
          type="submit"
          className="gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] text-white"
        >
          <Save size={16} />
          {isEditing ? "Update Floor Plan" : "Create Floor Plan"}
        </Button>
      </div>
    </form>
  );
}
