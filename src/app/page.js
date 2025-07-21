"use client"
import useAuth from "@/hooks/useAuth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter();
  const {user, role} = useAuth();

  useEffect(()=> {
    if(role==="admin"){
      router.push("/admin");
    }
    else {
      router.push("/movies");
    }
  })

  // return (
  //   <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
  //     Index Page
  //   </div>
  // );
}
