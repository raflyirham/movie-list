'use client'
import { useState } from 'react'
import { updateDoc, arrayRemove, doc } from 'firebase/firestore'
import getFirebaseConfig from '@/firebase/config'

export default function RemoveMovie({ movieId, collection, setCollection }) {
  const { db } = getFirebaseConfig()
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    setLoading(true)
    try {
      await updateDoc(doc(db, 'collections', collection.id), {
        movies: arrayRemove(movieId),
        updatedAt: new Date()
      })

      setCollection(prev => ({
        ...prev,
        movies: prev.movies.filter(m => m !== movieId)
      }))
      setShowModal(false)
    } catch (err) {
      console.error('Failed to remove movie:', err)
      alert('Gagal menghapus movie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Button remove on top of movie */}
      <button
        onClick={() => setShowModal(true)}
        className="absolute top-2 right-2 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 z-10"
      >
        Remove
      </button>

      {/* Custom modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-[300px]">
            <h2 className="text-lg font-bold mb-4">Remove Movie</h2>
            <p className="mb-2">Are you sure you want to remove:</p>
            <p className="text-sm font-mono mb-4 bg-gray-100 p-2 rounded">
              {movieId}
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 border rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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

