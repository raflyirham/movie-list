'use client'
import { useState } from 'react'
import {
  updateDoc,
  doc,
  query,
  where,
  collection,
  getDocs
} from 'firebase/firestore'
import getFirebaseConfig from '@/firebase/config'

export default function EditName({ collection, setCollection }) {
  const [name, setName] = useState(collection.name)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { db } = getFirebaseConfig()

  const handleEdit = async (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    const valid = /^[a-zA-Z0-9 ]+$/.test(trimmed)
    if (!valid || !trimmed) {
      setError('Nama tidak valid.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const q = query(collection(db, 'collections'), where('name', '==', trimmed))
      const snapshot = await getDocs(q)
      const exists = snapshot.docs.some((doc) => doc.id !== collection.id)
      if (exists) {
        setError('Nama koleksi sudah digunakan.')
        return
      }

      await updateDoc(doc(db, 'collections', collection.id), {
        name: trimmed,
        updatedAt: new Date()
      })

      setCollection(prev => ({ ...prev, name: trimmed }))
    } catch (err) {
      console.error('Gagal update nama:', err)
      setError('Gagal menyimpan perubahan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleEdit} className="flex flex-col gap-2 mt-4 max-w-md">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  )
}
