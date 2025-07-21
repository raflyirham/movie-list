import { create } from "zustand";

export default create((set, get) => ({
  movie: null,
  movies: [],
  setMovie: (movie) => set({ movie }),
  setMovies: (movies) => set({ movies }),
  getMovieId: () => {
    return get().movie?.id;
  },
}));
