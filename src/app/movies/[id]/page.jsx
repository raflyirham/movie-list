"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { getDoc, collection, doc } from "firebase/firestore";

import getFirebaseConfig from "@/firebase/config";
import AddToCollectionButton from "./_components/add-to-collection-button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import useMovieStore from "@/stores/useMovieStore";
import { toast } from "sonner";
import MovieDetailLoader from "./_components/loaders/movie-detail-loader";

export default function MovieDetailPage() {
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();
  const movieId = params.id;

  const { db } = getFirebaseConfig();

  const movie = useMovieStore((state) => state.movie);
  const setMovie = useMovieStore((state) => state.setMovie);

  const getMovie = async () => {
    try {
      setIsLoading(true);

      const movieCollection = collection(db, "movies");
      const movieDoc = await getDoc(doc(movieCollection, movieId));

      if (!movieDoc.exists()) {
        notFound();
      }

      setMovie({
        ...movieDoc.data(),
        id: movieDoc.id,
      });
    } catch {
      toast.error("Failed to get movie details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMovie();
  }, []);

  if (isLoading) {
    return <MovieDetailLoader />;
  }

  if (!movie) {
    notFound();
  }

  return (
    <div className="flex flex-col rounded-md shadow-md">
      <div className="w-full h-[500px] bg-primary-foreground rounded-md relative">
        <div className="absolute top-0 left-0 w-full h-full bg-black/20 rounded-md z-10"></div>
        <Image
          src={movie.bannerUrl}
          alt={movie.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover rounded-md"
          quality={100}
        />
      </div>
      <div className="flex flex-row gap-6 -mt-72 z-20 px-8 py-8">
        <div className="flex flex-col gap-2">
          <div className="w-[300px] h-[400px] bg-primary rounded-md relative">
            <Image
              src={movie.coverUrl}
              alt={movie.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-md"
              quality={100}
            />
          </div>
          <AddToCollectionButton />

          <div className="flex flex-col gap-4 mt-4">
            <p className="text-sm text-secondary-foreground">
              <span className="font-bold">Duration:</span> {movie.duration}{" "}
              minutes
            </p>
            <p className="text-sm text-secondary-foreground">
              <span className="font-bold">Rating:</span> {movie.rating}/10
            </p>
            <p className="text-sm text-secondary-foreground">
              <span className="font-bold">Release Year:</span>{" "}
              {movie.releaseYear}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-42">
          <h1 className="text-5xl font-bold text-white">{movie.title}</h1>

          <div className="flex flex-col gap-6 mt-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Description</h2>
              <p className="">{movie.description}</p>
            </div>
            <Separator className="bg-secondary-foreground/50" />
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Genres</h2>

              <div className="flex flex-row gap-1 flex-wrap">
                {movie.genres.map((genre) => (
                  <Badge key={genre}>{genre}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
