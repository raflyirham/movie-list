"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import useAuth from "@/hooks/useAuth";
import MoviesModals from "./[id]/_components/movies-modals";

export default function UserLayout({ children }) {

  const {user} = useAuth();
  console.log(user);

  return (
    <>
        <Navbar user={user}/>
        <div className="w-10/12 mx-auto mt-26 md:mt-32 min-h-screen">{children}</div>
        <MoviesModals />
        <Footer />
    </>
  );
}