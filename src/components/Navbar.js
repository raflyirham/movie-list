"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";


const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return(
        <nav className="w-full fixed top-0 left-0 z-40">
            <div className="w-full bg-gray-200 p-3 box-border">
                <div className="w-10/12 mx-auto flex flex-col gap-y-4 sm:flex-row sm:gap-y-0 justify-between">
                    <div className="bg-gray-600 text-white text-center font-bold py-2 px-4 rounded-lg hover:bg-black">
                        <button>Dark Mode</button>
                    </div>
                    <div className="flex flex-col gap-y-4 sm:flex-row sm:gap-y-0 sm:gap-x-2">
                        <div className="bg-green-500 text-white text-center font-bold py-2 px-4 rounded-lg hover:bg-green-600"><Link href="/login">Login</Link></div>
                        <div className="bg-yellow-500 text-white text-center font-bold py-2 px-4 rounded-lg hover:bg-yellow-700"><Link href="/register">Register</Link></div>
                    </div>
                </div>
            </div>
            <div className="w-full bg-blue-900 p-4 md:p-6">
                <div className="w-10/12 mx-auto flex justify-between items-center">
                    <h3 className="text-xl md:text-4xl text-white font-bold">MyMovieList</h3>
                    <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden">
                        <Image src='/icons8-hamburger-button-100.png' alt="menu-bar" width={50} height={50}  />
                    </button>
                    <div className="hidden sm:flex gap-x-5 items-center">
                        <Link href="/" className="text-white text-sm md:text-lg font-semibold hover:text-yellow-300">Home</Link>
                        <Link href="/user/movieList" className="text-white text-sm md:text-lg font-semibold hover:text-yellow-300">Movies</Link>
                        <Link href="/" className="text-white text-sm md:text-lg font-semibold hover:text-yellow-300">MyCollection</Link>
                    </div>

                    <div className={`absolute top-[258px] left-0 w-full transition-all delay-150 duration-700 ease-in-out overflow-hidden bg-blue-900 flex flex-col items-center rounded-b-lg sm:hidden gap-y-3 py-3 ${menuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <Link href="/" onClick={() => setMenuOpen(false)} className="text-white font-semibold hover:text-yellow-300">Home</Link>
                        <Link href="/user/movieList" onClick={() => setMenuOpen(false)} className="text-white font-semibold hover:text-yellow-300">Movies</Link>
                        <Link href="/" onClick={() => setMenuOpen(false)} className="text-white font-semibold hover:text-yellow-300">MyCollection</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;