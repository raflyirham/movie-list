import { create } from "zustand";

const useModalStore = create((set) => ({
  currentModal: "",
  openModal: (modal) => set({ currentModal: modal }),
  closeModal: () => set({ currentModal: "" }),
}));

export default useModalStore;
