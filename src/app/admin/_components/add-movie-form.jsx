"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { addMovie } from "../actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Adding..." : "Add Movie"}
    </Button>
  );
}

export function AddMovieForm() {
  const [state, formAction] = useActionState(addMovie, { message: null });
  const formRef = useRef(null);

  useEffect(() => {
    if (state.message?.includes("successfully")) {
      toast.success(state.message);
      formRef.current?.reset();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Movie
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New Movie</DialogTitle>
          <DialogDescription>
            Fill in the details of the new movie. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input id="title" name="title" className="col-span-3" />
              {state?.errors?.title && (
                <p className="col-span-4 text-red-500 text-xs text-right">
                  {state.errors.title[0]}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genres" className="text-right">
                Genres
              </Label>
              <Input
                id="genres"
                name="genres"
                placeholder="Action, Drama, Comedy"
                className="col-span-3"
              />
              {state?.errors?.genres && (
                <p className="col-span-4 text-red-500 text-xs text-right">
                  {state.errors.genres[0]}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                className="col-span-3"
              />
              {state?.errors?.description && (
                <p className="col-span-4 text-red-500 text-xs text-right">
                  {state.errors.description[0]}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coverUrl" className="text-right">
                Cover URL
              </Label>
              <Input id="coverUrl" name="coverUrl" className="col-span-3" />
              {state?.errors?.coverUrl && (
                <p className="col-span-4 text-red-500 text-xs text-right">
                  {state.errors.coverUrl[0]}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bannerUrl" className="text-right">
                Banner URL
              </Label>
              <Input id="bannerUrl" name="bannerUrl" className="col-span-3" />
              {state?.errors?.bannerUrl && (
                <p className="col-span-4 text-red-500 text-xs text-right">
                  {state.errors.bannerUrl[0]}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <div className="grid items-center gap-2">
                <Label htmlFor="duration">Duration (min)</Label>
                <Input id="duration" name="duration" type="number" />
                {state?.errors?.duration && (
                  <p className="text-red-500 text-xs">
                    {state.errors.duration[0]}
                  </p>
                )}
              </div>
              <div className="grid items-center gap-2">
                <Label htmlFor="rating">Rating (0-10)</Label>
                <Input id="rating" name="rating" type="number" step="0.1" />
                {state?.errors?.rating && (
                  <p className="text-red-500 text-xs">
                    {state.errors.rating[0]}
                  </p>
                )}
              </div>
              <div className="grid items-center gap-2">
                <Label htmlFor="releaseYear">Release Year</Label>
                <Input id="releaseYear" name="releaseYear" type="number" />
                {state?.errors?.releaseYear && (
                  <p className="text-red-500 text-xs">
                    {state.errors.releaseYear[0]}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}