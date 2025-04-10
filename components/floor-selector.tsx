"use client";

import { Ref, useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import useGetData from "@/app/[id]/dashboard/useGetData";
import { IFloor } from "@/app/[id]/dashboard/dashboard.types";
import { useAreaFloorStore } from "@/store/useAreaSelector";

const FLOOR_ENUM = {
  FLOOR: "FLOOR",
  AREA: "AREA",
};

export type FloorSelectorProps = {
  onFloorChange: (value: string) => void;
  className?: string;
  data?: { value: string; label: string; type: string }[];
};

function addFloors(floors: IFloor[]) {
  const flatList = floors
    .flatMap((floor) => [
      { name: floor.name, id: floor.id, type: FLOOR_ENUM.FLOOR },
      ...floor.areas.map((area) => ({
        name: area.name,
        id: area.id,
        type: FLOOR_ENUM.AREA,
      })),
    ])
    .map((floor) => {
      return {
        label: floor.name,
        value: floor.id,
        type: floor.type,
      };
    });
  return flatList;
}

export default function FloorSelector({
  onFloorChange,
  className,
  data,
}: FloorSelectorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [areas, setAreas] =
    useState<{ label: string; value: string; type?: string }[]>();
  const areaFloor = useAreaFloorStore((state) => state.areaFloor);
  const setAreaFloor = useAreaFloorStore((state) => state.setAreaFloor);

  useEffect(() => {
    if (data) {
      const newFloors = addFloors(data);
      if (newFloors && newFloors.length > 0) {
        setAreas(newFloors);
        setValue(newFloors[0].value);
        onFloorChange(newFloors[0].label);
        setAreaFloor(newFloors[0]);
      }
    }
  }, [data, onFloorChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {value
            ? Array.isArray(areas) &&
              areas.find((area) => area.value === value)?.label
            : "Select floor..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search floor or area..." />
          <CommandList>
            <CommandEmpty>No floor or area found.</CommandEmpty>
            <CommandGroup>
              {Array.isArray(areas) &&
                areas.map((area) => (
                  <CommandItem
                    key={area.value}
                    value={area.value}
                    onSelect={(currentValue) => {
                      const newValue =
                        currentValue === value ? "" : currentValue;
                      setValue(
                        newValue ||
                          (areas && areas.length > 0 ? areas[0].value : ""),
                      );
                      onFloorChange(
                        areas?.find(
                          (area) =>
                            area.value ===
                            (newValue ||
                              (areas && areas.length > 0
                                ? areas[0].value
                                : "")),
                        )?.label || "",
                      );
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === area.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {area.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
