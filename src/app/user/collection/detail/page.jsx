"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import getFirebaseConfig from "@/firebase/config";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
// import EditName from './EditName'
// import RemoveMovie from './RemoveMovie'
import AddCollection from "../addCollection";

export default function CollectionDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { db } = getFirebaseConfig();
  const { user } = useAuth();
  const userId = user?.uid;

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    const fetchCollection = async () => {
      if (!userId || !id) return;

      try {
        const ref = doc(db, "users", userId, "collections", id);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          setCollection({ id: snapshot.id, ...snapshot.data() });
        } else {
          setCollection(null);
        }
      } catch (err) {
        console.error("Error fetching collection detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [id, db, userId]);

  if (!userId) return <p className="p-6">Loading user...</p>;
  if (loading) return <p className="p-6">Loading...</p>;
  if (!collection) return <p className="p-6">Collection not found.</p>;

  return (
    <Suspense fallback={<p className="p-6">Loading...</p>}>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{collection.name}</h1>
          <div className="flex gap-2">
            <Link href="/user/collection">
              <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
                ← Back to Collections
              </button>
            </Link>
            <button
              onClick={() => setOpenAdd(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              + Add New Collection
            </button>
          </div>
        </div>

        {/* Modal Add Collection */}
        <AddCollection open={openAdd} setOpen={setOpenAdd} />

        {/* Edit Collection Name */}
        {/* <EditName collection={collection} setCollection={setCollection} /> */}

        <p className="text-gray-600 mt-4 mb-2">
          Total movies: {collection.movies?.length || 0}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {collection.movies?.length > 0 ? (
            collection.movies.map((movieId, index) => (
              <div key={index} className="relative group">
                <Link href={`/user/movie/detail?id=${movieId}`}>
                  <div className="hover:opacity-80 transition cursor-pointer">
                    <img
                      src={`/movie-covers/${movieId}.jpg`}
                      alt={movieId}
                      className="h-40 w-full object-cover rounded"
                    />
                  </div>
                </Link>
                {/* <RemoveMovie
                movieId={movieId}
                collectionId={collection.id}
                setCollection={setCollection}
              /> */}
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-4">
              No movies in this collection.
            </p>
          )}
        </div>
      </div>
    </Suspense>
  );
}
