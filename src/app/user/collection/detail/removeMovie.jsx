'use client'

import { useState } from 'react'
import { updateDoc, arrayRemove, doc } from 'firebase/firestore'
import getFirebaseConfig from '@/firebase/config'
import useAuth from '@/hooks/useAuth'

export default function RemoveMovie({ movieId, collectionId, setCollection }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { db } = getFirebaseConfig()
  const { user } = useAuth()
  const userId = user?.uid

  const handleRemove = async () => {
    if (!userId) return

    setLoading(true)
    try {
      const ref = doc(db, 'users', userId, 'colection', collectionId)

      await updateDoc(ref, {
        movies: arrayRemove(movieId),
        updatedAt: new Date(),
      })

      // Update UI tanpa reload
      setCollection((prev) => ({
        ...prev,
        movies: prev.movies.filter((m) => m !== movieId),
      }))
      setShowConfirm(false)
    } catch (err) {
      console.error('Gagal hapus movie:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="absolute top-2 right-2 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 z-10"
      >
        Remove
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-[300px]">
            <h2 className="text-lg font-bold mb-4">Remove Movie</h2>
            <p className="mb-4">Are you sure you want to remove:</p>
            <p className="mb-4 font-mono text-sm bg-gray-100 p-2 rounded">
              {movieId}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleRemove}
                className="bg-red-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
