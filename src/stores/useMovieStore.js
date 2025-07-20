import { create } from "zustand";

export default create((set, get) => ({
  movie: null,
  setMovie: (movie) => set({ movie }),
  getMovieId: () => {
    return get().movie?.id;
  },
}));
