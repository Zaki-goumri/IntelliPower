"use client";
import { useState } from "react";
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
  onFloorChange: (selectedId: string) => void;
  className?: string;
  data?: { value: string; label: string; type: string; id: string }[];
  value?: string; // Now this represents the selected ID
};

export default function FloorSelector({
  onFloorChange,
  className,
  data,
  value, // This is now the selected ID
}: FloorSelectorProps) {
  const [open, setOpen] = useState(false);

  // Find the selected item based on ID
  const selectedItem = data?.find((area) => area.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedItem ? selectedItem.label : "Select floor..."}
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
                    key={area.id}
                    value={area.value} // Keep value for searching
                    onSelect={() => {
                      if (area.id !== value) {
                        onFloorChange(area.id);
                      }
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === area.id ? "opacity-100" : "opacity-0",
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
