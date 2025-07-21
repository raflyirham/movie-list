'use client'

import { useState } from 'react'
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore'
import getFirebaseConfig from '@/firebase/config'
import useAuth from '@/hooks/useAuth'

export default function AddCollection({ open, setOpen }) {
  const [name, setName] = useState('')
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
      setError('Nama tidak boleh kosong atau mengandung karakter spesial.')
      return
    }

    if (!userId) {
      setError('User belum login.')
      return
    }

    setError('')
    setLoading(true)

    try {
      // Cek duplikasi nama
      const q = query(
        collection(db, 'users', userId, 'colection'),
        where('name', '==', trimmed)
      )
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        setError('Nama koleksi sudah digunakan.')
        return
      }

      // Tambahkan koleksi baru
      await addDoc(collection(db, 'users', userId, 'colection'), {
        name: trimmed,
        movies: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      setName('')
      setOpen(false)
    } catch (err) {
      console.error('Gagal tambah koleksi:', err)
      setError('Terjadi kesalahan.')
    } finally {
      setLoading(false)
    }
  }

  if (!open || !userId) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-[320px]">
        <h2 className="text-lg font-bold mb-4">Add New Collection</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Collection name"
          className="w-full border p-2 rounded mb-3"
          disabled={loading}
        />
        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
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
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
    </div>
  )
}
