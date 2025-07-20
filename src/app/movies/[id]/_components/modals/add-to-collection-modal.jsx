import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import useAuth from "@/hooks/useAuth";
import useModalStore from "@/stores/useModalStore";
import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  getDoc,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import getFirebaseConfig from "@/firebase/config";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { allTruthy, anyTruthy, cn, valueOrDefault } from "@/lib/utils";
import { CheckCircle2Icon, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import useMovieStore from "@/stores/useMovieStore";

export default function AddToCollectionModal() {
  const { user, isLoading } = useAuth();
  const { db } = getFirebaseConfig();

  const { closeModal, openModal } = useModalStore();
  const movieId = useMovieStore((state) => state.getMovieId());

  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const [movieCollections, setMovieCollections] = useState([]);
  const [selectedMovieCollections, setSelectedMovieCollections] = useState([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const getMovie = async (movieId) => {
    try {
      const movieRef = doc(db, "movies", movieId);
      const movieDoc = await getDoc(movieRef);
      return movieDoc.data();
    } catch (error) {
      console.error("Error fetching movie:", error);
      return null;
    }
  };

  const isAlreadyInCollection = (collection) => {
    return collection.movies?.includes(movieId);
  };

  const getCollections = async () => {
    try {
      setIsLoadingCollections(true);
      const userCollectionsRef = collection(
        db,
        "users",
        user.uid,
        "collections"
      );
      const q = query(userCollectionsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const collections = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const collectionsWithImages = await Promise.all(
        collections.map(async (collection) => {
          const moviesPromise = collection.movies?.map(async (movieId) => {
            return await getMovie(movieId);
          });

          const movies = await Promise.all(moviesPromise);

          return {
            ...collection,
            movies,
            imageUrl: valueOrDefault(
              movies?.[0]?.imageUrl,
              "/assets/images/placeholders/collection.png"
            ),
            isAlreadyInCollection: isAlreadyInCollection(collection),
          };
        })
      );

      setMovieCollections(collectionsWithImages);

      if (collections.length === 0) {
        openModal("create-collection");
        toast.info("Create a collection to add this movie");
        return;
      }
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setIsLoadingCollections(false);
    }
  };

  const handleSelectMovieCollection = (collection) => {
    if (collection.isAlreadyInCollection) {
      return;
    }

    if (isCollectionSelected(collection.id)) {
      setSelectedMovieCollections((prev) =>
        prev.filter((c) => c.id !== collection.id)
      );
      return;
    }

    setSelectedMovieCollections((prev) => [...prev, collection]);
  };

  const isCollectionSelected = (id) => {
    return selectedMovieCollections.some((collection) => collection.id === id);
  };

  const isSubmitButtonDisabled = anyTruthy(
    selectedMovieCollections.length === 0,
    isLoadingCollections,
    isLoading,
    isSubmitting
  );

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      Promise.all(
        selectedMovieCollections.map(async (collection) => {
          const collectionRef = doc(
            db,
            "users",
            user.uid,
            "collections",
            collection.id
          );
          await updateDoc(collectionRef, {
            movies: arrayUnion(movieId),
          });
        })
      );

      toast.success("Movie added to collections successfully");
      closeModal();
    } catch {
      toast.error("Failed to add movie to collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      getCollections();
    }
  }, [user]);

  if (isLoading || isLoadingCollections) {
    return (
      <Dialog open onOpenChange={closeModal}>
        <DialogContent showCloseButton={false} className="min-w-[800px]">
          <DialogHeader>
            <DialogTitle asChild>
              <Skeleton className="bg-primary/50 w-[200px] h-5" />
            </DialogTitle>
            <DialogDescription asChild>
              <Skeleton className="bg-primary/50 w-[300px] h-5" />
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[400px] overflow-y-auto mt-4">
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="bg-primary/50 w-full h-40" />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Skeleton className="bg-primary/50 w-[100px] h-10" />
            <Skeleton className="bg-primary/50 w-[100px] h-10" />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={closeModal}>
      <DialogContent showCloseButton={false} className="min-w-[800px]">
        <DialogHeader>
          <div className="flex flex-row justify-between items-center gap-10">
            <div className="flex flex-col gap-2">
              <DialogTitle>Add to Collection</DialogTitle>
              <DialogDescription>
                Select one or more collections to add this movie to. You can't
                add a movie to a collection if it's already in one.
              </DialogDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => openModal("create-collection")}
            >
              <Plus />
              Create Collection
            </Button>
          </div>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          {selectedMovieCollections.length} selected
        </p>

        <div className="max-h-[400px] overflow-y-auto mt-4">
          <div className="grid grid-cols-3 gap-3">
            {movieCollections.map((collection) => (
              <div
                key={collection.id}
                className={cn(
                  "border-2 rounded-lg hover:border-primary transition-all duration-300 cursor-pointer",
                  isCollectionSelected(collection.id) && "border-primary"
                )}
                onClick={() => handleSelectMovieCollection(collection)}
              >
                <div className="w-full h-[150px] bg-primary/50 relative">
                  {isCollectionSelected(collection.id) && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge>Selected</Badge>
                    </div>
                  )}
                  {collection.isAlreadyInCollection && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge className="bg-green-600">In Collection</Badge>
                    </div>
                  )}
                  <Image
                    src={collection.imageUrl}
                    alt={collection.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    quality={100}
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="px-4 py-2">
                  <h3 className="text-lg font-bold">{collection.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={isSubmitButtonDisabled} onClick={handleSubmit}>
            {isSubmitting ? "Adding..." : "Add to Collection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
