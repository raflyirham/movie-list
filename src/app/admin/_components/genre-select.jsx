"use client";

import * as React from "react";
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
import { Badge } from "@/components/ui/badge";

const ALL_GENRES = [
  { value: "action", label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "animation", label: "Animation" },
  { value: "comedy", label: "Comedy" },
  { value: "drama", label: "Drama" },
  { value: "fantasy", label: "Fantasy" },
  { value: "horror", label: "Horror" },
  { value: "kids & family", label: "Kids & Family" },
  { value: "sci-fi", label: "Sci-Fi" },
  { value: "sports", label: "Sports" },
  { value: "thriller", label: "Thriller" },
];

export function GenreSelect({ value, onChange }) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (currentValue) => {
    const newValue = value.includes(currentValue)
      ? value.filter((v) => v !== currentValue)
      : [...value, currentValue];
    onChange(newValue);
  };

  return (
    <div>
        <input type="hidden" name="genres" value={JSON.stringify(value)} />
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
            >
            <span className="truncate">
                {value.length > 0 ? `${value.length} selected` : "Select genres..."}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
            <Command>
            <CommandInput placeholder="Search genre..." />
            <CommandList>
                <CommandEmpty>No genre found.</CommandEmpty>
                <CommandGroup>
                {ALL_GENRES.map((genre) => (
                    <CommandItem
                    key={genre.value}
                    value={genre.value}
                    onSelect={handleSelect}
                    >
                    <Check
                        className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(genre.value) ? "opacity-100" : "opacity-0"
                        )}
                    />
                    {genre.label}
                    </CommandItem>
                ))}
                </CommandGroup>
            </CommandList>
            </Command>
        </PopoverContent>
        </Popover>
        <div className="flex flex-wrap gap-1 mt-2 min-h-[20px]">
            {value.map(v => <Badge key={v} variant="secondary">{ALL_GENRES.find(g => g.value === v)?.label || v}</Badge>)}
        </div>
    </div>
  );
}