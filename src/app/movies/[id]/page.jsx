"use client";

import { getDoc, collection, doc } from "firebase/firestore";
import getFirebaseConfig from "@/firebase/config";
import Image from "next/image";
import AddToCollectionButton from "./_components/add-to-collection-button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import useMovieStore from "@/stores/useMovieStore";
import { useEffect } from "react";

// TODO: Remove this
const mockData = {
  genres: ["Fantasy", "Horror", "Sci-Fi"],
};

export default function MovieDetailPage() {
  const { db } = getFirebaseConfig();
  const setMovie = useMovieStore((state) => state.setMovie);

  const getMovie = async (id) => {
    const movieCollection = collection(db, "movies");
    const movieDoc = await getDoc(doc(movieCollection, id));
    return movieDoc.data();
  };

  useEffect(() => {
    setMovie({
      id: "1",
      title: "Stranger Things",
      description:
        "A group of friends in a small town discover a strange girl with supernatural powers.",
      imageUrl:
        "https://cdn.theatlantic.com/thumbor/TvBfu0CaY_Em1tIGSXZyfKt7HFI=/426x167:7076x3908/1600x900/media/img/mt/2017/10/downloadAsset/original.jpg",
      duration: 60,
      releaseYear: 2016,
      rating: 8.5,
      genres: ["Fantasy", "Horror", "Sci-Fi"],
    });
  }, []);

  return (
    <div className="flex flex-col rounded-md shadow-md">
      <div className="w-full h-[500px] bg-primary-foreground rounded-md relative">
        <div className="absolute top-0 left-0 w-full h-full bg-black/20 rounded-md z-10"></div>
        <Image
          src="https://cdn.theatlantic.com/thumbor/TvBfu0CaY_Em1tIGSXZyfKt7HFI=/426x167:7076x3908/1600x900/media/img/mt/2017/10/downloadAsset/original.jpg"
          alt="movie poster"
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
              src="https://m.media-amazon.com/images/M/MV5BMjg2NmM0MTEtYWY2Yy00NmFlLTllNTMtMjVkZjEwMGVlNzdjXkEyXkFqcGc@._V1_.jpg"
              alt="movie poster"
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
              <span className="font-bold">Duration:</span> 60 minutes
            </p>
            <p className="text-sm text-secondary-foreground">
              <span className="font-bold">Rating:</span> 8.5/10
            </p>
            <p className="text-sm text-secondary-foreground">
              <span className="font-bold">Release Year:</span> 2016
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-42">
          <h1 className="text-5xl font-bold text-white">Stranger Things</h1>

          <div className="flex flex-col gap-6 mt-12">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Description</h2>
              <p className="">
                In a small town where everyone knows everyone, a peculiar
                incident starts a chain of events that leads to a child's
                disappearance, which begins to tear at the fabric of an
                otherwise-peaceful community. Dark government agencies and
                seemingly malevolent supernatural forces converge on the town,
                while a few of the locals begin to understand that more is going
                on than meets the eye.
              </p>
            </div>
            <Separator className="bg-secondary-foreground/50" />
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">Genres</h2>

              <div className="flex flex-row gap-1 flex-wrap">
                {mockData.genres.map((genre) => (
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
