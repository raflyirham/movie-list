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

export default function EditCollection({ open, setOpen, collection: col }) {
  const [name, setName] = useState(col?.name || '')
  const [error, setError] = useState('')
  const { db } = getFirebaseConfig()
  const { user } = useAuth()
  const userId = user?.uid

  const handleUpdate = async (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    const valid = /^[a-zA-Z0-9 ]+$/.test(trimmed)

    if (!trimmed || !valid) {
      setError('Nama tidak valid')
      return
    }

    try {
      // Cek duplikasi nama (selain dirinya sendiri)
      const q = query(
        collection(db, 'users', userId, 'colection'),
        where('name', '==', trimmed)
      )
      const snapshot = await getDocs(q)
      const isUsed = snapshot.docs.some((doc) => doc.id !== col.id)

      if (isUsed) {
        setError('Nama koleksi sudah dipakai')
        return
      }

      const ref = doc(db, 'users', userId, 'colection', col.id)
      await updateDoc(ref, {
        name: trimmed,
        updatedAt: new Date()
      })

      setOpen(false)
    } catch (err) {
      console.error('Gagal update koleksi:', err)
      setError('Terjadi kesalahan')
    }
  }

  if (!open || !col || !userId) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow w-[300px]">
        <h2 className="text-lg font-bold mb-4">Edit Collection</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="Collection name"
        />
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
