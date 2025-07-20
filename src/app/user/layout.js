"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";


export default function UserLayout({ children }) {
  return (
    <>
        <Navbar />
        <div className="w-10/12 mx-auto mt-[300px] sm:mt-[180px] md:mt-[200px] min-h-screen">{children}</div>
        <Footer />
    </>
  );
}