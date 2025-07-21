"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { FilePenLine } from "lucide-react";
import { toast } from "sonner";

import { editMovie } from "../actions";
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
      {pending ? "Saving..." : "Save Changes"}
    </Button>
  );
}

export function EditMovieForm({ movie }) {
  const [state, formAction] = useActionState(editMovie, { message: null });
  const formRef = useRef(null);

  useEffect(() => {
    if (state.message?.includes("successfully")) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <FilePenLine className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Edit Movie: {movie.title}</DialogTitle>
          <DialogDescription>
            Make changes to the movie details below.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction}>
          <input type="hidden" name="movieId" value={movie.id} />
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" name="title" defaultValue={movie.title} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genres" className="text-right">Genres</Label>
              <Input id="genres" name="genres" defaultValue={movie.genres.join(", ")} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" name="description" defaultValue={movie.description} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="coverUrl" className="text-right">Cover URL</Label>
              <Input id="coverUrl" name="coverUrl" defaultValue={movie.coverUrl} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bannerUrl" className="text-right">Banner URL</Label>
              <Input id="bannerUrl" name="bannerUrl" defaultValue={movie.bannerUrl} className="col-span-3" />
            </div>
            <div className="grid grid-cols-3 gap-4">
               <div className="grid gap-2">
                <Label htmlFor="duration">Duration (min)</Label>
                <Input id="duration" name="duration" type="number" defaultValue={movie.duration} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="rating">Rating (0-10)</Label>
                <Input id="rating" name="rating" type="number" step="0.1" defaultValue={movie.rating} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="releaseYear">Release Year</Label>
                <Input id="releaseYear" name="releaseYear" type="number" defaultValue={movie.releaseYear} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}