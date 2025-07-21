import { Frown } from "lucide-react";

export default function MovieNotFound() {
  return (
    <div className="flex flex-col justify-center items-center gap-3 rounded-md shadow-md w-full h-[500px]">
      <Frown className="w-10 h-10 text-primary" />
      <h1 className="text-2xl font-bold uppercase">Movie not found</h1>
      <p className="text-sm text-secondary-foreground">
        The movie you are looking for does not exist.
      </p>
    </div>
  );
}
