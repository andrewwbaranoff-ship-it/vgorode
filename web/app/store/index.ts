import { create } from "zustand";

interface Store {
  config: string;
  setConfig: (cfg: string) => void;
}

export const useStore = create<Store>((set) => ({
  config: "",
  setConfig: (cfg) => set({ config: cfg }),
}));
