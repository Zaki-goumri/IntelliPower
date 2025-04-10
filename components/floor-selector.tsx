"use client";

import { useEffect, useState } from "react";
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

export type FloorSelectorProps = {
  onFloorChange: (value: string) => void;
  className?: string;
  data?: { value: string; label: string; type: string; id: string }[];
  value?: string;
};

export default function FloorSelector({
  onFloorChange,
  className,
  data,
  value,
}: FloorSelectorProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (data && data.length > 0 && !value) {
      onFloorChange(data[0].value); // auto-set first floor if none is selected
    }
  }, [data, value, onFloorChange]);

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
            ? data?.find((area) => area.value === value)?.label
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
              {data
                ?.slice()
                .sort((a, b) => {
                  if (data.length > 0) {
                    if (a.value === data[0].value) return -1;
                    if (b.value === data[0].value) return 1;
                  }
                  return 0;
                })
                .map((area) => (
                  <CommandItem
                    key={area.value}
                    value={area.value}
                    onSelect={(currentValue) => {
                      if (currentValue !== value) {
                        onFloorChange(currentValue);
                      }
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
