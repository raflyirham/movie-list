'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  deleteDoc,
} from 'firebase/firestore'
import getFirebaseConfig from '@/firebase/config'
import EditCollection from './editCollection'
import Link from 'next/link'

export default function ListCollection() {
  const [collections, setCollections] = useState([])
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState(null)

  const { db } = getFirebaseConfig()

  useEffect(() => {
    const q = query(collection(db, 'collections'), orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setCollections(data)
    })

    return () => unsubscribe()
  }, [db])

  const handleDelete = async (col) => {
    const confirm = window.confirm(`Are you sure you want to delete "${col.name}"?`)
    if (!confirm) return

    try {
      await deleteDoc(doc(db, 'collections', col.id))
    } catch (error) {
      console.error('Error deleting collection:', error)
      alert('Failed to delete collection')
    }
  }

  const handleEdit = (col) => {
    setSelectedCollection(col)
    setOpenEdit(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {collections.length === 0 && (
          <p className="text-gray-500">No collections found.</p>
        )}

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
                onClick={() => handleEdit(col)}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(col)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Edit */}
      <EditCollection
        open={openEdit}
        setOpen={setOpenEdit}
        collection={selectedCollection}
      />
    </>
  )
}
