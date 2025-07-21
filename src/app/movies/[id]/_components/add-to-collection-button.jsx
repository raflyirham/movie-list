"use client";

import { Button } from "@/components/ui/button";
import { Layers } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useModalStore from "@/stores/useModalStore";
import useSelectedMoviesStore from "./useSelectedMoviesStore";

export default function AddToCollectionButton({ type = "single" }) {
  const { user, isLoading } = useAuth();
  const openModal = useModalStore((state) => state.openModal);
  const { selectedMovies } = useSelectedMoviesStore();

  const handleAddToCollection = () => {
    if (type === "bulk" && selectedMovies.length === 0) return;
    openModal(type === "single" ? "add-to-collection" : "add-to-collection-bulk");
  };

  if (isLoading) return <Skeleton className="bg-primary/50 w-full h-10" />;

  if (!user) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Button disabled className="w-full">
              <Layers className="mr-2" />
              Add to collection
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Log in to add a movie to your collection</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Button onClick={handleAddToCollection} disabled={type === "bulk" && selectedMovies.length === 0}>
      <Layers className="mr-2" />
      {type === "bulk" ? `Add ${selectedMovies.length} to Collection` : "Add to Collection"}
    </Button>
  );
}
