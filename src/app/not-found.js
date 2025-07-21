"use client"
import { Button } from "@/components/ui/button";
import { Frown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound() {

    const router = useRouter();

    const redirect = () => {
        router.push("/");
    }

    return (
        <div className="flex flex-col justify-center items-center gap-3 rounded-md shadow-md w-full h-[500px]">
        <Frown className="w-10 h-10 text-primary" />
        <h1 className="text-2xl font-bold uppercase">Request not found</h1>
        <Button onClick={redirect}>Back to home</Button>
        </div>
  );
}