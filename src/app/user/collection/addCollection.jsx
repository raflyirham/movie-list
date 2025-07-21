'use client'

import { useState } from 'react'
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import getFirebaseConfig from '@/firebase/config'

export default function AddCollection({ open, setOpen }) {
  const [name, setName] = useState('')
  const { db } = getFirebaseConfig()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nameValid = /^[a-zA-Z0-9 ]+$/.test(name)
    if (!name || !nameValid) {
      alert('Nama koleksi tidak valid. Hanya huruf, angka, dan spasi.')
      return
    }

    const nameTrimmed = name.trim()

    // ✅ Cek duplikasi nama
    const q = query(collection(db, 'collections'), where('name', '==', nameTrimmed))
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
      alert('Nama koleksi sudah digunakan. Harus unik.')
      return
    }

    try {
      await addDoc(collection(db, 'collections'), {
        name: nameTrimmed,
        movies: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      setName('')
      setOpen(false)
    } catch (err) {
      console.error('Gagal menambahkan koleksi:', err)
      alert('Terjadi kesalahan. Coba lagi.')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-[300px]"
      >
        <h2 className="text-xl font-bold mb-4">Add New Collection</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Collection name"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
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
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  )
}
