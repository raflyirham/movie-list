'use client'

import { useState } from 'react'
import {
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  collection
} from 'firebase/firestore'
import getFirebaseConfig from '@/firebase/config'
import useAuth from '@/hooks/useAuth'

export default function EditName({ collection: col, setCollection }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(col.name)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { db } = getFirebaseConfig()
  const { user } = useAuth()
  const userId = user?.uid

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    const valid = /^[a-zA-Z0-9 ]+$/.test(trimmed)

    if (!trimmed || !valid) {
      setError('Nama tidak valid (hanya huruf, angka, dan spasi)')
      return
    }

    if (!userId) {
      setError('User belum login.')
      return
    }

    try {
      setLoading(true)

      // Cek duplikasi nama koleksi lain
      const q = query(
        collection(db, 'users', userId, 'colection'),
        where('name', '==', trimmed)
      )
      const snapshot = await getDocs(q)
      const isDuplicate = snapshot.docs.some((doc) => doc.id !== col.id)

      if (isDuplicate) {
        setError('Nama koleksi sudah digunakan.')
        return
      }

      const ref = doc(db, 'users', userId, 'colection', col.id)
      await updateDoc(ref, {
        name: trimmed,
        updatedAt: new Date(),
      })

      // Update nama di UI
      setCollection((prev) => ({
        ...prev,
        name: trimmed,
      }))

      setOpen(false)
    } catch (err) {
      console.error('Gagal update nama:', err)
      setError('Terjadi kesalahan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Edit Name
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow w-[320px]"
          >
            <h2 className="text-lg font-bold mb-4">Edit Collection Name</h2>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New name"
              className="w-full border p-2 rounded mb-2"
              disabled={loading}
            />
            {error && (
              <p className="text-sm text-red-600 mb-2">{error}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
