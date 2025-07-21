'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
  getDoc
} from 'firebase/firestore'
import getFirebaseConfig from '@/firebase/config'
import useAuth from '@/hooks/useAuth'
import Link from 'next/link'
import EditCollection from './editCollection'
import AddCollection from './addCollection'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useModalStore from '@/stores/useModalStore'

export default function ListCollection() {
  const { closeModal, openModal } = useModalStore();
  const { user } = useAuth();

  const [collections, setCollections] = useState([])
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [openAdd, setOpenAdd] = useState(false);
  const [movies, setMovies] = useState([]);

  // var userId = user?.uid;

  useEffect(() => {
    const { db } = getFirebaseConfig();
    if(user){
      const q = query(
        collection(db, 'users', user.uid, 'collections'),
        orderBy('createdAt', 'desc')
      )

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCollections(data);
      })

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(()=>{
    var movieCovers = [];
    const fetchMovie = async (movieId) => {
      const {db} = getFirebaseConfig();
      const movieRef = collection(db, "movies");
      const movieDocs = await getDoc(doc(movieRef, movieId));
      console.log(movieDocs.data());
      if(movieDocs.exists){
        movieCovers.push(movieDocs.data());
      }
      setMovies(movieCovers);
    }
    if(collections.length>0){
      console.log(collections);
      collections.map((col) => {
        console.log(col.movies[0]);
        fetchMovie(col.movies[0]);
      });
    }
  }, [collections]);

  // Tampilkan loading jika user belum ready
  if (!user) { return <p className="p-6">Loading user...</p>}

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Collections</h1>
        <Button
              variant="outline"
              onClick={() => openModal("create-collection")}
            >
              <Plus />
              Create Collection
            </Button>
      </div>

      <AddCollection open={openAdd} setOpen={setOpenAdd} />


      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collections.map((col, index) => (
          <div key={col.id} className="p-4 border rounded shadow bg-white relative">
            <Link href={`/user/collection/detail?id=${col.id}`}>
              <div className="cursor-pointer">
                <img
                  src={
                    movies[index]
                      ? movies[index].coverUrl
                      : "/assets/images/placeholders/collection.png"
                  }
                  alt={col.name}
                  className="h-40 w-full object-cover rounded mb-2"
                />
                <h2 className="text-lg font-semibold">{col.name}</h2>
                <p className="text-sm text-gray-500">
                  {col.movies?.length || 0} movie{col.movies?.length !== 1 ? 's' : ''}
                </p>
              </div>
            </Link>

            <div className="flex justify-between mt-3">
              <button
                onClick={() => {
                  setSelectedCollection(col)
                  setOpenEdit(true)
                }}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  const { db } = getFirebaseConfig();
                  const confirm = window.confirm(`Delete "${col.name}"?`)
                  if (!confirm) return
                  await deleteDoc(doc(db, 'users', user.uid, 'collections', col.id))
                }}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <EditCollection
        open={openEdit}
        setOpen={setOpenEdit}
        collection={selectedCollection}
      />
    </>
  )
}
