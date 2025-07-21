'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import getFirebaseConfig from '@/firebase/config'
import Link from 'next/link'
import EditName from './EditName'
import RemoveMovie from './RemoveMovie'

export default function CollectionDetailPage() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [collection, setCollection] = useState(null)
  const [loading, setLoading] = useState(true)
  const { db } = getFirebaseConfig()

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const ref = doc(db, 'collections', id)
        const snapshot = await getDoc(ref)
        if (snapshot.exists()) {
          setCollection({ id: snapshot.id, ...snapshot.data() })
        } else {
          setCollection(null)
        }
      } catch (err) {
        console.error('Error fetching collection detail:', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCollection()
  }, [id, db])

  if (loading) return <p className="p-6">Loading...</p>
  if (!collection) return <p className="p-6">Collection not found.</p>

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{collection.name}</h1>
        <div className="flex gap-2">
          {/* Tombol kembali ke list */}
          <Link href="/user/collection">
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              ← Back to Collections
            </button>
          </Link>

          {/* Tombol Add Collection (hanya navigasi) */}
          <Link href="/user/collection">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              + Add New Collection
            </button>
          </Link>
        </div>
      </div>

      {/* Edit Collection Name */}
      <EditName collection={collection} setCollection={setCollection} />

      <p className="text-gray-600 mt-4 mb-2">
        Total movies: {collection.movies?.length || 0}
      </p>

      {/* Movie Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {collection.movies?.length > 0 ? (
          collection.movies.map((movieId, index) => (
            <div key={index} className="relative group">
              {/* Movie image as link to detail */}
              <Link href={`/user/movie/detail?id=${movieId}`}>
                <div className="hover:opacity-80 transition cursor-pointer">
                  <img
                    src={`/movie-covers/${movieId}.jpg`}
                    alt={movieId}
                    className="h-40 w-full object-cover rounded"
                  />
                </div>
              </Link>

              {/* Tombol Remove */}
              <RemoveMovie
                movieId={movieId}
                collection={collection}
                setCollection={setCollection}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500 col-span-4">No movies in this collection.</p>
        )}
      </div>
    </div>
  )
}
