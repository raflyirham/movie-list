import { collection, getDocs, orderBy, query } from "firebase/firestore";
import getFirebaseConfig from "@/firebase/config";
import { AddMovieForm } from "./_components/add-movie-form";
import { MoviesTable } from "./_components/movies-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { LogoutButton } from "./_components/logout-button"; 

export default async function AdminPage() {

  async function getMovies() {
    const { db } = getFirebaseConfig();
    const moviesCollection = collection(db, "movies");
    const q = query(moviesCollection, orderBy("title"));
    const movieSnapshot = await getDocs(q);
    const movieList = movieSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return movieList;
  }

  const movies = await getMovies();

  return (
    <main className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold tracking-tight">Manage Movies</h1>
        <div className="flex items-center gap-4"> {}
          <AddMovieForm />
          <LogoutButton /> {}
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by title..." className="pl-10" />
        </div>
      </div>

      <MoviesTable movies={movies} />
    </main>
  );
}