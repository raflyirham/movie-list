"use client";

import { CircleAlert } from "lucide-react";

export default function MovieError() {
  return (
    <div className="flex flex-col justify-center items-center gap-3 rounded-md shadow-md w-full h-[500px]">
      <CircleAlert className="w-10 h-10 text-primary" />
      <h1 className="text-2xl font-bold uppercase">Error</h1>
      <p className="text-sm text-secondary-foreground">
        Something went wrong while getting movie details.
      </p>
    </div>
  );
}
