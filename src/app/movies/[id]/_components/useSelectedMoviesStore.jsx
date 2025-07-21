import { create } from "zustand";

const useSelectedMoviesStore = create((set) => ({
  selectedMovies: [],
  addMovie: (id) =>
    set((state) => ({
      selectedMovies: [...new Set([...state.selectedMovies, id])],
    })),
  removeMovie: (id) =>
    set((state) => ({
      selectedMovies: state.selectedMovies.filter((mid) => mid !== id),
    })),
  toggleMovie: (id) =>
    set((state) => ({
      selectedMovies: state.selectedMovies.includes(id)
        ? state.selectedMovies.filter((mid) => mid !== id)
        : [...state.selectedMovies, id],
    })),
  clear: () => set({ selectedMovies: [] }),
}));

export default useSelectedMoviesStore;