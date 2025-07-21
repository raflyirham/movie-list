"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import useAuth from "@/hooks/useAuth";

export default function UserLayout({ children }) {

  const {user} = useAuth();

  return (
    <>
        <Navbar user={user}/>
        <div className="w-10/12 mx-auto mt-26 md:mt-32 min-h-screen">{children}</div>
        <Footer />
    </>
  );
}