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

export default function AddToCollectionButton() {
  const { user, isLoading } = useAuth();
  const openModal = useModalStore((state) => state.openModal);

  const handleAddToCollection = () => {
    // openModal("create-collection");
    openModal("add-to-collection");
  };

  if (isLoading) return <Skeleton className="bg-primary/50 w-full h-10" />;

  if (!user) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Button disabled className="w-full">
              <Layers />
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
    <Button onClick={handleAddToCollection}>
      <Layers />
      Add to collection
    </Button>
  );
}
