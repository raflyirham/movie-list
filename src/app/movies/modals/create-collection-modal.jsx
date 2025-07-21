"use client";

import { useState } from "react";

import useModalStore from "@/stores/useModalStore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import getFirebaseConfig from "@/firebase/config";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "sonner";

export default function CreateCollectionModal() {
  const { user, isLoading } = useAuth();
  const { closeModal } = useModalStore();
  const { db } = getFirebaseConfig();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!collectionName || collectionName.trim() === "") {
      setError("Collection name is required");
      return;
    }

    const isNameValid = /^[a-zA-Z0-9\s]+$/.test(collectionName);

    if (!isNameValid) {
      setError("Collection name must contain only letters and numbers");
      toast.error("Collection name must contain only letters and numbers");
      setCollectionName("");
      return;
    }

    try {
      setIsSubmitting(true);

      const userCollectionsRef = collection(
        db,
        "users",
        user.uid,
        "collections"
      );

      const isCollectionNameExists = query(
        userCollectionsRef,
        where("name", "==", collectionName)
      );

      const querySnapshot = await getDocs(isCollectionNameExists);

      if (querySnapshot.docs.length > 0) {
        setError("Collection name already exists");
        toast.error("Collection name already exists");
        setCollectionName("");
        return;
      }

      const newCollectionRef = await addDoc(userCollectionsRef, {
        name: collectionName,
        movies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast.success("Collection created successfully");
      setCollectionName("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Create Collection</DialogTitle>
          <DialogDescription>
            Create a new collection to add movies to your collection
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-3">
            <Label htmlFor="collection-name">Collection Name:</Label>
            <Input
              disabled={isSubmitting || isLoading}
              id="collection-name"
              type="text"
              placeholder="e.g. Sci-Fi Movies"
              name="collectionName"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Creating..." : "Create Collection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
