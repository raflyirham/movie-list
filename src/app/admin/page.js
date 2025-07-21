"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import getFirebaseConfig from "@/firebase/config";
import { AddMovieForm } from "./_components/add-movie-form";
import { MoviesTable } from "./_components/movies-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { LogoutButton } from "./_components/logout-button";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const {role} = useAuth();

  const redirect = () => {
    if(role==="user"){
      router.push("/");
    }
  }

  useEffect(()=>{
    redirect();
  }, [role]);

  useEffect(() => {
    async function getMovies() {
      try {
        const { db } = getFirebaseConfig();
        const moviesCollection = collection(db, "movies");
        const q = query(moviesCollection, orderBy("title"));
        const movieSnapshot = await getDocs(q);
        const movieList = movieSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMovies(movieList);
        setFilteredMovies(movieList);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getMovies();
  }, []);

  useEffect(() => {
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMovies(filtered);
  }, [searchQuery, movies]);

  return (
    <main className="container mx-auto py-10">
      <div className="flex flex-wrap gap-4 justify-between items-center mb-4">
        <h1 className="text-4xl font-bold tracking-tight">Manage Movies</h1>
        <div className="flex items-center gap-2">
          <AddMovieForm />
          <LogoutButton />
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <p>Loading movies...</p>
      ) : filteredMovies.length > 0 ? (
        <MoviesTable movies={filteredMovies} />
      ) : (
        <p>No movies found.</p>
      )}
    </main>
  );
}