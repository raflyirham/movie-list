'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc
} from 'firebase/firestore'
import getFirebaseConfig from '@/firebase/config'
import useAuth from '@/hooks/useAuth'
import Link from 'next/link'
import EditCollection from './editCollection'
import AddCollection from './addCollection'

export default function ListCollection() {
  const { db } = getFirebaseConfig()
  const { user } = useAuth()
  const userId = user?.uid

  const [collections, setCollections] = useState([])
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [openAdd, setOpenAdd] = useState(false)

  // Tampilkan loading jika user belum ready
  if (!userId) return <p className="p-6">Loading user...</p>

  useEffect(() => {
    const q = query(
      collection(db, 'users', userId, 'colection'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setCollections(data)
    })

    return () => unsubscribe()
  }, [db, userId])

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Collections</h1>
        <button
          onClick={() => setOpenAdd(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add Collection
        </button>
      </div>

      <AddCollection open={openAdd} setOpen={setOpenAdd} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collections.map((col) => (
          <div key={col.id} className="p-4 border rounded shadow bg-white relative">
            <Link href={`/user/collection/detail?id=${col.id}`}>
              <div className="cursor-pointer">
                <img
                  src={
                    col.movies?.length > 0
                      ? `/movie-covers/${col.movies[0]}.jpg`
                      : '/placeholder.jpg'
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
                  const confirm = window.confirm(`Delete "${col.name}"?`)
                  if (!confirm) return
                  await deleteDoc(doc(db, 'users', userId, 'colection', col.id))
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
