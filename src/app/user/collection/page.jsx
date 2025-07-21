'use client'

import ListCollection from './listCollection'
import AddCollection from './addCollection'
import { useEffect, useState } from 'react'
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function CollectionPage() {
  const [openAdd, setOpenAdd] = useState(false);
  const router = useRouter();
  const {role} = useAuth();

  const redirect = () => {
    if(role==="admin"){
      router.push("/");
    }
  }

  useEffect(()=>{
    redirect();
  }, [role]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Collections</h1>
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Collection
        </button>
      </div>

      <ListCollection />
      <AddCollection open={openAdd} setOpen={setOpenAdd} />
    </div>
  )
}
