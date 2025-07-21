'use client'

import { useState } from 'react'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import getFirebaseConfig from '@/firebase/config' // kamu pakai default function

export default function EditCollection({ open, setOpen, collection }) {
  const [name, setName] = useState(collection?.name || '')
  const { db } = getFirebaseConfig()

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!name || /[^a-zA-Z0-9 ]/.test(name)) {
      alert('Nama koleksi tidak valid')
      return
    }

    const ref = doc(db, 'collections', collection.id)
    await updateDoc(ref, {
      name: name.trim(),
      updatedAt: serverTimestamp() // ✅ tambahkan timestamp
    })

    setOpen(false)
  }

  if (!open || !collection) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow w-[300px]">
        <h2 className="text-lg font-bold mb-4">Edit Collection</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  )
}
